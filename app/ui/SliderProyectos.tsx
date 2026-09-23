"use client";

import { useState } from "react";
import { MediaSlot } from "./MediaSlot";

export interface DiapositivaProyecto {
  id: string;
  foto?: string;
  alt: string;
  label: string;
  /** La frase de arriba del pie. */
  dato: string;
  proyecto: string;
  ubicacion: string;
}

export interface SliderProyectosProps {
  diapositivas: readonly DiapositivaProyecto[];
  /** Para el aria-label del carrusel: "Proyectos de Comercial". */
  etiqueta: string;
}

/**
 * Carrusel controlado de proyectos, dentro de la tarjeta del hero.
 *
 * La pista es un flex que se desplaza con `translateX`, no un contenedor con
 * scroll-snap: el paso lo manda el control, no el dedo. Con snap habría dos
 * fuentes de verdad —la posición del scroll y el índice— y se desincronizan en
 * cuanto una transición se interrumpe.
 *
 * SIN reproducción automática, a propósito. Es un hero y ya compite con el
 * titular; un carrusel que avanza solo obliga a leer contra reloj y es la causa
 * más común de que estos componentes se vuelvan inaccesibles.
 */
export function SliderProyectos({ diapositivas, etiqueta }: SliderProyectosProps) {
  const [activa, setActiva] = useState(0);
  const total = diapositivas.length;

  const ir = (delta: number) => setActiva((i) => (i + delta + total) % total);

  return (
    <div
      className="altea-slider"
      role="group"
      aria-roledescription="carrusel"
      aria-label={etiqueta}
      /* Las flechas del teclado avanzan con el foco DENTRO del slider. El
         evento sube desde los botones y desde las rayas, así que no hace falta
         hacer el contenedor enfocable — que sería una parada de tabulación de
         más sin nada que hacer en ella. */
      onKeyDown={(evento) => {
        if (evento.key === "ArrowRight") {
          evento.preventDefault();
          ir(1);
        } else if (evento.key === "ArrowLeft") {
          evento.preventDefault();
          ir(-1);
        }
      }}
    >
      <div
        className="altea-slider__pista"
        style={{ transform: `translateX(-${activa * 100}%)` }}
      >
        {diapositivas.map((d, i) => (
          <figure
            key={d.id}
            className="altea-slider__lamina"
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${total}`}
            /* `inert` y no sólo aria-hidden: saca la lámina del árbol de
               accesibilidad Y de la navegación por teclado de una vez. */
            inert={i !== activa}
          >
            <MediaSlot
              className="altea-slider__media"
              label={d.label}
              src={d.foto}
              alt={d.alt}
              sizes="(max-width: 900px) 100vw, 620px"
              priority={i === 0}
            />
            {/* El degradado va en su propia capa y no como otro background del
                contenedor: MediaSlot ya usa el suyo para el hueco del placeholder. */}
            <span className="altea-slider__velo" aria-hidden="true" />

            <figcaption className="altea-slider__pie">
              <p className="altea-slider__dato">{d.dato}</p>
              {/* Los espacios van como texto, no como `gap`: si el separador lo
                  pusiera el CSS, copiar el pie daría "Paseo La FeSan Nicolás…". */}
              <p className="altea-slider__proyecto">
                <b className="altea-slider__nombre">{d.proyecto}</b>
                {" · "}
                <span className="altea-slider__ubicacion">{d.ubicacion}</span>
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Toda la navegación arriba a la derecha, en una fila: primero las
          rayas y después las flechas. El pie de la tarjeta queda despejado. */}
      <div className="altea-slider__controles">
        {/* Rayas cortas, no puntos: a 3px de alto un punto es una mota y la
            diferencia entre activo e inactivo deja de leerse. */}
        <div className="altea-slider__rayas">
          {diapositivas.map((d, i) => (
            <button
              key={d.id}
              type="button"
              className="altea-slider__raya"
              aria-label={`Ir a ${d.proyecto}`}
              aria-current={i === activa ? "true" : undefined}
              onClick={() => setActiva(i)}
            />
          ))}
        </div>

        <button
          type="button"
          className="altea-slider__flecha"
          aria-label="Proyecto anterior"
          onClick={() => ir(-1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        <button
          type="button"
          className="altea-slider__flecha"
          aria-label="Proyecto siguiente"
          onClick={() => ir(1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>

    </div>
  );
}
