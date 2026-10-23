"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { api, Announcement } from "@/lib/api";

const TAGS: { value: Announcement["tag"]; label: string; className: string }[] = [
  { value: "release", label: "Release", className: "bg-sky-500/15 text-sky-300 border-sky-500/20" },
  { value: "news", label: "News", className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20" },
  { value: "update", label: "Update", className: "bg-amber-500/15 text-amber-300 border-amber-500/20" },
  { value: "fix", label: "Fix", className: "bg-rose-500/15 text-rose-300 border-rose-500/20" },
];

const emptyForm = { title: "", body: "", version: "", tag: "news" as Announcement["tag"], pinned: false, published: true };

export default function NewsPage() {
  const { user, token } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    const data = await api.getAnnouncements(token, true);
    setAnnouncements(data.announcements);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let active = true;
    api.getAnnouncements(token, true)
      .then((data) => {
        if (active) setAnnouncements(data.announcements);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Failed to load updates");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await api.createAnnouncement(token, {
        title: form.title.trim(),
        body: form.body.trim(),
        version: form.version.trim(),
        tag: form.tag,
        pinned: form.pinned,
        published: form.published,
      });
      setForm(emptyForm);
      setSuccess("Update posted. It is now visible in the changelog and dashboard.");
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to post update");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!token) return;
    setError("");
    try {
      await api.deleteAnnouncement(token, id);
      setAnnouncements((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete update");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">Platform updates</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">What&apos;s new</h1>
          <p className="mt-1 text-sm text-slate-400">
            Post release notes and news for your users. Published items appear in the dashboard and on the{" "}
            <Link href="/changelog" className="text-sky-400 hover:text-sky-300">public changelog</Link>.
          </p>
        </div>
        <Link href="/changelog" className="shrink-0 rounded-xl border border-white/10 px-4 py-2.5 text-center text-sm font-semibold text-slate-200 hover:bg-white/5">
          View changelog
        </Link>
      </div>

      <form onSubmit={submit} className="card-premium rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-900">Post an update</h2>
          <span className="text-[10px] text-slate-500">Signed in as {user?.email}</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              maxLength={140}
              placeholder="What changed?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.04] text-sm text-slate-900 placeholder:text-slate-600 focus:outline-none focus:border-sky-500/40"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Version</label>
            <input
              value={form.version}
              onChange={(e) => setForm({ ...form, version: e.target.value })}
              maxLength={32}
              placeholder="1.2.0"
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.04] text-sm text-slate-900 placeholder:text-slate-600 focus:outline-none focus:border-sky-500/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Details</label>
          <textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            required
            rows={4}
            maxLength={4000}
            placeholder="Describe the new features, fixes, or news..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.04] text-sm text-slate-900 placeholder:text-slate-600 focus:outline-none focus:border-sky-500/40 resize-y"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={form.tag}
            onChange={(e) => setForm({ ...form, tag: e.target.value as Announcement["tag"] })}
            className="px-3 py-2 rounded-xl border border-white/[0.06] bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-sky-500/40"
          >
            {TAGS.map((tag) => (
              <option key={tag.value} value={tag.value}>{tag.label}</option>
            ))}
          </select>
          <label className="inline-flex items-center gap-2 text-xs text-slate-400">
            <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} className="accent-sky-500" />
            Pin to top
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-slate-400">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-sky-500" />
            Publish now
          </label>
          <button
            type="submit"
            disabled={saving}
            className="ml-auto rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-sky-400 disabled:opacity-60"
          >
            {saving ? "Posting..." : "Post update"}
          </button>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}
        {success && <p className="text-xs text-emerald-400">{success}</p>}
      </form>

      <div className="card-premium rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900">All updates</h2>
          <span className="text-[10px] text-slate-500">{announcements.length} total</span>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">No updates yet. Post your first one above.</p>
        ) : (
          <div className="space-y-2">
            {announcements.map((item) => {
              const tag = TAGS.find((value) => value.value === item.tag) ?? TAGS[1];
              return (
                <div key={item.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tag.className}`}>{tag.label}</span>
                    {item.version && <span className="text-xs font-semibold text-sky-300">v{item.version}</span>}
                    {item.pinned && <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-slate-300">Pinned</span>}
                    {!item.published && <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-slate-400">Draft</span>}
                    <span className="text-[10px] text-slate-500">{new Date(item.createdAt).toLocaleString()}</span>
                    <button onClick={() => remove(item.id)} className="ml-auto text-[11px] font-medium text-slate-500 hover:text-red-400 transition-colors">
                      Delete
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400 whitespace-pre-line">{item.body}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
