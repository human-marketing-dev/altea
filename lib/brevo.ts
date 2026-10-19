/**
 * Envío de correo transaccional por Brevo (API v3, `POST /smtp/email`).
 *
 * SÓLO DE SERVIDOR. La clave vive en `BREVO_API_KEY`, sin el prefijo
 * `NEXT_PUBLIC_`, así que Next no la mete nunca en el bundle del navegador. Este
 * módulo lo importa únicamente la acción de servidor del formulario
 * (app/_actions/enviar-lead.ts); no lo importes desde un componente de cliente.
 *
 * Con `fetch` y no con el SDK de Brevo: es una sola llamada, y el SDK son
 * varias dependencias para armar un JSON.
 *
 * Variables (en .env.local en la RAÍZ del proyecto, y en el hosting):
 *   BREVO_API_KEY           la clave de API v3 (empieza por `xkeysib-`)
 *   BREVO_REMITENTE         correo del remitente; tiene que estar verificado
 *                           en Brevo, o su dominio autenticado
 *   BREVO_REMITENTE_NOMBRE  el nombre que se ve como remitente
 *   CONTACTO_DESTINO        a quién le llega cada mensaje del formulario
 */

const ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export interface Correo {
  para: string;
  asunto: string;
  html: string;
  texto: string;
  /** A quién se responde: el que escribió, no el remitente técnico. */
  responderA?: { email: string; name?: string };
}

export type ResultadoEnvio =
  | { ok: true; id?: string }
  | { ok: false; motivo: string };

/** Lo que falta en el entorno, para decirlo en el log en vez de fallar mudo. */
export function faltantesBrevo(): string[] {
  return ["BREVO_API_KEY", "BREVO_REMITENTE", "CONTACTO_DESTINO"].filter(
    (clave) => !process.env[clave]?.trim(),
  );
}

export async function enviarCorreo(correo: Correo): Promise<ResultadoEnvio> {
  const clave = process.env.BREVO_API_KEY?.trim();
  const remitente = process.env.BREVO_REMITENTE?.trim();
  if (!clave || !remitente) {
    return { ok: false, motivo: `Faltan variables: ${faltantesBrevo().join(", ")}` };
  }

  try {
    const respuesta = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": clave,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          email: remitente,
          name: process.env.BREVO_REMITENTE_NOMBRE?.trim() || "Altea",
        },
        to: [{ email: correo.para }],
        replyTo: correo.responderA,
        subject: correo.asunto,
        htmlContent: correo.html,
        textContent: correo.texto,
      }),
      /* Que un Brevo lento no deje al usuario con «Enviando…» para siempre. */
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    if (!respuesta.ok) {
      /* Brevo responde { code, message }: va al log, nunca al usuario. */
      const cuerpo = await respuesta.text().catch(() => "");
      return { ok: false, motivo: `Brevo ${respuesta.status}: ${cuerpo.slice(0, 300)}` };
    }
    const datos = (await respuesta.json().catch(() => ({}))) as { messageId?: string };
    return { ok: true, id: datos.messageId };
  } catch (error) {
    return { ok: false, motivo: error instanceof Error ? error.message : String(error) };
  }
}
