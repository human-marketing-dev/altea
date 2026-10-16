"use client";

import { useEffect, useRef } from "react";
import { BANDEROLA_CORAL, BANDEROLA_CREAM } from "@/lib/isotipo";

/**
 * EL CAMPO DE PUNTOS CON LA BANDEROLA, la pieza de identidad de los cierres
 * (octubre de 2026): un terreno de puntos crema sobre tinta y, dentro, la
 * banderola del isotipo en crema y coral hecha con puntos más finos. Se
 * enciende desde su vértice, crece y se tiñe bajo el cursor, y cada 4.2 s
 * lanza una onda por el terreno mientras está a la vista.
 *
 * Salió de <CierrePuntos>, donde nació, para poder usarla también en el hero
 * de /contacto sin copiar el dibujo. La explicación de cada decisión —el
 * semitono de la orilla, el paso de un tercio, la onda— sigue en la cabecera
 * de CierrePuntos.tsx.
 *
 * Va sobre fondo tinta: los colores salen de los tokens (--altea-cream,
 * --altea-coral) leídos del propio lienzo. Decorativo: siempre aria-hidden.
 */
export function CampoBanderola({
  className,
  entrada = "scroll",
  banderola = true,
}: {
  className?: string;
  /**
   * Sin banderola queda sólo el terreno de puntos, a todo lo ancho: un fondo.
   * La onda coral sigue saliendo cada 4.2 s, desde un punto fijo a la derecha
   * en vez del vértice. Los puntos siguen creciendo y tiñéndose de coral bajo
   * el cursor, que se escucha en el contenedor del lienzo para que también
   * responda por detrás del texto. Lo usa el hero de /contacto.
   * @default true
   */
  banderola?: boolean;
  /**
   * Cuándo se enciende la banderola: "scroll" la va encendiendo al entrar en
   * pantalla (el cierre, al final de la página); "carga", sola al montar (un
   * hero, que ya está a la vista).
   */
  entrada?: "scroll" | "carga";
}) {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = lienzo.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const reducido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /* Los colores, de los tokens: el campo se pinta con lo mismo que el CSS. */
    const css = getComputedStyle(cv);
    /* Sobre el panel en tinta, el terreno y la mitad izquierda de la banderola
       van en crema: la banderola del isotipo es crema y coral. */
    const CREMA = css.getPropertyValue("--altea-cream").trim() || "#E7DFD1";
    const CORAL = css.getPropertyValue("--altea-coral").trim() || "#F15D4D";

    /* La caja de la banderola, en las coordenadas de lib/isotipo (y hacia
       arriba), para colocarla dentro del campo por su caja real. */
    const todos = [...BANDEROLA_CORAL, ...BANDEROLA_CREAM];
    const bx0 = Math.min(...todos.map((p) => p[0]));
    const bx1 = Math.max(...todos.map((p) => p[0]));
    const by0 = Math.min(...todos.map((p) => p[1]));
    const by1 = Math.max(...todos.map((p) => p[1]));
    /* El vértice de arriba, desde donde se enciende. */
    const vertice = BANDEROLA_CORAL[2];

    type Punto = {
      x: number;
      y: number;
      /** 0 terreno, 1 mitad en tinta, 2 mitad en coral */
      tipo: 0 | 1 | 2;
      /** distancia al vértice, de 0 a 1: el orden en que se enciende */
      d: number;
      /** cuánto del radio le toca por la orilla y la costura, de 0 a 1 */
      cubre: number;
    };
    let puntos: Punto[] = [];
    let paso = 16;
    /** El paso de la banderola: un tercio del del terreno. Ver la cabecera. */
    let pasoB = 8;
    let w = 0;
    let h = 0;
    /* El vértice de la banderola en el campo, y lo más lejos que llega la onda. */
    let origen = { x: 0, y: 0 };
    let alcance = 1;

    const medir = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* El mismo paso que la trama del hero de unidades: clamp(13px, 1.35vw,
         21px). Sale de la ventana, no del campo, para que la retícula tenga el
         mismo grano en toda la página. */
      paso = Math.max(13, Math.min(21, window.innerWidth * 0.0135));
      pasoB = paso / 3;

      /* La banderola ocupa el 78 % del alto del campo y va CENTRADA en su
         columna, en los dos sentidos, por su caja real (no por el eje del
         isotipo, que no es el suyo). */
      const alto = h * 0.78;
      const escala = alto / (by1 - by0);
      const ancho = (bx1 - bx0) * escala;
      const ox = (w - ancho) / 2;
      const oy = (h + alto) / 2;
      const aCampo = (p: readonly [number, number]): [number, number] => [
        ox + (p[0] - bx0) * escala,
        oy - (p[1] - by0) * escala,
      ];
      const [vx, vy] = aCampo(vertice);
      /* Sin banderola, la onda nace de un punto fijo a la derecha —al lado del
         texto, no debajo de él— y desde ahí cruza el fondo entero. */
      const [ox0, oy0] = banderola ? [vx, vy] : [w * 0.78, h * 0.5];
      origen = { x: ox0, y: oy0 };
      alcance = Math.max(
        Math.hypot(ox0, oy0),
        Math.hypot(w - ox0, oy0),
        Math.hypot(ox0, h - oy0),
        Math.hypot(w - ox0, h - oy0),
      );
      const diag = Math.hypot(ancho, alto);

      /*
       * SEMITONO EN LA ORILLA, y es lo que quita los escalones.
       *
       * Con "dentro o fuera" cada punto es todo o nada, y en una retícula un lado
       * inclinado sale siempre en escalera, por fino que sea el paso. Aquí cada
       * punto mide su DISTANCIA real al lado más cercano del triángulo y, en la
       * franja de un paso alrededor de la orilla, su radio va en proporción:
       * entero medio paso adentro, nada medio paso afuera. Es como se hace un
       * borde en semitono, y el ojo lo lee como una línea recta.
       *
       * Las dos mitades juntas son un solo triángulo —la base va de la punta de
       * la mitad en tinta a la de la coral—, así que la distancia se mide contra
       * ése. La línea que separa las dos mitades lleva lo mismo, más suave: los
       * puntos que caen sobre ella se achican un poco y la costura entre colores
       * se lee como un corte recto en vez de un dentado.
       */
      const T = [
        aCampo(BANDEROLA_CREAM[2]), // base, punta de la mitad en tinta
        aCampo(BANDEROLA_CORAL[2]), // vértice
        aCampo(BANDEROLA_CORAL[0]), // base, punta de la mitad coral
      ];
      const corteA = aCampo(BANDEROLA_CORAL[2]);
      const corteB = aCampo(BANDEROLA_CORAL[1]);
      const lado = (
        a: readonly [number, number],
        b: readonly [number, number],
        x: number,
        y: number,
      ) =>
        ((b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0])) /
        Math.hypot(b[0] - a[0], b[1] - a[1]);
      const cx = (T[0][0] + T[1][0] + T[2][0]) / 3;
      const cy = (T[0][1] + T[1][1] + T[2][1]) / 3;
      const signo = lado(T[0], T[1], cx, cy) > 0 ? 1 : -1;
      /** Distancia con signo al triángulo: positiva adentro. */
      const dist = (x: number, y: number) =>
        Math.min(
          signo * lado(T[0], T[1], x, y),
          signo * lado(T[1], T[2], x, y),
          signo * lado(T[2], T[0], x, y),
        );
      const signoCorte = lado(corteA, corteB, T[2][0], T[2][1]) > 0 ? 1 : -1;

      puntos = [];
      /* El terreno, a paso entero, salvo donde cae la banderola y su orilla. */
      const x0 = ((w % paso) + paso) / 2;
      const y0 = ((h % paso) + paso) / 2;
      for (let y = y0; y < h; y += paso) {
        for (let x = x0; x < w; x += paso) {
          if (!banderola || dist(x, y) < -paso * 0.6)
            puntos.push({ x, y, tipo: 0, d: 0, cubre: 0 });
        }
      }
      if (!banderola) return;
      /* La banderola, a un tercio del paso y alineada con la misma retícula, así que el
         cambio de densidad no se ve como una costura. */
      for (let y = y0 - paso; y < h; y += pasoB) {
        for (let x = x0 - paso; x < w; x += pasoB) {
          const sd = dist(x, y);
          if (sd < -pasoB * 0.5) continue;
          const ds = signoCorte * lado(corteA, corteB, x, y);
          const orilla = Math.max(0, Math.min(1, 0.5 + sd / pasoB));
          const costura =
            0.55 + 0.45 * Math.max(0, Math.min(1, Math.abs(ds) / (pasoB * 0.5)));
          puntos.push({
            x,
            y,
            tipo: ds >= 0 ? 2 : 1,
            d: Math.hypot(x - vx, y - vy) / diag,
            cubre: orilla * costura,
          });
        }
      }
    };

    const suave = (t: number) => {
      const c = Math.max(0, Math.min(1, t));
      return c * c * (3 - 2 * c);
    };

    /* El avance de la entrada, del cursor y su versión suavizada. */
    let avance = reducido || !banderola ? 1 : 0;
    let cursor: { x: number; y: number } | null = null;
    const foco = { x: -9999, y: -9999, fuerza: 0 };

    /* La onda: de 0 a 1 en cada periodo, y sólo cuando la banderola ya está
       encendida y el campo a la vista. */
    const PERIODO = 4200;
    let enVista = false;
    /* Sin banderola no hay nada que encender, así que la onda corre desde el
       principio (ver `avance`, que ahí arranca en 1). */
    const onda = () =>
      reducido || !enVista || avance < 0.999
        ? -1
        : (performance.now() % PERIODO) / PERIODO;

    const pintar = () => {
      ctx.clearRect(0, 0, w, h);
      const o = onda();
      const rOnda = o * alcance;
      /*
       * Sin banderola la onda ES el dibujo, y en un hero bajo y ancho se ve como
       * un arco que cruza de lado a lado: más ancha, más intensa y apagándose
       * más despacio que en los cierres, donde acompaña a la banderola.
       */
      const banda = paso * (banderola ? 3 : 4.5);
      const intensidad = banderola ? 0.7 : 1;
      const apagado = banderola ? 1.5 : 0.6;
      const R = paso * 7;
      const rMax = paso * 0.32;
      /* Los de la banderola, en proporción a su paso: la misma mancha por
         superficie, en puntos más chicos. */
      const rMaxB = pasoB * 0.36;
      for (const p of puntos) {
        /* Lo que suma el cursor, de 0 a 1, con caída cuadrática. */
        const dc = Math.hypot(p.x - foco.x, p.y - foco.y);
        const c = dc < R ? (1 - dc / R) ** 2 * foco.fuerza : 0;

        if (p.tipo === 0) {
          /* El terreno: puntos de 1 px al 18 %. Cerca del cursor crecen y se
             tiñen de coral. */
          /* La onda: un anillo de tres pasos de ancho que se apaga al
             alejarse del vértice. */
          const b =
            o < 0
              ? 0
              : Math.max(
                  0,
                  1 - Math.abs(Math.hypot(p.x - origen.x, p.y - origen.y) - rOnda) / banda,
                ) *
                (1 - o) ** apagado;
          const e = Math.max(c, b * intensidad);
          const r = 1 + e * rMax * 0.9;
          ctx.globalAlpha = 0.16 + e * 0.64;
          ctx.fillStyle = e > 0.04 ? CORAL : CREMA;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }
        /* La banderola: cada punto se enciende cuando el frente pasa por su
           distancia al vértice. Antes de encenderse es un punto tenue, como el
           terreno. */
        const s = suave((avance * 1.35 - p.d) / 0.35);
        /* Antes de encenderse es un punto tenue, salvo en la orilla: ahí no
           se pinta, o el contorno se adelantaría al relleno. */
        const r0 = rMaxB * s * p.cubre * (1 + c * 0.25);
        if (r0 < 0.35 && p.cubre < 0.5) continue;
        ctx.globalAlpha = s > 0 ? 0.18 + 0.82 * s : 0.18;
        ctx.fillStyle = p.tipo === 2 ? CORAL : CREMA;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(r0, 0.7), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    /* Un solo bucle: corre mientras haya algo moviéndose y se para solo. */
    let bucle = 0;
    const animar = () => {
      bucle = 0;
      let sigue = false;
      const objetivo = cursor ? 1 : 0;
      if (cursor) {
        foco.x += (cursor.x - foco.x) * 0.22;
        foco.y += (cursor.y - foco.y) * 0.22;
      }
      foco.fuerza += (objetivo - foco.fuerza) * 0.12;
      if (Math.abs(objetivo - foco.fuerza) > 0.01) sigue = true;
      if (cursor && Math.hypot(cursor.x - foco.x, cursor.y - foco.y) > 0.5)
        sigue = true;
      /* La onda mantiene el bucle vivo mientras se vea. */
      if (onda() >= 0) sigue = true;
      pintar();
      if (sigue) bucle = requestAnimationFrame(animar);
    };
    const pedir = () => {
      if (!bucle) bucle = requestAnimationFrame(animar);
    };

    /* La entrada sale de la posición de la sección, no de un temporizador: la
       banderola termina de encenderse cuando el campo está entero a la vista. */
    const alScroll = () => {
      if (reducido || entrada === "carga") return;
      const r = cv.getBoundingClientRect();
      const k = (window.innerHeight - r.top) / (r.height + window.innerHeight * 0.25);
      const nuevo = Math.max(0, Math.min(1, k));
      if (Math.abs(nuevo - avance) > 0.001) {
        avance = nuevo;
        pedir();
      }
    };
    const alMover = (e: PointerEvent) => {
      if (reducido || e.pointerType !== "mouse") return;
      const r = cv.getBoundingClientRect();
      const primera = !cursor;
      cursor = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (primera) {
        foco.x = cursor.x;
        foco.y = cursor.y;
      }
      pedir();
    };
    const alSalir = () => {
      cursor = null;
      pedir();
    };
    const alMedir = () => {
      medir();
      alScroll();
      pintar();
    };

    /* Fuera de pantalla el bucle se para: la onda es lo único continuo, y no
       tiene sentido pintarla donde nadie la ve. */
    const vigia = new IntersectionObserver(([e]) => {
      enVista = e.isIntersecting;
      if (enVista) pedir();
    });
    vigia.observe(cv);

    medir();
    alScroll();
    pintar();

    /*
     * CON entrada="carga" LA BANDEROLA SE ENCIENDE SOLA al montar, en 1.6 s,
     * en vez de seguir al scroll: arriba de la página (el hero de /contacto)
     * el campo ya está a la vista y el scroll no tendría nada que recorrer.
     */
    let encendido = 0;
    if (entrada === "carga" && !reducido) {
      const t0 = performance.now();
      const tic = () => {
        avance = Math.min(1, (performance.now() - t0) / 1600);
        pedir();
        if (avance < 1) encendido = requestAnimationFrame(tic);
      };
      encendido = requestAnimationFrame(tic);
    }
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alMedir);
    /* Sin banderola el lienzo es un fondo con texto encima: el cursor se
       escucha en su contenedor, o no respondería por detrás del texto. */
    const blanco: HTMLElement = banderola ? cv : (cv.parentElement ?? cv);
    blanco.addEventListener("pointermove", alMover);
    blanco.addEventListener("pointerleave", alSalir);
    return () => {
      vigia.disconnect();
      cancelAnimationFrame(bucle);
      cancelAnimationFrame(encendido);
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alMedir);
      blanco.removeEventListener("pointermove", alMover);
      blanco.removeEventListener("pointerleave", alSalir);
    };
  }, [entrada, banderola]);

  return <canvas className={className} ref={lienzo} aria-hidden="true" />;
}
