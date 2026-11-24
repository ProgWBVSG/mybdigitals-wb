/* Todo lo que cambia de un negocio a otro está en este archivo. */
window.MARCA = {
  id: "dami",
  nombre: "Dami Shop",
  logo: ["Dami", "Shop"],
  logoEstilo: "recto",
  // Logo de ejemplo (no tenemos el suyo): un poste de barbero acostado, "Dami" y "Shop" debajo.
  logoHtml: "<svg class=\"corona\" viewBox=\"0 0 60 34\" aria-hidden=\"true\"><defs><clipPath id=\"dp\"><rect x=\"7\" y=\"10\" width=\"46\" height=\"15\" rx=\"7.5\"/></clipPath></defs><g clip-path=\"url(#dp)\" stroke=\"currentColor\" stroke-width=\"4\"><path d=\"M0 30L18 4M10 30L28 4M20 30L38 4M30 30L48 4M40 30L58 4M50 30L68 4\"/></g><rect x=\"7\" y=\"10\" width=\"46\" height=\"15\" rx=\"7.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\"/><rect x=\"2\" y=\"7\" width=\"6\" height=\"21\" rx=\"2.5\" fill=\"currentColor\"/><rect x=\"52\" y=\"7\" width=\"6\" height=\"21\" rx=\"2.5\" fill=\"currentColor\"/></svg>Dami<span>Shop</span>",
  sellos: 10,
  hitos: [{ en: 5, pct: 10 }, { en: 7, pct: 20 }, { en: 10, pct: 70 }],
  whatsapp: "", // número del local con código de país, sin + ni espacios
  pinDemo: "1234",
  diasInactivo: 45,
  horasEntreSellosNfc: 12,
  // Cuota mensual. Poner null si el negocio no la ofrece.
  membresia: { nombre: "Club Dami", precio: 30000, detalle: "Cortes ilimitados de lunes a jueves" },
  // Ubicación del local para el aviso por cercanía. Es de ejemplo: cargar la dirección real.
  local: { lat: -31.4201, lng: -64.1888, radio: 150 },
  // Turnos: precios, horarios y barberos son de ejemplo.
  turnos: {
    barberos: [{ id: "dami", nombre: "Dami" }, { id: "leo", nombre: "Leo" }],
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
  // Negro azulado, hueso y verde esmeralda de acento. Sobre el papel el verde se oscurece.
  tema: {
    "--carbon": "#0B0E12", "--panel": "#141A20", "--linea": "#273039", "--gris": "#97A3AD",
    "--crema": "#F0EDE4", "--crema-2": "#CBC6B8", "--tinta": "#11161B", "--tinta-suave": "#56606A",
    "--acento": "#34C48F", "--acento-2": "#1F8F68", "--sobre-acento": "#07130E", "--sobre-sello": "#07130E",
    "--madera": "#1A2128", "--ruido-papel": "none",
  },
  css: ".papel,.hoja,.planilla,.ticket,.agenda{--acento:#168A60;--acento-2:#0F6B49;--sobre-acento:#FFFFFF}",
  semilla: [
    ["Tomás Agüero", [150, 122, 96, 70, 41, 30, 20, 3]],
    ["Lautaro Paz", [228, 200, 171, 140, 112, 85, 60, 33, 9]],
    ["Franco Medina", [95, 66, 38, 12]],
    ["Joaquín Sosa", [120, 88, 61]],
    ["Agustín Roldán", [210, 180, 150, 121, 93, 70]],
    ["Ignacio Ruiz", [30, 5]],
    ["Mateo Giménez", [260, 230, 200, 171, 140, 110, 82, 55, 30, 6]],
    ["Santiago Vera", [14]],
  ],
};
