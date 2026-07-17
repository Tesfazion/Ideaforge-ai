import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { validateIdeaStream, generateIdeas, generatePivotSuggestions, pivotChat } from "../services/ai";

const router = Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../uploads"),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx", ".txt", ".md", ".png", ".jpg", ".jpeg"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("File type not allowed"));
  },
});

router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res: Response) => {
  const ideas = await prisma.idea.findMany({
    where: { userId: req.userId! },
    include: { report: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ ideas });
});

router.get("/:id", async (req: AuthRequest, res: Response) => {
  const ideaId = req.params.id as string;
  const idea = await prisma.idea.findFirst({
    where: { id: ideaId, userId: req.userId! },
    include: { report: true },
  });
  if (!idea) { res.status(404).json({ error: "Idea not found" }); return; }
  res.json({ idea });
});

router.post("/", upload.single("file"), async (req: AuthRequest, res: Response) => {
  const { title, description, targetAudience, industry, marketScope } = req.body;
  if (!title || !description) {
    res.status(400).json({ error: "Title and description are required" });
    return;
  }

  const idea = await prisma.idea.create({
    data: {
      title, description,
      targetAudience: targetAudience || "",
      industry: industry || "",
      marketScope: marketScope || "global",
      attachments: req.file ? req.file.filename : "",
      userId: req.userId!,
    },
  });

  res.status(201).json({ idea: { ...idea, status: "processing" } });
});

router.post("/:id/validate-stream", async (req: AuthRequest, res: Response) => {
  const ideaId = req.params.id as string;
  const idea = await prisma.idea.findFirst({
    where: { id: ideaId, userId: req.userId! },
  });
  if (!idea) { res.status(404).json({ error: "Idea not found" }); return; }
  if (idea.status === "validated") {
    res.status(400).json({ error: "Idea already validated" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  if (!user) { res.status(404).json({ error: "User not found" }); return; }

  if (user.plan !== "pro") {
    if ((user as any).tokens < 1) {
      res.status(403).json({ error: "Insufficient tokens. Upgrade to Pro for unlimited validations." });
      return;
    }
    await prisma.user.update({ where: { id: user.id }, data: { tokens: { decrement: 1 } } as any });
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const sendEvent = (data: object) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const result = await validateIdeaStream(
      {
        title: idea.title,
        description: idea.description,
        targetAudience: idea.targetAudience || undefined,
        industry: idea.industry || undefined,
        marketScope: idea.marketScope || undefined,
      },
      (progressEvent) => {
        sendEvent({ type: "progress", ...progressEvent });
      }
    );

    await prisma.report.create({
      data: {
        viabilityScore: result.viabilityScore,
        marketScore: result.marketScore,
        competitorScore: result.competitorScore,
        monetizationScore: result.monetizationScore,
        riskScore: result.riskScore,
        marketAnalysis: result.marketAnalysis,
        competitorOverview: result.competitorOverview,
        monetizationModels: result.monetizationModels,
        riskAssessment: result.riskAssessment,
        nextSteps: result.nextSteps,
        sources: JSON.stringify(result.sources),
        valueHypothesis: result.valueHypothesis,
        riskiestAssumption: result.riskiestAssumption,
        pivotSuggestions: JSON.stringify(result.pivotSuggestions),
        usedFallback: result.usedFallback,
        problemSeverity: result.problemSeverity,
        marketUrgency: result.marketUrgency,
        easeOfReplica: result.easeOfReplica,
        founderIdeaFit: result.founderIdeaFit,
        executionComplexity: result.executionComplexity,
        nineDimensions: JSON.stringify(result.nineDimensions),
        gtmExperiments: JSON.stringify(result.gtmExperiments),
        skepticAnalysis: JSON.stringify(result.skepticAnalysis),
        marketSizing: JSON.stringify(result.marketSizing),
        actionPlan: JSON.stringify(result.actionPlan),
        ideaId: idea.id,
      },
    });
    await prisma.idea.update({ where: { id: idea.id }, data: { status: "validated" } });

    sendEvent({ type: "complete", report: result });
  } catch (err: unknown) {
    console.error(`Streaming validation failed for idea ${ideaId}:`, err);
    if (user.plan !== "pro") {
      await prisma.user.update({ where: { id: user.id }, data: { tokens: { increment: 1 } } as any }).catch(() => {});
    }
    await prisma.idea.update({ where: { id: idea.id }, data: { status: "failed" } }).catch(() => {});
    sendEvent({ type: "error", message: "AI validation failed" });
  }

  res.end();
});

router.post("/:id/retry", async (req: AuthRequest, res: Response) => {
  const ideaId = req.params.id as string;
  const idea = await prisma.idea.findFirst({
    where: { id: ideaId, userId: req.userId! },
  });
  if (!idea) { res.status(404).json({ error: "Idea not found" }); return; }
  if (idea.status !== "failed") {
    res.status(400).json({ error: "Only failed ideas can be retried" });
    return;
  }

  await prisma.idea.update({ where: { id: idea.id }, data: { status: "pending" } });
  await prisma.report.deleteMany({ where: { ideaId: idea.id } });

  res.json({ message: "Idea reset for retry", ideaId: idea.id });
});

router.post("/:id/pivot-suggestions", async (req: AuthRequest, res: Response) => {
  const ideaId = req.params.id as string;
  const idea = await prisma.idea.findFirst({
    where: { id: ideaId, userId: req.userId! },
    include: { report: true },
  });
  if (!idea) { res.status(404).json({ error: "Idea not found" }); return; }
  if (!idea.report) { res.status(400).json({ error: "Idea must be validated first" }); return; }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const sendEvent = (data: object) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const pivots = await generatePivotSuggestions(
      {
        title: idea.title,
        description: idea.description,
        targetAudience: idea.targetAudience || undefined,
        industry: idea.industry || undefined,
      },
      {
        viabilityScore: idea.report.viabilityScore,
        riskAssessment: idea.report.riskAssessment,
        marketAnalysis: idea.report.marketAnalysis,
      },
      (progressEvent) => {
        sendEvent({ type: "progress", ...progressEvent });
      }
    );

    await prisma.report.update({
      where: { ideaId: idea.id },
      data: { pivotSuggestions: JSON.stringify(pivots) },
    });

    sendEvent({ type: "complete", pivots });
  } catch (err: unknown) {
    console.error("Pivot suggestions failed:", err);
    sendEvent({ type: "error", message: "Failed to generate pivot suggestions" });
  }

  res.end();
});

router.post("/:id/pivot-chat", async (req: AuthRequest, res: Response) => {
  const ideaId = req.params.id as string;
  const { message, history } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  const idea = await prisma.idea.findFirst({
    where: { id: ideaId, userId: req.userId! },
    include: { report: true },
  });
  if (!idea) { res.status(404).json({ error: "Idea not found" }); return; }
  if (!idea.report) { res.status(400).json({ error: "Idea must be validated first" }); return; }

  try {
    const reply = await pivotChat(
      message,
      {
        idea: { title: idea.title, description: idea.description },
        report: {
          viabilityScore: idea.report.viabilityScore,
          marketAnalysis: idea.report.marketAnalysis,
          riskAssessment: idea.report.riskAssessment,
        },
      },
      Array.isArray(history) ? history : []
    );

    res.json({ reply });
  } catch (err: unknown) {
    console.error("Pivot chat failed:", err);
    res.status(500).json({ error: "Pivot chat failed" });
  }
});

router.post("/generate-ideas", async (req: AuthRequest, res: Response) => {
  const { prompt, industry } = req.body;
  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
    res.status(400).json({ error: "Please provide a description of what you're interested in (min 5 characters)" });
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const sendEvent = (data: object) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

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

  res.end();
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  const ideaId = req.params.id as string;
  const idea = await prisma.idea.findFirst({ where: { id: ideaId, userId: req.userId! } });
  if (!idea) { res.status(404).json({ error: "Idea not found" }); return; }
  await prisma.idea.delete({ where: { id: ideaId } });
  res.json({ message: "Idea deleted" });
});

export default router;
