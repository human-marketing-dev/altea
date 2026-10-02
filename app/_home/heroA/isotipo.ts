/**
 * El isotipo de Altea partido en piezas, para el hero que lo construye.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * DE DÓNDE SALEN ESTOS NÚMEROS
 *
 * De `public/brand/logos/altea-icon-dark.svg`, que es un solo <path> con dos
 * subrutas —contorno exterior y contraforma— en un viewBox de 318.06 × 324:
 *
 *   M318.06,324 h-53.86 l-29.26,-60.22 H83.12 l-29.26,60.22 H0 L159.03,0 … Z
 *   M213.31,219.25 l-54.28,-111.11 l-54.28,111.11 h108.57 Z
 *
 * No es una A maciza: es un PÓRTICO. Leído de arriba abajo cambia de naturaleza
 * exactamente tres veces, y esas tres alturas son las líneas de corte. No hay
 * que elegirlas: están en el dibujo.
 *
 *   y = 108.14  (33.4 %)  ápice de la contraforma. Arriba macizo, abajo DOS brazos.
 *   y = 219.25  (67.7 %)  base de la contraforma. Vuelve a ser UNA pieza.
 *   y = 263.78  (81.4 %)  vértice del rebaje. Abajo, DOS patas separadas.
 *
 * Entre 219.25 y 263.78 hay una banda maciza de 44.53 de canto que va de lado a
 * lado. Es un TIRANTE: el elemento que ata los dos brazos. Cortar ahí no es una
 * comodidad, es que ahí hay una viga.
 *
 * Cortar en 108.14 tiene además una consecuencia práctica que decidió el
 * reparto: NINGUNA PIEZA NECESITA `shape.holes`. El hueco deja de ser un
 * agujero y pasa a ser el canto interior de los dos brazos. Una pieza con
 * agujero en ExtrudeGeometry teselaría peor, rompería la proyección de caja de
 * las UV y le daría aristas interiores a EdgesGeometry.
 *
 * Las x de cada corte salen de intersectar las aristas reales. La pendiente
 * exterior es dx/dy = ±0.490830 y la de la contraforma ±0.488516: NO son
 * paralelas, se abren 0.0023, así que el brazo engorda de 53.08 a 53.34 de
 * arriba abajo. Por eso las x están calculadas y no interpoladas a ojo.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * POR QUÉ 6 Y NO 5
 *
 * Por debajo de y = 263.78 el isotipo son dos sólidos DESCONECTADOS, y un
 * THREE.Shape no puede ser discontinuo. Los repartos que el dibujo admite son 6
 * (éste) y 4 —fundiendo clave y brazos en un galón—. Con 5 habría que partir el
 * tirante por el eje, que es el peor sitio posible de una viga.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠ ESTE ISOTIPO ES PROVISIONAL
 *
 * Su propio archivo lo dice: se sintetizó copiando la A del wordmark porque no
 * existía ningún isotipo en el repositorio. Si Altea entrega el suyo, estos seis
 * cortes se rehacen enteros — pero solo este archivo, porque Escena3D no sabe
 * nada de la letra: recorre PIEZAS y extruye lo que encuentre.
 */

import {
  CORTE_CLAVE,
  CORTE_TIRANTE,
  CORTE_ZAPATA,
  SEMI_ALTO,
  SEMI_ANCHO,
  vertice as v,
  xDer,
  xIzq,
} from "@/lib/isotipo";

export { SEMI_ALTO, SEMI_ANCHO };

/*
 * La geometría base —el viewBox, su normalización, las tres alturas de corte y
 * las dos aristas— vive en lib/isotipo.ts, porque la comparte con la nube de
 * puntos del hero de /nosotros. Aquí sólo están los CORTES: cómo se reparte ese
 * contorno en las seis piezas que se extruyen.
 *
 * Que las seis piezas reconstruyen el dibujo está comprobado: la suma de sus
 * áreas da 1.25293 contra 1.25294 del contorno real menos la contraforma, y la
 * diferencia —una cienmilésima— es el redondeo a dos decimales del propio SVG.
 */
const CX = 159.03;

/*
 * TODOS los contornos van en el mismo sentido de giro: horario en coordenadas de
 * escena, con la y hacia arriba.
 *
 * No es cosmética. ExtrudeGeometry normaliza el sentido por su cuenta —fuerza el
 * horario y da la vuelta al contorno si hace falta—, así que hoy da igual y las
 * normales frontales salen bien de todas formas. Pero eso es una cortesía de ESE
 * constructor: en cuanto alguien pase estos contornos por ShapeGeometry, por una
 * triangulación propia o por un extrusor distinto, la pieza que gire al revés
 * sale con la cara delantera mirando hacia dentro, y en una escena con luz
 * direccional eso se ve como una pieza apagada entre cinco iluminadas.
 *
 * La clave estaba al revés —apice, izquierda, derecha da antihorario— y va
 * escrita apice, derecha, izquierda por esto.
 */
export type Pieza = {
  /** Identificador constructivo, no decorativo: es lo que la pieza ES. */
  id: "clave" | "brazoIzq" | "brazoDer" | "tirante" | "zapataIzq" | "zapataDer";
  /** Contorno cerrado en unidades de escena. Simple, sin huecos. */
  contorno: readonly [number, number][];
  /**
   * Orden de llegada, 0 = primero.
   *
   * Un pórtico se levanta de abajo arriba: zapatas, tirante, brazos y la clave
   * al final. El ensamble cuenta eso en vez de mover las seis piezas a la vez,
   * que era lo que hacía el prototipo y lo que lo dejaba en un movimiento sin
   * argumento. Ver DESFASE en Escena3D para cuánto se solapan entre sí.
   */
  turno: number;
};

export const PIEZAS: readonly Pieza[] = [
  {
    id: "zapataIzq",
    turno: 0,
    contorno: [
      v(xIzq(CORTE_ZAPATA), CORTE_ZAPATA),
      v(83.12, CORTE_ZAPATA),
      v(53.86, 324),
      v(0, 324),
    ],
  },
  {
    id: "zapataDer",
    turno: 0,
    contorno: [
      v(234.94, CORTE_ZAPATA),
      v(xDer(CORTE_ZAPATA), CORTE_ZAPATA),
      v(318.06, 324),
      v(264.2, 324),
    ],
  },
  {
    id: "tirante",
    turno: 1,
    contorno: [
      v(xIzq(CORTE_TIRANTE), CORTE_TIRANTE),
      v(xDer(CORTE_TIRANTE), CORTE_TIRANTE),
      v(xDer(CORTE_ZAPATA), CORTE_ZAPATA),
      v(xIzq(CORTE_ZAPATA), CORTE_ZAPATA),
    ],
  },
  {
    id: "brazoIzq",
    turno: 2,
    contorno: [
      v(xIzq(CORTE_CLAVE), CORTE_CLAVE),
      v(CX, CORTE_CLAVE),
      v(104.75, CORTE_TIRANTE),
      v(xIzq(CORTE_TIRANTE), CORTE_TIRANTE),
    ],
  },
  {
    id: "brazoDer",
    turno: 2,
    contorno: [
      v(CX, CORTE_CLAVE),
      v(xDer(CORTE_CLAVE), CORTE_CLAVE),
      v(xDer(CORTE_TIRANTE), CORTE_TIRANTE),
      v(213.31, CORTE_TIRANTE),
    ],
  },
  {
    id: "clave",
    turno: 3,
    /* Su arista inferior pasa por el ápice de la contraforma: el corte es
       tangente al hueco, así que la clave es un triángulo limpio. */
    contorno: [v(CX, 0), v(xDer(CORTE_CLAVE), CORTE_CLAVE), v(xIzq(CORTE_CLAVE), CORTE_CLAVE)],
  },
];

/** Cuántos turnos distintos hay. Lo usa el escalonado del ensamble. */
export const TURNOS = Math.max(...PIEZAS.map((p) => p.turno)) + 1;

/** Grosor de la extrusión, en las mismas unidades que el contorno. */
export const CANTO = 0.34;

/**
 * Bisel de cada pieza.
 *
 * Encoge la pieza hacia dentro, así que entre dos vecinas queda una ranura del
 * DOBLE del bisel. Con .006 la junta es una línea fina, como la de un
 * prefabricado; con valores mayores las piezas parecen mal encajadas.
 */
export const BISEL = 0.006;

/** Centroide del contorno. De él sale la dirección por la que entra la pieza. */
export function centroide(p: Pieza): [number, number] {
  const n = p.contorno.length;
  return [
    p.contorno.reduce((a, [x]) => a + x, 0) / n,
    p.contorno.reduce((a, [, y]) => a + y, 0) / n,
  ];
}

/**
 * Altura del centroide de ÁREA del isotipo. Sale en −0.2083.
 *
 * O sea: la masa del dibujo está un 10.7 % de su altura por debajo del centro de
 * su caja, porque abajo hay dos zapatas anchas y el tirante, y arriba sólo la
 * clave. Centrar la caja en pantalla deja la letra ópticamente baja —se lee
 * apoyada, no centrada—, y por eso el encuadre de Escena3D coloca este punto y no
 * el centro geométrico.
 *
 * Se calcula, no se escribe a mano: si los cortes cambian, el encuadre se ajusta
 * solo. Son seis polígonos de tres o cuatro vértices, así que el coste es nada.
 */
export const CENTROIDE_Y = (() => {
  const areaYcentro = PIEZAS.map((p) => {
    const c = p.contorno;
    const a =
      Math.abs(
        c.reduce((acc, q, i) => {
          const r = c[(i + 1) % c.length];
          return acc + (q[0] * r[1] - r[0] * q[1]);
        }, 0),
      ) / 2;
    return { a, y: centroide(p)[1] };
  });
  const total = areaYcentro.reduce((acc, x) => acc + x.a, 0);
  return areaYcentro.reduce((acc, x) => acc + x.a * x.y, 0) / total;
})();
