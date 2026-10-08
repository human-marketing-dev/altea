"use client";

import { useEffect, useRef } from "react";
import { CONTORNO, CONTRAFORMA, dentroDe, SEMI_ALTO } from "@/lib/isotipo";
import { useMovimientoReducido } from "@/app/ui/useMovimientoReducido";
import { HERO } from "./content";

/**
 * Hero de /nosotros: una nube de puntos que alterna entre el isotipo y una
 * pirámide.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * CÓMO SE FORMA CADA FIGURA
 *
 * Por rasterización, no por un trazado: se recorre la caja de la forma y se
 * conserva el punto si cae dentro de su contorno. La misma prueba de cruce de
 * rayos que usa el mapa de México, importada de lib/isotipo.
 *
 * El isotipo es el REAL, con su contraforma, no una A maciza: un punto cuenta si
 * está dentro del contorno Y fuera del hueco. Eso cambia la silueta de forma
 * apreciable —medido, un 69 % de coincidencia contra una A sin hueco— y para una
 * nube es mejor: el hueco le da estructura interna, que es justo lo que un
 * conjunto de puntos sabe mostrar.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * LO IMPORTANTE: LOS PUNTOS NO SE REINICIAN
 *
 * Las dos figuras se reducen al MISMO número de puntos, tomando uno de cada
 * tantos. Así cada punto tiene siempre un destino real en las dos y no hay que
 * apagar ni encender ninguno: la nube es la misma y sólo se mueve. Si una tuviera
 * más puntos que la otra, a los sobrantes habría que mandarlos a algún sitio y
 * apagarlos, y eso se ve como si desaparecieran.
 *
 * Cada punto lleva su propia velocidad, entre 0.019 y 0.041. EL RANGO IMPORTA
 * TANTO COMO EL VALOR: con todos iguales la nube viaja como un bloque rígido en
 * vez de reacomodarse.
 */

/**
 * La pirámide, GIRADA A LA IZQUIERDA.
 *
 * La arista frontal está desplazada a ese lado, así que la cara derecha ocupa
 * 2.79 veces la izquierda, y las dos esquinas de la base van a distinta altura.
 * Las dos cosas son lo que la hace leerse como un volumen girado en vez de dos
 * triángulos pegados. Las caras se separan además por tono: la izquierda al 50 %.
 */
const PIRAMIDE_IZQ: readonly [number, number][] = [
  [0, 1],
  [-0.96, -0.24],
  [-0.6, -0.86],
];
const PIRAMIDE_DER: readonly [number, number][] = [
  [0, 1],
  [-0.6, -0.86],
  [1, -0.56],
];

/** Alto de la pirámide en sus propias unidades, para escalarla como el isotipo. */
const ALTO_PIRAMIDE = 1.86;

/** Segundos en cada figura. Con el viaje en ~3.5 s, nueve dan margen de sobra. */
const SEGUNDOS = 9;

type Destino = { x: number; y: number; i: number };
type Punto = {
  x: number;
  y: number;
  v: number;
  isotipo: Destino;
  piramide: Destino;
};

export function HeroNube() {
  const lienzo = useRef<HTMLCanvasElement>(null);
  const reducido = useMovimientoReducido();

  useEffect(() => {
    const canvas = lienzo.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let W = 0;
    let H = 0;
    let puntos: Punto[] = [];

    const medir = () => {
      const caja = canvas.getBoundingClientRect();
      if (!caja.width) return false;
      const dpr = Math.min(window.devicePixelRatio, 2);
      W = caja.width;
      H = caja.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return true;
    };

    /** Rasteriza una figura. `caras` permite separar por tono; `hueco` descuenta. */
    const rasterizar = (
      caras: readonly (readonly [number, number][])[],
      altoForma: number,
      paso: number,
      hueco?: readonly [number, number][],
    ): Destino[] => {
      const alto = H * 0.74;
      const s = alto / altoForma;
      const cx = W * 0.72;
      const cy = H * 0.5;
      const salida: Destino[] = [];
      for (let py = -1.06; py <= 1.06; py += paso / s) {
        for (let px = -1.06; px <= 1.06; px += paso / s) {
          const cara = caras.findIndex((c) => dentroDe(px, py, c));
          if (cara < 0) continue;
          if (hueco && dentroDe(px, py, hueco)) continue;
          /* El tono sube con la altura: la punta es lo más vivo. */
          const base = 0.24 + ((py + 1) / 2.05) * 0.74;
          salida.push({
            x: cx + px * s,
            y: cy - py * s,
            i: cara === 0 && caras.length > 1 ? base * 0.5 : base,
          });
        }
      }
      return salida;
    };

    const construir = () => {
      if (!medir()) return;
      /* El paso de la retícula sale del alto, no de un número fijo: así la
         densidad se mantiene al cambiar de pantalla en vez de espesarse. */
      const paso = Math.max(5, H * 0.0115);
      let isotipo = rasterizar([CONTORNO], SEMI_ALTO * 2, paso, CONTRAFORMA);
      let piramide = rasterizar(
        [PIRAMIDE_IZQ, PIRAMIDE_DER],
        ALTO_PIRAMIDE,
        paso,
      );

      /*
       * IGUALAR LAS DENSIDADES ANTES DE IGUALAR LAS CUENTAS.
       *
       * Con el mismo paso, la pirámide da 2 298 puntos y el isotipo 1 380: es un
       * par de triángulos macizos contra un pórtico con un hueco, o sea bastante
       * más área. Reducir la densa por submuestreo —uno de cada 1.66— tira el
       * 40 % de sus puntos y, peor, los tira de forma ESTRUCTURADA sobre una
       * retícula: salen franjas diagonales.
       *
       * Así que se re-rasteriza la densa con el paso corregido por la raíz de la
       * razón de cuentas. La densidad es inversa al cuadrado del paso, de modo que
       * la raíz es exactamente el factor que las iguala: medido a 900px de alto,
       * las dos quedan en 1 380 y `igualar` no descarta ni un punto.
       */
      const ajustar = (
        a: Destino[],
        b: Destino[],
        rehacer: (p: number) => Destino[],
      ) =>
        a.length > b.length
          ? rehacer(paso * Math.sqrt(a.length / b.length))
          : a;

      if (isotipo.length > piramide.length) {
        isotipo = ajustar(isotipo, piramide, (q) =>
          rasterizar([CONTORNO], SEMI_ALTO * 2, q, CONTRAFORMA),
        );
      } else {
        piramide = ajustar(piramide, isotipo, (q) =>
          rasterizar([PIRAMIDE_IZQ, PIRAMIDE_DER], ALTO_PIRAMIDE, q),
        );
      }

      const n = Math.min(isotipo.length, piramide.length);
      /** Recorta el resto que quede tras el ajuste de densidad: unos pocos puntos. */
      const igualar = (a: Destino[]) => {
        const salto = a.length / n;
        return Array.from({ length: n }, (_, k) => a[Math.floor(k * salto)]);
      };
      const iso = igualar(isotipo);
      const pir = igualar(piramide);

      puntos = Array.from({ length: n }, (_, k) => ({
        /* Nacen dispersos por toda la caja y convergen: el primer ensamble forma
           parte de la escena, no es un estado que haya que esconder. */
        x: W * 0.5 + (Math.random() - 0.5) * W * 1.6,
        y: H * 0.5 + (Math.random() - 0.5) * H * 1.9,
        v: 0.019 + Math.random() * 0.022,
        isotipo: iso[k],
        piramide: pir[k],
      }));
    };

    construir();
    const observador = new ResizeObserver(construir);
    observador.observe(canvas);

    let cuadro = 0;
    let reloj = 0;
    let actual: "isotipo" | "piramide" = "isotipo";

    const pintar = () => {
      cuadro = requestAnimationFrame(pintar);
      if (!puntos.length) return;

      if (!reducido) {
        reloj += 1 / 60;
        actual = Math.floor(reloj / SEGUNDOS) % 2 ? "piramide" : "isotipo";
      }

      ctx.clearRect(0, 0, W, H);
      for (const p of puntos) {
        const d = p[actual];
        if (reducido) {
          p.x = d.x;
          p.y = d.y;
        } else {
          p.x += (d.x - p.x) * p.v;
          p.y += (d.y - p.y) * p.v;
        }
        const lejos = Math.min(1, Math.hypot(d.x - p.x, d.y - p.y) / 160);
        /* Se apaga un poco durante el viaje pero NUNCA llega a cero: si llegara,
           un punto en tránsito parecería haber desaparecido. */
        const a = (0.16 + d.i * 0.52) * (1 - lejos * 0.55);
        const r = (0.95 + d.i * 1.35) * (1 - lejos * 0.35);
        ctx.fillStyle =
          d.i > 0.15
            ? `rgba(241,93,77,${(a * 0.92).toFixed(3)})`
            : `rgba(33,34,34,${(a * 0.5).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    pintar();

    return () => {
      cancelAnimationFrame(cuadro);
      observador.disconnect();
    };
  }, [reducido]);

  const etiqueta = HERO.lineas
    .flat()
    .map((t) => t.texto)
    .join(" ");

  return (
    <section className="nos-hero">
      {/* Decorativo: lo que dice la sección lo dice el titular. */}
      <canvas ref={lienzo} className="nos-hero__lienzo" aria-hidden="true" />

      <div className="nos-hero__txt">
        {/* El aria-label lleva la frase entera y las líneas van aria-hidden:
            partida en cajas recortadas, un lector anunciaría tres fragmentos. */}
        <h1 className="nos-hero__titulo" aria-label={etiqueta}>
          {HERO.lineas.map((trozos, i) => (
            <span
              className="nos-hero__linea js-linea"
              aria-hidden="true"
              key={i}
            >
              <span>
                {trozos.map((t, j) => (
                  <span
                    key={j}
                    className={t.acento ? "nos-hero__acento" : undefined}
                  >
                    {t.texto}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h1>
        <p className="nos-hero__bajada js-entra">{HERO.bajada}</p>
      </div>
    </section>
  );
}
