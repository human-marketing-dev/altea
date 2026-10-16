# SEO técnico: inventario y lista de publicación

Revisión de octubre de 2026, hecha sobre el HTML que entrega el build de
producción (`.next/server/app/*.html`), no sólo sobre el código fuente.
`/contacto` es dinámica y no tiene HTML prerenderizado: lo suyo se dedujo del
código y va marcado así.

**El sitio está cerrado a propósito.** Este documento existe para que al abrirlo
no se escape nada: si un solo punto de la lista se olvida, el sitio queda
invisible y nadie se entera en semanas.

---

## 1 · Dónde está cerrado el sitio

Son **dos lugares**, y no hay más:

| # | Archivo | Qué hay | Qué emite |
|---|---|---|---|
| 1 | `app/robots.ts:33` | `rules: { userAgent: "*", disallow: "/" }`, sin `sitemap` | `/robots.txt` → `User-Agent: *` / `Disallow: /` |
| 2 | `app/layout.tsx:55` | `robots: { index: false, follow: false }` | `<meta name="robots" content="noindex, nofollow">` en todas las páginas |

Comprobado que **no** hay nada más:

- Ninguna página define su propio `robots` y no hay `generateMetadata`.
- `next.config.ts` no tiene `headers()`: no se envía `X-Robots-Tag`.
- No hay `middleware.ts` ni `proxy.ts`.
- No hay `vercel.json`, `netlify.toml` ni otra configuración de hosting en el repo.

Si el hosting añade cabeceras propias, hay que revisarlas allí: desde el repo
no se ven.

---

## 2 · El dominio

**Hoy `alteadesarrollos.com` sirve un WordPress**, y ya tiene decidido el
canónico:

```
http://alteadesarrollos.com       301 → https://www.alteadesarrollos.com/
https://alteadesarrollos.com      301 → https://www.alteadesarrollos.com/
http://www.alteadesarrollos.com   301 → https://www.alteadesarrollos.com/
https://www.alteadesarrollos.com  200
```

**Recomendación: conservar `https://www.alteadesarrollos.com` como canónico.**
Es lo que Google ya tiene indexado, y es la dirección que cita el aviso de
privacidad. Cambiarlo al dominio sin www obligaría a Google a reaprender todas
las URLs.

**⚠ PENDIENTE DE DECIDIR (Altea):** confirmar www. Hasta entonces, todo lo que
dependa del host está escrito con `https://www.alteadesarrollos.com`.

Las redirecciones de http→https y de sin www→www **no las hace Next**: van en
el hosting o el DNS, como hoy. Al migrar hay que comprobar que siguen puestas.

---

## 3 · Las URLs del sitio viejo

El sitemap del WordPress actual (`/wp-sitemap.xml`) publica 31 URLs. Si el sitio
nuevo se publica sin redirigirlas, todo lo que Google tenga indexado pasa a dar
404.

| URL vieja | Destino | Notas |
|---|---|---|
| `/`, `/nosotros/`, `/comercial/`, `/industrial/`, `/contacto/` | la misma ruta sin barra | Next ya redirige `/x/` → `/x` con 308; no hay que escribir nada |
| `/privacidad/` | `/aviso-de-privacidad` | **Hay que escribirla.** Además arregla el texto del aviso, que cita esta URL |
| `/desarrollos/paseo-la-fe/` y las otras 7 de `/desarrollos/*` | `/comercial` | Son plazas: Paseo Tec, Juárez, Durango, Los Mochis y Gómez Palacio, y Punto Huinala y Río Nilo |
| `/category/plazas-comerciales/` y `-2/`, `-3/` | `/comercial` | |
| `/wp-sitemap.xml` | `/sitemap.xml` | |
| `/hello-world/`, `/sample-page/`, `/prueba/`, `/category/uncategorized/`, `/author/*`, `/feed/`, `/comments/feed/` | ninguno: que den 404 (o 410) | Basura de WordPress; no conviene conservarla |
| `/?ae_global_templates=…` | nada | El home ignora el parámetro; la canónica lo resuelve |

Van en `next.config.ts` → `redirects()`, con `permanent: true`. Next responde
308, que Google trata igual que un 301.

---

## 4 · Inventario por ruta

| Ruta | Título | Descripción | Canónica | OG | h1 | Indexable hoy | Palabras* |
|---|---|---|---|---|---|---|---|
| `/` | «Altea» (5) — **heredado** | 119 car. — **heredada**, la misma que la 404 | no | no | «Creando proyectos que materializan sueños» | no | ~170 |
| `/nosotros` | «Nosotros — Altea» (16) | 164 car. — propia; algo larga | no | no | «Transformamos territorio en oportunidades» | no | ~480 (160 son la lista del mapa) |
| `/comercial` | «Comercial — Altea» (17) | 143 car. — propia | no | no | «Comercial» | no | ~280 |
| `/industrial` | «Industrial — Altea» (18) | 162 car. — la de la carpeta del home | no | no | «Industrial» | no | ~105 |
| `/vivienda` | «Vivienda — Altea» (16) | 132 car. — la de la carpeta del home | no | no | «Vivienda» | no | **~50** |
| `/forestal` | «Forestal — Altea» (16) | **48 car.** — la de la carpeta del home | no | no | «Forestal» | no | ~145 |
| `/contacto` † | «Contacto — Altea» (16) | 116 car. — propia | no | no | «Hablemos de tu proyecto» | no | no medido |
| `/aviso-de-privacidad` | «Aviso de privacidad — Altea» (27) | 124 car. — propia | no | no | «Aviso de privacidad» | no | ~1 070 |
| `/terminos` | «Términos y condiciones — Altea» (30) | 77 car. — propia | no | no | «Términos y Condiciones de Uso» | no | ~970 |
| 404 | **dos `<title>`**: «Altea» y «404: This page could not be found.» | heredada | — | no | «404» | — | 7, en inglés |

\* Texto del `<main>` que llega en el HTML, sin barra, pie ni duplicados
`aria-hidden`. Barra, pie y cierre suman unas 40 palabras más en cada página.
† Dinámica: deducido del código, no del HTML.

Todas las páginas llevan `lang="es-MX"` y exactamente un `h1`, que es texto real
(también la palabra del hero de las unidades: texto con la foto recortada por
CSS, no una imagen). No hay `og:*`, `twitter:*`, canónica ni JSON-LD en ninguna.

---

## 5 · Hallazgos

### Bloquea

1. **El sitio está cerrado en dos lugares** (§1). Es intencional; se abre con la
   lista del §7.
2. **Las URLs del WordPress sin redirigir** (§3). Lo que hoy está indexado
   pasaría a dar 404.
3. **Sin `metadataBase` ni canónicas.** `/contacto` se enlaza con cinco URLs
   distintas (`/contacto` y `?unidad=comercial|industrial|vivienda|forestal`) y
   el mismo contenido.
   - ⚠ La canónica NO puede ir en el layout: todas las páginas la heredarían y
     apuntarían al home. Va en cada página, o con un ayudante que la derive de
     la ruta.
4. **El favicon es el de `create-next-app`** (`app/favicon.ico`, 25 931 bytes,
   idéntico al de la plantilla). Google lo muestra junto al resultado.
5. **Las redirecciones de host (http→https, sin www→www)** dependen del hosting
   nuevo, que no está en el repo (§2).

### Debería

6. **Home con título y descripción genéricos.** «Altea» a secas, y la
   descripción la comparte con la 404. Los textos los aprueba Altea.
7. **Las descripciones de los proyectos no están en el HTML.** Las fichas
   (`<dialog>`) llegan vacías: el contenido se monta al abrirlas
   (`CarrilProyectos.tsx:72`, `FichaUnidad.tsx:78`). De cada plaza o proyecto,
   un buscador sólo lee formato, nombre y ciudad. Por eso Vivienda tiene ~50
   palabras y las unidades se ven delgadas.
8. **Sin Open Graph.** Un enlace compartido sale sin imagen ni descripción
   propia. Ver §6.
9. **Sin datos estructurados.** `Organization` en el layout y `BreadcrumbList`
   en las internas. Ver §6.
10. **Sin sitemap.** No hay `app/sitemap.ts` y `robots.ts` no declara ninguno.
11. **La 404 es la de Next, en inglés, sin barra ni pie** (un callejón sin
    enlaces), y con dos `<title>`. Por su `.meta` el código implica estado 404
    de verdad; no se pudo comprobar en vivo.
12. **El domicilio no coincide entre páginas.** El pie y contacto dicen
    «Paricutín 390, Nuevo Repueblo» (`lib/contacto.ts`). El aviso y los
    términos dicen «Colonia Roma, C.P. 64700». Para el marcado y para Google
    tiene que ser uno solo.
13. **El aviso de privacidad cita `https://www.alteadesarrollos.com/privacidad`**
    (`aviso-de-privacidad.ts:234`). La redirección del §3 hace que funcione;
    corregir el texto es decisión de Altea.
14. **La meta de Comercial dice «catorce plazas»**, y el hero dice «34 centros
    comerciales».
15. **El LCP de las unidades llega tarde.** La foto del hero la pone el JS como
    `background-image` (`HeroCalado.tsx:181`): sin `<img>`, sin precarga y sin
    pasar por el optimizador, así que el teléfono baja el mismo archivo de
    ~2000 px que el escritorio. Además rota y precarga la siguiente cada 4.2 s.

    | Unidad | Fotos | Primera foto | Todas |
    |---|---|---|---|
    | Comercial | 14 | 0.84 MB | 11.16 MB |
    | Industrial | 5 | 0.46 MB | 4.30 MB |
    | Vivienda | 3 | 1.21 MB | 4.29 MB |
    | Forestal | 2 | 1.26 MB | 2.53 MB |

16. **El video del home: 14.2 MB, `autoplay` y sin póster.** `autoplay` anula
    `preload="metadata"`, así que empieza a bajar con el HTML. El póster
    `/video/poster.webp` que pide `_home/content.ts:45` no existe: da 404. No es
    el LCP (está bajo el pliegue): el LCP del home es el texto del h1.
17. **Los `alt` de las fotos de proyecto están vacíos a propósito en los
    componentes** (`TarjetaProyecto.tsx:63`, `ProximosProyectos.tsx:157`,
    `CarrilProyectos.tsx:89`). Para accesibilidad es defendible, porque el
    nombre ya va en el botón. Para búsqueda de imágenes se pierden todas las
    fotos de proyecto.

    | Página | `<img>` | Describen la imagen | Vacíos | Logos |
    |---|---|---|---|---|
    | `/` | 12 | 1 (+3 sólo con el nombre) | 6 | 2 |
    | `/nosotros` | 19 | 7 | 4 (decorativos, bien) | 8 |
    | `/comercial` | 60 | 0 (+3 genéricos) | 19 | 38 |
    | `/industrial` | 15 | 0 | 13 | 2 |
    | `/vivienda` | 9 | 0 | 7 | 2 |
    | `/forestal` | 9 | 4 | 1 | 4 |

### Puede esperar

18. **En Forestal, los dos `h2` son sólo un logo** (`<img alt="Viveros
    Asturias">`), sin texto.
19. **Las descripciones de Industrial, Vivienda y Forestal repiten palabra por
    palabra** el texto de su carpeta en el home.
20. **«Próximos proyectos» va dos veces en Comercial e Industrial**: carrusel
    móvil y rejilla de escritorio, una oculta con `display: none`.
21. **El h1 del home y el de /nosotros pierden los espacios entre líneas en
    `textContent`** («proyectosque»): cada línea es un `span` sin espacio entre
    ellos. Google renderiza el CSS y lo lee bien; un espacio entre líneas lo
    asegura para cualquier extractor.
22. **El h1 de las unidades es texto transparente** hasta que el JS le pone la
    foto. Antes sólo se ve el contorno `aria-hidden`.
23. **`sizes` desmedidos**: el carrusel de Forestal pide `222vw` en escritorio,
    y a 1440 baja la variante de 3840 px.
24. **`X-Powered-By: Next.js`** (`poweredByHeader` no está en `false`), y
    restos de la plantilla en `public/` (`next.svg`, `vercel.svg`, `file.svg`,
    `globe.svg`, `window.svg`).

Lo que está bien:

- No hay rutas huérfanas: barra y pie enlazan las nueve.
- No hay enlaces internos rotos en el HTML.
- `app/mapa-demo` no se construye en producción.
- Las 31 imágenes de `next/image` tienen tamaño.
- El mapa de /nosotros repite sus datos en una lista de texto (sr-only).
- Los canvas y la A en 3D son decorativos, sin mensaje que se pierda.

---

## 6 · Lo que hay que preparar antes de abrir

**Open Graph.** `og:title`, `og:description`, `og:image` (URL absoluta,
1200 × 630), `og:url`, `og:type` (`website`) y `og:locale` (`es_MX`).

- *Una imagen para todo el sitio*: un solo diseño, cero mantenimiento, pero
  todas las páginas se comparten igual.
- *Una por unidad (home, nosotros y las cuatro unidades)*: seis imágenes, o una
  plantilla con `opengraph-image.tsx` (convención de archivos de Next) que
  componga foto, color de la unidad y nombre. La plantilla cuesta una tarde y
  luego no se mantiene; seis archivos a mano se desactualizan.
- Recomendación: la plantilla. Las unidades tienen color y foto propios, y es
  justo lo que distingue una tarjeta compartida de otra.

**Organization (JSON-LD, en el layout).** Datos que hoy existen y están
confirmados:

- nombre
- `url` (el host del §2)
- logo
- teléfono `+52 81 1772 7272`
- correo `info@alteadesarrollos.com`
- redes de `lib/contacto.ts`

El domicilio entra **sólo** cuando se resuelva el hallazgo 12. La razón social
completa tampoco está: los términos dicen literalmente «[RAZÓN SOCIAL
COMPLETA]».

**BreadcrumbList** en las internas (Inicio › Comercial…). Nada de marcado para
unidades ni proyectos sin revisarlo antes.

**Search Console.** La etiqueta de verificación va en `app/layout.tsx` →
`metadata.verification.google`. La alternativa es verificar por DNS, que no
toca el código y sobrevive a cualquier cambio de layout: es la recomendada.

---

## 7 · Lista de verificación de publicación

En este orden: el sitio se abre al final, cuando todo lo demás ya está puesto.

**Antes del día de publicación**

- [ ] Confirmar el host canónico (§2). Recomendado: `https://www.alteadesarrollos.com`.
- [ ] `app/layout.tsx`: `metadataBase: new URL("https://www.alteadesarrollos.com")`.
- [ ] Canónica propia y absoluta en cada página (9). **No en el layout** (hallazgo 3).
- [ ] `/contacto`: canónica a `/contacto` sin parámetros.
- [ ] Título y descripción propios del home, aprobados por Altea (hallazgo 6).
- [ ] Open Graph en todas las rutas, con imagen absoluta de 1200 × 630 (§6).
- [ ] `Organization` en el layout y `BreadcrumbList` en las internas, validados
      con la Prueba de resultados enriquecidos de Google (§6).
- [ ] Favicon y `apple-icon` de Altea en lugar de `app/favicon.ico` (hallazgo 4).
- [ ] `app/not-found.tsx` en español, con barra y pie (hallazgo 11).
- [ ] `app/sitemap.ts` con las 9 rutas indexables y URLs absolutas.
- [ ] `next.config.ts` → `redirects()` con la tabla del §3.
- [ ] Domicilio único en todo el sitio (hallazgo 12).

**El día de publicación**

- [ ] `app/robots.ts:33`: `allow: "/"` en lugar de `disallow: "/"`, y añadir
      `sitemap: "https://www.alteadesarrollos.com/sitemap.xml"`.
- [ ] `app/layout.tsx:55`: quitar `robots: { index: false, follow: false }`.
- [ ] Build y despliegue.

**Comprobar en producción, no en el código**

- [ ] `curl -I https://www.alteadesarrollos.com/`: 200 y sin `X-Robots-Tag: noindex`.
- [ ] `curl -I http://alteadesarrollos.com/`: 301/308 a `https://www.…/`.
- [ ] `curl https://www.alteadesarrollos.com/robots.txt`: sin `Disallow: /` y
      con la línea `Sitemap:`.
- [ ] `curl https://www.alteadesarrollos.com/sitemap.xml`: las 9 URLs con
      `https://www.`.
- [ ] En el código fuente de cada una de las 9 páginas: sin
      `<meta name="robots" content="noindex…">`, y con canónica absoluta propia.
- [ ] `curl -I https://www.alteadesarrollos.com/no-existe`: **404**, no 200.
- [ ] `curl -I https://www.alteadesarrollos.com/privacidad/` y una de
      `/desarrollos/…`: 308 al destino del §3.
- [ ] Search Console: verificar la propiedad (DNS), enviar el sitemap y usar
      «Inspeccionar URL» en el home y en una unidad.
- [ ] Una semana después: Search Console → Páginas, revisar que no haya
      «Excluida por la etiqueta noindex» ni 404 de URLs viejas sin redirigir.
