/* Todo lo que cambia de un negocio a otro está en este archivo. */
window.MARCA = {
  id: "roy",
  nombre: "Roy Barbería",
  logo: ["Roy", "Barbería"],
  logoEstilo: "recto", // "script" (manuscrito) o "recto" (letra de imprenta)
  sellos: 10,
  hitos: [{ en: 5, pct: 10 }, { en: 7, pct: 20 }, { en: 10, pct: 70 }],
  whatsapp: "", // número del local con código de país, sin + ni espacios
  pinDemo: "1234",
  diasInactivo: 45,
  horasEntreSellosNfc: 12,
  // Cuota mensual. Poner null si el negocio no la ofrece.
  membresia: { nombre: "Club Roy", precio: 30000, detalle: "Cortes ilimitados de lunes a jueves" },
  // Ubicación del local para el aviso por cercanía. Es de ejemplo: cargar la dirección real.
  local: { lat: -31.4201, lng: -64.1888, radio: 150 },
  // Blanco y negro. Sobre fondo oscuro el acento es blanco; sobre papel, negro.
  tema: {
    "--carbon": "#0A0A0A", "--panel": "#161616", "--linea": "#303030", "--gris": "#9C9C9C",
    "--crema": "#F2F2F0", "--crema-2": "#BEBEBE", "--tinta": "#0A0A0A", "--tinta-suave": "#555555",
    "--acento": "#F2F2F0", "--acento-2": "#7E7E7E", "--sobre-acento": "#0A0A0A", "--sobre-sello": "#F2F2F0",
    "--madera": "#1C1C1C", "--ruido-papel": "none",
  },
  // Dentro del papel el acento pasa a negro, para que se vea.
  css: ".papel,.hoja,.planilla,.ticket{--acento:#0A0A0A;--acento-2:#3A3A3A;--sobre-acento:#F2F2F0;--sobre-sello:#F2F2F0}",
};
