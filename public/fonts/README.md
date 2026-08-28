# Fuentes de marca

Deja aquí los archivos de **Gotham** con licencia web. En cuanto estén, se
sustituye Poppins (el sustituto temporal) tocando solo `app/layout.tsx` y
`app/globals.css`.

## Qué se necesita

El manual de identidad especifica Gotham en dos pesos. Con eso basta:

| Archivo esperado      | Peso CSS | Uso |
| --------------------- | -------- | --- |
| `Gotham-Medium.woff2` | 500      | cuerpo de texto, labels, eyebrows |
| `Gotham-Bold.woff2`   | 700      | display, titulares, botones |

Nada de itálicas ni condensadas — el manual no las contempla.

## Formato

`.woff2` es lo ideal (pesa ~40% menos que `.otf` y es lo que sirve el sitio).
Si Altea solo entrega `.otf`/`.ttf`, se convierten con `fonttools`:

```sh
pip install "fonttools[woff]"
fonttools ttLib.woff2 compress -o Gotham-Medium.woff2 Gotham-Medium.otf
```

## Licencia — leer antes de subir nada

Gotham es una fuente comercial de Hoefler&Co (hoy Monotype). Servirla desde este
dominio requiere **licencia web** (self-hosting o por pageviews). La licencia de
escritorio con la que se diseñó el manual **no** cubre el sitio: son productos
distintos.

Antes de subir los archivos, confirmar con Altea que existe esa licencia web y
guardar el comprobante. Copias descargadas de sitios de fuentes gratuitas no
sirven: el archivo queda servido públicamente desde el dominio del cliente y es
justo lo que las fundiciones auditan.

Si no hay licencia, el plan B es Montserrat (SIL Open Font License, gratis) —
mucho más cercana a Gotham que Poppins.
