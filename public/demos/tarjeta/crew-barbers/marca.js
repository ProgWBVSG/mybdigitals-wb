/* Todo lo que cambia de un negocio a otro está en este archivo. */
window.MARCA = {
  id: "crew",
  nombre: "Crew Barbers",
  logo: ["Crew", "Barbers"],
  logoEstilo: "script", // "script" (manuscrito) o "recto" (letra de imprenta)
  sellos: 10,
  hitos: [{ en: 5, pct: 10 }, { en: 7, pct: 20 }, { en: 10, pct: 70 }],
  whatsapp: "", // número del local con código de país, sin + ni espacios
  pinDemo: "1234",
  diasInactivo: 45,
  horasEntreSellosNfc: 12,
  // Cuota mensual. Poner null si el negocio no la ofrece.
  membresia: { nombre: "Club Crew", precio: 30000, detalle: "Cortes ilimitados de lunes a jueves" },
  // Ubicación del local para el aviso por cercanía. Es de ejemplo: cargar la dirección real.
  local: { lat: -31.4201, lng: -64.1888, radio: 150 },
  tema: {}, // usa los colores base: carbón, crema y naranja
};
