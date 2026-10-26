"use client";

/**
 * La configuración del Studio se importa AQUÍ, en un componente de cliente, y
 * no en page.tsx. Importada desde el servidor, metía el paquete `sanity` en el
 * grafo de servidor de React, donde `swr` no tiene export por defecto y el
 * build fallaba («Export default doesn't exist… swr/react-server»).
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export function Studio() {
  return <NextStudio config={config} />;
}
