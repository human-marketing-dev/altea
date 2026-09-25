import { CONTACTO } from "@/lib/contacto";
import { ICONOS, type NombreIcono } from "./Iconos";
import { LeadForm, type LeadFormProps } from "./LeadForm";
import { SectionHeading } from "./SectionHeading";

export interface DatoContacto {
  texto: string;
  icono?: NombreIcono;
}

export interface CanalContacto {
  /** Para qué sirve el canal: "Renta de locales", "Venta de inmuebles"… */
  nombre: string;
  /** Opcionales a propósito: donde falte el dato se pinta un guion en vez de
      enlazar a un número inventado. */
  telefono?: string;
  correo?: string;
}

export interface LeadCTAProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Líneas de contacto bajo el copy. */
  datos?: readonly DatoContacto[];
  /**
   * Canales con teléfono y correo propios, en rejilla 2×2. Sustituyen a `datos`
   * donde una sola dirección no alcanza — hoy sólo /comercial, que atiende por
   * cuatro vías distintas.
   */
  canales?: readonly CanalContacto[];
  /** Preselecciona la unidad, p. ej. en la página de Industrial. */
  unidadPorDefecto?: LeadFormProps["unidadPorDefecto"];
  className?: string;
}

/**
 * ⚠ HOY SIN CONSUMIDORES. Lo montaban las seis rutas; se sustituyó por
 * <CierreContacto>, que no lleva formulario embebido y manda a /contacto.
 *
 * No se borra porque su prop `canales` resuelve un caso que va a volver —cuatro
 * giros de atención con teléfono y correo, en rejilla 2×2— y porque <LeadForm>,
 * que es lo que monta dentro, sigue vivo en /contacto.
 *
 * Bloque de captación que iba antes del footer en todas las páginas.
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
  canales,
  unidadPorDefecto,
  className,
}: LeadCTAProps) {
  const conCanales = (canales?.length ?? 0) > 0;
  return (
    <section
      id="contacto"
      className={`grid items-start gap-8 bg-surface-card-dark px-(--container-pad) py-(--space-9) lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] ${className ?? ""}`}
    >
      <div className="flex flex-col gap-6">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} tone="light" />
        {conCanales && (
          /*
            Rejilla 2×2 y no una tira de cuatro: apilados, los cuatro grupos con
            sus dos datos suman doce líneas y la columna se alargaba muy por
            debajo del formulario de al lado. En dos columnas las alturas quedan
            parejas y se lee como directorio. En móvil vuelve a una columna,
            donde no hay nada con que descuadrarse.
          */
          <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-6 p-0 sm:grid-cols-2">
            {canales?.map((canal) => (
              <li key={canal.nombre} className="flex flex-col gap-1.5">
                <span className="text-eyebrow font-semibold uppercase tracking-wide text-cream">
                  {canal.nombre}
                </span>
                {(
                  [
                    ["telefono", "Tel", canal.telefono, `tel:${canal.telefono?.replace(/[^+\d]/g, "")}`],
                    ["correo", "Correo", canal.correo, `mailto:${canal.correo}`],
                  ] as const
                ).map(([clave, etiqueta, valor, href]) => (
                  <span key={clave} className="flex items-baseline gap-2 text-body text-cream-60">
                    <span className="shrink-0 text-cream-60">{etiqueta}:</span>
                    {valor ? (
                      <a
                        href={href}
                        /* El hover cambia el SUBRAYADO a coral, no el texto:
                           como texto pequeño el coral se queda en 4.28 sobre
                           este gris y no llega al 4.5. Como línea es un
                           elemento gráfico, le basta 3:1 y le sobra. */
                        className="text-cream underline decoration-1 underline-offset-4 transition-colors hover:decoration-coral hover:decoration-2"
                      >
                        {valor}
                      </a>
                    ) : (
                      /* Sin dato todavía. Un guion y no un enlace muerto: un
                         tel: a un número inventado marca de verdad. */
                      <span aria-label="Pendiente">—</span>
                    )}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        )}

        {!conCanales && datos.length > 0 && (
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
