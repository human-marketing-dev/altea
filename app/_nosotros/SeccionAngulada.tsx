import type { CSSProperties } from "react";
import { MediaSlot, SectionHeading } from "@/app/ui";
import type { BloqueAngulado } from "./content";

/**
 * Bloque de "Qué hacemos": misma división diagonal del banner, en versión corta.
 * La imagen puede ir a cualquier lado; la diagonal se refleja sola.
 */
export function SeccionAngulada({ bloque }: { bloque: BloqueAngulado }) {
  const oscuro = bloque.tono === "ink";

  return (
    <section
      id={bloque.id}
      className={`nos-angulo nos-angulo--${bloque.imagen} nos-angulo--${bloque.tono}`}
      style={
        bloque.division === undefined
          ? undefined
          : ({ "--diag-centro": `${bloque.division}%` } as CSSProperties)
      }
    >
      <span className="nos-angulo__rule" aria-hidden="true" />
      <div className="nos-angulo__media">
        <MediaSlot
          label={bloque.imageNote}
          src={bloque.image}
          alt={bloque.alt ?? ""}
          tone={oscuro ? "dark" : "light"}
          sizes="(max-width: 900px) 100vw, 60vw"
        />
      </div>
      <div className="nos-angulo__content">
        <SectionHeading
          tone={oscuro ? "light" : "ink"}
          title={bloque.title}
          description={bloque.description}
        />
      </div>
    </section>
  );
}
