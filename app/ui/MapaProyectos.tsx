"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  ESTADOS,
  GEOMETRIA_LISTA,
  MAPA_ALTO,
  MAPA_ANCHO,
  type EstadoId,
} from "@/lib/mexico-estados";
import type { Proyecto } from "@/lib/proyectos";

/* ------------------------------------------------------------------ *
 * Calibración visual. Los tres niveles de jerarquía, juntos y arriba.
 * ------------------------------------------------------------------ */
const RELLENO = {
  /** Nivel 1 — sin presencia de Altea. Decorativo, no interactivo. */
  sinPresencia: "fill-ink/10",
  /** Nivel 2 — con presencia, sin proyecto documentado. */
  presencia: "fill-coral/18 hover:fill-coral/32",
  /** Nivel 3 — con presencia y proyectos. Coral pleno + pin. */
  conProyectos: "fill-coral hover:fill-coral/90",
} as const;

/** Contorno del estado seleccionado. No se le sube el brillo: destaca por contraste. */
const TRAZO_SELECCION = "stroke-cream [stroke-width:1.5]";
const TRAZO_BASE = "stroke-cream/40 [stroke-width:0.8]";
/** Los demás bajan a este nivel cuando hay selección. */
const OPACIDAD_ATENUADA = "opacity-60";

/* ------------------------------------------------------------------ *
 * Altura reservada del panel.
 *
 * El panel cambia de contenido al seleccionar estados, y sin altura fija ese
 * cambio movía el copy de la columna de al lado. Se reserva el caso más alto y
 * lo sobrante queda en blanco.
 *
 * En vez de un número suelto, se compone de las tres piezas del panel, así que
 * si un estado llega a 3 proyectos la reserva se ajusta sola.
 * ------------------------------------------------------------------ */
/** Eyebrow + título del estado + su gap. */
const ALTO_ENCABEZADO_PX = 94;
/** Una ficha de proyecto: nombre, ciudad y descripción a dos líneas. */
const ALTO_FICHA_PX = 104;
/** Enlace "Ver todo" más el gap que lo separa de la lista. */
const ALTO_PIE_PX = 41;

/** Fade entre contenidos. La altura ya no cambia: no hay nada más que animar. */
const FADE_MS = 150;

/** Entrada al scroll. */
const ENTRADA_MS = 300;
const STAGGER_PIN_MS = 40;
/** Separación del tooltip respecto al cursor. */
const OFFSET_TOOLTIP = 12;

type Tooltip = { x: number; y: number; texto: string; voltear: boolean };

/**
 * `prefers-reduced-motion` como fuente externa suscrita, no como estado que se
 * fija dentro de un efecto: así no hay render en cascada y además reacciona si
 * el usuario cambia la preferencia con la página abierta.
 * El snapshot de servidor es `false` para que el HTML no dependa del cliente.
 */
function useMovimientoReducido() {
  return useSyncExternalStore(
    (alCambiar) => {
      const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
      consulta.addEventListener("change", alCambiar);
      return () => consulta.removeEventListener("change", alCambiar);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export interface MapaProyectosProps {
  /** Se reciben por prop, no se importan: así cambiar la fuente de datos
   *  (Sanity, API, lo que sea) no toca este componente. */
  proyectos: Proyecto[];
  /**
   * Estados donde Altea tiene presencia. Superconjunto de los estados que
   * aparecen en `proyectos`: presencia y proyecto documentado son distintos.
   */
  estadosConPresencia: readonly EstadoId[];
  /** Países además de México. El total se calcula como 1 + esta lista. */
  paisesAdicionales?: readonly string[];
  /**
   * `split` pone el panel al lado del mapa en pantallas grandes; `stacked` lo
   * deja siempre debajo, para cuando el mapa ya vive dentro de una columna.
   * @default "split"
   */
  layout?: "split" | "stacked";
  className?: string;
}

export function MapaProyectos({
  proyectos,
  estadosConPresencia,
  paisesAdicionales = [],
  layout = "split",
  className,
}: MapaProyectosProps) {
  const [seleccion, setSeleccion] = useState<EstadoId | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [visible, setVisible] = useState(false);
  const sinAnimacion = useMovimientoReducido();
  // Con movimiento reducido nada se anima: se muestra de una.
  const mostrar = visible || sinAnimacion;

  const panelRef = useRef<HTMLDivElement>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const anchoTooltip = useRef(0);

  const conPresencia = useMemo(
    () => new Set<EstadoId>(estadosConPresencia),
    [estadosConPresencia],
  );

  const porEstado = useMemo(() => {
    const mapa = new Map<EstadoId, Proyecto[]>();
    for (const proyecto of proyectos) {
      const lista = mapa.get(proyecto.estado);
      if (lista) lista.push(proyecto);
      else mapa.set(proyecto.estado, [proyecto]);
    }
    return mapa;
  }, [proyectos]);

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

  const alternar = useCallback((id: EstadoId) => {
    setSeleccion((actual) => {
      const siguiente = actual === id ? null : id;
      if (siguiente && typeof window !== "undefined") {
        // En móvil el panel queda debajo del mapa: hay que llevar al usuario ahí.
        if (window.matchMedia("(max-width: 1023px)").matches) {
          requestAnimationFrame(() =>
            panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
          );
        }
      }
      return siguiente;
    });
  }, []);

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

  useEffect(() => {
    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setSeleccion(null);
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, []);

  /** Sólo los estados con pin, ya indexados, para que el stagger no salte. */
  const pines = useMemo(
    () =>
      ESTADOS.filter((estado) => {
        if (!conPresencia.has(estado.id)) return false;
        return (porEstado.get(estado.id)?.length ?? 0) > 0;
      }).map((estado, indice) => ({
        estado,
        lista: porEstado.get(estado.id) ?? [],
        indice,
      })),
    [conPresencia, porEstado],
  );

  /** Reserva calculada sobre el estado con más proyectos. */
  const alturaPanel = useMemo(() => {
    const maximo = Math.max(
      1,
      ...[...porEstado.values()].map((lista) => lista.length),
    );
    return ALTO_ENCABEZADO_PX + maximo * ALTO_FICHA_PX + ALTO_PIE_PX;
  }, [porEstado]);

  const estadoActivo = seleccion ? ESTADOS.find((e) => e.id === seleccion) : null;
  const proyectosActivos = seleccion ? (porEstado.get(seleccion) ?? []) : [];
  const totalPaises = 1 + paisesAdicionales.length;

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
          <style>{`.mapa-entrada{opacity:1!important;transform:none!important}`}</style>
        </noscript>

        <svg
          viewBox={`0 0 ${MAPA_ANCHO} ${MAPA_ALTO}`}
          className="h-auto w-full"
          role="group"
          aria-label="Mapa de presencia de Altea por estado"
        >
          {/* Los 32 contornos entran juntos. */}
          <g
            className="mapa-entrada transition-opacity"
            style={{
              opacity: mostrar ? 1 : 0,
              transitionDuration: `${sinAnimacion ? 0 : ENTRADA_MS}ms`,
            }}
          >
            {ESTADOS.map((estado) => {
              // Nivel 1 — sin presencia.
              if (!conPresencia.has(estado.id)) {
                return (
                  <path
                    key={estado.id}
                    d={estado.d}
                    aria-hidden="true"
                    className={`${RELLENO.sinPresencia} ${TRAZO_BASE} ${
                      seleccion ? OPACIDAD_ATENUADA : ""
                    } transition-opacity duration-200`}
                  />
                );
              }

              const lista = porEstado.get(estado.id) ?? [];
              const tieneProyectos = lista.length > 0;
              const activo = seleccion === estado.id;
              const etiqueta = tieneProyectos
                ? `${estado.nombre}: ${lista.length} ${lista.length === 1 ? "proyecto" : "proyectos"}`
                : `${estado.nombre}: presencia de Altea`;
              const textoTooltip = tieneProyectos
                ? `${estado.nombre} · ${lista.length} ${lista.length === 1 ? "proyecto" : "proyectos"}`
                : estado.nombre;

              // Niveles 2 y 3 — con presencia, siempre seleccionable.
              return (
                <path
                  key={estado.id}
                  d={estado.d}
                  tabIndex={0}
                  role="button"
                  aria-label={etiqueta}
                  aria-pressed={activo}
                  onClick={() => alternar(estado.id)}
                  onMouseMove={(evento) => seguirCursor(evento, textoTooltip)}
                  onMouseLeave={() => setTooltip(null)}
                  onKeyDown={(evento) => {
                    if (evento.key === "Enter" || evento.key === " ") {
                      evento.preventDefault();
                      alternar(estado.id);
                    }
                  }}
                  className={[
                    "cursor-pointer outline-none transition-[fill,opacity,stroke] duration-200",
                    tieneProyectos ? RELLENO.conProyectos : RELLENO.presencia,
                    activo ? TRAZO_SELECCION : TRAZO_BASE,
                    seleccion && !activo ? OPACIDAD_ATENUADA : "",
                    "focus-visible:stroke-coral focus-visible:[stroke-width:3]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
              );
            })}
          </g>

          {/* Los pines entran después, escalonados. */}
          {pines.map(({ estado, lista, indice }) => {
            const [cx, cy] = estado.centroide;
            const activo = seleccion === estado.id;
            const retraso = sinAnimacion ? 0 : ENTRADA_MS + indice * STAGGER_PIN_MS;

            return (
              <g
                key={`pin-${estado.id}`}
                className="group mapa-entrada pointer-events-none transition-[opacity,transform]"
                style={{
                  opacity: mostrar ? 1 : 0,
                  transform: mostrar ? "translateY(0)" : "translateY(10px)",
                  transitionDuration: `${sinAnimacion ? 0 : ENTRADA_MS}ms`,
                  transitionDelay: `${retraso}ms`,
                }}
              >
                <g
                  className="transition-transform duration-200 group-hover:scale-[1.18]"
                  style={{ transformOrigin: `${cx}px ${cy}px` }}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={lista.length > 1 ? 13 : 8}
                    className={activo ? "fill-cream" : "fill-ink"}
                  />
                  {lista.length > 1 && (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={`text-[15px] font-bold ${activo ? "fill-ink" : "fill-cream"}`}
                    >
                      {lista.length}
                    </text>
                  )}
                </g>
                {/* Área de toque: CDMX, Tlaxcala, Morelos y Colima son casi
                    impintables con el dedo. */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={22}
                  fill="transparent"
                  className="pointer-events-auto cursor-pointer"
                  onClick={() => alternar(estado.id)}
                  aria-hidden="true"
                />
              </g>
            );
          })}
        </svg>

        {/* Sólo identifica; el detalle vive en el panel. Oculto en táctil. */}
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
        Un solo espacio que cambia de contenido, con la altura del caso más alto
        reservada. `min-h` se aplica sólo donde las columnas van lado a lado: en
        una sola columna sobraría hueco.
        - split:   el propio grid del componente parte en `lg`.
        - stacked: parte el grid de la sección que lo contiene (Nuestra Huella,
                   a 900px). Si esa sección cambia de breakpoint, este también.
      */}
      <div
        ref={panelRef}
        aria-live="polite"
        className={`flex scroll-mt-8 flex-col justify-start gap-5 ${
          layout === "split"
            ? "lg:min-h-(--altura-panel)"
            : "min-[900px]:min-h-(--altura-panel)"
        }`}
        style={{ "--altura-panel": `${alturaPanel}px` } as CSSProperties}
      >
      <div
        key={seleccion ?? "__resumen"}
        className="animate-aparecer flex flex-col gap-5"
        style={{ animationDuration: `${sinAnimacion ? 0 : FADE_MS}ms` }}
      >
        {estadoActivo ? (
          <>
            <div>
              <p className="m-0 text-eyebrow font-semibold uppercase tracking-wide text-coral">
                {proyectosActivos.length
                  ? `${proyectosActivos.length} ${proyectosActivos.length === 1 ? "proyecto" : "proyectos"}`
                  : "Presencia"}
              </p>
              <h3 className="m-0 font-display text-h2 font-semibold text-cream">
                {estadoActivo.nombre}
              </h3>
            </div>

            {proyectosActivos.length ? (
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {proyectosActivos.map((proyecto) => (
                  <li key={proyecto.id} className="border-t border-border-subtle-on-dark pt-3">
                    <p className="m-0 font-semibold text-cream">{proyecto.nombre}</p>
                    {proyecto.ciudad && (
                      <p className="m-0 text-small text-cream/70">{proyecto.ciudad}</p>
                    )}
                    {proyecto.descripcion && (
                      <p className="m-0 mt-1 text-small text-cream/70">{proyecto.descripcion}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="m-0 border-t border-border-subtle-on-dark pt-3 text-body leading-relaxed text-cream/70">
                Altea ha desarrollado proyectos en {estadoActivo.nombre}.
              </p>
            )}

            <button
              type="button"
              onClick={() => setSeleccion(null)}
              className="self-start text-small font-semibold text-cream/70 underline underline-offset-4 transition-colors hover:text-coral"
            >
              Ver todo
            </button>
          </>
        ) : (
          <>
            <dl className="m-0 grid grid-cols-3 gap-5">
              {[
                { valor: estadosConPresencia.length, etiqueta: "Estados" },
                { valor: proyectos.length, etiqueta: "Proyectos" },
                { valor: totalPaises, etiqueta: "Países" },
              ].map((cifra) => (
                <div key={cifra.etiqueta} className="flex flex-col-reverse gap-1">
                  <dt className="text-small font-semibold uppercase tracking-wide text-cream/70">
                    {cifra.etiqueta}
                  </dt>
                  <dd className="m-0 font-display text-[clamp(2rem,3.4vw,3rem)] font-bold leading-none tracking-tight text-cream tabular-nums">
                    {cifra.valor}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="m-0 border-t border-border-subtle-on-dark pt-4 text-small leading-relaxed text-cream/70">
              Selecciona un estado en el mapa para ver su detalle.
            </p>
          </>
        )}
      </div>
      </div>
    </div>
  );
}
