"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useRef } from "react";
import { ORIGEN } from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Origen: cómo nació Altea.
 *
 * Rótulo pequeño, frase de apertura grande con el acento en coral-dark, regla
 * fina y los dos párrafos en columnas.
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
          scrollTrigger: { trigger: frase, start: "top 86%", end: "bottom 64%", scrub: 0.4 },
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
        scrollTrigger: { trigger: nodo.querySelector(".js-cols"), start: "top 84%", once: true },
      });
    },
    { scope: raiz },
  );

  return (
    <section className="nos-origen" ref={raiz} aria-labelledby="origen-titulo">
      <p className="nos-origen__rotulo" id="origen-titulo">
        {ORIGEN.title}
      </p>

      <p className="nos-origen__frase js-frase">
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
    </section>
  );
}
