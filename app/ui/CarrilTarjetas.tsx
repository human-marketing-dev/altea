"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { TarjetaProyecto } from "./TarjetaProyecto";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Un recorrido horizontal de tarjetas: la sección se queda fija y el carril
 * avanza a la derecha mientras se baja.
 *
 * Vive en ui/ y no dentro de una sección porque lo usan DOS páginas que no se
 * conocen entre sí —los proyectos del home y las plazas de /comercial— y el
 * encargo era literalmente que las tarjetas fueran las mismas. Duplicarlo es
 * como se acaban separando: la primera vez que alguien afine el degradado o el
 * `sizes` en un sitio, el otro deja de ser "el mismo diseño".
 *
 * La TARJETA no vive aquí: es <TarjetaProyecto>, que comparte con el carrusel de
 * /comercial. Lo de aquí es sólo el movimiento.
 *
 * El alto del contenedor NO es un número: sale de lo que mide el carril, así que
 * el ritmo no cambia el día que haya ocho tarjetas en vez de seis.
 *
 *   desborde = carril.scrollWidth − innerWidth
 *   alto     = innerHeight + desborde * 1.15
 *
 * Hay tres capas de movimiento y las tres hacen falta: el carril se desplaza, la
 * foto de cada tarjeta corre al contrario —que es lo que da profundidad sin mover
 * la tarjeta— y las tarjetas entran escalonadas con un punto de giro, que evita
 * que se lean como una fila perfecta.
 *
 * Con movimiento reducido no hay recorrido: el carril pasa a ser una fila con
 * desplazamiento horizontal normal y la sección recupera su alto automático. Ver
 * el bloque correspondiente en components.css.
 */

/** Cuánto más largo es el recorrido que el desborde, para que no vaya justo. */
const HOLGURA = 1.15;

export interface TarjetaCarril {
  /** Clave de lista. El slug del proyecto o el id de la plaza. */
  id: string;
  nombre: string;
  /** La línea pequeña bajo el nombre: la unidad en el home, la ciudad en plazas. */
  pie: string;
  foto?: string;
  /** La chapa de arriba a la izquierda. Sólo la usa el carrusel de plazas. */
  etiqueta?: string;
}

export interface CarrilTarjetasProps {
  titulo: string;
  /** El id del <h2>, para el aria-labelledby de la sección. */
  tituloId: string;
  items: TarjetaCarril[];
  /** Qué hacer al pulsar una tarjeta. El botón viene para devolverle el foco. */
  onAbrir: (indice: number, boton: HTMLButtonElement) => void;
  /** Lo que se monta dentro de la sección pero fuera del carril: el diálogo. */
  children?: React.ReactNode;
}

export function CarrilTarjetas({
  titulo,
  tituloId,
  items,
  onAbrir,
  children,
}: CarrilTarjetasProps) {
  const raiz = useRef<HTMLElement>(null);
  const contador = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const nodo = raiz.current;
      if (!nodo) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const carril = nodo.querySelector<HTMLElement>(".js-carril");
      if (!carril) return;
      const tarjetas = gsap.utils.toArray<HTMLElement>(".js-tarjeta", nodo);

      const fijo = nodo.querySelector<HTMLElement>(".altea-carril__fijo");
      const cab = nodo.querySelector<HTMLElement>(".altea-carril__cab");

      let desborde = 0;
      const medir = () => {
        /*
         * El alto de la tarjeta, acotado al hueco real.
         *
         * Se mide en vez de escribirse porque depende de dos cosas que el CSS no
         * puede multiplicar entre sí: el padding de la sección fija y el alto de la
         * cabecera, que envuelve a una o dos líneas según el ancho. El row-gap se
         * lee ya resuelto del estilo calculado, así que la separación vive en un
         * solo sitio —la hoja— y aquí sólo se resta.
         */
        if (fijo && cab) {
          const estilo = getComputedStyle(fijo);
          const relleno =
            parseFloat(estilo.paddingTop) + parseFloat(estilo.paddingBottom);
          const hueco = parseFloat(estilo.rowGap) || 0;
          const libre = fijo.clientHeight - relleno - cab.offsetHeight - hueco;
          /*
           * El hueco libre ACOTA, no manda.
           *
           * Sin el `min` la tarjeta crecía en ventanas altas: a 1440x900 el hueco es
           * de 693px y el alto natural de 614, así que se estiraba a 693 y con ella
           * el ancho a 520. El alto natural es el que sale del ancho de diseño
           * —clamp(260px, 32vw, 480px)— por la proporción 3/4, y es el techo.
           */
          /* En móvil el ancho de diseño es otro: clamp(220px, 74vw, 320px). Sin
             esto el teléfono usaba el de escritorio y las tarjetas salían de
             260 px en una pantalla de 390. */
          const vw = window.innerWidth;
          const anchoDiseno =
            vw <= 900
              ? Math.min(320, Math.max(220, vw * 0.74))
              : Math.min(480, Math.max(260, vw * 0.32));
          const natural = (anchoDiseno * 4) / 3;
          nodo.style.setProperty(
            "--alto-tarjeta",
            `${Math.max(240, Math.round(Math.min(natural, libre)))}px`,
          );
        }

        /*
         * ⚠ EL RELLENO DERECHO HAY QUE SUMARLO A MANO.
         *
         * Desde que la columna está acotada, la pista desborda su caja y pasa a
         * ser contenido desplazable — y Chrome NO cuenta el padding final en el
         * `scrollWidth` de una caja desbordada. Medido a 1440 con seis tarjetas:
         * 2 674 px antes y 2 602 después, exactamente los 72 px que vale
         * --container-pad a ese ancho. Sin sumarlo, el recorrido se queda corto y
         * la última tarjeta acaba pegada al canto derecho en vez de con su
         * margen.
         */
        const padDer = parseFloat(getComputedStyle(carril).paddingRight) || 0;
        desborde = Math.max(0, carril.scrollWidth + padDer - window.innerWidth);
        nodo.style.height = `${window.innerHeight + desborde * HOLGURA}px`;
      };
      medir();
      window.addEventListener("resize", medir);

      const total = items.length;
      gsap.to(carril, {
        /* Función y no valor: con invalidateOnRefresh se vuelve a leer tras cada
           resize, así que el destino sigue al carril en vez de quedarse con la
           medida del primer render. */
        x: () => -desborde,
        ease: "none",
        scrollTrigger: {
          trigger: nodo,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.55,
          invalidateOnRefresh: true,
          onUpdate: (s) => {
            /* Se escribe en el DOM y no por setState: son seis u ocho valores en
               todo el recorrido pero onUpdate corre a 60 fps, y el nodo no lo
               maneja React —no tiene hijos ni se re-renderiza—. */
            const k = Math.min(total, Math.floor(s.progress * total) + 1);
            /* Sólo si cambia: reescribir el mismo texto en cada fotograma
               cambia el nodo igual y obliga a volver a maquetarlo. */
            const texto = String(k).padStart(2, "0");
            if (contador.current && contador.current.textContent !== texto)
              contador.current.textContent = texto;
          },
        },
      });

      /* Dentro de cada tarjeta, la foto corre al revés que el carril. */
      for (const tarjeta of tarjetas) {
        const foto = tarjeta.querySelector<HTMLElement>(".js-tarjeta-foto");
        if (!foto) continue;
        gsap.fromTo(
          foto,
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: nodo,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.55,
            },
          },
        );
      }

      gsap.from(tarjetas, {
        yPercent: 12,
        rotate: 1.2,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: nodo, start: "top 70%", once: true },
      });

      return () => {
        window.removeEventListener("resize", medir);
        nodo.style.height = "";
        nodo.style.removeProperty("--alto-tarjeta");
      };
    },
    /*
     * revertOnUpdate: SIN ÉL, CADA CAMBIO DE `items` SUMA, NO SUSTITUYE. Con
     * dependencias, useGSAP sólo revierte al desmontar (@gsap/react 2.1): cada
     * nueva pasada dejaba vivas la anterior —tweens, ScrollTriggers y su oyente
     * de resize—. Quien lo usa debe pasar `items` estable; esto es la red.
     */
    { scope: raiz, dependencies: [items], revertOnUpdate: true },
  );

  const total = String(items.length).padStart(2, "0");

  return (
    <section className="altea-carril" ref={raiz} aria-labelledby={tituloId}>
      <div className="altea-carril__fijo">
        <div className="altea-carril__cab">
          <h2 className="altea-carril__titulo" id={tituloId}>
            {titulo}
          </h2>
          {/* aria-hidden: es un indicador de posición dentro de un recorrido
              visual, y leído en voz alta no dice nada que la lista no diga. */}
          <p className="altea-carril__n" aria-hidden="true">
            <span ref={contador}>01</span> — {total}
          </p>
        </div>

        <ul className="altea-carril__pista js-carril">
          {items.map((item, k) => (
            <li key={item.id}>
              <TarjetaProyecto
                nombre={item.nombre}
                pie={item.pie}
                foto={item.foto}
                etiqueta={item.etiqueta}
                onClick={(boton) => onAbrir(k, boton)}
              />
            </li>
          ))}
        </ul>
      </div>

      {children}
    </section>
  );
}
