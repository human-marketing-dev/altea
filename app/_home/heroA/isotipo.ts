/**
 * El isotipo de Altea partido en piezas, para el hero que lo construye.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * DE DÓNDE SALEN LOS CORTES
 *
 * La geometría de la marca —el viewBox, su normalización a unidades de escena,
 * las tres alturas de corte, las dos aristas y los dos triángulos de la
 * banderola— vive en lib/isotipo.ts, porque la comparte con la nube de puntos
 * del hero de /nosotros. Aquí sólo está el DESPIECE: cómo se reparte ese dibujo
 * en las ocho piezas que se extruyen.
 *
 * El pórtico, leído de arriba abajo, cambia de naturaleza exactamente tres
 * veces, y esas tres alturas son las líneas de corte. No hay que elegirlas:
 * están en el trazado.
 *
 *   y = 143.52  (33.4 %)  ápice de la contraforma. Arriba macizo, abajo DOS brazos.
 *   y = 290.98  (67.7 %)  base de la contraforma. Vuelve a ser UNA pieza.
 *   y = 350.08  (81.4 %)  vértice del rebaje. Abajo, DOS patas separadas.
 *
 * Entre 290.98 y 350.08 hay una banda maciza de 59.1 de canto que va de lado a
 * lado. Es un TIRANTE: el elemento que ata los dos brazos. Cortar ahí no es una
 * comodidad, es que ahí hay una viga.
 *
 * Cortar en 143.52 tiene además una consecuencia práctica que decidió el
 * reparto: NINGUNA PIEZA NECESITA `shape.holes`. El hueco deja de ser un
 * agujero y pasa a ser el canto interior de los dos brazos. Una pieza con
 * agujero en ExtrudeGeometry teselaría peor, rompería la proyección de caja de
 * las UV y le daría aristas interiores a EdgesGeometry.
 *
 * Que las seis piezas del pórtico reconstruyen el dibujo está comprobado: la
 * suma de sus áreas da 1.252946 y el contorno real menos la contraforma da
 * 1.252946 — la misma cifra hasta la sexta decimal, porque las x de cada corte
 * se calculan con la pendiente en vez de transcribirse redondeadas. Ni huecos
 * ni solapes entre vecinas.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * POR QUÉ 6 Y NO 5, Y POR QUÉ 8 Y NO 6
 *
 * Por debajo de y = 350.08 el pórtico son dos sólidos DESCONECTADOS, y un
 * THREE.Shape no puede ser discontinuo. Los repartos que el dibujo admite son 6
 * (éste) y 4 —fundiendo clave y brazos en un galón—. Con 5 habría que partir el
 * tirante por el eje, que es el peor sitio posible de una viga.
 *
 * Las otras dos son la banderola, que en el isotipo real ya viene partida en dos
 * triángulos porque uno es cream y el otro coral. Ese coral es el único acento
 * de color de la marca, así que entra como pieza y no como adorno pintado.
 */

import {
  BANDEROLA_CORAL,
  BANDEROLA_CREAM,
  CORTE_CLAVE,
  CORTE_TIRANTE,
  CORTE_ZAPATA,
  SEMI_ALTO,
  vertice as v,
  xDer,
  xIzq,
} from "@/lib/isotipo";

export { SEMI_ALTO };

/** Eje de simetría del pórtico, en el viewBox. */
const CX = 211.06;

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
 * direccional eso se ve como una pieza apagada entre siete iluminadas.
 *
 * Los dos triángulos de la banderola vienen ya volteados de lib/isotipo.ts: el
 * SVG los declara al revés que el pórtico.
 */
export type Pieza = {
  /** Identificador constructivo, no decorativo: es lo que la pieza ES. */
  id:
    | "clave"
    | "brazoIzq"
    | "brazoDer"
    | "tirante"
    | "zapataIzq"
    | "zapataDer"
    | "bandCream"
    | "bandCoral";
  /** Contorno cerrado en unidades de escena. Simple, sin huecos. */
  contorno: readonly [number, number][];
  /**
   * Orden de llegada, 0 = primero.
   *
   * Un pórtico se levanta de abajo arriba: zapatas, tirante, brazos, la clave y
   * la banderola al final. El ensamble cuenta eso en vez de mover las ocho
   * piezas a la vez, que era lo que hacía el prototipo y lo que lo dejaba en un
   * movimiento sin argumento. Ver DESFASE en Escena3D para cuánto se solapan.
   */
  turno: number;
  /** Lleva el coral de marca en vez del gris del hormigón. */
  coral?: true;
};

export const PIEZAS: readonly Pieza[] = [
  {
    id: "zapataIzq",
    turno: 0,
    contorno: [
      v(xIzq(CORTE_ZAPATA), CORTE_ZAPATA),
      v(110.31, CORTE_ZAPATA),
      v(71.48, 430),
      v(0, 430),
    ],
  },
  {
    id: "zapataDer",
    turno: 0,
    contorno: [
      v(311.81, CORTE_ZAPATA),
      v(xDer(CORTE_ZAPATA), CORTE_ZAPATA),
      v(422.12, 430),
      v(350.64, 430),
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
      v(139.02, CORTE_TIRANTE),
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
      v(283.1, CORTE_TIRANTE),
    ],
  },
  {
    id: "clave",
    turno: 3,
    /* Su arista inferior pasa por el ápice de la contraforma: el corte es
       tangente al hueco, así que la clave es un triángulo limpio. */
    contorno: [v(CX, 0), v(xDer(CORTE_CLAVE), CORTE_CLAVE), v(xIzq(CORTE_CLAVE), CORTE_CLAVE)],
  },
  { id: "bandCream", turno: 4, contorno: BANDEROLA_CREAM },
  { id: "bandCoral", turno: 4, contorno: BANDEROLA_CORAL, coral: true },
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

/** Área del contorno. Pesa el centroide de masa del conjunto. */
function area(p: Pieza): number {
  const c = p.contorno;
  return (
    Math.abs(
      c.reduce((acc, q, i) => {
        const r = c[(i + 1) % c.length];
        return acc + (q[0] * r[1] - r[0] * q[1]);
      }, 0),
    ) / 2
  );
}

/*
 * LA CAJA DEL CONJUNTO Y EL CENTROIDE DE SU MASA.
 *
 * Los dos se CALCULAN de PIEZAS, no se escriben a mano: si el despiece cambia,
 * el encuadre de Escena3D se ajusta solo.
 */
const xs = PIEZAS.flatMap((p) => p.contorno.map((q) => q[0]));

/**
 * Semiancho del CONJUNTO, banderola incluida: 1.1201 contra los 0.9571 del
 * pórtico solo. O sea que la banderola ensancha el isotipo un 17 %, y el
 * encuadre tiene que contar con ella o la punta coral se sale por la derecha.
 *
 * El semialto NO se recalcula aquí: la banderola llega exactamente al ápice de
 * la clave —los dos a y = 0 del viewBox—, así que sigue siendo el SEMI_ALTO de
 * lib/isotipo.ts.
 */
export const SEMI_ANCHO = (Math.max(...xs) - Math.min(...xs)) / 2;

/**
 * Cuánto hay que correr el conjunto para que quede centrado: −0.163.
 *
 * LA BANDEROLA SOBRESALE 0.326 POR LA DERECHA, así que el isotipo completo no
 * está centrado en el eje del pórtico. Hay que recolocarlo por su CAJA REAL, no
 * por el eje: sin esto la pieza se ve corrida hacia la derecha en pantalla y
 * cuesta ver por qué, porque el eje de simetría de la A sigue estando en 0.
 */
export const RECENTRADO_X = -(Math.min(...xs) + Math.max(...xs)) / 2;

/**
 * Altura del centroide de ÁREA del isotipo. Sale en −0.0987.
 *
 * O sea: la masa del dibujo está un 5.1 % de su altura por debajo del centro de
 * su caja, porque abajo hay dos zapatas anchas y el tirante. Centrar la caja en
 * pantalla deja la letra ópticamente baja —se lee apoyada, no centrada—, y por
 * eso el encuadre de Escena3D coloca este punto y no el centro geométrico.
 *
 * CON BANDEROLA LA CORRECCIÓN ES LA MITAD: el pórtico solo da −0.2082, porque
 * arriba sólo está la clave. La banderola añade 0.218 de área en la franja alta
 * y sube el centroide a −0.0987. Por eso se calcula sobre PIEZAS y no se hereda:
 * el número depende del despiece, no del dibujo.
 */
export const CENTROIDE_Y = (() => {
  const pesos = PIEZAS.map((p) => ({ a: area(p), y: centroide(p)[1] }));
  const total = pesos.reduce((acc, x) => acc + x.a, 0);
  return pesos.reduce((acc, x) => acc + x.a * x.y, 0) / total;
})();
