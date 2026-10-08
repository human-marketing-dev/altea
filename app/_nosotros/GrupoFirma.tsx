import { Trophy } from "lucide-react";
import Image from "next/image";
import { GRUPO_FIRMA } from "./content";

/**
 * Grupo Firma: los seis sectores, en fila.
 *
 * UN SOLO NIVEL BAJO LA RAÍZ. Cuatro de los seis colgaban un tercer nivel de
 * sub-marcas y se quitó entero: ver la nota de SECTORES en content.ts, que
 * enumera lo que se fue y lo que se fue con ello.
 *
 * La jerarquía la hace la ALINEACIÓN —lo que está debajo de un logotipo le
 * pertenece— y la separación entre columnas es una línea fina, no un hueco, para
 * que se lea como tabla y no como seis tarjetas.
 *
 * ALTEA NO CAMBIA DE SITIO, CAMBIA DE MATERIAL: fondo propio, regla coral arriba
 * y caja de logotipo rellena en ink con el texto en cream. Se distingue sin
 * salirse de la fila — y sigue distinguiéndose el día que lleguen los logotipos
 * reales y los otros cinco sean grises, que es cuando un simple cambio de color
 * habría dejado de funcionar.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * LOS LOGOTIPOS
 *
 * Cinco de los seis sectores tienen archivo; DEPORTES no, y su caja se queda con
 * el nombre en texto antes que improvisar. Los seis van en gris: logotipos ajenos
 * a todo color convierten la sección en un muro de marcas de otros, y ésta es la
 * página de Altea.
 *
 * Las dos excepciones están fuera de la fila y por motivos distintos: ALTEA, que
 * se distingue por material —caja en ink, trazo coral— y no por color, y la RAÍZ,
 * cuyo logotipo va a todo color porque grisarlo lo rompe. Ver .nos-firma__gfg.
 *
 * El gris sale de la OPACIDAD y no del grayscale, porque los doce archivos del
 * grupo son negro puro sobre transparente — el grayscale sobre negro no hace
 * nada. Se deja puesto igual, como seguro para un archivo futuro en color.
 *
 * Las cajas conservan su proporción fija (5/2) y el logotipo se ajusta dentro con
 * un ALTO OBJETIVO común, no al tamaño de la caja: con `contain` a secas, un
 * logotipo de 7:1 como Multimedios se queda al 35 % del alto de la caja mientras
 * que uno de 1.5:1 como Delta Electric la llena, y la fila se lee desigual.
 *
 * Y sobre ese alto común va además una CORRECCIÓN ÓPTICA por proporción: ver
 * `factorOptico`.
 */

/**
 * CORRECCIÓN ÓPTICA DEL ALTO SEGÚN LA PROPORCIÓN.
 *
 * El alto común no basta, y el dato es contraintuitivo. Con los 32.2 px del alto
 * objetivo, Delta Electric es el que MENOS área ocupa de los seis:
 *
 *   Multimedios     7.07   227.7 de ancho   7330 de área   4.6x la de Delta
 *   Altea           5.04   162.3            5226           3.3x
 *   Goal Capital    4.48   144.3            4645           2.9x
 *   Bornos          2.76    88.9            2862           1.8x
 *   Foodplay        2.69    86.6            2789           1.7x
 *   Delta Electric  1.54    49.6            1597           1.0x
 *
 * (La fila de Delta es de ANTES de recortar su archivo; hoy su lienzo es 2.44:1.
 * La tabla se deja como estaba porque es la que explica por qué existe el factor.)
 *
 * Y sin embargo se ve el más grande, porque EN UNA MARCA COMPACTA EL TAMAÑO
 * PERCIBIDO LO MANDA EL ALTO, NO EL ÁREA: un logotipo casi cuadrado que llena sus
 * 32 px de arriba abajo pesa más en el ojo que un wordmark largo con mucho aire
 * interno a la misma altura.
 *
 * El factor baja el alto de los compactos y deja quietos los alargados:
 *
 *   Multimedios 1.00 → 32.2 px      Bornos         0.84 → 27.1 px
 *   Altea       1.00 → 32.2         Foodplay       0.84 → 26.9
 *   Goal Cap.   0.98 → 31.5         Delta Electric 0.74 → 23.9
 *
 * El tope en 1 evita que un logotipo aún más ancho crezca de más; del ancho se
 * sigue encargando el máximo del 94 %, que es lo único que toca a Multimedios.
 *
 * ⚠ Es un ajuste de PERCEPCIÓN y no se puede verificar midiendo. Si un logotipo
 * suelto sigue pesando de más, lo que se toca es AJUSTES —abajo—, no BASE: BASE
 * mueve los seis a la vez. Delta Electric ya tiene su excepción ahí.
 */
const BASE = 0.62;
const PENDIENTE = 0.08;
const factorOptico = (ratio: number) => Math.min(1, BASE + ratio * PENDIENTE);

/**
 * ⚠ CORRECCIÓN ÓPTICA POR LOGOTIPO. NO ES UN ERROR NI UN PARCHE OLVIDADO.
 *
 * Esto NO SE LIMPIA. Si parece arbitrario es porque lo es: son valores de
 * percepción, medidos a ojo contra la fila completa, que ninguna fórmula puede
 * deducir del archivo. Quien los borre va a "arreglar" algo que no estaba roto y
 * va a devolver el problema que resolvieron.
 *
 * La fórmula de arriba corrige por PROPORCIÓN, que es lo que explica la mayoría
 * de los casos. Lo que no puede ver es cuánta tinta trae el archivo dentro de su
 * propio recuadro, y ahí es donde se le escapa Delta Electric:
 *
 *   Delta Electric  1.54:1   factor 0.74   24.0 px de caja   12.8 px de tinta
 *
 * Doce píxeles de tinta no suenan a mucho, y aun así se ve el más grande de los
 * seis: su mancha es CUADRADA y maciza, mientras que los wordmarks reparten la
 * misma tinta a lo largo. La proporción ya está contada en el factor; esto es el
 * resto que queda.
 *
 * ENDURECER LA FÓRMULA NO ES LA SALIDA. Para llevar a Delta de 0.74 a 0.55 habría
 * que bajar BASE a 0.43, y entonces Altea —que viene sin aire interno y es el
 * ancla visual de la fila— caería de 1.00 a 0.83 sin que nadie lo pidiera. Un
 * caso suelto se arregla con una excepción suelta.
 *
 * El valor SUSTITUYE al factor, no lo multiplica: va en las mismas unidades que
 * `factorOptico`, donde 1.00 es "a su alto objetivo completo".
 *
 * La clave es el nombre del archivo y no el id del sector: así el ajuste viaja
 * con el archivo aunque cambie de sitio en el organigrama.
 */
const AJUSTES: Record<string, number> = {
  /*
   * ── Logotipos de sector ──
   *
   * Delta: el archivo está recortado a su mancha —ver `logoRatio` en content.ts—,
   * así que es el único de los seis sin aire interno y el presupuesto de alto se
   * le aprovecha entero. Por eso va por debajo de 1 y no por encima.
   *
   * Altea baja y Delta sube para juntarlas con el resto: medidos los seis en el
   * navegador, la tinta iba de 14.8 (Multimedios) a 32.3 (Altea), y Altea sacaba
   * once píxeles al segundo. Ahora el abanico es la mitad. Altea no necesita ser
   * la más grande para distinguirse: tiene la caja sólida en ink y el trazo coral.
   */
  "logo-delta-electric-grupo-firma-globales.webp": 0.62,
  "altea-logo-light.svg": 0.58,
};

/*
 * ⚠ DEPORTES NO TIENE LOGOTIPO: LLEVA UN ICONO GENÉRICO, Y LA DIFERENCIA IMPORTA.
 *
 * Es el único de los seis sin archivo. En logos-grupo-firmas-globales/ están
 * Sultanes y Fuerza Regia —las dos sub-marcas— pero no hay marca paraguas de
 * "Deportes", ni ahí ni en ningún otro sitio del repositorio.
 *
 * El icono es `Trophy` de lucide-react (ISC), no un dibujo propio. Hubo aquí un
 * SVG hecho a mano y se quitó: un símbolo inventado para una marca que existe de
 * verdad se lee como si FUERA su identidad, y eso sí engaña. Un icono de librería
 * se lee como lo que es —un marcador de categoría— y nadie lo confunde con un
 * logotipo.
 *
 * El texto NO se quita: el icono va encima y el nombre debajo. El icono es
 * decorativo (`aria-hidden` lo pone lucide por defecto al no haber `aria-label`),
 * así que lo que se lee sigue siendo "Deportes".
 *
 * `strokeWidth` baja de los 2 de lucide a 1.6: los iconos propios del sitio —los
 * de los pilares, los del footer— van entre 1.3 y 1.8, y a 2 éste se vería más
 * pesado que todo lo demás.
 *
 * PENDIENTE: pedir a Altea el logotipo de la rama de deportes. En cuanto exista,
 * se añaden `logo` y `logoRatio` al sector en content.ts y entra por el mismo
 * camino que los otros cinco; esto se vuelve el respaldo de un caso que ya no
 * ocurre.
 */

/** El factor de un logotipo: su excepción si la tiene, y si no la fórmula. */
function factorDe(logo: string | undefined, ratio: number) {
  const archivo = logo?.slice(logo.lastIndexOf("/") + 1);
  return (archivo && AJUSTES[archivo]) ?? factorOptico(ratio);
}
export function GrupoFirma() {
  return (
    <section className="nos-firma" aria-labelledby="firma-titulo">
      <div className="nos-firma__cab">
        <h2 className="nos-firma__titulo" id="firma-titulo">
          {GRUPO_FIRMA.title}
        </h2>
        <p className="nos-firma__intro">{GRUPO_FIRMA.intro}</p>
      </div>

      {/*
        LA RAÍZ, CENTRADA, Y EL NUDO DEL QUE CUELGA TODO.

        El nudo es un contenedor de ancho completo con el tronco dibujado en su
        ::before. Tiene que ser de ancho completo: si el bloque de Goal Capital
        colgara de la propia línea del tronco —un elemento de 1 px—, sus
        porcentajes se calcularían contra ese píxel y acabaría en cualquier sitio.

        El codo sale del tronco y va RECTO DE LADO, sin bajar después. Con la
        bajada, Goal Capital cae sobre la fila de ramas y se monta con ellas.
      */}
      <div className="nos-firma__raiz">
        <p className="nos-firma__gfg">
          {/*
            Decorativa: el nombre va escrito justo debajo, así que ponerle un alt
            haría que un lector anunciara la marca dos veces seguidas. Es el único
            logotipo de la sección que no es información por sí mismo —los de la
            fila sí, porque ahí el nombre no se repite en texto.
          */}
          <Image
            src={GRUPO_FIRMA.raiz.logo}
            alt=""
            aria-hidden="true"
            width={537}
            height={Math.round(537 / GRUPO_FIRMA.raiz.logoRatio)}
            unoptimized
          />
          <span>{GRUPO_FIRMA.raiz.nombre}</span>
        </p>
      </div>

      <div className="nos-firma__nudo">
        <span className="nos-firma__codo" aria-hidden="true" />
        {/* Goal Capital cuelga de la raíz, no de la fila: es el family office y
            no un sector operativo, así que no le corresponde una rama. */}
        <p className="nos-firma__aparte">
          <span className="nos-firma__cat">{GRUPO_FIRMA.aparte.rol}</span>
          <Image
            className="nos-firma__logo-aparte"
            src={GRUPO_FIRMA.aparte.logo}
            alt={GRUPO_FIRMA.aparte.nombre}
            width={400}
            height={Math.round(400 / GRUPO_FIRMA.aparte.logoRatio)}
            style={{
              ["--factor" as string]: factorDe(
                GRUPO_FIRMA.aparte.logo,
                GRUPO_FIRMA.aparte.logoRatio,
              ),
            }}
            unoptimized
          />
        </p>
      </div>

      <ul className="nos-firma__ramas">
        {GRUPO_FIRMA.sectores.map((sector) => (
          <li
            className="nos-firma__rama"
            key={sector.id}
            data-nuestra={sector.nuestra ? "si" : undefined}
          >
            <span className="nos-firma__cat">{sector.categoria}</span>
            <span className="nos-firma__marca">
              {sector.logo ? (
                <Image
                  className="nos-firma__logo"
                  src={sector.logo}
                  /* El alt es el nombre de la marca: NO son decorativos, son la
                     información de la sección. */
                  alt={sector.marca}
                  width={400}
                  height={Math.round(400 / (sector.logoRatio ?? 2.5))}
                  style={{
                    ["--factor" as string]: factorDe(
                      sector.logo,
                      sector.logoRatio ?? 2.5,
                    ),
                  }}
                  /* unoptimized por el SVG de Altea, que Next no optimiza; los
                     .webp del grupo ya vienen a su tamaño final y pesan 5-9 KB. */
                  unoptimized
                />
              ) : (
                <span className="nos-firma__sinlogo">
                  <Trophy className="nos-firma__icono" strokeWidth={1.6} />
                  {sector.marca}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      <p className="nos-firma__pie">
        {GRUPO_FIRMA.pie.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </p>
    </section>
  );
}
