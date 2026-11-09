import Link from "next/link";
import { Footer } from "@/app/ui/Footer";
import { NavBar } from "@/app/ui/NavBar";
import { SectionHeading } from "@/app/ui/SectionHeading";
import { textos } from "@/app/ui/textos";
import { rutaDe, type Idioma } from "@/lib/idioma";
import "./pagina404.css";

/**
 * La 404 del sitio (noviembre de 2026), con barra y pie, en los dos idiomas:
 * /en/lo-que-sea sale en inglés y lo demás en español.
 *
 * ⚠ EL IDIOMA LO DECIDE EL SERVIDOR, NO LA URL EN EL NAVEGADOR. Se probó
 * eligiéndolo en el cliente y fallaba: la 404 de la raíz se genera una sola vez
 * en el build, en español, y al abrir /en/lo-que-sea React encontraba inglés
 * donde el HTML traía español (error de hidratación #418). Por eso hay dos:
 * app/not-found.tsx en español, y app/en/not-found.tsx en inglés, a la que se
 * llega por el comodín app/en/[...resto] y que va dentro del layout de /en,
 * con su `lang`.
 *
 * La cabecera es la de las páginas legales y Contacto: <SectionHeading> sobre
 * ink. Dos salidas, el inicio y contacto; el resto del sitio está en la barra y
 * en el pie.
 */
export function Pagina404({ idioma }: { idioma: Idioma }) {
  const t = textos(idioma).noEncontrada;

  return (
    <>
      <NavBar tone="light" />
      <main>
        <section className="p404 bg-ink px-(--container-pad) py-(--space-9)">
          <SectionHeading
            as="h1"
            tone="light"
            eyebrow={t.eyebrow}
            title={t.titulo}
            description={t.descripcion}
          />
          <div className="p404__acciones">
            <Link className="altea-btn altea-btn--primary altea-btn--lg" href={rutaDe("/", idioma)}>
              {t.inicio}
              <span className="altea-btn__arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link className="altea-btn altea-btn--ghost p404__secundario" href={rutaDe("/contacto", idioma)}>
              {t.contacto}
              <span className="altea-btn__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </section>
      </main>
      <Footer idioma={idioma} />
    </>
  );
}
