import { useEffect, useState } from "react";

import type { TaskDraft } from "@/lib/prep-store";
import { CATEGORIES, PRIORITIES, STATUSES, type Category, type Priority, type Status, type Task } from "@/lib/prep-types";

import { ActionButton, Field, inputClass } from "./primitives";

const emptyDraft = (): TaskDraft => ({
  title: "",
  category: "DSA",
  topic: "",
  priority: "Medium",
  minutes: 30,
  dueDate: new Date().toISOString().slice(0, 10),
  status: "Not Started",
});

export function TaskFormModal({
  open,
  task,
  onClose,
  onSubmit,
}: {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (draft: TaskDraft) => void;
}) {
  const [draft, setDraft] = useState<TaskDraft>(emptyDraft);

  useEffect(() => {
    if (!open) return;
    if (task) {
      const { id: _id, ...rest } = task;
      setDraft(rest);
    } else {
      setDraft(emptyDraft());
    }
  }, [open, task]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 p-4 backdrop-blur-sm sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        className="frost-card max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6"
      >
        <div className="flex items-center justify-between">
          <h2 id="task-form-title" className="text-lg font-bold tracking-tight">
            {task ? "Edit task" : "Add task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-xl border border-line bg-surface/70 text-sm"
          >
            ✕
          </button>
        </div>

        <form
          className="mt-5 grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.title.trim()) return;
            onSubmit({ ...draft, topic: draft.topic.trim() || draft.category });
          }}
        >
          <div className="sm:col-span-2">
            <Field label="Task title">
              <input
                required
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="DSA — Trees: level order traversal"
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Category">
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value as Category })}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Topic">
            <input
              value={draft.topic}
              onChange={(e) => setDraft({ ...draft, topic: e.target.value })}
              placeholder="Trees"
              className={inputClass}
            />
          </Field>
          <Field label="Priority">
            <select
              value={draft.priority}
              onChange={(e) => setDraft({ ...draft, priority: e.target.value as Priority })}
              className={inputClass}
            >
              {PRIORITIES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
          <Field label="Estimated time (min)">
            <input
              type="number"
              min={5}
              max={480}
              step={5}
              value={draft.minutes}
              onChange={(e) => setDraft({ ...draft, minutes: Number(e.target.value) })}
              className={inputClass}
            />
          </Field>
          <Field label="Due date">
            <input
              type="date"
              value={draft.dueDate}
              onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Status">
            <select
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value as Status })}
              className={inputClass}
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <div className="mt-2 flex items-center gap-2 sm:col-span-2">
            <ActionButton type="submit">{task ? "Save changes" : "Add task"}</ActionButton>
            <ActionButton variant="quiet" onClick={onClose}>
              Cancel
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}
