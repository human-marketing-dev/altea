"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMemo, useRef } from "react";
import { EMBLEM } from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * El emblema: la frase de marca, sola, en una caja calada.
 *
 * El manual describe la identidad como "plana y tipográfica", así que la frase se
 * sostiene sola, sin fotografía ni marca que la ancle, con mucho más aire vertical
 * que ninguna otra sección.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * LA MÁQUINA DE ESCRIBIR, Y LAS TRES COSAS QUE LA HACEN NO VERSE BARATA
 *
 * 1 · LA CAJA RESERVA SU ALTO DESDE EL PRIMER FOTOGRAMA. Los 97 caracteres están
 *     en el DOM siempre; lo que cambia es su `visibility`, que oculta sin sacar el
 *     elemento del flujo. Así el corte de líneas se calcula una vez, con el texto
 *     completo, y la caja no crece mientras se escribe ni arrastra a la página.
 *     La alternativa —añadir caracteres— provoca un reflow por letra.
 *
 * 2 · EL CURSOR es un ::after sobre el último carácter escrito, no un elemento
 *     aparte: un elemento aparte se quedaría al final del párrafo, porque los
 *     caracteres que faltan siguen ocupando su sitio. Parpadea mientras escribe y
 *     se va al terminar, quitando el atributo.
 *
 * 3 · EL ACENTO LLEGA COLOREADO. El color va en la clase de cada carácter desde el
 *     render, así que "la vida que detonamos." aparece en coral-dark desde su
 *     primera letra. No hay recoloreado al final.
 *
 * La polaridad del ocultado importa: el CSS deja los caracteres VISIBLES por
 * defecto y es el JS el que pone `data-escribiendo` para esconderlos. Así, sin
 * JavaScript la frase está entera. Y el atributo se pone dentro de useGSAP, que
 * corre en un efecto de layout —antes del pintado—, de modo que no se ve un
 * fotograma con el texto completo antes de empezar.
 */

/** Segundos por carácter. 97 caracteres salen en ~2.7s, ritmo de mecanografía. */
const POR_CARACTER = 0.028;

export function Emblem() {
  const raiz = useRef<HTMLElement>(null);

  /**
   * La frase partida en caracteres, cada uno sabiendo si va acentuado.
   *
   * Se calcula del arreglo de palabras para no duplicar el copy, y el espacio
   * entre palabras es un carácter de verdad: si el hueco lo pusiera el CSS, la
   * frase copiada saldría toda pegada.
   */
  const caracteres = useMemo(() => {
    const salida: { c: string; acento: boolean }[] = [];
    EMBLEM.palabras.forEach((palabra, i) => {
      const acento = i >= EMBLEM.acento.desde && i <= EMBLEM.acento.hasta;
      if (i > 0) salida.push({ c: " ", acento: false });
      for (const c of palabra) salida.push({ c, acento });
    });
    return salida;
  }, []);

  useGSAP(
    () => {
      const nodo = raiz.current;
      if (!nodo) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const texto = nodo.querySelector<HTMLElement>(".js-emblema-texto");
      if (!texto) return;
      const cars = gsap.utils.toArray<HTMLElement>(".js-emblema-car", nodo);
      const total = cars.length;
      if (!total) return;

      /* Oculta todo y enciende el cursor. Va aquí —efecto de layout— y no en el
         render para que sin JS la frase quede completa. */
      texto.dataset.escribiendo = "true";
      let escritos = 0;

      /*
       * Sólo avanza: el tween va de 0 a total una vez y no se rebobina, así que no
       * hace falta contemplar el camino de vuelta. Y sólo se tocan los caracteres
       * NUEVOS de cada frame, no los 97: a 60 fps con 2.7s de escritura, cada frame
       * descubre uno o dos.
       */
      const escribir = (hasta: number) => {
        if (hasta <= escritos) return;
        if (escritos > 0) delete cars[escritos - 1].dataset.cursor;
        for (let i = escritos; i < hasta; i++) cars[i].dataset.escrito = "true";
        escritos = hasta;
        cars[escritos - 1].dataset.cursor = "true";
      };

      const paso = { n: 0 };
      gsap.to(paso, {
        n: total,
        duration: total * POR_CARACTER,
        ease: "none",
        onUpdate: () => escribir(Math.round(paso.n)),
        onComplete: () => {
          escribir(total);
          /* El cursor desaparece al terminar: dejarlo parpadeando convierte un
             remate en un formulario. */
          if (cars[total - 1]) delete cars[total - 1].dataset.cursor;
        },
        scrollTrigger: {
          /*
            `top 95%`: arranca en cuanto la caja asoma por el borde inferior, no
            cuando ya lleva medio recorrido hecho. Con ~2.7s de escritura, termina
            más o menos cuando la caja acaba de entrar del todo.
          */
          trigger: nodo,
          start: "top 95%",
          once: true,
        },
      });

      return () => {
        delete texto.dataset.escribiendo;
      };
    },
    { scope: raiz },
  );

  return (
    <section className="home-emblem" ref={raiz}>
      {/*
        La caja calada. Las cuatro esquinas son decorativas y van aria-hidden: lo
        que dice la sección lo dice la frase, y anunciar cuatro marcas de encuadre
        no aporta nada. Van dentro del marco porque se posicionan contra él.
      */}
      <div className="home-emblem__marco">
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <i aria-hidden="true" />

        {/* El aria-label lleva la frase entera y los caracteres van aria-hidden:
            partida en 97 <span>, un lector la anunciaría letra por letra. */}
        <p
          className="home-emblem__text js-emblema-texto"
          aria-label={EMBLEM.palabras.join(" ")}
        >
          {caracteres.map(({ c, acento }, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={
                acento
                  ? "home-emblem__car js-emblema-car home-emblem__car--acento"
                  : "home-emblem__car js-emblema-car"
              }
            >
              {c}
            </span>
          ))}
        </p>

        {/* La firma. En --text-secondary y no en el coral del acento: ése da 3.58
            sobre este relleno, que pasa el 3.0 de texto grande pero no el 4.5 que
            necesita un cuerpo pequeño como éste. */}
        <p className="home-emblem__firma">Altea</p>
      </div>
    </section>
  );
}
