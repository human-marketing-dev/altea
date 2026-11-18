"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DATOS_RESPALDO, type DatosSitio } from "@/lib/sanity/sitio-datos";

/**
 * Los datos de contacto del sitio para los componentes del navegador (los
 * cierres y el botón de WhatsApp). Los pone app/layout.tsx, que los lee de
 * Sanity en el servidor. Sin proveedor, los de lib/contacto.ts.
 */
const Contexto = createContext<DatosSitio>(DATOS_RESPALDO);

export function ProveedorSitio({ datos, children }: { datos: DatosSitio; children: ReactNode }) {
  return <Contexto.Provider value={datos}>{children}</Contexto.Provider>;
}

export const useSitio = () => useContext(Contexto);
