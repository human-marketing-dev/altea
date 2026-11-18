import { Footer } from "@/app/ui/Footer";
import { LeadForm } from "@/app/ui/LeadForm";
import { NavBar } from "@/app/ui/NavBar";
import { SectionHeading } from "@/app/ui/SectionHeading";
import { CampoBanderola } from "@/app/ui/CampoBanderola";
import type { Unidad } from "@/lib/contacto";
import { datosSitio, enlaceTelefono, enlaceWhatsAppDe, type DatosSitio } from "@/lib/sanity/sitio";
import "../contacto/contacto.css";
import type { Idioma } from "@/lib/idioma";
import { textos } from "@/app/ui/textos";
import type { TextosContacto } from "@/lib/sanity/contacto";


/** Canales directos. Cada uno es un enlace real, no texto suelto. */
/** Los textos propios de la página, en los dos idiomas (noviembre de 2026). */
const TEXTOS = {
  es: {
    titulo: "Hablemos de tu proyecto",
    descripcion:
      "Ya sea comercial, industrial, de vivienda o forestal, cuéntanos qué necesitas y te contactamos a la brevedad.",
    correo: "Correo",
    whatsapp: "WhatsApp",
    whatsappValor: "Escríbenos por WhatsApp",
    telefono: "Teléfono",
  },
  en: {
    titulo: "Let's discuss your project",
    descripcion:
      "Whether commercial, industrial, residential or forestry, tell us what you need and we will contact you shortly.",
    correo: "Email",
    whatsapp: "WhatsApp",
    whatsappValor: "Message us on WhatsApp",
    telefono: "Phone",
  },
};

const canalesDe = (idioma: Idioma, d: DatosSitio, textoWhatsapp?: string) => {
  const t = TEXTOS[idioma];
  return [
    { etiqueta: t.correo, valor: d.correo, href: `mailto:${d.correo}` },
    {
      etiqueta: t.whatsapp,
      valor: textoWhatsapp || t.whatsappValor,
      href: enlaceWhatsAppDe(d, idioma),
      externo: true,
    },
    {
      etiqueta: t.telefono,
      valor: d.telefono,
      href: enlaceTelefono(d.telefono),
    },
  ];
};


/**
 * /contacto en el idioma que se le pida (noviembre de 2026). La montan
 * app/contacto/page.tsx y app/en/contact/page.tsx, que leen `?unidad=` y la ficha
 * antispam y se las pasan.
 */
export async function PaginaContacto({
  idioma = "es",
  unidadPorDefecto,
  ficha,
  editables,
}: {
  idioma?: Idioma;
  unidadPorDefecto?: Unidad;
  ficha: string;
  /** Los textos que vienen de Sanity (lib/sanity/contacto.ts); lo que falte, el de TEXTOS. */
  editables?: TextosContacto;
}) {
  const t = { ...TEXTOS[idioma], ...(editables?.titulo ? { titulo: editables.titulo } : {}), ...(editables?.descripcion ? { descripcion: editables.descripcion } : {}) };
  const datos = await datosSitio();
  const CANALES_DIRECTOS = canalesDe(idioma, datos, editables?.textoWhatsapp);
  return (
    <>
      <NavBar tone="light" />
      <main>
        <section className="cto-hero bg-ink px-(--container-pad) py-(--space-9)">
          <SectionHeading
            as="h1"
            tone="light"
            title={t.titulo}
            description={t.descripcion}
          />
          {/* El terreno de puntos de los cierres, de fondo y sin banderola, con
              su onda coral. */}
          <CampoBanderola className="cto-hero__campo" banderola={false} />
        </section>

        <section className="grid items-start gap-8 bg-surface-page px-(--container-pad) py-(--space-9) lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="m-0 mb-4 font-display text-titulo-bloque text-ink">
                {textos(idioma).contacto.canales}
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
                    {textos(idioma).contacto.domicilio}
                  </span>
                  {/* A la ficha de Altea en Google Maps: ver CANALES.mapa. */}
                  <a
                    href={datos.mapa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body font-medium text-ink underline underline-offset-4 transition-colors hover:text-coral"
                  >
                    {datos.domicilio}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* La ficha antispam: una por petición, firmada con la hora. Ver
              lib/antispam.ts. */}
          <LeadForm
            unidadPorDefecto={unidadPorDefecto}
            tono="claro"
            ficha={ficha}
            exito={{ titulo: editables?.exitoTitulo, texto: editables?.exitoTexto }}
          />
        </section>
      </main>
      <Footer idioma={idioma} />
    </>
  );
}
