"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/AuthShell";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { error?: string; message?: string };
      setError(error.error || error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const passwordTooShort = password.length > 0 && password.length < 6;

  return (
    <AuthShell
      title="Create your IdeaForge account"
      subtitle="Start free with five validations a month. No credit card required."
      footer={
        <p className="text-center text-sm text-copy">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-ink hover:text-brand">
            Sign in
          </Link>
        </p>
      }
    >
      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm"
          style={{
            borderColor: "var(--danger-line)",
            backgroundColor: "var(--danger-soft)",
            color: "var(--danger-ink)",
          }}
        >
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5L13.71 3.86a1 1 0 00-1.72 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="field">
          <label htmlFor="name" className="label">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Jane Doe"
          />
        </div>

        <div className="field">
          <label htmlFor="email" className="label">Work email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@company.com"
          />
        </div>

        <div className="field">
          <label htmlFor="password" className="label">Password</label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pr-11"
              placeholder="At least 6 characters"
              aria-invalid={passwordTooShort ? "true" : undefined}
              aria-describedby="password-help"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted transition-colors hover:bg-surface-alt hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.292-4.292M3.042 20.063A9.965 9.965 0 0112 19c4.478 0 8.268-2.943 9.543-7a9.97 9.97 0 01-1.563-3.029M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A9.969 9.969 0 0112 4.5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          <p id="password-help" className={passwordTooShort ? "helper-error" : "helper"}>
            {passwordTooShort ? "Use at least 6 characters." : "Use at least 6 characters."}
          </p>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary btn-block">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-muted">
        By continuing you agree to our{" "}
        <Link href="/terms-of-service" className="underline hover:text-ink">terms of service</Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className="underline hover:text-ink">privacy policy</Link>.
      </p>
    </AuthShell>
  );
}
