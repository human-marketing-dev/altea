import { MediaSlot } from "@/app/ui";
import { VIDEO } from "./content";

/** Video corporativo. Mientras no haya URL se muestra el hueco etiquetado. */
export function CorporateVideo() {
  return (
    <section className="home-video">
      <figure className="home-video__frame">
        {VIDEO.url ? (
          /* autoPlay exige muted: ningún navegador arranca video con sonido
             sin interacción. playsInline evita que iOS lo abra a pantalla
             completa. Se dejan los controles para poder activar el audio. */
          <video
            className="home-video__player"
            src={VIDEO.url}
            poster={VIDEO.poster}
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
          />
        ) : (
          <>
            <MediaSlot
              label={VIDEO.caption}
              ratio="21 / 9"
              sizes="100vw"
            />
            <span className="home-video__play" aria-hidden="true" />
          </>
        )}
        <figcaption className="sr-only">{VIDEO.caption}</figcaption>
      </figure>
    </section>
  );
}
