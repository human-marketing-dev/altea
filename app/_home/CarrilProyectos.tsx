"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FeaturedProject } from "./content";
import { FEATURED_PROJECTS, FEATURED_PROJECTS_INTRO } from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Los proyectos, en un recorrido horizontal.
 *
 * La sección se queda fija y el carril avanza a la derecha mientras se baja. El
 * alto del contenedor NO es un número: sale de lo que mide el carril, así que el
 * ritmo no cambia el día que haya ocho proyectos en vez de seis.
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
 * el bloque correspondiente en secciones.css.
 */

/** Cuánto más largo es el recorrido que el desborde, para que no vaya justo. */
const HOLGURA = 1.15;

export function CarrilProyectos() {
  const raiz = useRef<HTMLElement>(null);
  const contador = useRef<HTMLSpanElement>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const [activo, setActivo] = useState<FeaturedProject | null>(null);
  /* Quién abrió la ficha, para devolverle el foco al cerrar. */
  const origen = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const nodo = dialogo.current;
    if (!nodo) return;
    /* showModal y no `open`: es lo que atrapa el foco, habilita Escape y pinta
       el ::backdrop sin escribir una línea para ello. */
    if (activo && !nodo.open) nodo.showModal();
    if (!activo && nodo.open) nodo.close();
  }, [activo]);

  useGSAP(
    () => {
      const nodo = raiz.current;
      if (!nodo) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const carril = nodo.querySelector<HTMLElement>(".js-carril");
      if (!carril) return;
      const tarjetas = gsap.utils.toArray<HTMLElement>(".js-py", nodo);

      const fijo = nodo.querySelector<HTMLElement>(".home-carril__fijo");
      const cab = nodo.querySelector<HTMLElement>(".home-carril__cab");

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
          const relleno = parseFloat(estilo.paddingTop) + parseFloat(estilo.paddingBottom);
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
          const natural = (Math.min(480, Math.max(260, window.innerWidth * 0.32)) * 4) / 3;
          nodo.style.setProperty(
            "--alto-py",
            `${Math.max(240, Math.round(Math.min(natural, libre)))}px`,
          );
        }

        desborde = Math.max(0, carril.scrollWidth - window.innerWidth);
        nodo.style.height = `${window.innerHeight + desborde * HOLGURA}px`;
      };
      medir();
      window.addEventListener("resize", medir);

      const total = FEATURED_PROJECTS.length;
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
            /* Se escribe en el DOM y no por setState: son seis valores en todo
               el recorrido pero onUpdate corre a 60 fps, y el nodo no lo maneja
               React —no tiene hijos ni se re-renderiza—. */
            const k = Math.min(total, Math.floor(s.progress * total) + 1);
            if (contador.current) contador.current.textContent = String(k).padStart(2, "0");
          },
        },
      });

      /* Dentro de cada tarjeta, la foto corre al revés que el carril. */
      for (const tarjeta of tarjetas) {
        const foto = tarjeta.querySelector<HTMLElement>(".js-py-foto");
        if (!foto) continue;
        gsap.fromTo(
          foto,
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: nodo, start: "top top", end: "bottom bottom", scrub: 0.55 },
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
        nodo.style.removeProperty("--alto-py");
      };
    },
    { scope: raiz },
  );

  const total = String(FEATURED_PROJECTS.length).padStart(2, "0");

  return (
    <section className="home-carril" ref={raiz} aria-labelledby="carril-titulo">
      <div className="home-carril__fijo">
        <div className="home-carril__cab">
          <h2 className="home-carril__titulo" id="carril-titulo">
            {FEATURED_PROJECTS_INTRO.titulo}
          </h2>
          {/* aria-hidden: es un indicador de posición dentro de un recorrido
              visual, y leído en voz alta no dice nada que la lista no diga. */}
          <p className="home-carril__n" aria-hidden="true">
            <span ref={contador}>01</span> — {total}
          </p>
        </div>

        <ul className="home-carril__pista js-carril">
          {FEATURED_PROJECTS.map((proyecto) => (
            <li key={proyecto.slug}>
              <button
                type="button"
                className="home-carril__py js-py"
                onClick={(evento) => {
                  origen.current = evento.currentTarget;
                  setActivo(proyecto);
                }}
              >
                <span className="home-carril__py-foto js-py-foto">
                  {proyecto.image && (
                    <Image
                      src={proyecto.image}
                      alt=""
                      fill
                      /*
                        ESTO era la pixelación, y no la resolución de los archivos:
                        los seis miden entre 1726 y 2560px de ancho, píxeles de
                        sobra.

                        La caja es VERTICAL (3/4) y las seis fotos son
                        HORIZONTALES (de 1.50 a 1.81 de proporción). Con
                        `object-fit: cover`, la imagen se escala hasta que su ALTO
                        cubre la caja, y entonces su ancho RENDERIZADO es mucho
                        mayor que el de la caja: a 1440 la tarjeta mide 461px de
                        ancho, pero la imagen se pinta a 923-1114px y se recorta a
                        los lados.

                        `sizes` describe el ancho al que se PINTA la imagen, no el
                        de su caja. Con los 480px de antes, Next servía w=640 a 1x
                        —que se estiraba hasta 1114, o sea 1.74x— y w=1080 a 2x.
                        1160px cubre el peor caso (1.81 de proporción a 1920), y en
                        móvil la tarjeta manda por ancho: 74vw de caja son 178vw de
                        imagen renderizada con esa misma cuenta.
                      */
                      sizes="(max-width: 900px) 178vw, 1160px"
                      className="home-carril__img"
                    />
                  )}
                </span>
                <span className="home-carril__py-txt">
                  <b>{proyecto.name}</b>
                  <span>{proyecto.unit}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialogo}
        className="home-ficha"
        aria-label={activo ? `Ficha de ${activo.name}` : "Ficha del proyecto"}
        onClose={() => {
          setActivo(null);
          origen.current?.focus();
        }}
        onClick={(evento) => {
          // El backdrop es el propio <dialog>: un clic fuera de la ficha cierra.
          if (evento.target === dialogo.current) setActivo(null);
        }}
      >
        {activo && (
          <article>
            <button
              type="button"
              className="home-ficha__x"
              onClick={() => setActivo(null)}
              aria-label="Cerrar ficha"
            >
              ×
            </button>

            {/* El nombre va SOBRE la foto, no en una cabecera aparte: así la
                ficha se abre mostrando el proyecto y no una etiqueta. */}
            <div className="home-ficha__foto">
              {activo.image && (
                <Image
                  src={activo.image}
                  alt=""
                  fill
                  sizes="(max-width: 940px) 94vw, 880px"
                  className="home-ficha__img"
                />
              )}
              <h3 className="home-ficha__nombre">{activo.name}</h3>
            </div>

            <div className="home-ficha__cuerpo">
              <dl className="home-ficha__datos">
                <div className="home-ficha__d">
                  <dt>Unidad</dt>
                  <dd>{activo.unit}</dd>
                </div>
                <div className="home-ficha__d">
                  <dt>Ubicación</dt>
                  <dd>{activo.location}</dd>
                </div>
                <div className="home-ficha__d">
                  <dt>Estado</dt>
                  <dd>{activo.estado}</dd>
                </div>
              </dl>
              {activo.descripcion && <p>{activo.descripcion}</p>}
            </div>
          </article>
        )}
      </dialog>
    </section>
  );
}
