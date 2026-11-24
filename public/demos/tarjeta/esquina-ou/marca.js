/* Todo lo que cambia de un negocio a otro está en este archivo. */
window.MARCA = {
  id: "esquina-ou",
  nombre: "La Esquina OU",
  logo: ["La Esquina OU", "Barber"],
  logoEstilo: "recto",
  // Logo: el monograma OU (recorte de la imagen del perfil) y "La Esquina OU" con "Barber" debajo.
  logoHtml: "<img class=\"corona\" src=\"logo.png\" alt=\"\" style=\"width:1.7em\">La Esquina OU<span>Barber</span>",
  sellos: 10,
  hitos: [{ en: 5, pct: 10 }, { en: 7, pct: 20 }, { en: 10, pct: 70 }],
  whatsapp: "", // número del local con código de país, sin + ni espacios
  pinDemo: "1234",
  diasInactivo: 45,
  horasEntreSellosNfc: 12,
  // Cuota mensual. Poner null si el negocio no la ofrece.
  membresia: { nombre: "Club OU", precio: 30000, detalle: "Cortes ilimitados de lunes a jueves" },
  // Ubicación del local para el aviso por cercanía. Es de ejemplo: cargar la dirección real.
  local: { lat: -31.4201, lng: -64.1888, radio: 150 },
  // Turnos: precios, horarios y barberos son de ejemplo.
  turnos: {
    barberos: [{ id: "mati", nombre: "Mati" }, { id: "fran", nombre: "Fran" }],
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
  // Blanco y negro, como el logo. Nada de colores de acento.
  tema: {
    "--carbon": "#0A0A0A", "--panel": "#161616", "--linea": "#303030", "--gris": "#9C9C9C",
    "--crema": "#F2F2F0", "--crema-2": "#BEBEBE", "--tinta": "#0A0A0A", "--tinta-suave": "#555555",
    "--acento": "#F2F2F0", "--acento-2": "#7E7E7E", "--sobre-acento": "#0A0A0A", "--sobre-sello": "#F2F2F0",
    "--madera": "#1C1C1C", "--ruido-papel": "none",
  },
  css: "",
  semilla: [
    ["Tomás Agüero", [150, 122, 96, 70, 41, 30, 20, 3]],
    ["Lautaro Paz", [228, 200, 171, 140, 112, 85, 60, 33, 9]],
    ["Franco Medina", [95, 66, 38, 12]],
    ["Joaquín Sosa", [120, 88, 61]],
    ["Lucho Ferreyra", [210, 180, 150, 121, 93, 70]],
    ["Ignacio Ruiz", [30, 5]],
    ["Mateo Giménez", [260, 230, 200, 171, 140, 110, 82, 55, 30, 6]],
    ["Santiago Vera", [14]],
  ],
};
