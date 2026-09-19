import { cn } from "@/lib/utils";
import { CATEGORY_TOKEN, type Category } from "@/lib/prep-types";

export function Panel({
  className,
  children,
  delay,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <section
      className={cn("frost-card rise-in rounded-3xl p-6", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </section>
  );
}

export function PanelHeader({
  title,
  meta,
  action,
}: {
  title: string;
  meta?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      {action ?? (meta ? <span className="font-mono text-xs text-muted">{meta}</span> : null)}
    </div>
  );
}

export function StatCard({
  label,
  value,
  suffix,
  note,
  percent,
  barCategory,
  delay,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  note?: string;
  percent?: number;
  barCategory?: Category;
  delay?: number;
}) {
  return (
    <div
      className="frost-card rise-in rounded-2xl p-4 shadow-frost-sm"
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-2 text-2xl font-extrabold tracking-tight">
        {value}
        {suffix ? <span className="text-sm font-semibold text-muted"> {suffix}</span> : null}
      </p>
      {typeof percent === "number" ? (
        <ProgressBar
          percent={percent}
          {...(barCategory ? { category: barCategory } : {})}
          className="mt-2"
        />
      ) : note ? (
        <p className="mt-2 font-mono text-[11px] text-muted">{note}</p>
      ) : null}
    </div>
  );
}

export function ProgressBar({
  percent,
  category,
  className,
  label,
}: {
  percent: number;
  category?: Category;
  className?: string;
  label?: string;
}) {
  const color = category ? `bg-${CATEGORY_TOKEN[category]}` : "bg-accent";
  return (
    <div
      className={cn("h-1.5 overflow-hidden rounded-full bg-line", className)}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
    >
      <div className={cn("bar-grow h-full rounded-full", color)} style={{ width: `${percent}%` }} />
    </div>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex w-full items-center gap-2 rounded-xl border border-line bg-surface/70 px-3 py-2">
      <span aria-hidden className="font-mono text-xs text-muted">
        ⌕
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
      />
    </label>
  );
}

export function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-line bg-surface/70 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "rounded-xl border border-line bg-surface/70 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ActionButton({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "quiet" | "danger";
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}) {
  const tone =
    variant === "primary"
      ? "bg-accent text-accent-foreground"
      : variant === "danger"
        ? "border border-line bg-surface/70 text-backend"
        : "border border-line bg-surface/70 text-ink";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-xl px-4 py-2 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        tone,
        disabled && "pointer-events-none opacity-60 hover:translate-y-0",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface/50 px-6 py-10 text-center">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted">{description}</p>
    </div>
  );
}
