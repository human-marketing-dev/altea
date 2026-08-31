"use server";

/**
 * Recepción de leads del formulario de contacto.
 *
 * ⚠ NO ENTREGA EL LEAD A NADIE TODAVÍA. Valida y lo escribe en el log del
 * servidor, nada más. Antes de publicar hay que conectar el destino real —
 * según el ecosistema digital del brief: CRM para Vivienda, correo de ventas
 * para Comercial, contacto industrial para Industrial. Mientras eso no exista,
 * el formulario le dice al usuario que lo contactarán y nadie lo va a hacer.
 */

export type EstadoLead =
  | { estado: "inicial" }
  | { estado: "error"; errores: Record<string, string> }
  | { estado: "enviado" };

export const ESTADO_LEAD_INICIAL: EstadoLead = { estado: "inicial" };

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function enviarLead(
  _previo: EstadoLead,
  datos: FormData,
): Promise<EstadoLead> {
  // Honeypot: un bot llena todos los campos, incluido el que está oculto.
  // Se le responde éxito para no darle señal de que fue detectado.
  if (String(datos.get("sitio-web") ?? "").trim()) {
    return { estado: "enviado" };
  }

  const texto = (clave: string) => String(datos.get(clave) ?? "").trim();
  const nombre = texto("nombre");
  const correo = texto("correo");
  const telefono = texto("telefono");
  const unidad = texto("unidad");
  const mensaje = texto("mensaje");

  // La validación del cliente es conveniencia; ésta es la que cuenta.
  const errores: Record<string, string> = {};
  if (nombre.length < 2) errores.nombre = "Escribe tu nombre.";
  if (!CORREO.test(correo)) errores.correo = "Revisa tu correo electrónico.";
  if (mensaje.length < 10) errores.mensaje = "Cuéntanos un poco más sobre tu proyecto.";

  if (Object.keys(errores).length > 0) {
    return { estado: "error", errores };
  }

  // TODO: entregar el lead. Hasta entonces solo queda en el log.
  console.info("[lead]", { nombre, correo, telefono, unidad, mensaje });

  return { estado: "enviado" };
}
