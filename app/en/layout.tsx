import type { ReactNode } from "react";
import { IdiomaDocumento } from "./IdiomaDocumento";

/**
 * EL SITIO EN INGLÉS (noviembre de 2026). Cuelga de /en con las rutas
 * traducidas —ver lib/idioma.ts—; el español sigue en la raíz.
 *
 * ⚠ NO ES UN LAYOUT RAÍZ, y es a propósito. Uno propio con su <html lang="en">
 * exigiría partir el sitio en dos layouts raíz, y eso trae de vuelta el problema
 * del 404 global (experimental.globalNotFound) que ya se descartó. El <html> es
 * el de app/layout.tsx; el idioma del contenido lo marca este envoltorio, que
 * con `display: contents` no existe para la maqueta, y el del documento lo
 * ajusta <IdiomaDocumento> al cargar.
 */
export default function LayoutEn({ children }: { children: ReactNode }) {
  return (
    <div lang="en" style={{ display: "contents" }}>
      <IdiomaDocumento />
      {children}
    </div>
  );
}
