"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ruta } from "@/lib/rutas";
import { BUSINESS_UNITS, BUSINESS_UNITS_INTRO } from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Las cuatro unidades de negocio, en carpetas que se apilan.
 *
 * Cada carpeta es `sticky` y se detiene un escalón más abajo que la anterior, así
 * que al bajar se van montando unas sobre otras como una baraja que se cierra. La
 * de debajo se encoge y se apaga cuando le llega la siguiente encima.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * UN SOLO ScrollTrigger PARA TODA LA PILA
 *
 * Y es lo que no se puede hacer de otra manera. La versión evidente —atar cada
 * carpeta al ScrollTrigger de la SIGUIENTE— no funciona con elementos `sticky`,
 * porque ScrollTrigger mide la posición de FLUJO del elemento, no la posición en
 * la que está pegado. Los tiempos salían desfasados respecto de lo que se veía:
 * la primera carpeta aparecía ya oscura y las cuatro se apagaban de golpe al
 * entrar la siguiente.
 *
 * Aquí hay un disparador para el contenedor entero y de su avance se deriva
 * cuánto le toca a cada una. Es aritmética, no medición, así que no puede
 * desfasarse.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * EL TÍTULO VA DEBAJO EN EL APILADO
 *
 * z-index 1 contra el 10+i de las carpetas. Durante la sección no se tocan
 * —las carpetas se detienen por debajo de él— y al final la pila sube y lo tapa
 * al salir. Con el título encima se quedaba flotando sobre la última carpeta
 * mientras se iba, que es un defecto que ya se corrigió una vez.
 */

/** Cuánto baja cada carpeta respecto de la anterior, en píxeles. */
const ESCALON = 14;

/** Lo que se encoge y se apaga una carpeta cuando la tapa la siguiente. */
const ENCOGE = 0.07;
const APAGA = 0.34;

export function CarpetasUnidades() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const nodo = raiz.current;
      if (!nodo) return;
      const cab = nodo.querySelector<HTMLElement>(".js-carpetas-cab");
      const pila = nodo.querySelector<HTMLElement>(".js-carpetas-pila");
      if (!cab || !pila) return;

      const cajas = gsap.utils.toArray<HTMLElement>(".js-carpeta-caja", nodo);
      const total = cajas.length;

      /*
       * Dónde se detienen las carpetas y cuánto miden. Los dos se MIDEN: el tope
       * sale del alto real del título pegado, no de un número escrito a mano que
       * se rompería en cuanto el texto envuelva a otro número de líneas.
       */
      const medir = () => {
        const arriba = parseFloat(getComputedStyle(cab).top) || 0;
        const tope = Math.round(arriba + cab.offsetHeight + ESCALON);
        /* Lo que queda de pantalla bajo el título, menos el escalonado de las
           cuatro y un respiro abajo. */
        const respiro = Math.max(22, window.innerHeight * 0.05);
        const libre = window.innerHeight - tope - ESCALON * (total - 1) - respiro;
        pila.style.setProperty("--tope", `${tope}px`);
        pila.style.setProperty("--hueco", `${Math.round(Math.max(300, Math.min(560, libre)))}px`);
      };
      medir();
      window.addEventListener("resize", medir);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return () => window.removeEventListener("resize", medir);
      }

      /** Del avance global sale cuánto le toca a cada carpeta. */
      const cubrir = (avance: number) => {
        const t = avance * total;
        cajas.forEach((caja, i) => {
          /* La carpeta i empieza a taparse cuando llega la i+1, y termina un
             paso más allá. */
          const k = Math.max(0, Math.min(1, t - (i + 1)));
          caja.style.transform = `scale(${(1 - ENCOGE * k).toFixed(4)})`;
          caja.style.filter = `brightness(${(1 - APAGA * k).toFixed(4)})`;
        });
      };
      cubrir(0);

      const disparador = ScrollTrigger.create({
        trigger: pila,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: (s) => cubrir(s.progress),
        /* También en onRefresh: tras un resize el avance ya no es el mismo y sin
           esto las carpetas se quedarían con el brillo del encuadre anterior. */
        onRefresh: (s) => cubrir(s.progress),
      });

      return () => {
        window.removeEventListener("resize", medir);
        disparador.kill();
      };
    },
    { scope: raiz },
  );

  return (
    <section className="home-carpetas" ref={raiz} aria-labelledby="carpetas-titulo">
      <div className="home-carpetas__cab js-carpetas-cab">
        <h2 className="home-carpetas__titulo" id="carpetas-titulo">
          {BUSINESS_UNITS_INTRO.descripcion}
        </h2>
      </div>

      <div className="home-carpetas__pila js-carpetas-pila">
        {BUSINESS_UNITS.map((unidad, i) => (
          <article
            className="home-carpetas__item"
            key={unidad.slug}
            /* El escalón y el apilado salen del índice, en CSS: así el orden lo
               lleva una sola declaración y sin JS la pila sigue funcionando. */
            style={{ ["--i" as string]: i }}
          >
            {/*
              data-tono en vez de una clase por unidad: el CSS sólo necesita saber
              si el fondo es claro o ink, y el color concreto entra como variable.
              Así añadir el color de Forestal el día que Altea lo dé es una línea en
              el archivo de contenido y ni una en la hoja.
            */}
            <div
              className="home-carpetas__caja js-carpeta-caja"
              data-tono={unidad.color ? "color" : "ink"}
              style={unidad.color ? ({ ["--u-color" as string]: unidad.color }) : undefined}
            >
              <div className="home-carpetas__txt">
                <span className="home-carpetas__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")} / {String(BUSINESS_UNITS.length).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="home-carpetas__nombre">{unidad.name}</h3>
                  <p className="home-carpetas__frase">{unidad.apertura}</p>
                  <p className="home-carpetas__desc">{unidad.descripcion}</p>
                  <Link className="home-carpetas__ir" href={ruta(`/${unidad.slug}`)}>
                    Explorar
                    <span className="home-carpetas__raya" aria-hidden="true" />
                    <span className="sr-only"> {unidad.name}</span>
                  </Link>
                </div>
              </div>

              <div className="home-carpetas__foto">
                {unidad.image && (
                  <Image
                    src={unidad.image}
                    alt={unidad.alt ?? `Proyecto Altea ${unidad.name}`}
                    fill
                    sizes="(max-width: 900px) 100vw, 54vw"
                    className="home-carpetas__img"
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
