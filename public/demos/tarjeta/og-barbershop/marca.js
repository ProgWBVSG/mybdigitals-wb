/* Todo lo que cambia de un negocio a otro está en este archivo. */
window.MARCA = {
  id: "og",
  nombre: "OG Barbershop",
  logo: ["OG", "Barbershop"],
  logoEstilo: "recto",
  // Logo: "OG" grande con una estrella arriba y "Barbershop" debajo.
  logoHtml: "<svg class=\"corona\" viewBox=\"0 0 60 34\" aria-hidden=\"true\"><path d=\"M30 3l4.6 9.4 10.4 1.5-7.5 7.3 1.8 10.3L30 26.6l-9.3 4.9 1.8-10.3-7.5-7.3 10.4-1.5z\" fill=\"currentColor\"/></svg>OG<span>Barbershop</span>",
  sellos: 10,
  hitos: [{ en: 5, pct: 10 }, { en: 7, pct: 20 }, { en: 10, pct: 70 }],
  whatsapp: "", // número del local con código de país, sin + ni espacios
  pinDemo: "1234",
  diasInactivo: 45,
  horasEntreSellosNfc: 12,
  // Cuota mensual. Poner null si el negocio no la ofrece.
  membresia: { nombre: "Club OG", precio: 30000, detalle: "Cortes ilimitados de lunes a jueves" },
  // Ubicación del local para el aviso por cercanía. Es de ejemplo: cargar la dirección real.
  local: { lat: -31.4201, lng: -64.1888, radio: 150 },
  // Turnos: sólo esta marca los tiene. Precios, horarios y barberos son de ejemplo.
  turnos: {
    barberos: [{ id: "nico", nombre: "Nico" }, { id: "fede", nombre: "Fede" }],
    servicios: [
      { id: "corte", nombre: "Corte", min: 30, precio: 12000 },
      { id: "corte-barba", nombre: "Corte y barba", min: 60, precio: 17000 },
      { id: "barba", nombre: "Barba", min: 30, precio: 8000 },
    ],
    dias: [2, 3, 4, 5, 6],          // martes a sábado (0 = domingo)
    desde: 10, hasta: 20, paso: 30, // de 10 a 20, turnos cada 30 minutos
    cancelarHasta: 2,               // horas antes: hasta ahí se cancela o cambia sin problema
    zona: "America/Argentina/Cordoba",
  },
  // Negro y dorado. Sobre el papel el dorado se oscurece para que se lea.
  tema: {
    "--carbon": "#0E0E10", "--panel": "#19191C", "--linea": "#2E2E33", "--gris": "#A19A8A",
    "--crema": "#F1EADB", "--crema-2": "#C9BFA6", "--tinta": "#121214", "--tinta-suave": "#5B5446",
    "--acento": "#D9A62E", "--acento-2": "#8A6512", "--sobre-acento": "#121214", "--sobre-sello": "#F1EADB",
    "--madera": "#2A1D12",
  },
  css: ".papel,.hoja,.planilla,.ticket,.agenda{--acento:#A87A12;--acento-2:#6E500C;--sobre-acento:#F1EADB}",
};
