"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export interface FotoCarrusel {
  src: string;
  alt: string;
}

/**
 * Varias fotos en una caja, una a la vez: la de Viveros Asturias en /forestal y
 * la de la historia en /nosotros.
 *
 * LA CAJA LA PONE QUIEN LO USA, por `className`: el carrusel no decide su
 * tamaño ni su proporción, ocupa la caja de la foto única que sustituye
 * (.uni-ln__foto, .nos-origen__foto). Así pasar de una foto a varias no
 * descoloca la composición.
 *
 * Vivía en app/_unidad; subió a ui/ cuando lo pidió /nosotros (octubre de
 * 2026), y con él sus estilos, de unidad.css a components.css.
 *
 * EL DESPLAZAMIENTO ES NATIVO —overflow-x con scroll-snap—, como el carrusel de
 * tarjetas: el dedo y el trackpad funcionan sin programarlos, y las flechas y
 * los puntos sólo empujan ese mismo scroll. La foto actual se lee del scroll,
 * no se lleva aparte, así que nunca se desincronizan.
 *
 * Sin reproducción automática: una foto que cambia sola junto a un párrafo
 * distrae de leerlo, y quien quiera verlas tiene las flechas.
 */
export function CarruselFotos({
  fotos,
  sizes,
  etiqueta,
  className,
}: {
  fotos: FotoCarrusel[];
  /** Uno por foto: cada una tiene su proporción. */
  sizes: string[];
  /** Para el lector de pantalla: "Fotos de Viveros Asturias". */
  etiqueta: string;
  /** La caja: su tamaño, su proporción y su radio. */
  className?: string;
}) {
  const pista = useRef<HTMLDivElement>(null);
  const [actual, setActual] = useState(0);
  const total = fotos.length;

  useEffect(() => {
    const nodo = pista.current;
    if (!nodo) return;
    let pedido = 0;
    const leer = () => {
      pedido = 0;
      const ancho = nodo.clientWidth || 1;
      setActual(Math.min(total - 1, Math.round(nodo.scrollLeft / ancho)));
    };
    const alScroll = () => {
      if (pedido) return;
      pedido = requestAnimationFrame(leer);
    };
    nodo.addEventListener("scroll", alScroll, { passive: true });
    return () => {
      cancelAnimationFrame(pedido);
      nodo.removeEventListener("scroll", alScroll);
    };
  }, [total]);

  const ir = (i: number) => {
    const nodo = pista.current;
    if (!nodo) return;
    /* Da la vuelta: después de la última, la primera. */
    const destino = (i + total) % total;
    const reducido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    nodo.scrollTo({
      left: destino * nodo.clientWidth,
      behavior: reducido ? "auto" : "smooth",
    });
  };

  return (
    <div
      className={className ? `altea-cf ${className}` : "altea-cf"}
      role="region"
      aria-roledescription="carrusel"
      aria-label={etiqueta}
    >
      <div className="altea-cf__pista" ref={pista}>
        {fotos.map((foto, i) => (
          <div
            className="altea-cf__foto"
            key={foto.src}
            role="group"
            aria-roledescription="foto"
            aria-label={`${i + 1} de ${total}`}
          >
            <Image
              src={foto.src}
              alt={foto.alt}
              fill
              sizes={sizes[i]}
              className="altea-cf__img"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="altea-cf__bt altea-cf__bt--ant"
        aria-label="Foto anterior"
        onClick={() => ir(actual - 1)}
      >
        <span aria-hidden="true">←</span>
      </button>
      <button
        type="button"
        className="altea-cf__bt altea-cf__bt--sig"
        aria-label="Foto siguiente"
        onClick={() => ir(actual + 1)}
      >
        <span aria-hidden="true">→</span>
      </button>

      <div className="altea-cf__puntos">
        {fotos.map((foto, i) => (
          <button
            type="button"
            className="altea-cf__punto"
            key={foto.src}
            aria-label={`Ver foto ${i + 1} de ${total}`}
            aria-current={i === actual ? "true" : undefined}
            onClick={() => ir(i)}
          />
        ))}
      </div>
    </div>
  );
}
