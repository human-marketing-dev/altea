"use client";

import { useEffect } from "react";

/**
 * Apariciones al scroll para navegadores sin `animation-timeline: view()`.
 *
 * motion.css ya resuelve esto sin JavaScript donde hay soporte (Chrome, Edge,
 * Safari reciente). Firefox y Safari anteriores se quedaban sin ninguna
 * animación: este componente cubre ese hueco con IntersectionObserver.
 *
 * No toca el marcado de las páginas — consulta el DOM y añade una clase. Como
 * la clase la pone el JS, sin JavaScript todo queda visible por defecto.
 */
const SELECTORES = [
  ".home-stats__intro",
  ".home-stats__item",
  ".home-video__frame",
  ".home-why > *",
  ".home-units__title",
  ".home-units__grid > li",
  ".home-emblem__isotipo",
  ".home-emblem__palabra",
  ".home-cta__media",
  ".home-cta__body",
  ".home-projects__title",
  ".nos-origen__media",
  ".nos-origen__body",
  ".nos-huella__body",
  ".nos-intro__phrase",
  ".nos-angulo__content .altea-section-heading > *",
  ".nos-rs__galeria > li",
  ".nos-rs__copy",
  "#contacto > *",
].join(", ");

export function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Donde el navegador ya lo hace en CSS, no hacemos nada.
    if (CSS.supports("animation-timeline", "view()")) return;

    const elementos = Array.from(
      document.querySelectorAll<HTMLElement>(SELECTORES),
    );
    if (!elementos.length) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.classList.add("js-revelar--visible");
          observador.unobserve(entrada.target);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -22% 0px" },
    );

    for (const [indice, elemento] of elementos.entries()) {
      elemento.classList.add("js-revelar");
      // Escalonado corto entre hermanos, para que una fila no entre de golpe.
      const hermanos = elemento.parentElement?.children;
      const posicion = hermanos ? Array.from(hermanos).indexOf(elemento) : indice;
      elemento.style.transitionDelay = `${Math.min(posicion, 5) * 110}ms`;
      observador.observe(elemento);
    }

    return () => observador.disconnect();
  }, []);

  return null;
}
