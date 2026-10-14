"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ruta } from "@/lib/rutas";
import { BUSINESS_UNITS, BUSINESS_UNITS_INTRO } from "./content";

/**
 * Las cuatro unidades de negocio, en carpetas que se apilan.
 *
 * Cada carpeta es `sticky` y se detiene un escalón más abajo que la anterior, así
 * que al bajar se van montando unas sobre otras como una baraja que se cierra. La
 * de debajo se encoge y se apaga cuando le llega la siguiente encima.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * EL OSCURECIDO SALE DE LA GEOMETRÍA, NO DEL AVANCE DE LA SECCIÓN
 *
 * Aquí había un solo ScrollTrigger para toda la pila que repartía su avance
 * entre las cuatro: `k = avance * total − (i + 1)`. Eso funciona mientras las
 * pausas sean cortas, y deja de funcionar en cuanto se alargan — que es
 * justamente lo que hace el margen de 42svh de abajo. Con el reparto, cada
 * carpeta se pasaba medio recorrido apagándose antes de que nadie la tapara.
 *
 * Midiendo cuánto ha subido la siguiente sobre ésta, el oscurecido ocurre
 * exactamente mientras la cubre, dure lo que dure la pausa. Y de paso desaparece
 * el motivo por el que hacía falta ScrollTrigger: lo que se mide es la posición
 * REAL en pantalla de dos elementos pegados, que es lo que ScrollTrigger no
 * sabía dar —mide la posición de FLUJO— y lo que obligaba a derivarlo por
 * aritmética.
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

  useEffect(() => {
    const nodo = raiz.current;
    if (!nodo) return;
    const cab = nodo.querySelector<HTMLElement>(".js-carpetas-cab");
    const pila = nodo.querySelector<HTMLElement>(".js-carpetas-pila");
    if (!cab || !pila) return;

    const cartas = Array.from(
      nodo.querySelectorAll<HTMLElement>(".js-carpeta"),
    );
    const cajas = Array.from(
      nodo.querySelectorAll<HTMLElement>(".js-carpeta-caja"),
    );
    const total = cartas.length;
    if (!total) return;

    /*
     * EL ALTO SE CALCULA Y EL ENCUADRE VA CONTRA LA VENTANA.
     *
     * ⚠ Centrar la carpeta en el hueco que queda bajo la cabecera parece lo
     * correcto y no lo es: EL OJO NO DESCUENTA EL TÍTULO, lee la tarjeta contra
     * la pantalla entera. Medido a 1440x900, repartir el hueco dejaba el centro
     * de la carpeta en 549 contra los 450 de la ventana —casi 100 px por debajo,
     * que es exactamente lo que se notaba—. Contra la ventana queda en 448.
     *
     * ⚠ Y EL SUELO DE `abajoCab + 24` NO SOBRA. Con el alto a 0.62 del libre, la
     * carpeta es lo bastante grande como para que el centro geométrico la metería
     * por debajo del título en pantallas bajas. Medido, el suelo gana al centro
     * por 32 px a 1366x768 y por 38 a 1280x720: en portátiles de 13" es lo único
     * que actúa.
     */
    const medir = () => {
      const arriba = parseFloat(getComputedStyle(cab).top) || 0;
      const abajoCab = arriba + cab.offsetHeight;
      const libre = window.innerHeight - abajoCab;

      const alto = Math.round(Math.max(300, Math.min(560, libre * 0.62)));
      const bloque = alto + ESCALON * (total - 1);
      const tope = Math.round(
        Math.max(abajoCab + 24, (window.innerHeight - bloque) / 2),
      );

      pila.style.setProperty("--hueco", `${alto}px`);
      pila.style.setProperty("--tope", `${tope}px`);
    };
    medir();
    window.addEventListener("resize", medir);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => window.removeEventListener("resize", medir);
    }

    /** Cuánto ha subido la siguiente sobre ésta, de 0 a 1. Ver la cabecera. */
    const pintar = () => {
      for (let i = 0; i < total; i++) {
        let k = 0;
        if (i < total - 1) {
          const a = cartas[i].getBoundingClientRect();
          const b = cartas[i + 1].getBoundingClientRect();
          k = Math.max(
            0,
            Math.min(1, (a.bottom - b.top) / Math.max(1, a.height - ESCALON)),
          );
        }
        cajas[i].style.transform = `scale(${(1 - ENCOGE * k).toFixed(4)})`;
        cajas[i].style.filter = `brightness(${(1 - APAGA * k).toFixed(4)})`;
      }
    };
    pintar();

    /* Un fotograma por scroll como mucho: `pintar` lee ocho rectángulos y el
       evento llega muchas más veces que eso. */
    let pedido = false;
    const alScroll = () => {
      if (pedido) return;
      pedido = true;
      requestAnimationFrame(() => {
        pedido = false;
        pintar();
      });
    };
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);

    return () => {
      window.removeEventListener("resize", medir);
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alScroll);
    };
  }, []);

  return (
    <section
      className="home-carpetas"
      ref={raiz}
      aria-labelledby="carpetas-titulo"
    >
      <div className="home-carpetas__cab js-carpetas-cab">
        <h2 className="home-carpetas__titulo" id="carpetas-titulo">
          {BUSINESS_UNITS_INTRO.descripcion}
        </h2>
      </div>

      <div className="home-carpetas__pila js-carpetas-pila">
        {BUSINESS_UNITS.map((unidad, i) => (
          <article
            className="home-carpetas__item js-carpeta"
            key={unidad.slug}
            /* El escalón y el apilado salen del índice, en CSS: así el orden lo
               lleva una sola declaración y sin JS la pila sigue funcionando. */
            style={{ ["--i" as string]: i }}
          >
            {/*
              data-tono en vez de una clase por unidad: el CSS sólo necesita saber
              si el fondo es claro o ink, y el color concreto entra como variable
              —--color-unidad, la misma que lee el hero de cada unidad—. El valor
              está sólo en app/ui/tokens.css. La rama `ink` se queda para la
              unidad que llegue sin color.
            */}
            <div
              className="home-carpetas__caja js-carpeta-caja"
              data-tono={unidad.color ? "color" : "ink"}
              style={
                unidad.color
                  ? { ["--color-unidad" as string]: unidad.color }
                  : undefined
              }
            >
              <div className="home-carpetas__txt">
                <span className="home-carpetas__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(BUSINESS_UNITS.length).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="home-carpetas__nombre">{unidad.name}</h3>
                  <p className="home-carpetas__frase">{unidad.apertura}</p>
                  <p className="home-carpetas__desc">{unidad.descripcion}</p>
                  {/* El botón oscuro del sistema: tinta sobre el color de la
                      unidad se lee siempre como botón, y el subrayado de antes
                      no se leía como nada. */}
                  <Link
                    className="altea-btn altea-btn--dark altea-btn--md home-carpetas__ir"
                    href={ruta(`/${unidad.slug}`)}
                  >
                    Explorar
                    <span className="altea-btn__arrow" aria-hidden="true">
                      →
                    </span>
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

        {/*
          EL ESPACIADOR DE COLA, y es un elemento y no un margen.

          Una pegajosa se queda quieta mientras quepa en su contenedor, pero el
          rectángulo contra el que se mide es EL CONTENEDOR MENOS SUS PROPIOS
          MÁRGENES. O sea que el margen inferior de una pegajosa no le da ni un
          píxel de pausa a sí misma: sólo empuja la posición estática de la
          siguiente. La cuarta no tiene siguiente, así que llegaba a su sitio y
          ahí mismo se le acababa el recorrido — y al acabarse, las cuatro se
          soltaban de golpe. Eso es lo que se veía como atasco y salto.

          Va fuera del map, como hermano de las cuatro. Ver .home-carpetas__cola.
        */}
        <div className="home-carpetas__cola" aria-hidden="true" />
      </div>
    </section>
  );
}
