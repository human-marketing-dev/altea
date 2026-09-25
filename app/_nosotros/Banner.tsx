"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { BANNER } from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Grados por defecto si el CSS no declara --angulo. */
const ANGULO_BASE = 11;

/**
 * Hero de /nosotros — composición por capas.
 *
 * Seis capas superpuestas, y el orden de apilado es parte del diseño: retícula
 * (1), franja y foto (2), isotipo (3), texto (4). Las tres primeras son
 * decorativas y van `aria-hidden`.
 *
 * El titular sube línea por línea desde su propia máscara —cada línea es un
 * <span> con overflow oculto y otro dentro que se desplaza—, la foto se descubre
 * con un barrido desde la derecha, y el isotipo llega después. Al hacer scroll,
 * foto e isotipo van a VELOCIDADES DISTINTAS: es lo que da profundidad. No
 * igualarlas.
 */
export function Banner() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const nodo = raiz.current;
      if (!nodo) return;

      /*
       * El sesgo de la columna de foto sale de su ALTO real —que depende del
       * alto de la sección— así que no se puede escribir en el CSS. El ángulo se
       * lee de --angulo para que no haya un 11 suelto.
       */
      const columna = nodo.querySelector<HTMLElement>(".js-col-foto");
      const medir = () => {
        if (!columna) return;
        const grados =
          parseFloat(getComputedStyle(nodo).getPropertyValue("--angulo")) || ANGULO_BASE;
        const rad = (grados * Math.PI) / 180;
        columna.style.setProperty("--d", `${Math.tan(rad) * columna.offsetHeight}px`);
      };
      medir();
      window.addEventListener("resize", medir);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return () => window.removeEventListener("resize", medir);
      }

      /* --- Entrada al cargar --------------------------------------------- */
      gsap.from(gsap.utils.toArray<HTMLElement>(".js-linea > span", nodo), {
        yPercent: 110,
        duration: 1,
        ease: "power3.out",
        stagger: 0.09,
        delay: 0.1,
      });
      gsap.from(
        gsap.utils.toArray<HTMLElement>(".js-entra", nodo),
        { opacity: 0, y: 22, duration: 0.85, ease: "power3.out", stagger: 0.12, delay: 0.45 },
      );
      if (columna) {
        /* Barrido desde la derecha. Se anima el clip-path de la capa, no su
           ancho: el ancho dispararía relayout en cada cuadro. */
        gsap.from(columna, {
          clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
          duration: 1.2,
          ease: "power3.inOut",
        });
      }
      const iso = nodo.querySelector<HTMLElement>(".js-iso");
      if (iso) {
        gsap.from(iso, {
          opacity: 0,
          scale: 0.9,
          duration: 1.4,
          ease: "power2.out",
          delay: 0.5,
        });
      }

      /* --- Parallax al scroll, a dos velocidades ------------------------- */
      const foto = nodo.querySelector<HTMLElement>(".js-foto");
      if (foto) {
        gsap.fromTo(
          foto,
          { yPercent: -5 },
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: nodo,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
      }
      if (iso) {
        gsap.fromTo(
          iso,
          { yPercent: 0 },
          {
            yPercent: -16,
            ease: "none",
            scrollTrigger: {
              trigger: nodo,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      return () => window.removeEventListener("resize", medir);
    },
    { scope: raiz },
  );

  return (
    <section ref={raiz} className="nos-hero">
      {/* 1 · Retícula editorial. Apenas se ve, y ese es el punto: da estructura
             sin convertirse en un elemento. */}
      <div className="nos-hero__grid" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <i key={i} />
        ))}
      </div>

      {/* 4 · Franja diagonal. Mismo recurso que la banda de giros de comercial y
             "Quiénes somos": las tres se leen como familia. */}
      <span className="nos-hero__franja" aria-hidden="true" />

      {/* 2 · La foto, en columna diagonal a la derecha. */}
      <div className="nos-hero__col-foto js-col-foto" aria-hidden="true">
        <div className="nos-hero__foto js-foto">
          {BANNER.image && (
            <Image src={BANNER.image} alt="" fill sizes="(max-width: 900px) 100vw, 44vw" priority />
          )}
        </div>
        <span className="nos-hero__velo" />
      </div>

      {/*
        3 · El isotipo, calado y saliéndose por la esquina.

        Va INLINE y no como <img>: el archivo trae la A rellena y para pintarla
        en contorno hacen falta `fill: none` y `stroke`, que sobre una imagen
        externa no se pueden aplicar. El trazado es el mismo de
        altea-icon-dark.svg, copiado tal cual.
      */}
      <svg
        className="nos-hero__iso js-iso"
        viewBox="0 0 318.06 324"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M318.06,324h-53.86l-29.26-60.22H83.12l-29.26,60.22H0L159.03,0l159.03,324ZM213.31,219.25l-54.28-111.11-54.28,111.11h108.57Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>

      {/* 5 · El texto. */}
      <div className="nos-hero__contenido">
        <p className="nos-hero__eyebrow js-entra">
          <span className="nos-hero__marca" aria-hidden="true" />
          {BANNER.eyebrow}
          <span className="nos-hero__regla" aria-hidden="true" />
        </p>

        {/*
          El corte en tres líneas es de la composición, no del contenido: el
          aria-label lleva la frase entera y las partes van aria-hidden, así que
          el lector no oye tres fragmentos. Mismo criterio que el logotipo del
          hero del home y el título de "Quiénes somos".
        */}
        <h1 className="nos-hero__titulo" aria-label={BANNER.title}>
          {BANNER.lineas.map((linea, i) => (
            <span
              key={linea}
              className={
                i === BANNER.lineas.length - 1
                  ? "nos-hero__linea js-linea nos-hero__linea--hueca"
                  : "nos-hero__linea js-linea"
              }
              aria-hidden="true"
            >
              <span>{linea}</span>
            </span>
          ))}
        </h1>

        <p className="nos-hero__bajada js-entra">{BANNER.description}</p>
      </div>

      {/* 6 · El pie: sólo el indicador de deslizar. */}
      <div className="nos-hero__pie js-entra">
        <span className="nos-hero__scroll">
          Desliza
          <span className="nos-hero__scroll-linea" aria-hidden="true" />
        </span>
      </div>
    </section>
  );
}
