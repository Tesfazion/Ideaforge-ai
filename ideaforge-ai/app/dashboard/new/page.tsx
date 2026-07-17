"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

const SUGGESTED_TITLES = [
  "AI-Powered Personal Fitness Coach",
  "Micro-SaaS for Local Coffee Shops",
  "Sustainable Packaging Marketplace",
  "Remote Team Culture Platform",
  "AI Resume Optimizer for Gen Z",
  "Pet Care Subscription Box",
  "Mental Health Check-In App for Teams",
];

export default function NewIdeaPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [industry, setIndustry] = useState("");
  const [marketScope, setMarketScope] = useState("global");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (val.length >= 3) {
      setSuggestions(SUGGESTED_TITLES.filter((s) => s.toLowerCase().includes(val.toLowerCase()) || val.length < 5).slice(0, 3));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (user?.plan === "free") {
      const tokens = user.tokens ?? 0;
      if (tokens === 0) {
        setError("You have no tokens remaining. Please upgrade to Pro for unlimited validations.");
        return;
      }
      setWarning(`This validation will use 1 token. You have ${tokens} token${tokens !== 1 ? "s" : ""} remaining.`);
    }
    setLoading(true);
    setError("");
    setWarning("");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("targetAudience", targetAudience);
      formData.append("industry", industry);
      formData.append("marketScope", marketScope);
      if (file) formData.append("file", file);
      const { idea } = await api.createIdea(token, formData);
      router.push(`/dashboard/idea/${idea.id}`);
    } catch (err: unknown) {
      const error = err as { error?: string };
      setError(error.error || "Failed to submit idea");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Submit a New Idea</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Describe your business idea and our AI will analyze it for you</p>
      {user?.plan === "free" && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 mb-6 text-sm text-amber-800 dark:text-amber-300">
          <strong>Free Plan:</strong> You get 1 idea validation per month.{" "}
          <a href="/dashboard/upgrade" className="underline font-medium hover:text-amber-600 dark:hover:text-amber-200">Upgrade to Pro</a> for unlimited.
        </div>
      )}
      {warning && (
        <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 mb-6 text-sm text-blue-800 dark:text-blue-300">
          {warning}
        </div>
      )}
      <form onSubmit={handleSubmit} className="card-base rounded-2xl p-6 space-y-5">
        {error && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Idea Title *</label>
          <input type="text" required value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="e.g. AI-Powered Fitness Coach"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors placeholder:text-gray-400" />
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-gray-400">{title.length}/100</span>
            {title.length > 80 && <span className="text-[10px] text-amber-500">Getting long...</span>}
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 top-full mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
              {suggestions.map((s, i) => (
                <button key={i} type="button" onClick={() => { setTitle(s); setShowSuggestions(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Description *</label>
          <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your idea in detail..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors resize-none placeholder:text-gray-400" />
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-gray-400">{description.length}/500</span>
            {description.length < 20 && description.length > 0 && <span className="text-[10px] text-amber-500">Add more detail for better analysis</span>}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Target Audience</label>
            <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g. Fitness enthusiasts"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Industry</label>
            <select value={industry} onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option value="">Select industry</option>
              <option>Technology</option><option>Healthcare</option><option>Finance</option><option>E-commerce</option>
              <option>Education</option><option>Entertainment</option><option>Food & Beverage</option><option>Real Estate</option>
              <option>Travel</option><option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Market Scope</label>
            <select value={marketScope} onChange={(e) => setMarketScope(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors">
              <option value="global">Global SaaS</option>
              <option value="country">Country-Specific</option>
              <option value="local">Local Metro-Area</option>
              <option value="enterprise">Enterprise / B2B</option>
            </select>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">This calibrates TAM/SAM/SOM sizing in your report.</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Attachments (optional)</label>
          <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span className="text-sm text-gray-500 dark:text-gray-400">{file ? file.name : "Upload pitch deck, wireframes, etc."}</span>
            <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
        </div>
        <button type="submit" disabled={loading}
          className="w-full gradient-btn text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing Idea...</>
          ) : (
            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Validate with AI</>
          )}
        </button>
      </form>
    </div>
  );
}
