import { CONTACTO } from "@/lib/contacto";
import { LeadForm, type LeadFormProps } from "./LeadForm";
import { SectionHeading } from "./SectionHeading";

export interface LeadCTAProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Líneas de contacto bajo el copy. */
  datos?: readonly string[];
  /** Preselecciona la unidad, p. ej. en la página de Industrial. */
  unidadPorDefecto?: LeadFormProps["unidadPorDefecto"];
  className?: string;
}

/**
 * Bloque de captación que va antes del footer en todas las páginas.
 *
 * Se estiliza con utilidades, no con una hoja de página: así se puede montar
 * en cualquier ruta sin arrastrar un CSS que no le corresponde.
 *
 * Fondo cream a propósito — arriba suele haber una sección oscura y abajo el
 * footer en ink; en oscuro se fundiría con los dos.
 */
export function LeadCTA({
  eyebrow = CONTACTO.eyebrow,
  title = CONTACTO.title,
  description = CONTACTO.description,
  datos = CONTACTO.datos,
  unidadPorDefecto,
  className,
}: LeadCTAProps) {
  return (
    <section
      id="contacto"
      className={`grid items-start gap-8 bg-surface-page px-(--container-pad) py-(--space-9) lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] ${className ?? ""}`}
    >
      <div className="flex flex-col gap-6">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        {datos.length > 0 && (
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-body text-ink-70">
            {datos.map((dato) => (
              <li key={dato}>{dato}</li>
            ))}
          </ul>
        )}
      </div>
      <LeadForm unidadPorDefecto={unidadPorDefecto} />
    </section>
  );
}
