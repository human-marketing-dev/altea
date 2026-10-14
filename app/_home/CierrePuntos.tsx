"use client";

import { useEffect, useRef } from "react";
import { CANALES, enlaceWhatsApp } from "@/lib/contacto";
import { BANDEROLA_CORAL, BANDEROLA_CREAM } from "@/lib/isotipo";
import { ruta } from "@/lib/rutas";
import "./cierre-puntos.css";

/**
 * EL CIERRE DEL HOME Y DE /nosotros (octubre de 2026). Sustituye ahí a
 * <CierreContacto>, el cierre con foto; las unidades cierran con
 * <CierreUnidad>. Ver app/page.tsx y app/nosotros/page.tsx. Sus estilos están
 * en cierre-puntos.css, que se importa aquí.
 *
 * EL CIERRE SIN FOTO. A la derecha lo mismo que dice el cierre de hoy —rótulo,
 * titular, los dos botones y el correo—; a la izquierda, en vez de la foto, un
 * campo de puntos. En el DOM el texto va primero —es lo que se lee— y la hoja
 * coloca el campo delante en escritorio; en una columna, el texto queda arriba.
 *
 * EL CAMPO ES UN TERRENO Y LA BANDEROLA LO MARCA. Una retícula fina de puntos en
 * tinta, como el plano de un lote, con el PASO de la trama que revela la foto en
 * el hero de las unidades. Dentro, la banderola de la marca —el remate del
 * isotipo— hecha con los mismos puntos: la mitad derecha en coral y la izquierda
 * en tinta, la construcción de la banderola de los heroes de unidad.
 *
 * LA BANDEROLA LLEVA SU PROPIA RETÍCULA, A UN TERCIO DEL PASO. Con el paso del
 * terreno los cantos del triángulo salían en escalera; con nueve veces más
 * puntos, más chicos, y la orilla en semitono —ver medir()—, la figura se lee
 * con los cantos rectos. Bajo la
 * banderola no se pintan puntos del terreno: los dos se encimarían. El titular
 * habla de "tu proyecto, terreno o necesidad", y el dibujo dice lo mismo: un
 * terreno con un punto marcado.
 *
 * VA EN UN PANEL EN TINTA, y es lo que lo hace destacar: es el cierre, y sobre el
 * gris de página se fundía con el resto. Panel con radio y no banda a sangre,
 * para que el día que sustituya al cierre actual no se funda con el pie, que
 * también es tinta. Sobre tinta la banderola va en sus colores del isotipo,
 * crema y coral, y el terreno en crema tenue.
 *
 * TRES GESTOS, LOS TRES CON PUNTOS:
 *   · al entrar en pantalla, la banderola se enciende desde su vértice, punto a
 *     punto, como la trama del hero;
 *   · con el cursor encima, los puntos de alrededor crecen y se tiñen de coral:
 *     el terreno responde a quien lo señala;
 *   · una vez encendida, cada 4.2 s sale de su vértice una onda por el terreno,
 *     como una señal que marca el lugar. Sólo mientras el campo está a la
 *     vista: fuera de pantalla no se pinta nada.
 * Con movimiento reducido, la banderola sale entera y quieta.
 *
 * Canvas y no SVG: son de 1 500 a 2 500 puntos que se repintan con el cursor, y
 * un nodo por punto en el DOM se lo cobraría.
 */
export function CierrePuntos({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  const raiz = useRef<HTMLElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const nodo = raiz.current;
    const cv = lienzo.current;
    const ctx = cv?.getContext("2d");
    if (!nodo || !cv || !ctx) return;
    const reducido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /* Los colores, de los tokens: el campo se pinta con lo mismo que el CSS. */
    const css = getComputedStyle(nodo);
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
      origen = { x: vx, y: vy };
      alcance = Math.max(
        Math.hypot(vx, vy),
        Math.hypot(w - vx, vy),
        Math.hypot(vx, h - vy),
        Math.hypot(w - vx, h - vy),
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
          if (dist(x, y) < -paso * 0.6)
            puntos.push({ x, y, tipo: 0, d: 0, cubre: 0 });
        }
      }
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
    let avance = reducido ? 1 : 0;
    let cursor: { x: number; y: number } | null = null;
    const foco = { x: -9999, y: -9999, fuerza: 0 };

    /* La onda: de 0 a 1 en cada periodo, y sólo cuando la banderola ya está
       encendida y el campo a la vista. */
    const PERIODO = 4200;
    let enVista = false;
    const onda = () =>
      reducido || !enVista || avance < 0.999
        ? -1
        : (performance.now() % PERIODO) / PERIODO;

    const pintar = () => {
      ctx.clearRect(0, 0, w, h);
      const o = onda();
      const rOnda = o * alcance;
      const banda = paso * 3;
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
                (1 - o) ** 1.5;
          const e = Math.max(c, b * 0.7);
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
      if (reducido) return;
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
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alMedir);
    cv.addEventListener("pointermove", alMover);
    cv.addEventListener("pointerleave", alSalir);
    return () => {
      vigia.disconnect();
      cancelAnimationFrame(bucle);
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alMedir);
      cv.removeEventListener("pointermove", alMover);
      cv.removeEventListener("pointerleave", alSalir);
    };
  }, []);

  return (
    <section
      className="home-cp"
      ref={raiz}
      aria-labelledby="cierre-puntos-titulo"
    >
      <div className="home-cp__panel">
        <div className="home-cp__txt">
          <p className="home-cp__rotulo">{eyebrow}</p>
          <h2 className="home-cp__titulo" id="cierre-puntos-titulo">
            {title}
          </h2>
          <div className="home-cp__acciones">
            <a
              className="altea-btn altea-btn--primary altea-btn--lg"
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
              className="altea-btn altea-btn--outline altea-btn--lg"
              href={ruta("/contacto")}
            >
              Ir a contacto
              <span className="altea-btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
          <a className="home-cp__correo" href={`mailto:${CANALES.correo}`}>
            {CANALES.correo}
          </a>
        </div>
        {/* Decorativo: el titular ya dice lo que dice el dibujo. */}
        <canvas className="home-cp__campo" ref={lienzo} aria-hidden="true" />
      </div>
    </section>
  );
}
