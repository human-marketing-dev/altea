import type { EstadoId } from "./mexico-estados";

/**
 * Los 21 estados donde Altea tiene presencia.
 *
 * Presencia y proyecto documentado son cosas distintas: aquí están los 21,
 * pero solo algunos aparecen en PROYECTOS con una ficha.
 *
 * `satisfies readonly EstadoId[]` valida en tiempo de compilación que las 21
 * claves existan en EstadoId; el `as const` conserva los literales para poder
 * derivar el tipo de abajo.
 */
export const ESTADOS_CON_PRESENCIA = [
  "MX-BCN",
  "MX-BCS",
  "MX-CMX",
  "MX-CHH",
  "MX-COA",
  "MX-DUR",
  "MX-MEX",
  "MX-GUA",
  "MX-JAL",
  "MX-NAY",
  "MX-PUE",
  "MX-ROO",
  "MX-SIN",
  "MX-SLP",
  "MX-SON",
  "MX-TAB",
  "MX-TAM",
  "MX-VER",
  "MX-YUC",
  "MX-NLE",
  "MX-QUE",
] as const satisfies readonly EstadoId[];

/** Solo los estados con presencia. Un proyecto no puede estar fuera de la lista. */
export type EstadoConPresencia = (typeof ESTADOS_CON_PRESENCIA)[number];

export type Proyecto = {
  id: string;
  nombre: string;
  /**
   * Clave ISO 3166-2:MX, restringida a los estados con presencia: si un
   * proyecto apunta a un estado fuera de ESTADOS_CON_PRESENCIA, `tsc` falla.
   */
  estado: EstadoConPresencia;
  ciudad?: string;
  anio?: number;
  descripcion?: string;
  url?: string;
};

/**
 * Proyectos con ficha documentada. Es un subconjunto de ESTADOS_CON_PRESENCIA:
 * los demás estados salen en el mapa como presencia, sin ficha.
 *
 * PENDIENTE: faltan los proyectos de los otros 15 estados con presencia.
 */
export const PROYECTOS: Proyecto[] = [
  {
    id: "paseo-la-fe",
    nombre: "Paseo La Fe",
    estado: "MX-NLE",
    ciudad: "San Nicolás de los Garza",
    descripcion: "Centro comercial · 34 locales, 94% de ocupación.",
  },
  {
    id: "punto-huinala",
    nombre: "Punto Huinala",
    estado: "MX-NLE",
    ciudad: "Apodaca",
    descripcion: "Centro comercial de barrio.",
  },
  {
    /* Confirmado por el copy de /comercial, que lo describe como Street Mall en
       Distrito Tec. Estuvo fuera esperando esa confirmación. */
    id: "paseo-tec",
    nombre: "Paseo Tec",
    estado: "MX-NLE",
    ciudad: "Monterrey",
    descripcion: "Centro comercial · Street Mall en Distrito Tec.",
  },
  {
    id: "paseo-durango",
    nombre: "Paseo Durango",
    estado: "MX-DUR",
    ciudad: "Durango",
    descripcion: "Centro comercial.",
  },
  {
    id: "paseo-gomez-palacio",
    nombre: "Paseo Gómez Palacio",
    estado: "MX-DUR",
    ciudad: "Gómez Palacio",
    descripcion: "Centro comercial.",
  },
  {
    id: "paseo-juarez",
    nombre: "Paseo Juárez",
    estado: "MX-CHH",
    ciudad: "Ciudad Juárez",
    descripcion: "Centro comercial.",
  },
  {
    id: "paseo-los-mochis",
    nombre: "Paseo Los Mochis",
    estado: "MX-SIN",
    ciudad: "Los Mochis",
    descripcion: "Centro comercial.",
  },
  {
    id: "punto-rio-nilo",
    nombre: "Punto Río Nilo",
    estado: "MX-JAL",
    /* El copy de /comercial lo sitúa en Tonalá, no en Guadalajara. */
    ciudad: "Tonalá",
    descripcion: "Centro comercial de barrio.",
  },
  {
    id: "aeropuerto-saltillo",
    nombre: "Aeropuerto Internacional de Saltillo",
    estado: "MX-COA",
    ciudad: "Saltillo",
    descripcion: "Infraestructura aeroportuaria.",
  },
];

/**
 * Metros cuadrados construidos por estado, para el tooltip del mapa.
 *
 * ⚠ PENDIENTE — ALTEA NO HA ENTREGADO NINGUNA CIFRA. El objeto va vacío a
 * propósito y no con ceros: un cero diría "cero metros construidos", que es
 * falso. Sin dato, el tooltip se compone sólo con el nombre del estado.
 *
 * Para rellenarlo, una línea por estado con su clave ISO:
 *     "MX-NLE": 24_000_000,
 * Sólo tiene sentido para los de ESTADOS_CON_PRESENCIA; el resto no se apunta.
 */
/**
 * Superficie construida por estado, en m².
 *
 * Son los 21 estados de ESTADOS_CON_PRESENCIA y ninguno más: la lista coincide
 * exactamente, así que no hay estado con dato que no tenga presencia ni al revés.
 * El tipo lo garantiza — una clave fuera de la lista no compila.
 *
 * Hay CINCO órDENES DE MAGNITUD entre Nayarit (200) y Nuevo León (24 millones).
 * Por eso el mapa pinta la intensidad en escala logarítmica: en lineal, todos
 * salvo Nuevo León y Yucatán quedarían del mismo tono.
 */
export const M2_CONSTRUIDOS: Partial<Record<EstadoConPresencia, number>> = {
  "MX-NLE": 24_189_425,
  "MX-YUC": 12_069_196,
  "MX-TAM": 718_603,
  "MX-TAB": 182_754,
  "MX-DUR": 126_721,
  "MX-JAL": 82_810,
  "MX-SON": 60_317,
  "MX-SIN": 55_649,
  "MX-GUA": 50_006,
  "MX-COA": 35_459,
  "MX-PUE": 25_622,
  "MX-ROO": 16_706,
  "MX-QUE": 16_038,
  "MX-CHH": 15_716,
  "MX-VER": 15_292,
  "MX-CMX": 12_668,
  "MX-SLP": 10_333,
  "MX-MEX": 9_863,
  "MX-BCS": 508,
  "MX-BCN": 312,
  "MX-NAY": 200,
};

/** Presencia fuera de México. El mapa solo cubre el territorio nacional. */
/*
 * Lo consume el cuerpo de Nuestra Huella (app/_nosotros/content.ts), que arma la
 * lista de países desde aquí en vez de repetirla escrita. Añadir o quitar un país
 * actualiza el párrafo solo.
 */
export const PRESENCIA_INTERNACIONAL = [
  "Estados Unidos",
  "España",
  "Costa Rica",
] as const;
