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
      {/* El recorte vive en __media; la foto va dentro de __foto, ceñida al
          área que de verdad se ve. Así `cover` encuadra la imagen en ese hueco
          en vez de ajustarla a la sección entera y enseñar solo una rebanada. */}
      <div className="nos-angulo__media">
        <div className="nos-angulo__foto">
          <MediaSlot
            label={bloque.imageNote}
            src={bloque.image}
            alt={bloque.alt ?? ""}
            tone={oscuro ? "dark" : "light"}
            sizes="(max-width: 900px) 100vw, 55vw"
          />
        </div>
      </div>
      <div className="nos-angulo__content">
        <SectionHeading
          className="max-w-none"
          tone={oscuro ? "light" : "ink"}
          title={bloque.title}
          description={bloque.description}
        />
      </div>
    </section>
  );
}
