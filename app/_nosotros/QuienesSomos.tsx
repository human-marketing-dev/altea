"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { MediaSlot } from "@/app/ui";
import type { IconoQuienes } from "./content";
import { QUIENES_SOMOS } from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Grados por defecto si el CSS no declara --angulo. */
const ANGULO_BASE = 11;

/**
 * Iconos de los tres bloques.
 *
 * ⚠ PROVISIONALES Y SUSTITUIBLES. Altea no tiene set propio, así que están
 * dibujados en el estilo de casa —caja de 24, trazo de 1.7, sin relleno, mismas
 * terminaciones que los de contacto y redes en app/ui/Iconos.tsx—. Cuando llegue
 * el definitivo se sustituye este objeto y nada más: el componente sólo lo
 * indexa. Decorativos: el significado lo lleva el título de al lado.
 */
const ICONOS_GIRO: Record<IconoQuienes, React.ReactNode> = {
  /* Lupa sobre una retícula: leer el terreno antes de dibujar nada. */
  analisis: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M3 8h7M3 13h4M3 18h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="15.5" cy="12.5" r="5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M19.2 16.2 22 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  /* Tres nodos unidos: las disciplinas trabajando como un solo equipo. */
  equipo: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <circle cx="12" cy="5" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="5" cy="17.5" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="19" cy="17.5" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M10.4 7 6.6 15.4M13.6 7l3.8 8.4M7.4 17.5h9.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  ),
  /* Volúmenes que se traban: usos distintos en un mismo desarrollo. */
  ecosistema: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <rect x="3" y="12" width="8" height="9" stroke="currentColor" strokeWidth="1.7" />
      <rect x="11" y="7" width="6" height="14" stroke="currentColor" strokeWidth="1.7" />
      <rect x="17" y="3" width="4" height="18" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
};

/**
 * Sección 5 — Quiénes somos. Lista de tres filas con imagen alta a la derecha.
 *
 * La versión de tres columnas con el icono arriba se veía plana: el icono suelto
 * sobre un fondo liso no pesaba nada y el título largo del primer bloque se iba
 * a cinco líneas. En lista, el icono va dentro de una caja en paralelogramo —que
 * es lo que le da presencia— y el título dispone de ancho.
 *
 * La franja diagonal del fondo es el mismo recurso que lleva la banda de giros
 * de /comercial: las dos secciones se leen como familia.
 */
export function QuienesSomos() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const nodo = raiz.current;
      if (!nodo) return;

      /*
       * El sesgo de las cajas de icono se calcula sobre su alto real, que sale
       * de un clamp en vw: no se puede escribir en el CSS. El ángulo se lee de
       * --angulo para que no haya un 11 suelto.
       */
      const cajas = gsap.utils.toArray<HTMLElement>(".js-ico", nodo);
      const medir = () => {
        const grados =
          parseFloat(getComputedStyle(nodo).getPropertyValue("--angulo")) || ANGULO_BASE;
        const rad = (grados * Math.PI) / 180;
        cajas.forEach((c) => {
          c.style.setProperty("--d", `${Math.tan(rad) * c.offsetHeight}px`);
        });
      };
      medir();
      window.addEventListener("resize", medir);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return () => window.removeEventListener("resize", medir);
      }

      /*
       * Parallax de la columna de foto. Sin él, una columna tan alta y quieta se
       * lee como un rectángulo de color pegado al lado, no como parte de la
       * sección.
       */
      const foto = nodo.querySelector<HTMLElement>(".js-foto");
      if (foto) {
        gsap.fromTo(
          foto,
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
      }

      const lista = nodo.querySelector<HTMLElement>(".js-lista");
      if (lista) {
        gsap.from(gsap.utils.toArray<HTMLElement>(".js-fila", nodo), {
          opacity: 0,
          y: 26,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: lista, start: "top 80%", once: true },
        });
      }

      return () => window.removeEventListener("resize", medir);
    },
    { scope: raiz },
  );

  return (
    <section ref={raiz} className="nos-quienes">
      <header className="nos-quienes__cabecera">
        <p className="nos-quienes__eyebrow">
          <span className="nos-quienes__marca" aria-hidden="true" />
          {QUIENES_SOMOS.eyebrow}
        </p>
        <h2 className="nos-quienes__titulo">{QUIENES_SOMOS.titulo}</h2>
      </header>

      <div className="nos-quienes__cuerpo">
        <ul className="nos-quienes__lista js-lista">
          {QUIENES_SOMOS.bloques.map((bloque) => (
            <li key={bloque.id} id={bloque.id} className="nos-quienes__fila js-fila">
              <span className="nos-quienes__ico js-ico" aria-hidden="true">
                {ICONOS_GIRO[bloque.icono]}
              </span>
              <div className="nos-quienes__txt">
                <h3 className="nos-quienes__giro">{bloque.title}</h3>
                <span className="nos-quienes__linea" aria-hidden="true" />
                <p className="nos-quienes__texto">{bloque.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="nos-quienes__media">
          <div className="nos-quienes__foto js-foto">
            <MediaSlot
              className="nos-quienes__hueco"
              label={QUIENES_SOMOS.foto.label}
              src={QUIENES_SOMOS.foto.src}
              alt={QUIENES_SOMOS.foto.alt}
              tone="dark"
              sizes="(max-width: 900px) 100vw, 28vw"
            />
          </div>
          <span className="nos-quienes__velo" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
