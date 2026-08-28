export type SectionHeadingTone = "ink" | "light";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** @default "left" */
  align?: "left" | "center";
  /** Use `light` over ink backgrounds. @default "ink" */
  tone?: SectionHeadingTone;
  /**
   * Heading level. The upstream component is always an `h2`; override it when
   * the heading opens a page rather than a section.
   * @default "h2"
   */
  as?: "h1" | "h2" | "h3";
  className?: string;
}

/**
 * Eyebrow + heading + optional description, the standard section opener.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "ink",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  const classes = [
    "altea-section-heading",
    align === "center" ? "altea-section-heading--center" : null,
    tone === "light" ? "altea-section-heading--light" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {eyebrow && <span className="altea-section-heading__eyebrow">{eyebrow}</span>}
      <Heading className="altea-section-heading__title">{title}</Heading>
      {description && (
        <p className="altea-section-heading__description">{description}</p>
      )}
    </div>
  );
}
