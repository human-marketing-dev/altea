"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ruta } from "@/lib/rutas";
import { useEffect, useState } from "react";

export interface NavLink {
  label: string;
  href: string;
  /** Se pinta como botón coral en vez de enlace. */
  destacado?: boolean;
}

export interface NavBarProps {
  links?: NavLink[];
  /** `light` sits on cream (dark logo/text), `dark` on ink. @default "light" */
  tone?: "light" | "dark";
  /**
   * Saca la barra del flujo para que flote sobre el hero del home.
   *
   * Sólo eso: el aspecto —velo, borde y sombra— lo decide `pegada`, igual en
   * todas las páginas. Antes este prop también le quitaba el fondo mientras el
   * hero estuviera abierto, atado a una bandera en el <body>; ya no hace falta.
   *
   * Lo pasa el home y nadie más: en las otras rutas la barra es `sticky` y ocupa
   * su hueco, que es lo que mantiene el aire sobre su primera sección.
   */
  transicionIntro?: boolean;
  homeHref?: string;
  className?: string;
}

/** Orden y contenido tomados del wireframe de portada. */
export const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: ruta("/") },
  { label: "Nosotros", href: ruta("/nosotros") },
  { label: "Comercial", href: ruta("/comercial") },
  { label: "Industrial", href: ruta("/industrial") },
  { label: "Vivienda", href: ruta("/vivienda") },
  { label: "Forestal", href: ruta("/forestal") },
  { label: "Contacto", href: ruta("/contacto"), destacado: true },
];

/**
 * Barra superior. Sticky, con el wordmark y los enlaces principales.
 *
 * Por debajo de 900px los siete enlaces no caben, así que se pliegan en un
 * panel que abre con el botón de menú.
 */
export function NavBar({
  links = DEFAULT_NAV_LINKS,
  tone = "light",
  transicionIntro = false,
  homeHref = ruta("/"),
  className,
}: NavBarProps) {
  const isLight = tone === "light";
  const [abierto, setAbierto] = useState(false);
  const [pegada, setPegada] = useState(false);
  const [oculta, setOculta] = useState(false);
  const rutaActual = usePathname();

  /*
   * Los dos comportamientos de la cápsula, en un solo listener pasivo.
   *
   * 1 · EL FONDO ENTRA AL DESPEGARSE. Arriba del todo la barra va limpia: sobre
   *     el hero, una cápsula recortada sobre el propio hero se ve peor que sin
   *     nada. A partir de DESPEGUE entran el velo, el borde y la sombra.
   *
   * 2 · SE ESCONDE AL BAJAR Y VUELVE AL SUBIR, a partir de ARRANQUE. Con dos
   *     guardas contra el parpadeo, y las dos hacen falta: UMBRAL ignora los
   *     movimientos de menos de 6px —el temblor de un dedo en un trackpad— y
   *     SEGUIDAS exige tres lecturas en la misma dirección, que es lo que evita
   *     que un rebote la haga aparecer y desaparecer.
   *
   * Se lee `scrollY` en el propio evento en vez de en un rAF: son dos
   * comparaciones y un setState que React descarta cuando el valor no cambia.
   */
  useEffect(() => {
    const DESPEGUE = 24;
    const ARRANQUE = 240;
    const UMBRAL = 6;
    const SEGUIDAS = 3;

    let ultimo = window.scrollY;
    let bajando = 0;

    const alScroll = () => {
      const y = window.scrollY;
      setPegada(y > DESPEGUE);

      const delta = y - ultimo;
      if (Math.abs(delta) > UMBRAL) {
        bajando = delta > 0 ? bajando + 1 : 0;
        setOculta(y > ARRANQUE && bajando >= SEGUIDAS);
        ultimo = y;
      }
    };

    window.addEventListener("scroll", alScroll, { passive: true });
    // Por si la página carga ya desplazada, p. ej. al recargar a media altura.
    const cuadro = requestAnimationFrame(alScroll);
    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener("scroll", alScroll);
    };
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [abierto]);

  const classes = [
    "altea-navbar",
    isLight ? null : "altea-navbar--dark",
    transicionIntro ? "altea-navbar--intro" : null,
    pegada ? "altea-navbar--pegada" : null,
    oculta ? "altea-navbar--oculta" : null,
    abierto ? "altea-navbar--abierto" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav className={classes}>
      <Link
        href={homeHref}
        aria-label="Altea — inicio"
        className="altea-navbar__marca"
      >
        <Image
          className="altea-navbar__logo"
          src={`/brand/logos/altea-logo-${isLight ? "dark" : "light"}.svg`}
          alt="Altea"
          width={1632}
          height={324}
          priority
          unoptimized
        />
      </Link>

      <button
        type="button"
        className="altea-navbar__toggle"
        aria-expanded={abierto}
        aria-controls="altea-nav-menu"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        onClick={() => {
          setAbierto((valor) => !valor);
          /* Con el menú abierto la barra no puede esconderse: se llevaría el
             panel con ella. Se resuelve aquí y no en un efecto sobre `abierto`
             porque sería un setState en cascada por un evento que ya estamos
             atendiendo. */
          setOculta(false);
        }}
      >
        <span className="altea-navbar__toggle-barra" aria-hidden="true" />
        <span className="altea-navbar__toggle-barra" aria-hidden="true" />
        <span className="altea-navbar__toggle-barra" aria-hidden="true" />
      </button>

      <div id="altea-nav-menu" className="altea-navbar__links">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              link.destacado
                ? "altea-navbar__link altea-navbar__link--destacado"
                : "altea-navbar__link"
            }
            aria-current={rutaActual === link.href ? "page" : undefined}
            /* Cerrar al navegar: más directo que reaccionar al cambio de ruta
               dentro de un efecto, que dispara un render en cascada. */
            onClick={() => setAbierto(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
