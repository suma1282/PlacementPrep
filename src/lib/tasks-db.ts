import type { SupabaseClient } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import type { TaskDraft } from "./prep-store";
import { CATEGORIES, PRIORITIES, STATUSES, type Category, type Priority, type Status, type Task } from "./prep-types";

// Generated types don't include public.tasks yet, so use an untyped view of the same browser client.
const db = () => supabase as unknown as SupabaseClient;

interface TaskRow {
  id: string;
  user_id: string;
  title: string;
  category: string;
  topic: string | null;
  priority: string;
  estimated_minutes: number | null;
  due_date: string | null;
  status: string;
}

const statusToDb = (s: Status) => s.toLowerCase().replace(/ /g, "_");
const statusFromDb = (s: string): Status =>
  STATUSES.find((x) => statusToDb(x) === s) ?? "Not Started";
const priorityFromDb = (p: string): Priority =>
  PRIORITIES.find((x) => x.toLowerCase() === p.toLowerCase()) ?? "Medium";
const categoryFromDb = (c: string): Category =>
  CATEGORIES.find((x) => x.toLowerCase() === c.toLowerCase()) ?? "Projects";

const fromRow = (r: TaskRow): Task => ({
  id: r.id,
  title: r.title,
  category: categoryFromDb(r.category),
  topic: r.topic ?? "",
  priority: priorityFromDb(r.priority),
  minutes: r.estimated_minutes ?? 0,
  dueDate: r.due_date ?? "",
  status: statusFromDb(r.status),
});

const toRow = (d: TaskDraft) => ({
  title: d.title,
  category: d.category,
  topic: d.topic || null,
  priority: d.priority.toLowerCase(),
  estimated_minutes: d.minutes,
  due_date: d.dueDate || null,
  status: statusToDb(d.status),
});

const COLS = "id,user_id,title,category,topic,priority,estimated_minutes,due_date,status";

export async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

export async function fetchTasks(userId: string): Promise<Task[]> {
  const { data, error } = await db()
    .from("tasks")
    .select(COLS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as TaskRow[]).map(fromRow);
}

export async function insertTask(userId: string, draft: TaskDraft): Promise<Task> {
  const { data, error } = await db()
    .from("tasks")
    .insert({ ...toRow(draft), user_id: userId })
    .select(COLS)
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as TaskRow);
}

export async function updateTaskRow(userId: string, id: string, patch: Partial<TaskDraft>): Promise<Task> {
  const full = toRow(patch as TaskDraft);
  const row = Object.fromEntries(
    Object.entries(full).filter(([k]) => {
      const map: Record<string, keyof TaskDraft> = {
        title: "title", category: "category", topic: "topic", priority: "priority",
        estimated_minutes: "minutes", due_date: "dueDate", status: "status",
      };
      return patch[map[k]!] !== undefined;
    }),
  );
  const { data, error } = await db()
    .from("tasks")
    .update(row)
    .eq("id", id)
    .eq("user_id", userId)
    .select(COLS)
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as TaskRow);
}

export async function deleteTaskRow(userId: string, id: string): Promise<void> {
  const { error } = await db().from("tasks").delete().eq("id", id).eq("user_id", userId);
  if (error) throw new Error(error.message);
}
