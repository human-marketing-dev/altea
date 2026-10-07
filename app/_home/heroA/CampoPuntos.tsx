"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import type { EstadoHero } from "./estado";

/**
 * El campo de puntos que se construye detrás de la A.
 *
 * Es la misma trama de puntos del resto del sitio —la nube del hero de
 * /nosotros, el mapa de México— puesta aquí como fondo. SUSTITUYE AL MURO DE
 * FOTOS que había: ocho fachadas distintas detrás de una letra que se monta son
 * ocho focos de atención, y por muy velado que fuera el muro seguía siendo
 * fotografía compitiendo con la pieza. Un fondo no debería tener tema.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * NO ENTRA CON UN DESVANECIDO
 *
 * El scroll empuja una ONDA que sale de detrás de la pieza y recorre el cuadro.
 * Cada punto se enciende, crece y vira a coral cuando el frente le pasa por
 * encima, y se queda encendido detrás. Así el campo se construye igual que la A,
 * de dentro hacia afuera, en vez de aparecer entero y después ponerse opaco.
 *
 * (El contenedor sí lleva un fundido de entrada, y es otra cosa: es la puerta
 * que impide que los primeros puntos asomen por debajo del titular mientras el
 * titular todavía se está yendo. La onda es cómo se construye el campo; el
 * fundido es cuándo se le permite empezar a verse.)
 *
 * ────────────────────────────────────────────────────────────────────────────
 * LO CARO SE PRECALCULA
 *
 * Los puntos se siembran una vez por medida, y con ellos las dos cosas que no
 * cambian nunca: su distancia al foco —que es lo que decide cuándo le llega el
 * frente— y un desfase propio. ESE DESFASE ES LO QUE HACE QUE EL FRENTE SEA UNA
 * ORLA IRREGULAR y no un anillo perfecto; sin él la onda se lee como un círculo
 * expandiéndose, que es exactamente lo que no es.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * SOBRE FONDO CLARO LOS VALORES SE INVIERTEN, Y NO DE LA MANERA OBVIA
 *
 * El asentado tiene que ser un gris CÁLIDO OSCURO: el cream del fondo oscuro
 * sería invisible sobre --surface-page. Y el techo de opacidad SUBE en vez de
 * bajar, que es lo que no se ve venir: el coral se pinta sobre un fondo claro,
 * así que a 0.66 de opacidad salía salmón pálido. A 0.80 llega a rgb(232,118,104)
 * y ya se lee como coral.
 */

/** Asentado: el gris cálido al que vuelve el punto cuando el frente ya pasó. */
const C0 = [96, 80, 74];
/**
 * Cresta: el coral del frente.
 *
 * Es algo más vivo que el #F15D4D de marca a propósito: a estas opacidades el
 * coral exacto se lee apagado. El token manda en los objetos gráficos, no en una
 * trama de puntos translúcidos que nunca llega a pintarse a opacidad plena.
 */
const C1 = [228, 74, 55];

/** Tope de opacidad de un punto. Ver la cabecera: sube sobre fondo claro. */
const TECHO = 0.8;

/** Cuánto se pasa el frente del borde, para que el cuadro acabe lleno. */
const ALCANCE = 1.35;

export function CampoPuntos({
  estado,
  reducido,
}: {
  estado: React.RefObject<EstadoHero>;
  reducido: boolean;
}) {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let W = 0;
    let H = 0;
    let t = 0;
    let puntos: { px: number; py: number; r: number; j: number }[] = [];

    const sembrar = () => {
      const paso = Math.max(15, Math.min(25, W / 64));
      /* El foco va algo a la derecha del centro: es donde queda la masa de la A
         con la banderola, y la onda tiene que salir de detrás de la pieza. */
      const fx = W * 0.58;
      const fy = H * 0.5;
      const diag = Math.hypot(W, H);
      puntos = [];
      for (let py = paso / 2; py < H; py += paso) {
        for (let px = paso / 2; px < W; px += paso) {
          /* El 1.1 achata el frente: el cuadro es apaisado y una onda circular
             llega a los costados mucho después que arriba y abajo. */
          const d = Math.hypot(px - fx, (py - fy) * 1.1);
          puntos.push({
            px,
            py,
            r: d / (diag * 0.56),
            j: (Math.sin(px * 12.9898 + py * 78.233) * 43758.5453) % 1,
          });
        }
      }
    };

    const medir = () => {
      const caja = canvas.getBoundingClientRect();
      if (!caja.width) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      W = caja.width;
      H = caja.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sembrar();
      pintar();
    };

    function pintar() {
      if (!W || !ctx) return;
      ctx.clearRect(0, 0, W, H);
      const frente = (estado.current?.campo ?? 0) * ALCANCE;

      for (const p of puntos) {
        /* cuánto hace que el frente pasó por este punto */
        const tras = frente - (p.r + p.j * 0.16);
        if (tras <= 0) continue;

        /*
         * LA CRESTA ES UNA BANDA QUE SUBE Y BAJA, con el pico un poco DESPUÉS de
         * que pasa el frente. Con una caída desde 1 el punto nace ya al 30 % de
         * opacidad y aparece de golpe: ése era el chasquido.
         */
        const cresta = Math.exp(-Math.pow((tras - 0.17) / 0.16, 2));
        /* y el asentado sube con una curva suave a lo largo de medio recorrido,
           no en un tercio y en línea recta */
        const s = Math.max(0, Math.min(1, tras / 0.52));
        const asentado = s * s * (3 - 2 * s);

        const onda = reducido ? 0 : Math.sin(p.r * 7 - t * 2.2) * 0.06;
        const base = (1 - p.r * 0.62) * asentado;
        const a = Math.max(0, Math.min(TECHO, base * 0.34 + cresta * 0.4 + onda * base));
        if (a < 0.012) continue;

        const rad = (0.8 + (1 - p.r) * 1.5) * (0.55 + asentado * 0.45 + cresta * 0.9);
        /*
         * EL COLOR TIENE SU PROPIA BANDA, más ancha y algo antes que la de la
         * opacidad. ⚠ No se unifican: con una sola, el coral dura un suspiro y
         * casi no se ve, y el asentado queda demasiado encendido.
         */
        const tinte = Math.exp(-Math.pow((tras - 0.13) / 0.3, 2));
        const m = Math.min(1, (1 - p.r) * 0.5 + tinte * 1.3);
        const r = Math.round(C0[0] + (C1[0] - C0[0]) * m);
        const g = Math.round(C0[1] + (C1[1] - C0[1]) * m);
        const b = Math.round(C0[2] + (C1[2] - C0[2]) * m);
        ctx.fillStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    medir();
    window.addEventListener("resize", medir);

    if (reducido) {
      /* El campo entero, quieto. Lo pinta `medir`; no hay nada que animar. */
      return () => window.removeEventListener("resize", medir);
    }

    /* Al ticker de GSAP y no a un requestAnimationFrame propio: el hero tiene UN
       solo reloj, compartido con la escena 3D. */
    const correr = () => {
      t += 0.004;
      pintar();
    };
    gsap.ticker.add(correr);
    return () => {
      gsap.ticker.remove(correr);
      window.removeEventListener("resize", medir);
    };
  }, [estado, reducido]);

  return <canvas className="hero-a__campo" ref={lienzo} aria-hidden="true" />;
}
