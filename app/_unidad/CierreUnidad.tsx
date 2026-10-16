"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { CANALES, enlaceWhatsApp } from "@/lib/contacto";
import type { Unidad } from "@/lib/contacto";
import { ruta } from "@/lib/rutas";
import type { CierreConFoto } from "./tipos";

/**
 * El cierre de una unidad con la foto que SE SALE DEL PANEL por arriba.
 *
 * Una prueba en las cuatro unidades (octubre de 2026). Sustituye ahí a <CierreContacto>
 * en su mismo lugar y con su mismo copy —rótulo, titular, los dos botones y el
 * correo—; lo que cambia es la forma. Se monta sólo si la unidad trae `cierre`
 * en su contenido, así que volver al de antes es borrar ese campo.
 *
 * ESE DESBORDE ES TODA LA PIEZA. Por eso la foto va HERMANA del panel y no
 * dentro: el border-radius del panel la recortaría por arriba. Y ningún
 * ancestro puede llevar overflow: hidden o clip (comprobado hasta <html>).
 *
 * Sin id="contacto", a diferencia de <CierreContacto>: ese id dispara la
 * entrada de motion.css en sus hijos directos —`#contacto > *`—, y aquí el
 * panel y la foto ya entran con la suya. Ningún enlace del sitio apunta a ese
 * ancla.
 *
 * El color y la foto salen del contenido, no de aquí: montarlo en otra unidad
 * es darle `cierre` en su archivo.
 */
export function CierreUnidad({
  eyebrow,
  title,
  unidad,
  cierre,
}: {
  eyebrow: string;
  title: string;
  unidad: Unidad;
  cierre: CierreConFoto;
}) {
  const raiz = useRef<HTMLElement>(null);
  const contacto = ruta(`/contacto?unidad=${unidad.toLowerCase()}`);

  /*
   * LA ENTRADA CON EL SCROLL, la de los demás bloques: un valor de 0 a 1 que
   * sale de la posición de la sección, no un progreso global. Con movimiento
   * reducido no se engancha y --k se queda en 1, el de la hoja.
   */
  useEffect(() => {
    const nodo = raiz.current;
    if (!nodo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pintar = () => {
      const r = nodo.getBoundingClientRect();
      const k = Math.max(
        0,
        Math.min(1, (innerHeight - r.top) / (innerHeight * 0.38)),
      );
      nodo.style.setProperty("--k", k.toFixed(3));
    };
    pintar();
    let pedido = false;
    const alScroll = () => {
      if (pedido) return;
      pedido = true;
      requestAnimationFrame(() => {
        pedido = false;
        pintar();
      });
    };
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);
    return () => {
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alScroll);
    };
  }, []);

  return (
    <section
      className="uni-cta"
      ref={raiz}
      aria-labelledby="cierre-unidad-titulo"
      style={{
        ["--cta-color" as string]: cierre.color,
        /* Para reservar en móvil el hueco exacto de la foto: ver unidad.css. */
        ["--cta-proporcion" as string]: cierre.foto.ancho / cierre.foto.alto,
        ...(cierre.foto.tope
          ? { ["--cta-tope" as string]: cierre.foto.tope }
          : {}),
      }}
    >
      <div className="uni-cta__panel">
        <div className="uni-cta__tex">
          <p className="uni-cta__rot">{eyebrow}</p>
          <h2 id="cierre-unidad-titulo">{title}</h2>
          <div className="uni-cta__acciones">
            <a
              className="altea-btn altea-btn--dark altea-btn--lg"
              href={enlaceWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Contáctanos por WhatsApp
              <span className="altea-btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
            <a
              className="altea-btn altea-btn--outline altea-btn--lg uni-cta__secundario"
              href={contacto}
            >
              Ir a contacto
              <span className="altea-btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
          <a className="uni-cta__correo" href={`mailto:${CANALES.correo}`}>
            {CANALES.correo}
          </a>
        </div>
      </div>
      {/*
        Decorativa: el titular ya dice lo que hay que decir.
        `sizes`: la foto se dimensiona por el ALTO de la sección (≤ 444 px) y es
        1.76 veces más ancha que alta, así que en escritorio no pasa de ~790 px;
        en móvil va a min(62 %, 300 px). quality 90: ver next.config.ts.
      */}
      <Image
        className="uni-cta__foto"
        src={cierre.foto.src}
        width={cierre.foto.ancho}
        height={cierre.foto.alto}
        alt=""
        aria-hidden="true"
        sizes="(max-width: 820px) 300px, 800px"
        quality={90}
      />
    </section>
  );
}
