import { CATEGORY_TOKEN, type Category, type Difficulty, type Priority, type ResourceType, type Status } from "@/lib/prep-types";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wide";

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const tone =
    status === "Completed"
      ? "bg-done/15 text-done"
      : status === "In Progress"
        ? "bg-accent-soft text-accent"
        : "bg-pending/20 text-muted";
  return <span className={cn(base, tone, className)}>{status}</span>;
}

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const tone =
    priority === "High"
      ? "bg-backend/12 text-backend"
      : priority === "Medium"
        ? "bg-sql/12 text-sql"
        : "bg-pending/20 text-muted";
  return <span className={cn(base, tone, className)}>{priority}</span>;
}

export function CategoryBadge({ category, className }: { category: Category; className?: string }) {
  const token = CATEGORY_TOKEN[category];
  return (
    <span className={cn(base, "gap-1.5 bg-surface/70 text-ink", className)}>
      <span className={cn("inline-block size-2 rounded-full", `bg-${token}`)} />
      {category}
    </span>
  );
}

export function CategoryDot({ category, className }: { category: Category; className?: string }) {
  return (
    <span
      className={cn("inline-block size-2.5 rounded-full", `bg-${CATEGORY_TOKEN[category]}`, className)}
    />
  );
}

export function MetaBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn(base, "bg-pending/15 text-muted", className)}>{children}</span>;
}

export function TypeBadge({ type }: { type: ResourceType }) {
  return <MetaBadge>{type}</MetaBadge>;
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const tone =
    difficulty === "Beginner"
      ? "bg-done/15 text-done"
      : difficulty === "Intermediate"
        ? "bg-sql/12 text-sql"
        : "bg-backend/12 text-backend";
  return <span className={cn(base, tone)}>{difficulty}</span>;
}
