/* Panel del dueño: Hoy, Agenda, Clientes, Números y Ajustes. */
(function () {
  "use strict";
  const T = window.TARJETA, K = T.CONFIG, TU = window.TURNOS, KT = TU.K, e = T.esc;
  const $ = (s) => document.querySelector(s), url = new URLSearchParams(location.search), MIN = 6e4, DIA = 864e5;
  const eur = (n) => (Number.isInteger(n) ? T.pesos(n) : n.toFixed(2).replace(".", ",") + " €");
  const pl = (n, uno, mas) => n + " " + (n === 1 ? uno : mas);
  const pila = (n) => n.split(" ")[0];
  const SES = K.id + ".sesion";
  const sesion = { get: () => { try { return sessionStorage.getItem(SES) === "1"; } catch (x) { return false; } }, set: (v) => { try { if (v) sessionStorage.setItem(SES, "1"); else sessionStorage.removeItem(SES); } catch (x) { /* sin almacenamiento */ } } };
  const wa = (c, txt) => "https://wa.me/" + ((c && c.tel) || "") + "?text=" + encodeURIComponent(txt);
  const ESTADO = { reservado: "sin confirmar", confirmado: "confirmada", atendido: "ha venido", ausente: "no ha venido", cancelado: "cancelada", bloqueado: "bloqueado" };
  const estadoDe = (t) => (t.estado === "reservado" && t.confirmado ? "confirmado" : t.estado);
  const cliente = (t) => (t.codigo ? T.porCodigo(t.codigo) : null);
  const VISTAS = ["hoy", "agenda", "clientes", "numeros", "ajustes"];
  let vista = "hoy", diaAg = url.get("dia") || TU.abiertos(1)[0], barbAg = "todos", filtro = "todos", texto = "", periodo = "semana";
  let turnoSel = "", elegido = url.get("c") || "", caja = null;

  T.vestir();

  /* ---------- Acceso: la puerta del garaje ---------- */
  const A = K.acceso, nota = $("#a-nota"), pista = "Demo: usuario " + A.usuario + ", contraseña " + A.clave;
  nota.textContent = pista;
  if (url.get("demo") === "1") { $("#a-usuario").value = A.usuario; $("#a-clave").value = A.clave; }
  function mostrar() { $("#app").hidden = false; pintar(); }
  $("#form-acceso").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const bien = $("#a-usuario").value.trim().toLowerCase() === A.usuario && $("#a-clave").value === A.clave;
    nota.textContent = bien ? "" : "Usuario o contraseña incorrectos"; nota.classList.toggle("error", !bien);
    if (!bien) { window.GARAJE.negar(); $("#a-clave").value = ""; $("#a-clave").focus(); return; }
    if (document.activeElement) document.activeElement.blur();
    sesion.set(true); mostrar(); window.scrollTo(0, 0);
    // El panel ya está pintado atrás cuando la puerta empieza a subir.
    requestAnimationFrame(() => requestAnimationFrame(() => window.GARAJE.abrir()));
  });
  function salir() {
    sesion.set(false); $("#a-clave").value = ""; nota.textContent = pista; nota.classList.remove("error");
    window.GARAJE.cerrar().then(() => { $("#app").hidden = true; history.replaceState(null, "", location.pathname + location.search); vista = "hoy"; caja = null; });
  }

  let reloj;
  function avisar(m) { const a = $("#aviso"); a.textContent = m; a.classList.add("ver"); clearTimeout(reloj); reloj = setTimeout(() => a.classList.remove("ver"), 3400); }

  /* ---------- Navegación ---------- */
  function ir(v, anima) {
    vista = VISTAS.includes(v) ? v : "hoy"; caja = null;
    if (location.hash !== "#" + vista) history.pushState(null, "", "#" + vista);
    pintar(anima !== false); window.scrollTo(0, 0);
  }
  $("#nav").addEventListener("click", (ev) => { const b = ev.target.closest("[data-ir]"); if (b) ir(b.dataset.ir); });
  window.addEventListener("popstate", () => { vista = VISTAS.includes(location.hash.slice(1)) ? location.hash.slice(1) : "hoy"; caja = null; pintar(true); });
  if (VISTAS.includes(location.hash.slice(1))) vista = location.hash.slice(1);

  function pintar(anima) {
    if ($("#app").hidden) return;
    const pend = pendientes();
    document.querySelectorAll("#nav [data-ir]").forEach((b) => {
      if (b.dataset.ir === vista) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
      const i = b.querySelector("i"); if (i) { i.hidden = !pend.length; i.textContent = pend.length; }
    });
    const m = $("#main");
    // En Clientes y Ajustes no se reescribe lo que se está escribiendo.
    if (vista === "clientes" && caja && document.activeElement && document.activeElement.id === "buscar") pintarLista();
    else if (vista === "ajustes" && caja) { /* el formulario queda como está */ }
    else { m.innerHTML = '<div class="vp"' + (anima ? "" : ' style="animation:none"') + ">" + { hoy: () => vHoy(pend), agenda: vAgenda, clientes: vClientes, numeros: vNumeros, ajustes: vAjustes }[vista]() + "</div>"; caja = m.firstElementChild; if (vista === "clientes") pintarLista(); }
    pintarFicha(); pintarCita();
  }

  /* ---------- Hoy ---------- */
  const hoyK = () => TU.abiertos(1)[0];
  const enTitulo = (k) => { const [a, m, d] = k.split("-").map(Number); const t = new Date(a, m - 1, d).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }); return TU.conMayus(t); };
  const citasDe = (k) => TU.delDia(k).filter((t) => t.estado !== "cancelado" && t.estado !== "bloqueado");
  const minutos = (l) => l.reduce((n, t) => n + (TU.fin(t) - new Date(t.inicio).getTime()) / MIN, 0);

  function pendientes() {
    const out = [], ahora = Date.now(), hoy = hoyK(), prox = TU.abiertos(2);
    // Huecos que alguien está esperando: es plata que se puede recuperar.
    TU.espera().forEach((x) => {
      const libres = TU.horarios(x.dia, "cualquiera", TU.visibles()[0].id), canc = TU.delDia(x.dia).filter((t) => t.estado === "cancelado").map((t) => t.inicio);
      const h = libres.find((y) => canc.includes(y.inicio)) || libres[0]; if (!h) return;
      out.push({ plata: 1, t: "Se ha liberado un hueco " + TU.elDia(x.dia) + " a las " + h.hora, d: x.nombre + " lo está esperando.", b: '<button class="bt si" data-dar="' + x.codigo + '" data-ini="' + h.inicio + '" data-barb="' + h.barbero + '" data-dia="' + x.dia + '">Darle la cita</button>' });
    });
    // Citas que ya terminaron y nadie marcó.
    citasDe(hoy).filter((t) => TU.vigente(t) && TU.fin(t) < ahora).forEach((t) => out.push({ t: "¿Ha venido " + t.nombre + "?", d: "Tenía cita a las " + TU.hora(t.inicio) + " con " + TU.barbero(t.barbero).nombre + ".", b: '<button class="bt si" data-llego="' + t.id + '">Sí</button><button class="bt" data-novino="' + t.id + '">No</button>' }));
    const sin = prox.flatMap((k) => citasDe(k)).filter((t) => TU.vigente(t) && !t.confirmado && new Date(t.inicio).getTime() > ahora);
    if (sin.length) { const t = sin[0]; out.push({ t: pl(sin.length, "cita sin confirmar", "citas sin confirmar"), d: "La primera: " + t.nombre + ", " + TU.cuandoDia(TU.clave(t.inicio)) + " a las " + TU.hora(t.inicio) + ".", b: '<a class="bt" target="_blank" rel="noopener" href="' + wa(cliente(t), recordar(t)) + '">Recordarle</a><button class="bt" data-cita="' + t.id + '">Ver la cita</button>' }); }
    T.clientes().filter((c) => c.socio && !T.alDia(c)).forEach((c) => out.push({ t: c.nombre + " debe la cuota", d: eur(K.membresia.precio) + " de " + K.membresia.nombre + ".", b: '<button class="bt si" data-cobrar="' + c.codigo + '">Ya pagó</button><a class="bt" target="_blank" rel="noopener" href="' + wa(c, "Hola " + pila(c.nombre) + ", se venció tu cuota de " + K.membresia.nombre + " (" + eur(K.membresia.precio) + "). ¿La renovamos?") + '">Escribirle</a>' }));
    const dorm = T.clientes().filter(dormido).sort((a, b) => T.diasSin(b) - T.diasSin(a));
    if (dorm.length) { const c = dorm[0]; out.push({ t: c.nombre + " lleva " + T.diasSin(c) + " días sin venir", d: dorm.length > 1 ? "Hay " + (dorm.length - 1) + " más en la misma situación." : "Un mensaje suele alcanzar para que vuelva.", b: '<a class="bt" target="_blank" rel="noopener" href="' + wa(c, mensajePara(c)) + '">Escribirle</a><button class="bt" data-ficha="' + c.codigo + '">Ver su tarjeta</button>' }); }
    return out;
  }
  const recordar = (t) => "Hola " + pila(t.nombre) + ", te esperamos " + TU.cuandoDia(TU.clave(t.inicio)) + " a las " + TU.hora(t.inicio) + " en " + K.nombre + ". ¿Confirmas? Si no puedes, cámbiala desde tu tarjeta.";

  function vHoy(pend) {
    const k = hoyK(), esHoy = k === TU.clave(Date.now()), l = citasDe(k), ahora = Date.now();
    const cobrado = l.filter((t) => t.estado === "atendido").reduce((n, t) => n + TU.importe(t), 0), falta = l.filter(TU.vigente).reduce((n, t) => n + TU.importe(t), 0);
    const sin = l.filter((t) => TU.vigente(t) && !t.confirmado).length, ocup = Math.round(minutos(l) / TU.capacidad() * 100);
    const c = (b, s, ojo) => '<div' + (ojo ? ' class="ojo"' : "") + "><b>" + b + "</b><span>" + s + "</span></div>";
    return '<div class="vp-h"><div><h1>' + (esHoy ? "Hoy" : "Próximo día abierto") + '</h1><p class="sub">' + enTitulo(k) + "</p></div></div>" +
      '<div class="ticket">' + c(eur(cobrado), "cobrados") + c(eur(falta), "por cobrar") + c(ocup + " %", pl(l.length, "cita", "citas") + " en agenda") + c(sin, "sin confirmar", sin) + "</div>" +
      '<div class="hoy-g"><section><h2>En la silla</h2><div class="sillas">' + KT.barberos.map((b) => {
        const suyas = l.filter((t) => t.barbero === b.id && TU.vigente(t) && TU.fin(t) > ahora), t = suyas[0], total = l.filter((x) => x.barbero === b.id).length;
        let h = '<article class="silla"><header><h3>' + e(b.nombre) + "</h3><span>" + pl(total, "cita", "citas") + "</span></header>";
        if (!t) return h + '<p class="sub" style="padding-bottom:12px">No le quedan citas.</p></article>';
        const mins = Math.round((new Date(t.inicio).getTime() - ahora) / MIN), cu = cliente(t), d = cu ? T.descuentoAhora(cu) : 0, imp = TU.importe(t);
        h += '<div class="ahora"><b><em>' + TU.hora(t.inicio) + "</em>" + e(t.nombre) + "</b><p>" + e(TU.servicio(t.servicio).nombre) + " · " + (imp === 0 && cu ? "incluido en su cuota" : eur(imp) + (d ? " con " + d + "% de descuento" : "")) +
          (esHoy && mins > 0 && mins < 600 ? " · " + (mins < 60 ? "en " + mins + " min" : "en " + Math.floor(mins / 60) + " h" + (mins % 60 ? " " + mins % 60 + " min" : "")) : mins <= 0 ? " · ahora" : "") + "</p>" +
          '<div class="fila"><button class="bt si" data-llego="' + t.id + '">' + (cu ? "Ha llegado, sumar sello" : "Ha llegado") + '</button><button class="bt" data-cita="' + t.id + '">Más</button></div></div>';
        return h + '<ul class="cola">' + suyas.slice(1, 5).map((x) => '<li><button data-cita="' + x.id + '"><time>' + TU.hora(x.inicio) + "</time><b>" + e(x.nombre) + "</b><span>" + e(TU.servicio(x.servicio).nombre) + "</span></button></li>").join("") + "</ul></article>";
      }).join("") + "</div></section><section><h2>Para resolver</h2>" +
      (pend.length ? '<ul class="pend">' + pend.slice(0, 6).map((p) => '<li' + (p.plata ? ' class="plata"' : "") + "><b>" + e(p.t) + "</b><p>" + e(p.d) + '</p><div class="fila">' + p.b + "</div></li>").join("") + "</ul>" : '<p class="nada" style="margin-top:12px">Está todo al día.</p>') + "</section></div>";
  }

  /* ---------- Agenda ---------- */
  const PX = 1.6;
  const fechaDe = (k) => { const [a, m, d] = k.split("-").map(Number); return new Date(a, m - 1, d); };
  function semanaAg() {
    const l = TU.lunesDe(fechaDe(diaAg)), f = TU.mas(l, 6), hoy = TU.clave(Date.now()), min = TU.mas(TU.lunesDe(Date.now()), -56), max = TU.mas(TU.lunesDe(Date.now()), 35);
    const titulo = l.getDate() + (l.getMonth() !== f.getMonth() ? " " + TU.MESES[l.getMonth()].slice(0, 3) : "") + " al " + f.getDate() + " " + TU.MESES[f.getMonth()].slice(0, 3);
    return '<div class="sem-nav"><button type="button" data-semana="-1" aria-label="Semana anterior"' + (l <= min ? " disabled" : "") + '>‹</button><b>' + titulo + '</b><button type="button" data-semana="1" aria-label="Semana siguiente"' + (l >= max ? " disabled" : "") + '>›</button><button type="button" class="ir-hoy" data-semana="0"' + (diaAg === hoyK() ? " disabled" : "") + ">Hoy</button></div>" +
      '<div class="semana">' + TU.LETRAS.map((x, i) => { const d = TU.mas(l, i), k = TU.clave(d), ab = TU.abre(d), c = ab ? citasDe(k) : [], p = ab ? Math.min(100, Math.round(minutos(c) / TU.capacidad() * 100)) : 0;
        return '<button type="button" class="' + (k === diaAg ? "on" : "") + (k === hoy ? " hoy" : "") + '" data-dia="' + k + '" aria-pressed="' + (k === diaAg) + '" aria-label="' + TU.DIAS[d.getDay()] + " " + d.getDate() + ", " + (ab ? pl(c.length, "cita", "citas") : "cerrado") + '"' + (ab ? "" : " disabled") + "><span>" + x + "</span><b>" + d.getDate() + "</b><i><u style=\"width:" + p + '%"></u></i></button>'; }).join("") + "</div>";
  }
  function moverSemana(n) {
    if (!n) { diaAg = hoyK(); return; }
    const d = TU.mas(fechaDe(diaAg), n * 7), l = TU.lunesDe(d), dias = Array.from({ length: 7 }, (_, i) => TU.mas(l, i)).filter(TU.abre).map(TU.clave);
    diaAg = dias.includes(TU.clave(d)) ? TU.clave(d) : dias[0] || diaAg;
  }
  // Pasar de día deslizando sobre la agenda.
  function otroDia(n) { let d = fechaDe(diaAg); for (let i = 0; i < 14; i++) { d = TU.mas(d, n); if (TU.abre(d)) { diaAg = TU.clave(d); return; } } }
  let toque = null;
  document.addEventListener("touchstart", (ev) => { const r = ev.target.closest && ev.target.closest(".rejilla"); toque = r && r.scrollWidth <= r.clientWidth + 2 && ev.touches.length === 1 ? [ev.touches[0].clientX, ev.touches[0].clientY] : null; }, { passive: true });
  document.addEventListener("touchend", (ev) => { if (!toque) return; const t = ev.changedTouches[0], x = t.clientX - toque[0], y = t.clientY - toque[1]; toque = null; if (Math.abs(x) > 70 && Math.abs(x) > Math.abs(y) * 2) { otroDia(x < 0 ? 1 : -1); pintar(); } }, { passive: true });
  function vAgenda() {
    if (!TU.abre(fechaDe(diaAg))) diaAg = hoyK();
    const r = TU.resumenDia(diaAg), lista = TU.delDia(diaAg), [a, m, d] = diaAg.split("-").map(Number), ahora = Date.now();
    const alto = (KT.hasta - KT.desde) * 60 * PX, base = new Date(a, m - 1, d, KT.desde).getTime(), y = (ms) => (ms - base) / MIN * PX;
    const esp = TU.espera().filter((x) => x.dia === diaAg).length, bs = barbAg === "todos" ? KT.barberos : KT.barberos.filter((b) => b.id === barbAg);
    const cols = bs.map((b) => {
      const suyos = lista.filter((t) => t.barbero === b.id), ocupa = suyos.filter((t) => t.estado !== "cancelado"); let h = "";
      for (let i = KT.desde * 60; i < KT.hasta * 60; i += KT.paso) {
        const ini = new Date(a, m - 1, d, 0, i), f = ini.getTime() + KT.paso * MIN;
        if (ocupa.some((t) => new Date(t.inicio).getTime() < f && TU.fin(t) > ini.getTime())) continue;
        const pasado = ini.getTime() < ahora, hh = TU.hora(ini);
        h += '<button class="slot" style="top:' + y(ini.getTime()) + "px;height:" + KT.paso * PX + 'px" data-slot="' + ini.toISOString() + '" data-barb="' + b.id + '" aria-label="' + (pasado ? "Pasado " : "Dar cita a las ") + hh + " con " + e(b.nombre) + '"' + (pasado ? " disabled" : "") + "></button>";
      }
      suyos.forEach((t) => {
        const est = estadoDe(t), ini = new Date(t.inicio).getTime(), f = TU.fin(t);
        if (est === "cancelado" && (ini < ahora || ocupa.some((o) => new Date(o.inicio).getTime() < f && TU.fin(o) > ini))) return;
        const sub = est === "bloqueado" ? "Tocar para quitar" : est === "cancelado" ? (esp ? pl(esp, "persona espera", "personas esperan") : "hueco libre") : e(TU.servicio(t.servicio).nombre) + (est === "atendido" || est === "ausente" ? ", " + ESTADO[est] : "");
        h += '<button class="cita ' + est + '" style="top:' + (y(ini) + 1) + "px;height:" + ((f - ini) / MIN * PX - 3) + 'px" data-cita="' + t.id + '" aria-label="' + TU.hora(t.inicio) + " " + e(t.nombre) + ", " + ESTADO[est] + '"><b>' + (est === "cancelado" ? "Ha cancelado " + e(pila(t.nombre)) : (est === "atendido" ? "✓ " : "") + e(t.nombre) + (t.codigo ? " ★" : "")) + "</b><small>" + sub + "</small></button>";
      });
      const n = y(ahora);
      return '<div><h3>' + e(b.nombre) + '</h3><div class="lienzo" style="height:' + alto + 'px">' + h + (n > 0 && n < alto ? '<div class="linea-ahora" style="top:' + n + 'px"></div>' : "") + "</div></div>";
    }).join("");
    let horas = ""; for (let i = KT.desde; i <= KT.hasta; i++) horas += '<span style="top:' + ((i - KT.desde) * 60 * PX + 2) + 'px">' + String(i).padStart(2, "0") + ":00</span>";
    return '<div class="vp-h"><div><h1>Agenda</h1><p class="sub">' + enTitulo(diaAg) + ": " + pl(r.turnos, "cita", "citas") + ", " + pl(r.libres, "hueco", "huecos") + " para un corte" + (r.ausentes ? ", " + pl(r.ausentes, "no ha venido", "no han venido") : "") + "</p></div>" +
      (KT.barberos.length > 1 ? '<div class="seg" role="group" aria-label="Barbero">' + [{ id: "todos", nombre: "Todos" }].concat(KT.barberos).map((b) => '<button data-barbero="' + b.id + '" aria-pressed="' + (b.id === barbAg) + '">' + e(b.nombre) + "</button>").join("") + "</div>" : "") + "</div>" +
      '<section class="agenda">' + semanaAg() +
      '<div class="rejilla"><div class="horas-ag" style="height:' + (alto + 12) + 'px">' + horas + '</div><div class="cols">' + cols + "</div></div>" +
      '<p class="leyenda"><span><i></i>Confirmada</span><span><i class="r"></i>Sin confirmar</span><span><i class="h"></i>Hueco por cancelación</span><span>★ Tiene tarjeta</span></p></section>';
  }

  /* ---------- Clientes ---------- */
  const dormido = (c) => T.diasSin(c) > K.diasInactivo;
  const filtros = { todos: { n: "Todos", fn: () => true }, descuento: { n: "Con descuento", fn: (c) => T.descuentoAhora(c) > 0 }, dormidos: { n: "No vienen", fn: dormido }, socios: { n: "Socios", fn: (c) => !!c.socio } };
  function timbre(c) {
    const d = T.descuentoAhora(c);
    if (d && filtro !== "dormidos") return '<span class="timbre">Le toca −' + d + "%</span>";
    if (dormido(c)) return '<span class="timbre quieto">' + T.diasSin(c) + " días sin venir</span>";
    return '<span class="nota" style="color:var(--tinta-suave)">' + (c.visitas.length ? T.haceCuanto(T.diasSin(c)) : "sin cortes") + "</span>";
  }
  function marcas(n) { let h = ""; for (let i = 0; i < K.sellos; i++) h += '<i class="' + (T.hitoEn(i + 1) ? "meta " : "") + (i < n ? "on" : "") + '"></i>'; return h; }
  function mensajePara(c) {
    const n = pila(c.nombre), d = T.descuentoAhora(c), p = T.proximo(c);
    if (d) return "Hola " + n + ", tu próximo corte en " + K.nombre + " tiene " + d + "% de descuento. ¿Te guardo una cita?";
    const falta = (p.faltan === 1 ? "Te falta 1 corte" : "Te faltan " + p.faltan + " cortes") + " para tu " + p.pct + "% de descuento.";
    return dormido(c) ? "Hola " + n + ", hace tiempo que no te vemos por " + K.nombre + ". " + falta + " ¿Te guardo una cita esta semana?" : "Hola " + n + ". " + falta + " ¿Te guardo una cita en " + K.nombre + "?";
  }
  const vClientes = () => '<div class="vp-h"><div><h1>Clientes</h1><p class="sub">' + pl(T.clientes().length, "tarjeta", "tarjetas") + '</p></div><button class="bt" data-abrir="cliente">Nuevo cliente</button></div>' +
    '<section class="planilla"><label for="buscar" class="nota" style="color:var(--tinta-suave);margin:0">Buscar por nombre, móvil o número de tarjeta</label><input id="buscar" type="search" autocomplete="off" value="' + e(texto) + '"><div class="pestanas" role="tablist" id="pestanas"></div><ul class="renglones" id="clientes"></ul></section>';
  function pintarLista() {
    const base = T.buscar(texto);
    $("#pestanas").innerHTML = Object.keys(filtros).map((k) => '<button class="pestana" role="tab" type="button" data-filtro="' + k + '" aria-selected="' + (k === filtro) + '"' + (k === filtro ? ' style="border-bottom-color:var(--acento)"' : "") + ">" + filtros[k].n + " (" + base.filter(filtros[k].fn).length + ")</button>").join("");
    const l = base.filter(filtros[filtro].fn).sort((a, b) => filtro === "dormidos" ? T.diasSin(b) - T.diasSin(a) : new Date(T.ultima(b)) - new Date(T.ultima(a)));
    $("#clientes").innerHTML = l.length ? l.map((c) => { const n = T.sellosDe(c).length; return '<li><button class="renglon" type="button" data-ficha="' + c.codigo + '"><b>' + e(c.nombre) + (c.socio ? (T.alDia(c) ? "<small>Socio</small>" : "<small class=\"mal\">Cuota vencida</small>") : "") + '</b><span class="marcas" role="img" aria-label="' + n + " de " + K.sellos + ' sellos">' + marcas(n) + "</span>" + timbre(c) + "</button></li>"; }).join("") : '<li class="vacio">Nadie con ese criterio.</li>';
  }

  /* ---------- Números ---------- */
  function vNumeros() {
    const dias = periodo === "semana" ? 7 : 28, fin = new Date(); fin.setHours(0, 0, 0, 0);
    const atras = (n) => { const d = new Date(fin); d.setDate(d.getDate() - n); return d.getTime(); };
    const l = TU.entre(atras(dias), fin.getTime()), prev = TU.entre(atras(dias * 2), atras(dias));
    const plata = (x) => x.filter((t) => t.estado === "atendido").reduce((n, t) => n + TU.importe(t), 0);
    const tot = plata(l), antes = plata(prev), dif = antes ? Math.round((tot - antes) / antes * 100) : 0, at = l.filter((t) => t.estado === "atendido");
    const barras = periodo === "semana"
      ? Array.from({ length: 7 }, (_, i) => new Date(atras(7 - i))).filter((d) => KT.dias.includes(d.getDay())).map((d) => [d.toLocaleDateString("es-ES", { weekday: "short" }).slice(0, 3) + " " + d.getDate(), plata(l.filter((t) => TU.clave(t.inicio) === TU.clave(d)))])
      : [3, 2, 1, 0].map((i) => { const a = atras((i + 1) * 7), b = atras(i * 7), x = new Date(a), z = new Date(b - DIA / 2); return [x.getDate() + (x.getMonth() !== z.getMonth() ? "/" + (x.getMonth() + 1) : "") + " al " + z.getDate() + "/" + (z.getMonth() + 1), plata(TU.entre(a, b))]; });
    const max = Math.max(1, ...barras.map((b) => b[1]));
    const fila = (n, v, tope, txt) => "<li><div><span>" + e(n) + "</span><b>" + txt + "</b></div><u><i style=\"width:" + (tope ? v / tope * 100 : 0) + '%"></i></u></li>';
    const porB = KT.barberos.map((b) => [b.nombre, plata(l.filter((t) => t.barbero === b.id)), at.filter((t) => t.barbero === b.id).length]).sort((a, b) => b[1] - a[1]);
    const porS = KT.servicios.map((s) => [s.nombre, at.filter((t) => t.servicio === s.id).length]).filter((x) => x[1]).sort((a, b) => b[1] - a[1]);
    const aus = l.filter((t) => t.estado === "ausente").length, canc = l.filter((t) => t.estado === "cancelado").length;
    const abiertos = new Set(l.map((t) => TU.clave(t.inicio))).size, ocup = abiertos ? Math.round(minutos(l.filter((t) => t.estado !== "cancelado")) / (abiertos * TU.capacidad()) * 100) : 0;
    const R = T.resumen(), M = K.membresia, soc = T.clientes().filter((c) => c.socio).sort((a, b) => new Date(a.socio.pagoHasta) - new Date(b.socio.pagoHasta));
    return '<div class="vp-h"><div><h1>Números</h1><p class="sub">' + (periodo === "semana" ? "Últimos 7 días" : "Últimas 4 semanas") + ', hasta ayer</p></div><div class="seg" role="group" aria-label="Período"><button data-periodo="semana" aria-pressed="' + (periodo === "semana") + '">Semana</button><button data-periodo="mes" aria-pressed="' + (periodo === "mes") + '">4 semanas</button></div></div>' +
      '<div class="num-g"><section class="caja-n ancho"><h2>Ingresos por cortes</h2><p class="grande">' + eur(Math.round(tot)) + "</p><p>" + (antes ? "<strong>" + (dif >= 0 ? "+" : "−") + Math.abs(dif) + " %</strong> contra el período anterior (" + eur(Math.round(antes)) + ")" : "Sin datos del período anterior") + "</p>" +
      '<div class="barras" role="img" aria-label="' + barras.map((b) => b[0] + ": " + Math.round(b[1]) + " euros").join(", ") + '">' + barras.map((b, i) => '<div style="--n:' + i + '"' + (b[1] === max ? ' class="max"' : "") + "><b>" + T.pesos(b[1]) + "</b><i style=\"height:" + Math.round(b[1] / max * 150) + 'px"></i><span>' + b[0] + "</span></div>").join("") + "</div></section>" +
      (M ? '<section class="caja-n"><h2>' + e(M.nombre) + '</h2><p class="grande">' + eur(R.ingreso) + "</p><p>fijos por mes, " + pl(R.socios, "socio", "socios") + " a " + eur(M.precio) + '</p><ul class="filas">' + soc.map((c) => '<li><button data-ficha="' + c.codigo + '"><span style="color:inherit">' + e(c.nombre) + "</span>" + (T.alDia(c) ? "<span>cobro " + T.cuando(c.socio.pagoHasta) + "</span>" : "<em>vencida</em>") + "</button></li>").join("") + "</ul></section>" : "") +
      '<section class="caja-n"><h2>Agenda ocupada</h2><p class="grande n">' + ocup + " %</p><p>" + pl(at.length, "corte hecho", "cortes hechos") + ", " + eur(at.length ? Math.round(tot / at.length * 100) / 100 : 0) + " de media</p></section>" +
      '<section class="caja-n"><h2>No han venido</h2><p class="grande n' + (aus ? " mal" : "") + '">' + aus + "</p><p>y " + pl(canc, "cancelación con aviso", "cancelaciones con aviso") + "</p></section>" +
      '<section class="caja-n"><h2>Descuentos por aplicar</h2><p class="grande n">' + R.conDescuento + "</p><p>" + (R.conDescuento === 1 ? "cliente lo tiene" : "clientes los tienen") + " en su próximo corte</p></section>" +
      '<section class="caja-n medio"><h2>Por barbero</h2><ul class="filas">' + porB.map((x) => fila(x[0] + ", " + pl(x[2], "corte", "cortes"), x[1], porB[0][1], eur(Math.round(x[1])))).join("") + "</ul></section>" +
      '<section class="caja-n medio"><h2>Lo más pedido</h2><ul class="filas">' + porS.map((x) => fila(x[0], x[1], porS[0][1], x[1])).join("") + "</ul></section></div>" +
      '<p class="sub" style="margin-top:16px">Son datos de ejemplo. Con el sistema en marcha se llenan solos con cada cita.</p>';
  }

  /* ---------- Ajustes ---------- */
  const DURA = [15, 30, 45, 60, 75, 90, 120];
  const filaSrv = (s) => '<div class="srv" data-srv-id="' + e(s.id) + '"><div class="nom"><label>Servicio<input type="text" maxlength="40" data-c="nombre" value="' + e(s.nombre) + '"></label></div><div><label>Precio €<input type="number" min="0" max="999" step="0.5" inputmode="decimal" data-c="precio" value="' + s.precio + '"></label></div><div><label>Minutos<select data-c="min">' + DURA.map((m) => '<option' + (m === s.min ? " selected" : "") + ">" + m + "</option>").join("") + '</select></label></div><label class="ver"><input type="checkbox" data-c="ver"' + (s.oculto ? "" : " checked") + "> Visible</label></div>";
  const filaBarb = (b) => '<div class="campo" data-barb-id="' + e(b.id) + '" style="margin-bottom:8px"><input type="text" maxlength="30" aria-label="Nombre del barbero" value="' + e(b.nombre) + '"></div>';
  function vAjustes() {
    const hora = (id, v, a, b) => '<select id="' + id + '">' + Array.from({ length: b - a + 1 }, (_, i) => a + i).map((h) => '<option value="' + h + '"' + (h === v ? " selected" : "") + ">" + String(h).padStart(2, "0") + ":00</option>").join("") + "</select>";
    return '<div class="vp-h"><div><h1>Ajustes</h1><p class="sub">Lo que cambies aquí lo ve el cliente al pedir cita.</p></div></div><form class="aj" id="form-aj">' +
      '<section class="caja-n ancho"><h2>Servicios y precios</h2><div id="aj-srv">' + KT.servicios.map(filaSrv).join("") + '</div><button class="bt mas" type="button" data-aj="srv">Añadir servicio</button></section>' +
      '<section class="caja-n"><h2>Horario</h2><div class="dias-aj">' + [["L", 1, "lunes"], ["M", 2, "martes"], ["X", 3, "miércoles"], ["J", 4, "jueves"], ["V", 5, "viernes"], ["S", 6, "sábado"], ["D", 0, "domingo"]].map((d) => '<button type="button" data-dia-aj="' + d[1] + '" aria-label="' + d[2] + '" aria-pressed="' + KT.dias.includes(d[1]) + '">' + d[0] + "</button>").join("") + '</div><div class="dos"><label>Abre' + hora("aj-desde", KT.desde, 7, 15) + "</label><label>Cierra" + hora("aj-hasta", KT.hasta, 13, 23) + "</label></div></section>" +
      '<section class="caja-n"><h2>Barberos</h2><div id="aj-barb">' + KT.barberos.map(filaBarb).join("") + '</div><button class="bt" type="button" data-aj="barb">Añadir barbero</button></section>' +
      '<section class="caja-n"><h2>Tarjeta de sellos</h2><div class="tres">' + K.hitos.map((h, i) => "<label>" + h.en + '.º corte, %<input type="number" min="0" max="100" step="5" data-hito="' + i + '" value="' + h.pct + '"></label>').join("") + "</div>" + (K.membresia ? '<label style="margin-top:14px">Cuota de ' + e(K.membresia.nombre) + ' por mes, €<input type="number" id="aj-cuota" min="1" max="999" value="' + K.membresia.precio + '"></label>' : "") + "</section>" +
      '<section class="caja-n"><h2>Mostrador y demo</h2><p style="margin:0 0 12px">El cliente acerca el móvil a la tarjeta del mostrador y el sello se suma solo.</p><div style="display:flex;flex-wrap:wrap;gap:8px"><button class="bt" type="button" data-abrir="nfc">Tarjeta NFC</button><button class="bt" type="button" id="reiniciar">Reiniciar la demo</button><button class="bt" type="button" data-salir>Cerrar el garaje</button></div></section>' +
      '<div class="guardar-aj"><button class="bt si" type="submit">Guardar ajustes</button></div></form>';
  }
  function guardarAjustes(f) {
    const mal = (m) => { avisar(m); return false; };
    const servicios = [...f.querySelectorAll("[data-srv-id]")].map((x) => { const v = (c) => x.querySelector('[data-c="' + c + '"]'); return { id: x.dataset.srvId, nombre: v("nombre").value.trim(), min: Number(v("min").value), precio: Number(v("precio").value), oculto: !v("ver").checked }; }).filter((s) => s.nombre || KT.servicios.some((k) => k.id === s.id));
    const barberos = [...f.querySelectorAll("[data-barb-id]")].map((x) => ({ id: x.dataset.barbId, nombre: x.querySelector("input").value.trim() })).filter((b) => b.nombre || KT.barberos.some((k) => k.id === b.id));
    const dias = [...f.querySelectorAll("[data-dia-aj][aria-pressed=true]")].map((b) => Number(b.dataset.diaAj)), desde = Number($("#aj-desde").value), hasta = Number($("#aj-hasta").value);
    const hitos = K.hitos.map((h, i) => ({ en: h.en, pct: Math.round(Number(f.querySelector('[data-hito="' + i + '"]').value)) })), cuota = K.membresia ? Number($("#aj-cuota").value) : 0;
    if (servicios.some((s) => !s.nombre || !(s.precio >= 0 && s.precio <= 999))) return mal("Revisa el nombre y el precio de los servicios.");
    if (!servicios.some((s) => !s.oculto)) return mal("Deja al menos un servicio visible.");
    if (barberos.some((b) => !b.nombre)) return mal("Falta el nombre de un barbero.");
    if (!dias.length) return mal("Elige al menos un día de apertura.");
    if (hasta - desde < 2) return mal("El cierre tiene que ser después de la apertura.");
    if (hitos.some((h) => !(h.pct >= 1 && h.pct <= 100)) || (K.membresia && !(cuota > 0))) return mal("Revisa los descuentos y la cuota.");
    if (!window.MARCA.ajustes.poner({ servicios, barberos, dias, desde, hasta, hitos, cuota })) return mal("No se pudo guardar en este navegador.");
    try { sessionStorage.setItem(K.id + ".aviso", "Ajustes guardados."); } catch (x) { /* sin almacenamiento */ }
    location.reload();
  }

  /* ---------- Hoja de la cita ---------- */
  const hojaTp = $("#hoja-tp"), hojaRep = $("#hoja-rep"), hojaCita = $("#hoja-cita"), hojaFicha = $("#hoja-ficha"), hojaNuevo = $("#hoja-nuevo"), hojaNfc = $("#hoja-nfc");
  [hojaTp, hojaRep, hojaCita, hojaFicha, hojaNuevo, hojaNfc].forEach((h) => h.addEventListener("click", (ev) => { if (ev.target === h || ev.target.closest("[data-cerrar]")) h.close(); }));
  function pintarCita() {
    const t = turnoSel ? TU.buscar(turnoSel) : null;
    if (!t) { if (hojaTp.open) hojaTp.close(); return; }
    const s = TU.servicio(t.servicio), est = estadoDe(t), c = cliente(t), k = TU.clave(t.inicio), b = TU.barbero(t.barbero);
    const hist = t.historial.map((h) => "<li>" + (h.que === "reprogramo" ? "La cambió: antes era " + e(h.de) : (h.quien === "local" ? "La canceló el local" : "Canceló") + " con " + Math.round(h.horas) + " h de aviso" + (h.tarde ? " (a última hora)" : "")) + "</li>").join("");
    let acc = "";
    if (TU.vigente(t)) acc = '<div class="fila"><button class="bt si" data-llego="' + t.id + '">' + (c ? "Ha llegado, sumar sello" : "Ha llegado") + '</button><button class="bt" data-tp="mover">Mover</button></div><div class="suave"><button class="enlace" data-novino="' + t.id + '">No ha venido</button><button class="enlace" data-tp="cancelar">Cancelar cita</button><a class="enlace" target="_blank" rel="noopener" href="' + wa(c, recordar(t)) + '">Escribirle</a></div>';
    else if (t.estado === "cancelado") {
      const libre = TU.horarios(k, t.barbero, TU.visibles()[0].id).some((h) => h.inicio === t.inicio), esp = TU.espera().filter((x) => x.dia === k);
      acc = !libre ? '<p style="margin-top:14px">Ese hueco ya no está libre.</p>' : esp.length ? '<ul class="historial">' + esp.map((x) => "<li><b>" + e(x.nombre) + '</b> espera cita para ese día<div class="fila"><button class="bt si" data-dar="' + x.codigo + '" data-ini="' + t.inicio + '" data-barb="' + t.barbero + '" data-dia="' + k + '">Darle la cita</button></div></li>').join("") + "</ul>" : '<div class="fila"><button class="bt si" data-slot="' + t.inicio + '" data-barb="' + t.barbero + '">Dar cita en este hueco</button></div>';
    } else if (t.estado === "bloqueado") acc = '<div class="fila"><button class="bt si" data-tp="desbloquear">Quitar el bloqueo</button></div>';
    else acc = '<div class="fila"><button class="bt" data-tp="deshacer">Deshacer</button><button class="bt si" data-cerrar>Listo</button></div>';
    $("#tp").innerHTML = t.estado === "bloqueado" ? "<h2>Hueco bloqueado</h2><p>" + e(b.nombre) + " · " + TU.conMayus(TU.fechaTurno(t)) + "</p>" + acc
      : "<h2>" + e(t.nombre) + "</h2><p>" + e(s.nombre) + " con " + e(b.nombre) + '</p><p style="margin-top:6px;font-weight:600">' + TU.conMayus(TU.fechaTurno(t)) + "</p>" + (t.estado !== "cancelado" ? '<p class="importe">' + eur(TU.importe(t)) + "</p>" : "") + '<p style="margin-top:10px"><span class="timbre' + (est === "confirmado" || est === "atendido" ? "" : " quieto") + '">' + ESTADO[est] + "</span></p>" + (hist ? '<ul class="historial">' + hist + "</ul>" : "") + acc + (c ? '<div><button class="enlace" data-ficha="' + t.codigo + '">Ver su tarjeta</button></div>' : "");
    if (!hojaTp.open) hojaTp.showModal();
  }
  hojaTp.addEventListener("close", () => { turnoSel = ""; });

  let repSel = null, repId = "";
  function abrirMover(t) {
    repId = t.id; repSel = null; turnoSel = ""; hojaTp.close();
    $("#rep-antes").innerHTML = e(t.nombre) + " · antes: <s>" + TU.fechaTurno(t) + "</s>";
    $("#rep-ok").disabled = true; $("#rep-resumen").textContent = "Elige un horario";
    TU.selector($("#rep-selector"), { servicio: t.servicio, barbero: t.barbero, ignorar: t.id, cambio: (r) => { repSel = r; $("#rep-resumen").textContent = r ? r.texto : "Elige un horario"; $("#rep-ok").disabled = !r; } });
    hojaRep.showModal(); hojaRep.firstElementChild.scrollTop = 0;
  }
  $("#rep-ok").addEventListener("click", () => {
    if (!repSel) return; const r = TU.reprogramar(repId, repSel.inicio, repSel.barbero);
    if (!r.ok) return avisar("Ese horario se acaba de ocupar.");
    hojaRep.close(); diaAg = TU.clave(r.turno.inicio); pintar();
    avisar("Cita movida a " + TU.fechaTurno(r.turno) + "." + (r.espera.length ? " Hay gente esperando el hueco anterior." : ""));
  });

  /* Nueva cita */
  let nueva = null, hueco = null;
  function abrirNueva(ini, barb) {
    nueva = null; hueco = ini ? { ini, barb } : null; turnoSel = ""; if (hojaTp.open) hojaTp.close();
    $("#form-cita").reset(); $("#c-lista").innerHTML = T.clientes().map((c) => '<option value="' + e(c.nombre) + '">').join("");
    $("#c-bloquear").hidden = !hueco; $("#c-ok").disabled = true;
    TU.selector($("#c-selector"), { barbero: barb, dia: ini ? TU.clave(ini) : vista === "agenda" ? diaAg : null, inicio: ini, cambio: (r) => { nueva = r; $("#c-resumen").textContent = r ? r.texto : "Elige un horario"; $("#c-ok").disabled = !r; } });
    hojaCita.showModal(); hojaCita.firstElementChild.scrollTop = 0; $("#c-nombre").focus({ preventScroll: true });
  }
  $("#form-cita").addEventListener("submit", (ev) => {
    ev.preventDefault(); const nombre = $("#c-nombre").value.trim().replace(/\s+/g, " "); if (!nombre || !nueva) return;
    let c = T.clientes().find((x) => x.nombre.toLowerCase() === nombre.toLowerCase()) || null;
    if (!c && $("#c-tarjeta").checked) c = T.crear({ nombre, tel: $("#c-tel").value });
    const r = TU.reservar({ codigo: c && c.codigo, nombre: c ? c.nombre : nombre, barbero: nueva.barbero, servicio: nueva.servicio, inicio: nueva.inicio });
    if (!r.ok) return avisar("Ese horario se acaba de ocupar.");
    TU.confirmar(r.turno.id); hojaCita.close(); diaAg = TU.clave(r.turno.inicio); pintar(); avisar("Cita para " + pila(nombre) + ": " + TU.fechaTurno(r.turno) + ".");
  });
  $("#c-bloquear").addEventListener("click", () => { if (hueco && TU.bloquear(hueco.barb, hueco.ini).ok) { hojaCita.close(); pintar(); avisar("Hueco bloqueado a las " + TU.hora(hueco.ini) + "."); } else avisar("Ese hueco ya no está libre."); });

  /* ---------- Ficha del cliente ---------- */
  function pintarFicha() {
    const c = elegido ? T.porCodigo(elegido) : null;
    if (!c) { if (hojaFicha.open) hojaFicha.close(); return; }
    const n = T.sellosDe(c).length, d = T.descuentoAhora(c), pt = TU.proximoDe(c.codigo), ct = TU.cancelacionesTarde(c.codigo), au = TU.ausencias(c.codigo);
    const faltas = [ct ? "Canceló a última hora " + pl(ct, "vez", "veces") : "", au ? "No ha venido " + pl(au, "vez", "veces") : ""].filter(Boolean).join(" · ");
    $("#ficha").innerHTML = "<h2>" + e(c.nombre) + "</h2><p>Tarjeta " + c.codigo + " · " + n + " de " + K.sellos + ' sellos</p><div class="puntos" role="img" aria-label="' + n + " de " + K.sellos + ' sellos">' + marcas(n) + "</div><p>" + (c.visitas.length ? "Último corte " + T.haceCuanto(T.diasSin(c)) + ", " + pl(c.visitas.length, "visita", "visitas") + " en total" : "Todavía sin cortes") + "</p>" +
      (pt ? '<p style="margin-top:6px;font-weight:600">Próxima cita: ' + TU.fechaTurno(pt) + "</p>" : "") + (faltas ? '<p class="nota" style="margin-top:4px;color:var(--tinta-suave)">' + faltas + "</p>" : "") +
      (c.socio ? '<p style="margin-top:12px"><span class="timbre' + (T.alDia(c) ? "" : " quieto") + '">' + (T.alDia(c) ? "Socio, cobro " + T.cuando(c.socio.pagoHasta) : "Cuota vencida") + "</span></p>" : "") + (d ? '<p class="descuento">Este corte tiene ' + d + "% de descuento</p>" : "") +
      '<div class="fila"><button class="bt si" data-f="sumar">Sumar sello</button><a class="bt" target="_blank" rel="noopener" href="' + wa(c, mensajePara(c)) + '">Escribirle</a></div><div class="suave">' + (K.membresia ? '<button class="enlace" data-f="' + (!c.socio ? 'socio">Hacerlo socio' : T.alDia(c) ? 'baja">Baja del club' : 'pago">Registrar pago') + "</button>" : "") + (c.visitas.length ? '<button class="enlace" data-f="deshacer">Quitar último sello</button>' : "") + '<a class="enlace" href="index.html?c=' + c.codigo + '" target="_blank" rel="noopener">Ver su tarjeta</a><button class="enlace" data-cerrar>Cerrar</button></div>';
    if (!hojaFicha.open) hojaFicha.showModal();
  }
  hojaFicha.addEventListener("close", () => { elegido = ""; });

  /* ---------- Todo lo que se toca ---------- */
  document.addEventListener("click", (ev) => {
    const b = ev.target.closest("button"); if (!b || b.disabled) return; const D = b.dataset;
    if (D.abrir === "cita") abrirNueva();
    else if (D.abrir === "cliente") { $("#form-nuevo").reset(); hojaNuevo.showModal(); $("#n-nombre").focus(); }
    else if (D.abrir === "nfc") { $("#enlace-nfc").textContent = new URL("sello.html", location.href).href; hojaNfc.showModal(); }
    else if (D.cita) { turnoSel = D.cita; pintarCita(); }
    else if (D.ficha) { elegido = D.ficha; turnoSel = ""; if (hojaTp.open) hojaTp.close(); pintarFicha(); }
    else if (D.slot && D.barb) abrirNueva(D.slot, D.barb);
    else if (D.dia && b.closest(".agenda")) { diaAg = D.dia; pintar(); }
    else if (D.semana) { moverSemana(Number(D.semana)); pintar(); }
    else if (D.barbero) { barbAg = D.barbero; pintar(); }
    else if (D.periodo) { periodo = D.periodo; pintar(); }
    else if (D.filtro) { filtro = D.filtro; pintarLista(); }
    else if (D.llego) { const t = TU.buscar(D.llego), n = pila(t.nombre), r = TU.llego(t.id); turnoSel = ""; pintar(); avisar(r.sello ? "Ha llegado " + n + ": sello " + r.sello.numero + (r.sello.descuento ? ", con " + r.sello.descuento + "% de descuento." : " sumado.") : "Ha llegado " + n + "."); }
    else if (D.novino) { const t = TU.buscar(D.novino); TU.noVino(t.id); turnoSel = ""; pintar(); avisar("Anotado: " + pila(t.nombre) + " no ha venido."); }
    else if (D.cobrar) { if (T.cobrarCuota(D.cobrar).ok) { pintar(); avisar("Cuota registrada."); } }
    else if (D.dar) {
      const cx = T.porCodigo(D.dar), r = TU.reservar({ codigo: D.dar, nombre: cx ? cx.nombre : "Cliente", barbero: D.barb, servicio: TU.visibles()[0].id, inicio: D.ini });
      if (!r.ok) return avisar("Ese horario ya no está libre.");
      TU.quitarEspera(D.dar, D.dia); turnoSel = ""; pintar(); avisar("Cita dada a " + (cx ? pila(cx.nombre) : "el cliente") + ": " + TU.fechaTurno(r.turno) + ".");
    }
    else if (D.tp) {
      const t = TU.buscar(turnoSel); if (!t) return;
      if (D.tp === "mover") abrirMover(t);
      else if (D.tp === "desbloquear") { TU.desbloquear(t.id); turnoSel = ""; pintar(); avisar("Hueco libre otra vez."); }
      else if (D.tp === "deshacer") { TU.deshacer(t.id); turnoSel = ""; pintar(); avisar("Listo, quedó como antes."); }
      else if (D.tp === "cancelar" && confirm("¿Cancelar la cita de " + t.nombre + "?")) { const r = TU.cancelar(t.id, "local"); turnoSel = ""; pintar(); avisar("Cita cancelada." + (r.espera && r.espera.length ? " Hay " + r.espera.length + " en lista de espera." : "")); }
    }
    else if (D.f) {
      const c = T.porCodigo(elegido); if (!c) return; const n = pila(c.nombre);
      if (D.f === "sumar") { const r = T.sumar(c.codigo, "panel"); avisar("Sello " + r.numero + " para " + n + (r.descuento ? ", con " + r.descuento + "% de descuento." : ".")); }
      else if (D.f === "deshacer") { if (T.deshacer(c.codigo).ok) avisar("Se quitó el último sello de " + n + "."); }
      else if (D.f === "socio") { if (T.altaSocio(c.codigo).ok) avisar(n + " ya es socio."); }
      else if (D.f === "pago") { if (T.cobrarCuota(c.codigo).ok) avisar("Cuota de " + n + " registrada."); }
      else if (D.f === "baja" && confirm("¿Dar de baja a " + c.nombre + " de " + K.membresia.nombre + "?") && T.bajaSocio(c.codigo).ok) avisar(n + " dejó de ser socio.");
    }
    else if ("salir" in D) salir();
    else if (D.diaAj) b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true");
    else if (D.aj === "srv") { $("#aj-srv").insertAdjacentHTML("beforeend", filaSrv({ id: "s" + Date.now(), nombre: "", min: 30, precio: 10 })); $("#aj-srv").lastElementChild.querySelector("input").focus(); }
    else if (D.aj === "barb") { $("#aj-barb").insertAdjacentHTML("beforeend", filaBarb({ id: "b" + Date.now(), nombre: "" })); $("#aj-barb").lastElementChild.querySelector("input").focus(); }
    else if (b.id === "reiniciar" && confirm("¿Borrar los cambios y volver a los datos de ejemplo?")) { window.MARCA.ajustes.borrar(); T.reiniciar(); TU.reiniciar(); location.hash = "hoy"; location.reload(); }
  });
  document.addEventListener("input", (ev) => { if (ev.target.id === "buscar") { texto = ev.target.value; pintarLista(); } });
  document.addEventListener("submit", (ev) => { if (ev.target.id === "form-aj") { ev.preventDefault(); guardarAjustes(ev.target); } });
  $("#form-nuevo").addEventListener("submit", (ev) => {
    ev.preventDefault(); const nombre = $("#n-nombre").value.trim(); if (!nombre) return;
    const c = T.crear({ nombre, tel: $("#n-tel").value, conSello: $("#n-sello").checked });
    hojaNuevo.close(); filtro = "todos"; texto = ""; caja = null; elegido = c.codigo; pintar(); avisar("Tarjeta " + c.codigo + " creada para " + pila(c.nombre) + ".");
  });
  $("#copiar-nfc").addEventListener("click", () => {
    const t = $("#enlace-nfc").textContent, mal = () => avisar("Selecciona el enlace y cópialo a mano.");
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => avisar("Enlace copiado."), mal); else mal();
  });

  window.addEventListener("tarjeta:cambio", () => pintar());
  setInterval(() => { if (!document.querySelector("dialog[open]") && (vista === "hoy" || vista === "agenda")) pintar(); }, 60000);
  if (sesion.get()) mostrar();
  try { const a = sessionStorage.getItem(K.id + ".aviso"); if (a) { sessionStorage.removeItem(K.id + ".aviso"); avisar(a); } } catch (x) { /* sin almacenamiento */ }
})();
