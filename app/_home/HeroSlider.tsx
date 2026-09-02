"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useMovimientoReducido } from "@/app/ui/useMovimientoReducido";

export interface Diapositiva {
  src: string;
  alt: string;
}

const INTERVALO_MS = 6000;

/**
 * Fondo del hero en carrusel. Solo cambia la imagen: el titular y el copy se
 * quedan fijos, para que no salte el texto en cada vuelta.
 *
 * Con `prefers-reduced-motion` no avanza solo — se queda en la primera y los
 * puntos siguen funcionando.
 */
export function HeroSlider({ slides }: { slides: Diapositiva[] }) {
  const [activa, setActiva] = useState(0);
  // Al tocar un punto se detiene el avance: el usuario tomó el control.
  const [detenido, setDetenido] = useState(false);
  const reducido = useMovimientoReducido();
  const autoplay = !reducido && !detenido;

  useEffect(() => {
    if (!autoplay || slides.length < 2) return;
    const id = setInterval(
      () => setActiva((i) => (i + 1) % slides.length),
      INTERVALO_MS,
    );
    return () => clearInterval(id);
  }, [autoplay, slides.length]);

  return (
    <>
      <div className="home-hero__media" aria-hidden="true">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className="home-hero__slide"
            style={{ opacity: i === activa ? 1 : 0 }}
          >
            <Image
              src={slide.src}
              alt=""
              fill
              sizes="100vw"
              priority={i === 0}
              className="home-hero__img"
            />
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="home-hero__puntos" role="tablist" aria-label="Imágenes del banner">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={i === activa}
              aria-label={slide.alt}
              className={
                i === activa
                  ? "home-hero__punto home-hero__punto--activo"
                  : "home-hero__punto"
              }
              onClick={() => {
                setActiva(i);
                setDetenido(true);
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
