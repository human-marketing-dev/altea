import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type ButtonVariant = "primary" | "dark" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
  /** Visual treatment. @default "primary" */
  variant?: ButtonVariant;
  /** Ignored by `ghost`, which is inline text. @default "md" */
  size?: ButtonSize;
}

/**
 * Primary interactive control for CTAs, forms and navigation actions.
 *
 * Use `primary` (coral fill) for the one main action per view, `dark` on cream
 * sections needing higher contrast, `outline` for secondary actions, and
 * `ghost` for inline text links with an animated arrow. Never more than one
 * `primary` button per screen section.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = [
    "altea-btn",
    `altea-btn--${variant}`,
    variant === "ghost" ? null : `altea-btn--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...rest}>
      {children}
      {variant === "ghost" && (
        <span className="altea-btn__arrow" aria-hidden="true">
          →
        </span>
      )}
    </button>
  );
}
