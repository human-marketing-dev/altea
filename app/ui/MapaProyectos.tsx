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

type Tooltip = { x: number; y: number; texto: string; voltear: boolean };

export interface MapaProyectosProps {
  /**
   * Estados donde Altea tiene presencia. Se reciben por prop, no se importan:
   * así cambiar la fuente de datos no toca este componente.
   */
  estadosConPresencia: readonly EstadoId[];
  /**
   * `split` pone la lista al lado del mapa en pantallas grandes; `stacked` la
   * deja siempre debajo, para cuando el mapa ya vive dentro de una columna.
   * @default "split"
   */
  layout?: "split" | "stacked";
  className?: string;
}

/**
 * Mapa de presencia.
 *
 * El mapa es DECORATIVO: `aria-hidden`, sin foco y sin rol. La información la
 * lleva la lista de al lado, como texto real — se puede copiar, la indexa un
 * buscador y un lector de pantalla la recorre como lo que es.
 *
 * Antes cada estado era un `role="button"` con `tabIndex`. Al quitarle la
 * acción al clic eso dejaba 21 paradas de teclado que no llevaban a ningún
 * lado y 21 "botón" anunciados sin nada que pulsar. Un botón que no hace nada
 * es peor que no tener botón.
 *
 * El hover se queda como adorno de puntero: oscurece el estado y saca su
 * nombre. No carga con ninguna responsabilidad, porque la lista ya la tiene.
 */
export function MapaProyectos({
  estadosConPresencia,
  layout = "split",
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

  /*
   * Alfabético, y no por región ni por número de proyectos: sin cifras a la
   * vista cualquier otro orden parece arbitrario, y quien mira la lista busca
   * un estado concreto.
   */
  const nombres = useMemo(
    () =>
      ESTADOS.filter((estado) => conPresencia.has(estado.id))
        .map((estado) => estado.nombre)
        .sort((a, b) => a.localeCompare(b, "es")),
    [conPresencia],
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
    if (tooltipRef.current) anchoTooltip.current = tooltipRef.current.offsetWidth;
  }, [tooltip?.texto]);

  const seguirCursor = useCallback((evento: ReactMouseEvent, texto: string) => {
    const rect = contenedorRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = evento.clientX - rect.left;
    const y = evento.clientY - rect.top;
    setTooltip({
      x,
      y,
      texto,
      voltear: x + OFFSET_TOOLTIP + anchoTooltip.current > rect.width,
    });
  }, []);

  if (!GEOMETRIA_LISTA) {
    return (
      <div className={`rounded-md border border-dashed border-ink-40 bg-surface-sunken p-8 text-center text-sm leading-relaxed text-ink-70 ${className ?? ""}`}>
        <p className="m-0 font-semibold">Mapa pendiente de generar</p>
        <p className="m-0 mt-2">
          Deja un GeoJSON de los 32 estados en{" "}
          <code className="rounded-sm bg-ink/8 px-1 py-0.5">data/estados.geojson</code> y corre{" "}
          <code className="rounded-sm bg-ink/8 px-1 py-0.5">npm run build:map</code>.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-8 ${
        layout === "split"
          ? "lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start"
          : ""
      } ${className ?? ""}`}
    >
      <div
        ref={contenedorRef}
        className="relative"
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
                    presencia ? (evento) => seguirCursor(evento, estado.nombre) : undefined
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
            {tooltip.texto}
          </div>
        )}
      </div>

      {/*
        La lista es la que lleva la información del mapa, así que va como texto
        de verdad. En varias columnas porque 21 nombres en una sola dejarían una
        tira muy alta al lado de un mapa apaisado.
      */}
      <div className="flex flex-col gap-3">
        <h3 className="m-0 text-eyebrow font-semibold uppercase tracking-wide text-coral">
          Estados con presencia
        </h3>
        <ul className="m-0 columns-2 gap-x-6 p-0 text-small leading-relaxed text-cream/70 sm:columns-3 lg:columns-2">
          {nombres.map((nombre) => (
            <li key={nombre} className="list-none break-inside-avoid">
              {nombre}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
