/* Todo lo que cambia de un negocio a otro está en este archivo. */
window.MARCA = {
  id: "miracutz",
  moneda: "eur",
  nombre: "Miras.cutz",
  logo: ["Miras.cutz", "Peluquería"],
  logoEstilo: "recto",
  // Logo: un portón de garaje arriba y el nombre en letra de plantilla.
  logoHtml: "<svg class=\"corona\" viewBox=\"0 0 60 36\" aria-hidden=\"true\"><path d=\"M4 34V12L30 3l26 9v22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linejoin=\"round\"/><path d=\"M12 34V17h36v17M12 23h36M12 29h36\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\"/></svg>Miras.cutz<span>Peluquería</span>",
  sellos: 10,
  hitos: [{ en: 5, pct: 10 }, { en: 7, pct: 20 }, { en: 10, pct: 70 }],
  whatsapp: "", // número del local con código de país, sin + ni espacios
  // Acceso de ejemplo. En la versión real la contraseña se guarda cifrada en el servidor.
  acceso: { usuario: "miras", clave: "1234" },
  diasInactivo: 45,
  horasEntreSellosNfc: 12,
  // Cuota mensual. Poner null si el negocio no la ofrece.
  membresia: { nombre: "Club Miras", precio: 30, detalle: "Cortes ilimitados de martes a jueves" },
  // Ubicación del local para el aviso por cercanía. Es de ejemplo: cargar la dirección real.
  local: { lat: 40.4168, lng: -3.7038, radio: 150 },
  // Citas: precios, horarios y barberos son de ejemplo.
  turnos: {
    barberos: [{ id: "gorka", nombre: "Gorka" }, { id: "nico", nombre: "Nico" }],
    servicios: [
      { id: "corte", nombre: "Corte", min: 30, precio: 12 },
      { id: "corte-barba", nombre: "Corte y barba", min: 60, precio: 18 },
      { id: "barba", nombre: "Barba", min: 30, precio: 8 },
    ],
    dias: [2, 3, 4, 5, 6],          // martes a sábado (0 = domingo)
    desde: 10, hasta: 20, paso: 30, // de 10 a 20, citas cada 30 minutos
    cancelarHasta: 2,               // horas antes: hasta ahí se cancela o cambia sin problema
    zona: "Europe/Madrid",
  },
  // Colores del garaje (los mismos de tema.css, que se carga antes para que no parpadee).
  tema: {
    "--carbon": "#17181A", "--panel": "#232527", "--linea": "#3B3E41", "--gris": "#A6AAAE",
    "--crema": "#F0F2F3", "--crema-2": "#C4C8CB", "--tinta": "#1B1C1E", "--tinta-suave": "#565A5E",
    "--acento": "#F0F2F3", "--acento-2": "#8B9094", "--sobre-acento": "#17181A", "--sobre-sello": "#F0F2F3",
    "--madera": "#3A3D41", "--ruido-papel": "none",
  },
  // Sello de taller: un engranaje (la rueda del garaje) en vez del poste de barbero.
  selloIcono: (t) => '<g fill="none" stroke="' + t + '" stroke-width="3.2" stroke-linejoin="round"><circle cx="50" cy="50" r="17"/><circle cx="50" cy="50" r="6.5"/></g><g fill="' + t + '">' + [0, 45, 90, 135].map((a) => '<rect x="44.5" y="22" width="11" height="12.5" rx="1.6" transform="rotate(' + a + ' 50 50)"/><rect x="44.5" y="65.5" width="11" height="12.5" rx="1.6" transform="rotate(' + a + ' 50 50)"/>').join("") + "</g>",
  semilla: [
    ["Iker Santos", [150, 122, 96, 70, 41, 30, 20, 3]],
    ["Unai Prieto", [228, 200, 171, 140, 112, 85, 60, 33, 9]],
    ["Javi Romero", [95, 66, 38, 12]],
    ["Sergio Molina", [120, 88, 61]],
    ["Álex Navarro", [210, 180, 150, 121, 93, 70]],
    ["Dani Vega", [30, 5]],
    ["Marcos Gil", [260, 230, 200, 171, 140, 110, 82, 55, 30, 6]],
    ["Hugo Ferrer", [14]],
  ],
};

/* Lo que el dueño cambia en Ajustes (servicios, precios, horario, barberos) pisa lo de arriba.
   En la demo queda en el navegador; en la versión real vive en el servidor. */
(function () {
  "use strict";
  const M = window.MARCA, CLAVE = M.id + ".ajustes.v1";
  M.ajustes = {
    leer: () => { try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) { return {}; } },
    poner: (a) => { try { localStorage.setItem(CLAVE, JSON.stringify(a)); return true; } catch (e) { return false; } },
    borrar: () => { try { localStorage.removeItem(CLAVE); } catch (e) { /* sin almacenamiento */ } },
  };
  const a = M.ajustes.leer();
  ["servicios", "barberos", "dias", "desde", "hasta"].forEach((k) => { if (a[k] !== undefined) M.turnos[k] = a[k]; });
  if (a.cuota && M.membresia) M.membresia.precio = a.cuota;
  if (Array.isArray(a.hitos)) M.hitos = a.hitos;
  window.addEventListener("storage", (e) => { if (e.key === CLAVE) location.reload(); });
})();
