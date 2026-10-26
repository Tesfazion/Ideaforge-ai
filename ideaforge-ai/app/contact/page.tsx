"use client";
import { useState } from "react";
import PageShell, { PageHeader } from "@/components/PageShell";
import { SUNSHINE } from "@/lib/site";

export default function Contact() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, teamSize, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Submission failed" }));
        throw new Error(data.error || "Submission failed");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell width="wide">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <PageHeader
            eyebrow="Contact"
            title="Talk to our team"
            description="Questions about plans, the API, or running IdeaForge across a portfolio of ideas — we're happy to help."
          />

          <dl className="mt-8 space-y-5">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${SUNSHINE.email}`} className="text-sm font-medium text-link hover:underline">
                  {SUNSHINE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted">Phone</dt>
              <dd className="mt-1">
                <a href={`tel:${SUNSHINE.phone}`} className="text-sm font-medium text-link hover:underline">
                  {SUNSHINE.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted">Office</dt>
              <dd className="mt-1 text-sm text-copy">{SUNSHINE.location}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted">Response time</dt>
              <dd className="mt-1 text-sm text-copy">Within one business day</dd>
            </div>
          </dl>
        </div>

        <div className="card p-6 sm:p-8">
          {submitted ? (
            <div className="py-10 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-soft text-success-ink">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <h2 className="mt-4 text-lg font-bold text-ink">Message received</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-copy">
                Thanks for reaching out. We&apos;ll get back to you at {email} within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="field">
                  <label htmlFor="contact-name" className="label">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-email" className="label">Work email</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="you@company.com"
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-company" className="label">
                    Company <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="input"
                    placeholder="Acme Inc."
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-team" className="label">
                    Team size <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <select
                    id="contact-team"
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="select"
                  >
                    <option value="">Select…</option>
                    <option value="1">Just me</option>
                    <option value="2-10">2–10</option>
                    <option value="11-50">11–50</option>
                    <option value="51+">51+</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="contact-message" className="label">How can we help?</label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="textarea resize-none"
                  placeholder="Tell us about your team and what you're trying to validate…"
                />
              </div>

              {error && (
                <p role="alert" className="rounded-lg border px-3.5 py-2.5 text-sm"
                   style={{
                     borderColor: "var(--danger-line)",
                     backgroundColor: "var(--danger-soft)",
                     color: "var(--danger-ink)",
                   }}>
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading} className="btn btn-primary btn-block">
                {loading ? "Sending…" : "Send message"}
              </button>

              <p className="text-center text-[11px] leading-relaxed text-muted">
                We use your details only to reply to this enquiry.
              </p>
            </form>
          )}
        </div>
      </div>
    </PageShell>
  );
}
