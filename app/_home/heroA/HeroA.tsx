"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useMovimientoReducido } from "@/app/ui/useMovimientoReducido";
import { HERO_A } from "../content";
import {
  ALTO_MEDIO,
  estadoFinal,
  estadoInicial,
  GIRO_MEDIO,
  type EstadoHero,
} from "./estado";
import { MuroProyectos } from "./MuroProyectos";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Hero del home: el isotipo de Altea se construye pieza a pieza.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * SON DOS MOMENTOS, Y ESO ES LO IMPORTANTE
 *
 *   1 · el titular se va, y las piezas se ensamblan EN ESCORZO
 *   2 · ya montada, la A gira hasta quedar de frente
 *   3 · el muro de proyectos aparece detrás
 *
 * No se solapan. Con las dos cosas pasando a la vez no se leía ninguna: el giro
 * tapaba el ensamble y el ensamble desordenaba el giro. Por eso el primer tramo
 * apenas mueve la cámara —de GIRO_ESCORZO a GIRO_MEDIO, que es abrir un poco el
 * escorzo, no girar— y el enderezado espera a que las seis piezas estén puestas.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * THREE LLEGA APARTE
 *
 * Escena3D es el único módulo que importa `three`, y entra por next/dynamic con
 * ssr:false. Dos razones, y la primera no es el peso:
 *
 *   · WebGLRenderer toca `document` al construirse, así que en SSR revienta.
 *   · Son 143 KB gzip medidos (567 851 B en crudo, minificado y con el árbol
 *     sacudido, contra three 0.186.1). Sacar eso del bundle del home y pedirlo
 *     sólo al montar es gratis, porque el hero NO NECESITA el objeto: titular,
 *     fondo y muro son HTML y CSS, y la A es decorativa. Lo que se ve mientras
 *     carga el chunk es el hero completo sin la pieza de hormigón.
 *
 * Con prefers-reduced-motion ni se pide el chunk: no hay nada que animar y una A
 * de hormigón quieta no aporta sobre el titular.
 */
const Escena3D = dynamic(() => import("./Escena3D"), { ssr: false });

export function HeroA() {
  const raiz = useRef<HTMLDivElement>(null);
  const reducido = useMovimientoReducido();

  /*
   * El puente con la escena 3D. Objeto mutable y NO estado de React: lo escribe
   * GSAP a 60 fps y lo lee el bucle de render. Por useState serían sesenta
   * renders por segundo de todo el hero para no cambiar ni una etiqueta.
   */
  const estado = useRef<EstadoHero>(reducido ? estadoFinal() : estadoInicial());

  /* Espejo de muroListo, para no llamar a setState por frame. Ver onUpdate. */
  const muro = useRef(reducido);
  /* Ver el comentario de `visible` en MuroProyectos: las ocho fotos no se montan
     hasta que el recorrido arranca, para no competir con el LCP. */
  const [muroListo, setMuroListo] = useState(reducido);

  useGSAP(
    () => {
      const nodo = raiz.current;
      if (!nodo) return;

      if (reducido) {
        estado.current = estadoFinal();
        /* No basta el useState(reducido) del principio: si la preferencia se
           activa con la página ya abierta, el estado inicial ya se calculó a
           false y el muro se quedaría visible pero sin fotos. */
        muro.current = true;
        setMuroListo(true);
        return;
      }

      /* Entrada, sin scroll: el titular sube desde su propia caja recortada. */
      gsap.from(gsap.utils.toArray<HTMLElement>(".js-linea > span", nodo), {
        yPercent: 112,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.09,
        delay: 0.1,
      });
      gsap.from(gsap.utils.toArray<HTMLElement>(".js-entra", nodo), {
        opacity: 0,
        y: 14,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.09,
        delay: 0.5,
      });

      const est = estado.current;
      const linea = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: nodo,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
          /*
           * El callback NO se fue con el rótulo de fase, aunque casi todo lo que
           * hacía era para él. Lo que queda es la única línea que no tenía nada
           * que ver: encender las ocho fotos del muro en cuanto el recorrido
           * arranca. Están dentro del viewport desde el primer frame —el muro
           * empieza en opacity 0 y la opacidad no cuenta para
           * IntersectionObserver—, así que sin esta puerta se descargarían
           * compitiendo con el LCP, que es el titular.
           *
           * La guarda por referencia se queda: onUpdate corre a 60 fps y esto
           * tiene que pasar una sola vez.
           */
          onUpdate: (s) => {
            if (s.progress > 0.02 && !muro.current) {
              muro.current = true;
              setMuroListo(true);
            }
          },
        },
      });

      linea
        .to(".js-titular", { yPercent: -14, opacity: 0, duration: 0.85, ease: "power2.in" }, 0)
        /* 1 · se construye de lado. El escorzo apenas se abre aquí: lo que ocupa
           la atención es el ensamble, no la cámara. */
        .to(est, { ensamble: 1, duration: 1.5 }, 0.1)
        .to(est, { giro: GIRO_MEDIO, alto: ALTO_MEDIO, duration: 1.5 }, 0.1)
        /* 2 · ya montada, se presenta de frente. */
        .to(est, { giro: 0, alto: 0, duration: 1.15, ease: "power2.inOut" }, 1.62)
        /* El muro entra al irse el titular, mientras la A se arma: así el fondo
           ya está puesto cuando la pieza se endereza y no aparece encima. */
        .to(".js-muro", { opacity: 1, duration: 0.85, ease: "power2.out" }, 0.45);

    },
    { scope: raiz, dependencies: [reducido] },
  );

  const etiqueta = HERO_A.lineas
    .flat()
    .map((t) => t.texto)
    .join(" ");
  return (
    <div className="hero-a" ref={raiz}>
      <div className="hero-a__escena">
        <div className="hero-a__fondo js-muro">
          <MuroProyectos visible={muroListo} reducido={reducido} />
        </div>

        {!reducido && <Escena3D estado={estado} reducido={reducido} />}

        <div className="hero-a__titular js-titular">
          <p className="hero-a__ceja js-entra">
            <i className="hero-a__marca" aria-hidden="true" />
            {HERO_A.eyebrow}
          </p>
          {/*
            El aria-label lleva la frase entera y las líneas van aria-hidden, como
            en el resto del sitio: partida en dos cajas recortadas, un lector de
            pantalla anunciaría dos fragmentos y leería "que" como una línea
            suelta.
          */}
          <h1 className="hero-a__titulo" aria-label={etiqueta}>
            {HERO_A.lineas.map((trozos, i) => (
              <span className="hero-a__linea js-linea" aria-hidden="true" key={i}>
                <span>
                  {trozos.map((t, j) => (
                    <span key={j} className={t.atenuado ? "hero-a__atenuado" : undefined}>
                      {t.texto}
                      {j < trozos.length - 1 ? " " : null}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>
        </div>
      </div>
    </div>
  );
}
