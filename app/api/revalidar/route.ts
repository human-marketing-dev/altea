import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { ETIQUETA_SANITY } from "@/lib/sanity/cliente";

/**
 * /api/revalidar — LO QUE LLAMA SANITY AL PUBLICAR (noviembre de 2026).
 *
 * Las páginas que leen de Sanity se arman una vez y se sirven estáticas. Cuando
 * alguien publica en el Studio, el webhook de Sanity (configurado en
 * sanity.io/manage → API → Webhooks) hace POST aquí; esto invalida la etiqueta
 * `sanity` y cada página se vuelve a armar con lo nuevo en su siguiente visita.
 *
 * `"max"`: la visita que llega justo después todavía ve la versión anterior
 * mientras se arma la nueva, y la siguiente ya ve lo publicado. Es lo que
 * recomienda Next: nadie espera a que se arme una página.
 *
 * ⚠ LA FIRMA ES OBLIGATORIA. Sanity firma cada llamada con el secreto del
 * webhook; sin firma válida no se invalida nada, para que nadie de fuera pueda
 * forzar que el sitio se rearme una y otra vez. El mismo secreto va en el
 * servidor como SANITY_REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  const secreto = process.env.SANITY_REVALIDATE_SECRET;
  if (!secreto) {
    console.error("[revalidar] Falta SANITY_REVALIDATE_SECRET en el servidor.");
    return NextResponse.json({ error: "Sin configurar" }, { status: 500 });
  }

  /* `true`: espera unos segundos a que el contenido publicado sea legible en
     la API de Sanity antes de seguir; si no, la página se rearmaría con lo
     anterior. */
  const { isValidSignature, body } = await parseBody<{ _type?: string; _id?: string }>(req, secreto, true);
  if (!isValidSignature) return NextResponse.json({ error: "Firma inválida" }, { status: 401 });

  revalidateTag(ETIQUETA_SANITY, "max");
  return NextResponse.json({ revalidado: true, tipo: body?._type, id: body?._id });
}
