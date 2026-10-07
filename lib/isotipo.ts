/**
 * La geometría del isotipo de Altea, en un solo sitio.
 *
 * Fuente: `public/brand/logos/altea-isotipo.svg`, el isotipo REAL de marca, en
 * un viewBox de 494 × 430. Son tres figuras, no una:
 *
 *   · el pórtico, un <path> con dos subrutas —contorno exterior y contraforma—
 *       M422.12,430 h-71.48 l-38.83,-79.92 H110.31 l-38.83,79.92 H0 L211.06,0 Z
 *       M283.1,290.98 l-72.04,-147.46 l-72.04,147.46 h144.08 Z
 *   · la banderola, dos <polygon> arriba a la derecha, uno cream y uno coral
 *       349.92,147.46  398.73,147.46  421.96,0
 *       421.96,0       398.73,147.46  494,147.46
 *
 * El pórtico son dos brazos que convergen en la clave, un tirante que los ata y
 * dos zapatas, con un hueco triangular en los dos tercios superiores. Las
 * pendientes del exterior y de la contraforma NO son paralelas —0.490837 contra
 * 0.488539, se abren 0.0023—, así que las x de cualquier altura se CALCULAN: una
 * interpolación a ojo entre los vértices del SVG deja el brazo con el canto
 * torcido, y en una pieza extruida eso se ve en la junta.
 *
 * Vive en lib/ y no dentro de una sección porque lo consumen dos cosas que no se
 * conocen entre sí: las piezas de hormigón del hero del home
 * (app/_home/heroA/isotipo.ts) y la nube de puntos del hero de /nosotros.
 * Duplicar diez números en dos archivos es como se acaban separando.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * SUSTITUYE AL ISOTIPO PROVISIONAL, y por eso cambian los números
 *
 * Hasta aquí este archivo describía `altea-icon-dark.svg`, que su propio SVG
 * declaraba sintetizado copiando la A del wordmark porque no existía ningún
 * isotipo en el repositorio. Ya existe.
 *
 * La silueta del pórtico resulta casi la misma —la pendiente exterior es
 * 0.490837 en los dos, hasta la sexta cifra—, así que el dibujo era buena
 * copia. Lo que cambia de verdad es que el isotipo real LLEVA BANDEROLA, que es
 * la que trae el coral de marca, y que el viewBox es otro: las tres alturas de
 * corte pasan de 108.14 / 219.25 / 263.78 sobre 324 a 143.52 / 290.98 / 350.08
 * sobre 430. En fracción del alto son 33.4 / 67.7 / 81.4 % contra 33.4 / 67.7 /
 * 81.4 %: las mismas, lo que confirma las dos cosas a la vez.
 */

/** Escala y centro con que se normaliza el viewBox a unidades de escena. */
const E = 1.95 / 430; // el alto del isotipo pasa a valer 1.95 unidades
const CX = 211.06; // eje de simetría del pórtico
const CY = 215; // mitad del alto

/**
 * Pasa un vértice del viewBox (y hacia abajo) a la escena (y hacia arriba).
 *
 * La caja queda CENTRADA en el origen: el ápice en +0.975 y la base en −0.975.
 * El prototipo del hero usaba `py = 1.05 − Y·E`, que deja el centro en +0.075,
 * así que sus coordenadas son todas 0.075 más altas que éstas. Es la misma
 * figura con otro origen, y centrada es la que sirve: el encuadre de Escena3D
 * mide el semialto y el centroide DESDE el centro de la caja.
 */
export const vertice = (x: number, y: number): [number, number] => [
  (x - CX) * E,
  (CY - y) * E,
];

/** Pendiente dx/dy de la arista exterior: del ápice (211.06,0) a (0,430). */
const M_EXT = 211.06 / 430;

/** Arista exterior izquierda y derecha a la altura `y` del viewBox. */
export const xIzq = (y: number) => CX - M_EXT * y;
export const xDer = (y: number) => CX + M_EXT * y;

/**
 * Las tres alturas donde el dibujo cambia de naturaleza, en el viewBox.
 *
 * No se eligen: están en el trazado. Por encima de CLAVE es macizo; entre CLAVE
 * y TIRANTE son dos brazos con el hueco en medio; entre TIRANTE y ZAPATA vuelve
 * a ser una sola pieza —ésa es la viga—; por debajo de ZAPATA son dos patas
 * separadas.
 */
export const CORTE_CLAVE = 143.52; // ápice de la contraforma · 33.4 % del alto
export const CORTE_TIRANTE = 290.98; // base de la contraforma · 67.7 %
export const CORTE_ZAPATA = 350.08; // vértice del rebaje · 81.4 %

/** Semiancho y semialto del PÓRTICO —sin banderola—, en unidades de escena. */
export const SEMI_ANCHO = 0.957133;
export const SEMI_ALTO = 0.975;

/**
 * El contorno exterior del pórtico, cerrado, en sentido horario.
 *
 * Siete vértices: las dos zapatas con su rebaje y el ápice. El hueco va aparte
 * en CONTRAFORMA: quien necesite la silueta maciza tiene que restarlo.
 */
export const CONTORNO: readonly [number, number][] = [
  vertice(422.12, 430),
  vertice(350.64, 430),
  vertice(311.81, CORTE_ZAPATA),
  vertice(110.31, CORTE_ZAPATA),
  vertice(71.48, 430),
  vertice(0, 430),
  vertice(CX, 0),
];

/** La contraforma: el hueco triangular de los dos tercios superiores. */
export const CONTRAFORMA: readonly [number, number][] = [
  vertice(283.1, CORTE_TIRANTE),
  vertice(CX, CORTE_CLAVE),
  vertice(139.02, CORTE_TIRANTE),
];

/**
 * La banderola: los dos triángulos de arriba a la derecha.
 *
 * El segundo es el que lleva el coral de marca, y es el único acento de color
 * del isotipo. Los dos van en el MISMO sentido de giro que el pórtico —horario—,
 * que es al revés de como los declara el SVG.
 *
 * Sobresale 0.326 por la derecha del eje del pórtico, así que el isotipo
 * completo NO está centrado en ese eje: quien lo dibuje tiene que recolocarlo
 * por su caja real. Ver RECENTRADO_X en app/_home/heroA/isotipo.ts.
 */
export const BANDEROLA_CREAM: readonly [number, number][] = [
  vertice(421.96, 0),
  vertice(398.73, 147.46),
  vertice(349.92, 147.46),
];
export const BANDEROLA_CORAL: readonly [number, number][] = [
  vertice(494, 147.46),
  vertice(398.73, 147.46),
  vertice(421.96, 0),
];

/** El coral de marca. Es --altea-coral de los tokens, en hexadecimal para WebGL. */
export const CORAL = 0xf15d4d;

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

/** ¿Cae el punto en la masa del pórtico? Dentro del contorno y fuera del hueco. */
export const dentroDelIsotipo = (px: number, py: number) =>
  dentroDe(px, py, CONTORNO) && !dentroDe(px, py, CONTRAFORMA);
