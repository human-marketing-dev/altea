import { NextResponse, type NextRequest } from "next/server";

/**
 * Las plantillas de Elementor del sitio viejo: `/?ae_global_templates=…`.
 *
 * El WordPress publicaba cuatro en su sitemap (directorio-locales, locales-grupo,
 * 714, galeria). En el sitio nuevo el parámetro no significa nada y `/` servía
 * el home completo con 200: cuatro copias del home indexables. Aquí se mandan a
 * `/` con un 301 y SIN la query.
 *
 * ⚠ POR QUÉ AQUÍ Y NO EN next.config.ts, donde están las demás redirecciones del
 * sitio viejo: las redirecciones de la configuración mezclan siempre la query
 * original en el destino (lo hace `prepareDestination` de Next), y desde el
 * destino sólo se puede sobrescribir un valor, no quitarlo. Con ellas la URL
 * acababa en `/?ae_global_templates=`, que sigue siendo otra URL con el home.
 *
 * El `matcher` hace que esto corra SÓLO en `/` con ese parámetro: para cualquier
 * otra petición el proxy ni se ejecuta.
 */
export function proxy(request: NextRequest) {
  const destino = request.nextUrl.clone();
  destino.pathname = "/";
  destino.search = "";
  return NextResponse.redirect(destino, 301);
}

export const config = {
  matcher: [
    {
      source: "/",
      has: [{ type: "query", key: "ae_global_templates" }],
    },
  ],
};
