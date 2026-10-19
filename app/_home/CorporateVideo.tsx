"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
import { MediaSlot } from "@/app/ui";
import { useMovimientoReducido } from "@/app/ui/useMovimientoReducido";
import { VIDEO } from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);


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
  const raiz = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reducido = useMovimientoReducido();

  /*
   * Parallax suave: el clip se desplaza dentro de su caja mientras la sección
   * cruza la pantalla. Es un 10% de recorrido sobre un 112% de alto, así que
   * nunca asoma el fondo por arriba ni por abajo — ver .home-video__player.
   *
   * Va aparte del resto de efectos del componente porque no tiene nada que ver
   * con la reproducción: si mañana se quita el parallax, los controles siguen.
   */
  useGSAP(
    () => {
      const nodo = raiz.current;
      if (!nodo || reducido) return;
      const clip = nodo.querySelector<HTMLElement>(".home-video__player");
      if (!clip) return;
      gsap.fromTo(
        clip,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: nodo,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    /* revertOnUpdate: sin él, al pasar `reducido` a true tras hidratar el
       parallax de la primera pasada seguía vivo. Ver HeroA. */
    { scope: raiz, dependencies: [reducido], revertOnUpdate: true },
  );
  const [sonando, setSonando] = useState(false);
  const [conSonido, setConSonido] = useState(false);

  /*
   * ⚠ EL VIDEO SE PIDE CUANDO LA SECCIÓN SE ACERCA, NO CON EL HTML (octubre de
   * 2026). Con `autoPlay` en el marcado el navegador ignoraba `preload` y
   * empezaba a bajar los 14.5 MB al leer el HTML —el 94 % del peso del home—,
   * compitiendo con el hero, que está tres pantallas antes. Ahora el <video>
   * llega SIN `src` y con `preload="none"`, y esto le pone la fuente cuando
   * falta un par de pantallas para que entre: a esa distancia el primer cuadro
   * llega antes de que se vea, así que en pantalla no cambia nada.
   *
   * Con movimiento reducido se carga igual —el usuario puede darle a
   * reproducir— pero no arranca solo.
   */
  const cargado = useRef(false);
  const cargar = useCallback(() => {
    const nodo = video.current;
    if (!nodo || cargado.current || !VIDEO.url) return;
    cargado.current = true;
    /* En teléfono, la de 720p: misma imagen a ese ancho, un tercio del peso.
       Ver `urlMovil` en content.ts. */
    const movil = window.matchMedia("(max-width: 600px)").matches;
    nodo.src = (movil && VIDEO.urlMovil) || VIDEO.url;
    nodo.preload = "auto";
  }, []);

  useEffect(() => {
    const nodo = video.current;
    if (!nodo) return;
    const vista = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        cargar();
        if (!reducido) nodo.play().catch(() => {});
        vista.disconnect();
      },
      { rootMargin: "200% 0px" },
    );
    vista.observe(nodo);
    return () => vista.disconnect();
  }, [cargar, reducido]);

  /* Con movimiento reducido no se reproduce solo, y si la preferencia cambia
     con la página abierta, se detiene en el primer cuadro (el del póster). */
  useEffect(() => {
    const nodo = video.current;
    if (!nodo || !reducido) return;
    nodo.pause();
    if (cargado.current) nodo.currentTime = 0;
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
    cargar();
    if (nodo.paused) nodo.play().catch(() => {});
    else nodo.pause();
  }, [cargar]);

  /* Sólo toca `muted`. No reinicia ni vuelve a llamar a play(): si el clip ya
     iba corriendo, activar el sonido no debe saltar al principio. */
  const alternarSonido = useCallback(() => {
    const nodo = video.current;
    if (!nodo) return;
    nodo.muted = !nodo.muted;
  }, []);

  return (
    <section className="home-video" ref={raiz}>
      <figure className="home-video__frame">
        {VIDEO.url ? (
          <>
            <video
              ref={video}
              className="home-video__player"
              /* Sin `src`: la pone `cargar` cuando la sección se acerca. */
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
              /* `none` y sin `autoPlay`: con autoPlay el navegador ignora
                 `preload` y baja el archivo entero al leer el HTML. El arranque
                 lo da el observador de arriba. */
              preload="none"
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
