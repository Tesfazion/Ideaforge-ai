"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface ProviderInfo {
  id: string;
  label: string;
  models: string[];
  defaultModel: string;
  docsUrl: string;
  keyPrefix: string;
}

export default function SettingsPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [maskedKey, setMaskedKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && token) {
      fetch("/api/settings/ai-config", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.providers) {
            setProviders(data.providers);
            setSelectedProvider(data.provider || data.providers[0].id);
            setHasKey(data.hasKey);
            setMaskedKey(data.maskedKey);
            const prov = data.providers.find((p: ProviderInfo) => p.id === (data.provider || data.providers[0].id));
            setSelectedModel(data.model || prov?.defaultModel || "");
          }
        })
        .catch(() => {});
    }
  }, [token, loading]);

  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
    const prov = providers.find((p) => p.id === providerId);
    if (prov) setSelectedModel(prov.defaultModel);
  };

  const handleSave = async () => {
    if (!token || !apiKey || !selectedProvider || !selectedModel) return;
    setSaving(true);
    setError("");
    setTestResult(null);
    try {
      const res = await fetch("/api/settings/ai-config", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ provider: selectedProvider, apiKey, model: selectedModel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHasKey(true);
      setMaskedKey(data.maskedKey);
      setApiKey("");
      setTestResult({ ok: true, message: "API key saved successfully." });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!token) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Test idea", description: "A test business idea for connectivity verification." }),
      });
      const data = await res.json();
      if (res.ok) {
        setTestResult({ ok: true, message: "AI connection is working." });
      } else {
        setTestResult({ ok: false, message: data.error || "Connection test failed." });
      }
    } catch {
      setTestResult({ ok: false, message: "Connection test failed." });
    } finally {
      setTesting(false);
    }
  };

  const handleRemove = async () => {
    if (!token || !confirm("Remove your API key? You'll use the platform's default AI model.")) return;
    try {
      await fetch("/api/settings/ai-config", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setHasKey(false);
      setMaskedKey("");
      setApiKey("");
      setTestResult({ ok: true, message: "API key removed. Using platform default." });
    } catch {
      setError("Failed to remove key");
    }
  };

  if (loading || !user) return null;

  const currentProvider = providers.find((p) => p.id === selectedProvider);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Bring your own API key to use Claude, GPT-4o, Gemini, Groq, and more.</p>
      </div>

      {hasKey && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-400">Custom AI key active</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {providers.find((p) => p.id === selectedProvider)?.label || "Custom"} · {selectedModel} · {maskedKey}
            </p>
          </div>
          <button onClick={handleRemove} className="text-xs text-red-400 hover:text-red-300 transition-colors">
            Remove
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">{error}</div>
      )}

      <AnimatePresence>
        {testResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl p-4 text-sm border ${
              testResult.ok
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {testResult.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">AI Provider</label>
          <select
            value={selectedProvider}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#0c1222]">
                {p.label}
              </option>
            ))}
          </select>
          {currentProvider && (
            <p className="text-xs text-slate-500 mt-2">
              Get your API key:{" "}
              <a href={currentProvider.docsUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                {currentProvider.docsUrl}
              </a>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
          >
            {currentProvider?.models.map((m) => (
              <option key={m} value={m} className="bg-[#0c1222]">
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            API Key {hasKey && <span className="text-xs text-slate-500">(enter new key to replace)</span>}
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={hasKey ? `Current: ${maskedKey}` : currentProvider ? `Paste your key (${currentProvider.keyPrefix}...)` : "Paste your API key"}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors font-mono"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {showKey ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A9.969 9.969 0 0112 4.5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={!apiKey || saving}
            className="px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Key"
            )}
          </button>
          <button
            onClick={handleTest}
            disabled={testing || !hasKey}
            className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-slate-300 text-sm font-semibold hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {testing ? "Testing..." : "Test Connection"}
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-indigo-500/5 border border-indigo-500/10 p-5">
        <h3 className="text-sm font-semibold text-indigo-300 mb-2">How it works</h3>
        <ul className="space-y-2 text-xs text-slate-400">
          <li className="flex gap-2"><span className="text-indigo-400">1.</span> Choose your preferred AI provider and model.</li>
          <li className="flex gap-2"><span className="text-indigo-400">2.</span> Paste your API key — it&apos;s encrypted at rest with AES-256.</li>
          <li className="flex gap-2"><span className="text-indigo-400">3.</span> All your validations use YOUR key and YOUR model — no rate limits from us.</li>
          <li className="flex gap-2"><span className="text-indigo-400">4.</span> Remove your key anytime to revert to the platform default model.</li>
        </ul>
      </div>
    </div>
  );
}
