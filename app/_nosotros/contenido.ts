import type { Idioma } from "@/lib/idioma";
import * as ES from "./content";
import * as EN from "./content.en";

/** El contenido de /nosotros en el idioma de la página. Ver contenidoHome. */
export const contenidoNosotros = (idioma: Idioma) => (idioma === "en" ? EN : ES);
