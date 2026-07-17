import { NextRequest } from "next/server";
import { getUserId } from "@/lib/jwt";
import { generateIdeas } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const rl = checkRateLimit(`generate:${userId}:${ip}`, { windowMs: 3600000, maxRequests: 10 });
  if (!rl.allowed) {
    return Response.json({ error: `Rate limit exceeded. Try again in ${rl.resetIn}s` }, { status: 429 });
  }

  let prompt: string;
  let industry: string | undefined;
  try {
    const body = await request.json();
    prompt = body.prompt;
    industry = body.industry;
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
    return Response.json({ error: "Please provide a description of what you're interested in (min 5 characters)" }, { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      function sendEvent(data: object) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }

      try {
        const ideas = await generateIdeas(
          prompt.trim(),
          industry || undefined,
          (progressEvent) => {
            sendEvent({ type: "progress", ...progressEvent });
          }
        );

        sendEvent({ type: "complete", ideas });
      } catch (err: unknown) {
        console.error("Idea generation failed:", err);
        sendEvent({ type: "error", message: "AI idea generation failed" });
      }

      controller.close();
    },
    cancel() {
      // Client disconnected
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
