"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { CountUp } from "@/app/ui";
import { useMovimientoReducido } from "@/app/ui/useMovimientoReducido";
import { CIFRAS_COMERCIAL, HERO_CALADO, PLAZAS } from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Hero de /comercial: la palabra "Comercial" con la fotografía dentro.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * EL CALADO
 *
 * `background-clip: text` con `color: transparent`. El texto SIGUE EN EL DOM, así
 * que un lector de pantalla lo lee como cualquier <h1> — no es una imagen con
 * texto dentro, es texto con imagen dentro.
 *
 * Detrás va una copia de la misma palabra en `-webkit-text-stroke`, apilada con
 * `grid-area: 1/1`. HACE FALTA: sobre las zonas claras de una foto, la palabra se
 * pierde justo donde la imagen es más brillante, y el contorno es lo que mantiene
 * la silueta. Es decorativa y va aria-hidden: la palabra ya la dice el <h1>.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * LA FOTO ALTERNA ENTRE LAS OCHO PLAZAS
 *
 * Cada 4.2 s, y arriba a la derecha aparece cuál es. Así el hero enseña los ocho
 * centros sin ocupar más sitio, y el nombre convierte la imagen en información en
 * vez de decoración.
 *
 * El cambio va con un FUNDIDO DEL BLOQUE ENTERO, no sustituyendo la imagen en
 * seco: un corte entre dos fotos dentro de las letras se ve como un parpadeo.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * EL VELO DE 25 %
 *
 * Medido foto a foto: dos de las ocho —Paseo Durango y Punto Río Nilo— no llegan
 * a 3:1 contra el gris de página ni de media, con el 48 % y el 43 % de su banda
 * central por debajo del umbral. Con un velo negro al 25 % las ocho suben a entre
 * 4.71 y 8.80 de media. Ver la tabla en el reporte.
 *
 * El velo va como primera capa del `background-image`, encima de la foto y
 * recortado por las mismas letras, no como un elemento aparte.
 */

/** Cuánto se oscurece la foto para que la palabra cumpla sobre el fondo claro. */
const VELO = 0.25;

export function HeroCalado() {
  const raiz = useRef<HTMLElement>(null);
  const reducido = useMovimientoReducido();
  const [i, setI] = useState(0);

  useGSAP(
    () => {
      const nodo = raiz.current;
      if (!nodo) return;
      const palabra = nodo.querySelector<HTMLElement>(".js-calado");
      if (!palabra) return;

      /* El fondo se escribe desde JS porque la ruta cambia con la plaza. El velo
         va delante en la lista: en CSS la primera capa es la de arriba. */
      const pintar = (k: number) => {
        const foto = PLAZAS[k]?.foto;
        if (!foto) return;
        palabra.style.backgroundImage = `linear-gradient(rgb(0 0 0 / ${VELO}), rgb(0 0 0 / ${VELO})), url("${foto}")`;
      };
      pintar(0);

      if (reducido) return;

      /* El parallax interno: el texto está QUIETO y lo que viaja es lo que se ve
         por dentro. Es sutil, pero es lo que delata que hay una imagen ahí y no
         un relleno plano. */
      gsap.fromTo(
        palabra,
        { backgroundPositionY: "42%" },
        {
          backgroundPositionY: "58%",
          ease: "none",
          scrollTrigger: { trigger: nodo, start: "top top", end: "bottom top", scrub: 0.6 },
        },
      );

      gsap.from(gsap.utils.toArray<HTMLElement>(".js-entra", nodo), {
        opacity: 0,
        y: 18,
        duration: 0.85,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.35,
      });
      gsap.from(palabra.parentElement, {
        opacity: 0,
        scale: 0.985,
        duration: 1.1,
        ease: "power3.out",
      });

      /*
       * La alternancia. El fundido lo lleva GSAP y el cambio de foto ocurre DENTRO
       * del onComplete, con el bloque ya invisible: si se cambiara antes, se vería
       * el corte durante el propio fundido.
       */
      let k = 0;
      const reloj = window.setInterval(() => {
        k = (k + 1) % PLAZAS.length;
        gsap.to(palabra, {
          opacity: 0,
          duration: 0.45,
          ease: "power2.in",
          onComplete: () => {
            pintar(k);
            setI(k);
            gsap.to(palabra, { opacity: 1, duration: 0.6, ease: "power2.out" });
          },
        });
      }, HERO_CALADO.segundos * 1000);

      return () => window.clearInterval(reloj);
    },
    { scope: raiz, dependencies: [reducido] },
  );

  const plaza = PLAZAS[i];

  return (
    <section className="com-hero" ref={raiz}>
      {/* Con el eyebrow fuera queda sólo el dato de la plaza, así que se alinea a
          la derecha en vez de dejar el hueco de una columna vacía. */}
      <p className="com-hero__cual js-entra">
        {plaza.nombre} · {plaza.ubicacion}
      </p>

      <div className="com-hero__calado">
        <div className="com-hero__capas">
          <h1 className="com-hero__t js-calado">{HERO_CALADO.palabra}</h1>
          <span className="com-hero__t com-hero__eco" aria-hidden="true">
            {HERO_CALADO.palabra}
          </span>
        </div>
        <p className="com-hero__desc js-entra">{HERO_CALADO.descripcion}</p>
      </div>

      <div className="com-hero__bajo js-entra">
        <p className="com-hero__desliza">
          <span>{HERO_CALADO.pieDesliza}</span>
          <span className="com-hero__raya" aria-hidden="true" />
        </p>

        <dl className="com-hero__datos">
          {CIFRAS_COMERCIAL.map((cifra) => (
            <div className="com-hd" key={cifra.etiqueta}>
              {/* dt antes que dd, que es lo que pide un <dl>; la cifra se ve
                  primero porque la rejilla la coloca en la primera fila. */}
              <dt className="com-hd__etiqueta">{cifra.etiqueta}</dt>
              <dd className="com-hd__cifra" aria-label={cifra.lectura}>
                <CountUp to={cifra.valor} prefix={cifra.prefijo} suffix={cifra.signo} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
