import type { Idioma } from "@/lib/idioma";
import * as ES from "./content";
import * as EN from "./content.en";

/**
 * El contenido de la portada en el idioma de la página (noviembre de 2026).
 * Los componentes piden `contenidoHome(idioma)` en vez de importar content.ts
 * directo: así el mismo componente pinta /, en español, y /en, en inglés.
 */
export const contenidoHome = (idioma: Idioma) => (idioma === "en" ? EN : ES);
