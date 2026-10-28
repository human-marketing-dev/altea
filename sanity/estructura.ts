/**
 * La navegación del Studio, por cómo piensa Altea el sitio: las páginas por un
 * lado, los proyectos por otro, y lo que se comparte entre páginas aparte. Los
 * documentos únicos se abren directo, sin pasar por una lista de uno.
 */
import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { UNICOS } from "./schemaTypes";
import { UNIDADES } from "./reglas";

const unico = (S: StructureBuilder, id: string) => {
  const u = UNICOS.find((x) => x.id === id)!;
  return S.listItem()
    .id(u.id)
    .title(u.titulo)
    .child(S.document().schemaType(u.tipo).documentId(u.id).title(u.titulo));
};

export const estructura: StructureResolver = (S) =>
  S.list()
    .title("Altea")
    .items([
      S.listItem()
        .title("Páginas")
        .child(
          S.list()
            .title("Páginas")
            .items([
              unico(S, "paginaInicio"),
              unico(S, "paginaNosotros"),
              S.listItem()
                .title("Unidades de negocio")
                .child(
                  S.list()
                    .title("Unidades de negocio")
                    .items(UNIDADES.map((u) => unico(S, `unidad-${u.value}`))),
                ),
              unico(S, "paginaContacto"),
              S.divider(),
              unico(S, "legal-aviso"),
              unico(S, "legal-terminos"),
            ]),
        ),
      S.listItem()
        .title("Proyectos")
        .child(
          S.list()
            .title("Proyectos")
            .items([
              S.listItem()
                .title("Todos")
                .child(S.documentTypeList("proyecto").title("Todos los proyectos")),
              S.divider(),
              ...UNIDADES.map((u) =>
                S.listItem()
                  .title(u.title)
                  .child(
                    S.documentList()
                      .title(u.title)
                      .schemaType("proyecto")
                      .filter('_type == "proyecto" && unidad == $u')
                      .params({ u: u.value })
                      .initialValueTemplates([
                        S.initialValueTemplateItem("proyecto-de-unidad", { unidad: u.value }),
                      ]),
                  ),
              ),
              S.divider(),
              S.listItem()
                .title("Próximos")
                .child(
                  S.documentList()
                    .title("Próximos")
                    .schemaType("proyecto")
                    .filter('_type == "proyecto" && estado == "proximo"'),
                ),
            ]),
        ),
      S.listItem()
        .title("Otros giros (Comercial)")
        .child(S.documentTypeList("giro").title("Otros giros")),
      S.divider(),
      S.listItem()
        .title("Compartido entre páginas")
        .child(
          S.list()
            .title("Compartido")
            .items([unico(S, "cierre"), unico(S, "ajustesSitio"), unico(S, "presencia")]),
        ),
    ]);
