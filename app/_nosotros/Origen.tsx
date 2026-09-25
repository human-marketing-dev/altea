import { MediaSlot } from "@/app/ui";
import { ORIGEN } from "./content";

/**
 * Sección 2 — ¿Cómo nació Altea? Imagen a la izquierda, texto a la derecha.
 *
 * Vuelve a la composición simple. La versión tipográfica —apertura en grande,
 * regla diagonal, cuerpo en dos columnas y marca de agua del isotipo— se
 * descartó; queda en el historial de git por si hace falta recuperarla.
 */
export function Origen() {
  return (
    <section className="nos-origen">
      <MediaSlot
        className="nos-origen__media"
        label={ORIGEN.imageNote}
        src={ORIGEN.image}
        alt={ORIGEN.alt}
        ratio="4 / 3"
        sizes="(max-width: 900px) 100vw, 45vw"
      />
      <div className="nos-origen__body">
        <h2 className="nos-origen__title">{ORIGEN.title}</h2>
        {ORIGEN.parrafos.map((parrafo) => (
          <p key={parrafo.slice(0, 24)}>{parrafo}</p>
        ))}
      </div>
    </section>
  );
}
