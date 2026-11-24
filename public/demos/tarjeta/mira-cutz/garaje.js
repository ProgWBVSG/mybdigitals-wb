/* Abre y cierra la puerta. En modo "carga" se abre sola apenas el nombre está listo (tope: 0,6 s). */
(function () {
  "use strict";
  const G = document.getElementById("garaje"); if (!G) return;
  const raiz = document.documentElement, quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const acceso = G.dataset.modo === "acceso";
  let reloj;
  const espera = (ms) => new Promise((ok) => { clearTimeout(reloj); reloj = setTimeout(ok, ms); });
  const pausa = (ms) => new Promise((ok) => setTimeout(ok, ms));
  function abrir() {
    G.classList.remove("cerrando", "niega"); G.classList.add("abriendo"); raiz.classList.remove("garaje-cerrado");
    return espera(quieto ? 190 : acceso ? 1180 : 640).then(() => { G.hidden = true; G.classList.remove("abriendo"); });
  }
  function cerrar() {
    G.hidden = false; G.classList.remove("abriendo", "niega"); G.classList.add("cerrando"); raiz.classList.add("garaje-cerrado");
    return espera(quieto ? 60 : 720).then(() => G.classList.remove("cerrando"));
  }
  function negar() { G.classList.remove("niega"); void G.offsetWidth; G.classList.add("niega"); pausa(360).then(() => G.classList.remove("niega")); }
  window.GARAJE = { abrir, cerrar, negar };

  if (!acceso) {
    const letra = document.fonts && document.fonts.load ? document.fonts.load('40px "Saira Stencil One"').catch(() => {}) : Promise.resolve();
    Promise.race([Promise.all([letra, pausa(220)]), pausa(600)]).then(abrir);
  } else if (!G.hidden) raiz.classList.add("garaje-cerrado");
})();
