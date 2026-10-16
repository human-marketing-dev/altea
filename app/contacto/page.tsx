import type { Metadata } from "next";
import { Footer, LeadForm, NavBar, SectionHeading } from "@/app/ui";
import { CampoBanderola } from "@/app/ui/CampoBanderola";
import { CANALES, enlaceWhatsApp, unidadDesdeSlug } from "@/lib/contacto";
import "./contacto.css";

export const metadata: Metadata = {
  title: "Contacto — Altea",
  description:
    "Escríbenos para revisar superficie, ubicación y tiempos de tu proyecto comercial, industrial, de vivienda o forestal.",
};

/** Canales directos. Cada uno es un enlace real, no texto suelto. */
const CANALES_DIRECTOS = [
  {
    etiqueta: "Correo",
    valor: CANALES.correo,
    href: `mailto:${CANALES.correo}`,
  },
  {
    etiqueta: "WhatsApp",
    valor: "Escríbenos por WhatsApp",
    href: enlaceWhatsApp(),
    externo: true,
  },
  {
    etiqueta: "Teléfono",
    valor: CANALES.telefono,
    href: `tel:${CANALES.telefono.replace(/\s/g, "")}`,
  },
];

export default async function Contacto({ searchParams }: PageProps<"/contacto">) {
  // El footer enlaza a …/contacto?unidad=comercial: se respeta y se preselecciona.
  const { unidad } = await searchParams;
  const unidadPorDefecto = unidadDesdeSlug(unidad);

  return (
    <>
      <NavBar tone="light" />
      <main>
        <section className="cto-hero bg-ink px-(--container-pad) py-(--space-9)">
          <SectionHeading
            as="h1"
            tone="light"
            title="Hablemos de tu proyecto"
            description="Ya sea comercial, industrial, de vivienda o forestal, cuéntanos qué necesitas y te contactamos a la brevedad."
          />
          {/* El terreno de puntos de los cierres, de fondo y sin banderola, con
              su onda coral. */}
          <CampoBanderola className="cto-hero__campo" banderola={false} />
        </section>

        <section className="grid items-start gap-8 bg-surface-page px-(--container-pad) py-(--space-9) lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="m-0 mb-4 font-display text-titulo-bloque text-ink">
                Canales directos
              </h2>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {CANALES_DIRECTOS.map((canal) => (
                  <li
                    key={canal.etiqueta}
                    className="flex flex-col gap-0.5 border-t border-border-subtle pt-3"
                  >
                    <span className="text-eyebrow font-semibold uppercase tracking-wide text-ink-70">
                      {canal.etiqueta}
                    </span>
                    <a
                      href={canal.href}
                      {...(canal.externo
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-body font-medium text-ink underline underline-offset-4 transition-colors hover:text-coral"
                    >
                      {canal.valor}
                    </a>
                  </li>
                ))}
                <li className="flex flex-col gap-0.5 border-t border-border-subtle pt-3">
                  <span className="text-eyebrow font-semibold uppercase tracking-wide text-ink-70">
                    Domicilio
                  </span>
                  <span className="text-body text-ink">{CANALES.domicilio}</span>
                </li>
              </ul>
            </div>
          </div>

          <LeadForm unidadPorDefecto={unidadPorDefecto} tono="claro" />
        </section>
      </main>
      <Footer />
    </>
  );
}
