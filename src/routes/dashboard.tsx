import { createFileRoute, Link } from "@tanstack/react-router";

import { CategoryDot, StatusBadge } from "@/components/prep/badges";
import { TaskRow } from "@/components/prep/cards";
import { EmptyState, Panel, PanelHeader, ProgressBar, StatCard } from "@/components/prep/primitives";
import { usePrep } from "@/lib/prep-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — PlacementPrep" },
      {
        name: "description",
        content:
          "Your placement-prep dashboard: overall progress, tasks completed, current streak, today's preparation list and the recommended next topic.",
      },
      { property: "og:title", content: "Dashboard — PlacementPrep" },
      {
        property: "og:description",
        content: "Overall progress, streaks, today's preparation and your recommended next topic.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { stats, toggleTaskComplete, recentActivity } = usePrep();
  const today = stats.todayTasks;
  const todayDone = today.filter((t) => t.status === "Completed").length;
  const weeklyPercent = Math.min(
    100,
    Math.round((stats.weeklyDone / stats.weeklyGoalTasks) * 100),
  );

  return (
    <>
      <Panel className="p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Today's preparation</h1>
            <p className="mt-1 text-sm text-muted">
              {todayDone} of {today.length} tasks done today · {stats.topicsRemaining} topics left in
              the roadmap.
            </p>
          </div>
          <Link
            to="/tasks"
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform duration-200 hover:-translate-y-0.5"
          >
            Manage tasks
          </Link>
        </div>
      </Panel>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Overall progress"
          value={`${stats.overallPercent}%`}
          percent={stats.overallPercent}
          delay={100}
        />
        <StatCard
          label="Tasks completed"
          value={stats.tasksCompleted}
          suffix={`/ ${stats.tasksTotal}`}
          note={`${weeklyPercent}% of weekly goal`}
          delay={130}
        />
        <StatCard label="Current streak" value={stats.streak} note={`Best ${stats.bestStreak}`} delay={160} />
        <StatCard
          label="Topics completed"
          value={stats.topicsCompleted}
          suffix={`/ ${stats.topicsTotal}`}
          percent={Math.round((stats.topicsCompleted / stats.topicsTotal) * 100)}
          delay={190}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Panel className="lg:col-span-3" delay={220}>
          <PanelHeader title="Today's preparation" meta={`${todayDone} of ${today.length} done`} />
          {today.length ? (
            <ul className="mt-4 divide-y divide-line">
              {today.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={() => toggleTaskComplete(task.id)} />
              ))}
            </ul>
          ) : (
            <div className="mt-4">
              <EmptyState
                title="Nothing scheduled for today"
                description="Add a task from the Tasks page to fill today's list."
              />
            </div>
          )}
        </Panel>

        <div className="space-y-6 lg:col-span-2">
          <Panel delay={250}>
            <PanelHeader title="Continue preparation" />
            {stats.nextTopic ? (
              <div className="frost-inset mt-4 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <CategoryDot category={stats.nextTopic.category} />
                  <StatusBadge status={stats.nextTopic.status} />
                </div>
                <p className="mt-3 text-sm font-semibold">{stats.nextTopic.name}</p>
                <p className="mt-1 font-mono text-[11px] text-muted">
                  {stats.nextTopic.category} · {stats.nextTopic.hours}h · {stats.nextTopic.priority}{" "}
                  priority
                </p>
                <Link
                  to="/roadmap"
                  className="mt-4 inline-block rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
                >
                  Open in roadmap
                </Link>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted">Every topic is complete. Time for mock rounds.</p>
            )}
            <div className="mt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Weekly goal</span>
                <span className="font-mono text-[11px] text-muted">
                  {stats.weeklyDone}/{stats.weeklyGoalTasks} tasks
                </span>
              </div>
              <ProgressBar percent={weeklyPercent} className="mt-2" label="Weekly goal" />
            </div>
          </Panel>

          <Panel delay={280}>
            <PanelHeader title="Recent activity" />
            <ul className="mt-4 space-y-3">
              {recentActivity.map((item) => (
                <li key={item.label} className="flex gap-3">
                  <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-accent/60" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="font-mono text-[11px] text-muted">{item.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </section>
    </>
  );
}
