/**
 * La geometría del isotipo de Altea, en un solo sitio.
 *
 * Fuente: `public/brand/logos/altea-icon-dark.svg`, un único <path> con dos
 * subrutas —contorno exterior y contraforma— en un viewBox de 318.06 × 324:
 *
 *   M318.06,324 h-53.86 l-29.26,-60.22 H83.12 l-29.26,60.22 H0 L159.03,0 … Z
 *   M213.31,219.25 l-54.28,-111.11 l-54.28,111.11 h108.57 Z
 *
 * No es una A maciza: es un PÓRTICO. Dos brazos que convergen en la clave, un
 * tirante que los ata y dos zapatas, con un hueco triangular en los dos tercios
 * superiores. Las pendientes del exterior y de la contraforma NO son paralelas
 * —±0.490830 contra ±0.488516—, así que las x de cualquier altura se calculan,
 * no se interpolan.
 *
 * Vive en lib/ y no dentro de una sección porque lo consumen dos cosas que no se
 * conocen entre sí: las seis piezas de hormigón del hero del home
 * (app/_home/heroA/isotipo.ts) y la nube de puntos del hero de
 * /nosotros. Duplicar diez números en dos archivos es como se acaban separando.
 *
 * ⚠ EL ISOTIPO ES PROVISIONAL. Su propio SVG lo dice: se sintetizó copiando la A
 * del wordmark porque no existía ninguno en el repositorio. Si Altea entrega el
 * suyo, se rehace este archivo y nada más.
 */

/** Escala y centro con que se normaliza el viewBox a unidades de escena. */
const E = 1.95 / 324; // el alto del isotipo pasa a valer 1.95 unidades
const CX = 159.03; // eje de simetría del dibujo
const CY = 162; // mitad del alto

/** Pasa un vértice del viewBox (y hacia abajo) a la escena (y hacia arriba). */
export const vertice = (x: number, y: number): [number, number] => [
  (x - CX) * E,
  (CY - y) * E,
];

/** Arista exterior izquierda y derecha a la altura `y` del viewBox. */
export const xIzq = (y: number) => CX - 0.49083 * y;
export const xDer = (y: number) => CX + 0.49083 * y;

/**
 * Las tres alturas donde el dibujo cambia de naturaleza, en el viewBox.
 *
 * No se eligen: están en el trazado. Por encima de CLAVE es macizo; entre CLAVE
 * y TIRANTE son dos brazos con el hueco en medio; entre TIRANTE y ZAPATA vuelve a
 * ser una sola pieza —ésa es la viga—; por debajo de ZAPATA son dos patas
 * separadas.
 */
export const CORTE_CLAVE = 108.14; // ápice de la contraforma · 33.4 % del alto
export const CORTE_TIRANTE = 219.25; // base de la contraforma · 67.7 %
export const CORTE_ZAPATA = 263.78; // vértice del rebaje · 81.4 %

/** Semiancho y semialto de la caja del isotipo, en unidades de escena. */
export const SEMI_ANCHO = 0.9571;
export const SEMI_ALTO = 0.975;

/**
 * El contorno exterior, cerrado, en sentido horario.
 *
 * Siete vértices: ápice, las dos zapatas con su rebaje y el tirante. El hueco va
 * aparte en CONTRAFORMA: quien necesite la silueta maciza tiene que restarlo.
 */
export const CONTORNO: readonly [number, number][] = [
  vertice(CX, 0),
  vertice(0, 324),
  vertice(53.86, 324),
  vertice(83.12, CORTE_ZAPATA),
  vertice(234.94, CORTE_ZAPATA),
  vertice(264.2, 324),
  vertice(318.06, 324),
];

/** La contraforma: el hueco triangular de los dos tercios superiores. */
export const CONTRAFORMA: readonly [number, number][] = [
  vertice(213.31, CORTE_TIRANTE),
  vertice(CX, CORTE_CLAVE),
  vertice(104.75, CORTE_TIRANTE),
];

/**
 * ¿Cae el punto dentro de un polígono? Cruce de rayos, regla par-impar.
 *
 * Se exporta porque la rasterización del isotipo y la del mapa de México usan
 * exactamente la misma prueba, y es una de esas funciones que si se copia acaba
 * copiada con una variante sutil.
 */
export function dentroDe(
  px: number,
  py: number,
  poligono: readonly [number, number][],
): boolean {
  let dentro = false;
  for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
    const [xi, yi] = poligono[i];
    const [xj, yj] = poligono[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      dentro = !dentro;
    }
  }
  return dentro;
}

/** ¿Cae el punto en la masa del isotipo? Dentro del contorno y fuera del hueco. */
export const dentroDelIsotipo = (px: number, py: number) =>
  dentroDe(px, py, CONTORNO) && !dentroDe(px, py, CONTRAFORMA);
