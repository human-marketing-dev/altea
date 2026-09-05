import { MediaSlot } from "@/app/ui";
import { QUE_HACEMOS_INTRO } from "./content";

/** Sección 4 — Introducción a "qué hacemos". Frase a sangre sobre imagen. */
export function QueHacemosIntro() {
  return (
    <section className="nos-intro">
      <div className="nos-intro__media" aria-hidden="true">
        <MediaSlot
          label={QUE_HACEMOS_INTRO.imageNote}
          src={QUE_HACEMOS_INTRO.image}
          alt=""
          tone="dark"
          sizes="100vw"
        />
      </div>
      <p className="nos-intro__phrase">
        {QUE_HACEMOS_INTRO.palabras.map((palabra, i) => (
          <span
            key={`${palabra}-${i}`}
            className={
              i === QUE_HACEMOS_INTRO.acento ? "nos-intro__acento" : undefined
            }
          >
            {palabra}
          </span>
        ))}
      </p>
    </section>
  );
}
