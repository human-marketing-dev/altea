import { MediaSlot } from "@/app/ui";
import { BANNER } from "./content";

/**
 * Sección 1 — Banner. Dos columnas partidas por una diagonal: texto sobre ink
 * a la izquierda, fotografía a la derecha.
 */
export function Banner() {
  return (
    <section className="nos-banner">
      {/* La línea: mismo trapecio que la imagen, 3px a la izquierda. */}
      <span className="nos-banner__rule" aria-hidden="true" />
      {/* El recorte vive aquí; la foto va dentro, ceñida al área visible, para
          que `cover` la ajuste a ese hueco y no al ancho completo de la sección. */}
      <div className="nos-banner__media">
        <div className="nos-banner__foto">
          <MediaSlot
            label={BANNER.imageNote}
            src={BANNER.image}
            alt={BANNER.alt ?? ""}
            tone="dark"
            sizes="(max-width: 900px) 100vw, 60vw"
            priority
          />
        </div>
      </div>
      <div className="nos-banner__content">
        <span className="nos-banner__eyebrow">{BANNER.eyebrow}</span>
        <h1 className="nos-banner__title">{BANNER.title}</h1>
        <p className="nos-banner__description">{BANNER.description}</p>
      </div>
    </section>
  );
}
