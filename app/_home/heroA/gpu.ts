/**
 * ¿Hay aceleración por hardware para WebGL? Decide si el hero monta la A.
 *
 * POR QUÉ EXISTE. Sin GPU, WebGL se dibuja por software (SwiftShader, llvmpipe)
 * y la escena pasa a costar el hilo principal entero: medido a 412×823 con CPU
 * 4×, el home tenía 4 a 6 s de TBT —en PageSpeed, 19.6 s— y la página se sentía
 * congelada. Con GPU cuesta 55 ms. Así que donde no hay GPU no se monta la
 * escena, y el hero queda con su titular y su campo de puntos. Donde la hay no
 * cambia nada.
 *
 * ⚠ ANTE LA DUDA, NO. Si no se puede saber qué dibuja —el navegador oculta el
 * nombre del renderizador, como Firefox con la protección contra huellas, que
 * contesta «Mozilla»—, se responde que no hay GPU. Equivocarse hacia ese lado
 * cuesta una A que nadie echa de menos; equivocarse al revés deja la página
 * congelada.
 *
 * Tres pruebas, en este orden:
 *   1. `failIfMajorPerformanceCaveat`: el navegador se niega a dar el contexto
 *      cuando sabe que va a ir lento (software o GPU en lista negra).
 *   2. El nombre del renderizador: el desenmascarado de WEBGL_debug_renderer_info
 *      si existe (Chrome, Safari «Apple GPU», Firefox ya saneado), y si no
 *      RENDERER. Si dice software, no.
 *   3. Si el nombre falta o es genérico —«Mozilla», «WebKit WebGL»—, no se
 *      puede saber: no.
 *
 * Se prueba en un lienzo suelto que se suelta al terminar (WEBGL_lose_context),
 * para no gastar uno de los contextos que el navegador limita por página.
 */

/* Los nombres que dan los renderizadores por software conocidos. */
const SOFTWARE =
  /swiftshader|llvmpipe|softpipe|lavapipe|software|basic render|mesa offscreen|google angle \(swiftshader/i;

/* Lo que contesta un navegador que no quiere decir qué hay detrás. */
const GENERICO = /^(mozilla|webkit webgl|webkit|generic renderer|unknown|)$/i;

export function hayGpu(): boolean {
  try {
    const lienzo = document.createElement("canvas");
    const opciones = { failIfMajorPerformanceCaveat: true };
    const gl = (lienzo.getContext("webgl2", opciones) ??
      lienzo.getContext("webgl", opciones)) as WebGLRenderingContext | null;
    if (!gl) return false;

    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const nombre = String(
      (ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : null) ??
        gl.getParameter(gl.RENDERER) ??
        "",
    ).trim();
    gl.getExtension("WEBGL_lose_context")?.loseContext();

    if (SOFTWARE.test(nombre)) return false;
    if (GENERICO.test(nombre)) return false;
    return true;
  } catch {
    return false;
  }
}
