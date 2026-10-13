"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { CountUp } from "@/app/ui";
import { useMovimientoReducido } from "@/app/ui/useMovimientoReducido";
import type { ContenidoUnidad, FormaBandera } from "./tipos";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Hero de las páginas de unidad: la palabra de la unidad con la fotografía
 * dentro, que se desborda de las letras con el scroll.
 *
 * Nació para /comercial y es la misma mecánica en las cuatro. Lo que cambia por
 * unidad —la palabra, las fotos con su `ancla`, el color, la banderola y las
 * cifras— entra por props desde el contenido. Sin banderola la palabra va sola;
 * sin cifras el hero se compone sin ellas, en la apertura y en el cierre.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * EL CALADO
 *
 * `background-clip: text` con `color: transparent`. El texto SIGUE EN EL DOM, así
 * que un lector de pantalla lo lee como cualquier <h1> — no es una imagen con
 * texto dentro, es texto con imagen dentro. Detrás va una copia en
 * `-webkit-text-stroke`, apilada en la misma celda de la rejilla, que mantiene la
 * silueta sobre las zonas claras de la foto.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * EL CORAZÓN DEL EFECTO: LA FOTO NO CRECE CON LAS LETRAS, SE QUEDA QUIETA
 *
 * Si siguiera atada a la caja del texto —que es lo que hace `background-size:
 * cover`—, al crecer la palabra crecería con ella y por dentro se vería siempre
 * el mismo trozo, cada vez más ampliado y más blando. Anclada a la ventana, las
 * letras se abren SOBRE ella y la van descubriendo, y eso es lo que se lee como
 * desborde.
 *
 * Por eso `background-size` y `background-position` los escribe `encuadre()` en
 * cada fotograma, calculados contra la VENTANA y no contra la caja de cada
 * elemento. Reciben el mismo rectángulo tres elementos —la palabra, la capa a
 * sangre y la mitad de ink de la banderola—, y por eso coinciden píxel a píxel.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * EL RECORRIDO
 *
 * La sección se fija durante 150 % de pantalla, con scrub. A lo largo de él la
 * palabra crece hasta 7x, el contorno se va pronto, la foto se abre por una
 * trama de puntos que nace en el centro, y al final un velo la oscurece y vuelve
 * la composición de apertura invertida: la palabra blanca maciza sobre la foto.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * EL VELO DE 25 % SOBRE LA FOTO DENTRO DE LAS LETRAS
 *
 * Medido foto a foto: dos de las ocho —Paseo Durango y Punto Río Nilo— no llegan
 * a 3:1 contra el gris de página ni de media, con el 48 % y el 43 % de su banda
 * central por debajo del umbral. Con un velo negro al 25 % las ocho suben a entre
 * 4.71 y 8.80 de media.
 *
 * El velo va como primera capa del `background-image`, encima de la foto y
 * recortado por las mismas letras, no como un elemento aparte.
 */

/** Cuánto se oscurece la foto para que la palabra cumpla sobre el fondo claro. */
const VELO = 0.25;

/** Cuánto llega a crecer la palabra respecto a su cuerpo de apertura. */
const BASE_MAX = 7;

/**
 * ⚠ EL ACERCAMIENTO ESTÁ ATADO A LOS PÍXELES QUE HAY, no a lo que luzca bien.
 *
 * Al final del recorrido la foto se pinta a SOBRE_CUBRE × (1 + ZOOM) del ancho
 * de ventana. En una de 1440 eso son 2 071 px pedidos contra los 2 000 que tiene
 * el archivo: justo en el límite. Con un ZOOM de 0.30 serían 2 172 —y 2 605 en
 * las apaisadas, un 30 % de estiramiento—, que es de donde venía la blandura.
 *
 * SI ALGUIEN SUBE CUALQUIERA DE LAS DOS SIN CAMBIAR LOS ARCHIVOS, EL HERO SE
 * ABLANDA. En pantalla retina ni así alcanza: harían falta archivos de unos
 * 4 000 px, y eso no se arregla desde el código.
 *
 * SOBRE_CUBRE existe además para que `ancla` tenga margen donde moverse: un
 * `cover` a secas deja apenas 60 px de holgura vertical en una foto 3:2 sobre
 * una ventana de 900, y con eso no se desplaza nada. Ver `ancla` en tipos.ts.
 */
const ZOOM = 0.24;
const SOBRE_CUBRE = 1.16;

/**
 * La banderola como máscara: el `path` del logotipo dentro de un SVG mínimo con
 * su viewBox, estirado a la caja (`preserveAspectRatio='none'`).
 */
const mascara = (viewBox: string, d: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}' preserveAspectRatio='none'><path d='${d}' fill='black'/></svg>`,
  )}")`;

export function HeroCalado({
  hero,
  cifras,
}: Pick<ContenidoUnidad, "hero" | "cifras">) {
  const FOTOS = hero.fotos;
  const bandera = hero.color ? hero.bandera : undefined;
  const raiz = useRef<HTMLElement>(null);
  const reducido = useMovimientoReducido();

  useGSAP(
    () => {
      const nodo = raiz.current;
      if (!nodo) return;

      const q = <T extends HTMLElement>(sel: string) =>
        nodo.querySelector<T>(sel);
      const palabra = q(".js-tx");
      const lleno = q(".js-lleno");
      const galIzq = q(".js-gal");
      const eco = q(".js-eco");
      const velo = q(".js-velo");
      const entrada = q(".js-entrada");
      const datos = q(".js-datos");
      const cajas = gsap.utils.toArray<HTMLElement>(".uni-hero__t", nodo);
      /* La banderola y las cifras son opcionales por unidad: sin ellas `galIzq` y
         `datos` llegan nulos y el resto funciona igual. */
      if (!palabra || !lleno || !eco || !velo || !entrada || !FOTOS.length)
        return;

      /* Las tres capas que son ventana a la misma foto, en el mismo sitio. */
      const ventanas = [palabra, lleno, galIzq].filter(
        (el): el is HTMLElement => el !== null,
      );

      let actual = 0;
      let base = 0;
      let ultimo = 0;

      /* El cuerpo de apertura, leído del CSS: es el `clamp` ya resuelto. Hay que
         limpiar el valor en línea antes de medir, o se mediría el del fotograma
         anterior. */
      const medirBase = () => {
        for (const c of cajas) c.style.fontSize = "";
        base = parseFloat(getComputedStyle(cajas[0]).fontSize);
      };

      /*
       * EL ENCUADRE. Las tres capas reciben aquí el MISMO rectángulo, calculado
       * contra la ventana y no contra su propia caja.
       */
      const encuadre = (p: number) => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const R = FOTOS[actual].ratio;
        const z = 1 + ZOOM * p;
        const iw = Math.max(vw, vh * R) * SOBRE_CUBRE * z;
        const ih = iw / R;
        const izq = (vw - iw) / 2;
        /* el viaje vertical a lo largo del recorrido, en píxeles */
        const deriva = (p - 0.5) * 0.14 * Math.max(0, ih - vh);
        /* y el anclaje, acotado para que la foto nunca deje de cubrir */
        const arr = Math.max(
          vh - ih,
          Math.min(
            0,
            (vh - ih) / 2 + (0.5 - FOTOS[actual].ancla) * ih + deriva,
          ),
        );

        for (const el of ventanas) {
          const r = el.getBoundingClientRect();
          el.style.backgroundSize = `${iw.toFixed(1)}px ${ih.toFixed(1)}px`;
          el.style.backgroundPosition = `${(izq - r.left).toFixed(1)}px ${(arr - r.top).toFixed(1)}px`;
        }
      };

      /* El velo va DELANTE en la lista: en CSS la primera capa es la de arriba. */
      const pintar = (k: number) => {
        const f = FOTOS[k];
        if (!f) return;
        actual = k;
        const capa = `linear-gradient(rgb(0 0 0 / ${VELO}), rgb(0 0 0 / ${VELO})), url("${f.foto}")`;
        for (const el of ventanas) el.style.backgroundImage = capa;
        encuadre(ultimo);
        /* La siguiente se va descargando mientras ésta se ve, así que el relevo
           no paga la descarga a mitad del fundido. Sólo una por vez: precargar
           las ocho al montar competiría con el LCP, que es esta misma foto. */
        if (FOTOS.length > 1) {
          const siguiente = new Image();
          siguiente.src = FOTOS[(k + 1) % FOTOS.length].foto;
        }
      };

      const suave = (x: number) => {
        const t = Math.max(0, Math.min(1, x));
        return t * t * (3 - 2 * t);
      };

      const aplicar = (p: number) => {
        ultimo = p;

        /* La palabra crece ACELERANDO. Con una rampa lineal el efecto se gasta
           antes de que la foto asome fuera del calado; así casi no se mueve al
           principio y el desborde ocurre en el último tercio. */
        const f = 1 + (BASE_MAX - 1) * Math.pow(p, 1.7);
        const px = `${(base * f).toFixed(1)}px`;
        for (const c of cajas) c.style.fontSize = px;

        /* El contorno se va pronto: a ese cuerpo, una línea de 1 px alrededor de
           letras gigantes ya no sostiene ninguna silueta. */
        eco.style.opacity = Math.max(0, 1 - p / 0.3).toFixed(3);

        /*
         * EL FRENTE DE LA FOTO: un radio que crece desde el centro, no una
         * opacidad. `r0` es hasta dónde se ve entera y `r1` dónde acaba de
         * desaparecer.
         *
         * ⚠ La pluma también nace en cero. Fija, el degradado empieza opaco en
         * el centro aunque r0 valga 0, y la foto asoma ya en reposo.
         */
        const H =
          (Math.hypot(window.innerWidth, window.innerHeight) / 2) * 1.04;
        const Q = suave((p - 0.26) / 0.52);
        const r0 = Q * H;
        lleno.style.setProperty("--r0", `${r0.toFixed(0)}px`);
        lleno.style.setProperty(
          "--r1",
          `${(r0 + H * 0.1 * Math.min(1, Q * 4)).toFixed(0)}px`,
        );

        /*
         * ⚠ LA RETÍCULA SE CALCULA AQUÍ Y SE REESCRIBE EN LA VARIABLE, NUNCA SE
         * LEE. Consultar --rej con getPropertyValue devuelve la cadena
         * «clamp(13px,1.35vw,21px)» tal cual —las variables no se resuelven al
         * consultarlas— y parseFloat da NaN. Con eso, el `calc(NaNpx + .7px)` de
         * dentro invalida la declaración ENTERA de mask-image, que pasa a `none`:
         * la máscara desaparece y la foto se ve completa desde el primer
         * fotograma. No da ningún error.
         */
        const rej = Math.max(13, Math.min(21, window.innerWidth * 0.0135));
        lleno.style.setProperty("--rej", `${rej.toFixed(2)}px`);

        /* La trama va POR DETRÁS del frente —empieza más tarde y acaba al final—
           para que el borde siga granulado mientras avanza y la superficie se
           cierre al último. */
        const T = suave((p - 0.34) / 0.62);
        /*
         * ⚠ EL TOPE ES 0.62 DEL PASO Y NO 0.707, QUE ES LO QUE CERRARÍA LA TRAMA
         * DEL TODO. Con una retícula cuadrada un punto tapa su celda entera
         * cuando su radio llega a la mitad de la diagonal, 0.707 del paso.
         * Parándolo en 0.62 queda el 3.2 % del cuadro sin cubrir —calculado, no a
         * ojo—, en motas diminutas en las esquinas de cada celda. Es deliberado:
         * sin eso, el plano final se lee como una fotografía de stock a pantalla
         * completa; con eso, sigue siendo imagen tratada.
         */
        lleno.style.setProperty("--d", `${(rej * 0.62 * T).toFixed(2)}px`);

        /* El velo y la composición de cierre. */
        velo.style.opacity = suave((p - 0.7) / 0.3).toFixed(3);
        const G = suave((p - 0.8) / 0.2);
        entrada.style.opacity = G.toFixed(3);
        entrada.style.transform = `translateY(${((1 - G) * 28).toFixed(1)}px)`;

        /* Las cifras de apertura se van en el primer 22 %. */
        const s = Math.max(0, Math.min(1, p / 0.22));
        if (datos) {
          datos.style.opacity = (1 - s).toFixed(3);
          datos.style.transform = `translateY(${(s * 14).toFixed(1)}px)`;
        }

        encuadre(p);
      };

      medirBase();
      pintar(0);

      const alMedir = () => {
        medirBase();
        aplicar(ultimo);
      };
      window.addEventListener("resize", alMedir);

      if (reducido) {
        /* La primera plaza puesta, la palabra a su cuerpo y las cifras con su
           valor: una portada quieta, que es lo correcto. */
        aplicar(0);
        return () => window.removeEventListener("resize", alMedir);
      }

      if (datos) gsap.from(datos, {
        opacity: 0,
        y: 18,
        duration: 0.85,
        ease: "power2.out",
        delay: 0.35,
      });
      gsap.from(".uni-hero__capas", {
        opacity: 0,
        scale: 0.985,
        duration: 1.1,
        ease: "power3.out",
      });

      ScrollTrigger.create({
        trigger: nodo,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: alMedir,
        onUpdate: (s) => aplicar(s.progress),
      });

      /*
       * La alternancia entre plazas, sólo mientras el recorrido no ha arrancado:
       * una vez que la palabra empieza a crecer, cambiar la foto debajo sería un
       * corte en mitad del efecto.
       *
       * El relevo funde SÓLO el relleno y deja el contorno quieto: fundiendo el
       * bloque entero, la palabra desaparecía cada 4.2 s.
       */
      /* Con una sola foto no hay relevo: repetirla cada 4.2 s sería un parpadeo
         sin cambio. */
      const reloj = FOTOS.length < 2 ? undefined : window.setInterval(() => {
        if (ultimo > 0.05) return;
        const k = (actual + 1) % FOTOS.length;
        gsap.to(palabra, {
          opacity: 0,
          duration: 0.45,
          ease: "power2.in",
          onComplete: () => {
            pintar(k);
            gsap.to(palabra, { opacity: 1, duration: 0.6, ease: "power2.out" });
          },
        });
      }, hero.segundos * 1000);

      return () => {
        window.clearInterval(reloj);
        window.removeEventListener("resize", alMedir);
      };
    },
    { scope: raiz, dependencies: [reducido] },
  );

  return (
    <section
      className="uni-hero"
      ref={raiz}
      /* El color de la unidad entra como variable; sin él, los signos de las
         cifras van en el color de la cifra (ver .uni-hd__cifra en la hoja). */
      style={hero.color ? { ["--color-unidad" as string]: hero.color } : undefined}
    >
      <div className="uni-hero__lleno js-lleno" aria-hidden="true" />

      <div className="uni-hero__calado">
        <div className="uni-hero__capas">
          <h1 className="uni-hero__t">
            <span className="uni-hero__tx js-tx">{hero.palabra}</span>
            {/* La copia invisible: sólo ocupa el sitio que ocupa la visible del
                eco, para que las dos capas repartan igual el flex. */}
            {bandera && <Banderola forma={bandera} />}
          </h1>
          <span className="uni-hero__t uni-hero__eco js-eco" aria-hidden="true">
            <span className="uni-hero__tx">{hero.palabra}</span>
            {bandera && <Banderola forma={bandera} refIzq />}
          </span>
        </div>

        {cifras.length > 0 && (
        <dl className="uni-hero__datos js-datos">
          {cifras.map((cifra) => (
            <div className="uni-hd" key={cifra.etiqueta}>
              {/* dt antes que dd, que es lo que pide un <dl>; la cifra se ve
                  primero porque la columna va invertida. */}
              <dt className="uni-hd__etiqueta">{cifra.etiqueta}</dt>
              {/* Sin aria-label: el valor en palabras lo pone <CountUp>, y la
                  etiqueta ya está en el <dt>. */}
              <dd className="uni-hd__cifra">
                <CountUp
                  to={cifra.valor}
                  prefix={cifra.prefijo}
                  suffix={cifra.signo}
                />
              </dd>
            </div>
          ))}
        </dl>
        )}
      </div>

      <div className="uni-hero__velo js-velo" aria-hidden="true" />

      {/*
        El cierre va aria-hidden: repite EXACTAMENTE la palabra del <h1> y las
        tres cifras del <dl> de arriba, que siguen en el árbol de accesibilidad
        aunque se hayan desvanecido. Sin esto, un lector de pantalla anunciaría
        dos veces lo mismo y daría a entender que hay seis cifras.

        Y por eso tampoco cuentan: aparecen con su valor puesto. Aquí entran a la
        vez el velo, la palabra y las tres cifras; con los números corriendo
        además, serían cuatro cosas moviéndose en segundo y medio.
      */}
      <div className="uni-hero__entrada js-entrada" aria-hidden="true">
        <div className="uni-hero__lockup">
          <p className="uni-hero__vuelve">{hero.palabra}</p>
          {bandera && <Banderola forma={bandera} />}
        </div>
        {cifras.length > 0 && (
        <dl className="uni-hero__cierre">
          {cifras.map((cifra) => (
            <div className="uni-hc" key={cifra.etiqueta}>
              <dt className="uni-hc__etiqueta">{cifra.etiqueta}</dt>
              <dd className="uni-hc__cifra">
                {cifra.prefijo && (
                  <span className="altea-count__prefijo">{cifra.prefijo}</span>
                )}
                {cifra.valor.toLocaleString("es-MX")}
                {cifra.signo && (
                  <span className="altea-count__sufijo">{cifra.signo}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
        )}
      </div>
    </section>
  );
}

/**
 * Los dos triángulos del logotipo de unidad, colgados del vértice de la palabra.
 *
 * `refIzq` marca la única mitad izquierda que recibe la foto: la de la capa del
 * contorno, que es la visible. Ver la nota de .uni-hero__gal en la hoja.
 */
function Banderola({
  forma,
  refIzq,
}: {
  forma: FormaBandera;
  refIzq?: boolean;
}) {
  const [, , ancho, alto] = forma.viewBox.split(/\s+/).map(Number);
  return (
    <span
      className="uni-hero__gal"
      aria-hidden="true"
      style={{
        ["--gal-ratio" as string]: `${ancho} / ${alto}`,
        ["--gal-izq" as string]: mascara(forma.viewBox, forma.izquierda),
        ["--gal-der" as string]: mascara(forma.viewBox, forma.derecha),
      }}
    >
      <i className={refIzq ? "gal__izq js-gal" : "gal__izq"} />
      <i className="gal__der" />
    </span>
  );
}
