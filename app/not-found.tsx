import type { Metadata } from "next";
import { Pagina404 } from "./_404/Pagina404";

/**
 * Toda URL que no existe, en español. Sustituye a la de Next, que era un
 * callejón en inglés sin barra ni pie. Las de /en tienen la suya en inglés:
 * ver app/en/not-found.tsx.
 */
export const metadata: Metadata = {
  title: "404 — Altea",
};

export default function NotFound() {
  return <Pagina404 idioma="es" />;
}
