"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useIdioma } from "@/app/ui/useIdioma";
import { contenidoHome } from "./contenido";
import type { ContenidoHome } from "@/lib/sanity/home";

/**
 * El contenido del home para sus componentes del navegador (noviembre de 2026).
 *
 * PaginaHome lo arma en el servidor desde Sanity (lib/sanity/home.ts) y lo pone
 * aquí. Los componentes piden `useContenidoHome()` en lugar de
 * `contenidoHome(idioma)`: sin proveedor —una página que no lo ponga— cae al
 * contenido del código en el idioma de la URL, como antes.
 */
const Contexto = createContext<ContenidoHome | null>(null);

export function ProveedorContenidoHome({ valor, children }: { valor: ContenidoHome; children: ReactNode }) {
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useContenidoHome(): ContenidoHome {
  const valor = useContext(Contexto);
  const idioma = useIdioma();
  return valor ?? contenidoHome(idioma);
}
