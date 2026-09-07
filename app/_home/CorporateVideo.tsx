"use client";

import { useEffect, useRef } from "react";
import { MediaSlot } from "@/app/ui";
import { useMovimientoReducido } from "@/app/ui/useMovimientoReducido";
import { VIDEO } from "./content";

/** Video corporativo. Mientras no haya URL se muestra el hueco etiquetado. */
export function CorporateVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const reducido = useMovimientoReducido();

  /*
   * Con movimiento reducido el clip no se reproduce solo. `autoPlay` ya sale en
   * false, pero el snapshot de servidor del hook es `false` para no depender del
   * cliente al pintar: el HTML llega con el atributo puesto y el navegador puede
   * haber arrancado antes de que hidrate. Esto lo devuelve al primer cuadro, que
   * es la misma imagen del poster.
   */
  useEffect(() => {
    const nodo = video.current;
    if (!nodo || !reducido) return;
    nodo.pause();
    nodo.currentTime = 0;
  }, [reducido]);

  return (
    <section className="home-video">
      <figure className="home-video__frame">
        {VIDEO.url ? (
          <video
            ref={video}
            className="home-video__player"
            src={VIDEO.url}
            poster={VIDEO.poster}
            /* El clip no trae pista de audio, pero `muted` va igual: el
               navegador decide si permite el autoplay por el atributo, no por
               el contenido del archivo. */
            muted
            loop
            /* Sin esto, iOS lo abre a pantalla completa al reproducir. */
            playsInline
            /* `metadata` y no `auto`: que no se descarguen 7 MB antes de que la
               sección esté siquiera a la vista. */
            preload="metadata"
            autoPlay={!reducido}
            /* Sin autoplay hace falta una forma de arrancarlo a mano. */
            controls={reducido}
          />
        ) : (
          <>
            <MediaSlot label={VIDEO.caption} ratio="21 / 9" sizes="100vw" />
            <span className="home-video__play" aria-hidden="true" />
          </>
        )}
        <figcaption className="sr-only">{VIDEO.caption}</figcaption>

        {/*
          PENDIENTE: aquí cuelga el enlace de "ver completo" cuando el video con
          audio esté en Vimeo. Va como hermano del <video> dentro del <figure>,
          así que no hay que rehacer nada de la sección para meterlo:
          <div className="home-video__acciones"><a href={VIDEO.urlCompleta}>…</a></div>
        */}
      </figure>
    </section>
  );
}
