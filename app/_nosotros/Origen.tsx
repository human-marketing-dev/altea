import { MediaSlot } from "@/app/ui";
import { ORIGEN } from "./content";

/** Sección 2 — ¿Cómo nació Altea? Imagen a la izquierda, texto a la derecha. */
export function Origen() {
  return (
    <section className="nos-origen">
      <MediaSlot
        label={ORIGEN.imageNote}
        src={ORIGEN.image}
        alt=""
        ratio="4 / 3"
        sizes="(max-width: 900px) 100vw, 45vw"
        className="nos-origen__media"
      />
      <div className="nos-origen__body">
        <h2 className="nos-origen__title">{ORIGEN.title}</h2>
        {ORIGEN.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
    </section>
  );
}
