"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FotoLinea } from "./tipos";

/**
 * Varias fotos en la caja de una línea de negocio, una a la vez (Viveros
 * Asturias). La caja es la misma .uni-ln__foto de la foto única: mide lo que
 * el texto en escritorio y va en 4/3 en móvil.
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
}: {
  fotos: FotoLinea[];
  /** Uno por foto: cada una tiene su proporción. */
  sizes: string[];
  /** Para el lector de pantalla: "Fotos de Viveros Asturias". */
  etiqueta: string;
}) {
  const pista = useRef<HTMLDivElement>(null);
  const [actual, setActual] = useState(0);
  const total = fotos.length;

  useEffect(() => {
    const nodo = pista.current;
    if (!nodo) return;
    let pedido = false;
    const leer = () => {
      pedido = false;
      const ancho = nodo.clientWidth || 1;
      setActual(Math.min(total - 1, Math.round(nodo.scrollLeft / ancho)));
    };
    const alScroll = () => {
      if (pedido) return;
      pedido = true;
      requestAnimationFrame(leer);
    };
    nodo.addEventListener("scroll", alScroll, { passive: true });
    return () => nodo.removeEventListener("scroll", alScroll);
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
      className="uni-ln__foto uni-cf"
      role="region"
      aria-roledescription="carrusel"
      aria-label={etiqueta}
    >
      <div className="uni-cf__pista" ref={pista}>
        {fotos.map((foto, i) => (
          <div
            className="uni-cf__foto"
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
              className="uni-ln__img"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="uni-cf__bt uni-cf__bt--ant"
        aria-label="Foto anterior"
        onClick={() => ir(actual - 1)}
      >
        <span aria-hidden="true">←</span>
      </button>
      <button
        type="button"
        className="uni-cf__bt uni-cf__bt--sig"
        aria-label="Foto siguiente"
        onClick={() => ir(actual + 1)}
      >
        <span aria-hidden="true">→</span>
      </button>

      <div className="uni-cf__puntos">
        {fotos.map((foto, i) => (
          <button
            type="button"
            className="uni-cf__punto"
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
