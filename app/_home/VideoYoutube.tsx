"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMovimientoReducido } from "@/app/ui/useMovimientoReducido";
import { VIDEO } from "./content";

/**
 * El video institucional completo, desde YouTube (29 oct 2026).
 *
 * Sustituye a <CorporateVideo> —el clip local de 20 s en bucle—, que se queda
 * entero en _home/ con sus archivos en /public: para volver, se quita
 * `VIDEO.youtube` en content.ts y nada más.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * LO QUE SE PERDIÓ AL CAMBIAR, Y POR QUÉ
 *
 * · EL PARALLAX. Iba sobre el propio <video>, que medía 112 % de la caja con
 *   `object-fit: cover` y se deslizaba dentro. Un iframe no tiene `cover`: para
 *   imitarlo habría que hacerlo más grande que la caja y recortarlo, y lo que se
 *   recorta abajo es la barra de controles de YouTube.
 * · EL BOTÓN DE PAUSA PROPIO. La pausa, el avance y la pantalla completa van en
 *   la barra de abajo de YouTube, que queda dentro de la caja. El de SONIDO sí
 *   se repuso: el de YouTube va arriba y el recorte lo deja fuera (ver 3).
 *
 * A SANGRE Y ANCLADO ABAJO, con el alto de siempre: el iframe va a todo el
 * ancho en 16:9, pegado al borde de abajo de la caja, y la caja lo recorta por
 * arriba. Así todo el recorte se va arriba y la barra de controles queda
 * dentro. Ver .home-video__yt en home.css.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * CUÁNDO CARGA Y CUÁNDO SUENA
 *
 * · EL IFRAME SE MONTA AL ACERCARSE la sección, no con la página: el
 *   reproductor son entre 500 KB y 1 MB de JavaScript que, si no, pagaría quien
 *   nunca baja hasta aquí. Mientras tanto se ve el póster, en la misma caja.
 * · ARRANCA SOLO Y EN SILENCIO (`mute=1`): ningún navegador deja arrancar con
 *   audio sin una interacción previa. Con movimiento reducido no arranca solo.
 * · SE PAUSA AL SALIR DE PANTALLA, para que el audio no siga sonando desde una
 *   sección que ya no se ve, y sigue al volver —sólo si lo pausamos nosotros: si
 *   lo pausó el visitante, se queda en pausa—.
 *
 * SIN SUBTÍTULOS AUTOMÁTICOS. El video no tiene pista subida por Altea, sólo
 * la que genera YouTube («Español (generado automáticamente)»), y con el
 * navegador en español y el video en silencio YouTube la enciende sola.
 * `cc_load_policy=0` no la quita (probado); se descarga el módulo de
 * subtítulos en cuanto el reproductor responde. El visitante puede volver a
 * encenderlos con el botón CC. Si un día Altea sube su propia pista, esto se
 * quita.
 *
 * Todo eso va por `postMessage` con `enablejsapi=1`, sin la librería
 * `iframe_api` de YouTube: es peso de más por algo que se resuelve con tres
 * mensajes.
 */

const YT = "https://www.youtube-nocookie.com";

/** Los estados del reproductor que interesan, como los manda YouTube. */
const REPRODUCIENDO = 1;

export function VideoYoutube() {
  const raiz = useRef<HTMLElement>(null);
  const marco = useRef<HTMLIFrameElement>(null);
  const reducido = useMovimientoReducido();
  const [montado, setMontado] = useState(false);
  /* El iframe entra sobre el póster cuando ya cargó, no antes: así nunca se ve
     un rectángulo vacío mientras llega. */
  const [listo, setListo] = useState(false);
  /* El sonido como lo reporta YouTube, no como lo dejó el último clic: si el
     visitante lo cambia en pantalla completa, al salir el botón ya lo sabe. */
  const [conSonido, setConSonido] = useState(false);
  const [respondio, setRespondio] = useState(false);
  /* Si el recorte de arriba tapa el volumen de YouTube. Ver el botón, abajo. */
  const [tapado, setTapado] = useState(false);
  const mandarRef = useRef<(func: string, args?: unknown[]) => void>(() => {});

  /* 1 · Se monta cuando falta una pantalla y media para que entre. */
  useEffect(() => {
    const nodo = raiz.current;
    if (!nodo || !VIDEO.youtube) return;
    const cerca = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setMontado(true);
        cerca.disconnect();
      },
      { rootMargin: "150% 0px" },
    );
    cerca.observe(nodo);
    return () => cerca.disconnect();
  }, []);

  /* 2 · Pausa al salir y sigue al volver. */
  useEffect(() => {
    const nodo = raiz.current;
    const iframe = marco.current;
    if (!montado || !nodo || !iframe) return;

    let estado = -1;
    let visible = false;
    let pausadoAlSalir = false;
    /* Como se monta antes de verse, el autoplay arranca fuera de pantalla y lo
       primero que hace esto es pausarlo. La primera vez que se ve, vuelve al
       segundo 0: el visitante no se pierde el arranque. */
    let visto = false;
    let sinSubtitulos = false;

    const mandar = (func: string, args: unknown[] = []) =>
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args }),
        YT,
      );
    mandarRef.current = mandar;

    /*
     * EL SALUDO. YouTube sólo informa del estado a quien se anuncia con
     * `listening`, y si el mensaje llega antes de que el reproductor esté listo
     * se pierde. Se repite cada cuarto de segundo hasta la primera respuesta.
     */
    let hayRespuesta = false;
    const saludo = window.setInterval(() => {
      if (hayRespuesta) return window.clearInterval(saludo);
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: "listening", id: "altea-video", channel: "widget" }),
        YT,
      );
    }, 250);

    const alMensaje = (e: MessageEvent) => {
      if (e.source !== iframe.contentWindow || typeof e.data !== "string") return;
      let datos: { info?: { playerState?: number; muted?: boolean } };
      try {
        datos = JSON.parse(e.data);
      } catch {
        return;
      }
      if (!hayRespuesta) setRespondio(true);
      hayRespuesta = true;
      /* YouTube manda `muted` cada vez que cambia, también desde su propio
         botón o en pantalla completa. */
      if (typeof datos.info?.muted === "boolean") setConSonido(!datos.info.muted);
      const s = datos.info?.playerState;
      if (typeof s !== "number") return;
      estado = s;
      /* Al empezar a reproducir, que es cuando YouTube carga los subtítulos:
         antes, el módulo puede no estar y la orden se perdería. */
      if (s === REPRODUCIENDO && !sinSubtitulos) {
        mandar("unloadModule", ["captions"]);
        sinSubtitulos = true;
      }
      if (s === REPRODUCIENDO && !visible) {
        mandar("pauseVideo");
        pausadoAlSalir = true;
      }
    };
    window.addEventListener("message", alMensaje);

    const vista = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!visible && estado === REPRODUCIENDO) {
        mandar("pauseVideo");
        pausadoAlSalir = true;
      }
      if (visible && pausadoAlSalir) {
        if (!visto) mandar("seekTo", [0, true]);
        mandar("playVideo");
        pausadoAlSalir = false;
      }
      if (visible) visto = true;
    });
    vista.observe(nodo);

    return () => {
      window.clearInterval(saludo);
      window.removeEventListener("message", alMensaje);
      vista.disconnect();
      mandarRef.current = () => {};
    };
  }, [montado]);

  /*
   * 3 · ¿TAPA EL RECORTE EL VOLUMEN DE YOUTUBE? Su botón de sonido va en la
   * franja de ARRIBA del reproductor (de 0 a 48 px), y el recorte se lleva
   * justo eso: 116 px a 1440 × 789, 540 a 2560. En teléfono no se recorta nada
   * y en ventanas muy altas para su ancho se recorta poco, y ahí el de YouTube
   * se ve. Se mide la caja, no el ancho de pantalla: lo que decide es el alto.
   *
   * ⚠ EL UMBRAL ES 16 Y NO 48, A PROPÓSITO (29 oct 2026). Con 48, de 16 a 48 px
   * de recorte —a 1440, ventanas de unos 850 a 900 de alto— el de YouTube
   * quedaba partido a la mitad y el nuestro no salía. Mejor que el nuestro
   * aparezca un poco antes de hacer falta que tarde.
   */
  useEffect(() => {
    const caja = raiz.current?.querySelector<HTMLElement>(".home-video__frame");
    const yt = raiz.current?.querySelector<HTMLElement>(".home-video__yt");
    if (!caja || !yt) return;
    const medir = () => setTapado(yt.offsetHeight - caja.clientHeight >= 16);
    const obs = new ResizeObserver(medir);
    obs.observe(caja);
    obs.observe(yt);
    return () => obs.disconnect();
  }, []);

  if (!VIDEO.youtube) return null;

  const parametros = new URLSearchParams({
    autoplay: reducido ? "0" : "1",
    mute: "1",
    controls: "1",
    playsinline: "1",
    /* Al acabar, sugerencias sólo del canal de Altea. */
    rel: "0",
    enablejsapi: "1",
    ...(montado ? { origin: window.location.origin } : {}),
  });

  return (
    <section className="home-video" ref={raiz}>
      <figure className="home-video__frame">
        <div className="home-video__yt" data-listo={listo ? "" : undefined}>
          {VIDEO.poster && (
            <Image
              src={VIDEO.poster}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 1600px"
              className="home-video__poster"
              /* Ya es un WebP de 26 KB a 1600: recomprimirlo no gana nada. */
              unoptimized
            />
          )}
          {montado && (
            <iframe
              ref={marco}
              className="home-video__iframe"
              src={`${YT}/embed/${VIDEO.youtube}?${parametros}`}
              title={VIDEO.titulo}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              /*
                SIN allow-popups: NADA SE ABRE EN OTRA PESTAÑA. El reproductor
                trae enlaces a youtube.com —el título, el canal, el logo, «Más
                videos»— que no se quitan con parámetros. Así no abren nada ni
                sacan al iframe del video. Probado: reproduce, pausa y sigue igual.
              */
              sandbox="allow-scripts allow-same-origin allow-presentation"
              /* YouTube rechaza el embed sin referrer (error 153). */
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => setListo(true)}
            />
          )}
        </div>
        {/*
          EL ÚNICO CONTROL PROPIO: EL SONIDO. Es el único de YouTube que el
          recorte deja fuera; la pausa, el avance y la pantalla completa van en
          su barra de abajo, que queda dentro. La misma chapa que tenían los dos
          botones del clip local, con uno solo. El nombre dice lo que HACE —no
          en qué estado está—, y el icono, cómo suena ahora.
        */}
        {respondio && tapado && (
          <div className="home-video__controles home-video__controles--arriba">
            <button
              type="button"
              className="home-video__control"
              aria-label={conSonido ? "Silenciar video" : "Activar sonido del video"}
              onClick={() => mandarRef.current(conSonido ? "mute" : "unMute")}
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
        )}
        <figcaption className="sr-only">{VIDEO.caption}</figcaption>
      </figure>
    </section>
  );
}
