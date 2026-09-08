import { CONTACTO } from "@/lib/contacto";
import { ICONOS, type NombreIcono } from "./Iconos";
import { LeadForm, type LeadFormProps } from "./LeadForm";
import { SectionHeading } from "./SectionHeading";

export interface DatoContacto {
  texto: string;
  icono?: NombreIcono;
}

export interface LeadCTAProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Líneas de contacto bajo el copy. */
  datos?: readonly DatoContacto[];
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
 * Fondo --surface-card-dark y no ink: el footer que va justo debajo es ink, y
 * en ink los dos bloques se leían como una sola mancha oscura. Con el gris de
 * tarjeta la sección se despega del footer sin dejar de ser oscura, y no hay
 * que tocar el footer —que es el mismo en las seis rutas—.
 *
 * Eso obliga a invertir el par dentro: si la sección toma el tono de tarjeta,
 * la tarjeta del formulario tiene que irse a ink o desaparecería contra el
 * fondo. Son los dos mismos tokens, al revés.
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
      className={`grid items-start gap-8 bg-surface-card-dark px-(--container-pad) py-(--space-9) lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] ${className ?? ""}`}
    >
      <div className="flex flex-col gap-6">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} tone="light" />
        {datos.length > 0 && (
          <ul className="m-0 flex list-none flex-col gap-3 p-0 text-body text-cream-60">
            {datos.map((dato) => (
              /* `items-start` y no `center`: el domicilio puede irse a dos
                 líneas y el icono se descolgaría al medio del bloque. El margen
                 lo sube al centro óptico de la PRIMERA línea. */
              <li key={dato.texto} className="flex items-start gap-2">
                {dato.icono && (
                  <span className="mt-[calc((1lh-16px)/2)] block size-4 shrink-0 text-coral [&>svg]:size-full">
                    {ICONOS[dato.icono]}
                  </span>
                )}
                <span>{dato.texto}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <LeadForm unidadPorDefecto={unidadPorDefecto} />
    </section>
  );
}
