"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { HUELLA } from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * El reparto de la superficie por territorio.
 *
 * LA BARRA SE CALCULA DE LOS VALORES, no se escribe a mano. Es lo que convierte
 * tres cifras sueltas en un dato que se entiende de un vistazo: 24, 13 y 7
 * millones leídos uno tras otro no dicen que Nuevo León es más de la mitad del
 * total, y la barra sí.
 *
 * El total sale de sumar el desglose, así que si entra una cuarta línea las
 * proporciones se recalculan solas.
 */
const TOTAL = HUELLA.desglose.reduce((a, d) => a + d.value, 0);

export function Reparto() {
  const raiz = useRef<HTMLDListElement>(null);

  useGSAP(
    () => {
      const nodo = raiz.current;
      if (!nodo) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      for (const barra of gsap.utils.toArray<HTMLElement>(".js-barra", nodo)) {
        gsap.to(barra, {
          scaleX: Number(barra.dataset.p),
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: barra, start: "top 90%", once: true },
        });
      }
    },
    { scope: raiz },
  );

  return (
    <dl className="nos-reparto" ref={raiz}>
      {HUELLA.desglose.map((d) => {
        const proporcion = d.value / TOTAL;
        return (
          <div className="nos-rp" key={d.label}>
            <div className="nos-rp__t">
              <dt>{d.label}</dt>
              {/*
                La barra es redundante con la cifra de al lado, así que va
                aria-hidden: anunciar "barra al 54 %" después de "24,000,000 m²"
                es decir dos veces lo mismo. Y el `scaleX` de respaldo en el
                marcado es para que sin JS la barra esté en su proporción real en
                vez de en cero.
              */}
              <span className="nos-rp__barra" aria-hidden="true">
                <span
                  className="js-barra"
                  data-p={proporcion.toFixed(4)}
                  style={{ transform: `scaleX(${proporcion.toFixed(4)})` }}
                />
              </span>
            </div>
            <dd className="nos-rp__v">{d.value.toLocaleString("es-MX")} m²</dd>
          </div>
        );
      })}
    </dl>
  );
}
