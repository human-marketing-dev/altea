"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useIdioma } from "@/app/ui/useIdioma";
import { contenidoNosotros } from "./contenido";
import type { ContenidoNosotros } from "@/lib/sanity/nosotros";

/**
 * El contenido de /nosotros para sus componentes del navegador (noviembre de
 * 2026). PaginaNosotros lo arma desde Sanity (lib/sanity/nosotros.ts) y lo pone
 * aquí; sin proveedor, el del código en el idioma de la URL. Los componentes
 * del servidor lo reciben como `contenido`.
 */
const Contexto = createContext<ContenidoNosotros | null>(null);

export function ProveedorContenidoNosotros({ valor, children }: { valor: ContenidoNosotros; children: ReactNode }) {
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useContenidoNosotros(): ContenidoNosotros {
  const valor = useContext(Contexto);
  const idioma = useIdioma();
  return valor ?? contenidoNosotros(idioma);
}
