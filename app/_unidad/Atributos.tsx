"use client";

import { useEffect, useRef } from "react";
import type { Atributo, ContenidoUnidad, IconoAtributo } from "./tipos";

/**
 * Tres atributos de la unidad, bajo el hero: icono y título, nada más.
 *
 * Se monta sólo si la unidad trae `atributos` en su contenido (ver
 * PaginaUnidad). Hoy sólo Industrial.
 *
 * EL BLOQUE NO TIENE TÍTULO VISIBLE PERO SÍ h2. Los tres son encabezados, y como
 * h3 sueltos la página saltaría del h1 del hero a tres h3 sin h2 de por medio.
 * El h2 va oculto, para el esquema y para el lector de pantalla.
 *
 * TRES COLUMNAS A LA MISMA ALTURA, con un filete arriba: la composición de los
 * pilares de /nosotros, a propósito, para no estrenar un patrón. La entrada con
 * el scroll sale de la posición de cada una —un valor por elemento—, no de un
 * progreso global repartido. El mismo mecanismo que las carpetas del home.
 */

/*
 * LOS ICONOS, COPIADOS LITERAL. No se redibujan, no se redondean y no se
 * sustituyen por una librería: los nodos caen sobre cruces CALCULADOS entre los
 * segmentos, y redibujados dejan de coincidir.
 *
 * Son el mismo lenguaje que los de "Los pilares de nuestra identidad" en
 * /nosotros: polígono triangulado, trazo capilar de un solo grosor y nodos sobre
 * las intersecciones. Lo que distingue a cada uno es la estructura: en el
 * primero todo converge en un nodo, el segundo es un circuito cerrado, el
 * tercero es un módulo que se repite y sigue fuera del encuadre.
 *
 * Caja de 100. El círculo de r 3.1 es el nodo JERÁRQUICO, el único más grande
 * de cada icono: no se iguala a los demás.
 *
 * ⚠ EN LÍNEA, NO COMO <symbol> + <use>: con <use> el dibujo entra en un árbol
 * aparte que el CSS del documento no cruza, `currentColor` deja de resolverse
 * contra el color de la unidad y los iconos salen negros.
 *
 * Los estilos de .traza y .nodos están en unidad.css (.uni-at__ic).
 */
const ICONOS: Record<IconoAtributo, React.ReactNode> = {
  ubicacion: (
    <>
      <path
        className="traza"
        d="M50 12L14 78 M14 78L86 78 M86 78L50 12 M50 12L50 56 M14 78L50 56 M86 78L50 56 M32 45L50 78 M50 78L68 45 M68 45L32 45 M3 56L97 56"
      />
      <g className="nodos">
        <circle cx="50" cy="12" r="1.85" />
        <circle cx="14" cy="78" r="1.85" />
        <circle cx="86" cy="78" r="1.85" />
        <circle cx="32" cy="45" r="1.85" />
        <circle cx="50" cy="78" r="1.85" />
        <circle cx="68" cy="45" r="1.85" />
        <circle cx="26" cy="56" r="1.85" />
        <circle cx="74" cy="56" r="1.85" />
        <circle cx="50" cy="45" r="1.85" />
        <circle cx="41" cy="61.5" r="1.85" />
        <circle cx="59" cy="61.5" r="1.85" />
        <circle cx="38" cy="56" r="1.85" />
        <circle cx="62" cy="56" r="1.85" />
        <circle cx="50" cy="56" r="3.1" />
      </g>
    </>
  ),
  sustentabilidad: (
    <>
      <path
        className="traza"
        d="M50 13L17.96 31.5 M17.96 31.5L17.96 68.5 M17.96 68.5L50 87 M50 87L82.04 68.5 M82.04 68.5L82.04 31.5 M82.04 31.5L50 13 M50 13L50 87 M17.96 31.5L82.04 68.5 M17.96 68.5L82.04 31.5 M33.98 22.25L17.96 50 M17.96 50L33.98 77.75 M33.98 77.75L66.02 77.75 M66.02 77.75L82.04 50 M82.04 50L66.02 22.25 M66.02 22.25L33.98 22.25"
      />
      <g className="nodos">
        <circle cx="50" cy="13" r="1.85" />
        <circle cx="17.96" cy="31.5" r="1.85" />
        <circle cx="17.96" cy="68.5" r="1.85" />
        <circle cx="50" cy="87" r="1.85" />
        <circle cx="82.04" cy="68.5" r="1.85" />
        <circle cx="82.04" cy="31.5" r="1.85" />
        <circle cx="33.98" cy="22.25" r="1.85" />
        <circle cx="17.96" cy="50" r="1.85" />
        <circle cx="33.98" cy="77.75" r="1.85" />
        <circle cx="66.02" cy="77.75" r="1.85" />
        <circle cx="82.04" cy="50" r="1.85" />
        <circle cx="66.02" cy="22.25" r="1.85" />
        <circle cx="50" cy="77.75" r="1.85" />
        <circle cx="50" cy="22.25" r="1.85" />
        <circle cx="25.97" cy="36.13" r="1.85" />
        <circle cx="74.03" cy="63.88" r="1.85" />
        <circle cx="25.97" cy="63.88" r="1.85" />
        <circle cx="74.03" cy="36.13" r="1.85" />
        <circle cx="50" cy="50" r="3.1" />
      </g>
    </>
  ),
  /* ⚠ El cordón inferior va de −6 a 106: se sale de la caja A PROPÓSITO, por
     los dos lados. Ver `overflow: visible` en .uni-at__ic. */
  infraestructura: (
    <>
      <path
        className="traza"
        d="M-6 74L106 74 M19.4 26L40.15 26 M40.15 26L60.9 26 M60.9 26L81.65 26 M9 74L19.4 26 M19.4 26L29.75 74 M29.75 74L40.15 26 M40.15 26L50.5 74 M50.5 74L60.9 26 M60.9 26L71.25 74 M71.25 74L81.65 26 M81.65 26L92 74 M19.4 26L19.4 74 M81.65 26L81.65 74"
      />
      <g className="nodos">
        <circle cx="9" cy="74" r="1.85" />
        <circle cx="29.75" cy="74" r="1.85" />
        <circle cx="50.5" cy="74" r="1.85" />
        <circle cx="71.25" cy="74" r="1.85" />
        <circle cx="92" cy="74" r="1.85" />
        <circle cx="19.4" cy="26" r="1.85" />
        <circle cx="60.9" cy="26" r="1.85" />
        <circle cx="81.65" cy="26" r="1.85" />
        <circle cx="19.4" cy="74" r="1.85" />
        <circle cx="81.65" cy="74" r="1.85" />
        <circle cx="40.15" cy="26" r="3.1" />
      </g>
    </>
  ),

  /* ── Forestal · servicios ── */

  /* La espaldera: el tronco abre en abanico y los travesaños lo ordenan. */
  jardineria: (
    <>
      <path
        className="traza"
        d="M50 94L50 80 M50 80L16 28 M50 80L33 18 M50 80L50 14 M50 80L67 18 M50 80L84 28 M16 28L33 18 M33 18L50 14 M50 14L67 18 M67 18L84 28 M22.54 38L77.46 38 M34.31 56L65.69 56 M43.46 70L56.54 70"
      />
      <g className="nodos">
        <circle cx="16" cy="28" r="1.85" />
        <circle cx="33" cy="18" r="1.85" />
        <circle cx="50" cy="14" r="1.85" />
        <circle cx="67" cy="18" r="1.85" />
        <circle cx="84" cy="28" r="1.85" />
        <circle cx="22.54" cy="38" r="1.85" />
        <circle cx="34.31" cy="56" r="1.85" />
        <circle cx="43.46" cy="70" r="1.85" />
        <circle cx="38.48" cy="38" r="1.85" />
        <circle cx="43.42" cy="56" r="1.85" />
        <circle cx="47.26" cy="70" r="1.85" />
        <circle cx="50" cy="38" r="1.85" />
        <circle cx="50" cy="56" r="1.85" />
        <circle cx="50" cy="70" r="1.85" />
        <circle cx="61.52" cy="38" r="1.85" />
        <circle cx="56.58" cy="56" r="1.85" />
        <circle cx="52.74" cy="70" r="1.85" />
        <circle cx="77.46" cy="38" r="1.85" />
        <circle cx="65.69" cy="56" r="1.85" />
        <circle cx="56.54" cy="70" r="1.85" />
        <circle cx="50" cy="80" r="3.1" />
      </g>
    </>
  ),
  /* El mismo módulo repetido sobre la línea de suelo.
     ⚠ El suelo va de −6 a 106: fuera de la caja A PROPÓSITO, por los dos lados,
     como el cordón de infraestructura. */
  reforestacion: (
    <>
      <path
        className="traza"
        d="M-6 84L106 84 M19 84L19 58 M19 58L9 42 M9 42L3 27 M9 42L15 26 M19 58L29 42 M29 42L35 27 M29 42L23 26 M50 84L50 58 M50 58L40 42 M40 42L34 27 M40 42L46 26 M50 58L60 42 M60 42L66 27 M60 42L54 26 M81 84L81 58 M81 58L71 42 M71 42L65 27 M71 42L77 26 M81 58L91 42 M91 42L97 27 M91 42L85 26"
      />
      <g className="nodos">
        <circle cx="19" cy="84" r="1.85" />
        <circle cx="81" cy="84" r="1.85" />
        <circle cx="19" cy="58" r="1.85" />
        <circle cx="9" cy="42" r="1.85" />
        <circle cx="29" cy="42" r="1.85" />
        <circle cx="34.5" cy="28.25" r="1.85" />
        <circle cx="50" cy="58" r="1.85" />
        <circle cx="40" cy="42" r="1.85" />
        <circle cx="60" cy="42" r="1.85" />
        <circle cx="65.5" cy="28.25" r="1.85" />
        <circle cx="81" cy="58" r="1.85" />
        <circle cx="71" cy="42" r="1.85" />
        <circle cx="91" cy="42" r="1.85" />
        <circle cx="50" cy="84" r="3.1" />
      </g>
    </>
  ),
  /* La silueta recortada: las ramas terminan exactamente en el perímetro.
     ⚠ El único con VARIOS nodos grandes: son los seis cortes contra el
     perímetro, el tema del icono. No se igualan a los demás. */
  mantenimiento: (
    <>
      <path
        className="traza"
        d="M14 22L86 22 M86 22L86 78 M86 78L14 78 M14 78L14 22 M50 78L50 60 M50 60L30 48 M30 48L14 36 M30 48L23.5 22 M30 48L14 56 M50 60L70 48 M70 48L86 36 M70 48L76.5 22 M70 48L86 56 M50 60L50 22"
      />
      <g className="nodos">
        <circle cx="50" cy="78" r="1.85" />
        <circle cx="86" cy="22" r="1.85" />
        <circle cx="14" cy="22" r="1.85" />
        <circle cx="86" cy="78" r="1.85" />
        <circle cx="14" cy="78" r="1.85" />
        <circle cx="50" cy="60" r="1.85" />
        <circle cx="30" cy="48" r="1.85" />
        <circle cx="70" cy="48" r="1.85" />
        <circle cx="23.5" cy="22" r="3.1" />
        <circle cx="76.5" cy="22" r="3.1" />
        <circle cx="50" cy="22" r="3.1" />
        <circle cx="86" cy="36" r="3.1" />
        <circle cx="86" cy="56" r="3.1" />
        <circle cx="14" cy="36" r="3.1" />
        <circle cx="14" cy="56" r="3.1" />
      </g>
    </>
  ),

  /* ── Forestal · aplicaciones ── */

  /* El bastidor con travesaño pasante y escuadras. Las piezas van en PARES de
     líneas a propósito: es el único con espesor de material. */
  mobiliario: (
    <>
      <path
        className="traza"
        d="M18 20L18 92 M28 20L28 92 M72 20L72 92 M82 20L82 92 M6 20L94 20 M6 30L94 30 M18 62L82 62 M18 70L82 70 M28 41L39 30 M72 41L61 30"
      />
      <g className="nodos">
        <circle cx="18" cy="20" r="1.85" />
        <circle cx="18" cy="30" r="1.85" />
        <circle cx="18" cy="62" r="1.85" />
        <circle cx="18" cy="70" r="1.85" />
        <circle cx="28" cy="20" r="1.85" />
        <circle cx="28" cy="30" r="1.85" />
        <circle cx="28" cy="62" r="1.85" />
        <circle cx="28" cy="70" r="1.85" />
        <circle cx="28" cy="41" r="1.85" />
        <circle cx="72" cy="20" r="1.85" />
        <circle cx="72" cy="30" r="1.85" />
        <circle cx="72" cy="62" r="1.85" />
        <circle cx="72" cy="70" r="1.85" />
        <circle cx="72" cy="41" r="1.85" />
        <circle cx="82" cy="20" r="1.85" />
        <circle cx="82" cy="30" r="1.85" />
        <circle cx="82" cy="62" r="1.85" />
        <circle cx="82" cy="70" r="1.85" />
        <circle cx="39" cy="30" r="1.85" />
        <circle cx="61" cy="30" r="1.85" />
      </g>
    </>
  ),
  /* El pórtico de dos crujías con la cruz de San Andrés. */
  construccion: (
    <>
      <path
        className="traza"
        d="M16 14L16 88 M50 14L50 88 M84 14L84 88 M16 14L84 14 M16 50L84 50 M16 88L84 88 M16 88L50 50 M16 50L50 88"
      />
      <g className="nodos">
        <circle cx="16" cy="14" r="1.85" />
        <circle cx="16" cy="50" r="1.85" />
        <circle cx="16" cy="88" r="1.85" />
        <circle cx="50" cy="14" r="1.85" />
        <circle cx="50" cy="88" r="1.85" />
        <circle cx="84" cy="14" r="1.85" />
        <circle cx="84" cy="50" r="1.85" />
        <circle cx="84" cy="88" r="1.85" />
        <circle cx="33" cy="69" r="1.85" />
        <circle cx="50" cy="50" r="3.1" />
      </g>
    </>
  ),
  /* Torre sobre basamento, con sus niveles y la línea de suelo. */
  hoteleria: (
    <>
      <path
        className="traza"
        d="M6 88L94 88 M18 48L82 48 M82 48L82 88 M82 88L18 88 M18 88L18 48 M33 10L67 10 M67 10L67 48 M67 48L33 48 M33 48L33 10 M34 48L34 88 M50 48L50 88 M66 48L66 88 M18 61L82 61 M18 74L82 74 M50 10L50 48 M33 22L67 22 M33 34L67 34"
      />
      <g className="nodos">
        <circle cx="82" cy="88" r="1.85" />
        <circle cx="18" cy="88" r="1.85" />
        <circle cx="34" cy="88" r="1.85" />
        <circle cx="50" cy="88" r="1.85" />
        <circle cx="66" cy="88" r="1.85" />
        <circle cx="82" cy="48" r="1.85" />
        <circle cx="18" cy="48" r="1.85" />
        <circle cx="67" cy="48" r="1.85" />
        <circle cx="33" cy="48" r="1.85" />
        <circle cx="82" cy="61" r="1.85" />
        <circle cx="82" cy="74" r="1.85" />
        <circle cx="18" cy="61" r="1.85" />
        <circle cx="18" cy="74" r="1.85" />
        <circle cx="67" cy="10" r="1.85" />
        <circle cx="33" cy="10" r="1.85" />
        <circle cx="50" cy="10" r="1.85" />
        <circle cx="67" cy="22" r="1.85" />
        <circle cx="67" cy="34" r="1.85" />
        <circle cx="33" cy="22" r="1.85" />
        <circle cx="33" cy="34" r="1.85" />
        <circle cx="34" cy="61" r="1.85" />
        <circle cx="34" cy="74" r="1.85" />
        <circle cx="50" cy="61" r="1.85" />
        <circle cx="50" cy="74" r="1.85" />
        <circle cx="66" cy="61" r="1.85" />
        <circle cx="66" cy="74" r="1.85" />
        <circle cx="50" cy="22" r="1.85" />
        <circle cx="50" cy="34" r="1.85" />
        <circle cx="50" cy="48" r="3.1" />
      </g>
    </>
  ),
  /* El yate de perfil: casco, caseta, puente y arco de radar.
     ⚠ El único donde los nodos NO salen de cruzar trazos: el casco es curvo y
     un punto en cada cruce se leía como erratas. Los nueve son esquinas
     elegidas a mano. No se le añaden nodos para «completar» el patrón. */
  embarcaciones: (
    <>
      <path
        className="traza"
        d="M10 54L40 53 M40 53L70 51.5 M70 51.5L93 50 M93 50L84 62 M84 62L70 71 M70 71L52 74 M52 74L30 73 M30 73L14 70 M14 70L10 54 M24 53.5L24 40 M24 40L52 40 M52 40L62 52 M30 40L30 30 M30 30L46 30 M46 30L52 40 M36 30L36 22 M31 22L43 22 M26 46L57 46"
      />
      <g className="nodos">
        <circle cx="10" cy="54" r="1.85" />
        <circle cx="70" cy="71" r="1.85" />
        <circle cx="14" cy="70" r="1.85" />
        <circle cx="24" cy="40" r="1.85" />
        <circle cx="52" cy="40" r="1.85" />
        <circle cx="30" cy="30" r="1.85" />
        <circle cx="46" cy="30" r="1.85" />
        <circle cx="36" cy="22" r="1.85" />
        <circle cx="93" cy="50" r="3.1" />
      </g>
    </>
  ),
};

/**
 * La lista: filete → icono → título, en columnas, con la entrada escalonada.
 * La usan el bloque bajo el hero y las listas de las líneas de negocio, para
 * que los tres hablen igual.
 */
export function ListaAtributos({
  items,
  columnas = 3,
  nivel: Titulo = "h3",
}: {
  items: Atributo[];
  columnas?: 3 | 4;
  /** El nivel de los títulos: h3 bajo el h2 de la sección; h4 cuando la lista
      lleva su propio h3 encima (las líneas de Forestal). Se ven igual. */
  nivel?: "h3" | "h4";
}) {
  const raiz = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const nodo = raiz.current;
    if (!nodo) return;
    /* Con movimiento reducido no se engancha nada: --k se queda en 1 (el valor
       de la hoja) y salen puestas. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const filas = Array.from(nodo.querySelectorAll<HTMLElement>(".uni-at__f"));

    /*
     * Cuánto ha entrado cada una en la ventana, de 0 a 1. Los 34 px por índice
     * retrasan un poco cada una respecto de la anterior, y el 0.38 de la
     * ventana es el tramo en que se completa.
     */
    const pintar = () => {
      /* Primero se leen todas y después se escriben todas: leer una fila
         después de escribir la anterior obliga al navegador a recalcular el
         estilo en cada vuelta. */
      const tops = filas.map((fila) => fila.getBoundingClientRect().top);
      filas.forEach((fila, i) => {
        const k = Math.max(
          0,
          Math.min(1, (innerHeight - tops[i] - i * 34) / (innerHeight * 0.38)),
        );
        fila.style.setProperty("--k", k.toFixed(3));
      });
    };
    pintar();

    let pedido = 0;
    const alScroll = () => {
      if (pedido) return;
      pedido = requestAnimationFrame(() => {
        pedido = 0;
        pintar();
      });
    };
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);
    return () => {
      cancelAnimationFrame(pedido);
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alScroll);
    };
  }, []);

  return (
    <ul className="uni-at__g" ref={raiz} data-cols={columnas}>
      {items.map((item) => (
        <li
          className="uni-at__f"
          key={item.titulo}
          data-sin-icono={item.icono ? undefined : ""}
        >
          {/* Decorativos: el título ya dice lo que dice el dibujo. */}
          {item.icono && (
            <svg viewBox="0 0 100 100" className="uni-at__ic" aria-hidden="true">
              {ICONOS[item.icono]}
            </svg>
          )}
          <Titulo>{item.titulo}</Titulo>
        </li>
      ))}
    </ul>
  );
}

export function Atributos({
  atributos,
  unidad,
  color,
}: {
  atributos: NonNullable<ContenidoUnidad["atributos"]>;
  unidad: ContenidoUnidad["unidad"];
  /** El color de la unidad: el hero lo pone en su propia sección, y ésta es
      otra, así que no lo hereda. */
  color?: string;
}) {
  return (
    <section
      className="uni-at"
      aria-labelledby="atributos-titulo"
      style={color ? { ["--color-unidad" as string]: color } : undefined}
    >
      <h2 className="sr-only" id="atributos-titulo">
        Por qué Altea {unidad}
      </h2>
      <ListaAtributos items={atributos} />
    </section>
  );
}
