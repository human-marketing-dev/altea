"use client";

import { useEffect } from "react";
import { LANG } from "@/lib/idioma";

/**
 * Pone `lang="en"` en el <html> mientras se está en /en, y lo devuelve al
 * salir. El <html> lo pinta app/layout.tsx, que es uno solo para los dos
 * idiomas y no sabe en cuál está: sin esto, un lector de pantalla leería el
 * inglés con voz en español. El contenido ya va marcado desde el HTML por el
 * envoltorio de app/en/layout.tsx; esto completa el del documento.
 */
export function IdiomaDocumento() {
  useEffect(() => {
    const html = document.documentElement;
    html.lang = LANG.en;
    return () => {
      html.lang = LANG.es;
    };
  }, []);
  return null;
}
