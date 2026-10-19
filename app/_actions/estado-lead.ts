/**
 * El estado del formulario de contacto, compartido entre la acción de servidor
 * (enviar-lead.ts) y el formulario (app/ui/LeadForm.tsx).
 *
 * Va aparte porque enviar-lead.ts es "use server", y un archivo así sólo puede
 * exportar funciones asíncronas: con la constante dentro, la acción fallaba al
 * cargar («A "use server" file can only export async functions»).
 */

export type EstadoLead =
  | { estado: "inicial" }
  | {
      estado: "error";
      errores: Record<string, string>;
      /*
       * Lo que el usuario escribió, para devolvérselo. React 19 vacía el
       * formulario al terminar cada envío por `action`, también cuando falla:
       * sin esto, un error de validación o de Brevo le borraba el mensaje.
       */
      valores?: Record<string, string>;
    }
  | { estado: "enviado" };

export const ESTADO_LEAD_INICIAL: EstadoLead = { estado: "inicial" };
