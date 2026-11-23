/* Todo lo que cambia de un negocio a otro está en este archivo. */
window.MARCA = {
  id: "mira",
  moneda: "eur",
  nombre: "Mira.cutz",
  logo: ["Mira.cutz", "Peluquería"],
  logoEstilo: "recto",
  // Logo: el símbolo de apagado arriba, "OFF" grande y "Basic" debajo.
  logoHtml: "<svg class=\"corona\" viewBox=\"0 0 60 36\" aria-hidden=\"true\"><path d=\"M4 34V12L30 3l26 9v22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linejoin=\"round\"/><path d=\"M12 34V17h36v17M12 23h36M12 29h36\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\"/></svg>Mira.cutz<span>Peluquería</span>",
  sellos: 10,
  hitos: [{ en: 5, pct: 10 }, { en: 7, pct: 20 }, { en: 10, pct: 70 }],
  whatsapp: "", // número del local con código de país, sin + ni espacios
  pinDemo: "1234",
  diasInactivo: 45,
  horasEntreSellosNfc: 12,
  // Cuota mensual. Poner null si el negocio no la ofrece.
  membresia: { nombre: "Club Mira", precio: 30, detalle: "Cortes ilimitados de lunes a jueves" },
  // Ubicación del local para el aviso por cercanía. Es de ejemplo: cargar la dirección real.
  local: { lat: -31.4201, lng: -64.1888, radio: 150 },
  // Turnos: precios, horarios y barberos son de ejemplo.
  turnos: {
    barberos: [{ id: "gorka", nombre: "Gorka" }, { id: "nico", nombre: "Nico" }],
    servicios: [
      { id: "corte", nombre: "Corte", min: 30, precio: 12 },
      { id: "corte-barba", nombre: "Corte y barba", min: 60, precio: 18 },
      { id: "barba", nombre: "Barba", min: 30, precio: 8 },
    ],
    dias: [2, 3, 4, 5, 6],          // martes a sábado (0 = domingo)
    desde: 10, hasta: 20, paso: 30, // de 10 a 20, turnos cada 30 minutos
    cancelarHasta: 2,               // horas antes: hasta ahí se cancela o cambia sin problema
    zona: "Europe/Madrid",
  },
  // Azul noche, hueso y un azul eléctrico de acento. Sobre el papel el azul se oscurece.
  // Garaje: hormigón oscuro, chapa y amarillo de seguridad. Sobre el papel el amarillo se oscurece a ámbar.
  tema: {
    "--carbon": "#121314", "--panel": "#1E2022", "--linea": "#363A3E", "--gris": "#A2A5AA",
    "--crema": "#ECE7D6", "--crema-2": "#C9C2AB", "--tinta": "#17140E", "--tinta-suave": "#5A5545",
    "--acento": "#F2B705", "--acento-2": "#C58F00", "--sobre-acento": "#17140E", "--sobre-sello": "#17140E",
    "--madera": "#3A3D41", "--ruido-papel": "none",
  },
  // Gran parte del diseño de garaje va en este CSS: franja de peligro, chapa antideslizante, cinta, tipografía de plantilla.
  css: "@import url('https://fonts.googleapis.com/css2?family=Saira+Stencil+One&display=swap');" +
    ".papel,.hoja,.planilla,.ticket,.agenda{--acento:#B47D00;--acento-2:#7A5400;--sobre-acento:#FFFFFF}" +
    "body::before{content:'';position:fixed;left:0;right:0;top:0;height:11px;z-index:60;background:repeating-linear-gradient(-45deg,#F2B705 0 14px,#121314 14px 28px)}" +
    ".firma{position:relative;padding-top:26px}.firma::before{content:'';position:absolute;left:0;right:0;top:0;height:9px;background:repeating-linear-gradient(-45deg,#F2B705 0 14px,#121314 14px 28px)}" +
    "[data-letra=recto] .logo{font-family:'Saira Stencil One','Big Shoulders Display',sans-serif;font-size:2.35rem;letter-spacing:.03em;line-height:.95}" +
    "[data-letra=recto] .barra .logo{font-size:2rem}" +
    "[data-letra=recto] .logo span{font-family:'Big Shoulders Display',sans-serif;font-size:.36em;letter-spacing:.5em;text-indent:.5em;margin-top:8px;padding-top:6px;border-top:3px solid var(--acento)}" +
    ".logo .corona{width:1.05em;margin-bottom:.18em}" +
    ".escena::after{background:repeating-linear-gradient(45deg,rgba(255,255,255,.07) 0 2px,transparent 2px 10px),repeating-linear-gradient(-45deg,rgba(0,0,0,.2) 0 2px,transparent 2px 10px),linear-gradient(rgba(255,255,255,.14),rgba(0,0,0,.28));background-color:#3A3D41;border-top:3px solid #6B7077}" +
    ".papel{border-radius:3px;padding-top:30px;border-left:9px solid #F2B705;background-image:repeating-linear-gradient(0deg,transparent 0 31px,rgba(23,20,14,.07) 31px 32px)}" +
    ".papel::before{content:'';position:absolute;top:-13px;left:50%;width:104px;height:27px;transform:translateX(-50%) rotate(2deg);background:rgba(242,183,5,.92);box-shadow:0 2px 4px rgba(0,0,0,.45)}" +
    ".papel::after{content:'';position:absolute;left:0;right:0;bottom:0;height:8px;background:repeating-linear-gradient(-45deg,#F2B705 0 12px,#17140E 12px 24px)}" +
    ".ticket,.planilla,.hoja{border-top:6px solid #F2B705}",
  // Sello de taller: un engranaje (la rueda del garaje) en vez del poste de barbero.
  selloIcono: (t) => '<g fill="none" stroke="' + t + '" stroke-width="3.2" stroke-linejoin="round"><circle cx="50" cy="50" r="17"/><circle cx="50" cy="50" r="6.5"/></g><g fill="' + t + '">' + [0, 45, 90, 135].map((a) => '<rect x="44.5" y="22" width="11" height="12.5" rx="1.6" transform="rotate(' + a + ' 50 50)"/><rect x="44.5" y="65.5" width="11" height="12.5" rx="1.6" transform="rotate(' + a + ' 50 50)"/>').join("") + "</g>",
  semilla: [
    ["Tomás Agüero", [150, 122, 96, 70, 41, 30, 20, 3]],
    ["Lautaro Paz", [228, 200, 171, 140, 112, 85, 60, 33, 9]],
    ["Franco Medina", [95, 66, 38, 12]],
    ["Joaquín Sosa", [120, 88, 61]],
    ["Lucas Ledesma", [210, 180, 150, 121, 93, 70]],
    ["Ignacio Ruiz", [30, 5]],
    ["Mateo Giménez", [260, 230, 200, 171, 140, 110, 82, 55, 30, 6]],
    ["Santiago Vera", [14]],
  ],
};
