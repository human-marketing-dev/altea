"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Plaza } from "./content";
import { GALERIA_PLAZAS, PLAZAS } from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Las ocho plazas, como ÍNDICE.
 *
 * Filas con nombre, ubicación, formato y visitantes, separadas por línea fina. Al
 * señalar, la fila se desplaza a la derecha y la flecha del final se mueve: el
 * desplazamiento es lo que dice "esto se abre" sin tener que escribirlo.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * LA FOTO SIGUE AL CURSOR
 *
 * No vive en la página: aparece pegada al puntero y lo persigue CON RETRASO,
 * inclinándose según la velocidad. La interpolación —un 12 % de la distancia por
 * fotograma— es lo que lo hace sentir un objeto arrastrado y no una capa pegada
 * al cursor; sin ella se mueve como un sprite y se nota de inmediato.
 *
 * En táctil no existe: no hay puntero que seguir, así que la fila es sólo texto y
 * el toque abre la ficha. Lo decide `@media (hover: none)` en el CSS y la consulta
 * de abajo, que ni arranca el bucle.
 */

/** Cuánto de la distancia al cursor se recorre por fotograma. */
const SEGUIMIENTO = 0.12;
/** Grados máximos de inclinación, y cuánto pesa la velocidad en ellos. */
const INCLINACION_MAX = 8;
const INCLINACION_PESO = 0.3;

export function IndicePlazas() {
  const raiz = useRef<HTMLElement>(null);
  const visor = useRef<HTMLDivElement>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const [activa, setActiva] = useState<Plaza | null>(null);
  /** Qué foto lleva el visor. Índice, no la plaza: el visor no la necesita. */
  const [vista, setVista] = useState(0);
  const origen = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const nodo = dialogo.current;
    if (!nodo) return;
    /* showModal y no `open`: es lo que atrapa el foco, habilita Escape y pinta el
       ::backdrop sin escribir una línea para ello. */
    if (activa && !nodo.open) nodo.showModal();
    if (!activa && nodo.open) nodo.close();
  }, [activa]);

  useGSAP(
    () => {
      const nodo = raiz.current;
      const caja = visor.current;
      if (!nodo || !caja) return;

      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.from(gsap.utils.toArray<HTMLElement>(".js-fila", nodo), {
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: nodo, start: "top 84%", once: true },
        });
      }

      /* Sin puntero no hay visor que mover: ni se engancha el bucle. */
      if (window.matchMedia("(hover: none)").matches) return;

      let px = 0;
      let py = 0;
      let vx = 0;
      let vy = 0;
      let giro = 0;
      let encendido = false;
      let cuadro = 0;

      const alMover = (evento: PointerEvent) => {
        px = evento.clientX;
        py = evento.clientY;
      };
      window.addEventListener("pointermove", alMover, { passive: true });

      const seguir = () => {
        cuadro = requestAnimationFrame(seguir);
        if (!encendido) return;
        vx += (px - vx) * SEGUIMIENTO;
        vy += (py - vy) * SEGUIMIENTO;
        /* La inclinación sale de lo que le FALTA por recorrer, que es la velocidad
           con la que va: cuanto más lejos del cursor, más tumbado. */
        const objetivo = Math.max(
          -INCLINACION_MAX,
          Math.min(INCLINACION_MAX, (px - vx) * INCLINACION_PESO),
        );
        giro += (objetivo - giro) * 0.1;
        caja.style.transform = `translate3d(${vx.toFixed(1)}px,${vy.toFixed(1)}px,0) translate(-50%,-50%) rotate(${giro.toFixed(2)}deg)`;
      };
      seguir();

      const entrar = () => {
        encendido = true;
        /* Arranca donde está el cursor, no en 0,0: si no, el visor cruza la
           pantalla desde la esquina la primera vez. */
        vx = px;
        vy = py;
        caja.dataset.on = "si";
      };
      const salir = () => {
        encendido = false;
        delete caja.dataset.on;
      };
      nodo.addEventListener("pointerenter", entrar);
      nodo.addEventListener("pointerleave", salir);

      /* Al abrir la ficha, el visor estorba: la tapa a medias y sigue al cursor
         por encima del diálogo. */
      const apagar = () => salir();
      nodo.addEventListener("click", apagar);

      return () => {
        cancelAnimationFrame(cuadro);
        window.removeEventListener("pointermove", alMover);
        nodo.removeEventListener("pointerenter", entrar);
        nodo.removeEventListener("pointerleave", salir);
        nodo.removeEventListener("click", apagar);
      };
    },
    { scope: raiz },
  );

  const foto = PLAZAS[vista]?.foto;

  return (
    <section className="com-plazas" ref={raiz} aria-labelledby="plazas-titulo">
      <h2 className="com-plazas__titulo" id="plazas-titulo">
        {GALERIA_PLAZAS.titulo}
      </h2>

      <ul className="com-ix">
        {PLAZAS.map((plaza, k) => (
          <li key={plaza.id}>
            <button
              type="button"
              className="com-ix__f js-fila"
              onPointerEnter={() => setVista(k)}
              onFocus={() => setVista(k)}
              onClick={(evento) => {
                origen.current = evento.currentTarget;
                setActiva(plaza);
              }}
            >
              <span className="com-ix__n" aria-hidden="true">
                {String(k + 1).padStart(2, "0")}
              </span>
              <span className="com-ix__t">{plaza.nombre}</span>
              <span className="com-ix__l">{plaza.ubicacion}</span>
              {/* Los dos datos del <dl> de la ficha, resumidos en la fila. Donde
                  el copy no da visitantes va un guion, no un número inventado. */}
              <span className="com-ix__d">{plaza.datos[0].valor ?? "—"}</span>
              <span className="com-ix__d com-ix__d--num">{plaza.datos[1].valor ?? "—"}</span>
              <span className="com-ix__ver" aria-hidden="true">
                ↗
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/*
        El visor. aria-hidden porque es la misma foto que la ficha ya muestra con
        su alt: anunciarlo sería decir dos veces lo mismo, y además nunca se
        alcanza con el teclado.
      */}
      <div className="com-visor" ref={visor} aria-hidden="true">
        {foto && (
          <Image src={foto} alt="" fill sizes="280px" className="com-visor__img" />
        )}
      </div>

      <dialog
        ref={dialogo}
        className="com-fx"
        aria-label={activa ? `Ficha de ${activa.nombre}` : "Ficha de la plaza"}
        onClose={() => {
          setActiva(null);
          origen.current?.focus();
        }}
        onClick={(evento) => {
          // El backdrop es el propio <dialog>: un clic fuera cierra.
          if (evento.target === dialogo.current) setActiva(null);
        }}
      >
        {activa && (
          <article>
            <button
              type="button"
              className="com-fx__x"
              onClick={() => setActiva(null)}
              aria-label="Cerrar ficha"
            >
              ×
            </button>

            {/*
              La foto arriba, a todo el ancho y con el nombre encima; los datos y
              la descripción debajo. Lo que hace que entre sin barra no es la
              estructura sino el tope de alto de la foto, en comercial.css.
            */}
            <div
              className="com-fx__foto"
              /* La proporción del archivo. Sin el dato, 3/2: es la de cinco de
                 las ocho, así que un valor que falte falla por poco. */
              style={{ ["--proporcion" as string]: activa.fotoRatio ?? 1.5 }}
            >
              {activa.foto && (
                <Image
                  src={activa.foto}
                  alt={activa.alt}
                  fill
                  /* La caja ocupa el ancho entero del diálogo. */
                  sizes="(max-width: 900px) 94vw, 1040px"
                  className="com-fx__img"
                />
              )}
              <h3 className="com-fx__nombre">{activa.nombre}</h3>
            </div>

            <div className="com-fx__cuerpo">
              <dl className="com-fx__datos">
                <div className="com-fx__d">
                  <dt>Ubicación</dt>
                  <dd>{activa.ubicacion}</dd>
                </div>
                {activa.datos.map((dato) => (
                  <div className="com-fx__d" key={dato.etiqueta}>
                    <dt>{dato.etiqueta}</dt>
                    <dd>{dato.valor ?? "—"}</dd>
                  </div>
                ))}
              </dl>
              <p>{activa.descripcion}</p>
            </div>
          </article>
        )}
      </dialog>
    </section>
  );
}
