import type { ComponentPropsWithoutRef } from "react";

type NativeInputProps = Omit<ComponentPropsWithoutRef<"input">, "type">;
type NativeTextareaProps = ComponentPropsWithoutRef<"textarea">;

export interface InputProps
  extends Omit<NativeInputProps & NativeTextareaProps, "children"> {
  label?: string;
  /** @default "text" — ignored when `as="textarea"` */
  type?: string;
  /** @default "input" */
  as?: "input" | "textarea";
}

/**
 * Labeled text input / textarea for contact and lead forms.
 */
export function Input({
  label,
  type = "text",
  as = "input",
  className,
  rows,
  ...rest
}: InputProps) {
  const controlClass = ["altea-field__control", className]
    .filter(Boolean)
    .join(" ");

  return (
    <label className="altea-field">
      {label && <span className="altea-field__label">{label}</span>}
      {as === "textarea" ? (
        <textarea
          className={controlClass}
          rows={rows ?? 4}
          {...(rest as NativeTextareaProps)}
        />
      ) : (
        <input
          type={type}
          className={controlClass}
          {...(rest as NativeInputProps)}
        />
      )}
    </label>
  );
}
