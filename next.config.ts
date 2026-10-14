import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Las extensiones por defecto, más `dev.tsx` sólo en desarrollo.
   *
   * Es lo que mantiene app/mapa-demo/page.dev.tsx fuera del build de
   * producción: al no estar `dev.tsx` en la lista, Next no reconoce el archivo
   * como página y la ruta no existe — no es que responda 404, es que no se
   * compila. En `next dev` sí está y se puede probar el mapa aislado.
   *
   * La lista base tiene que ir completa: `pageExtensions` REEMPLAZA el valor por
   * defecto, y resuelve también layout, route y demás archivos especiales. Si se
   * omitiera `tsx`, no habría sitio.
   */
  pageExtensions:
    process.env.NODE_ENV === "development"
      ? ["js", "jsx", "mdx", "ts", "tsx", "dev.tsx"]
      : ["js", "jsx", "mdx", "ts", "tsx"],
  images: {
    /*
     * 75 es el valor por defecto de Next 16 y el único que acepta sin esta
     * lista: cualquier otro `quality` se rebaja al más cercano. El 90 es para
     * los PNG recortados con alfa —el del cierre de /comercial—, donde el filo
     * del recorte es lo primero que se ensucia al comprimir.
     */
    qualities: [75, 90],
  },
};

export default nextConfig;
