/**
 * Piezas que se repiten entre documentos: la línea de titular con su tramo
 * marcado, las cifras, la foto con su texto alternativo y el texto legal.
 */
import { createElement, type ReactNode } from "react";
import { defineArrayMember, defineField, defineType } from "sanity";
import {
  PREFIJOS,
  SIGNOS,
  anchoMinimo,
  maximo,
  maximoCifra,
  textoDeAncho,
  textoPlano,
  type CampoDeFoto,
} from "../reglas";

/* ── Línea de titular con tramo marcado ───────────────────────────────── */

/**
 * EL ACENTO VIAJA DENTRO DEL TEXTO, pegado a sus palabras. Hoy el titular es una
 * lista de trozos `{ texto, atenuado }` (home) o `{ texto, acento }`
 * (/nosotros); aquí es un bloque de Portable Text con UNA sola marca posible.
 * Quien edita selecciona las palabras y aprieta el botón: si después cambia la
 * frase, la marca se queda con esas palabras y no con un índice.
 *
 * Se ve igual que hoy porque el bloque se convierte en los mismos trozos que
 * pinta el componente: cada tramo de texto con la marca es un trozo con
 * `atenuado: true` (o `acento: true`), y el resto, trozos sin ella. Sin
 * estilos, sin listas, sin enlaces y sin saltos: un solo renglón de diseño.
 */
const Atenuado = (props: { children?: ReactNode }) =>
  createElement("span", { style: { opacity: 0.45 } }, props.children);
const Acento = (props: { children?: ReactNode }) =>
  createElement("span", { style: { color: "#C2493D" } }, props.children);

export const lineaTitular = (opciones: {
  name: string;
  marca: "atenuado" | "acento";
  max: number;
  motivo: string;
}) =>
  defineType({
    name: opciones.name,
    title: "Línea del titular",
    type: "array",
    of: [
      defineArrayMember({
        type: "block",
        styles: [],
        lists: [],
        marks: {
          decorators: [
            opciones.marca === "atenuado"
              ? { title: "Atenuado (gris)", value: "atenuado", component: Atenuado }
              : { title: "Acento (coral)", value: "acento", component: Acento },
          ],
          annotations: [],
        },
      }),
    ],
    validation: (rule) => [
      rule.required().error("La línea no puede ir vacía."),
      rule.custom((valor) =>
        ((valor as unknown[] | undefined)?.length ?? 0) <= 1
          ? true
          : "Es un solo renglón de diseño: sin saltos de línea ni párrafos. Cada línea del titular va en su propio campo.",
      ),
      rule.custom((valor) =>
        /\n/.test(textoPlano(valor))
          ? "Sin saltos de línea: el renglón lo decide el diseño."
          : true,
      ),
      maximo(opciones.max, opciones.motivo)(rule),
    ],
  });

/* ── Cifras ───────────────────────────────────────────────────────────── */

/**
 * Una cifra animada. El VALOR es un número —el contador lo anima y le pone las
 * comas— y el prefijo y el signo son opciones cerradas (ver reglas.ts).
 */
export const cifra = (opciones: {
  name: string;
  maxCifra: number;
  motivoCifra: string;
  maxEtiqueta: number;
  motivoEtiqueta: string;
  /** El home lleva una «nota» delante de la etiqueta: «de m²» + «de territorio». */
  conNota?: boolean;
}) =>
  defineType({
    name: opciones.name,
    title: "Cifra",
    type: "object",
    fields: [
      defineField({
        name: "prefijo",
        title: "Antes del número",
        type: "string",
        options: { list: PREFIJOS, layout: "radio", direction: "horizontal" },
        initialValue: "",
        description:
          "«+» se lee en voz alta como «más de» para quien usa lector de pantalla.",
      }),
      defineField({
        name: "valor",
        title: "Número",
        type: "number",
        description:
          "Sólo el número, sin comas ni símbolos: 376034, 18.8, 94. Las comas las pone el sitio.",
        validation: (rule) => rule.required().min(0),
      }),
      defineField({
        name: "signo",
        title: "Después del número",
        type: "string",
        options: { list: SIGNOS, layout: "radio", direction: "horizontal" },
        initialValue: "",
        description: "Se pinta en el color de la unidad. «M» se lee «millones».",
      }),
      ...(opciones.conNota
        ? [
            defineField({
              name: "nota",
              title: "Inicio de la etiqueta",
              type: "string",
              description:
                "La parte que va pegada al número, p. ej. «de m²». Cuenta junto con la etiqueta para el máximo.",
            }),
          ]
        : []),
      defineField({
        name: "etiqueta",
        title: "Etiqueta",
        type: "string",
        description: `Lo que va debajo del número. Máximo ${opciones.maxEtiqueta} caracteres${opciones.conNota ? " junto con el inicio" : ""}: más larga, ${opciones.motivoEtiqueta}.`,
        validation: (rule) =>
          rule.required().custom((etiqueta, ctx) => {
            const nota = opciones.conNota
              ? ((ctx.parent as { nota?: string } | undefined)?.nota ?? "")
              : "";
            const total = (nota ? `${nota} ` : "") + (etiqueta ?? "");
            return total.length <= opciones.maxEtiqueta
              ? true
              : `«${total}» tiene ${total.length} caracteres y el máximo es ${opciones.maxEtiqueta}: más larga, ${opciones.motivoEtiqueta}.`;
          }),
      }),
    ],
    validation: (rule) => maximoCifra(opciones.maxCifra, opciones.motivoCifra)(rule),
    preview: {
      select: { prefijo: "prefijo", valor: "valor", signo: "signo", etiqueta: "etiqueta", nota: "nota" },
      prepare: ({ prefijo, valor, signo, etiqueta, nota }) => ({
        title: `${prefijo ?? ""}${typeof valor === "number" ? valor.toLocaleString("es-MX") : "—"}${signo ?? ""}`,
        subtitle: [nota, etiqueta].filter(Boolean).join(" "),
      }),
    },
  });

/* ── Foto con texto alternativo ───────────────────────────────────────── */

/**
 * Una foto con punto focal y su descripción para lectores de pantalla. El ancho
 * mínimo es el de ese lugar del sitio (reglas.ts, ANCHO).
 */
export const foto = (opciones: {
  name: string;
  title: string;
  ancho: CampoDeFoto;
  donde: string;
  description?: string;
  /** Las fotos decorativas (las tarjetas) llevan el alt opcional. */
  altObligatorio?: boolean;
  group?: string;
}) =>
  defineField({
    name: opciones.name,
    title: opciones.title,
    type: "image",
    group: opciones.group,
    options: { hotspot: true },
    description: [
      opciones.description,
      textoDeAncho(opciones.ancho),
      "Marca el punto focal sobre lo importante: es lo que se conserva al recortar.",
    ]
      .filter(Boolean)
      .join(" "),
    fields: [
      defineField({
        name: "alt",
        title: "Descripción de la foto",
        type: "string",
        description:
          "Qué se ve, para quien no puede verla (lector de pantalla) y para Google. Una frase: «Fachada de Paseo La Fe al atardecer».",
        validation: (rule) =>
          opciones.altObligatorio ? rule.required().error("Describe la foto.") : rule,
      }),
    ],
    validation: (rule) => [
      rule.required().error("Falta la foto."),
      anchoMinimo(opciones.ancho, opciones.donde)(rule),
    ],
  });

/* ── Texto legal con formato ──────────────────────────────────────────── */

/**
 * Lo único con formato del sitio: el aviso de privacidad y los términos. Lo
 * mismo que hoy entiende PaginaLegal.tsx: párrafos, subtítulos, listas,
 * negritas y enlaces.
 */
export const textoLegal = defineType({
  name: "textoLegal",
  title: "Texto con formato",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Párrafo", value: "normal" },
        { title: "Subtítulo", value: "h3" },
      ],
      lists: [{ title: "Lista", value: "bullet" }],
      marks: {
        decorators: [{ title: "Negrita", value: "strong" }],
        annotations: [
          defineArrayMember({
            name: "link",
            type: "object",
            title: "Enlace",
            fields: [
              defineField({
                name: "href",
                title: "Dirección",
                type: "url",
                description:
                  "Una página del sitio empieza con «/» (p. ej. /aviso-de-privacidad); una de fuera, con https://. Correo: mailto:…; teléfono: tel:…",
                validation: (rule) =>
                  rule
                    .required()
                    .uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
              }),
            ],
          }),
        ],
      },
    }),
  ],
});

export const objetos = [textoLegal];
