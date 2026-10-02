"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useRef } from "react";
import { CountUp } from "@/app/ui";
import { STATS, STATS_INTRO } from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * La frase de entrada y las tres cifras.
 *
 * LAS CIFRAS NO VAN EN TRES COLUMNAS IGUALES: se escalonan hacia la derecha, cada
 * una separada de la anterior por una línea fina. Una rejilla simétrica de tres
 * huecos idénticos es de las cosas que hacen que una maqueta se lea como salida
 * de una plantilla, y aquí el escalonado además ordena la lectura de arriba abajo
 * en vez de obligar a barrer de lado.
 *
 * La frase se enciende palabra por palabra con el scroll. ESE RECURSO APARECE DOS
 * VECES EN TODA LA PÁGINA —aquí y en el emblema— y no más: repetido en cada
 * sección deja de ser un énfasis y se convierte en un tic.
 */
export function FraseCifras() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const nodo = raiz.current;
      if (!nodo) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const frase = nodo.querySelector<HTMLElement>(".js-frase");
      if (!frase) return;
      gsap.from(gsap.utils.toArray<HTMLElement>(".js-palabra", nodo), {
        opacity: 0.16,
        stagger: 0.016,
        ease: "none",
        scrollTrigger: { trigger: frase, start: "top 84%", end: "bottom 62%", scrub: 0.4 },
      });
    },
    { scope: raiz },
  );

  return (
    <section className="home-frase" ref={raiz}>
      <p className="home-frase__texto js-frase">
        {/*
          El espacio va como hermano del <span> y no lo pone el CSS: si las
          palabras fueran ítems de un flex con `gap`, en el DOM no habría ningún
          carácter entre ellas y la frase copiada saldría toda pegada. Mismo
          arreglo que en <Emblem>.
        */}
        {STATS_INTRO.split(" ").map((palabra, i, todas) => (
          <Fragment key={`${palabra}-${i}`}>
            <span className="home-frase__palabra js-palabra">{palabra}</span>
            {i < todas.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </p>

      <dl className="home-frase__datos">
        {STATS.map((stat, i) => (
          <div className="home-frase__dato" key={stat.label} style={{ ["--i" as string]: i }}>
            {/*
              dt antes que dd, que es el orden que pide un <dl>; el número se ve
              primero porque la rejilla lo coloca en la primera columna. Poner el
              dd antes en el DOM para que "se vea primero" es lo que deja un
              árbol de accesibilidad con la definición antes del término.
            */}
            <dt className="home-frase__etiqueta">
              {stat.note ? `${stat.note} ${stat.label}` : stat.label}
            </dt>
            <dd className="home-frase__cifra">
              <CountUp to={stat.to} prefix={stat.prefix} suffix={stat.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
