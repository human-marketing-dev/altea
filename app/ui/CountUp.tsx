"use client";

import { useEffect, useRef, useState } from "react";

export interface CountUpProps {
  /** Valor final. */
  to: number;
  prefix?: string;
  suffix?: string;
  /** @default 1600 */
  duration?: number;
  className?: string;
}

/**
 * Cifra que cuenta de 0 al valor final la primera vez que entra en pantalla,
 * como pide el wireframe.
 *
 * Renderiza el valor final en el servidor, así que sin JS —o con
 * `prefers-reduced-motion`— el número correcto siempre está ahí.
 */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1600,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);
  /*
   * Los decimales que trae `to`, para contar con ellos. Con Math.round a secas un
   * 18.8 acababa en 19: el redondeo del último fotograma se comía la cifra. En
   * un entero vale 0 y todo queda como estaba.
   */
  const decimales = (String(to).split(".")[1] ?? "").length;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // easeOutCubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const factor = 10 ** decimales;
          setValue(Math.round(to * eased * factor) / factor);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };

        setValue(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, duration, decimales]);

  return (
    /*
     * DOS CAPAS: LO QUE SE VE Y LO QUE SE OYE.
     *
     * Lo visible —prefijo, número y sufijo, cada signo en su <span> para poder
     * pintarlo aparte— va aria-hidden. El número cambia en cada fotograma
     * mientras cuenta, y expuesto, un lector de pantalla podía anunciar cifras
     * intermedias ("ciento doce") o quedarse con la última que oyó. Y la
     * magnitud vive en un glifo pequeño —la "M", el "mil"— que leído suelto
     * puede no decir nada.
     *
     * Lo que se oye es el valor FINAL en palabras, en texto oculto: una vez y
     * correcto. Sin aria-live a propósito: haría justo lo contrario, anunciar
     * cada cambio. La etiqueta de la cifra la pone quien la use, al lado; aquí
     * sólo va el valor.
     */
    <span ref={ref} className={className}>
      <span aria-hidden="true">
        {prefix && <span className="altea-count__prefijo">{prefix}</span>}
        {value.toLocaleString("es-MX", {
          minimumFractionDigits: decimales,
          maximumFractionDigits: decimales,
        })}
        {suffix && <span className="altea-count__sufijo">{suffix}</span>}
      </span>
      <span className="sr-only">{enPalabras(to, prefix, suffix, decimales)}</span>
    </span>
  );
}

/** Cómo se dice cada signo. Uno que no esté aquí se lee tal cual se escribe. */
const PREFIJOS: Record<string, string> = { "+": "más de" };
const UNIDADES: Record<string, string> = {
  "%": "por ciento",
  "m²": "metros cuadrados",
};

/** Dígitos sin separador de miles: "376034" lo lee bien cualquier voz. */
const digitos = (n: number, decimales = 0) =>
  n.toLocaleString("es-MX", {
    useGrouping: false,
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });

/**
 * Una cantidad entera en palabras a partir del millón; por debajo, en dígitos.
 *
 * 44000000 → "44 millones"; 18800000 → "18 millones 800 mil". A partir de siete
 * dígitos algunos lectores leen la cadena cifra por cifra, y con seis
 * ("376034") todavía la leen como número. Devuelve también si quedó en
 * millones exactos, porque entonces la unidad va con "de": "44 millones de
 * metros cuadrados".
 */
function cantidad(total: number): { texto: string; millonesExactos: boolean } {
  if (Math.abs(total) < 1_000_000)
    return { texto: digitos(total), millonesExactos: false };
  const millones = Math.floor(total / 1_000_000);
  const resto = Math.round(total - millones * 1_000_000);
  const base = `${millones} ${millones === 1 ? "millón" : "millones"}`;
  if (!resto) return { texto: base, millonesExactos: true };
  const cola =
    resto % 1000 === 0 ? `${resto / 1000} mil` : digitos(resto);
  return { texto: `${base} ${cola}`, millonesExactos: false };
}

/**
 * El valor final, como se dice:
 *   "+3M"            → "más de 3 millones"
 *   "+18.8M"         → "más de 18 millones 800 mil"
 *   "+400 mil"       → "más de 400 mil"
 *   "+44,000,000 m²" → "más de 44 millones de metros cuadrados"
 *   "94%"            → "94 por ciento"
 *
 * ⚠ SIN PUNTO DECIMAL. "18.8 millones" es correcto en México, pero hay voces en
 * español que no lo leen como decimal: las de configuración de España tratan el
 * punto como separador de miles, y otras pausan en él. "18 millones 800 mil" no
 * depende de cómo interprete el punto ninguna voz. Por eso la "M" se convierte a
 * la cantidad entera y se dice en millones, en vez de leer "18.8" y "millones".
 */
function enPalabras(
  n: number,
  prefijo: string,
  sufijo: string,
  decimales: number,
) {
  const p = prefijo.trim();
  const s = sufijo.trim();
  let valor: string;
  if (s === "M") {
    valor = cantidad(Math.round(n * 1_000_000)).texto;
  } else if (s === "mil") {
    valor = `${digitos(n, decimales)} mil`;
  } else {
    const c = Number.isInteger(n)
      ? cantidad(n)
      : { texto: digitos(n, decimales), millonesExactos: false };
    const unidad = s && (UNIDADES[s] ?? s);
    valor = unidad
      ? `${c.texto} ${c.millonesExactos ? "de " : ""}${unidad}`
      : c.texto;
  }
  return [p && (PREFIJOS[p] ?? p), valor].filter(Boolean).join(" ");
}
