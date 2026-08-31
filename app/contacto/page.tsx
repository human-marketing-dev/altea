import type { Metadata } from "next";
import Link from "next/link";
import { Footer, LeadForm, NavBar, SectionHeading } from "@/app/ui";
import { CANALES, enlaceWhatsApp, unidadDesdeSlug } from "@/lib/contacto";

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

const UNIDADES_ENLACE = [
  { nombre: "Comercial", slug: "comercial", nota: "Renta de locales, islas y espacios publicitarios" },
  { nombre: "Industrial", slug: "industrial", nota: "Naves, parques industriales y máster plan" },
  { nombre: "Vivienda", slug: "vivienda", nota: "Desarrollos residenciales" },
  { nombre: "Forestal", slug: "forestal", nota: "Viveros, teca y servicios forestales" },
];

export default async function Contacto({ searchParams }: PageProps<"/contacto">) {
  // El footer enlaza a /contacto?unidad=comercial: se respeta y se preselecciona.
  const { unidad } = await searchParams;
  const unidadPorDefecto = unidadDesdeSlug(unidad);

  return (
    <>
      <NavBar tone="light" />
      <main>
        <section className="bg-ink px-(--container-pad) py-(--space-9)">
          <SectionHeading
            as="h1"
            tone="light"
            eyebrow="Contacto"
            title="Hablemos de tu proyecto"
            description="Ya sea comercial, industrial, de vivienda o forestal, cuéntanos qué necesitas y te contactamos a la brevedad."
          />
        </section>

        <section className="grid items-start gap-8 bg-surface-page px-(--container-pad) py-(--space-9) lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="m-0 mb-4 font-display text-h3 font-semibold text-ink">
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

            <div>
              <h2 className="m-0 mb-4 font-display text-h3 font-semibold text-ink">
                Por unidad de negocio
              </h2>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {UNIDADES_ENLACE.map((unidadEnlace) => (
                  <li
                    key={unidadEnlace.slug}
                    className="border-t border-border-subtle pt-3"
                  >
                    <Link
                      href={`/${unidadEnlace.slug}`}
                      className="text-body font-semibold text-ink underline underline-offset-4 transition-colors hover:text-coral"
                    >
                      {unidadEnlace.nombre}
                    </Link>
                    <p className="m-0 text-small text-ink-70">{unidadEnlace.nota}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <LeadForm unidadPorDefecto={unidadPorDefecto} />
        </section>
      </main>
      <Footer />
    </>
  );
}
