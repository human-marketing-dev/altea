"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { OTROS_GIROS } from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Grados por defecto si el CSS no declara --angulo. */
const ANGULO_BASE = 11;
/**
 * Por debajo de aquí los paneles se apilan y no hay diagonales.
 *
 * TIENE QUE COINCIDIR con el @media de comercial.css: si el JS sigue calculando
 * recortes por encima del ancho al que el CSS ya apiló, los paneles quedan con
 * clip-path y margen negativo puestos en una columna.
 */
const MOVIL = "(max-width: 1200px)";

/**
 * Hoteles, hospital y educación: una sola banda de tres paneles en
 * paralelogramo sobre ink.
 *
 * Sustituye a las tres filas alternadas, que al cliente se le hicieron largas.
 * El contenido es el mismo.
 *
 * El recurso principal es el NÚMERO calado que rompe el borde inferior del
 * panel: los valores negativos de su posición no son un error. Lo demás —el
 * título, la línea coral que crece, el párrafo que se despliega— se apoya en él.
 *
 * El corte diagonal y la costura de 5px usan el mismo mecanismo que los paneles
 * de proyectos: el desplazamiento sale del alto real de la celda, así que no se
 * puede escribir en el CSS y se calcula aquí, al montar y en cada resize.
 */
export function BandaGiros() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const nodo = raiz.current;
      if (!nodo) return;
      const piezas = gsap.utils.toArray<HTMLElement>(".js-panel", nodo);
      if (!piezas.length) return;

      /* --- El recorte y la costura ------------------------------------ */
      const medir = () => {
        const movil = window.matchMedia(MOVIL).matches;
        const estilo = getComputedStyle(nodo);
        const costura = parseFloat(estilo.getPropertyValue("--costura")) || 5;
        const rad =
          ((parseFloat(estilo.getPropertyValue("--angulo")) || ANGULO_BASE) * Math.PI) / 180;

        piezas.forEach((p, i) => {
          if (movil) {
            /* Apilados no hay diagonal: el hueco lo pone el `gap` del CSS. */
            p.style.clipPath = "";
            p.style.marginLeft = "";
            p.style.removeProperty("--dx-izq");
            p.style.removeProperty("--dx-der");
            return;
          }
          const dx = Math.tan(rad) * p.offsetHeight;
          const primero = i === 0;
          const ultimo = i === piezas.length - 1;
          const ini = primero ? 0 : dx;
          const fin = ultimo ? 0 : dx;
          p.style.clipPath = `polygon(${ini}px 0, 100% 0, calc(100% - ${fin}px) 100%, 0 100%)`;
          /*
            El margen negativo es lo que produce la separación. El hueco entre
            dos diagonales paralelas no es el margen de la caja: es el margen MÁS
            el desplazamiento de la diagonal. Solapando `dx - costura` queda la
            costura justa, igual a lo largo de toda la altura.
          */
          p.style.marginLeft = primero ? "0px" : `${-(dx - costura)}px`;
          /*
            Y se publican los DOS desplazamientos para el CSS, uno por lado.
            Sin ellos el texto se comía las cuñas que el recorte corta:
              · abajo a la derecha, donde se perdían las últimas líneas;
              · arriba a la izquierda, donde el título se metía en la cuña al
                subir empujado por el párrafo desplegado.
            Cada panel sólo paga el lado que tiene cortado: el primero va recto
            por la izquierda y el último por la derecha.
          */
          p.style.setProperty("--dx-izq", `${primero ? 0 : dx}px`);
          p.style.setProperty("--dx-der", `${ultimo ? 0 : dx}px`);
        });
      };
      medir();
      window.addEventListener("resize", medir);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return () => window.removeEventListener("resize", medir);
      }

      /* --- Parallax, cada panel a su velocidad ------------------------ */
      /*
        Las velocidades distintas son lo que evita que la banda se lea como tres
        rectángulos quietos. No igualarlas.
      */
      piezas.forEach((p, i) => {
        const foto = p.querySelector<HTMLElement>(".js-foto");
        if (!foto) return;
        gsap.fromTo(
          foto,
          { yPercent: -4 - i * 1.5 },
          {
            yPercent: 4 + i * 1.5,
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
      });

      /* --- Entrada escalonada, una sola vez --------------------------- */
      gsap.from(piezas, {
        yPercent: 14,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: nodo, start: "top 78%", once: true },
      });

      return () => window.removeEventListener("resize", medir);
    },
    { scope: raiz },
  );

  return (
    <section ref={raiz} className="com-banda-giros">
      <header className="com-banda-giros__cabecera">
        <div className="com-banda-giros__encabezado">
          <p className="com-banda-giros__eyebrow">
            <span className="com-banda-giros__marca" aria-hidden="true" />
            {OTROS_GIROS.eyebrow}
          </p>
          <h2 className="com-banda-giros__titulo">{OTROS_GIROS.titulo}</h2>
        </div>
        {OTROS_GIROS.nota && (
          <p className="com-banda-giros__nota">{OTROS_GIROS.nota}</p>
        )}
      </header>

      <div className="com-banda-giros__pista">
        {OTROS_GIROS.bloques.map((giro) => (
          <article key={giro.id} id={giro.id} className="com-banda-giros__panel js-panel">
            <div className="com-banda-giros__foto js-foto">
              <Image
                src={giro.image}
                alt={giro.alt}
                fill
                sizes="(max-width: 900px) 100vw, 34vw"
              />
            </div>
            <span className="com-banda-giros__velo" aria-hidden="true" />

            {/* Decorativo: el orden ya lo lleva el DOM. */}
            <span className="com-banda-giros__num" aria-hidden="true">
              {giro.numero}
            </span>

            <div className="com-banda-giros__txt">
              <h3 className="com-banda-giros__giro">{giro.title}</h3>
              <span className="com-banda-giros__linea" aria-hidden="true" />
              <div className="com-banda-giros__desc">
                <p>{giro.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
