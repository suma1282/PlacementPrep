import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { TaskCard } from "@/components/prep/cards";
import { ActionButton, EmptyState, Panel, PanelHeader, SearchBar, Select } from "@/components/prep/primitives";
import { TaskFormModal } from "@/components/prep/task-form";
import { usePrep, type TaskDraft } from "@/lib/prep-store";
import { CATEGORIES, PRIORITIES, STATUSES, type Task } from "@/lib/prep-types";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — PlacementPrep" },
      {
        name: "description",
        content:
          "Manage placement study tasks: add, edit, delete, change status, filter by category and status, and sort by priority or due date.",
      },
      { property: "og:title", content: "Tasks — PlacementPrep" },
      {
        property: "og:description",
        content: "Add, edit and complete placement study tasks with filters and priority sorting.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Tasks,
});

const SORTS = ["Priority", "Due date", "Estimated time"] as const;
const priorityRank = { High: 0, Medium: 1, Low: 2 } as const;

function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, setTaskStatus, toggleTaskComplete } = usePrep();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [sort, setSort] = useState<string>("Priority");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const visible = useMemo(() => {
    const list = tasks.filter(
      (t) =>
        (category === "All" || t.category === category) &&
        (status === "All" || t.status === status) &&
        (priority === "All" || t.priority === priority) &&
        `${t.title} ${t.topic}`.toLowerCase().includes(query.trim().toLowerCase()),
    );
    return [...list].sort((a, b) => {
      if (sort === "Due date") return a.dueDate.localeCompare(b.dueDate);
      if (sort === "Estimated time") return a.minutes - b.minutes;
      return priorityRank[a.priority] - priorityRank[b.priority];
    });
  }, [tasks, category, status, priority, query, sort]);

  const submit = (draft: TaskDraft) => {
    if (editing) updateTask(editing.id, { ...draft, today: editing.today });
    else addTask(draft);
    setOpen(false);
    setEditing(null);
  };

  return (
    <>
      <Panel className="p-6">
        <PanelHeader
          title="Task manager"
          action={
            <ActionButton
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              Add task
            </ActionButton>
          }
        />
        <p className="mt-2 text-sm text-muted">
          {visible.length} of {tasks.length} tasks shown ·{" "}
          {tasks.filter((t) => t.status === "Completed").length} completed overall.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <SearchBar value={query} onChange={setQuery} placeholder="Search tasks" />
          </div>
          <Select label="Category" value={category} options={["All", ...CATEGORIES]} onChange={setCategory} />
          <Select label="Status" value={status} options={["All", ...STATUSES]} onChange={setStatus} />
          <Select label="Priority" value={priority} options={["All", ...PRIORITIES]} onChange={setPriority} />
          <Select label="Sort by" value={sort} options={SORTS} onChange={setSort} />
        </div>
      </Panel>

      <Panel delay={100}>
        <PanelHeader title="All tasks" meta={`${visible.length} shown`} />
        {visible.length ? (
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {visible.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => toggleTaskComplete(task.id)}
                onStatus={(s) => setTaskStatus(task.id, s)}
                onEdit={() => {
                  setEditing(task);
                  setOpen(true);
                }}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState
              title="No tasks match these filters"
              description="Clear the search or reset the filters, or add a new task."
            />
          </div>
        )}
      </Panel>

      <TaskFormModal
        open={open}
        task={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSubmit={submit}
      />
    </>
  );
}
