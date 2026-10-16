"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useRef } from "react";
import { CarruselFotos, MediaSlot } from "@/app/ui";
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
/*
 * EL ANCHO QUE SE PINTA, NO EL DE LA CAJA. Las fotos son más apaisadas que la
 * caja, así que `cover` las escala por el ALTO y su ancho pintado es la caja
 * por la proporción del archivo entre la de la caja. En dos columnas la caja es
 * cuadrada y mide ~41vw; en una es 4/3 y ~90vw. Con la del cine (1.74:1) sale
 * lo de antes: 71vw y 118vw. Declarar el ancho de la caja hacía que Next
 * sirviera una versión chica y la estirara: de ahí lo pixeleado de antes.
 */
const sizesDe = (ratio: number) => {
  const enDos = Math.max(1, ratio / 1);
  const enUna = Math.max(1, ratio / (4 / 3));
  return `(max-width: 900px) ${Math.round(90 * enUna)}vw, ${Math.round(41 * enDos)}vw`;
};

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

        {/* La caja de la foto. Con varias, un carrusel en la misma caja; con una,
            <MediaSlot>, que sin archivo rinde el hueco etiquetado: la marca
            prohíbe fotografía inventada, así que la sección se compone con el
            hueco en vez de romperse o de pedir prestada otra foto. La
            proporción no va en `ratio` sino en la hoja (.nos-origen__foto),
            porque cambia con el ancho: cuadrada en dos columnas, 4/3 en una. */}
        {ORIGEN.fotos.length > 1 ? (
          <CarruselFotos
            className="nos-origen__foto"
            fotos={ORIGEN.fotos}
            sizes={ORIGEN.fotos.map((foto) => sizesDe(foto.ratio))}
            etiqueta="Fotos de la historia de Altea"
          />
        ) : (
          <MediaSlot
            className="nos-origen__foto"
            label={ORIGEN.etiquetaFoto}
            src={ORIGEN.fotos[0]?.src}
            alt={ORIGEN.fotos[0]?.alt}
            sizes={ORIGEN.fotos[0] ? sizesDe(ORIGEN.fotos[0].ratio) : "100vw"}
          />
        )}
      </div>
    </section>
  );
}
