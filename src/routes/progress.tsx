import { createFileRoute } from "@tanstack/react-router";

import { CategoryDot, StatusBadge } from "@/components/prep/badges";
import { Panel, PanelHeader, ProgressBar, StatCard } from "@/components/prep/primitives";
import { usePrep } from "@/lib/prep-store";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — PlacementPrep" },
      {
        name: "description",
        content:
          "Visual placement-prep progress: overall completion, category-wise bars, weekly practice minutes, completed and remaining topics, tasks completed and streak.",
      },
      { property: "og:title", content: "Progress — PlacementPrep" },
      {
        property: "og:description",
        content: "Category-wise completion, weekly practice minutes and streak tracking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Progress,
});

function Progress() {
  const { stats, topics, weeklyMinutes } = usePrep();
  const peak = Math.max(...weeklyMinutes.map((d) => d.minutes));
  const completedTopics = topics.filter((t) => t.status === "Completed");
  const remainingTopics = topics.filter((t) => t.status !== "Completed");

  return (
    <>
      <Panel className="p-6">
        <PanelHeader title="Progress overview" meta={`${stats.overallPercent}% overall`} />
        <p className="mt-2 text-sm text-muted">
          Overall completion counts finished topics fully and in-progress topics at half weight.
        </p>
        <ProgressBar percent={stats.overallPercent} className="mt-4 h-3" label="Overall completion" />
      </Panel>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Overall completion"
          value={`${stats.overallPercent}%`}
          percent={stats.overallPercent}
          delay={100}
        />
        <StatCard
          label="Topics completed"
          value={stats.topicsCompleted}
          suffix={`/ ${stats.topicsTotal}`}
          note={`${stats.topicsRemaining} remaining`}
          delay={130}
        />
        <StatCard
          label="Tasks completed"
          value={stats.tasksCompleted}
          suffix={`/ ${stats.tasksTotal}`}
          delay={160}
        />
        <StatCard label="Current streak" value={stats.streak} note={`Best ${stats.bestStreak}`} delay={190} />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Panel className="lg:col-span-3" delay={220}>
          <PanelHeader title="Category-wise progress" />
          <div className="mt-4 space-y-4">
            {stats.byCategory.map((c) => (
              <div key={c.category}>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <CategoryDot category={c.category} />
                    {c.category}
                  </span>
                  <span className="font-mono text-[11px] text-muted">
                    {c.percent}% · {c.completed}/{c.total}
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

        <Panel className="lg:col-span-2" delay={250}>
          <PanelHeader title="Weekly practice" meta="minutes" />
          <div className="mt-6 flex h-40 items-end justify-between gap-2">
            {weeklyMinutes.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <span className="font-mono text-[10px] text-muted">{d.minutes}</span>
                <div
                  className="w-full rounded-t-lg bg-accent/70"
                  style={{ height: `${(d.minutes / peak) * 100}%` }}
                  role="img"
                  aria-label={`${d.day}: ${d.minutes} minutes`}
                />
                <span className="font-mono text-[10px] text-muted">{d.day}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-[11px] text-muted">
            Total {weeklyMinutes.reduce((sum, d) => sum + d.minutes, 0)} minutes this week
          </p>
        </Panel>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel delay={280}>
          <PanelHeader title="Completed topics" meta={`${completedTopics.length}`} />
          <ul className="mt-4 divide-y divide-line">
            {completedTopics.slice(0, 12).map((topic) => (
              <li key={topic.id} className="flex items-center gap-3 py-2.5">
                <CategoryDot category={topic.category} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{topic.name}</span>
                <span className="font-mono text-[11px] text-muted">{topic.category}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel delay={310}>
          <PanelHeader title="Remaining topics" meta={`${remainingTopics.length}`} />
          <ul className="mt-4 divide-y divide-line">
            {remainingTopics.slice(0, 12).map((topic) => (
              <li key={topic.id} className="flex items-center gap-3 py-2.5">
                <CategoryDot category={topic.category} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{topic.name}</span>
                <StatusBadge status={topic.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </section>
    </>
  );
}
