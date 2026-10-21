const API_URL = "";

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;
  const headers: Record<string, string> = {};
  if (!(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: { ...headers, ...(fetchOptions.headers as Record<string, string>) },
  });
  const data = (await res.json()) as { error?: string } & Record<string, unknown>;
  if (!res.ok) {
    const err = new Error(data.error || `Request failed with status ${res.status}`) as Error & {
      status?: number;
    };
    err.status = res.status;
    Object.assign(err, data);
    throw err;
  }
  return data as T;
}

export interface SSEProgressEvent {
  type: "progress" | "complete" | "error";
  step?: string;
  label?: string;
  detail?: string;
  progress?: number;
  message?: string;
}

export interface SourceLink {
  title: string;
  url: string;
  context: string;
}

export interface PivotSuggestion {
  direction: string;
  description: string;
  targetAudience: string;
  viabilityEstimate: number;
  keyPivot: string;
}

export function streamValidate(token: string, ideaId: string, onEvent: (event: SSEProgressEvent) => void): () => void {
  const controller = new AbortController();

  fetch(`/api/ideas/${ideaId}/validate-stream`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    signal: controller.signal,
  }).then(async (res) => {
    if (!res.ok) {
      onEvent({ type: "error", message: "Failed to start validation" });
      return;
    }
    const reader = res.body?.getReader();
    if (!reader) return;
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            onEvent(JSON.parse(line.slice(6)));
          } catch {}
        }
      }
    }
  }).catch(() => {
    onEvent({ type: "error", message: "Connection lost" });
  });

  return () => controller.abort();
}

export function streamPivotSuggestions(
  token: string,
  ideaId: string,
  onEvent: (event: SSEProgressEvent & { pivots?: PivotSuggestion[] }) => void
): () => void {
  const controller = new AbortController();

  fetch(`/api/ideas/${ideaId}/pivot-suggestions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    signal: controller.signal,
  }).then(async (res) => {
    if (!res.ok) {
      onEvent({ type: "error", message: "Failed to generate pivots" });
      return;
    }
    const reader = res.body?.getReader();
    if (!reader) return;
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            onEvent(JSON.parse(line.slice(6)));
          } catch {}
        }
      }
    }
  }).catch(() => {
    onEvent({ type: "error", message: "Connection lost" });
  });

  return () => controller.abort();
}

export function streamGenerateIdeas(
  token: string,
  prompt: string,
  industry: string,
  onEvent: (event: SSEProgressEvent & { ideas?: GeneratedIdea[] }) => void
): () => void {
  const controller = new AbortController();

  fetch(`/api/ideas/generate-ideas`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ prompt, industry }),
    signal: controller.signal,
  }).then(async (res) => {
    if (!res.ok) {
      onEvent({ type: "error", message: "Failed to start generation" });
      return;
    }
    const reader = res.body?.getReader();
    if (!reader) return;
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            onEvent(JSON.parse(line.slice(6)));
          } catch {}
        }
      }
    }
  }).catch(() => {
    onEvent({ type: "error", message: "Connection lost" });
  });

  return () => controller.abort();
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
  plan: string;
  amount: number;
  currency: string;
}

export const api = {
  checkEmail: (email: string) =>
    request<{ valid: boolean; deliverable: boolean; is_disposable: boolean; suggestion: string | null; message: string | null }>(
      "/api/auth/check-email", { method: "POST", body: JSON.stringify({ email }) }
    ),
  register: (body: { name: string; email: string; password: string }) =>
    request<{ token: string; user: User }>("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: User }>("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  getMe: (token: string) =>
    request<{ user: User }>("/api/auth/me", { token }),
  upgrade: (token: string) =>
    request<{ user: User }>("/api/auth/upgrade", { method: "POST", token }),
  createCheckoutSession: (token: string, body: { plan: "pro" | "enterprise"; priceId?: string }) =>
    request<CheckoutSession>("/api/auth/create-checkout-session", { method: "POST", body: JSON.stringify(body), token }),
  getIdeas: (token: string) =>
    request<{ ideas: Idea[] }>("/api/ideas", { token }),
  getIdea: (token: string, id: string) =>
    request<{ idea: IdeaWithReport }>(`/api/ideas/${id}`, { token }),
  createIdea: (token: string, formData: FormData) =>
    request<{ idea: Idea }>("/api/ideas", { method: "POST", body: formData, token }),
  deleteIdea: (token: string, id: string) =>
    request<{ message: string }>(`/api/ideas/${id}`, { method: "DELETE", token }),
  retryIdea: (token: string, id: string) =>
    request<{ message: string; ideaId: string }>(`/api/ideas/${id}/retry`, { method: "POST", token }),
  pivotChat: (token: string, ideaId: string, message: string, history: { role: string; content: string }[]) =>
    request<{ reply: string }>(`/api/ideas/${ideaId}/pivot-chat`, { method: "POST", body: JSON.stringify({ message, history }), token }),
  getReport: (token: string, ideaId: string) =>
    request<{ report: Report; idea: { id: string; title: string; status: string } }>(`/api/reports/${ideaId}`, { token }),
  emailReport: (token: string, ideaId: string, format: "csv" | "doc") =>
    request<{ message: string }>(`/api/reports/${ideaId}/email`, { method: "POST", body: JSON.stringify({ format }), token }),
};

export interface User {
  id: string; name: string; email: string; plan: string; verified: boolean; createdAt?: string; tokens: number; monthlyTokens: number; onboardingComplete?: boolean;
}

export interface Idea {
  id: string; title: string; description: string; targetAudience: string; industry: string;
  status: string; attachments?: string; report: Report | null; createdAt: string; marketScope: string;
}

export interface IdeaWithReport extends Idea {
  report: Report | null;
}

export interface Report {
  id: string; viabilityScore: number; marketScore: number; competitorScore: number;
  monetizationScore: number; riskScore: number; marketAnalysis: string; competitorOverview: string;
  monetizationModels: string; riskAssessment: string; nextSteps: string; createdAt: string;
  sources: string; valueHypothesis: string; riskiestAssumption: string;
  pivotSuggestions: string; usedFallback: boolean;
  problemSeverity: number; marketUrgency: number; easeOfReplica: number;
  founderIdeaFit: number; executionComplexity: number;
  nineDimensions: string; gtmExperiments: string;
  skepticAnalysis: string; marketSizing: string; actionPlan: string;
  swotAnalysis: string; competitiveLandscape: string; marketTiming: string;
}

export interface GeneratedIdea {
  title: string;
  description: string;
  targetAudience: string;
  industry: string;
  viabilityScore: number;
  marketOpportunity: string;
  monetizationHint: string;
  whyItWorks: string;
}

export interface NineDimension {
  name: string;
  shortName: string;
  score: number;
  maxScore: number;
  label: string;
  description: string;
  icon: string;
}

export interface GTMExperiment {
  title: string;
  description: string;
  cost: string;
  timeframe: string;
  metric: string;
}

export interface GTMChecklist {
  task: string;
  why: string;
  deadline: string;
}

export interface GTMExperiments {
  specificICP: string;
  landingPageHook: string;
  landingPageSubheadline: string;
  minimumSuccessMetric: string;
  successTarget: string;
  experiments: GTMExperiment[];
  checklist: GTMChecklist[];
}

export interface MarketSizing {
  tam: string;
  sam: string;
  som: string;
  tamValue: string;
  samValue: string;
  somValue: string;
  reasoning: string;
}

export interface ActionPlanDay {
  day: number;
  theme: string;
  tasks: string[];
  template?: string;
  expectedOutcome: string;
}

export interface SkepticAnalysis {
  overallVerdict: string;
  executionRisks: string[];
  regulatoryRisks: string[];
  timingRisks: string[];
  structuralFlaws: string[];
  brutalScore: number;
  keyChallenge: string;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface CompetitiveLandscape {
  directCompetitors: { name: string; description: string; strength: string; weakness: string }[];
  indirectCompetitors: { name: string; description: string }[];
  marketGaps: string[];
  differentiationStrategy: string;
}

export interface MarketTiming {
  score: number;
  trend: "rising" | "stable" | "declining";
  reasoning: string;
  windowOfOpportunity: string;
  signals: { label: string; direction: "up" | "down" | "neutral" }[];
}
