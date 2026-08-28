import { MediaSlot } from "@/app/ui";
import { VIDEO } from "./content";

/** Video corporativo. Mientras no haya URL se muestra el hueco etiquetado. */
export function CorporateVideo() {
  return (
    <section className="home-video">
      <figure className="home-video__frame">
        {VIDEO.url ? (
          <video
            className="home-video__player"
            src={VIDEO.url}
            poster={VIDEO.poster}
            controls
            preload="metadata"
          />
        ) : (
          <>
            <MediaSlot label={VIDEO.caption} ratio="16 / 9" />
            <span className="home-video__play" aria-hidden="true" />
          </>
        )}
        <figcaption className="sr-only">{VIDEO.caption}</figcaption>
      </figure>
    </section>
  );
}
