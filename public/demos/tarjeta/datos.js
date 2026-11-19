/* Tarjeta de fidelización: capa de datos compartida por todas las marcas.
   La marca (nombre, descuentos, colores) viene de window.MARCA, definida en marca.js.
   En la demo los datos viven en el navegador (localStorage). Para la versión real se
   reemplazan leer() y guardar() por llamadas a un servidor; el resto no cambia. */
(function () {
  "use strict";

  const CONFIG = Object.assign({
    id: "demo", nombre: "Tu barbería", logo: ["Tu", "Barbería"], logoEstilo: "script",
    sellos: 10, hitos: [{ en: 5, pct: 10 }, { en: 7, pct: 20 }, { en: 10, pct: 70 }],
    whatsapp: "", pinDemo: "1234", diasInactivo: 45, horasEntreSellosNfc: 12,
    membresia: { nombre: "Club", precio: 30000, detalle: "Cortes ilimitados de lunes a jueves" },
    local: { lat: 0, lng: 0, radio: 150 }, tema: {},
  }, window.MARCA || {});

  const CLAVE = CONFIG.id + ".tarjetas.v4";
  const DIA = 864e5;
  const hace = (d) => new Date(Date.now() - d * DIA).toISOString();
  const hitoEn = (n) => CONFIG.hitos.find((h) => h.en === n) || null;
  let memoria = null;

  function semilla() {
    const base = [
      ["Tomás Agüero", [150, 122, 96, 70, 41, 30, 20, 3]],
      ["Lautaro Paz", [228, 200, 171, 140, 112, 85, 60, 33, 9]],
      ["Franco Medina", [95, 66, 38, 12]],
      ["Joaquín Sosa", [120, 88, 61]],
      ["Bruno Ledesma", [210, 180, 150, 121, 93, 70]],
      ["Ignacio Ruiz", [30, 5]],
      ["Mateo Giménez", [260, 230, 200, 171, 140, 110, 82, 55, 30, 6]],
      ["Santiago Vera", [14]],
    ];
    const clientes = base.map(([nombre, dias], i) => ({
      codigo: String(101 + i).padStart(4, "0"),
      nombre, tel: "", alta: hace(dias[0]), ciclo: 1, desde: 0,
      visitas: dias.map((d, k) => ({ fecha: hace(d), descuento: hitoEn(k + 1) ? hitoEn(k + 1).pct : 0, origen: k % 3 ? "nfc" : "panel" })),
    }));
    // Socios de la cuota mensual: tres al día y uno con la cuota vencida.
    [[0, 70, 18], [2, 41, 11], [6, 130, 24], [3, 100, -12]].forEach(([i, desde, hasta]) => {
      clientes[i].socio = { desde: hace(desde), pagoHasta: hace(-hasta) };
    });
    return { clientes, sig: 101 + base.length };
  }

  function leer() {
    if (memoria) return memoria;
    try {
      const crudo = localStorage.getItem(CLAVE);
      if (crudo) return (memoria = JSON.parse(crudo));
    } catch (e) { /* sin almacenamiento: seguimos en memoria */ }
    memoria = semilla();
    guardar(memoria);
    return memoria;
  }

  function guardar(estado) {
    memoria = estado;
    try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { /* idem */ }
    window.dispatchEvent(new Event("tarjeta:cambio"));
  }

  // Otra pestaña cambió los datos: descartamos la copia en memoria.
  window.addEventListener("storage", (e) => {
    if (e.key === CLAVE || e.key === null) {
      memoria = null;
      window.dispatchEvent(new Event("tarjeta:cambio"));
    }
  });

  const guardado = {
    leer: (k) => { try { return localStorage.getItem(CONFIG.id + "." + k) || ""; } catch (e) { return ""; } },
    poner: (k, v) => { try { localStorage.setItem(CONFIG.id + "." + k, v); } catch (e) { /* idem */ } },
  };

  const norm = (t) => String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const clientes = () => leer().clientes;
  const porCodigo = (codigo) => clientes().find((c) => c.codigo === String(codigo).padStart(4, "0")) || null;
  const sellosDe = (c) => c.visitas.slice(c.desde);
  const ultima = (c) => (c.visitas.length ? c.visitas[c.visitas.length - 1].fecha : c.alta);
  const diasSin = (c) => Math.floor((Date.now() - new Date(ultima(c)).getTime()) / DIA);

  // Con la tarjeta completa, el próximo corte abre una tarjeta nueva.
  const sellosVigentes = (c) => { const n = sellosDe(c).length; return n >= CONFIG.sellos ? 0 : n; };
  // Descuento que le toca al corte que viene (0 si no hay).
  const descuentoAhora = (c) => { const h = hitoEn(sellosVigentes(c) + 1); return h ? h.pct : 0; };
  // Próximo descuento y cuántos cortes faltan para llegar a él.
  function proximo(c) {
    const n = sellosVigentes(c);
    const h = CONFIG.hitos.find((x) => x.en > n);
    return { pct: h.pct, en: h.en, faltan: h.en - n };
  }

  function buscar(texto) {
    const q = norm(texto);
    if (!q) return clientes();
    return clientes().filter((c) => norm(c.nombre).includes(q) || c.codigo.includes(q) || (c.tel && c.tel.includes(q)));
  }

  function cambiar(codigo, fn) {
    const estado = leer();
    const c = estado.clientes.find((x) => x.codigo === codigo);
    if (!c) return { ok: false, motivo: "no-existe" };
    const r = fn(c) || {};
    if (r.ok !== false) guardar(estado);
    return Object.assign({ ok: true, cliente: c }, r);
  }

  function crear({ nombre, tel, conSello }) {
    const estado = leer();
    const c = {
      codigo: String(estado.sig).padStart(4, "0"),
      nombre: String(nombre).trim().slice(0, 60),
      tel: String(tel || "").replace(/\D/g, "").slice(0, 15),
      alta: new Date().toISOString(), ciclo: 1, desde: 0, visitas: [],
    };
    if (conSello) c.visitas.push({ fecha: c.alta, descuento: 0, origen: "panel" });
    estado.sig += 1;
    estado.clientes.push(c);
    guardar(estado);
    return c;
  }

  // origen: "panel" (lo suma el dueño) o "nfc" (el cliente acercó su celular a la tarjeta NFC).
  const sumar = (codigo, origen) => cambiar(codigo, (c) => {
    if (origen === "nfc" && c.visitas.length) {
      // Un solo sello por visita: evita que alguien sume varios acercando el celular de nuevo.
      const horas = (Date.now() - new Date(ultima(c)).getTime()) / 36e5;
      if (horas < CONFIG.horasEntreSellosNfc) return { ok: false, motivo: "hoy" };
    }
    if (sellosDe(c).length >= CONFIG.sellos) { c.desde = c.visitas.length; c.ciclo += 1; }
    const numero = sellosDe(c).length + 1;
    const h = hitoEn(numero);
    c.visitas.push({ fecha: new Date().toISOString(), descuento: h ? h.pct : 0, origen: origen || "panel" });
    return { numero, descuento: h ? h.pct : 0 };
  });

  const deshacer = (codigo) => cambiar(codigo, (c) => {
    if (!c.visitas.length) return { ok: false, motivo: "vacia" };
    c.visitas.pop();
    // Si el sello quitado había abierto una tarjeta nueva, volvemos a la anterior.
    if (c.ciclo > 1 && c.visitas.length === c.desde) { c.desde -= CONFIG.sellos; c.ciclo -= 1; }
  });

  function resumen() {
    const hoy = new Date().toDateString();
    const lista = clientes();
    return {
      hoy: lista.reduce((n, c) => n + c.visitas.filter((v) => new Date(v.fecha).toDateString() === hoy).length, 0),
      activos: lista.filter((c) => c.visitas.length && diasSin(c) <= CONFIG.diasInactivo).length,
      conDescuento: lista.filter((c) => descuentoAhora(c) > 0).length,
      socios: lista.filter(alDia).length,
      vencidas: lista.filter((c) => c.socio && !alDia(c)).length,
      ingreso: lista.filter(alDia).length * (CONFIG.membresia ? CONFIG.membresia.precio : 0),
    };
  }

  // Los últimos sellos de todo el local, del más nuevo al más viejo.
  function movimientos(cuantos) {
    const todos = [];
    clientes().forEach((c) => c.visitas.forEach((v, i) => todos.push({
      nombre: c.nombre, codigo: c.codigo, fecha: v.fecha, descuento: v.descuento, origen: v.origen || "panel",
      numero: ((i % CONFIG.sellos) + 1),
    })));
    return todos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, cuantos || 6);
  }

  /* Cuota mensual: quién es socio y hasta cuándo tiene paga la cuota. */
  const alDia = (c) => !!c.socio && new Date(c.socio.pagoHasta).getTime() > Date.now();
  const unMesDesde = (t) => new Date(t + 30 * DIA).toISOString();
  const altaSocio = (codigo) => cambiar(codigo, (c) => {
    const ahora = new Date().toISOString();
    c.socio = { desde: ahora, pagoHasta: unMesDesde(Date.now()) };
  });
  const bajaSocio = (codigo) => cambiar(codigo, (c) => { delete c.socio; });
  const cobrarCuota = (codigo) => cambiar(codigo, (c) => {
    if (!c.socio) return { ok: false, motivo: "no-socio" };
    c.socio.pagoHasta = unMesDesde(Math.max(Date.now(), new Date(c.socio.pagoHasta).getTime()));
  });
  const pesos = (n) => "$" + Math.round(n).toLocaleString("es-AR");

  function reiniciar() {
    memoria = null;
    try { localStorage.removeItem(CLAVE); } catch (e) { /* idem */ }
    leer();
  }

  // Distancia en metros entre un punto y el local.
  function distanciaAlLocal(lat, lng) {
    const rad = (g) => (g * Math.PI) / 180, R = 6371000, L = CONFIG.local;
    const a = Math.sin(rad(lat - L.lat) / 2) ** 2 + Math.cos(rad(L.lat)) * Math.cos(rad(lat)) * Math.sin(rad(lng - L.lng) / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  // Texto del aviso que recibe el cliente cuando pasa cerca.
  function textoCerca(c) {
    const d = descuentoAhora(c), p = proximo(c);
    return d ? "Tu próximo corte tiene " + d + "% de descuento. ¿Pasás hoy?"
             : "Te faltan " + p.faltan + " cortes para tu " + p.pct + "% de descuento.";
  }

  const dos = (n) => String(n).padStart(2, "0");
  const haceCuanto = (dias) => (dias <= 0 ? "hoy" : dias === 1 ? "ayer" : "hace " + dias + " días");
  function cuando(iso) {
    const d = new Date(iso);
    return d.toDateString() === new Date().toDateString()
      ? "hoy " + dos(d.getHours()) + ":" + dos(d.getMinutes())
      : dos(d.getDate()) + "/" + dos(d.getMonth() + 1);
  }
  const esc = (t) => String(t).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

  // Viste la página con la marca: colores, logo y nombre.
  function vestir() {
    const raiz = document.documentElement;
    Object.keys(CONFIG.tema).forEach((k) => raiz.style.setProperty(k, CONFIG.tema[k]));
    raiz.dataset.letra = CONFIG.logoEstilo;
    if (CONFIG.css) { const st = document.createElement("style"); st.textContent = CONFIG.css; document.head.appendChild(st); }
    document.querySelectorAll("[data-logo]").forEach((el) => { el.innerHTML = esc(CONFIG.logo[0]) + "<span>" + esc(CONFIG.logo[1]) + "</span>"; });
    document.querySelectorAll("[data-marca]").forEach((el) => { el.textContent = CONFIG.nombre; });
    document.title = document.title.replace("{marca}", CONFIG.nombre);
    if (!document.getElementById("tarjeta-defs")) {
      document.body.insertAdjacentHTML("afterbegin",
        '<svg id="tarjeta-defs" width="0" height="0" aria-hidden="true" style="position:absolute"><defs>' +
        '<clipPath id="t-palo"><rect x="41" y="28" width="18" height="44" rx="2"/></clipPath>' +
        '<filter id="t-tinta" x="-10%" y="-10%" width="120%" height="120%">' +
        '<feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" result="ruido"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="ruido" scale="2.2" result="borde"/>' +
        '<feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="9" result="grano"/>' +
        '<feColorMatrix in="grano" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 2.1" result="mascara"/>' +
        '<feComposite in="borde" in2="mascara" operator="in"/></filter></defs></svg>');
    }
  }

  // Sello de goma con el poste de barbero. Los de descuento van llenos, en el color de acento.
  function sello(indice, codigo, esHito, nuevo) {
    const giro = ((Number(codigo) * 31 + indice * 17) % 23) - 11;
    const trazo = esHito ? "var(--sobre-sello)" : "currentColor";
    return '<svg class="sello' + (esHito ? " hito" : "") + (nuevo ? " nuevo" : "") + '" viewBox="0 0 100 100" style="--giro:' + giro + 'deg" aria-hidden="true">' +
      '<g filter="url(#t-tinta)">' +
      (esHito ? '<circle cx="50" cy="50" r="47" fill="currentColor"/>'
              : '<circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="3.4"/>') +
      '<g fill="none" stroke="' + trazo + '" stroke-linecap="round">' +
      '<rect x="41" y="28" width="18" height="44" rx="2" stroke-width="2.6"/>' +
      '<g clip-path="url(#t-palo)" stroke-width="5"><path d="M34 40 66 28M34 53 66 41M34 66 66 54M34 79 66 67"/></g></g>' +
      '<g fill="' + trazo + '"><rect x="37" y="21" width="26" height="6" rx="2"/><rect x="37" y="73" width="26" height="6" rx="2"/><circle cx="50" cy="17" r="3.6"/></g>' +
      "</g></svg>";
  }

  window.TARJETA = {
    CONFIG, guardado, clientes, porCodigo, buscar, sellosDe, sellosVigentes, descuentoAhora, proximo, hitoEn, ultima, diasSin,
    crear, sumar, deshacer, alDia, altaSocio, bajaSocio, cobrarCuota, pesos, resumen, movimientos, reiniciar, distanciaAlLocal, textoCerca, haceCuanto, cuando, esc, vestir, sello,
  };
})();
