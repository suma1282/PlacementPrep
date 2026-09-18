import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { ResourceCard } from "@/components/prep/cards";
import { EmptyState, Panel, PanelHeader, SearchBar, Select } from "@/components/prep/primitives";
import { usePrep } from "@/lib/prep-store";
import { CATEGORIES, DIFFICULTIES, RESOURCE_TYPES } from "@/lib/prep-types";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — PlacementPrep" },
      {
        name: "description",
        content:
          "A placement resource library of videos, documentation, practice sets, notes and courses, searchable by track, type and difficulty.",
      },
      { property: "og:title", content: "Resources — PlacementPrep" },
      {
        property: "og:description",
        content: "Curated videos, docs, practice sets and notes for every placement track.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Resources,
});

function Resources() {
  const { resources } = usePrep();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const visible = useMemo(
    () =>
      resources.filter(
        (r) =>
          (category === "All" || r.category === category) &&
          (type === "All" || r.type === type) &&
          (difficulty === "All" || r.difficulty === difficulty) &&
          `${r.title} ${r.description}`.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [resources, category, type, difficulty, query],
  );

  return (
    <>
      <Panel className="p-6">
        <PanelHeader title="Resource library" meta={`${resources.length} saved`} />
        <p className="mt-2 max-w-[60ch] text-sm text-muted">
          Everything worth rereading before a test, grouped by track. Links are placeholders in this
          version.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <SearchBar value={query} onChange={setQuery} placeholder="Search resources" />
          </div>
          <Select label="Category" value={category} options={["All", ...CATEGORIES]} onChange={setCategory} />
          <Select label="Type" value={type} options={["All", ...RESOURCE_TYPES]} onChange={setType} />
          <Select
            label="Difficulty"
            value={difficulty}
            options={["All", ...DIFFICULTIES]}
            onChange={setDifficulty}
          />
        </div>
      </Panel>

      <Panel delay={100}>
        <PanelHeader title="Results" meta={`${visible.length} shown`} />
        {visible.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState
              title="No resources match"
              description="Try a different search term or reset the filters to All."
            />
          </div>
        )}
      </Panel>
    </>
  );
}
