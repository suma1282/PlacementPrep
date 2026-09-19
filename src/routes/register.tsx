import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { ActionButton, Field, inputClass, Panel, PanelHeader } from "@/components/prep/primitives";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — PlacementPrep" },
      {
        name: "description",
        content: "Create a PlacementPrep account and start tracking your placement preparation.",
      },
      { property: "og:title", content: "Create account — PlacementPrep" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Enter your email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!college.trim() || !branch.trim() || !graduationYear.trim() || !targetRole.trim()) {
      setError("Fill in college, branch, graduation year and target role.");
      return;
    }

    setSubmitting(true);
    const { error: signUpError } = await signUp({
      email,
      password,
      name,
      college,
      branch,
      graduationYear,
      targetRole,
    });
    setSubmitting(false);
    if (signUpError) {
      setError(signUpError);
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
      <div className="relative mx-auto flex min-h-screen max-w-2xl items-center px-4 py-10">
        <Panel className="w-full p-7">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">PlacementPrep</p>
          <PanelHeader title="Create account" />
          <p className="mt-2 text-sm text-muted">Set up your profile so the workspace knows who is preparing.</p>
          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={(e) => void onSubmit(e)}>
            <Field label="Full name">
              <input
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </Field>
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Confirm password">
              <input
                required
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="College">
              <input
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Branch">
              <input
                required
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Graduation year">
              <input
                required
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Target role">
              <input
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className={inputClass}
              />
            </Field>
            {error ? <p className="text-sm font-medium text-backend sm:col-span-2">{error}</p> : null}
            <div className="sm:col-span-2">
              <ActionButton type="submit" disabled={submitting}>
                {submitting ? "Creating account…" : "Create account"}
              </ActionButton>
            </div>
          </form>
          <p className="mt-5 text-sm text-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-accent">
              Sign in
            </Link>
          </p>
        </Panel>
      </div>
    </div>
  );
}
