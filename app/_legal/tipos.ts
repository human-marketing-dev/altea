/**
 * La forma de un documento legal del sitio.
 *
 * El TEXTO ES EL QUE ENTREGÓ ALTEA, tal cual, incluidas las erratas: es un
 * documento legal y cualquier corrección de redacción le toca a quien lo firma.
 * Lo único que se normalizó es lo que venía roto por la exportación —las barras
 * de escape de Markdown (`http\://`, `1\.`, `\[`) y un espacio de ancho cero— y
 * la numeración romana, que llegó escrita con eles minúsculas ("lll.").
 *
 * Marcado dentro de las cadenas, y nada más:
 *   **negrita**      → <strong>
 *   [texto](url)     → enlace
 *   \n               → salto de línea dentro del mismo párrafo
 */
export type Bloque =
  | { tipo: "p"; texto: string }
  | { tipo: "lista"; items: string[] }
  /** Un encabezado dentro de una sección que el documento no numera. */
  | { tipo: "subtitulo"; texto: string };

export interface Seccion {
  titulo: string;
  bloques: Bloque[];
}

export interface DocumentoLegal {
  metadata: { title: string; description: string };
  titulo: string;
  /** Va debajo del título; sin valor no se pinta. */
  bajada?: string;
  /** Lo que va antes de la primera sección. */
  intro?: Bloque[];
  secciones: Seccion[];
  /** Lo que va después de la última: firma, fecha. */
  cierre?: Bloque[];
}
