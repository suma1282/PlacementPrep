import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { RoadmapCard } from "@/components/prep/cards";
import { EmptyState, Panel, PanelHeader, ProgressBar, SearchBar, Select } from "@/components/prep/primitives";
import { usePrep } from "@/lib/prep-store";
import { CATEGORIES, PRIORITIES, STATUSES } from "@/lib/prep-types";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Roadmap — PlacementPrep" },
      {
        name: "description",
        content:
          "A structured placement roadmap across aptitude, DSA, SQL, React, backend and projects, with priority, estimated learning time and completion status per topic.",
      },
      { property: "og:title", content: "Roadmap — PlacementPrep" },
      {
        property: "og:description",
        content: "Every placement topic with priority, estimated hours and completion status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Roadmap,
});

function Roadmap() {
  const { topics, stats, cycleTopicStatus } = usePrep();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");

  const filtered = useMemo(
    () =>
      topics.filter(
        (t) =>
          (category === "All" || t.category === category) &&
          (status === "All" || t.status === status) &&
          (priority === "All" || t.priority === priority) &&
          t.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [topics, category, status, priority, query],
  );

  const grouped = CATEGORIES.map((c) => ({
    category: c,
    items: filtered.filter((t) => t.category === c),
  })).filter((g) => g.items.length);

  return (
    <>
      <Panel className="p-6">
        <PanelHeader
          title="Placement roadmap"
          meta={`${stats.topicsCompleted}/${stats.topicsTotal} topics complete`}
        />
        <p className="mt-2 max-w-[60ch] text-sm text-muted">
          Work top to bottom inside each track. Use “Advance” to move a topic from not started to in
          progress to completed.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <SearchBar value={query} onChange={setQuery} placeholder="Search topics" />
          </div>
          <Select label="Category" value={category} options={["All", ...CATEGORIES]} onChange={setCategory} />
          <Select label="Status" value={status} options={["All", ...STATUSES]} onChange={setStatus} />
          <Select label="Priority" value={priority} options={["All", ...PRIORITIES]} onChange={setPriority} />
        </div>
      </Panel>

      {grouped.length ? (
        grouped.map((group, i) => {
          const stat = stats.byCategory.find((c) => c.category === group.category)!;
          return (
            <Panel key={group.category} delay={80 + i * 30}>
              <PanelHeader
                title={group.category}
                meta={`${stat.completed}/${stat.total} complete · ${stat.percent}%`}
              />
              <ProgressBar
                percent={stat.percent}
                category={group.category}
                className="mt-3"
                label={`${group.category} completion`}
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {group.items.map((topic) => (
                  <RoadmapCard key={topic.id} topic={topic} onCycle={() => cycleTopicStatus(topic.id)} />
                ))}
              </div>
            </Panel>
          );
        })
      ) : (
        <Panel delay={80}>
          <EmptyState
            title="No topics match these filters"
            description="Try clearing the search box or setting the filters back to All."
          />
        </Panel>
      )}
    </>
  );
}
