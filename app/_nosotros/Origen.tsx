"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useRef } from "react";
import { MediaSlot } from "@/app/ui";
import { ORIGEN } from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Origen: cómo nació Altea.
 *
 * A DOS COLUMNAS: el texto a la izquierda y la foto a la derecha, centrados
 * entre sí. Dentro de la columna de texto, la frase de apertura con el acento
 * en coral-dark —que es también el nombre de la sección—, la regla fina y los dos párrafos
 * APILADOS — en media página, dos columnas de texto darían renglones de unos
 * treinta caracteres.
 *
 * ES EL ÚNICO SITIO DE LA PÁGINA donde el texto se enciende palabra por palabra.
 * Repetirlo en otra sección lo convierte en un tic — en el home el mismo recurso
 * aparece dos veces y no más, y aquí una.
 */
export function Origen() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const nodo = raiz.current;
      if (!nodo) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const frase = nodo.querySelector<HTMLElement>(".js-frase");
      if (frase) {
        gsap.from(gsap.utils.toArray<HTMLElement>(".js-palabra", nodo), {
          opacity: 0.16,
          stagger: 0.03,
          ease: "none",
          scrollTrigger: {
            trigger: frase,
            start: "top 86%",
            end: "bottom 64%",
            scrub: 0.4,
          },
        });
      }

      /* Los párrafos entran con un desplazamiento corto, no palabra por palabra:
         ése es el recurso de la frase y no se reparte. */
      gsap.from(gsap.utils.toArray<HTMLElement>(".js-parrafo", nodo), {
        opacity: 0,
        y: 18,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: nodo.querySelector(".js-cols"),
          start: "top 84%",
          once: true,
        },
      });
    },
    { scope: raiz },
  );

  return (
    <section className="nos-origen" ref={raiz} aria-labelledby="origen-titulo">
      <div className="nos-origen__grid">
        <div className="nos-origen__txt">
          {/* Sin rótulo encima: se quitó "¿Cómo nació Altea?". La frase es lo
              que nombra la sección, así que el aria-labelledby apunta a ella. */}
          <p className="nos-origen__frase js-frase" id="origen-titulo">
            {/* El espacio va como hermano del <span> y no lo pone el CSS: si el hueco
            lo diera un `gap`, la frase copiada saldría toda pegada. */}
            {ORIGEN.frase.map((trozo, i, todos) =>
              trozo.texto.split(" ").map((palabra, j, palabras) => (
                <Fragment key={`${i}-${j}`}>
                  <span
                    className={
                      trozo.acento
                        ? "nos-origen__palabra js-palabra nos-origen__palabra--acento"
                        : "nos-origen__palabra js-palabra"
                    }
                  >
                    {palabra}
                  </span>
                  {j < palabras.length - 1 || i < todos.length - 1 ? " " : ""}
                </Fragment>
              )),
            )}
          </p>

          <div className="nos-origen__regla" aria-hidden="true" />

          <div className="nos-origen__cols js-cols">
            {ORIGEN.parrafos.map((parrafo) => (
              <p className="js-parrafo" key={parrafo.slice(0, 24)}>
                {parrafo}
              </p>
            ))}
          </div>
        </div>

        {/* La caja de la foto. Sin archivo, <MediaSlot> rinde el hueco etiquetado:
            la marca prohíbe fotografía inventada, así que la sección se compone
            con el hueco en vez de romperse o de pedir prestada otra foto. La
            proporción no va en `ratio` sino en la hoja (.nos-origen__foto),
            porque cambia con el ancho: cuadrada en dos columnas, 4/3 en una. */}
        <MediaSlot
          className="nos-origen__foto"
          label={ORIGEN.foto.label}
          src={ORIGEN.foto.src}
          alt={ORIGEN.foto.alt}
          /*
           * EL ANCHO QUE SE PINTA, NO EL DE LA CAJA. La foto es horizontal
           * (1.74:1) y la caja no, así que `cover` la escala por el ALTO y su
           * ancho pintado es la caja por 1.74 —por 1.30 en la 4/3 del móvil—.
           * En dos columnas la caja cuadrada mide ~41vw, así que la foto se
           * pinta a ~71vw; en una, a ~118vw. Declarar el ancho de la caja hacía
           * que Next sirviera una versión chica y la estirara: de ahí lo
           * pixeleado de antes.
           */
          sizes="(max-width: 900px) 118vw, 71vw"
        />
      </div>
    </section>
  );
}
