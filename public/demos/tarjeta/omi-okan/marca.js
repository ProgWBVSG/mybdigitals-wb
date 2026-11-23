/* Todo lo que cambia de un negocio a otro está en este archivo. */
window.MARCA = {
  id: "omi",
  nombre: "Omi Okan Gallery",
  logo: ["Omi Okan", "Gallery"],
  logoEstilo: "recto",
  // Logo: el símbolo de apagado arriba, "OFF" grande y "Basic" debajo.
  logoHtml: "<img class=\"corona\" src=\"logo.png\" alt=\"\" style=\"width:1.5em\">Omi Okan<span>Gallery</span>",
  sellos: 10,
  hitos: [{ en: 5, pct: 10 }, { en: 7, pct: 20 }, { en: 10, pct: 70 }],
  whatsapp: "", // número del local con código de país, sin + ni espacios
  pinDemo: "1234",
  diasInactivo: 45,
  horasEntreSellosNfc: 12,
  // Cuota mensual. Poner null si el negocio no la ofrece.
  membresia: { nombre: "Club Omi", precio: 30000, detalle: "Cortes ilimitados de lunes a jueves" },
  // Ubicación del local para el aviso por cercanía. Es de ejemplo: cargar la dirección real.
  local: { lat: -31.4201, lng: -64.1888, radio: 150 },
  // Turnos: precios, horarios y barberos son de ejemplo.
  turnos: {
    barberos: [{ id: "bruno", nombre: "Bruno" }, { id: "nico", nombre: "Nico" }],
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
    "--carbon": "#0A0A0B", "--panel": "#151413", "--linea": "#2E2B26", "--gris": "#A19A8C",
    "--crema": "#EFE9DD", "--crema-2": "#CFC6B3", "--tinta": "#15130F", "--tinta-suave": "#5C564A",
    "--acento": "#D6BE8C", "--acento-2": "#A58B55", "--sobre-acento": "#15130F", "--sobre-sello": "#15130F",
    "--madera": "#1B1916", "--ruido-papel": "none",
  },
  css: ".papel,.hoja,.planilla,.ticket,.agenda{--acento:#8F7440;--acento-2:#6E5829;--sobre-acento:#FFFFFF}",
  semilla: [
    ["Tomás Agüero", [150, 122, 96, 70, 41, 30, 20, 3]],
    ["Lautaro Paz", [228, 200, 171, 140, 112, 85, 60, 33, 9]],
    ["Franco Medina", [95, 66, 38, 12]],
    ["Joaquín Sosa", [120, 88, 61]],
    ["Thiago Ledesma", [210, 180, 150, 121, 93, 70]],
    ["Ignacio Ruiz", [30, 5]],
    ["Mateo Giménez", [260, 230, 200, 171, 140, 110, 82, 55, 30, 6]],
    ["Santiago Vera", [14]],
  ],
};
