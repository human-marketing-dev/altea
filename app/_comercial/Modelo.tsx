"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useRef } from "react";
import { DESCRIPCION_COMERCIAL } from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Nuestro modelo.
 *
 * El mismo tratamiento que Origen en /nosotros: rótulo pequeño, frase de apertura
 * grande con el acento en coral-dark, regla fina y los dos párrafos en columnas.
 * Dos secciones que cuentan lo mismo —de dónde viene esto— se componen igual, y
 * así el sitio se lee como un sitio.
 *
 * EL TERCER PÁRRAFO VA APARTE Y EN CUERPO MAYOR: es el remate con el dato, no un
 * párrafo más. Y sus dos cifras están derivadas de lib/proyectos.ts, no escritas
 * a mano, así que si entra un centro nuevo la frase no se queda mintiendo.
 *
 * ES EL ÚNICO SITIO DE LA PÁGINA donde el texto se enciende palabra por palabra.
 */
export function Modelo() {
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
          stagger: 0.04,
          ease: "none",
          scrollTrigger: { trigger: frase, start: "top 84%", end: "bottom 62%", scrub: 0.4 },
        });
      }
      /* Los párrafos entran con un desplazamiento corto: el encendido palabra por
         palabra es el recurso de la frase y no se reparte. */
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

  const { apertura } = DESCRIPCION_COMERCIAL;
  /* La frase va partida en tres para poder acentuar el centro, y cada parte se
     reparte en palabras. Los espacios viven DENTRO de las cadenas del contenido,
     así que la frase copiada sale entera. */
  const trozos: { texto: string; acento?: boolean }[] = [
    { texto: apertura.antes },
    { texto: apertura.acento, acento: true },
    { texto: apertura.despues },
  ];

  return (
    <section className="com-modelo" ref={raiz} aria-labelledby="modelo-rotulo">
      <p className="com-modelo__rotulo" id="modelo-rotulo">
        {DESCRIPCION_COMERCIAL.eyebrow}
      </p>

      <p className="com-modelo__frase js-frase">
        {trozos.map((trozo, i) =>
          trozo.texto
            .split(" ")
            .filter(Boolean)
            .map((palabra, j, palabras) => (
              <Fragment key={`${i}-${j}`}>
                <span
                  className={
                    trozo.acento
                      ? "com-modelo__palabra js-palabra com-modelo__palabra--acento"
                      : "com-modelo__palabra js-palabra"
                  }
                >
                  {palabra}
                </span>
                {j < palabras.length - 1 || i < trozos.length - 1 ? " " : ""}
              </Fragment>
            )),
        )}
      </p>

      <div className="com-modelo__regla" aria-hidden="true" />

      <div className="com-modelo__cols js-cols">
        {DESCRIPCION_COMERCIAL.parrafos.map((parrafo) => (
          <p className="js-parrafo" key={parrafo.slice(0, 24)}>
            {parrafo}
          </p>
        ))}
      </div>

      <p className="com-modelo__cierre">{DESCRIPCION_COMERCIAL.cierre}</p>
    </section>
  );
}
