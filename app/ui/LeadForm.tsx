"use client";

import { useActionState, useId } from "react";
import { enviarLead } from "@/app/_actions/enviar-lead";
import { ESTADO_LEAD_INICIAL, type EstadoLead } from "@/app/_actions/estado-lead";
import { UNIDADES, type Unidad } from "@/lib/contacto";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { textos } from "@/app/ui/textos";
import { useIdioma } from "@/app/ui/useIdioma";

export interface LeadFormProps {
  /** Preselecciona la unidad, p. ej. desde la página de Industrial. */
  unidadPorDefecto?: Unidad;
  /**
   * Sobre qué fondo cae. Oscuro en el cierre de contacto de las páginas; claro
   * en /contacto, que lo pone sobre la página. Con el tono equivocado salen
   * campos negros y textos cream sobre claro.
   * @default "oscuro"
   */
  tono?: "oscuro" | "claro";
  /**
   * La ficha antispam firmada con la hora (lib/antispam.ts → emitirFicha). La
   * emite la página en el servidor, en cada petición: SIN ELLA EL SERVIDOR
   * DESCARTA EL ENVÍO como si fuera un bot. Por eso sólo puede ir en una página
   * dinámica, como /contacto: en una estática quedaría congelada en el build.
   */
  ficha?: string;
  className?: string;
}

/**
 * Formulario de captación. La validación del servidor manda: la del navegador
 * es sólo para no hacer ir y venir al usuario.
 */
export function LeadForm({
  unidadPorDefecto,
  tono = "oscuro",
  ficha = "",
  className,
}: LeadFormProps) {
  const idioma = useIdioma();
  const tx = textos(idioma);
  const f = tx.formulario;
  const [estado, accion, pendiente] = useActionState<EstadoLead, FormData>(
    enviarLead,
    ESTADO_LEAD_INICIAL,
  );
  const id = useId();

  const errores = estado.estado === "error" ? estado.errores : {};
  const errorDe = (campo: string) => errores[campo];
  /* Lo escrito vuelve como valor por defecto: ver `valores` en enviar-lead.ts. */
  const valores = estado.estado === "error" ? (estado.valores ?? {}) : {};
  const oscuro = tono === "oscuro";
  /* El texto de los mensajes de error y de envío, según el fondo. */
  const textoError = oscuro ? "text-cream" : "text-coral-dark";

  if (estado.estado === "enviado") {
    return (
      <div
        className={`flex flex-col gap-3 ${className ?? ""}`}
        role="status"
      >
        <p
          className={`m-0 font-display text-titulo-bloque ${oscuro ? "text-cream" : "text-ink"}`}
        >
          {f.gracias}
        </p>
        <p
          className={`m-0 text-body leading-relaxed ${oscuro ? "text-cream-60" : "text-ink-70"}`}
        >
          {f.gracias2}
        </p>
      </div>
    );
  }

  return (
    <form
      action={accion}
      noValidate
      /* Sin tarjeta: fondo, sombra y padding se van juntos, que es lo
             que la hacía tarjeta. `altea-form--on-dark` retiñe los campos desde
             el contenedor: Input y Select se montan en varios sitios y no tiene
             sentido que cada uno tenga que saber sobre qué fondo cayó. En
             claro no lleva clase: los campos ya son claros por defecto. */
      className={`${oscuro ? "altea-form--on-dark " : ""}flex flex-col gap-4 ${className ?? ""}`}
    >
      {/* Nombre y correo comparten renglón: el formulario es ancho y en una sola
          columna los campos quedaban desproporcionados. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Input
            label={f.nombre}
            name="nombre"
            placeholder={f.nombrePista}
            autoComplete="name"
            defaultValue={valores.nombre}
            required
            aria-invalid={Boolean(errorDe("nombre"))}
            aria-describedby={errorDe("nombre") ? `${id}-nombre` : undefined}
          />
          {errorDe("nombre") && (
            <p id={`${id}-nombre`} role="alert" className={`m-0 mt-1.5 text-small ${textoError}`}>
              {errorDe("nombre")}
            </p>
          )}
        </div>

        <div>
          <Input
            label={f.correo}
            name="correo"
            type="email"
            placeholder={f.correoPista}
            autoComplete="email"
            defaultValue={valores.correo}
            required
            aria-invalid={Boolean(errorDe("correo"))}
            aria-describedby={errorDe("correo") ? `${id}-correo` : undefined}
          />
          {errorDe("correo") && (
            <p id={`${id}-correo`} role="alert" className={`m-0 mt-1.5 text-small ${textoError}`}>
              {errorDe("correo")}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Input
            label={f.telefono}
            name="telefono"
            type="tel"
            placeholder="81 0000 0000"
            autoComplete="tel"
            defaultValue={valores.telefono}
            aria-invalid={Boolean(errorDe("telefono"))}
            aria-describedby={errorDe("telefono") ? `${id}-telefono` : undefined}
          />
          {errorDe("telefono") && (
            <p id={`${id}-telefono`} role="alert" className={`m-0 mt-1.5 text-small ${textoError}`}>
              {errorDe("telefono")}
            </p>
          )}
        </div>

        <Select
          label={f.unidad}
          name="unidad"
          defaultValue={valores.unidad ?? unidadPorDefecto ?? ""}
        >
          <option value="">{f.unidadElegir}</option>
          {UNIDADES.map((unidad) => (
            <option key={unidad} value={unidad}>
              {tx.nav[unidad.toLowerCase() as "comercial" | "industrial" | "vivienda" | "forestal"]}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Input
          label={f.mensaje}
          name="mensaje"
          as="textarea"
          placeholder={f.mensajePista}
          required
          defaultValue={valores.mensaje}
          aria-invalid={Boolean(errorDe("mensaje"))}
          aria-describedby={errorDe("mensaje") ? `${id}-mensaje` : undefined}
        />
        {errorDe("mensaje") && (
          <p id={`${id}-mensaje`} role="alert" className={`m-0 mt-1.5 text-small ${textoError}`}>
            {errorDe("mensaje")}
          </p>
        )}
      </div>

      <input type="hidden" name="ficha" value={ficha} />
      {/* Para que los avisos del servidor vuelvan en el idioma de la página. */}
      <input type="hidden" name="idioma" value={idioma} />

      {/* Trampa para bots. Fuera de pantalla, no anunciado, no tabulable. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          {f.noLlenar}
          <input type="text" name="sitio-web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* El fallo de envío (Brevo caído o sin configurar): no es de un campo. */}
      {errorDe("envio") && (
        <p role="alert" className={`m-0 text-small ${textoError}`}>
          {errorDe("envio")}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={pendiente} className="self-start">
        {pendiente ? f.enviando : f.enviar}
      </Button>
    </form>
  );
}
