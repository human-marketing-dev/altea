"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GALERIA_PLAZAS } from "./content";

gsap.registerPlugin(useGSAP);

/** Grados por defecto si el CSS no declara --angulo. */
const ANGULO_BASE = 11;

/**
 * Showcase de plazas: una a la vez, a pantalla completa.
 *
 * Las siete fotos viven a la vez como capas apiladas y lo único que cambia es
 * cuál está descubierta. La que entra lo hace con una cortina diagonal en el
 * mismo ángulo del resto del sitio, y la foto de dentro se asienta de 1.12 a 1
 * MÁS DESPACIO que la cortina: el barrido solo se siente plano, y es ese medio
 * segundo de más el que le da cuerpo. No sincronizar las dos duraciones.
 */
export function ShowcasePlazas() {
  const { titulo, plazas } = GALERIA_PLAZAS;
  const raiz = useRef<HTMLElement>(null);
  const minis = useRef<HTMLUListElement>(null);
  const [activa, setActiva] = useState(0);
  /* Índice de la capa que hay que ocultar cuando termine la entrada. No es
     estado: cambiarlo no tiene que repintar nada. */
  const anterior = useRef(0);
  /* Cerrojo de navegación. Sin él, dos clics seguidos dejan dos capas a medio
     barrer y la de atrás no se llega a ocultar nunca. */
  const animando = useRef(false);

  const ir = (i: number) => {
    /* Se normaliza ANTES de comparar: `ir(activa - 1)` con la primera activa
       llega como -1 y tiene que resolverse a la última, no descartarse. */
    const destino = (i + plazas.length) % plazas.length;
    if (animando.current || destino === activa) return;
    setActiva(destino);
  };

  useGSAP(
    () => {
      const nodo = raiz.current;
      if (!nodo) return;

      const capas = gsap.utils.toArray<HTMLElement>(".js-capa", nodo);
      const entra = capas[activa];
      const sale = capas[anterior.current];
      if (!entra) return;

      const grados =
        parseFloat(getComputedStyle(nodo).getPropertyValue("--angulo")) || ANGULO_BASE;
      const dx = Math.tan((grados * Math.PI) / 180) * nodo.offsetHeight;
      const w = nodo.offsetWidth;
      const cerrado = `polygon(0 0, 0 0, ${-dx}px 100%, ${-dx}px 100%)`;
      const abierto = `polygon(0 0, ${w + dx}px 0, ${w}px 100%, ${-dx}px 100%)`;

      const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const primera = entra === sale;

      /* Al montar —y con movimiento reducido— no hay barrido: la capa activa se
         queda abierta y las demás cerradas, sin tween. */
      if (primera || reducido) {
        capas.forEach((capa, i) => {
          capa.style.clipPath = i === activa ? abierto : cerrado;
          capa.style.visibility = i === activa ? "visible" : "hidden";
        });
        animando.current = false;
        anterior.current = activa;
        return;
      }

      animando.current = true;
      entra.style.visibility = "visible";

      const foto = entra.firstElementChild;
      const tl = gsap.timeline({
        onComplete: () => {
          /* La que sale se oculta AQUÍ y no antes: si se quitara al arrancar,
             durante los 950ms de la cortina se vería el hueco por detrás. */
          if (sale && sale !== entra) {
            sale.style.visibility = "hidden";
            sale.style.clipPath = cerrado;
          }
          anterior.current = activa;
          animando.current = false;
        },
      });
      tl.fromTo(
        entra,
        { clipPath: cerrado },
        { clipPath: abierto, duration: 0.95, ease: "power3.inOut" },
        0,
      );
      if (foto) {
        tl.fromTo(
          foto,
          { scale: 1.12 },
          { scale: 1, duration: 1.5, ease: "power2.out" },
          0,
        );
      }

      /* La ficha entra escalonada, no de golpe: el orden de lectura —dónde
         está, cómo se llama, qué es— se refuerza con el orden de aparición. */
      const ficha = nodo.querySelector<HTMLElement>(".js-ficha");
      if (ficha) {
        gsap.from(ficha.children, {
          opacity: 0,
          y: 22,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
        });
      }
    },
    { scope: raiz, dependencies: [activa] },
  );

  /* El recorte va en píxeles y depende de la caja: hay que rehacerlo al
     redimensionar o la cortina abierta deja de cubrir la sección. */
  useGSAP(
    () => {
      const nodo = raiz.current;
      if (!nodo) return;
      const alRedimensionar = () => {
        const grados =
          parseFloat(getComputedStyle(nodo).getPropertyValue("--angulo")) || ANGULO_BASE;
        const dx = Math.tan((grados * Math.PI) / 180) * nodo.offsetHeight;
        const w = nodo.offsetWidth;
        const capa = gsap.utils.toArray<HTMLElement>(".js-capa", nodo)[activa];
        if (capa) capa.style.clipPath = `polygon(0 0, ${w + dx}px 0, ${w}px 100%, ${-dx}px 100%)`;
      };
      window.addEventListener("resize", alRedimensionar);
      return () => window.removeEventListener("resize", alRedimensionar);
    },
    { scope: raiz, dependencies: [activa] },
  );

  /*
   * Arrastra la miniatura activa al centro de su carril.
   *
   * Hace falta en pantallas chicas: las siete no caben —a 390px suman 666px en
   * un canal de 350— así que el carril rueda, y navegando con las flechas la
   * activa se quedaba fuera de vista sin ninguna pista de dónde estaba.
   *
   * Se mueve scrollLeft a mano y NO con scrollIntoView: aquél sube por los
   * ancestros y puede desplazar la página entera en vertical de paso. Esto sólo
   * toca el scroll de la lista.
   */
  useEffect(() => {
    const lista = minis.current;
    const boton = lista?.querySelector<HTMLElement>("[aria-current]");
    if (!lista || !boton) return;
    lista.scrollTo({
      left: boton.offsetLeft - (lista.clientWidth - boton.offsetWidth) / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [activa]);

  const plaza = plazas[activa];
  const total = String(plazas.length).padStart(2, "0");

  return (
    <section ref={raiz} className="com-show">
      <div className="com-show__fondos" aria-hidden="true">
        {plazas.map((p) => (
          <div key={p.id} className="com-show__capa js-capa">
            {/* Primer hijo a propósito: es el que la línea de tiempo escala. */}
            <div className="com-show__foto">
              {p.foto && <Image src={p.foto} alt="" fill sizes="100vw" />}
            </div>
            <span className="com-show__velo" />
          </div>
        ))}
      </div>

      <header className="com-show__cabecera">
        <h2 className="com-show__titulo">{titulo}</h2>
        <p className="com-show__contador">
          <span className="com-show__contador-actual">
            {String(activa + 1).padStart(2, "0")}
          </span>
          {" / "}
          <span className="com-show__contador-total">{total}</span>
        </p>
      </header>

      <div className="com-show__cuerpo">
        {/* aria-live para que el lector anuncie la plaza al cambiarla: el
            contenido se sustituye sin que nada reciba el foco. */}
        <div className="com-show__ficha js-ficha" aria-live="polite">
          <p className="com-show__lugar">
            <span className="com-show__marca" aria-hidden="true" />
            {plaza.ubicacion}
          </p>
          <h3 className="com-show__nombre">{plaza.nombre}</h3>
          <p className="com-show__desc">{plaza.descripcion}</p>
          <dl className="com-show__datos">
            {plaza.datos.map((dato) => (
              <div key={dato.etiqueta} className="com-show__dato">
                <dt>{dato.etiqueta}</dt>
                {/* Sin dato todavía: un guion, no una cifra inventada. */}
                <dd>{dato.valor ?? <span aria-label="Pendiente">—</span>}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <footer className="com-show__pie">
        <ul ref={minis} className="com-show__minis">
          {plazas.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                className="com-show__mini"
                aria-label={`Ver ${p.nombre}`}
                aria-current={i === activa ? "true" : undefined}
                onClick={() => ir(i)}
              >
                {p.foto && (
                  <Image src={p.foto} alt="" fill sizes="180px" />
                )}
                <span className="com-show__mini-raya" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>

        <div className="com-show__flechas">
          <button
            type="button"
            className="com-show__flecha"
            aria-label="Plaza anterior"
            onClick={() => ir(activa - 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <button
            type="button"
            className="com-show__flecha"
            aria-label="Plaza siguiente"
            onClick={() => ir(activa + 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </footer>
    </section>
  );
}
