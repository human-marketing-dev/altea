# Pendientes antes de publicar

**Fecha:** 15 de octubre de 2026 · **Código revisado:** `f5db9ef` más 7 archivos sin commitear (ver fila 21).

Ronda de solo lectura: no se arregló nada. Cada punto lleva archivo y línea; lo que no se pudo comprobar sin abrir el sitio en un navegador está al final, en «Lo que no pude revisar», y no en la tabla.

**Criterio de «Bloquea»:** el sitio no funciona, muestra relleno a un visitante o expone algo que no debería ser público.

## La tabla

| # | Qué | Dónde | Estado | Qué hace falta |
|---|---|---|---|---|
| 1 | **El formulario de contacto no entrega el lead a nadie.** Valida y lo escribe en el log del servidor; al usuario le dice «Gracias, recibimos tu mensaje. Un asesor de Altea te contactará». Nadie lo va a contactar. Además, el log guarda nombre, correo, teléfono y mensaje en texto plano. | `app/_actions/enviar-lead.ts:49-50` (el `TODO` y el `console.info`) · `app/ui/LeadForm.tsx:57-62` (el mensaje de éxito) | **Resuelto** (oct. 2026): entrega por Brevo, aviso si falla y antispam (`lib/antispam.ts`). | Decidir el destino (correo de ventas, CRM por unidad: ver la cabecera de `enviar-lead.ts:6-10`), conectarlo, dar un mensaje de error si el envío falla y dejar de escribir datos personales en el log. |
| 2 | **El sitio está cerrado a los buscadores, a propósito.** `robots.txt` bloquea todo y todas las páginas llevan `noindex, nofollow`. Publicado así funciona, pero no aparece en Google. | `app/robots.ts:30-36` (`disallow: "/"`) · `app/layout.tsx:55` (`robots: { index: false, follow: false }`) | **Bloquea** | Quitar los dos el día que se publique, como dicen sus propios comentarios. Lo pongo en «Bloquea» porque el código mismo lo marca como requisito para publicar, no porque esté roto. |
| 3 | **Gotham sin licencia web.** Lo dice el propio código: los `.woff2` son «sólo para la maqueta local» y hay que comprar la licencia web antes de desplegar. El mismo comentario dice que los archivos están fuera de git, y no es cierto: están dentro. | `app/layout.tsx:8-13` · `app/fonts/Gotham-Medium.woff2`, `Gotham-Bold.woff2` (versionados) | **Bloquea** | Que Altea compre la licencia web y cambiar los archivos por los suyos. |
| 4 | **La familia Gotham completa quedaría descargable.** 16 `.otf` de escritorio (Thin a Ultra, con itálicas, 2.6 MB) en `public/`, versionados. Todo lo que está en `public/` se sirve tal cual: cualquiera podría bajar `/fonts/Gotham/Gotham-Book.otf`. Ningún archivo del código los usa. | `public/fonts/Gotham/` | **Bloquea** | Sacarlos de `public/` y del repositorio. |
| 5 | **Relleno visible en Términos y condiciones.** El bloque de contacto muestra literalmente «[RAZÓN SOCIAL COMPLETA]» y el correo «info@alteadesarrollos», sin «.com». Las dos cosas salen en la página (comprobado en el HTML generado). | `app/_legal/terminos.ts:262` | **Bloquea** | La razón social completa y el correo correcto, de Altea. |
| 6 | **El aviso de privacidad no dice quién es el responsable.** El segundo párrafo de la sección I empieza «es el responsable del uso y protección de sus datos personales…» sin sujeto: se perdió el nombre al pegar. En la misma sección hay «México,,», y la firma del final vuelve a decir «info@alteadesarrollos». | `app/_legal/aviso-de-privacidad.ts:45` · `:40` · `:254` | **Bloquea** | El texto completo de la sección I y el correo correcto, de Altea. Las erratas no se corrigieron a propósito: es un documento legal (ver `aviso-de-privacidad.ts:6-8`). |
| 7 | **El aviso remite a una URL que no existe.** La sección VII dice que los cambios se publican en `alteadesarrollos.com/privacidad`; la página vive en `/aviso-de-privacidad`. | `app/_legal/aviso-de-privacidad.ts:234` | Debería | Que el texto diga la ruta real, o una redirección de `/privacidad` a `/aviso-de-privacidad`. |
| 8 | **El aviso contradice al formulario.** La sección IV dice que el correo «se recopila como dato opcional»; el formulario lo exige. | `app/_legal/aviso-de-privacidad.ts:85` · `app/ui/LeadForm.tsx:106` (`required`) | Debería | Que Altea decida cuál de los dos cambia. |
| 9 | **No hay GA4 ni pixel de Meta.** No existe código ni identificador, ni real ni de ejemplo. Y la sección VIII del aviso dice que el sitio no usa cookies: hoy es cierto, pero deja de serlo en cuanto se pongan. | Sin código · `app/_legal/aviso-de-privacidad.ts:240-245` | **GA4 puesto** (oct. 2026, `G-D6JC931K3B`, `app/layout.tsx`). Falta el pixel de Meta, y la sección VIII del aviso ya no es cierta: el sitio sí usa cookies. | Los identificadores reales, el aviso de cookies si hace falta y reescribir la sección VIII al mismo tiempo. |
| 10 | **Ninguna página tiene Open Graph** ni imagen para compartir, y no hay `metadataBase` (hace falta para que las URLs de esa imagen salgan absolutas). Un enlace compartido en WhatsApp o LinkedIn sale sin imagen. | `app/layout.tsx` (sin `openGraph` ni `metadataBase`) · 0 etiquetas `og:` en las 9 páginas generadas | Debería | La imagen de Altea para compartir y la URL de producción. |
| 11 | **El favicon es el de create-next-app**, no el de Altea: 25 931 bytes, sin cambios desde el commit inicial. Tampoco hay `apple-touch-icon` ni `manifest`. | `app/favicon.ico` (commit `21bf86d`) | **Resuelto** (oct. 2026): isotipo oscuro en `app/icon.svg`, `favicon.ico` y `apple-icon.png`. | El favicon y el ícono de app de Altea. |
| 12 | **El home no tiene título propio:** hereda «Altea» del layout. La descripción también es la genérica, aunque esa sí es correcta. Las otras ocho páginas tienen título y descripción propios. | `app/page.tsx` (sin `metadata`) · `app/layout.tsx:37` | Debería | Un título para el home. |
| 13 | **No hay página 404 propia.** Sale la de Next, en inglés («This page could not be found»). | No existe `app/not-found.tsx` | Debería | Una 404 con la navegación del sitio. |
| 14 | **El póster del video del home no existe.** Mientras el video carga —y en iOS con ahorro de batería, si no arranca— se ve un cuadro vacío, y la petición da 404. | `app/_home/content.ts:45` → `/video/poster.webp`, que no está en `public/video/` | **Resuelto** (`d590cd2`): póster del cuadro de los 3 s. | Exportar un fotograma del video como `poster.webp`. |
| 15 | **El video del home pesa 14.2 MB y arranca solo.** Con `autoPlay`, el `preload="metadata"` no evita la descarga: en un teléfono con datos son 14 MB al abrir el home. | `public/video/altea-institucional.mp4` · `app/_home/CorporateVideo.tsx:131-138` | **Resuelto** (`d590cd2`): carga al acercarse y 720p (4.6 MB) en teléfono. | Una versión comprimida para web, o una para móvil. |
| 16 | **Todas las páginas precargan una foto de 1.6 MB que no se usa.** El layout precarga `edificio-altea-home.webp` y la nube del hero viejo; solo los usaba `<IntroAltea>`, que ya no se monta. | `app/layout.tsx:69-80` | **Resuelto**: los dos `preload` se quitaron del layout. | Quitar los dos `preload`. |
| 17 | ~~**Las fotos de los heroes de unidad no pasan por el optimizador.**~~ **Decidido que no pasen** (octubre de 2026): están por *debajo* del tamaño al que se pintan, así que no hay resolución que recortar y recomprimirlas se vería dentro de las letras. La primera foto se pide ya desde el HTML. Ver «Las fotos de los heroes», abajo. | `app/_unidad/HeroCalado.tsx` (nota junto a `ZOOM`) · `app/_unidad/PaginaUnidad.tsx` (`preload`) | Decidido | Nada ahora. Lo único que las mejora es tener archivos más grandes (abajo). |
| 18 | **Los heroes de las unidades tienen el `ancla` sin medir** (el valor por omisión, 0.52): Industrial 5 fotos, Vivienda 5, Forestal 2 y las 6 plazas nuevas de Comercial. Nadie lo ha visto en navegador: no sé si dentro de las letras se ve el edificio o el cielo. | `industrial.ts:63-67` · `vivienda.ts:51-55` · `forestal.ts:43-44` · `comercial.ts:467, 485, 503, 521, 539, 557` (en `app/_unidad/contenido/`) | Debería | Verlos en un navegador y medir las anclas. |
| 19 | **Fotos de proyecto con `alt` vacío.** Son la foto principal de la ficha de cada proyecto, no decoración. Las plazas de Comercial sí tienen descripción, salvo Paseo La Fe. | `industrial.ts:118, 133, 151, 170, 187, 205` · `vivienda.ts:96, 114` · `comercial.ts:318` (en `app/_unidad/contenido/`) | Debería | Una línea por foto. |
| 20 | **Lo único contra spam es un campo trampa.** No hay límite de envíos ni captcha. Hoy da igual, porque el formulario no entrega nada (fila 1); en cuanto entregue, importa. | `app/_actions/enviar-lead.ts:25-29` | Debería | Límite por IP o un captcha invisible, junto con la fila 1. |
| 21 | **Hay 7 archivos sin commitear**, todos del 15 de octubre (15:37–15:43): las correcciones de móvil de hoy. | `CarpetasUnidades.tsx`, `nosotros.css`, `ProximosProyectos.tsx`, `unidad.css`, `CarruselTarjetas.tsx`, `NavBar.tsx`, `components.css` | Debería | Revisarlos en el teléfono y commitearlos. |
| 22 | **No hay `sitemap.xml`.** No existe ni generado ni escrito a mano; lo dice el propio `robots.ts`. | `app/robots.ts:26` | Debería | Un `app/sitemap.ts` con las 9 rutas, el mismo día que se abra `robots.txt`. |
| 23 | **Gotham Book (400) no se carga.** El texto corrido pide 400 y se pinta en Medium. El manual de marca pide justamente Medium para el cuerpo, así que se ve como debe; lo que no cuadra es el token `--peso-texto: 400`. | `app/layout.tsx:16, 25-28` · `app/globals.css` (`--peso-texto`) | Puede esperar | Cargar Book o poner el token en 500. Es una decisión de diseño, no un arreglo. |
| 24 | **Código muerto que sigue nombrando los tokens viejos de tipografía.** `Proximamente`, `HeroUnidad`, `MapaProyectos`, `Publicaciones`, `LeadCTA` e `IntroAltea` no se montan en ninguna página, pero se siguen exportando. En CSS, `.home-hero`, `.home-stats`, `.home-units` y 18 reglas de `components.css` usan `--text-h1`…`--text-display-2`, que ya no existen. | `app/ui/index.ts:39, 61, 70, 75, 84` · `app/_home/home.css` · `app/ui/components.css` | Puede esperar | Borrarlo en un commit aparte. No se ve: ninguna página lo pinta. |
| 25 | **El logo de unidad de Forestal sigue faltando**, pero ningún componente pinta logos de unidad: los seis que existen tampoco se usan. Solo lo mencionan dos comentarios. | `public/brand/business-units/` (Comercial, Industrial y Vivienda, sin Forestal) · `forestal.ts:51` · `marca.ts:6` | Puede esperar | Nada hasta que algo los use. |
| 26 | **Se publicarían 56 archivos de `public/` que nadie usa (22.3 MB).** Entre ellos: `video/institucional-prueba.mp4` (6.8 MB), `hero/edificio-altea-home-oldoldoldold.webp` (1.6 MB), `images/comercial/altea-hero-comercial.webp` (2.0 MB; se nombra en el contenido pero no se pinta), `comercial/hoteles/nh-collections-altea.webp` (1.5 MB), `comercial/cta/comercial-foto-cta-vieja.png` y los cinco SVG de create-next-app (`next.svg`, `vercel.svg`…). | `public/` | Puede esperar | Limpiar antes del despliegue. |
| 27 | **No hay `.env.example`.** Hoy el proyecto no necesita ninguna variable de entorno; en cuanto se conecte el formulario va a necesitar las del destino. | Raíz del repo | Puede esperar | Crearlo junto con la fila 1. |
| 28 | **El enlace al video completo en Vimeo está pendiente.** El hueco del botón «ver completo» ya existe en el componente. | `app/_home/content.ts:47-50` | Puede esperar | La URL de Vimeo. |

## Los ocho que ya sabíamos, hoy

| # | Pendiente | Hoy |
|---|---|---|
| 1 | Lo sin commitear y la escala en su commit | La escala está en su propio commit, `19e86a0`. Después hay dos commits tuyos del 14 (`a4df89d`, `f5db9ef`). Sin commitear quedan 7 archivos de hoy (fila 21). |
| 2 | Logo de Forestal | Sigue faltando, pero no se pinta en ningún lado: no hay nada en su lugar porque ninguna página usa logos de unidad (fila 25). |
| 3 | Textos legales | La ruta quedó en `/aviso-de-privacidad` (y `/terminos`); `/privacidad` no existe y el aviso la sigue citando (fila 7). Siguen faltando la razón social (fila 5) y el «.com» del correo (filas 5 y 6). Además falta el sujeto de la sección I del aviso (fila 6). |
| 4 | Los dos amarillos | **Ya no hay dos.** `#FDCE5B` vive solo en `app/ui/tokens.css:46` como `--unidad-comercial`; `#F7CC47` solo aparece en un comentario (`comercial.ts:1060`) que explica el cambio. |
| 5 | `Proximamente.tsx` y los tokens viejos | Siguen ahí, sin pintarse (fila 24). |
| 6 | Gotham Book | Sigue sin cargarse (fila 23). |
| 7 | Los `.otf` en `public/fonts/` | Siguen ahí: 16 archivos, versionados (fila 4). |
| 8 | Las anclas de los heroes | Siguen en el valor por omisión, y sin ver en navegador (fila 18). |

## Lo que se revisó y está bien

- **Enlaces:** ninguno roto, vacío ni hacia rutas que no existen en las páginas generadas. Todos los internos van a una de las 9 rutas.
- **Imágenes:** de las 166 rutas a `public/` que hay en el código, solo falta `poster.webp` (fila 14).
- **Textos «PENDIENTE»:** ninguno llega a una página. Los de Industrial, Vivienda y Forestal viven en secciones que no se montan (`giros` vacío, `marcas.mostrar: false`).
- **Textos copiados de Comercial:** ninguno. Entre unidades solo coinciden «Apodaca, Nuevo León» y el título genérico «Próximos proyectos».
- **Idioma:** `<html lang="es-MX">` en todas.
- **Credenciales:** ninguna escrita en el código. Hoy no hay variables de entorno.
- **Dependencias:** todas se usan (`d3-geo`, en el script del mapa; `react-dom` y los `@types`, por Next y TypeScript).
- **Datos de contacto:** confirmados por Altea en `lib/contacto.ts:5`.

## Las diez imágenes más pesadas

| Peso | Archivo | Dónde se usa | ¿Optimizador de Next? |
|---:|---|---|---|
| 1.98 MB | `images/comercial/altea-hero-comercial.webp` | En ningún sitio (se nombra en `comercial.ts:152`, sin consumidor) | — |
| 1.82 MB | `images/vivienda/galeria/galeria-vivienda-altea-2.webp` | Hero de Vivienda | No: `background-image` |
| 1.82 MB | `images/home/unidades-de-negocio/vivienda-unidad-altea.webp` | Carpetas del home | Sí |
| 1.62 MB | `hero/edificio-altea-home-oldoldoldold.webp` | En ningún sitio | — |
| 1.55 MB | `images/home/unidades-de-negocio/comercial-paseo-la-fe-altea.webp` | Carpetas del home | Sí |
| 1.52 MB | `hero/edificio-altea-home.webp` | Precargada en todas las páginas; no la pinta nadie (fila 16) | No |
| 1.47 MB | `images/vivienda/galeria/galeria-vivienda-altea-3.webp` | Hero de Vivienda | No: `background-image` |
| 1.46 MB | `images/comercial/hoteles/nh-collections-altea.webp` | En ningún sitio | — |
| 1.31 MB | `images/vivienda/galeria/galeria-vivienda-altea-5.webp` | Hero de Vivienda | No: `background-image` |
| 1.20 MB | `images/forestal/imagen-principal/lote-13-forestal-altea.webp` | Hero de Forestal | No: `background-image` |

El video institucional pesa 14.2 MB y solo se usa en el home (fila 15). `public/` pesa 94 MB en total.

## Cuántos hay

- **Bloquea:** 6 (filas 1–6)
- **Debería:** 16 (filas 7–22)
- **Puede esperar:** 6 (filas 23–28)

## Lo que no estaba en ninguna lista

1. **El aviso de privacidad no nombra al responsable** (fila 6). La sección I tiene un párrafo sin sujeto.
2. **El log del servidor guarda los datos personales de cada envío** (fila 1).
3. **El aviso contradice al formulario** sobre si el correo es opcional (fila 8), **y dice que no hay cookies**, cosa que cambia en cuanto entre GA4 o el pixel (fila 9).
4. **El favicon es el de Next** (fila 11).
5. **Falta el póster del video** (fila 14).
6. **Todas las páginas precargan 1.6 MB que no se usan** (fila 16).
7. **El video pesa 14 MB y arranca solo** (fila 15), y **las fotos de los heroes no pasan por el optimizador** (fila 17).
8. **El comentario de `layout.tsx` dice que las fuentes están fuera de git, y están dentro** (fila 3).
9. **Hay 22 MB en `public/` que nadie usa**, entre ellos un video de prueba de 6.8 MB (fila 26).

## Lo que no pude revisar

- **Cómo se ve en un navegador real.** No levanté servidor. Todo lo visual se midió sobre copias estáticas del build, sin JavaScript. Quedan sin ver:
  - el encuadre de los heroes (fila 18);
  - las animaciones (scroll de las carpetas, nube de /nosotros, banderola de puntos);
  - el video en iOS;
  - el formulario enviándose de verdad.
- **Errores en la consola del navegador** y de hidratación: solo aparecen con la página corriendo.
- **Producción:** no hay URL ni despliegues registrados en GitHub, así que no sé qué se sirve hoy, si Gotham carga allí ni con qué dominio.
- **Rendimiento medido** (Lighthouse, tiempos de carga): solo di los pesos.
- **/contacto** se genera al pedirla y no deja HTML estático. Sus enlaces, título y descripción los revisé en el código, no en la página servida.
- **El texto de los documentos legales**, más allá de lo marcado: no los revisé jurídicamente.

## Las fotos de los heroes: más chicas de lo que se pintan

*Octubre de 2026.* Se deja escrito para que nadie proponga «comprimir las fotos» o «pasarlas por el optimizador» y las empeore.

**El hecho.** La foto de cada hero de unidad se pinta tres veces con la misma URL: dentro de la palabra calada, en la capa a pantalla completa que se abre con el scroll (`.uni-hero__lleno`) y en la mitad de la banderola. Esa capa cubre la ventana **a lo alto** y además lleva `SOBRE_CUBRE` (1.16) y un acercamiento de hasta `ZOOM` (+24 %) al final del recorrido (`app/_unidad/HeroCalado.tsx`). El ancho al que se pinta, en píxeles de dispositivo, contra los archivos de ~2 000 px:

| Pantalla | En reposo | Al final del scroll |
|---|---|---|
| Teléfono 412 × 823 a 1.75× (foto 3:2) | ~2 500 px | ~3 100 px |
| Teléfono 412 × 823 a 1.75× (Industrial, 1.79:1) | ~3 000 px | ~3 700 px |
| Escritorio 1440 × 900 a 1× | ~1 670 px | ~2 070 px |
| Escritorio 1440 × 900 a 2× (retina) | ~3 340 px | ~4 140 px |

Los archivos: `paseo-la-fe-altea.webp` 2000 × 1332 (822 KB), `galeria-industrial-altea-1.webp` 1980 × 1105 (448 KB), `amarantha-vivienda-altea.webp` 1979 × 1319 (1.18 MB), `lote-13-forestal-altea.webp` 1980 × 1318 (1.23 MB).

**La consecuencia.** En teléfono y en retina la foto ya se está **estirando** entre 1.25 y 2 veces, y por eso se ve suave. Es el estado actual y está aceptado.

**Lo que NO se hace, y por qué:**

- **No comprimirlas, no recomprimirlas, no pasarlas por `/_next/image`.** El optimizador sirve para bajar resolución que sobra, y aquí no sobra: lo único que podría hacer es bajar la calidad. Una foto vista a través de una tipografía enseña sólo fragmentos, y en fragmentos la compresión se nota más que en la foto entera; al final del scroll, además, la foto ocupa la pantalla completa.
- **No bajar `ZOOM` ni `SOBRE_CUBRE`** para «que alcancen los píxeles»: eso cambia el encuadre y el gesto del hero, que es diseño aprobado.

**Lo que sí las mejoraría, cuando toque:** archivos originales de Altea de unos 3 000–4 300 px de ancho, en calidad alta. Pesarían más, así que el día que lleguen habrá que decidir si se sirve una versión por ancho de pantalla, siempre igual o mayor al ancho al que se pinta.

**Lo que ya se hizo sin tocar la imagen:** la primera foto se pide desde el HTML (`preload` con prioridad alta en `PaginaUnidad.tsx`), porque la ponía el JavaScript y el navegador se enteraba 7–10 s tarde.

**Lo que se probó y no entró:** diferir la precarga de la segunda foto hasta el `load`. Mejoraba más el LCP de Vivienda y Forestal, pero en Comercial, a 10 Mbps, la segunda foto ya no estaba lista en el primer relevo: cambiaba el relevo. Ver la nota en `HeroCalado.tsx` (`pintar`).

