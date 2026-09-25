"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  ESTADOS,
  GEOMETRIA_LISTA,
  MAPA_ALTO,
  MAPA_ANCHO,
  type EstadoId,
} from "@/lib/mexico-estados";
import { useMovimientoReducido } from "./useMovimientoReducido";

/* ------------------------------------------------------------------ *
 * Calibración visual. Dos niveles, no tres: el mapa muestra presencia,
 * no cantidad, así que todos los estados con presencia van del mismo
 * tono. Una gradación por número de proyectos diría algo que la sección
 * ya no cuenta.
 * ------------------------------------------------------------------ */
const RELLENO = {
  /** Sin presencia de Altea. */
  sinPresencia: "fill-ink/10",
  /** Con presencia. El hover sólo oscurece; no lleva información. */
  presencia: "fill-coral [@media(hover:hover)]:hover:fill-coral-dark",
} as const;

const TRAZO = "stroke-cream/40 [stroke-width:0.8]";

/** Entrada al scroll. */
const ENTRADA_MS = 300;
/** Separación del tooltip respecto al cursor. */
const OFFSET_TOOLTIP = 12;

type Tooltip = {
  x: number;
  y: number;
  nombre: string;
  /** m² construidos. `undefined` mientras Altea no entregue la cifra. */
  m2?: number;
  voltear: boolean;
};

export interface MapaProyectosProps {
  /**
   * Estados donde Altea tiene presencia. Se reciben por prop, no se importan:
   * así cambiar la fuente de datos no toca este componente.
   */
  estadosConPresencia: readonly EstadoId[];
  /**
   * m² construidos por estado, para el tooltip. Lo que falte no se pinta: el
   * tooltip queda con el nombre y ya.
   */
  m2PorEstado?: Partial<Record<EstadoId, number>>;
  className?: string;
}

/**
 * Mapa de presencia. PURAMENTE DECORATIVO.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │ DECISIÓN CONSCIENTE, NO UN OLVIDO — leer antes de "arreglar" esto.   │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * QUÉ SE QUITÓ. Debajo del mapa había los nombres de los 21 estados como texto
 * real: primero una rejilla de dos columnas y después una línea corrida.
 * Se retiraron por decisión de diseño — no encajaban con la composición de la
 * sección.
 *
 * QUÉ SE PIERDE, y es más de lo que parece:
 *
 *   · El <svg> es `aria-hidden`, sin roles y sin foco, así que para un lector
 *     de pantalla este componente NO EXISTE. No hay texto alternativo de
 *     ningún tipo.
 *   · El tooltip del hover es el único sitio donde queda el nombre de un
 *     estado, y vive tras `[@media(hover:hover)]`: EN UN TELÉFONO NO HAY
 *     FORMA DE SABER QUÉ ESTADOS SON.
 *   · Los 21 nombres ya no están en el DOM: no se copian, no se buscan con
 *     Ctrl+F y no los indexa un buscador.
 *   · El cuerpo de la sección afirma "presencia en 21 Estados de México" y no
 *     queda nada en la página que lo respalde.
 *
 * SI VIENES POR ACCESIBILIDAD O POR SEO, ésta es la causa. Devolverlo es
 * reponer el <p> con los nombres: salían de ESTADOS filtrado por presencia,
 * ordenado con localeCompare(a, b, "es") y unido con " · " —el separador tiene
 * que ser un carácter de verdad y no un `gap` de CSS, o la línea copiada sale
 * con los nombres pegados—. Está en el historial de git.
 *
 * Antes cada estado era un `role="button"` con `tabIndex`. Al quitarle la
 * acción al clic eso dejaba 21 paradas de teclado que no llevaban a ningún
 * lado y 21 "botón" anunciados sin nada que pulsar. Un botón que no hace nada
 * es peor que no tener botón.
 *
 * El hover se queda como adorno de puntero: oscurece el estado y saca su
 * nombre. Ya no es un adorno, sin embargo: hoy es la ÚNICA vía de acceso al
 * dato, y sólo con ratón.
 */
export function MapaProyectos({
  estadosConPresencia,
  m2PorEstado,
  className,
}: MapaProyectosProps) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [visible, setVisible] = useState(false);
  const sinAnimacion = useMovimientoReducido();
  // Con movimiento reducido nada se anima: se muestra de una.
  const mostrar = visible || sinAnimacion;

  const contenedorRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const anchoTooltip = useRef(0);

  const conPresencia = useMemo(
    () => new Set<EstadoId>(estadosConPresencia),
    [estadosConPresencia],
  );

  /* --- Entrada al scroll ------------------------------------------- */
  useEffect(() => {
    if (sinAnimacion) return;
    const nodo = contenedorRef.current;
    if (!nodo) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observador.observe(nodo);
    return () => observador.disconnect();
  }, [sinAnimacion]);

  /* --- Ancho del tooltip, para decidir si se voltea ----------------- */
  useEffect(() => {
    if (tooltipRef.current)
      anchoTooltip.current = tooltipRef.current.offsetWidth;
  }, [tooltip?.nombre, tooltip?.m2]);

  const seguirCursor = useCallback(
    (evento: ReactMouseEvent, nombre: string, m2?: number) => {
      const rect = contenedorRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = evento.clientX - rect.left;
      const y = evento.clientY - rect.top;
      setTooltip({
        x,
        y,
        nombre,
        m2,
        voltear: x + OFFSET_TOOLTIP + anchoTooltip.current > rect.width,
      });
    },
    [],
  );

  if (!GEOMETRIA_LISTA) {
    return (
      <div
        className={`rounded-md border border-dashed border-ink-40 bg-surface-sunken p-8 text-center text-sm leading-relaxed text-ink-70 ${className ?? ""}`}
      >
        <p className="m-0 font-semibold">Mapa pendiente de generar</p>
        <p className="m-0 mt-2">
          Deja un GeoJSON de los 32 estados en{" "}
          <code className="rounded-sm bg-ink/8 px-1 py-0.5">
            data/estados.geojson
          </code>{" "}
          y corre{" "}
          <code className="rounded-sm bg-ink/8 px-1 py-0.5">
            npm run build:map
          </code>
          .
        </p>
      </div>
    );
  }

  return (
    <div
      ref={contenedorRef}
      className={`relative ${className ?? ""}`}
      onMouseLeave={() => setTooltip(null)}
    >
      {/* Sin JS no hay IntersectionObserver: que el mapa se vea igual. */}
      <noscript>
        <style>{`.mapa-entrada{opacity:1!important}`}</style>
      </noscript>

      <svg
        viewBox={`0 0 ${MAPA_ANCHO} ${MAPA_ALTO}`}
        className="h-auto w-full"
        aria-hidden="true"
      >
        <g
          className="mapa-entrada transition-opacity"
          style={{
            opacity: mostrar ? 1 : 0,
            transitionDuration: `${sinAnimacion ? 0 : ENTRADA_MS}ms`,
          }}
        >
          {ESTADOS.map((estado) => {
            const presencia = conPresencia.has(estado.id);
            return (
              <path
                key={estado.id}
                d={estado.d}
                className={`${presencia ? RELLENO.presencia : RELLENO.sinPresencia} ${TRAZO} transition-[fill] duration-200`}
                onMouseMove={
                  presencia
                    ? (evento) =>
                        seguirCursor(evento, estado.nombre, m2PorEstado?.[estado.id])
                    : undefined
                }
                onMouseLeave={presencia ? () => setTooltip(null) : undefined}
              />
            );
          })}
        </g>
      </svg>

      {tooltip && (
        <div
          ref={tooltipRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 z-10 hidden whitespace-nowrap rounded-sm bg-ink px-2.5 py-1.5 text-small font-semibold text-cream shadow-card [@media(hover:hover)]:block"
          style={{
            transform: `translate(${
              tooltip.voltear
                ? `calc(${tooltip.x}px - 100% - ${OFFSET_TOOLTIP}px)`
                : `${tooltip.x + OFFSET_TOOLTIP}px`
            }, ${tooltip.y + OFFSET_TOOLTIP}px)`,
          }}
        >
          <span className="block">{tooltip.nombre}</span>
          {/*
            El bloque va SIEMPRE, con cifra o sin ella: así se ve que ahí va esa
            información aunque Altea todavía no la haya entregado. Sin dato se
            pinta un guion, NO un cero, que diría "cero metros construidos".
          */}
          <span className="mt-1.5 block text-eyebrow font-semibold uppercase tracking-wide text-cream/60">
            m² construidos
          </span>
          <span className="block font-display text-h3 font-semibold tabular-nums">
            {tooltip.m2 !== undefined ? (
              tooltip.m2.toLocaleString("es-MX")
            ) : (
              <span aria-label="Dato pendiente">—</span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
