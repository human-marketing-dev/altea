import type { Metadata } from "next";
import { preload } from "react-dom";
import { contenidoHome } from "@/app/_home/contenido";
import { metadatosDe, type Idioma } from "@/lib/idioma";
import { CierreContacto } from "@/app/ui/CierreContacto";
import { Footer } from "@/app/ui/Footer";
import { NavBar } from "@/app/ui/NavBar";
import { Atributos } from "./Atributos";
import { CarruselProyectos } from "./CarruselProyectos";
import { CierreUnidad } from "./CierreUnidad";
import { HeroCalado } from "./HeroCalado";
import { LineasNegocio } from "./LineasNegocio";
import { MuroMarcas } from "./MuroMarcas";
import { OtrosGiros } from "./OtrosGiros";
import { ProximosProyectos } from "./ProximosProyectos";
import type { ContenidoUnidad } from "./tipos";
import "./unidad.css";

/**
 * La página de una unidad de negocio. Una sola para las cuatro.
 *
 * /comercial, /industrial, /vivienda y /forestal son esta página con distinto
 * contenido —contenido/<unidad>.ts—, y cada ruta es un archivo de cuatro líneas
 * que se lo pasa. Mismas secciones, mismo orden, mismo movimiento.
 *
 * ⚠ NO SE COPIA PARA UNA UNIDAD. Si una necesita algo distinto, se resuelve
 * como dato del contenido o se habla antes: la primera copia separa las páginas
 * para siempre.
 *
 * ⚠ Y LAS RUTAS SON EXPLÍCITAS A PROPÓSITO, no un `app/[unidad]/page.tsx`: un
 * segmento dinámico en la raíz capturaría cualquier ruta inexistente y
 * renderizaría una página de unidad vacía en vez de un 404.
 *
 * Cada sección con lista vacía no se monta (ver tipos.ts). Hoy eso deja a
 * Industrial, Vivienda y Forestal con menos secciones que Comercial: es lo que
 * hay de contenido, no un recorte de la estructura.
 */
export function PaginaUnidad({
  contenido,
  idioma = "es",
}: {
  contenido: ContenidoUnidad;
  /** El de la página: lo pasan app/<unidad>/page.tsx y app/en/<unit>/page.tsx. */
  idioma?: Idioma;
}) {
  const { CONTACT_CTA } = contenidoHome(idioma);
  const {
    hero,
    cifras,
    atributos,
    lineas,
    proyectos,
    giros,
    marcas,
    proximos,
    unidad,
    cierre,
  } = contenido;
  /*
   * LA PRIMERA FOTO DEL HERO, PEDIDA DESDE EL HTML. <HeroCalado> la pone como
   * fondo por JavaScript, así que sin esto el navegador no se enteraba de que
   * existía hasta hidratar: 7 a 10 s de «retraso de carga» del LCP en las
   * cuatro unidades. Es la misma URL que pinta el componente —el archivo
   * crudo, sin optimizador: ver ZOOM en HeroCalado— y la misma para sus tres
   * capas, así que se ve idéntica y no toca la entrada del hero.
   */
  if (hero.fotos[0]) preload(hero.fotos[0].foto, { as: "image", fetchPriority: "high" });
  return (
    <>
      {/* El `aria-current` lo pone <NavBar> comparando el enlace con
          usePathname: no hay que pasarlo. */}
      <NavBar tone="light" />
      <main>
        <HeroCalado hero={hero} cifras={cifras} />
        {atributos && atributos.length > 0 && (
          <Atributos atributos={atributos} unidad={unidad} color={hero.color} />
        )}
        {lineas && lineas.length > 0 && (
          <LineasNegocio lineas={lineas} color={hero.color} idioma={idioma} />
        )}
        {proyectos.lista.length > 0 && <CarruselProyectos proyectos={proyectos} />}
        {giros.bloques.length > 0 && <OtrosGiros giros={giros} />}
        {marcas.mostrar && marcas.lista.length > 0 && <MuroMarcas marcas={marcas} />}
        {proximos.proyectos.length > 0 && <ProximosProyectos proximos={proximos} />}
      </main>
      {/* Con `cierre` en el contenido, el cierre con la foto que se sale del
          panel (hoy las cuatro unidades, a prueba). Sin él, el de siempre: borrar el
          campo en contenido/<unidad>.ts es volver atrás. */}
      {cierre ? (
        <CierreUnidad
          eyebrow={CONTACT_CTA.eyebrow}
          title={cierre.titulo ?? CONTACT_CTA.title}
          unidad={unidad}
          cierre={cierre}
        />
      ) : (
        <CierreContacto {...CONTACT_CTA} unidad={unidad} idioma={idioma} />
      )}
      <Footer idioma={idioma} />
    </>
  );
}

/**
 * Los metadatos de la ruta, desde el mismo contenido, con la canónica, los
 * `hreflang` y la vista previa al compartir. Ver `metadatosDe` en lib/idioma.ts.
 */
export const metadataDe = (
  contenido: ContenidoUnidad,
  caminoEs: string,
  idioma: Idioma = "es",
): Metadata => metadatosDe(caminoEs, idioma, contenido.metadata);
