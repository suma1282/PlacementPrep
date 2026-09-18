import type { Resource, Status, Task, Topic } from "@/lib/prep-types";

import { CategoryBadge, CategoryDot, DifficultyBadge, MetaBadge, PriorityBadge, StatusBadge, TypeBadge } from "./badges";
import { ActionButton } from "./primitives";

function StatusMark({ status }: { status: Status }) {
  if (status === "Completed")
    return (
      <span
        aria-hidden
        className="grid size-5 shrink-0 place-items-center rounded-md border border-done/40 bg-done/15 text-[11px] font-bold text-done"
      >
        ✓
      </span>
    );
  if (status === "In Progress")
    return <span aria-hidden className="size-5 shrink-0 rounded-md border-2 border-accent" />;
  return <span aria-hidden className="size-5 shrink-0 rounded-md border-2 border-line" />;
}

export function TaskRow({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: () => void;
}) {
  return (
    <li className="flex items-center gap-3 py-3">
      <button
        type="button"
        onClick={onToggle}
        aria-label={`Mark "${task.title}" ${task.status === "Completed" ? "not started" : "completed"}`}
        className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <StatusMark status={task.status} />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{task.title}</p>
        <p className="font-mono text-[11px] text-muted">
          {task.category} · {task.topic} · {task.minutes} min
        </p>
      </div>
      <StatusBadge status={task.status} />
    </li>
  );
}

export function TaskCard({
  task,
  onToggle,
  onStatus,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onStatus: (status: Status) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="frost-inset rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label={`Mark "${task.title}" ${task.status === "Completed" ? "not started" : "completed"}`}
          className="mt-0.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <StatusMark status={task.status} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{task.title}</p>
          <p className="mt-1 font-mono text-[11px] text-muted">
            {task.topic} · {task.minutes} min · due {task.dueDate}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <CategoryBadge category={task.category} />
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2">
          <span className="sr-only">Status for {task.title}</span>
          <select
            value={task.status}
            onChange={(e) => onStatus(e.target.value as Status)}
            className="rounded-xl border border-line bg-surface/70 px-3 py-1.5 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </label>
        <ActionButton variant="quiet" className="px-3 py-1.5 text-xs" onClick={onEdit}>
          Edit
        </ActionButton>
        <ActionButton variant="danger" className="px-3 py-1.5 text-xs" onClick={onDelete}>
          Delete
        </ActionButton>
      </div>
    </article>
  );
}

export function RoadmapCard({ topic, onCycle }: { topic: Topic; onCycle: () => void }) {
  return (
    <article className="frost-inset rounded-2xl p-4 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-2">
        <CategoryDot category={topic.category} />
        <PriorityBadge priority={topic.priority} />
      </div>
      <p className="mt-3 text-sm font-semibold">{topic.name}</p>
      <p className="mt-1 font-mono text-[11px] text-muted">
        {topic.category} · {topic.hours}h estimated
      </p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <StatusBadge status={topic.status} />
        <button
          type="button"
          onClick={onCycle}
          className="font-mono text-[11px] font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Advance →
        </button>
      </div>
    </article>
  );
}

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="frost-inset flex flex-col rounded-2xl p-4 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-2">
        <CategoryDot category={resource.category} />
        <TypeBadge type={resource.type} />
      </div>
      <p className="mt-3 text-sm font-semibold">{resource.title}</p>
      <p className="mt-1 flex-1 text-sm text-muted">{resource.description}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <MetaBadge>{resource.category}</MetaBadge>
          <DifficultyBadge difficulty={resource.difficulty} />
        </div>
        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[11px] font-medium text-accent hover:underline"
        >
          Open →
        </a>
      </div>
    </article>
  );
}
