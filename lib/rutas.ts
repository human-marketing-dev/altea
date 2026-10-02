/**
 * Prefijo de las rutas internas. Hoy vacío: el sitio vive en la raíz.
 *
 * Estuvo en "/plantilla" mientras el diseño se guardaba sin aprobar, y la
 * indirección se queda puesta justamente porque eso puede volver a pasar.
 * Todos los enlaces internos pasan por `ruta()` en vez de escribir el href a
 * pelo, así que MOVER EL SITIO ES CAMBIAR ESTA LÍNEA:
 *
 *   · en la raíz del sitio (ahora)      → BASE = ""
 *   · bajo un subárbol                  → BASE = "/plantilla", y mover
 *                                         app/{page.tsx,_home,...} a app/plantilla/
 *
 * Si estuviera escrito en cada href habría que tocar los veinte sitios que la
 * lista de abajo enumera.
 *
 * ⚠ SI VUELVE A TENER VALOR, hay que revisar `app/robots.ts`: su `disallow`
 * cierra hoy el sitio completo y entonces tendría que cerrar solo el subárbol.
 */
export const BASE = "";

/**
 * `ruta("/nosotros")` → `/nosotros`, y `ruta("/")` → `/`.
 *
 * La raíz se trata aparte a propósito. Con BASE vacío el caso es trivial, pero
 * con un prefijo concatenar daría `/plantilla/`, y con la barra final pasan dos
 * cosas malas: Next responde un 308 hacia la versión sin barra —`trailingSlash`
 * está en su valor por defecto— y `usePathname()` devuelve `/plantilla`, así que
 * el `aria-current` de la barra nunca coincidiría con el enlace de Inicio.
 */
export const ruta = (camino: string) =>
  camino === "/" ? BASE || "/" : `${BASE}${camino}`;
