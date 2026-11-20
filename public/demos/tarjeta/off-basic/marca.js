/* Todo lo que cambia de un negocio a otro está en este archivo. */
window.MARCA = {
  id: "off",
  nombre: "Off Basic",
  logo: ["Off", "Basic"],
  logoEstilo: "recto", // "script" (manuscrito) o "recto" (letra de imprenta)
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
  // Azul eléctrico sobre fondo tinta. Colores de ejemplo: cambiar por los reales de la peluquería.
  tema: {
    "--carbon": "#0E1117", "--panel": "#181C25", "--linea": "#2B3140", "--gris": "#9AA3B5",
    "--acento": "#4C6FFF", "--acento-2": "#2437A8", "--sobre-acento": "#FFFFFF", "--sobre-sello": "#FFFFFF",
    "--madera": "#1A1F2B",
  },
};
