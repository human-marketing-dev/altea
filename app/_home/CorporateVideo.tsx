"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MediaSlot } from "@/app/ui";
import { useMovimientoReducido } from "@/app/ui/useMovimientoReducido";
import { VIDEO } from "./content";

/**
 * Video corporativo. Mientras no haya URL se muestra el hueco etiquetado.
 *
 * CONTROLES PROPIOS, no el atributo `controls` nativo. La barra del navegador
 * es distinta en cada uno y sobre un video a sangre se lee como un elemento
 * ajeno al sitio; y el resto de los controles de Altea —las flechas del slider,
 * las miniaturas del showcase, el cerrar del diálogo— ya comparten una chapa de
 * ink translúcido con desenfoque. Lo que se paga por eso es el teclado y el
 * foco, y aquí sale gratis: son dos <button> de verdad, así que espacio y Enter
 * los activan y el `:focus-visible` es el mismo del resto.
 */
export function CorporateVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const reducido = useMovimientoReducido();
  const [sonando, setSonando] = useState(false);
  const [conSonido, setConSonido] = useState(false);

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

  /* El estado se lee del elemento, no se adivina: el navegador puede pausar por
     su cuenta —ahorro de batería, pestaña en segundo plano— y los botones tienen
     que reflejarlo. */
  useEffect(() => {
    const nodo = video.current;
    if (!nodo) return;
    const sincronizar = () => {
      setSonando(!nodo.paused && !nodo.ended);
      setConSonido(!nodo.muted);
    };
    sincronizar();
    nodo.addEventListener("play", sincronizar);
    nodo.addEventListener("pause", sincronizar);
    nodo.addEventListener("volumechange", sincronizar);
    return () => {
      nodo.removeEventListener("play", sincronizar);
      nodo.removeEventListener("pause", sincronizar);
      nodo.removeEventListener("volumechange", sincronizar);
    };
  }, []);

  const alternarPausa = useCallback(() => {
    const nodo = video.current;
    if (!nodo) return;
    if (nodo.paused) void nodo.play();
    else nodo.pause();
  }, []);

  /* Sólo toca `muted`. No reinicia ni vuelve a llamar a play(): si el clip ya
     iba corriendo, activar el sonido no debe saltar al principio. */
  const alternarSonido = useCallback(() => {
    const nodo = video.current;
    if (!nodo) return;
    nodo.muted = !nodo.muted;
  }, []);

  return (
    <section className="home-video">
      <figure className="home-video__frame">
        {VIDEO.url ? (
          <>
            <video
              ref={video}
              className="home-video__player"
              src={VIDEO.url}
              poster={VIDEO.poster}
              /*
                `muted` SE QUEDA en el marcado: es lo que permite el arranque
                automático. El sonido se activa después, por JavaScript, desde
                el botón. Quitarlo de aquí rompería el autoplay en todos los
                navegadores.
              */
              muted
              loop
              /* Sin esto, iOS lo abre a pantalla completa al reproducir. */
              playsInline
              /* `metadata` y no `auto`: que no se descarguen 7 MB antes de que
                 la sección esté siquiera a la vista. */
              preload="metadata"
              autoPlay={!reducido}
            />

            <div className="home-video__controles">
              <button
                type="button"
                className="home-video__control"
                aria-label={sonando ? "Pausar video" : "Reproducir video"}
                onClick={alternarPausa}
              >
                {sonando ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M9 5v14M15 5v14" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M8 5l11 7-11 7z" fill="currentColor" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                className="home-video__control"
                aria-label={conSonido ? "Silenciar" : "Activar sonido"}
                aria-pressed={conSonido}
                onClick={alternarSonido}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    d="M4 9.5h3L12 5v14l-5-4.5H4z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  {conSonido ? (
                    <path
                      d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  ) : (
                    <path
                      d="M16.5 9.5l5 5M21.5 9.5l-5 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
              </button>
            </div>
          </>
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
