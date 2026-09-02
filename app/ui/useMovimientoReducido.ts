"use client";

import { useSyncExternalStore } from "react";

/**
 * `prefers-reduced-motion` como fuente externa suscrita, no como estado que se
 * fija dentro de un efecto: así no hay render en cascada y además reacciona si
 * el usuario cambia la preferencia con la página abierta.
 * El snapshot de servidor es `false` para que el HTML no dependa del cliente.
 */
export function useMovimientoReducido() {
  return useSyncExternalStore(
    (alCambiar) => {
      const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
      consulta.addEventListener("change", alCambiar);
      return () => consulta.removeEventListener("change", alCambiar);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
