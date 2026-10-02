"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import {
  construirNube,
  ESTADOS_MAPA,
  MAPA_ALTO,
  MAPA_ANCHO,
  type Nube,
} from "@/lib/mapa-puntos";
import { HUELLA } from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * El mapa de presencia, como CAMPO CONTINUO sobre un lienzo.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * POR QUÉ LIENZO Y NO SVG
 *
 * Porque el cursor es un foco y todos los puntos reaccionan a cada movimiento.
 * En SVG eso son 1 856 nodos cuyo `r`, `fill` y `opacity` el navegador tiene que
 * recalcular en cada `pointermove`: estilo, layout y repintado de mil ochocientos
 * elementos por evento. En un lienzo son 1 856 `arc` + `fill`, que es trabajo de
 * pintura y nada más.
 *
 * El precio es la accesibilidad: un lienzo no se navega con el teclado ni lo lee
 * un lector de pantalla. Lo resuelve la lista oculta de abajo — los 32 estados
 * con sus m², ordenados alfabéticamente —, que es la que lleva el dato de verdad.
 * El lienzo queda como lo que es: una ilustración.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * TODOS LOS PUNTOS SE DIBUJAN
 *
 * Y esto ya se probó al revés. Descartar los de campo bajo para que la densidad
 * contara también la historia hacía que el mapa PERDIERA LA FORMA justo en el
 * sur, donde no hay obra. Se siembran todos; lo que varía es el tamaño, el tono y
 * el color, y el color ARRANCA EN GRIS y sólo vira a coral con el campo, así que
 * Oaxaca y Chiapas siguen dibujando el contorno aunque no tengan nada.
 *
 * Los suelos de 0.2 en opacidad y 0.62 en radio son lo que garantiza que ningún
 * punto desaparezca: por debajo se abre el hueco en la silueta.
 */

/** Radio del foco, en CELDAS de la retícula y no en píxeles: así abarca lo mismo
 *  en cualquier pantalla, que es lo que un radio en px no hace. */
const FOCO_CELDAS = 7;

/**
 * LA CURVA DE LA RAMPA.
 *
 * El problema no era el rango del campo sino su escala: el reparto de los 1 856
 * puntos por quintiles en escala recta era 618-489-579-90-80, o sea dos tercios
 * en la mitad baja, y ahí todos acababan del mismo tono apagado.
 *
 * La curva levanta los valores MEDIOS —donde se amontonan— sin tocar los
 * extremos, que siguen cayendo en 0 y en 1. Medido sobre los mismos puntos:
 *
 *   recta   (k)       618  489  579   90   80     mitad alta  9 %
 *   k^0.72            464  258  842  190  102     mitad alta 16 %
 *   k^0.60  (ahora)   341  297  551  530  137     mitad alta 36 %
 *
 * De 0.72 a 0.60, la mitad alta pasa del 16 % al 36 %: más del doble de puntos
 * por encima del punto medio del rango.
 */
const CURVA = 0.6;

/**
 * Suelos y pendientes del punto, sobre el valor YA curvado.
 *
 * El rango es lo que de verdad separa el mínimo del máximo, y se amplió: la
 * opacidad pasa de 5.2x a 7.5x entre extremos (.13–.97 contra .17–.89) y el radio
 * de 5.0x a 7.2x (.48–3.48 contra .55–2.75).
 *
 * Los suelos no pueden bajar de 0.13 y 0.48: por debajo el punto deja de verse y
 * se abre el hueco en la silueta, que es el fallo que ya se corrigió una vez
 * descartando los puntos de campo bajo.
 */
const OPACIDAD_BASE = 0.13;
const OPACIDAD_CAMPO = 0.84;
const RADIO_BASE = 0.48;
const RADIO_CAMPO = 3.0;

/**
 * SUELO DEL RADIO EN PÍXELES DE PANTALLA, no en unidades del viewBox.
 *
 * El radio se escala con el tamaño del lienzo, y al acotarlo a 620px el extremo
 * bajo se quedaba en 0.30 px CSS. Medido como tinta efectiva —área del círculo a
 * dpr 2 por su opacidad—, un punto de campo cero da:
 *
 *   lienzo 958px (a todo el ancho)   0.345 px²   se ve
 *   lienzo 620px (acotado)           0.145 px²   al límite
 *   lienzo 350px (móvil)             0.046 px²   INVISIBLE
 *
 * Y en móvil ya lo era antes de acotar nada. Subir el suelo en unidades del
 * viewBox para arreglarlo exigiría 1.29 vb a 350px, que aplastaría la razón del
 * rango de 7.2x a 3.3x: justo lo contrario de lo que busca el ajuste.
 *
 * Así que el suelo va donde está el problema, que es el rasterizado. 0.45 px CSS
 * devuelve el extremo bajo a 0.331 px² —prácticamente lo que ya funcionaba a todo
 * el ancho— y sólo entra donde hace falta: toca el 0 % de los puntos a 958px, el
 * 5 % a 620px y el 26 % a 350px.
 */
const RADIO_MINIMO_PX = 0.45;

/** Gris de partida y coral de llegada, en RGB para mezclarlos en el lienzo. */
const GRIS = [231, 223, 209] as const;
const CORAL = [241, 93, 77] as const;

/**
 * La rampa de color, precalculada.
 *
 * Construir una cadena `rgba(...)` por punto son 1 856 concatenaciones Y 1 856
 * PARSEOS DE COLOR por fotograma, que es lo más caro del bucle de pintura — más
 * que los propios arcos. Con la rampa en 33 tramos, `fillStyle` recibe una cadena
 * que ya existe y la opacidad va por `globalAlpha`, que es un número y no se
 * parsea. El escalón de 1/32 en la mezcla no se distingue a ojo.
 */
const TRAMOS = 32;
const RAMPA = Array.from({ length: TRAMOS + 1 }, (_, i) => {
  const m = i / TRAMOS;
  const c = (a: number, b: number) => Math.round(a + (b - a) * m);
  return `rgb(${c(GRIS[0], CORAL[0])},${c(GRIS[1], CORAL[1])},${c(GRIS[2], CORAL[2])})`;
});

export function MapaPuntos() {
  const lienzo = useRef<HTMLCanvasElement>(null);
  const [activo, setActivo] = useState<number | null>(null);

  useGSAP(
    () => {
      const canvas = lienzo.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      /* El campo se calcula UNA vez, al construir los puntos. En cada repintado
         sólo se leen los valores. Medido: 1 856 puntos, 10 ms la rasterización
         completa y 0.9 ms el campo. */
      const nube: Nube = construirNube();
      const radioFoco = FOCO_CELDAS * nube.paso;

      /* La curva se aplica UNA vez, como el campo: en el bucle de pintura sería
         un Math.pow por punto y por fotograma. */
      const curvado = new Float32Array(nube.k.length);
      for (let p = 0; p < nube.k.length; p++) curvado[p] = Math.pow(nube.k[p], CURVA);

      /*
       * EL CONTORNO DE LOS ESTADOS.
       *
       * Se construye una sola vez: un Path2D con los 37 anillos de los 32 estados
       * en coordenadas del viewBox. En cada fotograma es UN `stroke`, no uno por
       * estado y mucho menos uno por anillo —Baja California trae sus islas, así
       * que por anillo serían 37 llamadas en vez de una—.
       *
       * Un único path para todos en vez de uno por estado: visualmente es
       * idéntico, porque cada estado lleva su contorno completo y los límites
       * compartidos se trazan dos veces en los dos casos. Si algún día hubiera que
       * destacar el contorno del señalado, `nube.anilloDe` dice de quién es cada
       * anillo y agruparlos es un bucle.
       */
      const contorno = new Path2D();
      for (const anillo of nube.anillos) {
        anillo.forEach(([ax, ay], i) => (i ? contorno.lineTo(ax, ay) : contorno.moveTo(ax, ay)));
        contorno.closePath();
      }

      /** Un solo valor que recorre de 0 a 1. Ver la nota del tween. */
      const estado = { entra: 0 };
      /** El foco, en unidades del viewBox. null = el puntero está fuera. */
      let foco: { x: number; y: number } | null = null;
      let esc = 1;

      const dimensionar = () => {
        const caja = canvas.getBoundingClientRect();
        if (!caja.width) return;
        const dpr = Math.min(window.devicePixelRatio, 2);
        canvas.width = caja.width * dpr;
        canvas.height = caja.height * dpr;
        esc = caja.width / MAPA_ANCHO;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const pintar = () => {
        const caja = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, caja.width, caja.height);
        const { x, y } = nube;

        /*
         * El contorno va PRIMERO, para que los puntos queden encima.
         *
         * Al 10 % de cream es un susurro —1.45 de contraste contra el ink— y no
         * compite con los puntos; lo que hace es que el ojo complete la forma
         * donde la mancha se adelgaza. Se traza bajo una transformación de escala
         * en vez de reconstruir el path a cada tamaño, y de ahí el `1 / esc` del
         * grosor: dentro de la escala, eso es un píxel en pantalla.
         */
        ctx.save();
        ctx.scale(esc, esc);
        ctx.lineWidth = 1 / esc;
        ctx.strokeStyle = "rgba(231,223,209,.10)";
        ctx.stroke(contorno);
        ctx.restore();

        /* globalAlpha se escribe en el bucle; se restaura al final para no dejar
           el contexto en un estado que no es el suyo. */

        for (let p = 0; p < x.length; p++) {
          let cerca = 0;
          if (foco) {
            const d = Math.hypot(x[p] - foco.x, y[p] - foco.y);
            cerca = Math.max(0, 1 - d / radioFoco);
            /* Al cuadrado: es lo que le da el borde suave en vez de un corte. */
            cerca *= cerca;
          }
          const kv = curvado[p];
          const a = (OPACIDAD_BASE + kv * OPACIDAD_CAMPO) * estado.entra + cerca * 0.42;
          /* El radio va en unidades del viewBox y se escala al pintar, así que el
             punto se mantiene proporcional al tamaño en pantalla — con el suelo
             de RADIO_MINIMO_PX para que el extremo bajo no caiga por debajo de lo
             que una pantalla puede pintar. */
          const r = Math.max(
            RADIO_MINIMO_PX,
            (RADIO_BASE + kv * RADIO_CAMPO) * (1 + cerca * 0.75) * esc,
          );
          /*
           * SIN multiplicador, y sigue sin él. Cuando era `k * 1.15` el coral
           * saturaba en k = 0.87 y los estados por encima de ese campo dejaban de
           * distinguirse entre sí. La curva lleva kv a 1 justo en el tope.
           */
          const mezcla = Math.min(1, kv + cerca * 0.5);

          /*
           * Math.min, y no es cosmético: con el foco encima de un punto de campo
           * alto, `a` llega a 1.39 —antes 1.16, y antes de eso 1.34—, y la
           * especificación dice que `globalAlpha` IGNORA los valores fuera de
           * [0,1] en vez de recortarlos. El punto se habría quedado con la
           * opacidad del punto anterior.
           */
          ctx.globalAlpha = a < 1 ? a : 1;
          ctx.fillStyle = RAMPA[(mezcla * TRAMOS) | 0];
          ctx.beginPath();
          ctx.arc(x[p] * esc, y[p] * esc, r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      };

      dimensionar();
      const observador = new ResizeObserver(() => {
        dimensionar();
        pintar();
      });
      observador.observe(canvas);

      /*
       * EL PUNTERO, COALESCIDO EN UN rAF.
       *
       * `pointermove` dispara más de una vez por fotograma en un trackpad, y cada
       * repintado son 1 856 arcos. Sin esto se pintaría dos y tres veces el mismo
       * fotograma para nada.
       */
      let pedido = 0;
      const repintarPronto = () => {
        if (pedido) return;
        pedido = requestAnimationFrame(() => {
          pedido = 0;
          /*
           * El setState va DENTRO del rAF y guardado por `duenoVisto`: en
           * `pointermove` se llamaría dos o tres veces por fotograma y, aunque
           * React descarte el valor repetido, lo descarta después de haber
           * programado el trabajo. Así sólo hay render cuando el estado señalado
           * cambia de verdad — una docena de veces en todo el recorrido, no cien
           * por segundo.
           */
          const d = foco ? duenoEn(foco.x, foco.y) : null;
          if (d !== duenoVisto) {
            duenoVisto = d;
            setActivo(d);
          }
          pintar();
        });
      };

      /*
       * Quién es el dueño de la celda bajo el cursor.
       *
       * El foco es INDEPENDIENTE de cualquier frontera: puede quedar a caballo
       * entre dos estados y se ve igual de bien. Lo único para lo que hace falta
       * saber de quién es una celda es el panel, y eso es una división y una
       * lectura en la tabla de propiedad, no una búsqueda.
       *
       * Fuera del territorio la celda vale -1 y el panel vuelve a su texto
       * inicial: señalar el mar no es señalar un estado.
       */
      let duenoVisto: number | null = null;
      const duenoEn = (vx: number, vy: number) => {
        const ix = Math.floor(vx / nube.paso);
        const iy = Math.floor(vy / nube.paso);
        if (ix < 0 || iy < 0 || ix >= nube.cols || iy >= nube.filas) return null;
        const p = nube.indice[iy * nube.cols + ix];
        return p < 0 ? null : nube.dueno[p];
      };

      const alMover = (evento: PointerEvent) => {
        const caja = canvas.getBoundingClientRect();
        foco = { x: (evento.clientX - caja.left) / esc, y: (evento.clientY - caja.top) / esc };
        repintarPronto();
      };

      const alSalir = () => {
        foco = null;
        if (duenoVisto !== null) {
          duenoVisto = null;
          setActivo(null);
        }
        repintarPronto();
      };

      canvas.addEventListener("pointermove", alMover);
      canvas.addEventListener("pointerleave", alSalir);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        /*
         * CON MOVIMIENTO REDUCIDO HAY QUE PONER EL VALOR A 1 Y PINTAR.
         *
         * Salir antes sin hacerlo deja `entra` en 0, la opacidad en 0 y el mapa
         * COMPLETAMENTE VACÍO. Es el tipo de fallo que sólo aparece con la
         * preferencia activada, o sea el que nadie prueba.
         */
        estado.entra = 1;
        pintar();
      } else {
        /*
         * La entrada: UN SOLO valor que recorre de 0 a 1 y repinta en cada paso.
         * Con 1 856 puntos, un tween por círculo serían 1 856 animaciones y el
         * scroll se arrastraría.
         */
        gsap.to(estado, {
          entra: 1,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: pintar,
          scrollTrigger: { trigger: canvas, start: "top 84%", once: true },
        });
        pintar();
      }

      return () => {
        canvas.removeEventListener("pointermove", alMover);
        canvas.removeEventListener("pointerleave", alSalir);
        observador.disconnect();
        if (pedido) cancelAnimationFrame(pedido);
      };
    },
    { scope: lienzo },
  );

  const estado = activo !== null ? ESTADOS_MAPA[activo] : undefined;

  return (
    <div className="nos-mapa">
      <div className="nos-mapa__rejilla">
        {/* El lienzo es una ilustración: lo que se puede leer y recorrer es la
            lista de abajo. De ahí el role="img" y el aria-hidden de los puntos. */}
        <canvas
          ref={lienzo}
          className="nos-mapa__lienzo"
          style={{ aspectRatio: `${MAPA_ANCHO} / ${MAPA_ALTO}` }}
          role="img"
          aria-label="Mapa de presencia de Altea en México"
        />
      </div>

      <div className="nos-mapa__panel" aria-live="polite">
        {estado ? (
          <>
            <small>{HUELLA.mapa.etiquetaEstado}</small>
            <b>{estado.nombre}</b>
            {estado.m2 ? (
              <span>{estado.m2.toLocaleString("es-MX")} m²</span>
            ) : (
              <em>{HUELLA.mapa.sinDato}</em>
            )}
          </>
        ) : (
          <>
            <small>{HUELLA.mapa.etiqueta}</small>
            <b>{HUELLA.mapa.titulo}</b>
            <em>{HUELLA.mapa.pista}</em>
          </>
        )}
      </div>

      {/*
        La lista que sustituye al lienzo para quien no lo ve.
        Alfabética con localeCompare —no con una comparación de cadenas a secas,
        que pondría "Ciudad de México" antes de "Chihuahua" y dejaría Querétaro y
        San Luis Potosí fuera de sitio por los acentos— y con los m² de cada uno,
        que es el dato que el mapa comunica con el color.
      */}
      <ul className="sr-only">
        {[...ESTADOS_MAPA]
          .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
          .map((e) => (
            <li key={e.id}>
              {e.nombre}:{" "}
              {e.m2 ? `${e.m2.toLocaleString("es-MX")} m² construidos` : HUELLA.mapa.sinDato}
            </li>
          ))}
      </ul>
    </div>
  );
}
