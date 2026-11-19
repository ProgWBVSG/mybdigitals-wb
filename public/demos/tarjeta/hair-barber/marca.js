/* Todo lo que cambia de un negocio a otro está en este archivo. */
window.MARCA = {
  id: "hair",
  nombre: "Hair Barber",
  logo: ["Hair", "Barber"],
  logoEstilo: "recto", // "script" (manuscrito) o "recto" (letra de imprenta)
  sellos: 10,
  hitos: [{ en: 5, pct: 10 }, { en: 7, pct: 20 }, { en: 10, pct: 70 }],
  whatsapp: "", // número del local con código de país, sin + ni espacios
  pinDemo: "1234",
  diasInactivo: 45,
  horasEntreSellosNfc: 12,
  // Ubicación del local para el aviso por cercanía. Es de ejemplo: cargar la dirección real.
  local: { lat: -31.4201, lng: -64.1888, radio: 150 },
  // Verde botella, crema y mostaza.
  tema: {
    "--carbon": "#0F1F1A", "--panel": "#1A2F28", "--linea": "#2F4A41", "--gris": "#9DAAA2",
    "--acento": "#D9A441", "--acento-2": "#8A6417", "--sobre-acento": "#17130A", "--sobre-sello": "#17130A",
    "--madera": "#2A1D13",
  },
};
