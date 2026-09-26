import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { TaskCard } from "@/components/prep/cards";
import { ActionButton, EmptyState, Panel, PanelHeader, SearchBar, Select } from "@/components/prep/primitives";
import { TaskFormModal } from "@/components/prep/task-form";
import type { TaskDraft } from "@/lib/prep-store";
import { CATEGORIES, PRIORITIES, STATUSES, type Status, type Task } from "@/lib/prep-types";
import { deleteTaskRow, fetchTasks, getUserId, insertTask, updateTaskRow } from "@/lib/tasks-db";

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [sort, setSort] = useState<string>("Priority");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const uid = await getUserId();
      setUserId(uid);
      setTasks(uid ? await fetchTasks(uid) : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const run = async (fn: (uid: string) => Promise<void>) => {
    if (!userId) {
      setError("Please sign in to save tasks.");
      return;
    }
    setError(null);
    try {
      await fn(userId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong saving your task.");
    }
  };

  const replace = (t: Task) => setTasks((prev) => prev.map((x) => (x.id === t.id ? t : x)));
  const setTaskStatus = (id: string, s: Status) =>
    run(async (uid) => replace(await updateTaskRow(uid, id, { status: s })));
  const toggleTaskComplete = (task: Task) =>
    setTaskStatus(task.id, task.status === "Completed" ? "Not Started" : "Completed");
  const deleteTask = (id: string) =>
    run(async (uid) => {
      await deleteTaskRow(uid, id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    });

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

  const submit = (draft: TaskDraft) =>
    run(async (uid) => {
      if (editing) replace(await updateTaskRow(uid, editing.id, draft));
      else {
        const created = await insertTask(uid, draft);
        setTasks((prev) => [created, ...prev]);
      }
      setOpen(false);
      setEditing(null);
    });

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
        {error ? (
          <div role="alert" className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface/70 p-4 text-sm">
            <span>{error}</span>
            <ActionButton variant="quiet" onClick={() => void load()}>
              Retry
            </ActionButton>
          </div>
        ) : null}
        {loading ? (
          <p className="mt-4 text-sm text-muted" aria-live="polite">
            Loading your tasks…
          </p>
        ) : !userId ? (
          <div className="mt-4">
            <EmptyState
              title="Sign in required"
              description="Sign in to load and save your personal tasks."
            />
          </div>
        ) : visible.length ? (
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {visible.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => void toggleTaskComplete(task)}
                onStatus={(s) => void setTaskStatus(task.id, s)}
                onEdit={() => {
                  setEditing(task);
                  setOpen(true);
                }}
                onDelete={() => void deleteTask(task.id)}
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
