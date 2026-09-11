"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Fragment, useRef } from "react";
import { QUIENES_SOMOS } from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Grados por defecto si el CSS no declara --angulo. */
const ANGULO_BASE = 11;

/**
 * Recorte en paralelogramo con los dos bordes independientes, de 0 a 1.
 *
 * El recorrido va de un borde del paralelogramo al otro, NO de 0 al ancho del
 * contenedor: en p=0 el vértice superior está en dx y el inferior en 0; en p=1,
 * en w y w−dx. Con el recorrido de 0 a w, en reposo el vértice inferior
 * izquierdo cae en −dx, fuera de la caja, y lo que se ve es el borde recto del
 * contenedor — la imagen deja de ser un paralelogramo justo cuando está
 * completa, que es el único momento en que se la mira con calma.
 */
function recorte(el: HTMLElement, a: number, b: number, invertido: boolean, rad: number) {
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  const dx = Math.tan(rad) * h;

  const borde = (p: number) => dx + p * (w - dx);
  const f = (t: number) => (invertido ? 1 - t : t);
  const A = borde(f(a));
  const B = borde(f(b));
  const [x1, x2] = invertido ? [B, A] : [A, B];
  return `polygon(${x1}px 0, ${x2}px 0, ${x2 - dx}px 100%, ${x1 - dx}px 100%)`;
}

/**
 * Sección 5 — columna fija a la izquierda y bloques que pasan a la derecha.
 *
 * Cada imagen tiene su propio tramo de scroll con tres fases: se descubre, se
 * sostiene y se borra por donde entró. Todo con `scrub`, así que subir lo
 * revierte. La dirección alterna: el bloque 2 barre al contrario que el 1 y el
 * 3 — misma mecánica con el flag invertido, no un efecto distinto.
 */
export function QuienesSomos() {
  const raiz = useRef<HTMLElement>(null);
  const indice = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const nodo = raiz.current;
      if (!nodo) return;

      const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const grados =
        parseFloat(getComputedStyle(nodo).getPropertyValue("--angulo")) || ANGULO_BASE;
      const rad = (grados * Math.PI) / 180;

      const medios = gsap.utils.toArray<HTMLElement>(".js-media", nodo);

      /* --- El revelado ------------------------------------------------ */
      const pintarCompleto = () =>
        medios.forEach((el) => {
          el.style.clipPath = recorte(el, 0, 1, el.dataset.invertido === "true", rad);
        });

      if (reducido) {
        // Sin revelado: el paralelogramo completo desde el principio.
        pintarCompleto();
      } else {
        medios.forEach((el) => {
          const invertido = el.dataset.invertido === "true";
          const st = { a: 0, b: 0 };
          const pintar = () => {
            /* `a` nunca adelanta a `b`: si las dos fases llegaran a solaparse el
               polígono se invertiría y la imagen parpadearía. */
            el.style.clipPath = recorte(el, Math.min(st.a, st.b), st.b, invertido, rad);
          };
          pintar();

          /*
           * Dos triggers independientes anclados a la IMAGEN, no dos fases de
           * una fracción del bloque.
           *
           * Medido sobre el <article>, el mismo porcentaje se traduce en más o
           * menos scroll según lo alto que sea el bloque, y el punto de pantalla
           * en que la imagen queda completa se mueve con la longitud del
           * párrafo. Con las cuatro anclas relativas al viewport, las tres
           * quedan completas exactamente en el mismo sitio.
           *
           * El sostenido entre una fase y otra sale solo, y también es
           * constante: las tres imágenes miden igual porque comparten
           * aspect-ratio y ancho de columna.
           */
          gsap.to(st, {
            b: 1,
            ease: "none",
            onUpdate: pintar,
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "top 45%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });
          gsap.to(st, {
            a: 1,
            ease: "none",
            onUpdate: pintar,
            scrollTrigger: {
              trigger: el,
              start: "bottom 55%",
              end: "bottom 10%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });
        });
      }

      /* --- El índice de la izquierda ---------------------------------- */
      /* Se escribe directo en el DOM y no con estado de React: es decorativo y
         cambiarlo por estado dispararía un render en cada cruce de scroll. */
      gsap.utils.toArray<HTMLElement>(".js-bloque", nodo).forEach((bloque, i) => {
        ScrollTrigger.create({
          trigger: bloque,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive && indice.current) {
              indice.current.textContent = String(i + 1).padStart(2, "0");
            }
          },
        });
      });

      /*
       * El título, PALABRA por palabra y no letra por letra.
       *
       * Un <span> inline-block por letra desactiva el kerning entre ellas: cada
       * par pierde su ajuste óptico y la frase se ve suelta. El letter-spacing
       * negativo lo disimula pero no lo arregla, porque el problema no es el
       * tracking. Partiendo por palabra el kerning se conserva dentro de cada
       * una, que es donde se nota — y de paso son 11 nodos en vez de ~70.
       */
      if (!reducido) {
        gsap.from(gsap.utils.toArray<HTMLElement>(".js-palabra", nodo), {
          opacity: 0,
          yPercent: 110,
          stagger: 0.055,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: nodo, start: "top 75%", once: true },
        });
      }

      // El recorte va en píxeles: hay que rehacerlo cuando cambia la caja.
      const alRedimensionar = () => {
        if (reducido) pintarCompleto();
        else ScrollTrigger.refresh();
      };
      window.addEventListener("resize", alRedimensionar);
      return () => window.removeEventListener("resize", alRedimensionar);
    },
    { scope: raiz },
  );

  const { titulo, bloques } = QUIENES_SOMOS;

  return (
    <section ref={raiz} className="nos-quienes">
      <div className="nos-quienes__fijo">
        {/*
          El aria-label lleva la frase entera y cada palabra va aria-hidden: sin
          eso el lector anunciaría las once sueltas. Mismo tratamiento que el
          logotipo del hero.
        */}
        <h2 className="nos-quienes__titulo" aria-label={titulo}>
          {/*
            El espacio va como hermano del <span>, no dentro: JSX no renderiza el
            espacio entre elementos de un .map(), y uno al final de un
            inline-block se colapsa de todos modos.

            Dos atajos que parecen resolverlo y no sirven: un &nbsp; dentro del
            span da el espacio pero impide el salto de línea, y el título tiene
            que envolver en tres; y un margin-right inventa un ancho de espacio
            que no es el de la tipografía y se descuadra al cambiar de tamaño.
          */}
          {titulo.split(" ").map((palabra, i, todas) => (
            <Fragment key={i}>
              <span className="nos-quienes__palabra js-palabra" aria-hidden="true">
                {palabra}
              </span>
              {i < todas.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </h2>
        <p className="nos-quienes__indice" aria-hidden="true">
          <span ref={indice}>01</span> / {String(bloques.length).padStart(2, "0")}
        </p>
      </div>

      <div className="nos-quienes__bloques">
        {bloques.map((bloque, i) => (
          <article key={bloque.id} id={bloque.id} className="nos-quienes__bloque js-bloque">
            <span className="nos-quienes__numero" aria-hidden="true">
              {bloque.numero}
            </span>
            <h3 className="nos-quienes__titulo-bloque">{bloque.title}</h3>
            <p className="nos-quienes__texto">{bloque.description}</p>

            {/* El sobrante lateral de __foto evita que al mover el recorte se
                descubran las esquinas. `fill` + `cover`, nunca background-image:
                perdería el srcset. */}
            <div
              className="nos-quienes__media js-media"
              data-invertido={i === 1 ? "true" : "false"}
            >
              <div className="nos-quienes__foto">
                {bloque.image && (
                  <Image
                    src={bloque.image}
                    alt={bloque.alt ?? ""}
                    fill
                    /*
                      No es el ancho de la columna: la caja mide 2/1 y la foto
                      entra con `cover`. Las tres fuentes son 3/2, más altas que
                      la caja, así que el recorte lo manda el ANCHO — y la caja
                      llega a ~690px en 1440 y a ~750 en 1920, más el 10% del
                      sobrante lateral.
                    */
                    sizes="(max-width: 900px) 100vw, 58vw"
                  />
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
