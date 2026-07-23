import OpenAI from "openai";

export interface AIConfig {
  provider: string;
  apiKey: string;
  model: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
}

export interface AIProvider {
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<string>;
}

interface ProviderConfig {
  label: string;
  baseURL?: string;
  models: string[];
  defaultModel: string;
  docsUrl: string;
  keyPrefix: string;
  adapter: "openai" | "anthropic" | "gemini";
}

export const PROVIDERS: Record<string, ProviderConfig> = {
  openai: {
    label: "OpenAI",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4.1", "gpt-4.1-mini", "o3-mini"],
    defaultModel: "gpt-4o",
    docsUrl: "https://platform.openai.com/api-keys",
    keyPrefix: "sk-",
    adapter: "openai",
  },
  anthropic: {
    label: "Anthropic (Claude)",
    baseURL: "https://api.anthropic.com/v1",
    models: ["claude-sonnet-4-20250514", "claude-opus-4-20250514", "claude-haiku-4-20250514"],
    defaultModel: "claude-sonnet-4-20250514",
    docsUrl: "https://console.anthropic.com/settings/keys",
    keyPrefix: "sk-ant-",
    adapter: "anthropic",
  },
  gemini: {
    label: "Google Gemini",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    models: ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.0-flash"],
    defaultModel: "gemini-2.5-pro",
    docsUrl: "https://aistudio.google.com/apikey",
    keyPrefix: "AIza",
    adapter: "openai",
  },
  groq: {
    label: "Groq (ultra-fast)",
    baseURL: "https://api.groq.com/openai/v1",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "deepseek-r1-distill-llama-70b"],
    defaultModel: "llama-3.3-70b-versatile",
    docsUrl: "https://console.groq.com/keys",
    keyPrefix: "gsk_",
    adapter: "openai",
  },
  openrouter: {
    label: "OpenRouter (all models)",
    baseURL: "https://openrouter.ai/api/v1",
    models: ["openai/gpt-4o", "anthropic/claude-sonnet-4", "google/gemini-2.5-pro", "deepseek/deepseek-r1"],
    defaultModel: "openai/gpt-4o",
    docsUrl: "https://openrouter.ai/keys",
    keyPrefix: "sk-or-",
    adapter: "openai",
  },
  deepseek: {
    label: "DeepSeek",
    baseURL: "https://api.deepseek.com/v1",
    models: ["deepseek-chat", "deepseek-reasoner"],
    defaultModel: "deepseek-chat",
    docsUrl: "https://platform.deepseek.com/api_keys",
    keyPrefix: "sk-",
    adapter: "openai",
  },
};

class OpenAICompatProvider implements AIProvider {
  private client: OpenAI;
  private model: string;

  constructor(config: AIConfig, providerCfg: ProviderConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: providerCfg.baseURL,
    });
    this.model = config.model || providerCfg.defaultModel;
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4000,
    });
    return response.choices[0]?.message?.content || "";
  }
}

class AnthropicProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor(config: AIConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || "claude-sonnet-4-20250514";
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<string> {
    const system = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
    const conv = messages.filter((m) => m.role !== "system");

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      signal: AbortSignal.timeout(60000),
      body: JSON.stringify({
        model: this.model,
        max_tokens: options?.maxTokens ?? 4000,
        temperature: options?.temperature ?? 0.7,
        system: system || undefined,
        messages: conv.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic API error ${res.status}: ${err}`);
    }

    const data = await res.json();
    const content = data.content;
    if (Array.isArray(content)) {
      return content.map((b: { text?: string }) => b.text || "").join("");
    }
    return "";
  }
}

export function getProvider(config: AIConfig): AIProvider {
  const providerCfg = PROVIDERS[config.provider];
  if (!providerCfg) {
    throw new Error(`Unknown provider: ${config.provider}`);
  }
  if (!config.apiKey) {
    throw new Error("API key is required");
  }
  if (providerCfg.adapter === "anthropic") {
    return new AnthropicProvider(config);
  }
  return new OpenAICompatProvider(config, providerCfg);
}

export function maskApiKey(key: string): string {
  if (!key || key.length < 8) return "••••";
  return `${key.slice(0, 4)}••••${key.slice(-4)}`;
}
