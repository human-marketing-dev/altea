import type { DocumentoLegal } from "../tipos";

/**
 * Versión en inglés de app/_legal/terminos.ts. La forma, los pendientes del
 * texto y el porqué viven allá; aquí solo cambia el texto.
 *
 * Traducción fiel: se conservan el correo sin ".com", la coma final del
 * domicilio y el hueco de la razón social (traducido, sigue visible a
 * propósito). La nota de que prevalece la versión en español va como primer
 * bloque de `intro`. El enlace al aviso apunta, como en español, a
 * /aviso-de-privacidad.
 */
export const TERMINOS: DocumentoLegal = {
  metadata: {
    title: "Terms and conditions — Altea",
    description:
      "Terms and conditions of use of the Altea Desarrollos y Proyectos website.",
  },
  titulo: "Terms and Conditions of Use",
  bajada: "Last updated: OCTOBER 6, 2026",
  intro: [
    {
      tipo: "p",
      texto:
        "This English version is provided for reference only. In the event of any discrepancy, the Spanish version shall prevail.",
    },
    {
      tipo: "p",
      texto:
        "Welcome to the website of **ALTEA DESARROLLOS Y PROYECTOS** (hereinafter, “ALTEA DESARROLLOS”). Access to and use of this website implies acceptance of these Terms and Conditions of Use.",
    },
    {
      tipo: "p",
      texto:
        "We recommend that you read them carefully before using the site.",
    },
  ],
  secciones: [
    {
      titulo: "1. Acceptance of the terms",
      bloques: [
        {
          tipo: "p",
          texto:
            "By accessing, browsing or using this website, the user acknowledges having read and understood these Terms and Conditions and agrees to be bound by them and by the applicable legal provisions.",
        },
        {
          tipo: "p",
          texto:
            "If the user does not agree with any of these terms, the user must refrain from using the website.",
        },
      ],
    },
    {
      titulo: "2. Use of the website",
      bloques: [
        {
          tipo: "p",
          texto:
            "The purpose of the content of this site is to provide information about **ALTEA DESARROLLOS, its projects, developments, services, activities and other content related to the company**.",
        },
        {
          tipo: "p",
          texto:
            "The user undertakes to use the site lawfully and responsibly, and not to carry out activities that may affect its operation, security or availability.",
        },
        { tipo: "p", texto: "It is prohibited to use this site to:" },
        {
          tipo: "lista",
          items: [
            "Carry out activities contrary to applicable laws.",
            "Attempt to gain unauthorized access to systems, servers or information.",
            "Introduce viruses, malicious code or any other element that may affect the operation of the site.",
            "Use the content of the site for commercial purposes without prior authorization.",
            "Reproduce, modify, distribute or exploit the content of the site without the corresponding authorization.",
          ],
        },
      ],
    },
    {
      titulo: "3. Project and development information",
      bloques: [
        {
          tipo: "p",
          texto:
            "The information published on this site regarding projects, real estate developments, areas, features, images, renders, locations, amenities, availability, prices, dates and other specifications is informational in nature.",
        },
        {
          tipo: "p",
          texto:
            "The features, dimensions, images, finishes, designs, prices, availability and other elements of the projects may be subject to change without prior notice.",
        },
        {
          tipo: "p",
          texto:
            "The images, renders, photographs and graphic representations used on the site may be illustrative and may not necessarily represent the final result of a project exactly.",
        },
        {
          tipo: "p",
          texto:
            "The publication of information about a project does not, in itself, constitute an offer, promise of sale, contract or commitment of availability, unless expressly stated otherwise and formalized through the corresponding instruments.",
        },
      ],
    },
    {
      titulo: "4. Forms and requests for information",
      bloques: [
        {
          tipo: "p",
          texto:
            "The site may include forms through which the user may request information, contact ALTEA DESARROLLOS or express interest in any of its projects or services.",
        },
        {
          tipo: "p",
          texto:
            "The user undertakes to provide **true, current and complete** information when using such forms.",
        },
        {
          tipo: "p",
          texto:
            "Submitting a form does not imply the execution of a contract, nor does it guarantee the availability of a project, property, space or service.",
        },
        {
          tipo: "p",
          texto:
            "The information provided through these forms will be processed in accordance with our **[Privacy Notice](/aviso-de-privacidad)**, available on this website.",
        },
      ],
    },
    {
      titulo: "5. Intellectual property",
      bloques: [
        {
          tipo: "p",
          texto:
            "All content available on this site, including but not limited to texts, photographs, images, renders, videos, graphics, logos, trade names, trademarks, designs, visual elements, plans and other materials, is the property of ALTEA DESARROLLOS or is used with the corresponding authorizations.",
        },
        {
          tipo: "p",
          texto:
            "The total or partial copying, reproduction, distribution, modification, publication, transmission or exploitation of such content without the prior written authorization of ALTEA DESARROLLOS is prohibited, except for those uses permitted by applicable legislation.",
        },
        {
          tipo: "p",
          texto:
            "Access to the website does not grant the user any property rights over its content.",
        },
      ],
    },
    {
      titulo: "6. Trademarks and trade names",
      bloques: [
        {
          tipo: "p",
          texto:
            "The trademarks, logos, trade names and other distinctive signs used on this site are the property of their respective owners.",
        },
        {
          tipo: "p",
          texto:
            "Their use, reproduction or exploitation without the corresponding authorization is prohibited.",
        },
      ],
    },
    {
      titulo: "7. Links to external sites",
      bloques: [
        {
          tipo: "p",
          texto:
            "This site may contain links to third-party web pages, platforms or services.",
        },
        {
          tipo: "p",
          texto:
            "Such links are provided solely for reference or to facilitate access to additional information. ALTEA DESARROLLOS does not necessarily control the content, operation, privacy policies or practices of such external sites and, therefore, assumes no responsibility for them.",
        },
        {
          tipo: "p",
          texto:
            "The user is advised to consult the applicable terms and policies of any third-party site visited.",
        },
      ],
    },
    {
      titulo: "8. Availability and operation of the site",
      bloques: [
        {
          tipo: "p",
          texto:
            "ALTEA DESARROLLOS will endeavor to keep the website available and operating properly; however, it does not guarantee that the website will be permanently available or free of errors or interruptions.",
        },
        {
          tipo: "p",
          texto:
            "The site may be modified, suspended or updated at any time, without giving rise to any liability on the part of ALTEA DESARROLLOS.",
        },
      ],
    },
    {
      titulo: "9. Limitation of liability",
      bloques: [
        {
          tipo: "p",
          texto:
            "ALTEA DESARROLLOS endeavors to ensure that the information published on this site is clear and up to date. However, there may be errors, omissions or changes in the information.",
        },
        {
          tipo: "p",
          texto:
            "ALTEA DESARROLLOS shall not be liable for damages or losses arising from the use the user makes of the information contained on the site, to the extent permitted by applicable legislation.",
        },
        {
          tipo: "p",
          texto:
            "The published information does not replace the contractual, technical, legal or commercial documentation corresponding to each project or service.",
        },
      ],
    },
    {
      titulo: "10. Amendments to the Terms and Conditions",
      bloques: [
        {
          tipo: "p",
          texto:
            "ALTEA DESARROLLOS may modify or update these Terms and Conditions at any time, whenever necessary due to changes in the operation of the site or in its services, or due to legal or regulatory amendments.",
        },
        {
          tipo: "p",
          texto:
            "Amendments will be published in this same section, indicating the date of their last update.",
        },
        {
          tipo: "p",
          texto: "Periodic consultation of this section is recommended.",
        },
      ],
    },
    {
      titulo: "11. Governing law",
      bloques: [
        {
          tipo: "p",
          texto:
            "These Terms and Conditions shall be governed by and construed in accordance with the laws applicable in the United Mexican States.",
        },
        {
          tipo: "p",
          texto:
            "For any dispute relating to the interpretation or application of these terms, the parties shall submit to the authorities and jurisdictions that are competent under the applicable legislation.",
        },
      ],
    },
    {
      titulo: "12. Contact",
      bloques: [
        {
          tipo: "p",
          texto:
            "For any questions, comments or clarifications regarding these Terms and Conditions, you may contact us through:",
        },
        {
          tipo: "p",
          /* Como en español: el correo viene sin ".com" y no se enlaza. */
          texto:
            "**ALTEA DESARROLLOS Y PROYECTOS, S.A. DE C.V. [FULL CORPORATE NAME]**\n**Address:** calle Paricutin 390, Colonia Roma, C.P. 64700 Monterrey, Nuevo León, México,\n**Email:** info@alteadesarrollos\n**Telephone:** [81 1772 7272](tel:+528117727272)",
        },
      ],
    },
  ],
  cierre: [{ tipo: "p", texto: "**Last updated:** OCTOBER 6, 2026" }],
};
