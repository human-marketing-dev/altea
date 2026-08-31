import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface SelectProps extends ComponentPropsWithoutRef<"select"> {
  label?: string;
  children: ReactNode;
}

/**
 * Desplegable con la misma piel que `Input`.
 *
 * El design system no trae un select —el UI kit original no lo necesitaba—,
 * así que reutiliza las clases del campo de texto. Si aparece en más formularios
 * conviene subirlo al proyecto de Claude Design como componente propio.
 */
export function Select({ label, className, children, ...rest }: SelectProps) {
  return (
    <label className="altea-field">
      {label && <span className="altea-field__label">{label}</span>}
      <select
        className={["altea-field__control", className].filter(Boolean).join(" ")}
        {...rest}
      >
        {children}
      </select>
    </label>
  );
}
