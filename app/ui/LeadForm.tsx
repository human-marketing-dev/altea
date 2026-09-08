"use client";

import { useActionState, useId } from "react";
import {
  ESTADO_LEAD_INICIAL,
  enviarLead,
  type EstadoLead,
} from "@/app/_actions/enviar-lead";
import { UNIDADES, type Unidad } from "@/lib/contacto";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";

export interface LeadFormProps {
  /** Preselecciona la unidad, p. ej. desde la página de Industrial. */
  unidadPorDefecto?: Unidad;
  className?: string;
}

/**
 * Formulario de captación. La validación del servidor manda: la del navegador
 * es sólo para no hacer ir y venir al usuario.
 */
export function LeadForm({ unidadPorDefecto, className }: LeadFormProps) {
  const [estado, accion, pendiente] = useActionState<EstadoLead, FormData>(
    enviarLead,
    ESTADO_LEAD_INICIAL,
  );
  const id = useId();

  const errores = estado.estado === "error" ? estado.errores : {};
  const errorDe = (campo: string) => errores[campo];

  if (estado.estado === "enviado") {
    return (
      <div
        className={`flex flex-col gap-3 bg-ink p-8 shadow-card ${className ?? ""}`}
        role="status"
      >
        <p className="m-0 font-display text-h3 font-semibold text-cream">
          Gracias, recibimos tu mensaje.
        </p>
        <p className="m-0 text-body leading-relaxed text-cream-60">
          Un asesor de Altea te contactará para revisar tu proyecto.
        </p>
      </div>
    );
  }

  return (
    <form
      action={accion}
      noValidate
      /* `altea-form--on-dark` retiñe los campos desde el contenedor: Input y
             Select se montan en varios sitios y no tiene sentido que cada uno
             tenga que saber sobre qué fondo cayó. */
      className={`altea-form--on-dark flex flex-col gap-4 bg-ink p-6 shadow-card sm:p-8 ${className ?? ""}`}
    >
      {/* Nombre y correo comparten renglón: el formulario es ancho y en una sola
          columna los campos quedaban desproporcionados. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Input
            label="Nombre"
            name="nombre"
            placeholder="Tu nombre"
            autoComplete="name"
            required
            aria-invalid={Boolean(errorDe("nombre"))}
            aria-describedby={errorDe("nombre") ? `${id}-nombre` : undefined}
          />
          {errorDe("nombre") && (
            <p id={`${id}-nombre`} role="alert" className="m-0 mt-1.5 text-small text-cream">
              {errorDe("nombre")}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Correo electrónico"
            name="correo"
            type="email"
            placeholder="tu@correo.com"
            autoComplete="email"
            required
            aria-invalid={Boolean(errorDe("correo"))}
            aria-describedby={errorDe("correo") ? `${id}-correo` : undefined}
          />
          {errorDe("correo") && (
            <p id={`${id}-correo`} role="alert" className="m-0 mt-1.5 text-small text-cream">
              {errorDe("correo")}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Teléfono (opcional)"
          name="telefono"
          type="tel"
          placeholder="81 0000 0000"
          autoComplete="tel"
        />

        <Select label="Unidad de interés" name="unidad" defaultValue={unidadPorDefecto ?? ""}>
          <option value="">Selecciona una</option>
          {UNIDADES.map((unidad) => (
            <option key={unidad} value={unidad}>
              {unidad}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Input
          label="Mensaje"
          name="mensaje"
          as="textarea"
          placeholder="Cuéntanos sobre tu proyecto"
          required
          aria-invalid={Boolean(errorDe("mensaje"))}
          aria-describedby={errorDe("mensaje") ? `${id}-mensaje` : undefined}
        />
        {errorDe("mensaje") && (
          <p id={`${id}-mensaje`} role="alert" className="m-0 mt-1.5 text-small text-cream">
            {errorDe("mensaje")}
          </p>
        )}
      </div>

      {/* Trampa para bots. Fuera de pantalla, no anunciado, no tabulable. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          No llenar
          <input type="text" name="sitio-web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Button type="submit" variant="primary" size="lg" disabled={pendiente} className="self-start">
        {pendiente ? "Enviando…" : "Enviar mensaje"}
      </Button>
    </form>
  );
}
