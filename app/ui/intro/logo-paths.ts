/**
 * El logotipo de Altea, derivado de public/images/logo/Altea Contorno Blanco.svg
 * (viewBox 0 0 1536.62 449.03).
 *
 * REGENERADO para el archivo actual. Respecto al anterior: es el mismo dibujo y
 * el mismo tamaño (1536.6 × 308.2), desplazado 70.4 unidades hacia abajo para
 * quedar centrado en el lienzo — y SIN la bajada, que el archivo nuevo ya no
 * trae. Por eso BAJADA y BAJADA_CIRCULOS salen vacíos: el componente recorre
 * esos arreglos, así que no pinta nada y la fase 8.1 del timeline queda sin
 * efecto. Si vuelve a haber bajada, basta con regenerar desde un archivo que la
 * tenga; no hay que tocar el componente.
 *
 * Los 8 paths son bandas cerradas —contorno exterior más su contraforma—, así
 * que de cada uno se guarda SOLO la subruta de mayor área (CONTORNOS): trazar
 * el path entero dibujaría las dos a la vez y el trazo se vería doble. La
 * separación entre exterior e interior es de 3-4x en los ocho, sin ambigüedad.
 *
 * SILUETA son esos mismos contornos unidos en un path. Con fill-rule="evenodd"
 * las contraformas de las dos A quedan como huecos automáticamente.
 */

/** Encaje del viewBox del logo dentro del de la escena (1200x800), a la escala
 *  de diseño. El componente lo recalcula por ratio; esto es el punto de partida
 *  y lo que se renderiza en el servidor. */
export const ENCAJE = "translate(150.03 268.17) scale(0.586)";

/** Centro del dibujo en su espacio local. Lo usa encajeLogo() para reescalarlo
 *  sin moverlo de sitio. */
export const LOGO_CENTRO = { x: 768.30, y: 224.51 };

/** Subruta exterior de cada uno de los 8 paths. Para el trazo. */
export const CONTORNOS = [
  "M1536.61,183.84h-125.65l61.75-113.04,63.9,113.04Z",
  "M1057.39,251.64h-157.3l-.22,75.86,203.69-.03.03,50.91-259.53.06V76.57h259.56s-.05,51.41-.05,51.41h-203.51l-.11,73.63,157.37-.06.06,50.1h0Z",
  "M1339.68,323.5l-144.83.03-27.87,55.08-59.2-.27,90.75-178.8,66.19-129.13,137.18,252.15,30.08,55.75-62.84.24-29.46-55.04h0Z",
  "M1324.65,281.03l-116.55.09,57.06-113.61,25.85,48.84,33.65,64.68h-.01Z",
  "M704.64,378.37l-57.34.05V127.95l-122.5.04-.11-51.41,301.45-.03.04,51.42h-121.54v250.39Z",
  "M594.6,327.51l.03,50.91h-261.18l-.12-301.88,54.84.1.04,250.84,206.4.03h-.01Z",
  "M237.19,323.52l-144.67-.03-29.72,54.88-62.8.05,87.58-160.34,78.96-147.48,26.26,50.24,81.02,155.49,52.96,101.97-60.8.21-28.78-54.99h0Z",
  "M223,281.04l-116.24.11,59.37-112.9,51.34,99.91,5.53,12.88Z",
] as const;

/** Los contornos unidos. Para la silueta sólida de la máscara. */
export const SILUETA =
  "M1536.61,183.84h-125.65l61.75-113.04,63.9,113.04Z M1057.39,251.64h-157.3l-.22,75.86,203.69-.03.03,50.91-259.53.06V76.57h259.56s-.05,51.41-.05,51.41h-203.51l-.11,73.63,157.37-.06.06,50.1h0Z M1339.68,323.5l-144.83.03-27.87,55.08-59.2-.27,90.75-178.8,66.19-129.13,137.18,252.15,30.08,55.75-62.84.24-29.46-55.04h0Z M1324.65,281.03l-116.55.09,57.06-113.61,25.85,48.84,33.65,64.68h-.01Z M704.64,378.37l-57.34.05V127.95l-122.5.04-.11-51.41,301.45-.03.04,51.42h-121.54v250.39Z M594.6,327.51l.03,50.91h-261.18l-.12-301.88,54.84.1.04,250.84,206.4.03h-.01Z M237.19,323.52l-144.67-.03-29.72,54.88-62.8.05,87.58-160.34,78.96-147.48,26.26,50.24,81.02,155.49,52.96,101.97-60.8.21-28.78-54.99h0Z M223,281.04l-116.24.11,59.37-112.9,51.34,99.91,5.53,12.88Z";

/** La bajada del logotipo. Vacía: el archivo actual no la trae. */
export const BAJADA: readonly string[] = [];

export const BAJADA_CIRCULOS: readonly { cx: string; cy: string; r: string }[] = [];
