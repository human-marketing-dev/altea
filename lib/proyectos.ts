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
    ciudad: "Guadalajara",
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

/** Presencia fuera de México. El mapa solo cubre el territorio nacional. */
/*
 * NOTA — sin consumir en código desde que el mapa dejó de mostrar la cifra de
 * países. Hoy los tres sólo aparecen escritos dentro del cuerpo de la sección
 * Nuestra Huella (app/_nosotros/content.ts). Se conserva porque es información
 * real, y porque ese texto debería poder derivarse de aquí en vez de repetirlo.
 */
export const PRESENCIA_INTERNACIONAL = [
  "Estados Unidos",
  "España",
  "Costa Rica",
] as const;
