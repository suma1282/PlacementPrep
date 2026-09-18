import { createFileRoute, Link } from "@tanstack/react-router";

import { CategoryDot } from "@/components/prep/badges";
import { Panel, PanelHeader, ProgressBar, StatCard } from "@/components/prep/primitives";
import { usePrep } from "@/lib/prep-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PlacementPrep — Prepare smarter. Track progress. Get placement ready." },
      {
        name: "description",
        content:
          "PlacementPrep is a placement-preparation workspace for students: roadmap, daily tasks, curated resources and progress tracking for aptitude, DSA, SQL, React, backend and projects.",
      },
      { property: "og:title", content: "PlacementPrep — your placement-prep study desk" },
      {
        property: "og:description",
        content:
          "Organise aptitude, DSA, SQL, React, backend and project preparation in one calm dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const FEATURES = [
  {
    title: "A roadmap you can follow",
    body: "Every track broken into topics with priority and an estimated learning time.",
  },
  {
    title: "Daily tasks that stay honest",
    body: "Add, edit and tick off study tasks; statuses roll straight into your stats.",
  },
  {
    title: "Resources in one shelf",
    body: "Videos, docs, practice sets and notes, filtered by track and difficulty.",
  },
];

const STEPS = [
  { step: "01", title: "Pick your tracks", body: "Start from six prepared tracks covering the full campus syllabus." },
  { step: "02", title: "Work the daily list", body: "Follow today's preparation and advance topics as you finish them." },
  { step: "03", title: "Watch progress build", body: "Category-wise bars and streaks show exactly where the gaps are." },
];

function Home() {
  const { stats } = usePrep();

  return (
    <>
      <Panel className="relative overflow-hidden p-7 md:p-9">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/15 blur-3xl"
        />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[46ch]">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Placement cycle workspace
            </p>
            <h1 className="mt-4 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              Prepare smarter. Track progress. Get placement ready.
            </h1>
            <p className="mt-4 text-pretty text-base text-muted">
              One desk for aptitude, DSA, SQL, React, backend and projects — built for the semester,
              not the panic week.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform duration-200 hover:-translate-y-0.5"
              >
                Start preparing
              </Link>
              <Link
                to="/roadmap"
                className="rounded-xl border border-line bg-surface/70 px-5 py-2.5 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
              >
                View roadmap
              </Link>
            </div>
          </div>
          <div className="frost-inset flex shrink-0 items-center gap-5 rounded-2xl px-5 py-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Overall</p>
              <p className="text-3xl font-extrabold tracking-tight">{stats.overallPercent}%</p>
            </div>
            <div className="h-10 w-px bg-line" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Streak</p>
              <p className="text-3xl font-extrabold tracking-tight">
                {stats.streak}
                <span className="text-base font-semibold text-muted"> days</span>
              </p>
            </div>
          </div>
        </div>
      </Panel>

      <Panel delay={80}>
        <PanelHeader title="Preparation tracks" meta={`${stats.byCategory.length} active`} />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {stats.byCategory.map((c) => (
            <Link
              key={c.category}
              to="/roadmap"
              className="frost-inset rounded-2xl p-4 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <CategoryDot category={c.category} />
              <p className="mt-3 text-sm font-semibold">{c.category}</p>
              <p className="mt-1 font-mono text-[11px] text-muted">
                {c.percent}% · {c.completed}/{c.total}
              </p>
            </Link>
          ))}
        </div>
      </Panel>

      <Panel delay={120}>
        <PanelHeader title="What PlacementPrep does" />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="frost-inset rounded-2xl p-4">
              <p className="text-sm font-semibold">{f.title}</p>
              <p className="mt-1 text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel delay={160}>
        <PanelHeader title="How it works" />
        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.step} className="frost-inset rounded-2xl p-4">
              <p className="font-mono text-[11px] text-accent">{s.step}</p>
              <p className="mt-2 text-sm font-semibold">{s.title}</p>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </Panel>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Overall progress"
          value={`${stats.overallPercent}%`}
          percent={stats.overallPercent}
          delay={200}
        />
        <StatCard
          label="Topics mapped"
          value={stats.topicsTotal}
          note={`${stats.topicsCompleted} completed`}
          delay={220}
        />
        <StatCard
          label="Tasks tracked"
          value={stats.tasksTotal}
          note={`${stats.tasksCompleted} completed`}
          delay={240}
        />
        <StatCard label="Day streak" value={stats.streak} note={`Best ${stats.bestStreak}`} delay={260} />
      </section>

      <Panel delay={280}>
        <PanelHeader title="Track completion" />
        <div className="mt-4 space-y-3">
          {stats.byCategory.map((c) => (
            <div key={c.category}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{c.category}</span>
                <span className="font-mono text-[11px] text-muted">
                  {c.completed}/{c.total}
                </span>
              </div>
              <ProgressBar
                percent={c.percent}
                category={c.category}
                className="mt-2"
                label={`${c.category} completion`}
              />
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
