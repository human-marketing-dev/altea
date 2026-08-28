# Altea — Design System

Altea es una inmobiliaria con sólida experiencia y una vasta reserva territorial: diseña y ejecuta proyectos inmobiliarios **comerciales**, **industriales** y **de vivienda** a la medida de cualquier necesidad. Opera como una sola marca ("Altea") con tres unidades de negocio que comparten identidad visual pero tienen lockups propios.

Este sistema se construyó para dar soporte al sitio web de Altea (el equipo ya cuenta con un wireframe funcional; este proyecto aporta el lenguaje visual — color, tipografía, componentes y una recreación de alta fidelidad — para vestirlo).

**Unidades de negocio** (de `Presentación ALTEA_compressed.pdf`):
- **Comercial** — "Activar la energía de la ciudad en un solo lugar." 34 inmuebles comerciales (paseos, puntos y locales) con 94% de ocupación y +3,000,000 visitantes al mes. Incluye hoteles, hospital y educación.
- **Industrial** — "Desarrollar infraestructura con visión de futuro." Proyecto insignia: Aeropuerto Internacional de Saltillo.
- **Vivienda** — "Crear hogares donde comienza tu historia." +1,181 hectáreas de terreno, +18,000 árboles sembrados al año, 840 hectáreas de superficie de plantación.

## Fuentes originales
- `uploads/Altea-Identidad.pdf` — manual de identidad gráfica (tipografía, paleta de color, reglas de logotipo).
- `uploads/Presentación ALTEA_compressed.pdf` — deck corporativo (unidades de negocio, cifras clave, taglines).
- `uploads/Logo Light.svg`, `Logo Dark 1/2.svg`, `Icono Light.svg`, `Icono Dark 1/2.svg` — wordmark e ícono.
- `uploads/ALTEA COMERCIAL(.svg / 1.svg)`, `ALTEA INDUSTRIAL(.svg / 1.svg)`, `ALTEA VIVIENDA(.svg / 1.svg)` — lockups de unidad de negocio, versión plana y a dos tonos.
- No se proporcionó Figma ni codebase — este es un sistema **brand-guidelines-only**: los tokens vienen del manual de identidad, y el set de componentes es el estándar (no hay un inventario de componentes fuente que replicar).

## Índice
- `styles.css` + `tokens/` — colores, tipografía, espaciado, radios/sombras.
- `assets/logos/` — wordmark e ícono, ya coloreados (dark/light).
- `assets/business-units/` — lockups Comercial / Industrial / Vivienda, planos y a dos tonos.
- `components/core/` — Button, Tag, Input.
- `components/data/` — StatBlock, ProjectCard.
- `components/layout/` — SectionHeading, NavBar, Footer.
- `guidelines/` — specimen cards (Colors, Type, Spacing, Brand, Foundations).
- `ui_kits/website/` — recreación clicable: Home, unidad de negocio (Comercial/Industrial/Vivienda), Contacto.
- `SKILL.md` — versión portable para Claude Code.

## Components
- **Button** (`components/core`) — primary / dark / outline / ghost.
- **Tag** (`components/core`) — pill de unidad de negocio / estatus.
- **Input** (`components/core`) — campo de texto / textarea con label.
- **StatBlock** (`components/data`) — métrica grande + leyenda.
- **ProjectCard** (`components/data`) — tarjeta de proyecto con imagen, unidad, ubicación.
- **SectionHeading** (`components/layout`) — eyebrow + título + descripción.
- **NavBar** (`components/layout`) — barra superior con wordmark y links.
- **Footer** (`components/layout`) — pie con wordmark, columnas por unidad y línea legal.

**Adiciones intencionales**: como no se proporcionó un inventario de componentes (sin Figma/codebase adjunto), se construyó el set estándar mínimo que un sitio inmobiliario necesita — nada más. No se inventaron componentes de aplicación (tabs, dialogs, toasts) que no tienen contraparte en el wireframe/marca.

## CONTENT FUNDAMENTALS
- **Idioma**: español (México), formal pero cercano — "tú" implícito en CTAs ("Conoce nuestros proyectos"), nunca "usted".
- **Tono**: aspiracional y territorial — el copy de la presentación habla en infinitivos de propósito: *"Activar la energía de la ciudad en un solo lugar"*, *"Desarrollar infraestructura con visión de futuro"*, *"Crear hogares donde comienza tu historia"*. Cada unidad tiene su propia frase-propósito; mantener ese patrón (verbo + resultado humano) al escribir nuevo copy.
- **Datos como prueba, no decoración**: el deck apoya cada unidad con 2–4 cifras concretas (34 inmuebles, 94% ocupación, +3,000,000 visitantes, +18,000 árboles/año). Usar `StatBlock` así — números reales, nunca de relleno.
- **Mayúsculas**: encabezados de sección del manual/deck van en versalitas/mayúsculas (p. ej. "PALETA DE COLOR PRINCIPAL", "WHAT WE DO") — reservar el uso de mayúsculas a eyebrows y etiquetas cortas, no a párrafos.
- **Sin emoji.** El manual y el deck son estrictamente tipográficos y corporativos.
- **Bilingüe puntual**: el deck mezcla titulares en inglés ("WHAT WE DO") con el resto en español — tratar el inglés como acento ocasional para encabezados de sección, no como el idioma por defecto.

## VISUAL FOUNDATIONS
- **Paleta**: 1 color primario (ink `#212222`, casi negro cálido) + 2 secundarios — cream `#E7DFD1` (fondo principal, cálido y neutro) y coral `#F15D4D` (acento). El manual es explícito: *"los colores secundarios no deben predominar en la composición"* — coral se usa para un CTA, un eyebrow, o el detalle del isotipo; nunca como fondo de sección grande.
- **Tipografía**: Gotham Bold/Medium en el manual (ver sustitución abajo). Es una geométrica de alto contraste de trazo, usada en dos pesos únicamente — sin itálicas, sin condensadas. Interletrado 0, interlineado ajustado (~1) en títulos.
- **Espaciado**: escala de 4px, secciones generosas (48–128px de padding vertical) — el deck usa mucho aire negativo entre bloques de una sola cifra o frase.
- **Fondos**: sólidos únicamente (cream o ink) — el manual prohíbe explícitamente aplicar el logo sobre imágenes o degradados. Las fotografías de proyectos (vía `<image-slot>`) son el único lugar con imagen; siempre full-bleed, sin marcos ni recortes decorativos.
- **Sin gradientes decorativos, sin texturas, sin patrones repetidos** — la identidad es plana y tipográfica, apoyada en fotografía real de los desarrollos.
- **Animación**: no especificada por la marca. El sistema usa transiciones discretas y rápidas (150–220ms, ease-standard) solo en hover/focus — nunca bounce ni parallax, coherente con el tono corporativo/sobrio.
- **Hover**: coral → coral oscuro; botones dark → negro puro; outline → se rellena de cream; tarjetas de proyecto elevan sombra + leve traslado (-2px).
- **Bordes**: hairline al 15% de opacidad de ink sobre cream; sin bordes gruesos ni de color.
- **Sombra**: una sola sombra ambiental suave para tarjetas (`--shadow-card`), sin sombras internas ni doble sombra.
- **Radios**: 4 / 8 / 16px y pill para botones y tags — nunca esquinas totalmente cuadradas en tarjetas, nunca hiper-redondeadas (>16px) salvo pills.
- **Transparencia/blur**: mínima — solo un scrim lineal (ink 40%→80%) sobre fotografía de hero para legibilidad de texto; sin blur/glassmorphism.
- **Imagen**: el deck y el manual no incluyen fotografía de stock con tratamiento de color propio — se deja como `<image-slot>` a la espera de fotografía real de los desarrollos (ver Iconografía/Imágenes abajo).

## ICONOGRAPHY
- El manual de identidad **no define un sistema de iconos** — solo wordmark, isotipo (la "A" triangular con muesca coral) y lockups de unidad de negocio.
- No se usa emoji ni caracteres unicode como iconos.
- El único elemento "iconográfico" real es el isotipo de Altea (`assets/logos/altea-icon-*.svg`) — un triángulo/"A" con una muesca en la punta que lleva el color de acento (coral), tal como indica el manual: *"los colores secundarios se utilizarán como acentos de texto o en assets."*
- Para el único uso de UI que pedía algo "iconográfico" (el link con flecha en `Button variant="ghost"`), se usó un carácter tipográfico (→) en vez de inventar un set de iconos — evita introducir un lenguaje de iconos que la marca no definió.
- **Si el sitio necesita iconos de UI** (menú, redes sociales, flechas de carrusel, etc.), no hay una fuente indicada por la marca; se recomienda un set lineal neutro (p. ej. Lucide, vía CDN) con el mismo grosor de trazo que el isotipo (~stroke medio) en lugar de inventar iconos a mano.

## Sustitución tipográfica — ACCIÓN REQUERIDA
El manual especifica **Gotham (Bold / Medium)**, una fuente comercial. No se recibieron los archivos `.otf/.ttf`, así que `tokens/typography.css` usa **Poppins** (Google Fonts) como sustituto geométrico más cercano, disponible y gratuito. Reemplazar en cuanto Altea proporcione las fuentes con licencia — actualizar el `@font-face` en `tokens/typography.css` y quitar el `@import` de Google Fonts.

## Fuentes/imágenes pendientes
- Todas las fotografías en `ui_kits/website/` son `<image-slot>` — deben llenarse con fotografía real de los desarrollos de Altea antes de publicar. No se generó ni se buscó fotografía de stock: el manual no incluye imágenes de referencia que pudieran copiarse.
