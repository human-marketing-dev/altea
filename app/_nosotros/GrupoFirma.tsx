import Image from "next/image";
import { GRUPO_FIRMA } from "./content";

/**
 * Grupo Firma: los seis sectores, en fila.
 *
 * SIN LÍNEAS CONECTORAS. Es un organigrama y la tentación es trazarlo, pero con
 * sub-marcas en casi todas las ramas cualquier trazado acaba cruzándose con el
 * texto. Aquí la jerarquía la hace la ALINEACIÓN: lo que está debajo de un
 * logotipo le pertenece. Y la separación entre columnas es una línea fina, no un
 * hueco, para que se lea como tabla y no como seis tarjetas.
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
 * el nombre en texto antes que improvisar. Van todos en gris salvo Altea:
 * logotipos ajenos a todo color convierten la sección en un muro de marcas de
 * otros, y ésta es la página de Altea.
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
 * La clave es el nombre del archivo y no el id del sector, para que sirva igual a
 * un logotipo de sector y a uno de sub-marca.
 */
const AJUSTES: Record<string, number> = {
  /*
   * 0.52, Y SOBREVIVE AL RECORTE DEL ARCHIVO — pero por un motivo distinto y más
   * simple que antes. Conviene leerlo entero antes de tocarlo.
   *
   * EL ARCHIVO YA NO MIENTE. Venía en 360x234 con la marca en 305x125 dentro: el
   * 46.6 % del alto y el 15.3 % del ancho eran margen transparente, así que
   * declaraba 1.538:1 cuando la marca era 2.440:1. Está recortado a 305x125 y su
   * proporción es ahora la de la mancha. Eso arregló la geometría: `factorOptico`
   * recibe el número correcto y el tope de ancho se calcula sobre la marca real.
   *
   * LO QUE EL RECORTE NO PUEDE ARREGLAR ES LA COMPARACIÓN, porque los otros cinco
   * archivos siguen sin recortar y traen entre el 33 % y el 58 % de aire interno.
   * El alto común (--objetivo, 0.60) se gasta en el ELEMENTO, no en la mancha, así
   * que un archivo ajustado aprovecha el presupuesto entero y uno con aire pierde
   * la mitad por el camino. Delta es ahora el único honesto de los seis, y el
   * honesto sale perdiendo: sin corrección se iría a 34.3 px de tinta, el más
   * grande de la fila, cuando los demás están entre 15.0 y 32.7.
   *
   * 0.52 lo deja en 22.0 px de tinta, la mediana exacta de los otros cinco
   * (Multimedios 15.0, Goal Capital 15.5, Foodplay 22.0, Bornos 23.6, Altea 32.7).
   *
   * ⚠ NO SE LIMPIA. Lo que lo haría desaparecer de verdad es RECORTAR LOS OTROS
   * CINCO: con los seis lienzos ajustados a su mancha, el alto común se reparte
   * igual para todos y la fórmula basta sola. Goal Capital es el que más lo pide
   * —57.9 % de aire vertical, mancha de 8.608:1 contra un lienzo de 4.479—, y le
   * siguen Multimedios, Bornos y Foodplay, entre el 33 y el 37 %.
   */
  "logo-delta-electric-grupo-firma-globales.webp": 0.52,
};



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

      {/* La raíz y el family office, encima de la fila. Goal Capital va aparte
          porque no es un sector operativo: no le corresponde una columna. */}
      <div className="nos-firma__raiz">
        <p className="nos-firma__gfg">
          <b>{GRUPO_FIRMA.raiz.sigla}</b>
          <span>{GRUPO_FIRMA.raiz.nombre}</span>
        </p>
        <p className="nos-firma__aparte">
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
          {GRUPO_FIRMA.aparte.rol}
        </p>
      </div>

      <ul className="nos-firma__cols">
        {GRUPO_FIRMA.sectores.map((sector) => (
          <li
            className="nos-firma__col"
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
                sector.marca
              )}
            </span>

            {sector.subs.length > 0 && (
              <ul className="nos-firma__subs">
                {sector.subs.map((sub) => (
                  <li key={sub.nombre}>
                    {/* Sólo Deportes trae categoría por sub-marca, y la lleva igual
                        tenga logotipo o no: Béisbol encima de Sultanes, Básquetbol
                        encima de Fuerza Regia. En las demás ramas la columna ya
                        dice de qué sector son. */}
                    {sub.categoria && <em>{sub.categoria}</em>}
                    {sub.logo ? (
                      <Image
                        className="nos-firma__sublogo"
                        src={sub.logo}
                        alt={sub.nombre}
                        width={200}
                        height={Math.round(200 / (sub.logoRatio ?? 2.5))}
                        /* Misma corrección óptica que los de sector: los compactos
                           como KFC bajan y los alargados como Tim Hortons no. */
                        style={{
                          ["--factor" as string]: factorDe(
                            sub.logo,
                            sub.logoRatio ?? 2.5,
                          ),
                        }}
                        unoptimized
                      />
                    ) : (
                      <b>{sub.nombre}</b>
                    )}
                  </li>
                ))}
              </ul>
            )}
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
