import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { ActionButton, Field, inputClass, Panel, PanelHeader } from "@/components/prep/primitives";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — PlacementPrep" },
      {
        name: "description",
        content: "Sign in to PlacementPrep to continue your placement preparation.",
      },
      { property: "og:title", content: "Sign in — PlacementPrep" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    void navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen w-full bg-canvas text-ink">
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-32 h-[420px] w-[420px] rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-[380px] w-[380px] rounded-full bg-react/15 blur-3xl" />
      </div>
      <div className="relative mx-auto flex min-h-screen max-w-lg items-center px-4 py-10">
        <Panel className="w-full p-7">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">PlacementPrep</p>
          <PanelHeader title="Sign in" />
          <p className="mt-2 text-sm text-muted">Continue your placement cycle from where you left off.</p>
          <form className="mt-6 grid gap-4" onSubmit={(e) => void onSubmit(e)}>
            <Field label="Email">
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Password">
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </Field>
            {error ? <p className="text-sm font-medium text-backend">{error}</p> : null}
            <ActionButton type="submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </ActionButton>
          </form>
          <p className="mt-5 text-sm text-muted">
            New here?{" "}
            <Link to="/register" className="font-semibold text-accent">
              Create an account
            </Link>
          </p>
        </Panel>
      </div>
    </div>
  );
}
