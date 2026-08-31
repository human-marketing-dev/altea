import type { Metadata } from "next";
import { MapaProyectos } from "@/app/ui";
import {
  ESTADOS_CON_PRESENCIA,
  PRESENCIA_INTERNACIONAL,
  PROYECTOS,
} from "@/lib/proyectos";

export const metadata: Metadata = {
  title: "Demo — Mapa de proyectos",
};

export default function MapaDemo() {
  return (
    <main className="min-h-screen bg-ink px-(--container-pad) py-16">
      <h1 className="mb-8 font-display text-h1 font-semibold text-cream">
        Mapa de proyectos — demo
      </h1>
      <MapaProyectos
        proyectos={PROYECTOS}
        estadosConPresencia={ESTADOS_CON_PRESENCIA}
        paisesAdicionales={PRESENCIA_INTERNACIONAL}
      />
    </main>
  );
}
