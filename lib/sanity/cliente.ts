import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

/**
 * LA LECTURA DE SANITY PARA EL SITIO (noviembre de 2026).
 *
 * Sin token: el dataset es público, como todos los de Sanity por defecto, y el
 * sitio sólo lee contenido publicado. El token de escritura (SANITY_API_TOKEN)
 * es sólo del script de migración y no va al servidor.
 *
 * SIN CDN DE SANITY y CON LA CACHÉ DE NEXT: cada página se arma una vez, en el
 * build o al regenerarse, y se sirve estática. Lo que la mantiene al día no es
 * un tiempo de caducidad sino el webhook: al publicar en el Studio, Sanity
 * llama a /api/revalidar, que invalida la etiqueta `sanity` y las páginas se
 * vuelven a armar con lo nuevo. Ver app/api/revalidar/route.ts.
 */
export const cliente = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});

/** La etiqueta de caché de todo lo que viene de Sanity. Una sola: el sitio es chico. */
export const ETIQUETA_SANITY = "sanity";

/**
 * Una consulta GROQ, cacheada por Next con la etiqueta de Sanity.
 *
 * ⚠ SI SANITY NO RESPONDE, FALLA. En el build eso detiene el despliegue, que es
 * lo correcto: un sitio armado con el contenido de respaldo del código
 * enseñaría textos viejos sin que nadie se enterara. Al regenerar una página ya
 * publicada, Next conserva la versión anterior si esto falla.
 */
export function consultar<T>(consulta: string, parametros: Record<string, unknown> = {}): Promise<T> {
  return cliente.fetch<T>(consulta, parametros, {
    cache: "force-cache",
    next: { tags: [ETIQUETA_SANITY] },
  });
}
