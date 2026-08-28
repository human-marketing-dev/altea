export type StatBlockTone = "ink" | "light";

export interface StatBlockProps {
  value: string;
  label: string;
  /** Use `light` over ink backgrounds. @default "ink" */
  tone?: StatBlockTone;
  className?: string;
}

/**
 * Large number + uppercase label, for headline metrics (occupancy, hectares,
 * visitors/month).
 *
 * Always real figures from the corporate deck — never filler numbers.
 */
export function StatBlock({
  value,
  label,
  tone = "ink",
  className,
}: StatBlockProps) {
  const classes = [
    "altea-stat",
    tone === "light" ? "altea-stat--light" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className="altea-stat__value">{value}</div>
      <div className="altea-stat__label">{label}</div>
    </div>
  );
}
