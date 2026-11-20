/* Todo lo que cambia de un negocio a otro está en este archivo. */
window.MARCA = {
  id: "off",
  nombre: "Off Basic",
  logo: ["Off", "Basic"],
  logoEstilo: "recto",
  // Logo: el símbolo de apagado arriba, "OFF" grande y "Basic" debajo.
  logoHtml: "<svg class=\"corona\" viewBox=\"0 0 60 34\" aria-hidden=\"true\"><path d=\"M22.5 9.2a12.5 12.5 0 1 0 15 0\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M30 3v14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"4\" stroke-linecap=\"round\"/></svg>Off<span>Basic</span>",
  sellos: 10,
  hitos: [{ en: 5, pct: 10 }, { en: 7, pct: 20 }, { en: 10, pct: 70 }],
  whatsapp: "", // número del local con código de país, sin + ni espacios
  pinDemo: "1234",
  diasInactivo: 45,
  horasEntreSellosNfc: 12,
  // Cuota mensual. Poner null si el negocio no la ofrece.
  membresia: { nombre: "Club Off", precio: 30000, detalle: "Cortes ilimitados de lunes a jueves" },
  // Ubicación del local para el aviso por cercanía. Es de ejemplo: cargar la dirección real.
  local: { lat: -31.4201, lng: -64.1888, radio: 150 },
  // Turnos: precios, horarios y barberos son de ejemplo.
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
  // Azul noche, hueso y un azul eléctrico de acento. Sobre el papel el azul se oscurece.
  tema: {
    "--carbon": "#0B0F17", "--panel": "#141A26", "--linea": "#283247", "--gris": "#97A0B2",
    "--crema": "#EEEBE4", "--crema-2": "#C2C6CF", "--tinta": "#0E1220", "--tinta-suave": "#4E5568",
    "--acento": "#4C82FF", "--acento-2": "#2350C8", "--sobre-acento": "#FFFFFF", "--sobre-sello": "#EEEBE4",
    "--madera": "#1A2232", "--ruido-papel": "none",
  },
  css: ".papel,.hoja,.planilla,.ticket,.agenda{--acento:#2350C8;--acento-2:#16388F;--sobre-acento:#FFFFFF}",
};
