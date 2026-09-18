import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { placementWindowDays } from "@/lib/prep-data";
import { usePrep } from "@/lib/prep-store";
import { cn } from "@/lib/utils";

import { ProgressBar } from "./primitives";

const NAV = [
  { to: "/", label: "Home", glyph: "☰" },
  { to: "/dashboard", label: "Dashboard", glyph: "▦" },
  { to: "/roadmap", label: "Roadmap", glyph: "▤" },
  { to: "/tasks", label: "Tasks", glyph: "☑" },
  { to: "/resources", label: "Resources", glyph: "▢" },
  { to: "/progress", label: "Progress", glyph: "◷" },
  { to: "/profile", label: "Profile", glyph: "◍" },
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-accent text-sm font-bold text-accent-foreground">
        P
      </span>
      <span className="text-sm font-bold tracking-tight">PlacementPrep</span>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-1">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-surface/70"
          activeProps={{ className: "bg-accent-soft text-accent font-semibold" }}
        >
          <span aria-hidden className="text-base">
            {item.glyph}
          </span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { profile, stats } = usePrep();
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen w-full bg-canvas text-ink">
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-32 h-[420px] w-[420px] rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-[380px] w-[380px] rounded-full bg-react/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-sql/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-[1400px] gap-6 px-4 py-6 md:px-6">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="frost-card sticky top-6 rounded-2xl p-4 shadow-frost-sm">
            <div className="flex items-center gap-2.5 px-1 pb-5">
              <span className="grid size-9 place-items-center rounded-xl bg-accent text-sm font-bold text-accent-foreground">
                P
              </span>
              <div>
                <p className="text-sm font-bold leading-none tracking-tight">PlacementPrep</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                  Placement cycle
                </p>
              </div>
            </div>
            <NavLinks />
            <div className="frost-inset mt-5 rounded-xl p-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                Placement window
              </p>
              <p className="mt-1 text-sm font-semibold">Opens in {placementWindowDays} days</p>
              <ProgressBar percent={stats.overallPercent} className="mt-2" label="Overall progress" />
            </div>
            <Link
              to="/profile"
              className="mt-4 flex items-center gap-2.5 rounded-xl px-1 py-1 hover:bg-surface/70"
            >
              <span className="grid size-8 place-items-center rounded-full bg-projects/15 text-xs font-bold text-projects">
                {initials}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{profile.name}</span>
                <span className="block truncate font-mono text-[10px] text-muted">
                  {profile.branch.split(" ")[0]} · {profile.graduationYear}
                </span>
              </span>
            </Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1 space-y-6">
          <div className="lg:hidden">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                type="button"
                aria-expanded={open}
                aria-label="Toggle navigation"
                onClick={() => setOpen((v) => !v)}
                className="grid size-9 place-items-center rounded-xl border border-line bg-surface/70 text-base backdrop-blur"
              >
                ☰
              </button>
            </div>
            <div className={cn("frost-card mt-3 rounded-2xl p-3", !open && "hidden")}>
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </div>

          {children}

          <footer className="pb-2 pt-1 text-center font-mono text-[11px] text-muted">
            PlacementPrep · prepare smarter, track progress, get placement ready
          </footer>
        </main>
      </div>
    </div>
  );
}
