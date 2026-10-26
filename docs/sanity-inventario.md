# Inventario de contenido editable (antes de Sanity)

*Octubre de 2026. Ronda de lectura: no se instaló nada ni se tocó el proyecto.*

**Criterio de «editable»:** lo que Altea cambiaría sin llamarnos (un titular,
una descripción, una cifra, una foto de proyecto). **Fijo:** lo que al cambiarlo
rompe el diseño, la lógica o deja de ser la marca: estructura, iconos, colores
de unidad, trazados, logotipos, números de geometría atados a un archivo.

**Cómo se midieron los límites.** No son estimaciones. Se cargó el build real
—con su JavaScript— en Chrome y, campo por campo, se alargó el texto carácter a
carácter hasta que la maqueta fallaba, en **360×740, 390×844, 1280×720 y
1440×900**. «Falla» se definió por elemento (abajo, en cada fila): la palabra
del hero toca el margen, la fila de cifras salta de renglón o se sale, la
carpeta crece más que su alto de diseño (rompe la pila), el texto de una
tarjeta choca con la chapa o se sale, un titular partido en líneas agrega un
renglón. El **límite** es el largo más grande que no falla en ninguno de los
cuatro tamaños (el más restrictivo), y se indica dónde manda.

> ⚠ Los límites dependen del texto **vecino**. Las cifras comparten fila, la
> frase y la descripción de una carpeta comparten caja. Donde pasa, se dice.

Tipos propuestos: **corto** (una línea), **largo** (párrafo sin formato),
**párrafos** (lista de textos largos), **formato** (Portable Text), **tramo**
(texto con un tramo marcado: acento/atenuado), **número**, **imagen**, **lista**,
**URL**, **enum** (lista cerrada), **referencia**.

---

## 1 · Global (todas las páginas)

| Campo | Dónde vive hoy | Dónde se ve | Editable | Tipo | Límite |
|---|---|---|---|---|---|
| Título y descripción por defecto | `app/layout.tsx:38-40` | `<title>`/meta del home (no tiene propios) | Sí | corto / largo | — |
| Correo | `lib/contacto.ts:28` `CANALES.correo` | pie, cierre, /contacto, error del formulario | Sí | email | — |
| Teléfono | `lib/contacto.ts:35` | pie, /contacto (`tel:` derivado) | Sí | teléfono | — |
| Número de WhatsApp | `lib/contacto.ts:33` (E.164 sin signos, ≠ teléfono) | botones de WhatsApp | Sí | teléfono, sólo dígitos | — |
| Mensaje de WhatsApp | `lib/contacto.ts:34` | `?text=` del enlace | Sí | corto | — |
| Domicilio | `lib/contacto.ts:37` | pie, /contacto | Sí | corto | — |
| Redes (3) | `lib/contacto.ts:41-54`, Instagram desde `lib/publicaciones.ts` | pie (icono + nombre sr-only) | URL sí; red e icono no | lista {red (enum), URL} | — |
| Cierre: rótulo «Trabajemos juntos» | `app/_home/content.ts:222` `CONTACT_CTA.eyebrow` | cierre del home, /nosotros y las 4 unidades | Sí | corto | — |
| Cierre: título | `content.ts:223` | ídem | Sí | corto | **59** (cierre de unidad a 360; agrega renglón). Home: 61 |
| Botones del cierre | inline `CierrePuntos.tsx:79,88`, `CierreUnidad.tsx:104,113` | cierres | **No** | — | el ancho de la rejilla está medido sobre «Contáctanos por WhatsApp» (`cierre-puntos.css:24,116-123`) |
| Barra, pie, enlaces, copyright, logos | `NavBar.tsx`, `Footer.tsx`, `/brand/logos/` | todas | No | — | — |
| Formulario: etiquetas, botón, errores | `LeadForm.tsx`, `enviar-lead.ts`, `lib/antispam.ts` | /contacto | No | — | los errores interpolan límites del servidor |
| Formulario: mensaje de éxito (2) | `LeadForm.tsx:64,69` | /contacto | Opcional | corto ×2 | — |

## 2 · Home (`/`)

| Campo | Dónde vive hoy | Dónde se ve | Editable | Tipo | Límite |
|---|---|---|---|---|---|
| Titular del hero | `content.ts:179-182` `HERO_A.lineas` (2 líneas; «que» atenuado) | hero | Sí, con estructura | lista de líneas de **tramo** | **línea 1: 18 · línea 2: 24** (agrega renglón; manda 390 y escritorio). Hoy 17 y 23: casi en el límite |
| Frase de entrada | `content.ts:35-36` `STATS_INTRO` (se parte por palabra para animar) | FraseCifras | Sí | corto | ~179 (aprox.: medido con las palabras partidas en spans). Ancho calculado para 80 car. (`secciones.css:23-35`) |
| Cifras (3) | `content.ts:28-32` `STATS[]` {prefix, to, suffix, note, label} | FraseCifras | Sí | lista {número, prefijo (enum), sufijo (enum), nota, etiqueta} | **cifra visible: 13 · etiqueta (nota + etiqueta): 30** (360; salta de renglón) |
| Video escritorio / móvil | `content.ts:40,51` | video | Sí | archivo ×2 (o uno + derivado) | 1080p / 720p; regenerar póster |
| Póster | `public/video/poster.webp` | video | No (recurso derivado) | — | — |
| Caption del video | `content.ts:62` (figcaption sr-only) | lector de pantalla | Sí | corto | — |
| Título de las carpetas | `content.ts:103-104` | CarpetasUnidades h2 | Sí | corto | **69** (360; agrega renglón y la cabecera fija crece). 38ch medido para 65 car. |
| Carpeta ×4: nombre | `content.ts:111…144` `name` | carpeta h3 | **No** (es la unidad: ver §10) | — | — |
| Carpeta ×4: frase | `content.ts:114…147` `apertura` | carpeta | Sí | corto | ver descripción |
| Carpeta ×4: descripción | `content.ts:115…148` `descripcion` | carpeta **y meta de /industrial, /vivienda, /forestal** | Sí | largo | **frase + descripción ≤ 233** juntas (360×740: la carpeta crece y descompone el orden de salida de la pila). Propuesto: frase ≤ 60, descripción ≤ 170 |
| Carpeta ×4: foto + alt | `content.ts:117-118…` | carpeta | Sí | imagen + corto | se pinta a 1 050 px (tel 3x) / 1 400 (esc 2x); archivos 1 980 |
| Emblema | `content.ts:189-218` 17 palabras + `acento {desde:13,hasta:16}` por índice | Emblem | Sí, con riesgo | **tramo** (texto + tramo acentuado) | no medible en vivo (un span por carácter). CSS medido para 97 car. en 3 renglones (`home.css:526-530`) |
| Título del carril | `content.ts:246` («…\nmás relevantes»; el `\n` no hace nada) | CarrilProyectos | Sí | corto | **37** (360) |
| Proyectos destacados (6) | `content.ts:272-362` | carril y ficha | Sí | **lista de referencias** a Proyecto | tarjeta: pie 46 |

## 3 · Nosotros (`/nosotros`)

| Campo | Dónde vive hoy | Dónde se ve | Editable | Tipo | Límite |
|---|---|---|---|---|---|
| Meta título / descripción | `app/nosotros/page.tsx:14-16` | head | Sí | corto / largo | la descripción repite a mano «21 estados…» (§9) |
| Titular del hero | `_nosotros/content.ts:32-36` 3 líneas, la 3.ª acentuada | HeroNube | Sí, con estructura | lista de líneas de **tramo** | **16 · 20 · 17** por línea (360 y 1280; agrega renglón) |
| Bajada del hero | `content.ts:37-38` | hero | Sí | largo | **160** (360) |
| Frase de Origen | `content.ts:66-70` 3 trozos, «40 años» acentuado; es el nombre accesible de la sección | Origen | Sí | **tramo** | ~150 (aprox.: partida por palabra). `max-width: 16ch` |
| Párrafos de Origen (2) | `content.ts:72-75` | Origen | Sí | párrafos | — |
| Fotos de Origen (2) | `content.ts:97-108` {src, alt, ratio} | Origen (carrusel) | Sí | lista {imagen, alt} (ratio del asset) | se pintan a 2 040 px (esc 2x) contra archivos de 1 363 y 1 449: **ya se estiran** |
| Título de Pilares | `content.ts:132` | Pilares | Sí | corto | **47** |
| Pilares (3): título | `content.ts:145-161` | Pilares | Sí (el icono no) | lista {título, icono (recurso)} | **49** (360; 3 renglones o rompe la fila) |
| Grupo Firmas: título / intro | `content.ts:310-312` | GrupoFirma | Sí | corto / largo | título **41** (360) |
| Grupo Firmas: sectores, logos, raíz, aparte | `content.ts:239-342` | organigrama | **No** (§10) | — | categoría: 20 (si algún día se abre) |
| Grupo Firmas: pie (2) | `content.ts:344` «Seis sectores» | organigrama | Sí | lista de 2 cortos | «Seis» va a mano |
| Huella: título | `content.ts:359` | Huella | Sí | corto | **16** |
| Huella: cuerpo | `content.ts:369-371` (calculado desde `lib/proyectos.ts`) | Huella | Derivado | — | ver §10 |
| Huella: botón | `content.ts:381,384` texto + YouTube | Huella | Sí | corto + URL | — |
| Huella: cifras (2) | `content.ts:386-389` | Huella | Sí | lista {número, prefijo, sufijo, etiqueta} | **cifra visible: 15** (escritorio). Hoy «+44,000,000 m²» = 14 |
| Huella: desglose (3) | `content.ts:391-395` {label, value} | Reparto | Sí | lista {etiqueta, número} | nada comprueba que sume el total |
| Mapa: textos del panel | `content.ts:397-404` | mapa | Sí (el título es derivado) | cortos ×4 | — |
| Presencia: estados, m² por estado, países | `lib/proyectos.ts:13-35, 151-173, 181-185` | mapa, cuerpo, panel | Sí | documento propio: lista de estados (enum ISO) con número; lista de países | — |
| RS: título / subtítulo | `content.ts:509,511` | RS | Sí | corto | título **37** |
| RS: descripción (2) | `content.ts:512-515` | RS | Sí | párrafos | — |
| RS: galería (6) | `content.ts:468-505` {src, alt, nota} | RS | Sí | lista {imagen, alt, pie} | se pintan a 1 052 px (tel 3x) / 857 (esc 2x); archivos 1 980 |

## 4 · Contacto (`/contacto`)

| Campo | Dónde vive hoy | Dónde se ve | Editable | Tipo | Límite |
|---|---|---|---|---|---|
| Meta título / descripción | inline `app/contacto/page.tsx:9-11` | head | Sí | corto / largo | — |
| H1 «Hablemos de tu proyecto» | inline `page.tsx:47` | encabezado | Sí | corto | — |
| Descripción | inline `page.tsx:48` | encabezado | Sí | largo | — |
| «Escríbenos por WhatsApp» | inline `page.tsx:23` | canales | Sí | corto | — |
| Correo, teléfono, domicilio | `CANALES` (global) | canales | (global) | — | — |
| Etiquetas «Correo», «Domicilio»… | inline | canales | No | — | — |

## 5 · Aviso de privacidad y Términos (misma plantilla)

| Campo | Dónde vive hoy | Dónde se ve | Editable | Tipo | Límite |
|---|---|---|---|---|---|
| Meta | `aviso-de-privacidad.ts:27-31`, `terminos.ts:19-23` | head | Sí | corto / largo | — |
| Título | aviso :32, términos :24 | h1 | Sí | corto | — |
| Bajada (fecha) | términos :25 | bajo el título | Sí | **fecha** (hoy es texto) | — |
| Intro, secciones, cierre | aviso :33-256 (8 secciones), términos :26-269 (12) | cuerpo | Sí | **formato**: párrafo / lista / subtítulo, negritas, enlaces, saltos (`PaginaLegal.tsx:78-121`) | — |

---

## 6 · Las cuatro unidades: lo común

Mismo esquema para las cuatro (`app/_unidad/contenido/*.ts`, tipos en `tipos.ts`).

| Campo | Dónde vive hoy | Dónde se ve | Editable | Tipo | Límite |
|---|---|---|---|---|---|
| Meta título | `metadata.title` | head | Sí | corto | — |
| Meta descripción | Comercial: calculada (`comercial.ts:1069-1071`); las otras: `TARJETA.descripcion` del home | head | Sí (una sola fuente: §9) | largo | — |
| Palabra del hero | `hero.palabra` | h1 calado, contorno y cierre | **No** (§10) | — | **11** si algún día se abre (manda 390 y escritorio; «Industrial» tiene 10) |
| Fotos del hero | `hero.fotos[]` {foto, ratio, ancla} | dentro de la palabra y a pantalla completa | La foto sí; `ratio` y `ancla` no | lista {imagen; ancla sólo desarrollo} | la 1.ª es el LCP. Se pintan a 2 500–4 140 px; archivos ~2 000 (§11) |
| Cifras (2–3) | `cifras[]` {prefijo, valor, signo, etiqueta} | hero | Valor y etiqueta sí; prefijo y signo como enum | lista {número, prefijo (enum), signo (enum), etiqueta} | **cifra visible: 10 · etiqueta: 23** (360: la fila salta de renglón). Escritorio: 27 / 94. Vivienda ya excede (etiqueta de 46) y por eso va en 2 renglones en teléfono |
| Título de proyectos | `proyectos.titulo` | h2 del carrusel | Sí | corto | **35** (360) |
| Proyectos | `proyectos.lista[]` | carrusel o rejilla, ficha | Sí | lista de referencias a Proyecto (§8) | tarjeta: ver abajo |
| Título de próximos | `proximos.titulo` (`"Próximos\nproyectos"`; el `\n` no hace nada) | h2 | Sí | corto | **26** (escritorio) |
| Próximos | `proximos.proyectos[]` | rejilla o carrusel, ficha | Sí | lista de referencias a Proyecto | — |
| Cierre: color, foto recortada, `tope` | `cierre` | cierre | **No** (§10) | — | — |

**Tarjeta de proyecto** (carrusel, rejilla y carril del home): **nombre: sin límite práctico** (>250 car. antes de chocar), **ubicación: 44** (360; 3 renglones o choca), **chapa de formato: 30** (360; parte en 2 renglones).

### Comercial

| Campo | Dónde vive hoy | Editable | Tipo | Límite |
|---|---|---|---|---|
| Plazas (14) | `comercial.ts:309-561` `PLAZAS` | Sí | Proyecto | — |
| Hero | derivado de `PLAZAS` (`:1078-1082`) | — | — | **reordenar las plazas reordena el hero** |
| Cifras (3) | `:197-213` | Sí | ver común | — |
| Otros giros: rótulo, título | `:629,631` | Sí | corto | título **65** (360) |
| Otros giros (3) | `:597-625` {numero, title, description, image, alt} | Sí | lista {título, descripción, imagen, alt} (número = posición) | — |
| Muro de marcas (36) | `:696-972` | **No** (logos y calibración; `mostrar` es decisión legal y está en `true` sólo para el demo) | — | — |
| Próximos (2) | `:997-1016` | Sí | referencias | — |

### Industrial

| Campo | Dónde vive hoy | Editable | Tipo | Límite |
|---|---|---|---|---|
| Atributos (3) | `industrial.ts:92-96` {titulo, icono} | El título sí; el icono no | lista {título, icono (enum de 10)} | — |
| Proyectos (6), próximos (3) | `:110-206`, `:250-300` | Sí | referencias | — |

### Vivienda

| Campo | Dónde vive hoy | Editable | Tipo | Límite |
|---|---|---|---|---|
| Proyectos (2) | `vivienda.ts:83-125` (rejilla fija; con 3 pasa a carrusel) | Sí | referencias | — |
| Próximos (4) | `:172-217` (carrusel) | Sí | referencias | — |

### Forestal

| Campo | Dónde vive hoy | Editable | Tipo | Límite |
|---|---|---|---|---|
| Líneas de negocio (2) | `forestal.ts:86-171` | Sí, menos `lado`, `id` y el logo | lista {rótulo, título, logo (recurso) + alt, párrafos, fotos (lista {imagen, alt}), lista {rótulo, ítems}} | — |
| Ítems de las listas | Servicios (3), Aplicaciones (4) | El título sí; el icono no | lista {título, icono (enum)} | con 4 o más ítems la lista pasa a 4 columnas |
| Fotos de las líneas | Viveros (3, carrusel), Teca (1) | Sí | imagen + alt | se pintan hasta 3 598 px (esc 2x) contra archivos de 1 980 |

## 7 · Cuántos

- **Campos editables de esquema: ~95**:
  - globales 10
  - cierre 2
  - home 10
  - nosotros 25
  - presencia 3
  - contacto 7
  - legal 7, la plantilla de dos documentos
  - unidad 17, la plantilla de cuatro documentos
  - proyecto 10
  - giro 4
- **Documentos: 46**:
  - 6 únicos: sitio, cierre, home, nosotros, presencia, contacto.
  - 2 legales.
  - 4 unidades.
  - **31 proyectos**: 22 en operación y 9 próximos. El carril del home no agrega ninguno: los 6 destacados ya existen en las unidades.
  - 3 giros.

## 8 · El documento Proyecto (uno, referenciado desde el home y las unidades)

`nombre` (corto) · `unidad` (referencia) · `estado` (enum: en operación / en
desarrollo / próximo) · `ubicacion` (corto, «Ciudad, Estado») · `foto` + `alt` ·
`descripcion` (largo; respeta saltos de línea) · `formato` (corto: hoy es
`datos[0].valor` y hace de chapa) · `datos` (lista {etiqueta, valor}) · `sitio`
(URL, opcional). No llevan campo: `id`/`slug` (se generan), `label` (nadie lo
lee), `fotoRatio` (sale del asset), `ancla` (sólo desarrollo).

---

## 9 · Duplicados

| # | Qué | Dónde | ¿A propósito? | Recomendación |
|---|---|---|---|---|
| 1 | Descripción de la carpeta = meta de la unidad | `content.ts` → `tarjetaDe()` → `industrial.ts:39`, `vivienda.ts:30`, `forestal.ts:23` | **Sí**: importada, una sola fuente | Un solo campo `descripcion` en el documento Unidad, que leen el home y la meta. Comercial no lo usa: su meta se calcula |
| 2 | Proyectos del carril del home vs los de las unidades (6) | `content.ts:285-362` vs `comercial.ts`, `industrial.ts`, `vivienda.ts` | **No**: copiados, y **5 de 6 ya difieren** (una coma en La Fe, otras marcas en Durango, otro texto en Aeropuerto Saltillo y su nombre, «parque industrial» en Aeropuerto IP, otra ubicación y otro texto en Amarantha). Bajío es idéntico | **Un documento Proyecto**, referenciado por los dos. Altea tiene que elegir cuál de las versiones gana en cada uno |
| 3 | Cierre (rótulo y título) | `CONTACT_CTA` → home, /nosotros, 4 unidades | **Sí** | Documento único |
| 4 | Correo, teléfono, domicilio | `CANALES` (fuente única) vs los textos legales, que los repiten a mano y con variantes (sin acento, con C.P., «info@alteadesarrollos» sin .com) | **No**, por casualidad | `CANALES` global. En los legales **no interpolar** sin aprobación de Altea: es texto legal |
| 5 | «21 estados… Estados Unidos, España y Costa Rica» | literal en la meta de /nosotros vs derivado en Huella y en el mapa | **No** | Derivar la meta de Presencia, o aceptarla fija |
| 6 | 44 millones de m² | home `STATS` (44 M), Huella (44,000,000 m²), desglose 24+13+7 | **No**: tres literales sin vínculo | Una cifra en Presencia; el desglose debería sumar contra ella |
| 7 | «sólida experiencia y una vasta reserva territorial» | meta por defecto (`layout.tsx:40`) y bajada del hero de /nosotros | **No** | Dos campos; no hace falta unirlos |
| 8 | Titular del hero del home | `HERO_A.lineas` y `TITULO_HERO` (`content.ts:161`) | No: `TITULO_HERO` sólo lo usa la intro, que no se monta | No modelar `TITULO_HERO` |
| 9 | «Próximos\nproyectos» | escrito en los 4 archivos de unidad | Copiado | Un campo por unidad está bien; o uno global si siempre es igual |
| 10 | Formato y visitantes dentro de la descripción **y** en `datos` | plazas de Comercial; lotes y m² en Vivienda | Copiado | Que la descripción no repita los datos, o aceptarlo: es redacción |
| 11 | Fotos | La Fe, Durango, Saltillo, Bajío, Aeropuerto IP y Amarantha con la misma ruta en home y unidad; tres con **otra ruta pero idénticas byte a byte** (Huinalá, Teca, Vivienda 2) | Copiado | Un asset, referenciado |
| 12 | Nombres de unidad | barra, pie, `UNIDADES`, carpetas, `unit` de los proyectos, descripciones en prosa | — | Fijos (§10); en los proyectos, `unidad` como referencia y no como texto libre |

**Inconsistencias que salen del inventario** (para Altea, no para el esquema):
- Paseo Juárez aparece en Ciudad Juárez, Chihuahua (contenido sin usar) y en Juárez, Nuevo León (`comercial.ts:347`).
- La cifra de Forestal, «18 mil árboles al año», va junto al párrafo de Viveros, que dice «más de 18,000 nuevos árboles plantados».
- Comercial muestra «34 desarrollos comerciales» y 14 plazas.

---

## 10 · Lo que parece texto y no debería ser editable

Es donde se rompen estos proyectos. Cada uno, con por qué:

1. **La palabra del hero de las unidades** (`hero.palabra`):
   - **Cómo funciona:** se pinta tres veces con `white-space: nowrap`, y el JavaScript le reescribe el cuerpo en cada fotograma.
   - **El límite:** el ancho de la palabra decide la ventana a la foto. Aguanta **11 caracteres**, y «Industrial» tiene 10.
   - **Por qué es fija:** es la identidad de la unidad, no un titular.
2. **Los nombres de unidad.**
   - **De qué dependen:** `UNIDADES` alimenta el selector del formulario, la validación del servidor, el asunto del correo y `?unidad=`. De ellos salen también el color (`var(--unidad-${nombre})`), el slug que arma la ruta y `tarjetaDe(slug)`, que rompe el build si no lo encuentra.
   - **Cómo modelarlo:** documento Unidad con slug inmutable; su texto editable va aparte.
3. **El prefijo y el signo de las cifras.**
   - **Qué controlan:** `CountUp` arma con ellos lo que oye el lector de pantalla (`"M"` → «millones», `"mil"`, `"+"` → «más de», `"%"`, `"m²"`). Van en spans con el color de la unidad, y `" mil"` lleva el espacio delante a propósito.
   - **Cómo modelarlo:** **enum**, no texto libre. El valor tiene que ser número.
4. **La chapa de la tarjeta es `datos[0].valor`.**
   - **Qué depende de eso:** el primer dato de la lista se vuelve la etiqueta de arriba y la primera fila de la ficha. Reordenar la lista cambia la chapa.
   - **Cómo modelarlo:** campo `formato` propio.
5. **El acento del emblema va por índice de palabra** (`acento: {desde:13, hasta:16}`). Si se cambia la frase, el acento cae en otras palabras.
   - **Cómo modelarlo:** un tramo marcado en el texto, no números.
6. **Los titulares partidos en líneas** (hero del home y de /nosotros).
   - **Qué fija la línea:** cada línea es una caja de recorte animada, así que el renglón lo decide el contenido. Los anchos se midieron sobre la frase actual, y la línea 2 del home está a 1 carácter del límite.
7. **Los `\n` que no hacen nada:** en «Próximos\nproyectos» y en el título del carril el salto lo produce el `max-width`, y el `\n` colapsa a un espacio. Si se modela «el salto de línea es tuyo», no va a obedecer.
8. **La ubicación de las plazas es dato:**
   - **Qué se deriva de ella:** la meta de Comercial cuenta estados con `ubicacion.split(", ").pop()`, así que una plaza fuera del formato «Ciudad, Estado» cuenta mal.
   - **Otro límite:** `enLetras()` sólo llega hasta veinte plazas.
9. **El cuerpo de Huella y el título del mapa son derivados** del número de estados y países. Pasarlos a texto libre pierde la cuenta automática.
10. **El organigrama.**
    - **Atado a nombres de archivo:** los ajustes ópticos de los logos van por nombre de archivo (`AJUSTES` en `GrupoFirma.tsx`), así que un asset con otro nombre pierde el ajuste.
    - **Atado al texto:** `logoRatio` define el alto, y el CSS reserva dos renglones por «Alimentos y diversiones».
    - **Por qué es fijo:** sumar una empresa al grupo es trabajo de diseño.
11. **La geometría atada a cada archivo:**
    - **Proporciones:** `ratio`/`fotoRatio`, que deberían salir del asset.
    - **Encuadres:** `ancla`, que se mide a ojo, y `tope`, un `calc()` medido contra el texto.
    - **Calibración de logos:** el `ancho`/`alto` de los recortes del cierre y la calibración del muro de marcas.
    - Si se exponen, la primera foto nueva descuadra la página.
12. **El orden de las fotos del hero:** la primera se precarga como LCP y el relevo sigue el orden. En Comercial ese orden es el de las plazas.
13. **Las cantidades cambian el diseño:**
    - 2 proyectos van en rejilla y 3 en carrusel.
    - Más de 3 próximos pasan a carrusel.
    - 4 o más ítems de lista pasan a 4 columnas.

    Agregar un proyecto cambia la sección. No se rompe, pero hay que saberlo.
14. **Los textos usados como `key` de React** (etiquetas de cifra, títulos de atributo, `parrafo.slice(0,24)`, títulos de sección legal): dos iguales chocan. En Sanity se resuelve con `_key`.
15. **El interruptor del muro de marcas** (`mostrar: true` sólo para el demo) es decisión legal, no editorial.
16. **El tiempo del relevo** (`hero.segundos`, 4.2 s) es animación.
17. **Las fotos recortadas de los cierres** son recursos con colisiones medidas, aunque parezcan «la foto de la unidad». Cada una nueva lleva nombre nuevo por la caché, y se vuelve a medir.

---

## 11 · Imágenes: contenido y recursos

**Contenido** (Altea las sustituiría):
- Fotos de los heroes de unidad: 14 + 5 + 3 + 2.
- Fotos de proyecto: 22 en operación y 9 próximos.
- Fotos de los giros (3) y de las líneas de Forestal (4).
- Fotos de las carpetas del home (4), de Origen (2) y de la galería de RS (6).
- El video, en sus dos versiones.

**Recursos** (se quedan donde están):
- Logos de Altea y del grupo; los 36 del muro y los de las líneas de Forestal.
- Iconos: atributos, pilares y favicons.
- Las texturas de concreto del 3D y el póster del video.
- Los recortes de los cierres y las máscaras de la banderola.
- Los lienzos generativos.

**A qué tamaño se pintan de verdad** (medido en el navegador, en píxeles de
dispositivo: teléfono 390 a 3× / escritorio 1440 a 2×), contra el ancho del
archivo:

| Contenido | Archivo | Teléfono 3× | Escritorio 2× | Lectura |
|---|---|---|---|---|
| Fotos del hero de unidad | ~2 000 | ~2 500 – 3 100 | ~3 340 – 4 140 | **Se estiran**. Ver `docs/pendientes.md`, «Las fotos de los heroes» |
| Tarjetas de plaza (carrusel) | 2 000 | 1 736 – 2 480 | 1 846 – 2 641 | Las más apaisadas (Guaymas, Los Mochis) se estiran |
| Tarjetas de Industrial | 1 078 – 2 000 | 1 422 – 2 094 | 1 144 – 2 223 | Pocket Park y Primavera (~1 100) se estiran mucho |
| Próximos | 1 718 – 1 980 | 1 456 – 2 082 | 1 144 – 2 207 | En el límite |
| Rejilla de Vivienda | 1 536 – 1 979 | ~1 180 | ~1 430 | Sobra |
| Giros de Comercial | 1 159 – 1 376 | 1 050 – 1 860 | 1 340 – 1 794 | Se estiran |
| Carpetas del home | 1 980 | 1 050 | 1 400 | Sobra |
| Origen (/nosotros) | 1 363 / 1 449 | 1 055 – 1 368 | 1 567 – 2 040 | Se estiran en escritorio |
| Galería RS | 1 980 | 1 052 | 857 | Sobra |
| Líneas de Forestal | 1 280 – 1 980 | 1 050 – 1 704 | 1 975 – 3 598 | Se estiran en escritorio |

**Para el esquema:** el validador de imagen debería pedir un ancho mínimo por
tipo de campo:
- Hero: ≥ 3 000 px; con eso dejan de estirarse en teléfono.
- Tarjeta y próximo: ≥ 2 600 px.
- Línea de Forestal: ≥ 3 600 px.
- Origen: ≥ 2 000 px.
- Carpeta y RS: ≥ 1 400 px.

Sin ese mínimo, una foto chica entra sin aviso y se ve blanda.
