"use server";

import { enviarCorreo, faltantesBrevo } from "@/lib/brevo";
import { CANALES, UNIDADES } from "@/lib/contacto";
import type { EstadoLead } from "./estado-lead";

/**
 * Recepción de leads del formulario de contacto.
 *
 * ENTREGA POR CORREO, VÍA BREVO (octubre de 2026): cada mensaje válido llega a
 * CONTACTO_DESTINO con el «Responder» apuntando a quien escribió, así que
 * contestar es darle a responder. Ver lib/brevo.ts para las variables.
 *
 * ⚠ UN SOLO DESTINO PARA LAS CUATRO UNIDADES. El brief habla de repartir —CRM
 * para Vivienda, ventas para Comercial, contacto industrial para Industrial—;
 * cuando existan esos destinos, se elige aquí por `unidad`.
 *
 * Si Brevo falla, el usuario NO ve «gracias»: ve el error con el correo y el
 * WhatsApp para que no se pierda el contacto. Decirle que lo contactarán cuando
 * el mensaje no salió es lo peor que puede hacer un formulario.
 */

/*
 * El tipo y el estado inicial viven en estado-lead.ts: un archivo "use server"
 * sólo puede exportar funciones asíncronas, y la constante aquí rompía la
 * acción en tiempo de ejecución (el build no lo detecta; `next dev` sí).
 */

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Topes para que nadie use el formulario para mandar novelas o basura. */
const MAX = { nombre: 120, correo: 200, telefono: 40, mensaje: 5000 };

/** Lo que escribió el usuario va dentro de HTML: se escapa siempre. */
const escapar = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export async function enviarLead(
  _previo: EstadoLead,
  datos: FormData,
): Promise<EstadoLead> {
  // Honeypot: un bot llena todos los campos, incluido el que está oculto.
  // Se le responde éxito para no darle señal de que fue detectado.
  if (String(datos.get("sitio-web") ?? "").trim()) {
    return { estado: "enviado" };
  }

  const texto = (clave: keyof typeof MAX | "unidad") =>
    String(datos.get(clave) ?? "").trim();
  const nombre = texto("nombre");
  const correo = texto("correo");
  const telefono = texto("telefono");
  const unidadCruda = texto("unidad");
  const mensaje = texto("mensaje");
  /* Sólo una de las cuatro: el select se puede manipular desde el navegador. */
  const unidad = UNIDADES.find((u) => u === unidadCruda);

  // La validación del cliente es conveniencia; ésta es la que cuenta.
  const errores: Record<string, string> = {};
  if (nombre.length < 2) errores.nombre = "Escribe tu nombre.";
  else if (nombre.length > MAX.nombre) errores.nombre = "El nombre es demasiado largo.";
  if (!CORREO.test(correo) || correo.length > MAX.correo)
    errores.correo = "Revisa tu correo electrónico.";
  if (telefono.length > MAX.telefono) errores.telefono = "Revisa tu teléfono.";
  if (mensaje.length < 10) errores.mensaje = "Cuéntanos un poco más sobre tu proyecto.";
  else if (mensaje.length > MAX.mensaje)
    errores.mensaje = `El mensaje es demasiado largo (máximo ${MAX.mensaje} caracteres).`;

  const valores = { nombre, correo, telefono, unidad: unidad ?? "", mensaje };

  if (Object.keys(errores).length > 0) {
    return { estado: "error", errores, valores };
  }

  const destino = process.env.CONTACTO_DESTINO?.trim();
  const faltan = faltantesBrevo();
  if (!destino || faltan.length) {
    console.error("[lead] Brevo sin configurar; faltan:", faltan.join(", "));
    return errorDeEnvio(valores);
  }

  const fecha = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Monterrey",
  }).format(new Date());

  const filas: [string, string][] = [
    ["Nombre", nombre],
    ["Correo", correo],
    ["Teléfono", telefono || "—"],
    ["Unidad de interés", unidad ?? "Sin especificar"],
    ["Fecha", fecha],
  ];

  const html = `<!doctype html><html lang="es"><body style="margin:0;padding:24px;background:#F5F5F3;font-family:Arial,Helvetica,sans-serif;color:#212222">
<table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;padding:28px">
<tr><td>
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#C2493D">Formulario de contacto · alteadesarrollos.com</p>
<h1 style="margin:0 0 20px;font-size:22px;line-height:1.3">Nuevo mensaje de ${escapar(nombre)}</h1>
<table role="presentation" width="100%" style="border-collapse:collapse;font-size:15px">
${filas
  .map(
    ([k, v]) =>
      `<tr><td style="padding:8px 12px 8px 0;border-top:1px solid #e6e6e3;color:#6b6c6c;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:8px 0;border-top:1px solid #e6e6e3">${
        k === "Correo"
          ? `<a href="mailto:${escapar(v)}" style="color:#212222">${escapar(v)}</a>`
          : escapar(v)
      }</td></tr>`,
  )
  .join("\n")}
</table>
<h2 style="margin:24px 0 8px;font-size:15px">Mensaje</h2>
<p style="margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap">${escapar(mensaje)}</p>
<p style="margin:28px 0 0;font-size:13px;color:#6b6c6c">Para contestar, responde a este correo: va directo a ${escapar(correo)}.</p>
</td></tr></table></body></html>`;

  const textoPlano = [
    "Nuevo mensaje desde el formulario de contacto de alteadesarrollos.com",
    "",
    ...filas.map(([k, v]) => `${k}: ${v}`),
    "",
    "Mensaje:",
    mensaje,
    "",
    `Para contestar, responde a este correo: va directo a ${correo}.`,
  ].join("\n");

  const resultado = await enviarCorreo({
    para: destino,
    /* La unidad primero: es lo que se usa para repartir en la bandeja. */
    asunto: `Nuevo contacto web · ${unidad ?? "Sin unidad"} · ${nombre}`,
    html,
    texto: textoPlano,
    responderA: { email: correo, name: nombre },
  });

  if (!resultado.ok) {
    /* El motivo técnico al log del servidor; el usuario no lo necesita. */
    console.error("[lead] Brevo no entregó el mensaje:", resultado.motivo);
    return errorDeEnvio(valores);
  }

  return { estado: "enviado" };
}

/** El fallo de envío, con los canales directos para que el contacto no se pierda. */
function errorDeEnvio(valores: Record<string, string>): EstadoLead {
  return {
    estado: "error",
    valores,
    errores: {
      envio: `No pudimos enviar tu mensaje. Inténtalo de nuevo en unos minutos, o escríbenos a ${CANALES.correo} o por WhatsApp.`,
    },
  };
}
