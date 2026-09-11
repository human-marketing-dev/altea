import type { Metadata } from "next";
import { MapaProyectos } from "@/app/ui";
import { ESTADOS_CON_PRESENCIA } from "@/lib/proyectos";

/*
 * Ruta sólo de desarrollo. El archivo se llama `page.dev.tsx` y `pageExtensions`
 * en next.config.ts únicamente incluye `dev.tsx` cuando NODE_ENV es development:
 * en producción Next ni siquiera lo reconoce como página, así que no entra en el
 * build en vez de entrar y devolver un 404.
 */
export const metadata: Metadata = {
  title: "Demo — Mapa de proyectos",
};

export default function MapaDemo() {
  return (
    <main className="min-h-screen bg-ink px-(--container-pad) py-16">
      <h1 className="mb-8 font-display text-h1 font-semibold text-cream">
        Mapa de proyectos — demo
      </h1>
      <MapaProyectos estadosConPresencia={ESTADOS_CON_PRESENCIA} />
    </main>
  );
}
