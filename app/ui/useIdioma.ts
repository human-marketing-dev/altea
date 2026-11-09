"use client";

import { usePathname } from "next/navigation";
import { idiomaDeRuta, type Idioma } from "@/lib/idioma";

/**
 * El idioma de la página, leído de la URL: inglés si cuelga de /en.
 *
 * Es lo que permite que los componentes de cliente sepan en qué idioma pintar
 * SIN que la página se lo pase por props a través de cinco niveles. Funciona
 * igual en el prerenderizado: `usePathname` devuelve la ruta que se está
 * generando. Los componentes de servidor no pueden usarlo: a ellos se lo pasa
 * su página como prop `idioma`.
 */
export function useIdioma(): Idioma {
  return idiomaDeRuta(usePathname());
}
