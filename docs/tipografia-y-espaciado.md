# Tipografía y espaciado — inventario

**html font-size: no se declara en ningún sitio → 16 px** (el navegador por defecto; `html` en `app/globals.css` sólo fija `scroll-padding-top`). Todas las conversiones de rem de este documento usan 1rem = 16 px.

Inventario sin cambios, sacado del código en el commit `1bf935c` (13-10-2026). No hay propuesta de escala: sólo lo que existe.

## 0 · Cómo se midió

- **Sólo lo que se pinta.** Se recorrió el grafo de imports desde cada `page.tsx` y `app/layout.tsx`. Lo que no es alcanzable (lista en el apéndice) no entra en las cuentas. Marcas del home se lista pero no cuenta: está detrás de `MOSTRAR_MARCAS = false` (lib/marcas.ts:8). MuroMarcas de /comercial sí cuenta (`MOSTRAR_MARCAS_COMERCIAL = true`, _comercial/content.ts:626).
- **Cuatro anchos: 390, 768, 1440, 1920.** El vw se resuelve contra el ancho. Para los valores en vh/svh hace falta un alto, y se supuso **390×844, 768×1024, 1440×900, 1920×1080**. Esto importa en el espaciado vertical, que está casi todo en vh: por eso a 1440 sale menos que a 768 (900 de alto contra 1024).
- **Las @media se aplican por ancho.** Donde una regla cambia el valor, la columna "Valor escrito" lista las dos con su línea.
- **Redondeo a 0.1 px.** Los "<8 %" se comparan a los cuatro anchos a la vez: dos valores son casi iguales sólo si lo son en los cuatro.
- **"Hereda 1.5"** quiere decir que el título no declara `line-height` y le llega el `line-height: 1.5` que el preflight de Tailwind pone en `html`.

## 1 · Los títulos

### 1.1 Tabla completa

| # | Página | Componente | Selector · css | Elemento | Valor escrito | 390 | 768 | 1440 | 1920 | line-height | letter-spacing | Nota |
|---|---|---|---|---|---|---:|---:|---:|---:|---|---|---|
| 1 | / | app/_home/heroA/HeroA.tsx:153 | `.hero-a__titulo` | h1 | `var(--text-display-2)` (hero-a.css:169) · `var(--text-display-1)` (hero-a.css:106) | 36 | 44 | 72 | 88 | 0.95 | -0.046em | ≤700px cambia de token: display-2 |
| 2 | / | app/_home/FraseCifras.tsx:48 | `.home-frase__texto` | p | `clamp(1.5rem, 3.5vw, 2.9rem)` (secciones.css:21) | 24 | 26.9 | 46.4 | 46.4 | 1.16 | -0.032em | frase de apertura; hace de título de la sección |
| 3 | / | app/_home/CarpetasUnidades.tsx:149 | `.home-carpetas__titulo` | h2 | `clamp(1.65rem, 3.4vw, 2.6rem)` (secciones.css:215) | 26.4 | 26.4 | 41.6 | 41.6 | 1.04 | var(--tracking-tight) = -0.01em |  |
| 4 | / | app/_home/CarpetasUnidades.tsx:185 | `.home-carpetas__nombre` | h3 | `clamp(1.7rem, 3.6vw, 3rem)` (secciones.css:364) | 27.2 | 27.6 | 48 | 48 | 1 | -0.04em |  |
| 5 | / | app/_home/Emblem.tsx:143 | `.home-emblem__text` | p | `var(--text-display-2)` (home.css:588) | 36 | 36 | 51.8 | 60 | var(--leading-display) = 0.98 | -0.05em | frase grande de la sección Emblem |
| 6 | / | app/ui/CarrilTarjetas.tsx:208 | `.altea-carril__titulo` | h2 | `clamp(1.65rem, 3.4vw, 2.6rem)` (components.css:2329) | 26.4 | 26.4 | 41.6 | 41.6 | 1.04 | var(--tracking-tight) = -0.01em |  |
| 7 | / · /comercial | app/ui/TarjetaProyecto.tsx:67 | `.altea-tj__txt b` | b | `clamp(1rem, 1.5vw, 1.35rem)` (components.css:2517) | 16 | 16 | 21.6 | 21.6 | — (hereda 1.5 del preflight) | -0.025em | nombre en la tarjeta; mismo selector en el carril del home y el carrusel de plazas |
| 8 | / | app/_home/CarrilProyectos.tsx:85 | `.home-ficha__nombre` | h3 | `clamp(1.6rem, 3.6vw, 2.7rem)` (secciones.css:586) | 25.6 | 27.6 | 43.2 | 43.2 | 0.98 | -0.045em |  |
| 9 | todas menos /contacto | app/ui/SectionHeading.tsx:44 (vía CierreContacto.tsx:58) | `.altea-section-heading__title` | h2 | `var(--text-h1)` (components.css:325) | 30 | 30 | 37.4 | 44 | var(--leading-heading) = 1.1 | — (normal) | mismo selector que el h1 de /contacto |
| 10 | / (APAGADO) | app/ui/Marcas.tsx:53 | `.altea-marcas__titulo` | h2 | `var(--text-h2)` (components.css:984) | 24 | 24 | 28.8 | 32 | var(--leading-heading) = 1.1 | — (normal) | no se pinta: MOSTRAR_MARCAS = false (lib/marcas.ts:8) |
| 11 | /comercial | app/_comercial/HeroCalado.tsx:338 | `.com-hero__t` | h1 | `clamp(3rem, 15.4vw, 15rem)` (comercial.css:189) | 60.1 | 118.3 | 221.8 | 240 | 0.84 (en .com-hero__tx) | -0.062em (en .com-hero__tx) | JS le escribe font-size en línea al hacer scroll (HeroCalado.tsx:195); la tabla da el reposo |
| 12 | /comercial | app/_comercial/HeroCalado.tsx:382 | `.com-hero__lockup` | p (aria-hidden) | `clamp(2.6rem, 12vw, 11rem)` (comercial.css:409) | 46.8 | 92.2 | 172.8 | 176 | 0.84 (en .com-hero__vuelve) | -0.062em (en .com-hero__vuelve) | repetición del h1 al cerrar el hero; el p hereda (font-size: inherit) del div .com-hero__lockup |
| 13 | /comercial | app/ui/CarruselTarjetas.tsx:234 | `.altea-carrusel__titulo` | h2 | `clamp(1.8rem, 3.8vw, 2.9rem)` (components.css:2549) | 28.8 | 29.2 | 46.4 | 46.4 | 1.02 | var(--tracking-tight) = -0.01em |  |
| 14 | /comercial | app/_comercial/FichaComercial.tsx:107 | `.com-fx__nombre` | h3 | `clamp(1.5rem, 2.6vw, 2.2rem)` (comercial.css:616) | 24 | 24 | 35.2 | 35.2 | 1.02 | -0.04em | ficha de plazas y de próximos (el mismo componente) |
| 15 | /comercial | app/_comercial/OtrosGiros.tsx:23 | `.com-giros__titulo` | h2 | `clamp(1.8rem, 3.8vw, 2.9rem)` (comercial.css:482) | 28.8 | 29.2 | 46.4 | 46.4 | 1.02 | var(--tracking-tight) = -0.01em |  |
| 16 | /comercial | app/_comercial/OtrosGiros.tsx:45 | `.com-gr__t h3` | h3 | `clamp(1.2rem, 2.2vw, 1.8rem)` (comercial.css:869) | 19.2 | 19.2 | 28.8 | 28.8 | — (hereda 1.5) | -0.03em |  |
| 17 | /comercial | app/_comercial/MuroMarcas.tsx:85 | `.com-marcas__titulo` | h2 | `clamp(1.5rem, 3vw, 2.3rem)` (comercial.css:919) | 24 | 24 | 36.8 | 36.8 | 1.02 | var(--tracking-tight) = -0.01em |  |
| 18 | /comercial | app/_comercial/ProximosComercial.tsx:38 | `.com-prox__titulo` | h2 | `clamp(1.8rem, 4vw, 3.1rem)` (comercial.css:1117) | 28.8 | 30.7 | 49.6 | 49.6 | 1.02 | var(--tracking-tight) = -0.01em |  |
| 19 | /comercial | app/_comercial/ProximosComercial.tsx:79 | `.com-px__t b` | b | `clamp(1rem, 1.5vw, 1.35rem)` (comercial.css:1184) | 16 | 16 | 21.6 | 21.6 | 1.14 | -0.025em | nombre en la tarjeta de próximos |
| 20 | /nosotros | app/_nosotros/HeroNube.tsx:254 | `.nos-hero__titulo` | h1 | `clamp(2rem, 7.6vw, 3.6rem)` (nosotros.css:1311) · `clamp(2rem, 4.6vw, 4.4rem)` (nosotros.css:74) | 32 | 57.6 | 66.2 | 70.4 | 0.96 | -0.048em | ≤900px otra regla: clamp(2rem, 7.6vw, 3.6rem) |
| 21 | /nosotros | app/_nosotros/Origen.tsx:75 | `.nos-origen__frase` | p | `clamp(1.8rem, 4vw, 3.4rem)` (nosotros.css:163) | 28.8 | 30.7 | 54.4 | 54.4 | 1.02 | -0.05em | frase de Origen; el aria-labelledby de la sección apunta al rótulo de 14px, no a esta frase |
| 22 | /nosotros | app/_nosotros/Pilares.tsx:24 | `.nos-pilares__titulo` | h2 | `clamp(1.8rem, 3.8vw, 2.9rem)` (nosotros.css:239) | 28.8 | 29.2 | 46.4 | 46.4 | 1.02 | var(--tracking-tight) = -0.01em |  |
| 23 | /nosotros | app/_nosotros/Pilares.tsx:33 | `.nos-pilar__titulo` | h3 | `clamp(1.05rem, 1.7vw, 1.4rem)` (nosotros.css:271) | 16.8 | 16.8 | 22.4 | 22.4 | 1.08 | -0.02em |  |
| 24 | /nosotros | app/_nosotros/GrupoFirma.tsx:168 | `.nos-firma__titulo` | h2 | `clamp(1.9rem, 4.2vw, 3.4rem)` (nosotros.css:292) | 30.4 | 32.3 | 54.4 | 54.4 | 1.02 | var(--tracking-tight) = -0.01em |  |
| 25 | /nosotros | app/_nosotros/Huella.tsx:22 | `.nos-huella__titulo` | h2 | `clamp(1.9rem, 4.2vw, 3.4rem)` (nosotros.css:772) | 30.4 | 32.3 | 54.4 | 54.4 | 1.02 | var(--tracking-tight) = -0.01em |  |
| 26 | /nosotros | app/_nosotros/MapaPuntos.tsx:412 | `.nos-mapa__dato b` | b | `clamp(1.1rem, 1.8vw, 1.5rem)` (nosotros.css:1002) | 17.6 | 17.6 | 24 | 24 | 1.1 | var(--tracking-tight) = -0.01em | nombre del lugar en el rótulo del mapa |
| 27 | /nosotros | app/_nosotros/ResponsabilidadSocial.tsx:23 | `.nos-rs__titulo` | h2 | `clamp(1.8rem, 3.8vw, 2.9rem)` (nosotros.css:1037) | 28.8 | 29.2 | 46.4 | 46.4 | 1.02 | var(--tracking-tight) = -0.01em |  |
| 28 | /nosotros | app/_nosotros/ResponsabilidadSocial.tsx:27 | `.nos-rs__sub` | p | `clamp(1.05rem, 1.5vw, 1.35rem)` (nosotros.css:1047) | 16.8 | 16.8 | 21.6 | 21.6 | — (hereda 1.5) | -0.02em | subtítulo junto al h2 |
| 29 | /industrial · /vivienda | app/ui/Proximamente.tsx:39 | — (Tailwind) | p | `text-h1` → `var(--text-h1)` = `clamp(1.875rem, 2.6vw, 2.75rem)` | 30 | 30 | 37.4 | 44 | `leading-tight` = 1.25 | — (normal) | no hay h1 en estas páginas |
| 30 | /forestal | app/ui/Proximamente.tsx:33 | — (Tailwind) | p | `text-h2` → `var(--text-h2)` = `clamp(1.5rem, 2vw, 2rem)` | 24 | 24 | 28.8 | 32 | — (hereda 1.5) | — (normal) | no hay h1 en esta página |
| 31 | /contacto | app/contacto/page.tsx:50 → SectionHeading.tsx:44 | `.altea-section-heading__title` | h1 | `var(--text-h1)` (components.css:325) | 30 | 30 | 37.4 | 44 | var(--leading-heading) = 1.1 | — (normal) | SectionHeading as="h1"; mismo selector que el h2 del cierre |
| 32 | /contacto | app/contacto/page.tsx:62, :95 | — (Tailwind) | h2 ×2 | `text-h3` → `var(--text-h3)` = `1.375rem` | 22 | 22 | 22 | 22 | — (hereda 1.5) | — (normal) | "Canales directos", "Por unidad de negocio" |
| 33 | /contacto | app/ui/LeadForm.tsx:40 | — (Tailwind) | p (estado enviado) | `text-h3` → `var(--text-h3)` = `1.375rem` | 22 | 22 | 22 | 22 | — (hereda 1.5) | — (normal) | sólo aparece tras enviar el formulario |
| 34 | todas | app/ui/Footer.tsx:125 | `.altea-footer__column-title` | span | `var(--text-small)` (components.css:715) | 14 | 14 | 14 | 14 | — (hereda 1.5) | var(--tracking-wide) = 0.06em | rótulo de columna; hace de título por función, no por tamaño |

### 1.2 Cifras (texto display que no es título)

Van aparte para no contaminar la cuenta de escalones, pero son del mismo tamaño que los títulos y compiten con ellos.

| Página | Componente | Selector | Elemento | Valor escrito | 390 | 768 | 1440 | 1920 | line-height | letter-spacing |
|---|---|---|---|---|---:|---:|---:|---:|---|---|
| / | app/_home/FraseCifras.tsx:75 | `.home-frase__cifra` | dd | `clamp(2.6rem, 7.4vw, 6.4rem)` (secciones.css:120) | 41.6 | 56.8 | 102.4 | 102.4 | 0.86 | -0.055em |
| /comercial | app/_comercial/HeroCalado.tsx:356 | `.com-hd__cifra` | dd | `clamp(2.1rem, 4.3vw, 3.6rem)` (comercial.css:341) | 33.6 | 33.6 | 57.6 | 57.6 | 0.9 | -0.05em |
| /comercial | app/_comercial/HeroCalado.tsx:389 | `.com-hc__cifra` | dd (aria-hidden) | `clamp(2.1rem, 4.6vw, 3.8rem)` (comercial.css:446) | 33.6 | 35.3 | 60.8 | 60.8 | 0.9 | -0.05em |
| /nosotros | app/_nosotros/Huella.tsx:38 | `.nos-hd__cifra` | dd | `clamp(1.6rem, 2.85vw, 4.6rem)` (nosotros.css:826) | 25.6 | 25.6 | 41 | 54.7 | 0.86 | -0.055em |
| /nosotros | app/_nosotros/MapaPuntos.tsx:412 | `.nos-mapa__dato span` | span | `clamp(1.3rem, 2.4vw, 2rem)` (nosotros.css:1008) | 20.8 | 20.8 | 32 | 32 | — (hereda 1.5) | -0.035em |

### 1.3 Cuántos escalones hay

**15 escalones de título** entre los 33 títulos vivos (agrupando los que difieren menos de 8 % a los cuatro anchos). Si se quitan el rótulo de columna del footer (14 px, título por función) y el lockup de /comercial (repite el h1, `aria-hidden`), quedan **13**. Con las cifras, **19**: ninguna cifra cae en un escalón de título.

| Escalón | 390 | 768 | 1440 | 1920 | Miembros | ¿Idénticos? |
|---|---:|---:|---:|---:|---|---|
| 1 | 60.1 | 118.3 | 221.8 | 240 | `.com-hero__t` (h1, /comercial) | único |
| 2 | 46.8 | 92.2 | 172.8 | 176 | `.com-hero__lockup` (p (aria-hidden), /comercial) | único |
| 3 | 36 | 44 | 72 | 88 | `.hero-a__titulo` (h1, /) | único |
| 4 | 32 | 57.6 | 66.2 | 70.4 | `.nos-hero__titulo` (h1, /nosotros) | único |
| 5 | 28.8–30.4 | 30.7–32.3 | 54.4 | 54.4 | `.nos-firma__titulo` (h2, /nosotros)<br>`.nos-huella__titulo` (h2, /nosotros)<br>`.nos-origen__frase` (p, /nosotros) | no: casi iguales (<8 %) |
| 6 | 36 | 36 | 51.8 | 60 | `.home-emblem__text` (p, /) | único |
| 7 | 27.2–28.8 | 27.6–30.7 | 46.4–49.6 | 46.4–49.6 | `.com-prox__titulo` (h2, /comercial)<br>`.home-carpetas__nombre` (h3, /)<br>`.altea-carrusel__titulo` (h2, /comercial)<br>`.com-giros__titulo` (h2, /comercial)<br>`.nos-rs__titulo` (h2, /nosotros)<br>`.nos-pilares__titulo` (h2, /nosotros) | no: cadena de casi iguales; los extremos se separan más de 8 % |
| 8 | 24–26.4 | 26.4–27.6 | 41.6–46.4 | 41.6–46.4 | `.home-frase__texto` (p, /)<br>`.home-ficha__nombre` (h3, /)<br>`.home-carpetas__titulo` (h2, /)<br>`.altea-carril__titulo` (h2, /) | no: cadena de casi iguales; los extremos se separan más de 8 % |
| 9 | 30 | 30 | 37.4 | 44 | `text-h1` (p, /industrial · /vivienda)<br>`.altea-section-heading__title` (h2, todas menos /contacto)<br>`.altea-section-heading__title` (h1, /contacto) | sí, mismo valor |
| 10 | 24 | 24 | 35.2–36.8 | 35.2–36.8 | `.com-marcas__titulo` (h2, /comercial)<br>`.com-fx__nombre` (h3, /comercial) | no: casi iguales (<8 %) |
| 11 | 19.2 | 19.2 | 28.8 | 28.8 | `.com-gr__t h3` (h3, /comercial) | único |
| 12 | 24 | 24 | 28.8 | 32 | `text-h2` (p, /forestal) | único |
| 13 | 16–17.6 | 16–17.6 | 21.6–24 | 21.6–24 | `.nos-mapa__dato b` (b, /nosotros)<br>`.nos-pilar__titulo` (h3, /nosotros)<br>`.altea-tj__txt b` (b, / · /comercial)<br>`.com-px__t b` (b, /comercial)<br>`.nos-rs__sub` (p, /nosotros) | no: cadena de casi iguales; los extremos se separan más de 8 % |
| 14 | 22 | 22 | 22 | 22 | `text-h3` (h2 ×2, /contacto)<br>`text-h3` (p (estado enviado), /contacto) | sí, mismo valor |
| 15 | 14 | 14 | 14 | 14 | `.altea-footer__column-title` (span, todas) | único |

### 1.4 Casi duplicados (<8 %)

Los escalones con más de un miembro de la tabla de arriba. Los que importan:

- **29 / 29 / 46 / 46 — cuatro h2 con el mismo `clamp(1.8rem, 3.8vw, 2.9rem)` copiado** en cuatro selectores de tres archivos: `.altea-carrusel__titulo` (components.css:2549), `.com-giros__titulo` (comercial.css:482), `.nos-pilares__titulo` (nosotros.css:239), `.nos-rs__titulo` (nosotros.css:1037). Pegados a ellos, a menos de 8 %, `.com-prox__titulo` (29 / 31 / 50 / 50, `clamp(1.8rem, 4vw, 3.1rem)`) y el h3 `.home-carpetas__nombre` (27 / 28 / 48 / 48). Entre prox y carpetas ya hay 11 % a 768: es una cadena, no un escalón limpio.
- **26 / 26 / 42 / 42 — `.home-carpetas__titulo` y `.altea-carril__titulo`**, el mismo `clamp(1.65rem, 3.4vw, 2.6rem)` escrito dos veces (secciones.css:215, components.css:2329). A menos de 8 %: el h3 `.home-ficha__nombre` (26 / 28 / 43 / 43) y, en cadena, la frase `.home-frase__texto` (24 / 27 / 46 / 46).
- **30 / 32 / 54 / 54 — `.nos-firma__titulo` y `.nos-huella__titulo`**, mismo `clamp(1.9rem, 4.2vw, 3.4rem)` dos veces, y la frase de Origen (29 / 31 / 54 / 54) a menos de 6 %.
- **30 / 30 / 37 / 44 — `var(--text-h1)`**: el h2 del cierre, el h1 de /contacto y la frase de Proximamente. Es el mismo token; aquí el duplicado es de uso, no de escritura (ver 1.6).
- **24 / 24 / 35–37 / 35–37 — `.com-marcas__titulo` (h2) y `.com-fx__nombre` (h3)**: un h2 de sección y el nombre en una ficha, escritos distinto, casi iguales.
- **16–18 / 16–18 / 22–24 / 22–24 — cinco títulos pequeños** con cuatro clamp distintos: `.altea-tj__txt b` y `.com-px__t b` (mismo `clamp(1rem, 1.5vw, 1.35rem)` dos veces), `.nos-pilar__titulo`, `.nos-rs__sub`, `.nos-mapa__dato b`.
- **22 fijo — `text-h3`** en los dos h2 de /contacto y en el mensaje de enviado del formulario.
- Entre las cifras: `.com-hd__cifra` y `.com-hc__cifra` (34 / 34 / 58 / 58 contra 34 / 35 / 61 / 61) son la misma cifra en reposo y en el cierre del hero, escrita con dos clamp.

### 1.5 Huérfanos (un solo uso en todo el sitio)

`.com-hero__t` (h1, /comercial) 60.1 / 118.3 / 221.8 / 240, `.com-hero__lockup` (p (aria-hidden), /comercial) 46.8 / 92.2 / 172.8 / 176, `.hero-a__titulo` (h1, /) 36 / 44 / 72 / 88, `.nos-hero__titulo` (h1, /nosotros) 32 / 57.6 / 66.2 / 70.4, `.home-emblem__text` (p, /) 36 / 36 / 51.8 / 60, `.com-gr__t h3` (h3, /comercial) 19.2 / 19.2 / 28.8 / 28.8, `text-h2` (p, /forestal) 24 / 24 / 28.8 / 32, `.altea-footer__column-title` (span, todas) 14 / 14 / 14 / 14.

Tres son h1 de página (/comercial, / y /nosotros) y el cuarto es el lockup que repite el de /comercial. Que un h1 sea único es lo esperable; que **ningún h1 comparta escalón con otro** —el cuarto, el de /contacto, comparte el suyo con el h2 del cierre— no. Los demás —`.home-emblem__text`, `.com-gr__t h3`, el "Altea Forestal" de Proximamente y el rótulo del footer— son tamaños que no comparte nadie más.

Cifras huérfanas: `.home-frase__cifra` (dd, /) 41.6 / 56.8 / 102.4 / 102.4, `.nos-hd__cifra` (dd, /nosotros) 25.6 / 25.6 / 41 / 54.7, `.nos-mapa__dato span` (span, /nosotros) 20.8 / 20.8 / 32 / 32.

### 1.6 Inversiones

#### Dentro de la misma página (las que rompen la jerarquía)

1. **/ — el h3 de cada carpeta es más grande que el h2 de su propia sección, a los cuatro anchos.** `.home-carpetas__nombre` 27.2 / 27.6 / 48 / 48 contra `.home-carpetas__titulo` 26.4 / 26.4 / 41.6 / 41.6: +3 %, +5 %, +15 %, +15 %.
2. **/ — el h3 de la ficha de proyecto es igual o más grande que el h2 del carril que la abre.** `.home-ficha__nombre` 25.6 / 27.6 / 43.2 / 43.2 contra `.altea-carril__titulo` 26.4 / 26.4 / 41.6 / 41.6: −3 % a 390, +5 % a 768, +4 % a 1440 y 1920. El orden se da la vuelta hacia ~757 px.
3. **/ — las cifras de FraseCifras son más grandes que el h1 del hero a los cuatro anchos.** `.home-frase__cifra` 41.6 / 56.8 / 102.4 / 102.4 contra `.hero-a__titulo` 36 / 44 / 72 / 88: +16 %, +29 %, +42 %, +16 %. Y `.home-emblem__text` (un p) mide lo mismo que el h1 a 390 (36 = 36: los dos son `--text-display-2` a ese ancho).
4. **El h2 del cierre cambia de lugar respecto de los otros h2 de la página según el ancho.** Es `var(--text-h1)`, una curva plana (2.6vw) que arranca alta y termina baja; los h2 de sección son curvas empinadas (3.4–4.2vw) que arrancan bajas y terminan altas.
   - En /: 30 / 30 / 37.4 / 44 contra 26.4 / 26.4 / 41.6 / 41.6 de carpetas y carril → mayor a 390 y 768 (+14 %), menor a 1440 (−10 %), mayor otra vez a 1920 (+6 %). Se cruzan dos veces, hacia ~909 y ~1650 px.
   - En /comercial: contra 28.8 / 29.2 / 46.4 / 46.4 (carrusel, giros) y 28.8 / 30.7 / 49.6 / 49.6 (próximos) → +4 % a 390, −19 % y −25 % a 1440.
   - En /nosotros: contra 30.4 / 32.3 / 54.4 / 54.4 (firma, huella) → empate a 390, −31 % a 1440, −19 % a 1920.
5. **/nosotros — el h1 decrece al cruzar 900 px.** A 900 vale 57.6 px (regla ≤900, `clamp(2rem, 7.6vw, 3.6rem)`, nosotros.css:1311) y a 901 vale 41.4 px (regla base, `clamp(2rem, 4.6vw, 4.4rem)`, nosotros.css:74): −28 % en un píxel. No vuelve a 57.6 hasta ~1252 px, así que entre 901 y 1252 el h1 es más chico que en una tablet. Es el único título no monótono del sitio. A los cuatro anchos de la tabla no se ve (32 / 57.6 / 66.2 / 70.4).
6. **/nosotros — h1 y h2 son el mismo escalón en el teléfono.** A 390 el h1 vale 32 y los h2 de Firma y Huella 30.4: 5 %.
7. **/nosotros — la cifra de Huella alcanza al h2 de su sección y sigue creciendo.** `.nos-hd__cifra` 25.6 / 25.6 / 41 / 54.7 contra `.nos-huella__titulo` 30.4 / 32.3 / 54.4 / 54.4: por debajo hasta ~1900 px, empate a 1920 (54.7 contra 54.4) y por encima de ahí, porque el h2 topa a 1295 px y la cifra no topa hasta 2582 px (73.6 px).
8. **/contacto — el h1 de la página es el h2 de todas las demás.** Mismo selector (`.altea-section-heading__title`, `--text-h1`): 30 / 30 / 37.4 / 44. A 1440 el h1 de /contacto (37) es más chico que cualquier h2 de sección de /comercial o /nosotros (46–54).
9. **/industrial, /vivienda, /forestal — no tienen h1.** El título visual es un `<p>` (Proximamente.tsx:33, :39); el único h de la página es el h2 del cierre.
10. **Entre páginas, los h1 no guardan orden.** / 36 / 44 / 72 / 88 contra /nosotros 32 / 57.6 / 66.2 / 70.4: mayor el del home a 390, mayor el de nosotros a 768 (+31 %), mayor el del home a 1440 (+9 %) y 1920 (+25 %). El de /comercial es otra escala (60.1 / 118.3 / 221.8 / 240) y el de /contacto es el más chico (30 / 30 / 37.4 / 44).

#### Todos los pares cuyo orden cambia entre anchos

71 pares (cuentan sólo si a un ancho uno supera al otro en más de 3 % y a otro ancho pasa al revés). La columna de la derecha es aproximadamente dónde se da la vuelta, buscado píxel a píxel entre 320 y 2560. Casi todos salen de la misma causa: **las dos familias de curvas** —los tokens `--text-h1` / `--text-h2` (2.6vw y 2vw) contra los clamp escritos en cada sección (3.4–4.2vw)— se cruzan siempre.

| A | A: 390 / 768 / 1440 / 1920 | B | B: 390 / 768 / 1440 / 1920 | El orden se invierte hacia (px de ventana) |
|---|---|---|---|---|
| `.hero-a__titulo` (h1, /) | 36 / 44 / 72 / 88 | `.nos-hero__titulo` (h1, /nosotros) | 32 / 57.6 / 66.2 / 70.4 | ~489, ~901 |
| `.home-frase__texto` (p, /) | 24 / 26.9 / 46.4 / 46.4 | `.home-carpetas__titulo` (h2, /) | 26.4 / 26.4 / 41.6 / 41.6 | ~1225 |
| `.home-frase__texto` (p, /) | 24 / 26.9 / 46.4 / 46.4 | `.altea-carril__titulo` (h2, /) | 26.4 / 26.4 / 41.6 / 41.6 | ~1225 |
| `.home-frase__texto` (p, /) | 24 / 26.9 / 46.4 / 46.4 | `.home-ficha__nombre` (h3, /) | 25.6 / 27.6 / 43.2 / 43.2 | ~1272 |
| `.home-frase__texto` (p, /) | 24 / 26.9 / 46.4 / 46.4 | `.altea-section-heading__title` (h2, todas menos /contacto) | 30 / 30 / 37.4 / 44 | ~883 |
| `.home-frase__texto` (p, /) | 24 / 26.9 / 46.4 / 46.4 | `text-h1` (p, /industrial · /vivienda) | 30 / 30 / 37.4 / 44 | ~883 |
| `.home-frase__texto` (p, /) | 24 / 26.9 / 46.4 / 46.4 | `.altea-section-heading__title` (h1, /contacto) | 30 / 30 / 37.4 / 44 | ~883 |
| `.home-frase__texto` (p, /) | 24 / 26.9 / 46.4 / 46.4 | `.nos-hd__cifra` (dd, /nosotros) | 25.6 / 25.6 / 41 / 54.7 | ~754, ~1679 |
| `.home-carpetas__titulo` (h2, /) | 26.4 / 26.4 / 41.6 / 41.6 | `.home-ficha__nombre` (h3, /) | 25.6 / 27.6 / 43.2 / 43.2 | ~757 |
| `.home-carpetas__titulo` (h2, /) | 26.4 / 26.4 / 41.6 / 41.6 | `.altea-section-heading__title` (h2, todas menos /contacto) | 30 / 30 / 37.4 / 44 | ~909, ~1650 |
| `.home-carpetas__titulo` (h2, /) | 26.4 / 26.4 / 41.6 / 41.6 | `text-h1` (p, /industrial · /vivienda) | 30 / 30 / 37.4 / 44 | ~909, ~1650 |
| `.home-carpetas__titulo` (h2, /) | 26.4 / 26.4 / 41.6 / 41.6 | `.altea-section-heading__title` (h1, /contacto) | 30 / 30 / 37.4 / 44 | ~909, ~1650 |
| `.home-carpetas__titulo` (h2, /) | 26.4 / 26.4 / 41.6 / 41.6 | `.nos-hd__cifra` (dd, /nosotros) | 25.6 / 25.6 / 41 / 54.7 | ~1505 |
| `.home-carpetas__nombre` (h3, /) | 27.2 / 27.6 / 48 / 48 | `.altea-section-heading__title` (h2, todas menos /contacto) | 30 / 30 / 37.4 / 44 | ~859 |
| `.home-carpetas__nombre` (h3, /) | 27.2 / 27.6 / 48 / 48 | `.altea-carrusel__titulo` (h2, /comercial) | 28.8 / 29.2 / 46.4 / 46.4 | ~1328 |
| `.home-carpetas__nombre` (h3, /) | 27.2 / 27.6 / 48 / 48 | `.com-giros__titulo` (h2, /comercial) | 28.8 / 29.2 / 46.4 / 46.4 | ~1328 |
| `.home-carpetas__nombre` (h3, /) | 27.2 / 27.6 / 48 / 48 | `.nos-pilares__titulo` (h2, /nosotros) | 28.8 / 29.2 / 46.4 / 46.4 | ~1328 |
| `.home-carpetas__nombre` (h3, /) | 27.2 / 27.6 / 48 / 48 | `.nos-rs__titulo` (h2, /nosotros) | 28.8 / 29.2 / 46.4 / 46.4 | ~1328 |
| `.home-carpetas__nombre` (h3, /) | 27.2 / 27.6 / 48 / 48 | `text-h1` (p, /industrial · /vivienda) | 30 / 30 / 37.4 / 44 | ~859 |
| `.home-carpetas__nombre` (h3, /) | 27.2 / 27.6 / 48 / 48 | `.altea-section-heading__title` (h1, /contacto) | 30 / 30 / 37.4 / 44 | ~859 |
| `.home-carpetas__nombre` (h3, /) | 27.2 / 27.6 / 48 / 48 | `.nos-hd__cifra` (dd, /nosotros) | 25.6 / 25.6 / 41 / 54.7 | ~1737 |
| `.home-emblem__text` (p, /) | 36 / 36 / 51.8 / 60 | `.nos-hero__titulo` (h1, /nosotros) | 32 / 57.6 / 66.2 / 70.4 | ~489 |
| `.home-emblem__text` (p, /) | 36 / 36 / 51.8 / 60 | `.nos-origen__frase` (p, /nosotros) | 28.8 / 30.7 / 54.4 / 54.4 | ~928, ~1557 |
| `.home-emblem__text` (p, /) | 36 / 36 / 51.8 / 60 | `.nos-firma__titulo` (h2, /nosotros) | 30.4 / 32.3 / 54.4 / 54.4 | ~884, ~1557 |
| `.home-emblem__text` (p, /) | 36 / 36 / 51.8 / 60 | `.nos-huella__titulo` (h2, /nosotros) | 30.4 / 32.3 / 54.4 / 54.4 | ~884, ~1557 |
| `.home-emblem__text` (p, /) | 36 / 36 / 51.8 / 60 | `.com-hd__cifra` (dd, /comercial) | 33.6 / 33.6 / 57.6 / 57.6 | ~864, ~1648 |
| `.home-emblem__text` (p, /) | 36 / 36 / 51.8 / 60 | `.com-hc__cifra` (dd (aria-hidden), /comercial) | 33.6 / 35.3 / 60.8 / 60.8 | ~807 |
| `.altea-carril__titulo` (h2, /) | 26.4 / 26.4 / 41.6 / 41.6 | `.home-ficha__nombre` (h3, /) | 25.6 / 27.6 / 43.2 / 43.2 | ~757 |
| `.altea-carril__titulo` (h2, /) | 26.4 / 26.4 / 41.6 / 41.6 | `.altea-section-heading__title` (h2, todas menos /contacto) | 30 / 30 / 37.4 / 44 | ~909, ~1650 |
| `.altea-carril__titulo` (h2, /) | 26.4 / 26.4 / 41.6 / 41.6 | `text-h1` (p, /industrial · /vivienda) | 30 / 30 / 37.4 / 44 | ~909, ~1650 |
| `.altea-carril__titulo` (h2, /) | 26.4 / 26.4 / 41.6 / 41.6 | `.altea-section-heading__title` (h1, /contacto) | 30 / 30 / 37.4 / 44 | ~909, ~1650 |
| `.altea-carril__titulo` (h2, /) | 26.4 / 26.4 / 41.6 / 41.6 | `.nos-hd__cifra` (dd, /nosotros) | 25.6 / 25.6 / 41 / 54.7 | ~1505 |
| `.home-ficha__nombre` (h3, /) | 25.6 / 27.6 / 43.2 / 43.2 | `.altea-section-heading__title` (h2, todas menos /contacto) | 30 / 30 / 37.4 / 44 | ~859 |
| `.home-ficha__nombre` (h3, /) | 25.6 / 27.6 / 43.2 / 43.2 | `text-h1` (p, /industrial · /vivienda) | 30 / 30 / 37.4 / 44 | ~859 |
| `.home-ficha__nombre` (h3, /) | 25.6 / 27.6 / 43.2 / 43.2 | `.altea-section-heading__title` (h1, /contacto) | 30 / 30 / 37.4 / 44 | ~859 |
| `.home-ficha__nombre` (h3, /) | 25.6 / 27.6 / 43.2 / 43.2 | `.nos-hd__cifra` (dd, /nosotros) | 25.6 / 25.6 / 41 / 54.7 | ~1563 |
| `.altea-section-heading__title` (h2, todas menos /contacto) | 30 / 30 / 37.4 / 44 | `.altea-carrusel__titulo` (h2, /comercial) | 28.8 / 29.2 / 46.4 / 46.4 | ~814 |
| `.altea-section-heading__title` (h2, todas menos /contacto) | 30 / 30 / 37.4 / 44 | `.com-giros__titulo` (h2, /comercial) | 28.8 / 29.2 / 46.4 / 46.4 | ~814 |
| `.altea-section-heading__title` (h2, todas menos /contacto) | 30 / 30 / 37.4 / 44 | `.com-prox__titulo` (h2, /comercial) | 28.8 / 30.7 / 49.6 / 49.6 | ~774 |
| `.altea-section-heading__title` (h2, todas menos /contacto) | 30 / 30 / 37.4 / 44 | `.nos-origen__frase` (p, /nosotros) | 28.8 / 30.7 / 54.4 / 54.4 | ~774 |
| `.altea-section-heading__title` (h2, todas menos /contacto) | 30 / 30 / 37.4 / 44 | `.nos-pilares__titulo` (h2, /nosotros) | 28.8 / 29.2 / 46.4 / 46.4 | ~814 |
| `.altea-section-heading__title` (h2, todas menos /contacto) | 30 / 30 / 37.4 / 44 | `.nos-rs__titulo` (h2, /nosotros) | 28.8 / 29.2 / 46.4 / 46.4 | ~814 |
| `.altea-section-heading__title` (h2, todas menos /contacto) | 30 / 30 / 37.4 / 44 | `.nos-hd__cifra` (dd, /nosotros) | 25.6 / 25.6 / 41 / 54.7 | ~1086 |
| `.altea-carrusel__titulo` (h2, /comercial) | 28.8 / 29.2 / 46.4 / 46.4 | `text-h1` (p, /industrial · /vivienda) | 30 / 30 / 37.4 / 44 | ~814 |
| `.altea-carrusel__titulo` (h2, /comercial) | 28.8 / 29.2 / 46.4 / 46.4 | `.altea-section-heading__title` (h1, /contacto) | 30 / 30 / 37.4 / 44 | ~814 |
| `.altea-carrusel__titulo` (h2, /comercial) | 28.8 / 29.2 / 46.4 / 46.4 | `.nos-hd__cifra` (dd, /nosotros) | 25.6 / 25.6 / 41 / 54.7 | ~1679 |
| `.com-giros__titulo` (h2, /comercial) | 28.8 / 29.2 / 46.4 / 46.4 | `text-h1` (p, /industrial · /vivienda) | 30 / 30 / 37.4 / 44 | ~814 |
| `.com-giros__titulo` (h2, /comercial) | 28.8 / 29.2 / 46.4 / 46.4 | `.altea-section-heading__title` (h1, /contacto) | 30 / 30 / 37.4 / 44 | ~814 |
| `.com-giros__titulo` (h2, /comercial) | 28.8 / 29.2 / 46.4 / 46.4 | `.nos-hd__cifra` (dd, /nosotros) | 25.6 / 25.6 / 41 / 54.7 | ~1679 |
| `.com-gr__t h3` (h3, /comercial) | 19.2 / 19.2 / 28.8 / 28.8 | `text-h3` (h2 ×2, /contacto) | 22 / 22 / 22 / 22 | ~1030 |
| `.com-gr__t h3` (h3, /comercial) | 19.2 / 19.2 / 28.8 / 28.8 | `text-h3` (p (estado enviado), /contacto) | 22 / 22 / 22 / 22 | ~1030 |
| `.com-prox__titulo` (h2, /comercial) | 28.8 / 30.7 / 49.6 / 49.6 | `text-h1` (p, /industrial · /vivienda) | 30 / 30 / 37.4 / 44 | ~773 |
| `.com-prox__titulo` (h2, /comercial) | 28.8 / 30.7 / 49.6 / 49.6 | `.altea-section-heading__title` (h1, /contacto) | 30 / 30 / 37.4 / 44 | ~773 |
| `.com-prox__titulo` (h2, /comercial) | 28.8 / 30.7 / 49.6 / 49.6 | `.nos-hd__cifra` (dd, /nosotros) | 25.6 / 25.6 / 41 / 54.7 | ~1795 |
| `.nos-hero__titulo` (h1, /nosotros) | 32 / 57.6 / 66.2 / 70.4 | `.com-hd__cifra` (dd, /comercial) | 33.6 / 33.6 / 57.6 / 57.6 | ~456 |
| `.nos-hero__titulo` (h1, /nosotros) | 32 / 57.6 / 66.2 / 70.4 | `.com-hc__cifra` (dd (aria-hidden), /comercial) | 33.6 / 35.3 / 60.8 / 60.8 | ~456 |
| `.nos-origen__frase` (p, /nosotros) | 28.8 / 30.7 / 54.4 / 54.4 | `text-h1` (p, /industrial · /vivienda) | 30 / 30 / 37.4 / 44 | ~773 |
| `.nos-origen__frase` (p, /nosotros) | 28.8 / 30.7 / 54.4 / 54.4 | `.altea-section-heading__title` (h1, /contacto) | 30 / 30 / 37.4 / 44 | ~773 |
| `.nos-pilares__titulo` (h2, /nosotros) | 28.8 / 29.2 / 46.4 / 46.4 | `text-h1` (p, /industrial · /vivienda) | 30 / 30 / 37.4 / 44 | ~814 |
| `.nos-pilares__titulo` (h2, /nosotros) | 28.8 / 29.2 / 46.4 / 46.4 | `.altea-section-heading__title` (h1, /contacto) | 30 / 30 / 37.4 / 44 | ~814 |
| `.nos-pilares__titulo` (h2, /nosotros) | 28.8 / 29.2 / 46.4 / 46.4 | `.nos-hd__cifra` (dd, /nosotros) | 25.6 / 25.6 / 41 / 54.7 | ~1679 |
| `.nos-mapa__dato b` (b, /nosotros) | 17.6 / 17.6 / 24 / 24 | `text-h3` (h2 ×2, /contacto) | 22 / 22 / 22 / 22 | ~1259 |
| `.nos-mapa__dato b` (b, /nosotros) | 17.6 / 17.6 / 24 / 24 | `text-h3` (p (estado enviado), /contacto) | 22 / 22 / 22 / 22 | ~1259 |
| `.nos-rs__titulo` (h2, /nosotros) | 28.8 / 29.2 / 46.4 / 46.4 | `text-h1` (p, /industrial · /vivienda) | 30 / 30 / 37.4 / 44 | ~814 |
| `.nos-rs__titulo` (h2, /nosotros) | 28.8 / 29.2 / 46.4 / 46.4 | `.altea-section-heading__title` (h1, /contacto) | 30 / 30 / 37.4 / 44 | ~814 |
| `.nos-rs__titulo` (h2, /nosotros) | 28.8 / 29.2 / 46.4 / 46.4 | `.nos-hd__cifra` (dd, /nosotros) | 25.6 / 25.6 / 41 / 54.7 | ~1679 |
| `text-h1` (p, /industrial · /vivienda) | 30 / 30 / 37.4 / 44 | `.nos-hd__cifra` (dd, /nosotros) | 25.6 / 25.6 / 41 / 54.7 | ~1086 |
| `text-h2` (p, /forestal) | 24 / 24 / 28.8 / 32 | `.nos-mapa__dato span` (span, /nosotros) | 20.8 / 20.8 / 32 / 32 | ~1031 |
| `.altea-section-heading__title` (h1, /contacto) | 30 / 30 / 37.4 / 44 | `.nos-hd__cifra` (dd, /nosotros) | 25.6 / 25.6 / 41 / 54.7 | ~1086 |
| `text-h3` (h2 ×2, /contacto) | 22 / 22 / 22 / 22 | `.nos-mapa__dato span` (span, /nosotros) | 20.8 / 20.8 / 32 / 32 | ~946 |
| `text-h3` (p (estado enviado), /contacto) | 22 / 22 / 22 / 22 | `.nos-mapa__dato span` (span, /nosotros) | 20.8 / 20.8 / 32 / 32 | ~946 |

### 1.7 Títulos que miden con vw dentro de una caja estrecha

El vw escala contra la ventana. Cuando el título vive en una columna, una tarjeta o un diálogo, la caja deja de crecer (o se parte en dos en un corte de rejilla) y la letra sigue creciendo igual. La columna **"Línea en em"** es el ancho de la caja dividido entre el font-size: cuántos em caben por línea. Cuando ese número cae de golpe en un corte, el título pasa a romper en muchas más líneas sin que nadie haya tocado su tamaño — es el caso de la frase de Origen.

Notas para leerla: "Tramo donde manda el vw" es el rango de ventana en que el clamp no está topado. "Solape" es donde coinciden ese tramo y la caja estrecha: ahí el título crece mientras su caja no lo hace en proporción. Varios llevan además un `max-width` en ch (`.nos-origen__frase` 16ch, `.nos-huella__titulo` 11ch, `.nos-rs__titulo` 13ch, `.nos-pilar__titulo` 12ch): ese tope escala con la letra, así que mientras la caja sea más ancha que el tope, la línea la fija el tope; la caja pasa a mandar cuando es más estrecha que él.

| Título | Caja | Caja 390 / 768 / 1440 / 1920 (px) | Caja ÷ viewport | Tramo donde manda el vw | Tramo con caja estrecha | Solape | Línea en em: justo antes → justo después del corte | Línea en em a 1440 / 1920 |
|---|---|---|---|---|---|---|---|---|
| `.home-carpetas__nombre` (h3, /) | columna de texto de la carpeta: 46 % de la rejilla 46/54 >900px, menos su padding (secciones.css:331, :350) | 298 / 636 / 492 / 702 | 76 % / 83 % / 34 % / 37 % | `clamp(1.7rem, 3.6vw, 3rem)` → 756–1333 px | >900px | 901–1333 px | 23.0 → 9.5 | 10.3 / 14.6 |
| `.altea-tj__txt b` (b, / · /comercial) | tarjeta del carrusel de plazas: clamp(260px, 32vw, 480px), ≤820 clamp(220px, 74vw, 320px), menos padding (components.css:2643, :2663, :2509). En el carril del home el ancho sale del alto que mide JS (--alto-tarjeta) | 257 / 288 / 405 / 424 | 66 % / 38 % / 28 % / 22 % | `clamp(1rem, 1.5vw, 1.35rem)` → 1067–1440 px | siempre (tarjeta) | 1067–1440 px | 17.9 → 14.4 | 18.7 / 19.6 |
| `.home-ficha__nombre` (h3, /) | diálogo min(880px, 94vw), el nombre va absoluto sobre la foto con left/right clamp(20px, 3vw, 38px) (secciones.css:486, :586) | 327 / 676 / 804 / 804 | 84 % / 88 % / 56 % / 42 % | `clamp(1.6rem, 3.6vw, 2.7rem)` → 711–1200 px | ≥936px (diálogo fijo en 880) | 936–1200 px | — (sin corte de columnas) | 18.6 / 18.6 |
| `.altea-section-heading__title` (h2, todas menos /contacto) | cuerpo del cierre: columna 6fr de 4fr/6fr >1100, 1fr/1fr 901–1100, padding izq. 64px; y dentro .altea-section-heading max-width 640px (components.css:2149, :2220, :311) | 350 / 640 / 640 / 640 | 90 % / 83 % / 44 % / 33 % | `var(--text-h1)` → 1154–1692 px | >900px (columna) y ≥~1280px (tope fijo de 640px) | 1154–1692 px | 21.3 → 11.4 | 17.1 / 14.5 |
| `.altea-section-heading__title` (h1, /contacto) | .altea-section-heading max-width 640px en sección a todo el ancho (components.css:311) | 350 / 640 / 640 / 640 | 90 % / 83 % / 44 % / 33 % | `var(--text-h1)` → 1154–1692 px | ≥~712px (tope fijo de 640px) | 1154–1692 px | — (sin corte de columnas) | 17.1 / 14.5 |
| `.com-fx__nombre` (h3, /comercial) | diálogo min(1040px, 94vw), nombre absoluto con left/right clamp(24px, 3.4vw, 46px) (comercial.css:505, :616) | 319 / 670 / 948 / 948 | 82 % / 87 % / 66 % / 49 % | `clamp(1.5rem, 2.6vw, 2.2rem)` → 923–1354 px | ≥1106px (diálogo fijo en 1040) | 1106–1354 px | — (sin corte de columnas) | 26.9 / 26.9 |
| `.com-gr__t h3` (h3, /comercial) | una de las 3 láminas en fila flex >900 (1.5 / 0.85 al hover), menos padding clamp(18px, 2.4vw, 32px) (comercial.css:773, :805, :861) | 314 / 654 / 365 / 519 | 81 % / 85 % / 25 % / 27 % | `clamp(1.2rem, 2.2vw, 1.8rem)` → 873–1309 px | >900px | 901–1309 px | 38.7 → 11.3 | 12.7 / 18.0 |
| `.com-px__t b` (b, /comercial) | una de 3 columnas de .com-prox__grid >900, menos padding clamp(16px, 2vw, 28px) (comercial.css:1122, :1176) | 318 / 659 / 373 / 527 | 82 % / 86 % / 26 % / 27 % | `clamp(1rem, 1.5vw, 1.35rem)` → 1067–1440 px | >900px | 1067–1440 px | 48.4 → 14.4 | 17.3 / 24.4 |
| `.nos-hero__titulo` (h1, /nosotros) | .nos-hero__txt width min(100%, 54vw) >900, padding izq. --container-pad y der. clamp(16px, 3vw, 40px) (nosotros.css:59, :1307) | 354 / 707 / 666 / 917 | 91 % / 92 % / 46 % / 48 % | `clamp(2rem, 4.6vw, 4.4rem)` → 696–1530 px | >900px | 901–1530 px | 14.4 → 10.0 | 10.0 / 13.0 |
| `.nos-origen__frase` (p, /nosotros) | columna 1 de .nos-origen__grid 1fr/0.92fr >900 (nosotros.css:118, :1316) | 350 / 691 / 638 / 871 | 90 % / 90 % / 44 % / 45 % | `clamp(1.8rem, 4vw, 3.4rem)` → 720–1360 px | >900px | 901–1360 px | 22.5 → 11.1 | 11.7 / 16.0 |
| `.nos-pilar__titulo` (h3, /nosotros) | una de 3 columnas de .nos-pilares__grid, a todos los anchos (nosotros.css:247, :1333) | 107 / 217 / 399 / 545 | 28 % / 28 % / 28 % / 28 % | `clamp(1.05rem, 1.7vw, 1.4rem)` → 988–1318 px | siempre (3 columnas también en 390) | 988–1318 px | — (sin corte de columnas) | 17.8 / 24.3 |
| `.nos-firma__titulo` (h2, /nosotros) | columna 1fr de .nos-firma__cab 1fr/44 % >900 (nosotros.css:285, :1321) | 350 / 691 / 654 / 900 | 90 % / 90 % / 45 % / 47 % | `clamp(1.9rem, 4.2vw, 3.4rem)` → 724–1295 px | >900px | 901–1295 px | 21.4 → 10.8 | 12.0 / 16.5 |
| `.nos-huella__titulo` (h2, /nosotros) | columna 36 % de .nos-huella >980 (nosotros.css:747, :1154) | 350 / 691 / 467 / 634 | 90 % / 90 % / 32 % / 33 % | `clamp(1.9rem, 4.2vw, 3.4rem)` → 724–1295 px | >980px | 981–1295 px | 21.4 → 7.7 | 8.6 / 11.6 |
| `.nos-rs__titulo` (h2, /nosotros) | columna 38 % de .nos-rs__cab >900 (nosotros.css:1030, :1321) | 350 / 691 / 492 / 669 | 90 % / 90 % / 34 % / 35 % | `clamp(1.8rem, 3.8vw, 2.9rem)` → 758–1221 px | >900px | 901–1221 px | 23.7 → 9.0 | 10.6 / 14.4 |
| `.nos-rs__sub` (p, /nosotros) | columna 62 % de .nos-rs__cab >900 (nosotros.css:1030) | 350 / 691 / 746 / 1014 | 90 % / 90 % / 52 % / 53 % | `clamp(1.05rem, 1.5vw, 1.35rem)` → 1120–1440 px | >900px | 1120–1440 px | 48.2 → 27.8 | 34.5 / 47.0 |
| `.nos-mapa__dato b` (b, /nosotros) | rótulo del mapa width min(34 %, 290px) dentro de la columna 64 % de Huella >980 (nosotros.css:965, :1175) | 350 / 691 / 258 / 290 | 90 % / 90 % / 18 % / 15 % | `clamp(1.1rem, 1.8vw, 1.5rem)` → 978–1333 px | >980px | 981–1333 px | 50.0 → 9.9 | 10.7 / 12.1 |
| `.nos-hd__cifra` (dd, /nosotros) | columna 36 % de .nos-huella >980, más la escalera margin-left i × clamp(0px, 5.5vw, 90px) (nosotros.css:747, :809) | 350 / 691 / 467 / 634 | 90 % / 90 % / 32 % / 33 % | `clamp(1.6rem, 2.85vw, 4.6rem)` → 898–2582 px | >980px | 981–2582 px | 31.6 → 11.4 | 11.4 / 11.6 |
| `.nos-mapa__dato span` (span, /nosotros) | rótulo del mapa min(34 %, 290px) (nosotros.css:965) | 350 / 691 / 258 / 290 | 90 % / 90 % / 18 % / 15 % | `clamp(1.3rem, 2.4vw, 2rem)` → 867–1333 px | >980px | 981–1333 px | 37.5 → 7.5 | 8.0 / 9.1 |

Lo que dice la tabla:

- **Los cortes de 900/980 px parten la línea a la mitad o menos** en todos los títulos de rejilla de /nosotros: Huella 21.4 → 7.7 em, RS 23.7 → 9.0, Origen 22.5 → 11.1, Firma 21.4 → 10.8, h1 del hero 14.4 → 10.0 (y aquí además baja la letra, ver 1.6 punto 5). En el home, el h3 de las carpetas 23.0 → 9.5.
- **Los más estrechos a 1440**: `.nos-huella__titulo` (8.6 em por línea, en el 32 % de la ventana) y el rótulo del mapa `.nos-mapa__dato span` (8.0 em en 258 px).
- **`.nos-hd__cifra` es el único que no topa en ningún ancho de la tabla**: sigue en vw hasta 2582 px dentro de una columna del 33 %.
- **El encabezado del cierre y el h1 de /contacto crecen dentro de una caja fija de 640 px** (`.altea-section-heading`, components.css:311): de 30 a 44 px entre 1154 y 1692 px de ventana sin que la caja se mueva.
- **Las dos fichas (diálogos)** quedan fijas en 880 / 1040 px a partir de 936 / 1106 px de ventana, y su nombre sigue en vw hasta 1200 / 1354.
- Las tarjetas (`.altea-tj__txt b`, `.com-px__t b`) y las láminas de OtrosGiros también miden con vw. En la tarjeta del carrusel la caja también es vw (32vw), así que crecen casi en proporción; las de rejilla de 3 columnas no (48.4 → 14.4 em al cruzar 900 en Próximos).

### 1.8 Dónde vive la tipografía

- **Hay una escala de tokens en un solo sitio** (`@theme` de app/globals.css: `--text-display-1` … `--text-eyebrow`, `--leading-*`, `--tracking-*`), **pero los títulos casi no la usan.** De los 33 títulos vivos, 9 salen de un token (hero-a, emblem, encabezado del cierre / h1 de contacto, los dos de Proximamente, los dos h2 de contacto, el mensaje del formulario, el rótulo del footer) y 24 llevan un `clamp()` escrito a mano en el CSS de su sección.
- **Los nombres de los tokens no corresponden al elemento.** `--text-h1` lo usan un h2 (cierre), un h1 (contacto) y un p (Proximamente); `--text-h2`, en vivo, sólo un p ("Altea Forestal") y el h2 de Marcas apagado; `--text-h3` ningún h3 (lo usan dos h2 y un p, vía Tailwind). Ningún h3 vivo usa un token.
- **Uso real de los tokens:** `--text-h3` no aparece en ningún CSS vivo (sólo a través de la utilidad `text-h3`); `--leading-display` lo usa un solo selector (`.home-emblem__text`), y el h1 del home, que es el display por excelencia, escribe `line-height: 0.95` a mano; `--leading-heading` sólo el encabezado del cierre / contacto. Los h2 de sección escriben `line-height: 1.02` o `1.04` cada uno.
- **Tailwind y CSS propio, mezclados en tres archivos:** Proximamente.tsx, contacto/page.tsx, LeadForm.tsx usan `text-h1/h2/h3`, `text-eyebrow`, `leading-tight`, `leading-relaxed`, `tracking-wide`. El resto del sitio es CSS propio. **En caso de choque manda el CSS propio, siempre**: en el CSS que genera el build (`.next/static`) las utilidades de Tailwind van dentro de `@layer utilities`, y las hojas del proyecto (components.css, home.css, secciones.css, comercial.css, nosotros.css…) van sin capa; una regla sin capa gana a cualquier regla en capa sin importar la especificidad. Hoy no hay ningún elemento que reciba las dos.
- **`text-h1` / `text-h3` sólo ponen `font-size`.** El token no define `--text-h1--line-height`, así que la utilidad no trae interlineado y el título hereda el 1.5 del preflight — por eso los h2 de /contacto y la frase de Forestal van a 1.5, contra 0.95–1.1 del resto del sitio.
- **El preflight de Tailwind pone `h1…h6 { font-size: inherit; font-weight: inherit }`**: un h sin clase sale del tamaño del texto que lo rodea.
- **`!important`: dos en todo el CSS, ninguno de tipografía ni de espaciado** — `transform: none !important` (components.css:2676, movimiento reducido) y `display: none !important` (nosotros.css:1207, ramas del organigrama ≤1000).
- **Estilos en línea en el JSX: ninguno de tipografía.** Los `style={…}` del JSX sólo pasan variables (`--i`, `--u-color`, `--factor`, `--proporcion`…). **La excepción es JavaScript:** HeroCalado escribe `font-size` en línea en el h1 de /comercial en cada fotograma del scroll (HeroCalado.tsx:131, :195), y un estilo en línea gana a cualquier hoja. El valor de reposo sale del CSS; cualquier cambio a `.com-hero__t` lo va a reescalar el JS.

## 2 · El espaciado

### 2.1 Margen lateral de página

**El token existe: `--container-pad: clamp(20px, 5vw, 80px)`** (app/ui/tokens.css:99) → 20 / 38.4 / 72 / 80 px. Lo usan 24 declaraciones vivas:

NavBar (components.css:373) · Footer (:628) · Marcas del home, apagado (:986) · cabecera y pista del carril (:2327, :2350) · cabecera, pista, `scroll-padding` y barra del carrusel (:2546, :2615, :2621, :2651) · cuerpo del cierre, lado derecho (:2228; ≤900 los dos lados, :2257) · titular de HeroA (hero-a.css:100) · FraseCifras (secciones.css:18) · CarpetasUnidades (secciones.css:179) · Emblem (home.css:502) · HeroCalado y su cierre (comercial.css:60, :397) · OtrosGiros (:761) · MuroMarcas (:917) · ProximosComercial (:1115) · HeroNube, lado izquierdo (nosotros.css:64) · Origen (:108) · Pilares (:237) · GrupoFirma (:282) · Huella (:750) · ResponsabilidadSocial (:1028) · Proximamente y las dos secciones de /contacto, con la utilidad de Tailwind `px-(--container-pad)` (Proximamente.tsx:22, contacto/page.tsx:49, :59).

**Los sitios donde el borde del contenido NO es el token:**

| Dónde | css | Valor escrito | 390 | 768 | 1440 | 1920 | Nota |
|---|---|---|---:|---:|---:|---:|---|
| --container-pad (el token) | tokens.css:99 | `clamp(20px, 5vw, 80px)` | 20 | 38.4 | 72 | 80 | 24 declaraciones vivas, lista abajo |
| NavBar: borde de la píldora | components.css:360 / :580 | `margin var(--space-4) · ≤900 var(--space-3)` | 12 | 12 | 16 | 16 | la barra flota separada del borde |
| NavBar: borde del logo | components.css:360 | `margin + padding var(--container-pad)` | 32 | 50.4 | 88 | 96 | no cae sobre la línea del contenido: queda 12–16 px hacia dentro |
| CorporateVideo ≤900 | home.css:693 | `margin: var(--space-3)` | 12 | 12 | 0 | 0 | >900 es full-bleed (0) |
| HeroNube, borde derecho del texto | nosotros.css:59 | `padding-right clamp(16px, 3vw, 40px)` | 16 | 23 | 40 | 40 | ≤900 el texto ocupa todo el ancho, así que este valor es el margen derecho de página; el izquierdo sí es el token |
| Ficha de proyectos (diálogo) | secciones.css:486 | `width: min(880px, 94vw)` | 11.7 | 23 | 280 | 520 | centrado; 3vw por lado hasta 936 px |
| Ficha comercial (diálogo) | comercial.css:505 | `width: min(1040px, 94vw)` | 11.7 | 23 | 200 | 440 | centrado; 3vw por lado hasta 1106 px |
| Emblem: arranque del texto | home.css:502 + :514 | `token + padding clamp(26px, 5vw, 76px)` | 46 | 76.8 | 144 | 156 | marco interior; además max-width min(1300px, 92vw) centrado |
| Cierre: lado de la imagen | components.css:2220 | `padding-left var(--space-8)` | 20 | 38.4 | 64 | 64 | es medianil entre imagen y texto, no borde de página; ≤900 vuelve al token |
| Full-bleed deliberado | varios | `0` | 0 | 0 | 0 | 0 | ver lista |

- **Valores distintos de margen lateral: 6** donde arranca algo en el borde de la página — el token, `var(--space-3)` (12 px: vídeo y barra en móvil), `var(--space-4)` (16 px: barra en escritorio), `clamp(16px, 3vw, 40px)` (derecha del hero de nosotros), 3vw de los diálogos (`94vw`) y 0 (full-bleed). Contando la suma de la barra (token + margen) como su propio valor, 7. El marco de Emblem y el medianil del cierre son interiores y no entran en la cuenta.
- **Casi iguales (<8 %):** los diálogos a 390 (11.7 px) y el `var(--space-3)` del vídeo (12 px) — sólo en ese ancho; a 768 ya son 23 contra 12.
- **El que más se ve:** el logo de la barra arranca 12–16 px hacia dentro de la línea donde arranca todo el contenido (88 contra 72 a 1440).
- **Full-bleed a propósito:** la escena del HeroA, la foto calada de /comercial (`.com-hero__lleno`), el lienzo del hero de /nosotros, el vídeo >900 (`.home-video { padding: 0 }`), la imagen del cierre (`.altea-cierre__media`), los fondos de banda (Huella ink, MuroMarcas / RS / cierre sunken, footer ink, Proximamente y cabecera de /contacto ink), y las pistas del carril y del carrusel, que arrancan en el token y se van por el borde derecho. Las escaleras de FraseCifras (`margin-left: calc(var(--i) * clamp(0px, 12vw, 180px))`) y de las cifras de Huella (`clamp(0px, 5.5vw, 90px)`) desplazan el contenido hacia dentro a propósito.

### 2.2 Ancho máximo de contenido

- **`--container-max: 1280px` está definido (tokens.css:98) y no lo usa nada**: cero declaraciones, ni vivas ni muertas. **No hay contenedor con max-width en el sitio.**
- El ancho de contenido es la ventana menos dos veces el token: **350 / 691 / 1296 / 1760 px**, y sigue creciendo sin techo (2400 px en una pantalla de 2560).
- Topes locales, cada uno el suyo: `.altea-section-heading` `max-width: 640px` (components.css:311, el único tope en px del sitio), el marco de Emblem `min(1300px, 92vw)` (home.css:514), las fichas `min(880px, 94vw)` y `min(1040px, 94vw)`, el texto del hero de /nosotros `min(100%, 54vw)`, y topes de medida en ch/em en los textos (`16ch`, `18ch`, `12ch`, `11ch`, `13ch`, `38ch`, `27ch`, `16ch` en títulos; `43em` en la frase de FraseCifras; `44ch`–`54ch` en párrafos; `max-w-[26ch]` y `max-w-[46ch]` en Proximamente).

### 2.3 Ritmo vertical entre secciones

| Página | Sección | css | Fondo | padding-top escrito | 390 | 768 | 1440 | 1920 | padding-bottom escrito | 390 | 768 | 1440 | 1920 | Nota |
|---|---|---|---|---|---:|---:|---:|---:|---|---:|---:|---:|---:|---|
| / | HeroA | hero-a.css:27 | page | `— (300svh, escena sticky)` | — | — | — | — | `—` | — | — | — | — |  |
| / | FraseCifras | secciones.css:17 | page | `clamp(80px, 16vh, 210px)` | 135 | 163.8 | 144 | 172.8 | `clamp(50px, 9vh, 110px)` | 76 | 92.2 | 81 | 97.2 |  |
| / | CorporateVideo | home.css:160 | page | `0` | 0 | 0 | 0 | 0 | `0` | 0 | 0 | 0 | 0 | ≤900: el marco lleva margin 12px (space-3) en los cuatro lados |
| / | CarpetasUnidades | secciones.css:174 | page | `clamp(76px, 13vh, 160px)` | 109.7 | 133.1 | 117 | 140.4 | `0` | 0 | 0 | 0 | 0 | padding-bottom 0 acoplado a la pila (margin-bottom −pausa + cola de pausa) |
| / | Emblem | home.css:497 | page | `clamp(90px, 18vh, 240px)` | 151.9 | 184.3 | 162 | 194.4 | `clamp(90px, 18vh, 240px)` | 151.9 | 184.3 | 162 | 194.4 |  |
| / | CarrilProyectos (.altea-carril__fijo) | components.css:2298 | page | `clamp(30px, 5vh, 64px)` | 42.2 | 51.2 | 45 | 54 | `clamp(30px, 5vh, 64px)` | 42.2 | 51.2 | 45 | 54 | la sección no tiene padding; lo lleva el marco sticky de 100svh |
| todas* | CierreContacto (.altea-cierre__body) | components.css:2220 / 2254 | sunken | `var(--space-9) · ≤900 var(--space-8)` | 64 | 64 | 96 | 96 | `var(--space-9) · ≤900 var(--space-8)` | 64 | 64 | 96 | 96 | 96 px >900, 64 px ≤900 |
| todas | Footer | components.css:616 / 701 | ink | `var(--aire-footer) = clamp(80px, 12vh, 160px) · ≤900 clamp(var(--space-8), 9vh, 112px)` | 76 | 92.2 | 108 | 129.6 | `calc(var(--aire-footer) / 2)` | 38 | 46.1 | 54 | 64.8 |  |
| /comercial | HeroCalado | comercial.css:52 | page | `clamp(92px, 13vh, 140px)` | 109.7 | 133.1 | 117 | 140 | `clamp(26px, 4.4vh, 50px)` | 37.1 | 45.1 | 39.6 | 47.5 | min-height 100svh |
| /comercial | CarrilPlazas (.altea-carrusel) | components.css:2538 | page | `clamp(70px, 13vh, 170px)` | 109.7 | 133.1 | 117 | 140.4 | `clamp(70px, 13vh, 170px)` | 109.7 | 133.1 | 117 | 140.4 |  |
| /comercial | OtrosGiros | comercial.css:760 | page | `clamp(70px, 13vh, 170px)` | 109.7 | 133.1 | 117 | 140.4 | `clamp(70px, 13vh, 170px)` | 109.7 | 133.1 | 117 | 140.4 |  |
| /comercial | MuroMarcas | comercial.css:915 | sunken | `clamp(66px, 12vh, 150px)` | 101.3 | 122.9 | 108 | 129.6 | `clamp(66px, 12vh, 150px)` | 101.3 | 122.9 | 108 | 129.6 |  |
| /comercial | ProximosComercial | comercial.css:1114 | page | `clamp(70px, 13vh, 170px)` | 109.7 | 133.1 | 117 | 140.4 | `clamp(70px, 13vh, 170px)` | 109.7 | 133.1 | 117 | 140.4 |  |
| /nosotros | HeroNube (.nos-hero__txt) | nosotros.css:59 | page | `clamp(100px, 16vh, 190px)` | 135 | 163.8 | 144 | 172.8 | `clamp(20px, 3vh, 44px)` | 25.3 | 30.7 | 27 | 32.4 | la sección no tiene padding; min-height 100svh |
| /nosotros | Origen | nosotros.css:107 | page | `clamp(80px, 15vh, 200px)` | 126.6 | 153.6 | 135 | 162 | `clamp(60px, 11vh, 140px)` | 92.8 | 112.6 | 99 | 118.8 |  |
| /nosotros | Pilares | nosotros.css:234 | page | `clamp(70px, 13vh, 170px)` | 109.7 | 133.1 | 117 | 140.4 | `clamp(70px, 13vh, 170px)` | 109.7 | 133.1 | 117 | 140.4 |  |
| /nosotros | GrupoFirma | nosotros.css:281 | page | `clamp(66px, 12vh, 150px)` | 101.3 | 122.9 | 108 | 129.6 | `clamp(56px, 10vh, 120px)` | 84.4 | 102.4 | 90 | 108 |  |
| /nosotros | Huella | nosotros.css:747 | ink | `clamp(70px, 13vh, 170px)` | 109.7 | 133.1 | 117 | 140.4 | `clamp(70px, 13vh, 170px)` | 109.7 | 133.1 | 117 | 140.4 |  |
| /nosotros | ResponsabilidadSocial | nosotros.css:1025 | sunken | `clamp(70px, 13vh, 170px)` | 109.7 | 133.1 | 117 | 140.4 | `clamp(70px, 13vh, 170px)` | 109.7 | 133.1 | 117 | 140.4 |  |
| /industrial · /vivienda · /forestal | Proximamente | Proximamente.tsx:22 | ink | `var(--space-9)` | 96 | 96 | 96 | 96 | `var(--space-9)` | 96 | 96 | 96 | 96 | Tailwind py-(--space-9); min-h-[62vh] |
| /contacto | Cabecera (section 1) | contacto/page.tsx:49 | ink | `var(--space-9)` | 96 | 96 | 96 | 96 | `var(--space-9)` | 96 | 96 | 96 | 96 | Tailwind |
| /contacto | Canales + formulario (section 2) | contacto/page.tsx:59 | page | `var(--space-9)` | 96 | 96 | 96 | 96 | `var(--space-9)` | 96 | 96 | 96 | 96 | Tailwind |

**Valores distintos de padding vertical de sección: 18 escritos** (sin contar el 0), **15 distintos una vez resueltos** a los cuatro altos supuestos, **14 si se juntan los de menos de 8 %.**

| Valor escrito | 390 | 768 | 1440 | 1920 | Lo usan | Igual o <8 % que |
|---|---:|---:|---:|---:|---|---|
| `clamp(80px, 16vh, 210px)` | 135 | 163.8 | 144 | 172.8 | FraseCifras | `clamp(100px, 16vh, 190px)`, `clamp(80px, 15vh, 200px)` |
| `clamp(50px, 9vh, 110px)` | 76 | 92.2 | 81 | 97.2 | FraseCifras | — |
| `clamp(76px, 13vh, 160px)` | 109.7 | 133.1 | 117 | 140.4 | CarpetasUnidades | `clamp(92px, 13vh, 140px)`, `clamp(70px, 13vh, 170px)` |
| `clamp(90px, 18vh, 240px)` | 151.9 | 184.3 | 162 | 194.4 | Emblem | — |
| `clamp(30px, 5vh, 64px)` | 42.2 | 51.2 | 45 | 54 | CarrilProyectos (.altea-carril__fijo) | — |
| var(--space-9) · ≤900 var(--space-8) | 64 | 64 | 96 | 96 | CierreContacto (.altea-cierre__body) | — |
| aire del footer (arriba) | 76 | 92.2 | 108 | 129.6 | Footer | — |
| aire del footer / 2 (abajo) | 38 | 46.1 | 54 | 64.8 | Footer | — |
| `clamp(92px, 13vh, 140px)` | 109.7 | 133.1 | 117 | 140 | HeroCalado | `clamp(76px, 13vh, 160px)`, `clamp(70px, 13vh, 170px)` |
| `clamp(26px, 4.4vh, 50px)` | 37.1 | 45.1 | 39.6 | 47.5 | HeroCalado | — |
| `clamp(70px, 13vh, 170px)` | 109.7 | 133.1 | 117 | 140.4 | CarrilPlazas (.altea-carrusel), OtrosGiros, ProximosComercial, Pilares, Huella, ResponsabilidadSocial | `clamp(76px, 13vh, 160px)`, `clamp(92px, 13vh, 140px)` |
| `clamp(66px, 12vh, 150px)` | 101.3 | 122.9 | 108 | 129.6 | MuroMarcas, GrupoFirma | — |
| `clamp(100px, 16vh, 190px)` | 135 | 163.8 | 144 | 172.8 | HeroNube (.nos-hero__txt) | `clamp(80px, 16vh, 210px)`, `clamp(80px, 15vh, 200px)` |
| `clamp(20px, 3vh, 44px)` | 25.3 | 30.7 | 27 | 32.4 | HeroNube (.nos-hero__txt) | — |
| `clamp(80px, 15vh, 200px)` | 126.6 | 153.6 | 135 | 162 | Origen | `clamp(80px, 16vh, 210px)`, `clamp(100px, 16vh, 190px)` |
| `clamp(60px, 11vh, 140px)` | 92.8 | 112.6 | 99 | 118.8 | Origen | — |
| `clamp(56px, 10vh, 120px)` | 84.4 | 102.4 | 90 | 108 | GrupoFirma | — |
| `var(--space-9)` | 96 | 96 | 96 | 96 | Proximamente, Cabecera (section 1), Canales + formulario (section 2) | — |

- **Tres clamp escritos distinto que dan lo mismo en las cuatro pantallas:** `clamp(70px, 13vh, 170px)` (8 usos), `clamp(76px, 13vh, 160px)` (Carpetas) y `clamp(92px, 13vh, 140px)` (HeroCalado). Es 13vh en las cuatro; se separan sólo en pantallas muy bajas (los mínimos 70 / 76 / 92) o muy altas (los máximos 170 / 160 / 140).
- **Lo mismo con 16vh:** `clamp(80px, 16vh, 210px)` (FraseCifras) y `clamp(100px, 16vh, 190px)` (HeroNube); y `clamp(80px, 15vh, 200px)` (Origen) a menos de 6 %.
- **Hay once valores de vh distintos** (3, 4.4, 5, 9, 10, 11, 12, 13, 15, 16, 18 vh). Los ocho que van de 9 a 18 vh están separados entre sí por 7–15 %: casi cada sección tiene el suyo.
- **El ancho casi no interviene:** todo el ritmo es vh salvo `var(--space-9)` / `var(--space-8)` del cierre (96 / 64 con corte en 900), los 96 px fijos de Proximamente y /contacto (Tailwind `py-(--space-9)`) y el aire del footer, que cambia de fórmula en 900.

**Acoplamientos (una sección se apoya en el padding de la vecina):**

1. **`.home-video { padding: 0 }`** (home.css:160). El hueco de arriba lo pone `padding-bottom` de FraseCifras (76–97 px) y el de abajo el `padding-top` de Carpetas (110–140). ≤900 se suman los 12 px de `margin` del marco. Si se mueve el vídeo, se lleva cero aire consigo.
2. **`.home-carpetas` con `padding-bottom: 0`** (secciones.css:179), acoplado a su propia pila: `margin-bottom: calc(-1 * var(--pausa))` en `.home-carpetas__pila` (:248) y la cola de `height: var(--pausa)` (:327). La sección termina justo donde termina la última carpeta, así que el aire que sigue es **entero el `padding-top` de Emblem** (clamp(90px, 18vh, 240px)). Si se pone otra sección detrás, empieza pegada a la pila.
3. **`.altea-carril` no tiene padding**: el aire lo pone el marco sticky de 100svh (`.altea-carril__fijo`, `clamp(30px, 5vh, 64px)` arriba y abajo). Desde Emblem el hueco es 152–194 + 42–54.
4. **`.altea-carrusel` lleva `padding: clamp(70px, 13vh, 170px) 0`**: vertical propio pero horizontal 0; el lateral lo ponen cabecera, pista y barra por separado.
5. **HeroNube y HeroCalado cierran casi sin aire** (`clamp(20px, 3vh, 44px)` y `clamp(26px, 4.4vh, 50px)`) y dejan el hueco a la sección siguiente (Origen 127–162, Carrusel 110–140).
6. **ResponsabilidadSocial y el cierre son los dos `--surface-sunken`** y van seguidos en /nosotros: los paddings se suman en un solo hueco de 174–236 px y las dos secciones se leen como una banda.

**Hueco entre secciones seguidas** (padding-bottom de una + padding-top de la siguiente):

| Página | De → a | Fondos | Suma bottom + top: 390 | 768 | 1440 | 1920 | Lectura |
|---|---|---|---:|---:|---:|---:|---|
| / | FraseCifras → CorporateVideo | page → page | 76 | 92.2 | 81 | 97.2 | mismo fondo: se lee como un solo hueco |
| / | CorporateVideo → CarpetasUnidades | page → page | 109.7 | 133.1 | 117 | 140.4 | mismo fondo: se lee como un solo hueco |
| / | CarpetasUnidades → Emblem | page → page | 151.9 | 184.3 | 162 | 194.4 | mismo fondo: se lee como un solo hueco |
| / | Emblem → CarrilProyectos | page → page | 194.1 | 235.5 | 207 | 248.4 | mismo fondo: se lee como un solo hueco |
| / | CarrilProyectos → CierreContacto | page → sunken | 106.2 | 115.2 | 141 | 150 | cambia el fondo: cada padding se lee dentro de su banda |
| / | CierreContacto → Footer | sunken → ink | 140 | 156.2 | 204 | 225.6 | cambia el fondo: cada padding se lee dentro de su banda |
| /comercial | HeroCalado → CarrilPlazas | page → page | 146.9 | 178.2 | 156.6 | 187.9 | mismo fondo: se lee como un solo hueco |
| /comercial | CarrilPlazas → OtrosGiros | page → page | 219.4 | 266.2 | 234 | 280.8 | mismo fondo: se lee como un solo hueco |
| /comercial | OtrosGiros → MuroMarcas | page → sunken | 211 | 256 | 225 | 270 | cambia el fondo: cada padding se lee dentro de su banda |
| /comercial | MuroMarcas → ProximosComercial | sunken → page | 211 | 256 | 225 | 270 | cambia el fondo: cada padding se lee dentro de su banda |
| /comercial | ProximosComercial → CierreContacto | page → sunken | 173.7 | 197.1 | 213 | 236.4 | cambia el fondo: cada padding se lee dentro de su banda |
| /comercial | CierreContacto → Footer | sunken → ink | 140 | 156.2 | 204 | 225.6 | cambia el fondo: cada padding se lee dentro de su banda |
| /nosotros | HeroNube → Origen | page → page | 151.9 | 184.3 | 162 | 194.4 | mismo fondo: se lee como un solo hueco |
| /nosotros | Origen → Pilares | page → page | 202.6 | 245.8 | 216 | 259.2 | mismo fondo: se lee como un solo hueco |
| /nosotros | Pilares → GrupoFirma | page → page | 211 | 256 | 225 | 270 | mismo fondo: se lee como un solo hueco |
| /nosotros | GrupoFirma → Huella | page → ink | 194.1 | 235.5 | 207 | 248.4 | cambia el fondo: cada padding se lee dentro de su banda |
| /nosotros | Huella → ResponsabilidadSocial | ink → sunken | 219.4 | 266.2 | 234 | 280.8 | cambia el fondo: cada padding se lee dentro de su banda |
| /nosotros | ResponsabilidadSocial → CierreContacto | sunken → sunken | 173.7 | 197.1 | 213 | 236.4 | mismo fondo: se lee como un solo hueco |
| /nosotros | CierreContacto → Footer | sunken → ink | 140 | 156.2 | 204 | 225.6 | cambia el fondo: cada padding se lee dentro de su banda |

Con el mismo fondo, el hueco entre dos secciones va de **76 px** (FraseCifras → vídeo, a 390) a **281 px** (Carrusel → OtrosGiros, a 1920).

### 2.4 Huecos internos

Cada sección lo resuelve por su cuenta, con su propio `clamp()` en vh casi siempre.

#### Del rótulo al título

| Sección | De → a | Valor escrito | css | 390 | 768 | 1440 | 1920 |
|---|---|---|---|---:|---:|---:|---:|
| CierreContacto · /contacto | eyebrow → título (SectionHeading) | `12px` | components.css:305 (gap) | 12 | 12 | 12 | 12 |
| OtrosGiros | rótulo → h2 | `clamp(14px, 2.4vh, 24px)` | comercial.css:763 | 20.3 | 24 | 21.6 | 24 |
| Origen | rótulo → frase | `clamp(18px, 3vh, 32px)` | nosotros.css:149 | 25.3 | 30.7 | 27 | 32 |
| Proximamente | título → rótulo "Próximamente" (el rótulo va DESPUÉS) | `24px` | Proximamente.tsx:22 (gap-6) | 24 | 24 | 24 | 24 |

**4 valores escritos distintos, 4 si se juntan los que difieren menos de 8 % a los cuatro anchos.**

#### Del título al cuerpo

| Sección | De → a | Valor escrito | css | 390 | 768 | 1440 | 1920 |
|---|---|---|---|---:|---:|---:|---:|
| CierreContacto · /contacto | título → descripción | `12px` | components.css:305 (gap) | 12 | 12 | 12 | 12 |
| HeroNube | h1 → bajada | `clamp(18px, 3vh, 32px)` | nosotros.css:74 | 25.3 | 30.7 | 27 | 32 |
| Huella | h2 → párrafo | `clamp(16px, 2.6vh, 28px)` | nosotros.css:768 (gap) | 21.9 | 26.6 | 23.4 | 28 |
| ResponsabilidadSocial | subtítulo → texto | `clamp(16px, 2.6vh, 26px)` | nosotros.css:1047 | 21.9 | 26 | 23.4 | 26 |
| ResponsabilidadSocial ≤900 | h2 → subtítulo (apilados) | `clamp(24px, 4vw, 80px)` | nosotros.css:1030 (gap) | 24 | 30.7 | — | — |
| GrupoFirma ≤900 | h2 → intro (apilados) | `clamp(24px, 5vw, 86px)` | nosotros.css:285 (gap) | 24 | 38.4 | — | — |
| Emblem | frase → firma | `clamp(20px, 3vh, 34px)` | home.css:580 | 25.3 | 30.7 | 27 | 32.4 |
| Carpetas (tarjeta) | h3 → frase | `14px` | secciones.css:364 | 14 | 14 | 14 | 14 |
| OtrosGiros (lámina) | h3 → párrafo | `12px` | comercial.css:888 | 12 | 12 | 12 | 12 |
| /contacto | h2 → lista | `16px` | contacto/page.tsx:62 (mb-4) | 16 | 16 | 16 | 16 |
| Proximamente | título → texto (todo a la misma distancia) | `24px` | Proximamente.tsx:22 (gap-6) | 24 | 24 | 24 | 24 |
| TarjetaProyecto | nombre → pie | `5px` | components.css:2523 | 5 | 5 | 5 | 5 |
| Próximos (tarjeta) | nombre → pie | `6px` | comercial.css:1191 | 6 | 6 | 6 | 6 |

**12 valores escritos distintos, 10 si se juntan los que difieren menos de 8 % a los cuatro anchos.**
Grupos de casi iguales: `clamp(18px, 3vh, 32px)` ≈ `clamp(20px, 3vh, 34px)` (25.3/30.7/27/32); `clamp(16px, 2.6vh, 28px)` ≈ `clamp(16px, 2.6vh, 26px)` (21.9/26.6/23.4/28).

#### Del título o el cuerpo al contenido

| Sección | De → a | Valor escrito | css | 390 | 768 | 1440 | 1920 |
|---|---|---|---|---:|---:|---:|---:|
| FraseCifras | frase → cifras | `clamp(52px, 9vh, 120px)` | secciones.css:21 | 76 | 92.2 | 81 | 97.2 |
| CarpetasUnidades | cabecera → pila (la posición final la recalcula JS) | `clamp(20px, 3.4vh, 40px)` | secciones.css:196 | 28.7 | 34.8 | 30.6 | 36.7 |
| CarrilProyectos | cabecera → pista | `clamp(20px, 3.4vh, 44px)` | components.css:2298 (row-gap) | 28.7 | 34.8 | 30.6 | 36.7 |
| CarrilPlazas | cabecera → pista | `clamp(28px, 5vh, 56px)` | components.css:2541 | 42.2 | 51.2 | 45 | 54 |
| HeroCalado | h1 → cifras | `clamp(34px, 6.4vh, 88px)` | comercial.css:135 (gap) | 54 | 65.5 | 57.6 | 69.1 |
| OtrosGiros | h2 → láminas | `clamp(34px, 6vh, 70px)` | comercial.css:769 | 50.6 | 61.4 | 54 | 64.8 |
| MuroMarcas | h2 → rejilla | `clamp(30px, 5vh, 58px)` | comercial.css:919 | 42.2 | 51.2 | 45 | 54 |
| ProximosComercial | h2 → rejilla | `clamp(30px, 5vh, 60px)` | comercial.css:1117 | 42.2 | 51.2 | 45 | 54 |
| Origen | frase → regla | `clamp(34px, 6vh, 72px)` | nosotros.css:163 | 50.6 | 61.4 | 54 | 64.8 |
| Origen | regla → columnas | `clamp(28px, 5vh, 56px)` | nosotros.css:179 | 42.2 | 51.2 | 45 | 54 |
| Pilares | h2 → rejilla | `clamp(40px, 7vh, 86px)` | nosotros.css:239 | 59.1 | 71.7 | 63 | 75.6 |
| GrupoFirma | cabecera → organigrama | `clamp(40px, 7vh, 86px)` | nosotros.css:285 | 59.1 | 71.7 | 63 | 75.6 |
| Huella | intro → cifras (y → botón) | `clamp(36px, 6vh, 76px)` | nosotros.css:758 (gap) | 50.6 | 61.4 | 54 | 64.8 |
| ResponsabilidadSocial | cabecera → fotos | `clamp(34px, 6vh, 68px)` | nosotros.css:1030 | 50.6 | 61.4 | 54 | 64.8 |
| CierreContacto | encabezado → botones (y → correo) | `var(--space-6)` | components.css:2220 (gap) | 32 | 32 | 32 | 32 |
| /contacto | bloque → bloque, columna → formulario | `32px` | contacto/page.tsx (gap-8) | 32 | 32 | 32 | 32 |
| Proximamente | texto → botón | `24px` | Proximamente.tsx:22 (gap-6) | 24 | 24 | 24 | 24 |

**15 valores escritos distintos, 7 si se juntan los que difieren menos de 8 % a los cuatro anchos.**
Grupos de casi iguales: `clamp(20px, 3.4vh, 40px)` ≈ `clamp(20px, 3.4vh, 44px)` (28.7/34.8/30.6/36.7); `clamp(28px, 5vh, 56px)` ≈ `clamp(30px, 5vh, 58px)` ≈ `clamp(30px, 5vh, 60px)` (42.2/51.2/45/54); `clamp(34px, 6.4vh, 88px)` ≈ `clamp(34px, 6vh, 70px)` ≈ `clamp(34px, 6vh, 72px)` ≈ `clamp(36px, 6vh, 76px)` ≈ `clamp(34px, 6vh, 68px)` (54/65.5/57.6/69.1); `var(--space-6)` ≈ `32px` (32/32/32/32).

### 2.5 Dónde vive el espaciado

- **Tokens en un solo archivo** (app/ui/tokens.css): `--space-1` … `--space-10` (4–128 px), `--container-pad`, `--container-max`. **El ritmo de sección no los usa:** sólo el cierre (`--space-9` / `--space-8`) y las tres secciones de Tailwind (`py-(--space-9)`). Las demás secciones escriben su `clamp(…vh…)`. `--space-10` no tiene ningún uso vivo; `--space-9` uno en CSS (el cierre) más las utilidades.
- **Los huecos internos van casi todos escritos a mano** en el CSS de cada sección; los tokens de espacio aparecen en gaps de componentes pequeños (barra, footer, botones del cierre, cabeceras de carril y carrusel).
- **Tailwind para espaciado** sólo en Proximamente.tsx (`gap-6`), contacto/page.tsx (`gap-8`, `gap-3`, `gap-0.5`, `mb-4`, `pt-3`) y LeadForm.tsx (`gap-3`, `gap-4`, `mt-1.5`): escala de Tailwind (múltiplos de 4 px), no los tokens `--space-*`. Valen lo mismo en px que algunos tokens (`gap-6` = 24 = `--space-5`, `gap-8` = 32 = `--space-6`) pero no son la misma variable.
- **Mismas reglas de choque que en tipografía:** las hojas propias van sin capa y ganan a las utilidades. Ningún `!important` de espaciado.

## Apéndice · Componentes con tipografía propia que hoy no se pintan

No están en ninguna cuenta. Si se reconectan, traen sus tamaños: `_home/BusinessUnits`, `HeroSlider`, `Stats` (home.css: `.home-hero__title` display-1, `.home-stats__*`, `.home-units__*`); `ui/BloquesRevelados`, `HeroUnidad`, `LeadCTA`, `MapaProyectos`, `ProjectCard`, `ProyectosPaneles`, `Publicaciones`, `SeccionRelato`, `StatBlock`, `Tag`, `WhatsAppFab` (components.css: `.altea-stat__*`, `.altea-project-card__*`, `.altea-hero-unidad__*`, `.altea-bloques__*`, `.altea-proyectos__*`, `.altea-relato__*`, `.altea-wa__*`); `ui/intro/IntroAltea` y `CloudLayers` (IntroAltea.module.css: `.title` `clamp(1.2rem, 6.3vw, 5.2rem)`). Son además los únicos usuarios de `--text-h3` en CSS y de la mayoría de los usos de `--text-h1` / `--text-h2`. `app/mapa-demo` (página de desarrollo) tampoco cuenta.
