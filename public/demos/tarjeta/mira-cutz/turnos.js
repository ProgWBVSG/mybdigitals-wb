/* Citas de Miras.cutz: pedir, confirmar, cancelar, cambiar y lista de espera.
   Usa la misma marca (window.MARCA.turnos) y la tarjeta de sellos (window.TARJETA): cuando el
   barbero marca que el cliente llegó, se suma el sello solo. En la demo los datos viven en el
   navegador; en la versión real leer() y guardar() pasan a un servidor. */
(function () {
  "use strict";
  const T = window.TARJETA, K = T.CONFIG.turnos, CLAVE = T.CONFIG.id + ".citas.v1", MIN = 6e4, DIA = 864e5;
  const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const dos = (n) => String(n).padStart(2, "0");
  const rnd = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const servicio = (id) => K.servicios.find((s) => s.id === id) || K.servicios[0];
  const barbero = (id) => K.barberos.find((b) => b.id === id) || K.barberos[0];
  const ACTIVOS = ["reservado", "confirmado", "atendido", "ausente", "bloqueado"];
  const visibles = () => { const l = K.servicios.filter((x) => !x.oculto); return l.length ? l : K.servicios; };
  let memoria = null;

  /* Fechas */
  const inicioDia = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  const clave = (d) => { const x = new Date(d); return x.getFullYear() + "-" + dos(x.getMonth() + 1) + "-" + dos(x.getDate()); };
  const aFecha = (k) => { const [a, m, d] = k.split("-").map(Number); return new Date(a, m - 1, d); };
  const abre = (d) => K.dias.includes(new Date(d).getDay());
  function abiertos(n, desde) {
    const out = []; let d = inicioDia(desde || Date.now());
    // Se avanza por día de calendario: sumar 24 horas falla cuando cambia la hora.
    for (let i = 0; out.length < n && i < 40; i++, d.setDate(d.getDate() + 1)) if (abre(d)) out.push(clave(d));
    return out;
  }
  const hora = (iso) => { const d = new Date(iso); return dos(d.getHours()) + ":" + dos(d.getMinutes()); };
  const corto = (k) => { const d = aFecha(k); return DIAS[d.getDay()].slice(0, 3) + " " + d.getDate(); };
  function cuandoDia(k) {
    const hoy = clave(Date.now()), man = (() => { const x = inicioDia(Date.now()); x.setDate(x.getDate() + 1); return clave(x); })(), d = aFecha(k);
    return k === hoy ? "hoy" : k === man ? "mañana" : DIAS[d.getDay()] + " " + d.getDate() + "/" + (d.getMonth() + 1);
  }
  const elDia = (k) => { const c = cuandoDia(k); return c === "hoy" || c === "mañana" ? c : "el " + c; };
  const fechaTurno = (t) => cuandoDia(clave(t.inicio)) + " · " + hora(t.inicio);
  const conMayus = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /* Datos de ejemplo: dos meses de historia, un día lleno, un hueco que se liberó y alguien que lo espera */
  const OTROS = ["Adrián Soto", "Rubén Cano", "Mario Ibáñez", "Asier López", "Nacho Rubio", "Jon Aguirre", "Leo Serrano", "Carlos Mena", "Pau Vidal", "Óscar Reyes", "Andoni Ruiz", "Iván Luna", "Samu Blanco", "Víctor Pardo", "Gabi Torres", "Aitor Lasa", "Raúl Peña", "Izan Cortés", "Manu Galán", "Koldo Arana", "Joel Marín", "Fran Ortega", "Enzo Castro", "David Lara", "Mikel Goñi", "Toni Roca", "Edu Campos", "Alberto Sanz", "Biel Puig", "Lucas Nieto", "Ander Sola", "Guille Ramos", "Pedro Cuesta", "Hugo Pastor"];
  function semilla() {
    const turnos = [], dias = abiertos(7), ahora = Date.now(), B = K.barberos.map((b) => b.id), b0 = B[0], b1 = B[1] || B[0];
    const S = visibles().map((x) => x.id), corte = S[0], completo = S[1] || S[0], barba = S[2] || S[0];
    let id = 1, n = 0;
    const poner = (k, b, h, m, srv, quien, extra) => {
      const d = aFecha(k); d.setHours(h, m, 0, 0);
      const t = Object.assign({ id: "t" + id++, codigo: quien.codigo || null, nombre: quien.nombre, barbero: b, servicio: srv, inicio: d.toISOString(), estado: "reservado", confirmado: false, historial: [] }, extra || {});
      if (!K.dias.includes(d.getDay()) || fin(t) > new Date(d).setHours(K.hasta, 0, 0, 0) || !libre(turnos, t)) return null;
      turnos.push(t); return t;
    };
    const cli = (cod) => { const c = T.porCodigo(cod); return { codigo: cod, nombre: c ? c.nombre : "Cliente" }; };
    // El cliente de la demo tiene cita el próximo día abierto que no sea hoy.
    poner(dias[0] === clave(ahora) ? dias[1] : dias[0], b1, 18, 0, completo, cli("0101"));
    // Sergio canceló: queda un hueco que todavía se puede vender, hoy si alcanza el tiempo.
    let kH = dias[0], hH = 17; const enH = (k, h) => { const d = aFecha(k); d.setHours(h, 0, 0, 0); return d.getTime(); };
    while (hH < K.hasta - 1 && enH(kH, hH) < ahora + 90 * MIN) hH++;
    if (enH(kH, hH) < ahora + 90 * MIN) { kH = dias[1]; hH = 17; }
    const tapa = poner(kH, b0, hH, 0, corte, { nombre: "—" });
    poner(dias[0], b1, 16, 0, corte, cli("0103"), { confirmado: true, historial: [{ que: "reprogramo", cuando: new Date(ahora - DIA).toISOString(), de: "11:00" }] });
    poner(dias[0], b1, 12, 30, completo, cli("0108"), { confirmado: true });
    poner(dias[1], b0, 19, 0, barba, cli("0102"), { confirmado: true });
    // El sábado (o el último día abierto de la lista) está lleno.
    const lleno = dias.find((k) => aFecha(k).getDay() === 6) || dias[dias.length - 1];
    const llenar = (k, p, semillaN, extra) => B.forEach((b, j) => {
      for (let h = K.desde * 60; h < K.hasta * 60; h += K.paso) {
        const r = rnd(semillaN * 97 + j * 31 + h); if (r > p) continue;
        const q = rnd(semillaN * 13 + j * 7 + h * 3);
        poner(k, b, Math.floor(h / 60), h % 60, q < .3 ? completo : q < .45 ? barba : corte, { nombre: OTROS[n++ % OTROS.length] }, extra(rnd(semillaN + j * 5 + h * 11)));
      }
    });
    dias.forEach((k, i) => llenar(k, k === lleno ? 1 : k === kH ? .93 : .42 + (6 - i) * .05, i + 3, (x) => ({ confirmado: k === dias[0] ? x > .2 : x > .6 })));
    if (tapa) {
      turnos.splice(turnos.indexOf(tapa), 1);
      turnos.push(Object.assign(tapa, cli("0104"), { estado: "cancelado", historial: [{ que: "cancelo", cuando: new Date(ahora - 2 * 36e5).toISOString(), quien: "cliente", horas: Math.max(3, Math.round((new Date(tapa.inicio) - ahora) / 36e5)) }] }));
    }
    // Lo que ya pasó hoy quedó atendido; uno no vino y lo último falta marcarlo.
    let unoAusente = false;
    turnos.forEach((t) => {
      if (t.estado === "cancelado" || fin(t) > ahora - 20 * MIN) return;
      if (!unoAusente && !t.codigo && t.barbero === b1) { t.estado = "ausente"; unoAusente = true; } else { t.estado = "atendido"; t.cobrado = servicio(t.servicio).precio; }
    });
    // Historia de ocho semanas para la sección Números.
    for (let i = 56; i >= 1; i--) {
      const d = inicioDia(ahora); d.setDate(d.getDate() - i); if (!abre(d)) continue;
      llenar(clave(d), d.getDay() === 6 ? .92 : .42 + (56 - i) * .004, 200 + i, (x) => x < .05 ? { estado: "ausente" } : x < .11 ? { estado: "cancelado" } : { estado: "atendido" });
    }
    turnos.forEach((t) => { if (t.estado === "atendido" && t.cobrado == null) t.cobrado = servicio(t.servicio).precio; });
    return { dia: clave(ahora), turnos, espera: [Object.assign(cli("0106"), { dia: kH, desde: new Date(ahora - 5 * 36e5).toISOString() })], sig: id };
  }

  function leer() {
    if (memoria) return memoria;
    try { const c = localStorage.getItem(CLAVE); // La demo empieza de nuevo cada día para que la agenda siempre esté al día.
      if (c) { const g = JSON.parse(c); if (g.dia === clave(Date.now())) return (memoria = g); } } catch (e) { /* sin almacenamiento */ }
    memoria = semilla(); guardar(memoria); return memoria;
  }
  function guardar(e) {
    memoria = e;
    try { localStorage.setItem(CLAVE, JSON.stringify(e)); } catch (x) { /* idem */ }
    window.dispatchEvent(new Event("tarjeta:cambio"));
  }
  window.addEventListener("storage", (ev) => { if (ev.key === CLAVE || ev.key === null) { memoria = null; window.dispatchEvent(new Event("tarjeta:cambio")); } });
  function reiniciar() { memoria = null; try { localStorage.removeItem(CLAVE); } catch (e) { /* idem */ } leer(); }

  /* Disponibilidad */
  const fin = (t) => new Date(t.inicio).getTime() + (t.min || servicio(t.servicio).min) * MIN;
  function libre(lista, t, ignorar) {
    const a = new Date(t.inicio).getTime(), b = fin(t);
    return !lista.some((o) => o.id !== ignorar && o.barbero === t.barbero && ACTIVOS.includes(o.estado) && a < fin(o) && new Date(o.inicio).getTime() < b);
  }
  // Horarios libres de un día. barb = id o "cualquiera".
  function horarios(k, barb, srv, ignorar) {
    const lista = leer().turnos, out = [], ahora = Date.now() + 30 * MIN, dur = servicio(srv).min;
    if (!abre(aFecha(k))) return out;
    for (let m = K.desde * 60; m + dur <= K.hasta * 60; m += K.paso) {
      const d = aFecha(k); d.setHours(Math.floor(m / 60), m % 60, 0, 0);
      if (d.getTime() < ahora) continue;
      const quienes = (barb === "cualquiera" ? K.barberos.map((b) => b.id) : [barb]).filter((b) => libre(lista, { inicio: d.toISOString(), barbero: b, servicio: srv }, ignorar));
      if (quienes.length) out.push({ hora: hora(d), inicio: d.toISOString(), barbero: quienes[0] });
    }
    return out;
  }

  /* Acciones */
  const buscar = (id) => leer().turnos.find((t) => t.id === id) || null;
  const vigente = (t) => t.estado === "reservado" || t.estado === "confirmado";
  function proximoDe(codigo) {
    return leer().turnos.filter((t) => t.codigo === codigo && vigente(t) && fin(t) > Date.now()).sort((a, b) => new Date(a.inicio) - new Date(b.inicio))[0] || null;
  }
  const ultimoCanceladoDe = (codigo) => leer().turnos.filter((t) => t.codigo === codigo && t.estado === "cancelado").sort((a, b) => new Date(b.inicio) - new Date(a.inicio))[0] || null;
  function reservar({ codigo, nombre, barbero: b, servicio: srv, inicio }) {
    const e = leer(), t = { id: "t" + e.sig++, codigo: codigo || null, nombre, barbero: b, servicio: srv, inicio, estado: "reservado", confirmado: false, creado: new Date().toISOString(), historial: [] };
    if (!libre(e.turnos, t)) return { ok: false, motivo: "ocupado" };
    e.turnos.push(t);
    e.espera = e.espera.filter((x) => !(x.codigo && x.codigo === codigo && x.dia === clave(inicio)));
    guardar(e); return { ok: true, turno: t };
  }
  const horasAntes = (t) => (new Date(t.inicio).getTime() - Date.now()) / 36e5;
  // Cancela y deja el horario libre. Devuelve quiénes esperaban lugar ese día.
  function cancelar(id, quien) {
    const e = leer(), t = e.turnos.find((x) => x.id === id);
    if (!t || !vigente(t)) return { ok: false };
    const h = Math.max(0, horasAntes(t));
    t.estado = "cancelado"; t.historial.push({ que: "cancelo", cuando: new Date().toISOString(), quien: quien || "cliente", horas: Math.round(h * 10) / 10, tarde: h < K.cancelarHasta });
    guardar(e);
    return { ok: true, turno: t, tarde: h < K.cancelarHasta, espera: e.espera.filter((x) => x.dia === clave(t.inicio)) };
  }
  function reprogramar(id, inicio, barb) {
    const e = leer(), t = e.turnos.find((x) => x.id === id);
    if (!t || !vigente(t)) return { ok: false };
    const nuevo = Object.assign({}, t, { inicio, barbero: barb || t.barbero });
    if (!libre(e.turnos, nuevo, t.id)) return { ok: false, motivo: "ocupado" };
    const de = fechaTurno(t), deBarb = t.barbero, lugar = { inicio: t.inicio, barbero: t.barbero, dia: clave(t.inicio) };
    t.historial.push({ que: "reprogramo", cuando: new Date().toISOString(), de, deBarb, horas: Math.round(Math.max(0, horasAntes(t)) * 10) / 10 });
    t.inicio = inicio; t.barbero = nuevo.barbero; t.confirmado = false; t.estado = "reservado";
    guardar(e);
    return { ok: true, turno: t, liberado: lugar, espera: e.espera.filter((x) => x.dia === lugar.dia) };
  }
  function confirmar(id) { const e = leer(), t = e.turnos.find((x) => x.id === id); if (!t) return { ok: false }; t.confirmado = true; guardar(e); return { ok: true, turno: t }; }
  // El cliente llegó: se cierra el turno y se le suma el sello en la tarjeta.
  function llego(id) {
    const e = leer(), t = e.turnos.find((x) => x.id === id); if (!t) return { ok: false };
    t.cobrado = importe(t); t.estado = "atendido";
    const s = t.codigo ? T.sumar(t.codigo, "panel") : null;
    t.conSello = !!(s && s.ok); guardar(e);
    return { ok: true, turno: t, sello: s && s.ok ? s : null };
  }
  function noVino(id) { const e = leer(), t = e.turnos.find((x) => x.id === id); if (!t) return { ok: false }; t.estado = "ausente"; guardar(e); return { ok: true, turno: t }; }

  // Vuelve atrás un "llegó" o un "no vino" marcado por error.
  function deshacer(id) {
    const e = leer(), t = e.turnos.find((x) => x.id === id); if (!t || (t.estado !== "atendido" && t.estado !== "ausente")) return { ok: false };
    if (t.conSello && t.codigo) T.deshacer(t.codigo);
    t.estado = "reservado"; t.confirmado = true; delete t.cobrado; delete t.conSello; guardar(e); return { ok: true, turno: t };
  }
  // Descanso o recado: ese rato no se puede reservar.
  function bloquear(barb, inicio) {
    const e = leer(), t = { id: "t" + e.sig++, codigo: null, nombre: "Bloqueado", barbero: barb, servicio: null, min: K.paso, inicio, estado: "bloqueado", confirmado: true, historial: [] };
    if (!libre(e.turnos, t)) return { ok: false };
    e.turnos.push(t); guardar(e); return { ok: true, turno: t };
  }
  function desbloquear(id) { const e = leer(); e.turnos = e.turnos.filter((x) => !(x.id === id && x.estado === "bloqueado")); guardar(e); }
  // Lo que se cobra: el corte del socio al día va incluido en la cuota y los demás llevan el descuento de la tarjeta.
  function importe(t) {
    if (t.cobrado != null) return t.cobrado;
    const s = servicio(t.servicio), c = t.codigo ? T.porCodigo(t.codigo) : null, dia = new Date(t.inicio).getDay();
    if (!c) return s.precio;
    if (T.alDia(c) && s.id === K.servicios[0].id && dia >= 1 && dia <= 4) return 0;
    return Math.round(s.precio * (100 - T.descuentoAhora(c))) / 100;
  }

  /* Lista de espera */
  function anotar(codigo, nombre, dia) {
    const e = leer(); if (e.espera.some((x) => x.codigo === codigo && x.dia === dia)) return { ok: true, ya: true };
    e.espera.push({ codigo, nombre, dia, desde: new Date().toISOString() }); guardar(e); return { ok: true };
  }
  function quitarEspera(codigo, dia) { const e = leer(); e.espera = e.espera.filter((x) => !(x.codigo === codigo && x.dia === dia)); guardar(e); }
  const espera = () => leer().espera.slice().sort((a, b) => a.dia.localeCompare(b.dia));
  const enEspera = (codigo) => leer().espera.filter((x) => x.codigo === codigo);

  /* Lecturas para el panel */
  const delDia = (k) => leer().turnos.filter((t) => clave(t.inicio) === k).sort((a, b) => new Date(a.inicio) - new Date(b.inicio));
  function resumenDia(k) {
    const l = delDia(k);
    return {
      turnos: l.filter((t) => t.estado !== "cancelado" && t.estado !== "bloqueado").length,
      cancelados: l.filter((t) => t.estado === "cancelado").length,
      ausentes: l.filter((t) => t.estado === "ausente").length,
      libres: K.barberos.reduce((n, b) => n + horarios(k, b.id, visibles()[0].id).length, 0),
    };
  }
  const entre = (a, b) => leer().turnos.filter((t) => { const x = new Date(t.inicio).getTime(); return x >= a && x < b && t.estado !== "bloqueado"; });
  const capacidad = () => K.barberos.length * (K.hasta - K.desde) * 60; // minutos por día
  const cancelacionesTarde = (codigo) => leer().turnos.filter((t) => t.codigo === codigo && t.historial.some((h) => h.que === "cancelo" && h.tarde)).length;
  const ausencias = (codigo) => leer().turnos.filter((t) => t.codigo === codigo && t.estado === "ausente").length;

  // Enlace para agregar el turno al calendario de Google.
  function calendario(t) {
    const s = servicio(t.servicio), f = (ms) => { const d = new Date(ms); return d.getFullYear() + dos(d.getMonth() + 1) + dos(d.getDate()) + "T" + dos(d.getHours()) + dos(d.getMinutes()) + "00"; };
    return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(s.nombre + " en " + T.CONFIG.nombre) +
      "&dates=" + f(new Date(t.inicio).getTime()) + "/" + f(fin(t)) + "&details=" + encodeURIComponent("Con " + barbero(t.barbero).nombre + ". Para cambiarlo o cancelarlo, abre tu tarjeta.") + "&ctz=" + encodeURIComponent(K.zona);
  }

  /* Selector de turno (servicio, barbero, día y horario), el mismo para el cliente y para el panel */
  function selector(caja, o) {
    const est = { srv: o.servicio || visibles()[0].id, barb: o.barbero || "cualquiera", dia: o.dia || null, slot: null };
    let pedido = o.inicio || null;
    const dias = abiertos(7);
    const chip = (attr, val, on, txt, sub, apagado) => '<button type="button" class="chip' + (on ? " on" : "") + '" ' + attr + '="' + val + '"' + (apagado ? " disabled" : "") + ">" + txt + (sub ? "<small>" + sub + "</small>" : "") + "</button>";
    function pintar() {
      const conLugar = dias.filter((k) => horarios(k, est.barb, est.srv, o.ignorar).length);
      if (!est.dia || !dias.includes(est.dia)) est.dia = conLugar[0] || dias[0];
      const libres = horarios(est.dia, est.barb, est.srv, o.ignorar);
      if (pedido) { est.slot = libres.find((x) => x.inicio === pedido) || null; pedido = null; }
      if (est.slot && !libres.some((s) => s.inicio === est.slot.inicio)) est.slot = null;
      caja.innerHTML =
        (o.sinServicio ? "" : '<p class="paso">Servicio</p><div class="chips">' + visibles().map((s) => chip("data-srv", s.id, s.id === est.srv, s.nombre, T.pesos(s.precio) + " · " + s.min + " min")).join("") + "</div>") +
        '<p class="paso">Barbero</p><div class="chips">' + [{ id: "cualquiera", nombre: "El primero libre" }].concat(K.barberos).map((b) => chip("data-barb", b.id, b.id === est.barb, b.nombre)).join("") + "</div>" +
        '<p class="paso">Día</p><div class="dias">' + dias.map((k) => { const n = horarios(k, est.barb, est.srv, o.ignorar).length; return chip("data-dia", k, k === est.dia, corto(k), n ? n + (n === 1 ? " libre" : " libres") : k === clave(Date.now()) ? "sin lugar" : "lleno"); }).join("") + "</div>" +
        '<p class="paso">Horario</p>' +
        (libres.length ? '<div class="horas">' + libres.map((s) => chip("data-slot", s.inicio, est.slot && est.slot.inicio === s.inicio, s.hora)).join("") + "</div>"
          : '<div class="sin-lugar"><p>No quedan citas para ' + elDia(est.dia) + ".</p>" + (o.espera ? '<button type="button" class="btn linea chico" data-espera="' + est.dia + '">Avisarme si se libera una</button>' : "") + "</div>");
      o.cambio && o.cambio(resultado());
    }
    function resultado() {
      if (!est.slot) return null;
      return { servicio: est.srv, barbero: est.slot.barbero, inicio: est.slot.inicio, texto: conMayus(cuandoDia(est.dia)) + " · " + est.slot.hora + " · " + servicio(est.srv).nombre + " con " + barbero(est.slot.barbero).nombre };
    }
    caja.onclick = (ev) => {
      const b = ev.target.closest("button"); if (!b || b.disabled) return;
      if (b.dataset.srv) { est.srv = b.dataset.srv; est.slot = null; }
      else if (b.dataset.barb) { est.barb = b.dataset.barb; est.slot = null; }
      else if (b.dataset.dia) { est.dia = b.dataset.dia; est.slot = null; }
      else if (b.dataset.slot) { const s = horarios(est.dia, est.barb, est.srv, o.ignorar).find((x) => x.inicio === b.dataset.slot); est.slot = s || null; }
      else if (b.dataset.espera) { o.espera && o.espera(b.dataset.espera); return; }
      else return;
      pintar();
    };
    pintar();
    return { resultado, repintar: pintar };
  }

  window.TURNOS = {
    K, leer, reiniciar, abiertos, horarios, buscar, proximoDe, ultimoCanceladoDe, reservar, cancelar, reprogramar, confirmar, llego, noVino,
    anotar, quitarEspera, espera, enEspera, delDia, resumenDia, cancelacionesTarde, ausencias, calendario, selector, deshacer, bloquear, desbloquear, importe, entre, capacidad, visibles, elDia,
    servicio, barbero, hora, clave, corto, cuandoDia, fechaTurno, conMayus, horasAntes, vigente, fin,
  };
})();
