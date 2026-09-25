import { CANALES, enlaceWhatsApp } from "@/lib/contacto";
import type { Unidad } from "@/lib/contacto";
import { MediaSlot } from "./MediaSlot";
import { SectionHeading } from "./SectionHeading";

export interface CierreContactoProps {
  eyebrow: string;
  title: string;
  /** El recorte del casco. Sin `src`, <MediaSlot> pinta el hueco etiquetado. */
  image?: string;
  /**
   * Preselecciona la unidad en /contacto, igual que hacía el formulario. En el
   * home no se pasa: ahí no hay unidad de la que venir.
   */
  unidad?: Unidad;
}

/**
 * Bloque que cierra TODAS las páginas.
 *
 * Sustituyó a <LeadCTA>, que llevaba el formulario embebido en las seis rutas.
 * Aquí no hay formulario: hay dos salidas —WhatsApp y la página de contacto— y
 * el formulario vive donde corresponde, en /contacto.
 *
 * Conserva el id="contacto" que tenía aquél: es el ancla de la página y el
 * selector que usan motion.css y RevealOnScroll para la aparición al scroll.
 */
export function CierreContacto({
  eyebrow,
  title,
  image,
  unidad,
}: CierreContactoProps) {
  const contacto = unidad
    ? `/contacto?unidad=${unidad.toLowerCase()}`
    : "/contacto";

  return (
    <section id="contacto" className="altea-cierre">
      <div className="altea-cierre__media">
        <MediaSlot
          label="Imagen de sección"
          src={image}
          alt=""
          tone="dark"
          /* La proporción exacta del archivo (2430×2475). Con un 4/3, `cover` se
             comía un 26% del alto — y el recorte llega hasta el borde superior e
             inferior, así que cortaba al sujeto. Así no recorta nada. */
          ratio="2430 / 2475"
          sizes="(max-width: 900px) 100vw, 45vw"
        />
      </div>

      <div className="altea-cierre__body">
        <SectionHeading tone="light" eyebrow={eyebrow} title={title} />

        <div className="altea-cierre__acciones">
          <a
            className="altea-btn altea-btn--primary altea-btn--lg"
            href={enlaceWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Contáctanos por WhatsApp
            <span className="altea-btn__arrow" aria-hidden="true">
              →
            </span>
          </a>

          {/* La segunda salida. `altea-btn` sólo por las medidas; el color lo
              pone la clase de la sección, porque los contornos del sistema están
              pensados para superficies claras y ésta es ink. */}
          <a
            className="altea-btn altea-btn--lg altea-cierre__secundario"
            href={contacto}
          >
            Ir a contacto
            <span className="altea-btn__arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>

        {/* El correo, como tercera vía sin botón: quien prefiere escribir no
            tiene que abrir otra página para encontrarlo. */}
        <a className="altea-cierre__correo" href={`mailto:${CANALES.correo}`}>
          {CANALES.correo}
        </a>
      </div>
    </section>
  );
}
