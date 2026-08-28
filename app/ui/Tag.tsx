import type { ReactNode } from "react";

export type TagTone = "ink" | "cream" | "coral" | "outline";

export interface TagProps {
  children: ReactNode;
  /** @default "ink" */
  tone?: TagTone;
  className?: string;
}

/**
 * Small uppercase pill label for business-unit tags, categories and statuses.
 *
 * Keep `coral` rare — reserve it for the single most important tag in a group;
 * default to `ink` / `outline` for the rest.
 */
export function Tag({ children, tone = "ink", className }: TagProps) {
  const classes = ["altea-tag", `altea-tag--${tone}`, className]
    .filter(Boolean)
    .join(" ");
  return <span className={classes}>{children}</span>;
}
