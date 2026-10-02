import { dentroDe } from "./isotipo";
import { ESTADOS, MAPA_ALTO, MAPA_ANCHO } from "./mexico-estados";
import { M2_CONSTRUIDOS } from "./proyectos";

/**
 * El mapa de México como CAMPO CONTINUO de puntos.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * POR QUÉ UN CAMPO Y NO 32 REGIONES
 *
 * La versión anterior daba a cada estado su propio tono y lo encendía entero al
 * señalarlo. Eso lo convertía en 32 regiones separadas, o sea un mapa político
 * coloreado. Aquí la intensidad varía POR EL TERRITORIO y no se corta en las
 * fronteras: un punto de Coahuila pegado al límite hereda parte de la intensidad
 * de Nuevo León, porque su valor sale de promediar TODOS los centros de estado
 * ponderados por el inverso de la distancia.
 *
 * El estado sigue existiendo, pero sólo para decir cuál estás señalando — de ahí
 * la tabla de propiedad— no para pintarse aparte.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * CÓMO
 *
 * Se recorre una retícula sobre el viewBox del mapa y, para cada celda, se mira
 * en qué estado cae su centro. La silueta no se traza: sale por acumulación. La
 * geometría es la que genera `npm run build:map`, cuyos `d` son polígonos puros
 * —sólo M, L y Z en los 32 estados, 1 635 vértices—, así que basta partirlos en
 * anillos y aplicar la misma prueba de cruce de rayos que usa el isotipo. Por eso
 * `dentroDe` vive en isotipo.ts y se importa: es la misma prueba, y copiada
 * acabaría copiada con una variante sutil.
 *
 * Un estado puede tener varios anillos —Baja California trae sus islas— y la
 * regla par-impar sobre TODOS sus anillos es justo lo que da "dentro del estado".
 *
 * ────────────────────────────────────────────────────────────────────────────
 * SE CONSTRUYE BAJO DEMANDA, NO AL CARGAR EL MÓDULO
 *
 * `construirNube()` es una función y no una constante a propósito. Con el lienzo,
 * los puntos tienen que estar en el CLIENTE —antes los pintaba el servidor como
 * <circle>—, así que este módulo viaja al navegador. Calcularlo al evaluar el
 * módulo bloquearía el hilo principal en medio de la carga; dentro del efecto del
 * componente ocurre después del primer pintado y no se nota.
 *
 * El intercambio sale a favor: 23 KB de geometría y ~60 ms una vez, contra los
 * ~73 KB de HTML que ocupaban 1 856 <circle> servidos desde el servidor.
 */

/** Lado de la celda, en unidades del viewBox del mapa (1000 × 620). */
const PASO = 10;

/**
 * Unidades en que se evalúa el campo.
 *
 * NO en unidades del viewBox, y es crítico. El peso es 1/d⁴, así que el resultado
 * depende por completo de la escala en que se miden las distancias: en unidades
 * del viewBox, dos estados vecinos están a ~150 y el peso del propio centro
 * domina por 10^9, con lo que el campo degenera en "el valor del estado más
 * cercano" y se cortaría en las fronteras — exactamente lo que se quería evitar.
 *
 * Se normaliza a 56 unidades de ancho, que es la retícula para la que están
 * calibrados el +0.6 y el exponente. Con eso, los centros vecinos quedan a 5-10
 * unidades y la influencia cruza la frontera.
 */
const ANCHO_CAMPO = 56;
const ESCALA_CAMPO = ANCHO_CAMPO / MAPA_ANCHO;

/**
 * El nivel de cada estado, en ESCALA LOGARÍTMICA.
 *
 * Hay cinco órdenes de magnitud entre Nayarit (200 m²) y Nuevo León (24 189 425).
 * En lineal, Nuevo León se queda con todo el rango y los otros veinte salen del
 * mismo tono. En logarítmica cada orden ocupa el mismo tramo.
 *
 * Sin suelo: el mínimo cae en 0.00 y el máximo en 1.00. La consecuencia es que
 * Nayarit se ve igual que un estado sin obra — el campo no puede distinguir 200 m²
 * de cero cuando el máximo son 24 millones—, y quien lo resuelve es el panel, que
 * sí dice su cifra.
 */
const VALORES = Object.values(M2_CONSTRUIDOS);
const LOG_MIN = Math.min(...VALORES.map(Math.log10));
const LOG_MAX = Math.max(...VALORES.map(Math.log10));

const nivel = (m2: number | undefined) =>
  m2 ? (Math.log10(m2) - LOG_MIN) / (LOG_MAX - LOG_MIN) : 0;

export type EstadoMapa = {
  id: string;
  nombre: string;
  /** Superficie construida, o undefined si el estado no tiene proyectos. */
  m2?: number;
  /** 0 a 1 en escala logarítmica. Lo consume el campo. */
  nivel: number;
};

/**
 * Los 32 estados, con su nivel. El orden es el del archivo generado, y los
 * índices de esta lista son lo que guarda la tabla de propiedad.
 */
export const ESTADOS_MAPA: readonly EstadoMapa[] = ESTADOS.map((e) => {
  const m2 = M2_CONSTRUIDOS[e.id as keyof typeof M2_CONSTRUIDOS];
  return { id: e.id, nombre: e.nombre, m2, nivel: nivel(m2) };
});

/** Un anillo cerrado, en unidades del viewBox. */
export type Anillo = readonly (readonly [number, number])[];

/**
 * Parte un `d` de M/L/Z en sus anillos. No contempla curvas a propósito: si
 * algún día build:map emitiera una, es mejor que falle visiblemente aquí que
 * que el punto caiga en el sitio equivocado sin avisar.
 */
function anillos(d: string): [number, number][][] {
  if (/[^MLZ0-9.,\-\s]/i.test(d)) {
    throw new Error(`mapa-puntos: el path trae comandos que no son M/L/Z: ${d.slice(0, 40)}`);
  }
  return d
    .split(/(?=M)/)
    .map((sub) =>
      sub
        .replace(/[MLZ]/gi, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((par) => par.split(",").map(Number) as [number, number]),
    )
    .filter((anillo) => anillo.length >= 3);
}

export type Nube = {
  /** Coordenadas en el viewBox. Arreglos paralelos, no objetos: son miles. */
  x: Float32Array;
  y: Float32Array;
  /**
   * TABLA DE PROPIEDAD: índice en ESTADOS_MAPA del estado que contiene cada
   * punto. Es lo único para lo que hace falta saber a quién pertenece una celda,
   * y sale de la misma rasterización — antes se guardaba sólo "hay punto o no".
   */
  dueno: Int8Array;
  /** El campo ya evaluado en cada punto, 0 a 1. Se calcula UNA vez, aquí. */
  k: Float32Array;
  /**
   * ÍNDICE DE CELDA → PUNTO, o -1 si la celda cae fuera del territorio.
   *
   * Los puntos están en una retícula regular, así que saber qué celda hay bajo el
   * cursor es una división y una lectura: `indice[iy * cols + ix]`. La
   * alternativa —recorrer los 1 856 puntos buscando el más cercano en cada
   * `pointermove`— es O(n) por evento para resolver algo que es O(1).
   */
  indice: Int32Array;
  cols: number;
  filas: number;
  /** Lado de la celda en unidades del viewBox, para el radio del foco. */
  paso: number;
  /**
   * Los anillos de los 32 estados, en unidades del viewBox, para el contorno.
   *
   * Van planos —todos los anillos de todos los estados en una sola lista— porque
   * quien los consume los mete en un único Path2D: la silueta se traza una vez al
   * construir y en cada fotograma sólo se hace un `stroke`. Si algún día hubiera
   * que destacar el contorno del estado señalado, haría falta agruparlos por
   * estado, y para eso están también los índices de `anilloDe`.
   */
  anillos: readonly Anillo[];
  /** Para cada anillo, el índice de su estado en ESTADOS_MAPA. */
  anilloDe: readonly number[];
  /** Cuánto tardó el campo, en ms. Lo reporta el componente en desarrollo. */
  msCampo: number;
};

export function construirNube(): Nube {
  const mapa = ESTADOS.map((e) => ({ anillos: anillos(e.d) }));

  /* Caja de cada estado, para descartar sin probar los anillos. Sin esto, cada
     celda se probaría contra los 32 y la cuenta se multiplica por diez. */
  const cajas = mapa.map((e) => {
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const anillo of e.anillos) {
      for (const [x, y] of anillo) {
        if (x < x0) x0 = x;
        if (y < y0) y0 = y;
        if (x > x1) x1 = x;
        if (y > y1) y1 = y;
      }
    }
    return { x0, y0, x1, y1 };
  });

  const cols = Math.ceil(MAPA_ANCHO / PASO);
  const filas = Math.ceil(MAPA_ALTO / PASO);
  const indice = new Int32Array(cols * filas).fill(-1);

  const xs: number[] = [];
  const ys: number[] = [];
  const duenos: number[] = [];

  for (let iy = 0; iy < filas; iy++) {
    for (let ix = 0; ix < cols; ix++) {
      const x = ix * PASO + PASO / 2;
      const y = iy * PASO + PASO / 2;
      for (let k = 0; k < mapa.length; k++) {
        const c = cajas[k];
        if (x < c.x0 || x > c.x1 || y < c.y0 || y > c.y1) continue;
        let dentro = false;
        for (const anillo of mapa[k].anillos) {
          if (dentroDe(x, y, anillo)) dentro = !dentro;
        }
        if (dentro) {
          indice[iy * cols + ix] = xs.length;
          xs.push(x);
          ys.push(y);
          duenos.push(k);
          /* Un punto pertenece a un solo estado: las fronteras no se solapan. */
          break;
        }
      }
    }
  }

  /*
   * LOS CENTROS salen del centroide que el archivo generado ya trae calculado,
   * no de promediar esquinas: un estado como Baja California —largo y con islas—
   * tiene su centroide muy lejos de la media de sus vértices.
   */
  const centros = ESTADOS.map((e, i) => ({
    x: e.centroide[0] * ESCALA_CAMPO,
    y: e.centroide[1] * ESCALA_CAMPO,
    k: ESTADOS_MAPA[i].nivel,
  }));

  const t0 = typeof performance !== "undefined" ? performance.now() : 0;
  const ks = new Float32Array(xs.length);
  for (let p = 0; p < xs.length; p++) {
    const px = xs[p] * ESCALA_CAMPO;
    const py = ys[p] * ESCALA_CAMPO;
    let num = 0;
    let den = 0;
    for (const c of centros) {
      const dx = px - c.x;
      const dy = py - c.y;
      /*
       * El +0.6 evita la división por cero cuando un punto cae justo sobre un
       * centro. Y el peso va AL CUADRADO del cuadrado de la distancia —o sea
       * 1/d⁴— porque con 1/d² el campo se aplana y todo tiende a la media: la
       * influencia tiene que ser local para que el degradado signifique algo.
       */
      const d2 = dx * dx + dy * dy + 0.6;
      const w = 1 / (d2 * d2);
      num += c.k * w;
      den += w;
    }
    ks[p] = num / den;
  }
  const msCampo = (typeof performance !== "undefined" ? performance.now() : 0) - t0;

  return {
    x: Float32Array.from(xs),
    y: Float32Array.from(ys),
    dueno: Int8Array.from(duenos),
    k: ks,
    indice,
    cols,
    filas,
    paso: PASO,
    anillos: mapa.flatMap((e) => e.anillos),
    anilloDe: mapa.flatMap((e, i) => e.anillos.map(() => i)),
    msCampo,
  };
}

export { MAPA_ALTO, MAPA_ANCHO };
