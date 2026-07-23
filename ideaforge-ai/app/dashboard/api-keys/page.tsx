"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface ApiKey {
  id: string;
  key: string;
  name: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export default function ApiKeysPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyData, setNewKeyData] = useState<ApiKey | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCodeExamples, setShowCodeExamples] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && user && user.plan !== "enterprise") {
      router.push("/dashboard/upgrade");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && user && user.plan === "enterprise") {
      const loadKeys = async () => {
        setLoadingKeys(true);
        try {
          const res = await fetch("/api/enterprise/keys", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          setKeys(data.keys);
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : "Failed to load keys");
        } finally {
          setLoadingKeys(false);
        }
      };
      loadKeys();
    }
  }, [token, user, loading]);

  const generateKey = async () => {
    if (!token) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/enterprise/keys", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newKeyName || "API Key" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNewKeyData(data);
      setNewKeyName("");
      // Refresh keys list
      setLoadingKeys(true);
      try {
        const refreshRes = await fetch("/api/enterprise/keys", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const refreshData = await refreshRes.json();
        if (refreshRes.ok) setKeys(refreshData.keys);
      } catch { /* ignore */ } finally {
        setLoadingKeys(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate key");
    } finally {
      setGenerating(false);
    }
  };

  const revokeKey = async (keyId: string) => {
    if (!token || !confirm("Are you sure? This action cannot be undone.")) return;
    setError(null);
    try {
      const res = await fetch("/api/enterprise/keys", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setKeys((prev) => prev.filter((k) => k.id !== keyId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to revoke key");
    }
  };

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading || !user || user.plan !== "enterprise") return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white">API Keys</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage API keys for programmatic access to IdeaForge AI validations.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          {error}
          <button onClick={() => setError(null)} className="ml-auto">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {newKeyData && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-5"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-400">Save your API key</h3>
              <p className="text-xs text-slate-400 mt-1">
                Copy this key now. It will not be shown again for security reasons.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <code className="flex-1 text-xs font-mono text-white bg-black/30 rounded-lg px-4 py-3 break-all select-all border border-white/[0.06]">
              {newKeyData.key}
            </code>
            <button
              onClick={() => copyKey(newKeyData.key, newKeyData.id)}
              className="shrink-0 p-3 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
            >
              {copiedId === newKeyData.id ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
          <button
            onClick={() => setNewKeyData(null)}
            className="mt-3 text-xs text-slate-500 hover:text-slate-400 transition-colors"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Generate New Key</h3>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name (e.g. production, staging)"
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
          <button
            onClick={generateKey}
            disabled={generating}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {generating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white">Active Keys</h3>
        </div>
        {loadingKeys ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 mt-3">Loading keys...</p>
          </div>
        ) : keys.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>
            <p className="text-sm text-slate-400">No API keys yet</p>
            <p className="text-xs text-slate-500 mt-1">Generate your first key above to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {keys.map((apiKey) => (
              <div key={apiKey.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{apiKey.name}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{apiKey.key}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-slate-500">
                    Created {new Date(apiKey.createdAt).toLocaleDateString()}
                  </p>
                  {apiKey.lastUsedAt && (
                    <p className="text-[10px] text-slate-500">
                      Last used {new Date(apiKey.lastUsedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => revokeKey(apiKey.id)}
                  className="shrink-0 p-2 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Revoke key"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        <button
          onClick={() => setShowCodeExamples(!showCodeExamples)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">Usage & Code Examples</span>
          </div>
          <svg
            className={`w-4 h-4 text-slate-500 transition-transform ${showCodeExamples ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <AnimatePresence>
          {showCodeExamples && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Endpoint</h4>
                  <div className="bg-black/30 rounded-xl p-4 border border-white/[0.06]">
                    <code className="text-xs text-emerald-400 font-mono">POST /api/v1/validate</code>
                    <p className="text-xs text-slate-500 mt-2">
                      Rate limit: 20 requests per hour per API key.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Request Body</h4>
                  <div className="bg-black/30 rounded-xl p-4 border border-white/[0.06] overflow-x-auto">
                    <pre className="text-xs text-slate-300 font-mono">{`{
  "title": "Your business idea",
  "description": "A detailed description of your idea",
  "targetAudience": "Optional: who this serves",
  "industry": "Optional: relevant industry",
  "marketScope": "Optional: global, regional, or local"
}`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">cURL</h4>
                  <div className="bg-black/30 rounded-xl p-4 border border-white/[0.06] overflow-x-auto">
                    <pre className="text-xs text-slate-300 font-mono">{`curl -X POST https://ideaforge.ai/api/v1/validate \\
  -H "X-API-Key: if_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "AI-Powered Fitness Coach",
    "description": "A mobile app that uses computer vision to analyze workout form in real-time and provides personalized corrections. Targets gym beginners who feel intimidated by equipment.",
    "targetAudience": "Fitness beginners aged 20-35",
    "industry": "Health & Fitness",
    "marketScope": "global"
  }'`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Python</h4>
                  <div className="bg-black/30 rounded-xl p-4 border border-white/[0.06] overflow-x-auto">
                    <pre className="text-xs text-slate-300 font-mono">{`import requests

API_KEY = "if_your_api_key_here"

response = requests.post(
    "https://ideaforge.ai/api/v1/validate",
    headers={
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
    },
    json={
        "title": "AI-Powered Fitness Coach",
        "description": "A mobile app that uses computer vision to analyze workout form.",
        "targetAudience": "Fitness beginners aged 20-35",
        "industry": "Health & Fitness",
        "marketScope": "global",
    },
)

data = response.json()
print(f"Viability Score: {data['report']['viabilityScore']}")
print(f"Risk Score: {data['report']['riskScore']}")
print(f"Public URL: {data['publicUrl']}")`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">JavaScript / Node.js</h4>
                  <div className="bg-black/30 rounded-xl p-4 border border-white/[0.06] overflow-x-auto">
                    <pre className="text-xs text-slate-300 font-mono">{`const API_KEY = "if_your_api_key_here";

const response = await fetch("https://ideaforge.ai/api/v1/validate", {
  method: "POST",
  headers: {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "AI-Powered Fitness Coach",
    description: "A mobile app that uses computer vision to analyze workout form.",
    targetAudience: "Fitness beginners aged 20-35",
    industry: "Health & Fitness",
    marketScope: "global",
  }),
});

const data = await response.json();
console.log("Viability Score:", data.report.viabilityScore);
console.log("Public URL:", data.publicUrl);`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Response</h4>
                  <div className="bg-black/30 rounded-xl p-4 border border-white/[0.06] overflow-x-auto">
                    <pre className="text-xs text-slate-300 font-mono">{`{
  "id": "clx1234567890",
  "status": "validated",
  "report": {
    "viabilityScore": 72,
    "marketScore": 68,
    "competitorScore": 65,
    "monetizationScore": 70,
    "riskScore": 45,
    "confidence": 85,
    "marketAnalysis": "...",
    "competitorOverview": "...",
    "monetizationModels": "...",
    "riskAssessment": "...",
    "nextSteps": "...",
    "sources": [...],
    "pivotSuggestions": [...],
    "nineDimensions": [...]
  },
  "publicUrl": "/r/ai-powered-fitness-coach-abc123"
}`}</pre>
                  </div>
                </div>

                <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-4">
                  <h4 className="text-xs font-semibold text-indigo-400 mb-2">Rate Limit Headers</h4>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400">
                      <code className="text-indigo-300 font-mono">X-RateLimit-Limit</code> — Maximum requests per hour (20)
                    </p>
                    <p className="text-xs text-slate-400">
                      <code className="text-indigo-300 font-mono">X-RateLimit-Remaining</code> — Remaining requests in current window
                    </p>
                    <p className="text-xs text-slate-400">
                      <code className="text-indigo-300 font-mono">X-RateLimit-Reset</code> — Unix timestamp when the window resets
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
