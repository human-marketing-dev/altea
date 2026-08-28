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
      <div className="nos-banner__media">
        <MediaSlot
          label={BANNER.imageNote}
          src={BANNER.image}
          alt=""
          tone="dark"
          sizes="60vw"
          priority
        />
      </div>
      <div className="nos-banner__content">
        <span className="nos-banner__eyebrow">{BANNER.eyebrow}</span>
        <h1 className="nos-banner__title">{BANNER.title}</h1>
        <p className="nos-banner__description">{BANNER.description}</p>
      </div>
    </section>
  );
}
