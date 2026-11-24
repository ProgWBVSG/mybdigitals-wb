// Panel del dueño: barra lateral con Inicio, Carta, Ventas, Cierre de caja, Happy hour y Clientes.
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const pesos = n => '$' + Math.round(n || 0).toLocaleString('es-AR');
const mil = n => n >= 1e6 ? '$' + (n / 1e6).toLocaleString('es-AR', { maximumFractionDigits: 1 }) + ' M' : n >= 1e3 ? '$' + Math.round(n / 1e3) + ' mil' : pesos(n);
const mmss = s => s ? `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}` : '–';
const fecha = n => new Date(n + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' }).replace('.', '');
const esc = v => String(v ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
try { document.body.classList.toggle('claro', localStorage.getItem('tb_luz') === 'claro'); } catch {}
const QUIETO = matchMedia('(prefers-reduced-motion: reduce)').matches;
let pin = sessionStorage.getItem('tb_pin_dueno') || '', rango = null, D = null, fuente = null, seccion = 'inicio';
let carta = null, filtro = 'todas', orden = 'carta', busqueda = '';

const api = async (url, opt = {}) => {
  const r = await fetch(url, { ...opt, headers: { 'Content-Type': 'application/json', 'x-pin': pin, ...(opt.headers || {}) } });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(d.error || 'Sin conexión con el servidor.'); e.status = r.status; throw e; }
  return d;
};
async function cargar() { D = await api('/api/dueno/resumen' + (rango ? `?desde=${rango.desde}&hasta=${rango.hasta}` : '')); rango = { desde: D.desde, hasta: D.hasta }; }
// Texto del período elegido: "sáb 21 nov" o "1 al 30 nov"
const mesCorto = f => new Date(f + 'T12:00:00').toLocaleDateString('es-AR', { month: 'short' }).replace('.', '');
function etiquetaRango(d = D) {
  if (d.desde === d.hasta) return fecha(d.desde);
  const a = new Date(d.desde + 'T12:00:00'), b = new Date(d.hasta + 'T12:00:00');
  const ultimo = new Date(b.getFullYear(), b.getMonth() + 1, 0).getDate();
  if (a.getDate() === 1 && b.getDate() === ultimo && a.getMonth() === b.getMonth()) return a.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }).replace(/^./, c => c.toUpperCase());
  return a.getMonth() === b.getMonth() ? `${a.getDate()} al ${b.getDate()} ${mesCorto(d.hasta)}` : `${a.getDate()} ${mesCorto(d.desde)} al ${b.getDate()} ${mesCorto(d.hasta)}`;
}
const enVivo = () => D.desde <= D.hoy && D.hasta >= D.hoy && D.noches[0]?.noche === D.hoy;
// Alertas = lecturas que piden hacer algo. El shot sugerido ya está en su propia tarjeta de números.
const alertas = () => D.lecturas.filter(l => l.tipo !== 'sugerencia');
const deLaNoche = (noche, periodo) => D.unaNoche ? noche : periodo;
// Achica la letra hasta que el número entre en su tarjeta (nunca se corta)
function ajustar(el, max) {
  if (!el) return; const visible = el.textContent; if (el.dataset.fin) el.textContent = el.dataset.fin; // se mide con el número final, no con el que está contando
  el.style.fontSize = max + 'px';
  const ancho = el.parentElement.clientWidth - parseFloat(getComputedStyle(el.parentElement).paddingLeft) * 2;
  let f = max; while (el.scrollWidth > ancho && f > 20) { f -= 2; el.style.fontSize = f + 'px'; }
  el.textContent = visible;
}

// ---------- íconos ----------
const I = {
  inicio: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/>',
  carta: '<path d="M7 3h10l-1 6a4 4 0 0 1-8 0z"/><path d="M12 13v6M8.5 21h7"/>',
  ventas: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  cierre: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  happy: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  clientes: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c1.9.8 3 2.6 3.5 5.2"/>',
};
const ico = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[k]}</svg>`;
const SECCIONES = [['inicio', 'Inicio'], ['carta', 'Carta'], ['ventas', 'Ventas'], ['cierre', 'Cierre de caja'], ['happy', 'Happy hour'], ['clientes', 'Clientes']];
const SUB = { inicio: 'Lo importante', carta: 'Tragos, baldes y precios', ventas: 'Qué se vende y dónde', cierre: 'El ticket del período', happy: 'Precios que bajan solos', clientes: 'Toda tu base, desde el primer día' };

// ---------- microinteracciones ----------
function contar(el, hasta, fmt, ms = 750) {
  const desde = +el.dataset.v || 0; el.dataset.v = hasta;
  if (QUIETO || desde === hasta) { el.textContent = fmt(hasta); return; }
  const t0 = performance.now();
  const paso = t => { const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(desde + (hasta - desde) * e); if (k < 1) requestAnimationFrame(paso); };
  requestAnimationFrame(paso);
}
function aviso(texto, accion = null, ms = 4200) {
  const d = document.createElement('div'); d.className = 'aviso-t';
  d.innerHTML = `<span>${esc(texto)}</span>${accion ? `<button>${esc(accion.label)}</button>` : ''}<i class="barra-t" style="animation-duration:${ms}ms"></i>`;
  const fuera = () => { d.classList.add('va'); setTimeout(() => d.remove(), 250); };
  if (accion) d.querySelector('button').onclick = () => { accion.fn(); fuera(); };
  $('#avisos').appendChild(d); setTimeout(fuera, ms);
}
function moverIndicador(cont, activo, vertical = true) {
  const ind = $('.ind', cont); if (!ind || !activo) return;
  if (vertical) { ind.style.transform = `translateY(${activo.offsetTop}px)`; ind.style.height = activo.offsetHeight + 'px'; }
  else { ind.style.transform = `translateX(${activo.offsetLeft}px)`; ind.style.width = activo.offsetWidth + 'px'; }
}

// ---------- estructura ----------
function login(msg = '') {
  $('#raiz').innerHTML = `<div class="login"><form id="f"><img src="/demos/arena/arena/logo.png" alt="Arena Don Torcuato" style="width:170px;display:block;margin:0 auto 14px"><h1>Panel del dueño</h1><p>Ingresá tu PIN</p>
    <input id="p" type="password" inputmode="numeric" maxlength="8" autocomplete="current-password" aria-label="PIN" autofocus><div class="err">${msg}</div>
    <button class="btn-t" style="width:100%;margin-top:6px">Entrar</button></form></div>`;
  $('#f').onsubmit = async e => { e.preventDefault(); pin = $('#p').value; try { await cargar(); sessionStorage.setItem('tb_pin_dueno', pin); armar(); conectar(); } catch (er) { login(er.status === 401 ? 'PIN incorrecto.' : er.message); } };
}
// Primero lo que más se mira (Inicio y Ventas), después una línea y el resto.
const PRIMARIAS = ['inicio', 'ventas'], SECUNDARIAS = ['carta', 'clientes', 'cierre', 'happy'];
const LUPA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>';
function armar() {
  const link = (k, grande) => `<a href="#${k}" data-s="${k}" class="${grande ? 'grande' : ''}">${ico(k)}<span class="txt">${SECCIONES.find(x => x[0] === k)[1]}</span>${k === 'inicio' && alertas().length ? `<span class="badge">${alertas().length}</span>` : ''}</a>`;
  $('#raiz').innerHTML = `<aside class="lateral" id="lateral" aria-label="Secciones">
      <div class="marca"><img class="mk" src="/demos/arena/arena/marca.png" alt=""><div class="tx">Arena<span>Panel del dueño</span></div></div>
      <button class="buscar-l" id="btn-buscar" aria-haspopup="dialog">${LUPA}<span>Buscar</span><kbd>Ctrl K</kbd></button>
      <nav class="nav" id="nav"><span class="ind"></span>${PRIMARIAS.map(k => link(k, true)).join('')}<hr class="sep-nav">${SECUNDARIAS.map(k => link(k)).join('')}</nav>
      <div class="abajo"><button class="luz" id="luz" role="switch"><span class="luz-ico" aria-hidden="true"><svg class="sol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><svg class="luna" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg></span><span class="luz-txt"></span><span class="luz-sw"><i></i></span></button>
        <a href="cliente.html" target="_blank" rel="noopener">Ver la app del cliente <span>↗</span></a><a href="barra.html" target="_blank" rel="noopener">Pantalla de barra <span>↗</span></a></div>
    </aside><div class="velo-lat" id="velo-lat"></div>
    <main class="principal"><header class="cabeza"><button class="menu-btn" id="menu" aria-label="Abrir menú"><span></span></button>
      <div class="tit"><h1 id="titulo"></h1><span class="sub" id="subt"></span></div>
      <div class="fecha-ctrl" id="fecha-ctrl"></div><div class="acc" id="acc"></div></header>
    <div class="vista" id="vista"></div></main>`;
  $('#btn-buscar').onclick = () => buscador();
  $('#menu').onclick = () => document.body.classList.add('lat-abierta');
  $('#velo-lat').onclick = () => document.body.classList.toggle('lat-abierta', false);
  // Luz: oscuro o claro, con un círculo que se expande desde el botón
  const luz = $('#luz');
  const pintarLuz = () => { const c = document.body.classList.contains('claro'); luz.setAttribute('aria-checked', String(c)); $('.luz-txt', luz).textContent = c ? 'Modo claro' : 'Modo oscuro'; };
  luz.onclick = () => {
    const cambiar = () => { document.body.classList.toggle('claro'); try { localStorage.setItem('tb_luz', document.body.classList.contains('claro') ? 'claro' : 'oscuro'); } catch {} pintarLuz(); };
    const r = luz.getBoundingClientRect(); document.documentElement.style.setProperty('--vx', r.left + 22 + 'px'); document.documentElement.style.setProperty('--vy', r.top + r.height / 2 + 'px');
    if (document.startViewTransition && !QUIETO) document.startViewTransition(cambiar); else cambiar();
  };
  pintarLuz();
  addEventListener('hashchange', () => mostrar(location.hash.slice(1) || 'inicio'));
  addEventListener('resize', () => { moverIndicador($('#nav'), $('#nav a.on')); moverIndicador($('.modos'), $('.modos button.on'), false); });
  fechaCtrl();
  mostrar(location.hash.slice(1) || 'inicio', true);
}

// ---------- Fecha en la cabecera: Noche, Mes o Rango ----------
// Una noche se elige con un toque (o con las flechas), un mes también. El rango de dos toques queda sólo para quien lo pide.
const isoD = d => d.toLocaleDateString('sv-SE');
function modoActual() {
  if (D.desde === D.hasta) return 'noche';
  const a = new Date(D.desde + 'T12:00:00'), b = new Date(D.hasta + 'T12:00:00'), ult = new Date(b.getFullYear(), b.getMonth() + 1, 0).getDate();
  return a.getDate() === 1 && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear() && b.getDate() === ult ? 'mes' : 'rango';
}
const nochesAsc = () => D.noches.map(n => n.noche).reverse();
function fechaCtrl() {
  const m = modoActual(), el = $('#fecha-ctrl'); if (!el) return;
  const asc = nochesAsc(), i = asc.indexOf(D.desde);
  const mesSig = () => { const b = new Date(D.hasta + 'T12:00:00'); return isoD(new Date(b.getFullYear(), b.getMonth() + 1, 1)) > D.hoy; };
  const dis = { '-1': m === 'noche' ? i <= 0 : m === 'mes' ? D.desde <= (asc[0] || D.desde) : false, '1': m === 'noche' ? i < 0 || i >= asc.length - 1 : m === 'mes' ? mesSig() : D.hasta >= D.hoy };
  el.innerHTML = `<div class="modos" role="tablist" aria-label="Qué querés ver"><span class="ind"></span>${[['noche', 'Noche'], ['mes', 'Mes'], ['rango', 'Rango']].map(([k, n]) => `<button role="tab" data-m="${k}" class="${m === k ? 'on' : ''}" aria-selected="${m === k}">${n}</button>`).join('')}</div>
    <div class="paso-f"><button class="flecha" data-d="-1" aria-label="Anterior" ${dis['-1'] ? 'disabled' : ''}>‹</button><button class="fecha-lbl" id="fecha-lbl" aria-haspopup="dialog">${etiquetaRango()}<i></i></button><button class="flecha" data-d="1" aria-label="Siguiente" ${dis['1'] ? 'disabled' : ''}>›</button></div>
    <span class="vivo-c" ${enVivo() ? '' : 'hidden'}><span class="punto"></span>En vivo</span>`;
  requestAnimationFrame(() => moverIndicador($('.modos', el), $('.modos button.on', el), false));
  $$('.modos button', el).forEach(b => b.onclick = () => {
    const k = b.dataset.m; if (k === m && k !== 'rango') return;
    $$('.modos button', el).forEach(x => x.classList.toggle('on', x === b)); moverIndicador($('.modos', el), b, false);
    if (k === 'noche') { const n = [...asc].reverse().find(f => f <= D.hasta) || asc[asc.length - 1]; ir(n, n); }
    else if (k === 'mes') { const b2 = new Date(D.hasta + 'T12:00:00'); ir(isoD(new Date(b2.getFullYear(), b2.getMonth(), 1)), isoD(new Date(b2.getFullYear(), b2.getMonth() + 1, 0))); }
    else calendario('rango');
  });
  $$('.flecha', el).forEach(b => b.onclick = () => {
    const d = +b.dataset.d;
    if (m === 'noche') { const n = asc[i + d]; if (n) ir(n, n); }
    else if (m === 'mes') { const a = new Date(D.desde + 'T12:00:00'); ir(isoD(new Date(a.getFullYear(), a.getMonth() + d, 1)), isoD(new Date(a.getFullYear(), a.getMonth() + d + 1, 0))); }
    else { const dias = Math.round((new Date(D.hasta) - new Date(D.desde)) / 864e5) + 1; ir(diaMasC(D.desde, d * dias), diaMasC(D.hasta, d * dias)); }
  });
  $('#fecha-lbl', el).onclick = () => calendario(m);
}
const diaMasC = (f, d) => { const x = new Date(f + 'T12:00:00'); x.setDate(x.getDate() + d); return isoD(x); };
async function ir(desde, hasta) {
  rango = { desde, hasta }; $('#vista').classList.add('cargando');
  try { await cargar(); } finally { $('#vista').classList.toggle('cargando', false); }
  const badge = $('#nav a[data-s="inicio"] .badge'); if (badge) badge.textContent = alertas().length;
  fechaCtrl(); mostrar(seccion, true);
}

const esqueleto = () => `<div class="kpis">${'<div class="esq" style="height:130px"></div>'.repeat(4)}</div><div class="esq" style="height:320px"></div>`;

function mostrar(s, forzar = false) {
  if (!SECCIONES.some(([k]) => k === s)) s = 'inicio';
  if (s === seccion && !forzar && $('#vista').childElementCount) return;
  seccion = s; document.body.classList.toggle('lat-abierta', false);
  $$('#nav a').forEach(a => a.classList.toggle('on', a.dataset.s === s)); $('#fecha-ctrl').hidden = ['carta', 'happy', 'clientes'].includes(s);
  requestAnimationFrame(() => moverIndicador($('#nav'), $('#nav a.on')));
  $('#titulo').textContent = SECCIONES.find(([k]) => k === s)[1]; $('#subt').textContent = SUB[s]; $('#acc').innerHTML = '';
  const v = $('#vista'); v.classList.remove('entra'); void v.offsetWidth; v.classList.add('entra');
  ({ inicio: vInicio, carta: vCarta, ventas: vVentas, cierre: vCierre, happy: vHappy, clientes: vClientes })[s]();
  scrollTo({ top: 0 });
}

// En un rango se compara el promedio por noche: si el período anterior tuvo menos noches abiertas, el total engaña.
const delta = (a, b, corto, porNoche = true) => { if (!b) return ''; const na = (D.actual || {}).noches || 1, nb = (D.previo || {}).noches || 1;
  if (!D.unaNoche && porNoche) { a = a / na; b = b / nb; }
  const p = Math.round((a - b) / b * 100); return `<span class="delta ${p < 0 ? 'baja' : ''}" title="${D.unaNoche ? '' : 'Promedio por noche contra el período anterior'}">${p >= 0 ? '▲' : '▼'} ${Math.abs(p)}%${corto ? '' : ` ${D.unaNoche ? `vs ${fecha(D.antDesde)}` : 'por noche vs período anterior'}`}</span>`; };

// ---------- Inicio ----------
const ALERTA = {
  pico: { c: '#5B3FD1', cs: '#E4DCFF', i: '▲', ir: ['ventas', 'Ver horas'] },
  floja: { c: '#9A5B00', cs: '#FFF1D6', i: '◐', ir: ['happy', 'Armar happy hour'] },
  espera: { c: '#C4213F', cs: '#FFE0E5', i: '⏱', ir: ['ventas', 'Ver barras'] },
  margen: { c: '#0B8A57', cs: '#D9F5E8', i: '$', ir: ['carta', 'Ir a la carta'] },
  sugerencia: { c: '#5B3FD1', cs: '#E4DCFF', i: '+', ir: null },
};
function vInicio() {
  const a = D.actual || {}, b = D.previo || null;
  $('#vista').innerHTML = `<section class="kpis">
      <article class="kpi grande"><small>Facturación ${deLaNoche('de la noche', `· ${a.noches || 0} noche${a.noches === 1 ? '' : 's'}`)}</small><span class="v" id="k-fact">$0</span><div class="fila-d">${b ? delta(a.facturacion, b.facturacion) : ''}${!D.unaNoche && a.noches ? `<span class="prom">${mil(a.facturacion / a.noches)} por noche</span>` : ''}</div><div class="spark">${spark()}</div></article>
      <article class="kpi"><small>Pedidos</small><span class="v" id="k-ped">0</span>${b ? delta(a.pedidos, b.pedidos, true) : ''}</article>
      <article class="kpi"><small>Ticket promedio</small><span class="v" id="k-tick">$0</span>${b ? delta(a.ticket, b.ticket, true, false) : ''}</article>
      <article class="kpi"><small>Ganancia bruta</small><span class="v" id="k-gan">$0</span><span class="det">${a.facturacion ? Math.round(a.margen / a.facturacion * 100) : 0}% de lo vendido</span></article>
      <article class="kpi"><small>Espera promedio</small><span class="v" id="k-esp">–</span><span class="det">del pago a "listo"</span></article>
      <article class="kpi"><small>Clientes</small><span class="v" id="k-cli">0</span><span class="det">${a.clientes ? Math.round(a.recurrentes / a.clientes * 100) : 0}% ya había venido antes</span></article>
      <article class="kpi"><small>Sumó el shot sugerido</small><span class="v" id="k-sug">$0</span><span class="det">${a.ofrecidas ? Math.round(a.aceptadas / a.ofrecidas * 100) : 0}% lo aceptó</span></article>
    </section>
    ${alertas().length ? `<section class="alertas" data-n="${alertas().length}" aria-label="Alertas">${alertas().map((l, i) => { const t = ALERTA[l.tipo] || ALERTA.pico; return `<article class="alerta" style="--c:${t.c};--cs:${t.cs};--i:${i}"><i>${t.i}</i><div><b>${esc(l.titulo)}</b><p>${esc(l.texto)}</p>${t.ir ? `<a class="ir" href="#${t.ir[0]}">${t.ir[1]} <span>→</span></a>` : ''}</div></article>`; }).join('')}</section>` : ''}
    <div class="grid g-2">
      <section class="panel"><h2>Ventas por hora</h2><p class="bajada">Pasá el dedo o el mouse por una barra para ver el detalle.</p><div class="grafico" id="g-horas"></div></section>
      <section class="panel"><h2>Lo más vendido</h2><p class="bajada">Unidades ${deLaNoche('de la noche', 'del período')}.</p><div class="top5">${top5()}</div><a class="lnk" href="#ventas" style="display:inline-block;margin-top:10px">Ver todo →</a></section>
    </div>
    <div class="grid g-2i" style="margin-top:18px">
      <section class="panel"><h2>Últimos pedidos</h2><p class="bajada">${enVivo() ? 'Se actualiza solo.' : 'Los últimos del período.'}</p><div class="feed" id="feed">${D.ultimos.map(filaFeed).join('') || '<p class="vacio">Todavía no hay pedidos.</p>'}</div></section>
      <section class="panel"><h2>Barras</h2><p class="bajada">Cada pedido va a la barra menos cargada.</p><div class="barras-cmp">${barrasHTML()}</div></section>
    </div>`;
  numeros(); graficoHoras(); activarSpark();
}
function numeros(pulso = false) {
  const a = D.actual || {};
  const set = (id, v, f) => { const el = $('#' + id); if (!el) return; contar(el, v, f); if (pulso && +el.dataset.prev !== v) { const k = el.closest('.kpi'); k.classList.remove('pulso'); void k.offsetWidth; k.classList.add('pulso'); } el.dataset.prev = v; };
  const kf = $('#k-fact'); if (kf) { kf.dataset.fin = pesos(a.facturacion || 0); ajustar(kf, 74);
    // Se vuelve a medir cuando termina de cargar la letra y cada vez que cambia el ancho de la tarjeta
    document.fonts?.ready.then(() => ajustar(kf, 74));
    if (!kf._obs && 'ResizeObserver' in window) { kf._obs = new ResizeObserver(() => ajustar(kf, 74)); kf._obs.observe(kf.parentElement); } }
  set('k-fact', a.facturacion || 0, pesos); set('k-ped', a.pedidos || 0, n => Math.round(n).toLocaleString('es-AR')); set('k-tick', a.ticket || 0, pesos);
  set('k-gan', a.margen || 0, mil); set('k-cli', a.clientes || 0, n => Math.round(n)); set('k-sug', a.monto_sug || 0, mil);
  const e = $('#k-esp'); if (e) e.textContent = mmss(a.espera_seg) + ' min';
}
let sparkDatos = null;
// Al pasar el mouse (o el dedo) por el gráfico chico aparece el valor de esa hora; quieto no muestra nada.
function activarSpark() {
  const g = $('.spark-g'); if (!g || !sparkDatos) return;
  const { S, pts, W } = sparkDatos, dot = $('.pico', g), t = $('.pico-t', g);
  const ver = x => { const r = g.getBoundingClientRect(), k = Math.max(0, Math.min(1, (x - r.left) / r.width)), i = Math.round(k * (S.length - 1)), px = pts[i][0] / W * 100;
    dot.style.left = px + '%'; dot.style.top = pts[i][1] + 'px'; t.style.left = px + '%'; t.textContent = `${S[i].l} · ${mil(S[i].v)}`;
    t.style.transform = `translateX(${px < 18 ? '-6px' : px > 82 ? 'calc(-100% + 6px)' : '-50%'})`; g.classList.add('ver'); };
  g.onmousemove = e => ver(e.clientX); g.onmouseleave = () => g.classList.remove('ver');
  g.ontouchstart = g.ontouchmove = e => ver(e.touches[0].clientX); g.ontouchend = () => setTimeout(() => g.classList.remove('ver'), 1200);
}
// Gráfico de la tarjeta: una noche → facturación por hora; varias → facturación por noche. Con etiquetas y el pico marcado.
function spark() {
  const porNoche = !D.unaNoche && D.porNoche.length > 1;
  const S = porNoche ? D.porNoche.map(n => ({ v: n.facturacion, l: n.noche.slice(8) + '/' + n.noche.slice(5, 7), t: fecha(n.noche) })) : D.horas.map(h => ({ v: h.facturacion, l: String(h.hora).padStart(2, '0') + ' h' }));
  if (S.length < 2) return '';
  if (porNoche) { // varias noches: barras desde cero, una por noche, con su fecha
    const max = Math.max(...S.map(x => x.v)) || 1, ip = S.findIndex(x => x.v === max);
    return `<div class="spark-t">Facturación por noche</div><div class="barras-n" style="--n:${S.length}">${S.map((x, i) => `<div class="bn ${i === ip ? 'top' : ''}" title="${x.t}: ${pesos(x.v)}"><span class="bv">${mil(x.v)}</span><i style="height:${Math.max(4, x.v / max * 100)}%;animation-delay:${i * 60}ms"></i><span class="bl">${S.length <= 10 ? x.l : ''}</span></div>`).join('')}</div>`;
  }
  const W = 300, h = 74, top = 16, max = Math.max(...S.map(x => x.v)) || 1;
  const pts = S.map((x, i) => [i / (S.length - 1) * W, top + (h - top - 4) * (1 - x.v / max)]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('');
  sparkDatos = { S, pts, W };
  return `<div class="spark-t">${porNoche ? 'Facturación por noche' : 'Facturación por hora'}</div>
    <div class="spark-g"><svg viewBox="0 0 ${W} ${h}" preserveAspectRatio="none" width="100%" height="${h}" aria-label="${porNoche ? 'Facturación por noche' : 'Facturación por hora'}"><defs><linearGradient id="gr" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#9B7BFF" stop-opacity=".35"/><stop offset="1" stop-color="#9B7BFF" stop-opacity="0"/></linearGradient></defs>
    <path class="area" d="${d}L${W} ${h}L0 ${h}Z"/><path d="${d}" style="--l:${W * 2}"/></svg>
    <span class="pico"></span><span class="pico-t"></span></div>
    <div class="spark-ejes"><span>${S[0].l}</span><span>${S[S.length - 1].l}</span></div>`;
}
const imgProd = p => p.foto ? `<img src="${p.foto}" alt="" onerror="this.replaceWith(document.createRange().createContextualFragment(vaso('${p.vaso}','${p.color}')))">` : vaso(p.vaso, p.color);
function top5() {
  const P = D.productos.slice(0, 5); if (!P.length) return '<p class="vacio">Sin ventas.</p>';
  const max = P[0].unidades;
  return P.map((p, i) => `<div class="f"><span class="bolita">${imgProd(p)}</span><b>${esc(p.nombre)}</b><span>${p.unidades}</span><div class="pista"><i style="width:${p.unidades / max * 100}%;animation-delay:${i * 60}ms"></i></div></div>`).join('');
}
function graficoHoras() {
  const H = D.horas, el = $('#g-horas'); if (!el) return; if (!H.length) { el.innerHTML = '<p class="vacio">Sin ventas en ese período.</p>'; return; }
  const W = 760, Hh = 260, m = { t: 26, r: 8, b: 28, l: 56 };
  const max = Math.max(...H.map(h => h.facturacion)); const paso = max > 4e6 ? 1e6 : max > 2e6 ? 5e5 : max > 4e5 ? 2e5 : 5e4; const top = Math.ceil(max / paso) * paso || 1;
  const bw = (W - m.l - m.r) / H.length, y = v => m.t + (Hh - m.t - m.b) * (1 - v / top);
  const hh = D.happy; const enHH = h => { if (!hh.activo) return false; const a = +hh.desde.slice(0, 2), b = +hh.hasta.slice(0, 2) + (+hh.hasta.slice(3) > 0 ? 1 : 0); return a <= b ? h >= a && h < b : h >= a || h < b; };
  const pico = H.reduce((a, b) => b.facturacion > a.facturacion ? b : a);
  let s = `<svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Facturación por hora"><defs><linearGradient id="bv" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#C4B5FD"/><stop offset="1" stop-color="#7C5CFF" stop-opacity=".75"/></linearGradient><pattern id="rayas" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#FFF1D6"/><path d="M0 0v8" stroke="#F3D49B" stroke-width="3"/></pattern></defs>`;
  H.forEach((h, i) => { if (enHH(h.hora)) s += `<rect x="${m.l + i * bw}" y="${m.t - 16}" width="${bw}" height="${Hh - m.t - m.b + 16}" fill="url(#rayas)"/>`; });
  for (let v = 0; v <= top; v += paso) s += `<line x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(26,23,38,${v ? .08 : .3})"/><text class="eje" x="${m.l - 8}" y="${y(v) + 4}" text-anchor="end">${mil(v)}</text>`;
  H.forEach((h, i) => {
    const x = m.l + i * bw + 3, w = bw - 6, yy = y(h.facturacion), alto = Math.max(0, y(0) - yy);
    s += `<path class="barra-h" data-i="${i}" style="--i:${i}" d="M${x} ${y(0)}V${yy + Math.min(4, alto)}q0 -4 4 -4h${w - 8}q4 0 4 4V${y(0)}z"/>`;
    s += `<rect data-i="${i}" class="hit" x="${m.l + i * bw}" y="${m.t - 16}" width="${bw}" height="${Hh - m.t - m.b + 16}" fill="transparent"/>`;
    s += `<text class="eje" x="${x + w / 2}" y="${Hh - 8}" text-anchor="middle">${String(h.hora).padStart(2, '0')} h</text>`;
  });
  const ip = H.indexOf(pico); s += `<text class="rot" x="${m.l + ip * bw + bw / 2}" y="${y(pico.facturacion) - 8}" text-anchor="middle">${mil(pico.facturacion)}</text></svg><div class="tip"></div>`;
  el.innerHTML = s + `<div class="leyenda"><span><i style="background:var(--marca)"></i>Facturación de la hora</span>${hh.activo ? `<span><i style="background:repeating-linear-gradient(45deg,#F3D49B 0 3px,#FFF1D6 3px 6px)"></i>Happy hour (${hh.desde} a ${hh.hasta})</span>` : ''}</div>`;
  const tip = $('.tip', el), svg = $('svg', el);
  const ver = r => { const h = H[+r.dataset.i]; const k = svg.getBoundingClientRect().width / W;
    $$('.barra-h', el).forEach(b => b.classList.toggle('dim', b.dataset.i !== r.dataset.i));
    tip.innerHTML = `<b>${String(h.hora).padStart(2, '0')}:00 a ${String((h.hora + 1) % 24).padStart(2, '0')}:00</b><br>${pesos(h.facturacion)} · ${h.pedidos} pedidos<br>Espera media ${mmss(h.espera_seg)} min`;
    tip.style.left = (m.l + (+r.dataset.i + .5) * bw) * k + 'px'; tip.style.top = y(h.facturacion) * k + 'px'; tip.style.opacity = 1; };
  const fuera = () => { tip.style.opacity = 0; $$('.barra-h', el).forEach(b => b.classList.remove('dim')); };
  $$('.hit', el).forEach(r => { r.onmouseenter = () => ver(r); r.onmouseleave = fuera; r.ontouchstart = () => ver(r); });
  svg.onmouseleave = fuera;
}
function barrasHTML() {
  const max = Math.max(1, ...D.barras.map(b => b.facturacion));
  return D.barras.map(b => `<div class="b"><strong>${esc(b.nombre)}</strong><span>${pesos(b.facturacion)}</span><div class="pista"><i style="width:${b.facturacion / max * 100}%"></i></div>
    <small>${b.pedidos} pedidos · espera media ${mmss(b.espera_seg)} min</small></div>`).join('');
}
const filaFeed = (p, nuevo) => `<div class="${nuevo === true ? 'nuevo' : ''}"><b>${p.turno}</b><span>${esc(p.nombre)} · ${p.items.map(i => `${i.cantidad} ${esc(i.nombre)}`).join(', ')}<br><small>${new Date(p.pagado).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} · ${{ pagado: 'en cola', preparando: 'armando', listo: 'para retirar', entregado: 'entregado' }[p.estado] || p.estado}</small></span><strong>${pesos(p.total)}</strong></div>`;

// ---------- Ventas ----------
function vVentas() {
  const P = D.productos, max = Math.max(1, ...P.map(p => p.unidades));
  $('#vista').innerHTML = `<section class="panel"><h2>Ventas por hora</h2><p class="bajada">Facturación de cada hora${D.unaNoche ? ' de la noche' : ', sumando todas las noches del período'}.</p><div class="grafico" id="g-horas"></div></section>
    <div class="grid g-2" style="margin-top:18px">
      <section class="panel"><h2>Qué se vende</h2><p class="bajada">Ordenado por unidades. La ganancia ya descuenta el costo.</p><div style="overflow-x:auto">${P.length ? `<table><thead><tr><th>Producto</th><th class="n">Unidades</th><th class="ocultable" style="width:24%"></th><th class="n">Facturó</th><th class="n ocultable">Ganancia</th></tr></thead><tbody>
        ${P.map((p, i) => `<tr><td class="prod"><span class="bolita">${imgProd(p)}</span>${esc(p.nombre)}</td><td class="n num" style="font-size:1.1rem">${p.unidades}</td><td class="ocultable"><div class="barrita" style="width:${p.unidades / max * 100}%;animation-delay:${i * 30}ms"></div></td><td class="n">${pesos(p.facturacion)}</td><td class="n ocultable">${pesos(p.margen)} <span class="mrg">${Math.round(p.margen / Math.max(1, p.facturacion) * 100)}%</span></td></tr>`).join('')}</tbody></table>` : '<p class="vacio">Sin ventas en ese período.</p>'}</div></section>
      <div class="grid" style="align-content:start"><section class="panel"><h2>Barras</h2><p class="bajada">Pedidos y espera por barra.</p><div class="barras-cmp">${barrasHTML()}</div></section>
      <section class="panel"><h2>Últimos pedidos</h2><div class="feed" id="feed" style="margin-top:12px">${D.ultimos.map(filaFeed).join('') || '<p class="vacio">Todavía no hay pedidos.</p>'}</div></section></div>
    </div>`;
  graficoHoras();
}

// ---------- Cierre de caja ----------
function vCierre() {
  const a = D.actual || {}, b = D.previo;
  $('#acc').innerHTML = '<button class="btn-t sec ocultable-m" onclick="print()">Imprimir</button>';
  $('#vista').innerHTML = `<div class="cierre-wrap"><article class="cierre" aria-label="Cierre de caja">
    <div class="titulo">Cierre de caja</div><div class="sub2">${etiquetaRango()}${D.unaNoche ? ' · 23 h a 7 h' : ` · ${(D.actual || {}).noches || 0} noches`}</div>
    <div class="grande"><small>Facturación</small><b>${pesos(a.facturacion)}</b>${b ? delta(a.facturacion, b.facturacion) : ''}</div>
    <dl><dt>Pedidos</dt><dd>${(a.pedidos || 0).toLocaleString('es-AR')}</dd><dt>Ticket promedio</dt><dd>${pesos(a.ticket)}</dd>
      <dt>Unidades vendidas</dt><dd>${(a.unidades || 0).toLocaleString('es-AR')}</dd><dt>Ganancia bruta</dt><dd>${pesos(a.margen)}<small>${a.facturacion ? Math.round(a.margen / a.facturacion * 100) : 0}% de lo vendido</small></dd><hr>
      <dt>Espera promedio</dt><dd>${mmss(a.espera_seg)} min</dd><dt>Shot sugerido</dt><dd>${a.ofrecidas ? Math.round(a.aceptadas / a.ofrecidas * 100) : 0}% aceptó<small>+${pesos(a.monto_sug)}</small></dd>
      <dt>Rondas repetidas</dt><dd>${a.repetidos || 0}</dd><dt>Descuentos</dt><dd>−${pesos(a.descuentos)}<small>happy, shot y bienvenida</small></dd><hr>
      <dt>Clientes</dt><dd>${a.clientes || 0}</dd><dt>Volvieron de otra noche</dt><dd>${a.recurrentes || 0}</dd><dt>Efectivo en barra</dt><dd>$0</dd></dl>
    <div class="pie">Todo cobrado por la app.<br>Sin diferencias de caja.</div></article>
    <section class="panel"><h2>Por barra</h2><p class="bajada">Lo que cobró cada barra en ${D.unaNoche ? 'la noche' : 'el período'}.</p><div class="barras-cmp">${barrasHTML()}</div></section></div>`;
}

// ---------- Happy hour ----------
function vHappy() {
  const h = D.happy;
  $('#vista').innerHTML = `<div class="grid g-2"><section class="panel"><h2>Happy hour automático</h2><p class="bajada">Baja el precio de los tragos solo, en el horario que elijas, para llenar la barra en las horas flojas.</p>
    <div class="hh"><label class="sw"><input type="checkbox" id="hh-on" ${h.activo ? 'checked' : ''}> Activado</label>
    <div class="fila"><label>Desde<input type="time" id="hh-d" value="${h.desde}"></label><label>Hasta<input type="time" id="hh-h" value="${h.hasta}"></label><label>Descuento %<input type="number" id="hh-p" min="5" max="60" value="${h.porcentaje}"></label></div>
    <div class="estado-hh ${h.vigente ? 'on' : ''}" id="hh-est">${h.vigente ? `Activo ahora: los tragos tienen ${h.porcentaje}% menos en la app.` : h.activo ? `Se activa solo de ${h.desde} a ${h.hasta} en tragos.` : 'Apagado.'}</div>
    <div class="fila"><button class="btn-t" id="hh-ok">Guardar</button><button class="btn-t sec" id="hh-ya">${h.forzado ? 'Volver al horario' : 'Activar ahora'}</button></div></div></section>
    <section class="panel"><h2>Cómo rindió</h2><p class="bajada">La franja rayada es el happy hour.</p><div class="grafico" id="g-horas"></div></section></div>`;
  graficoHoras();
  const enviar = async (forzado, btn) => { btn.disabled = true; try { D.happy = await api('/api/dueno/happy', { method: 'POST', body: JSON.stringify({ activo: $('#hh-on').checked, desde: $('#hh-d').value, hasta: $('#hh-h').value, porcentaje: $('#hh-p').value, forzado }) }); aviso(D.happy.vigente ? 'Happy hour activo en la app' : 'Happy hour guardado'); vHappy(); } catch (e) { aviso(e.message); btn.disabled = false; } };
  $('#hh-ok').onclick = e => enviar(D.happy.forzado, e.currentTarget);
  $('#hh-ya').onclick = e => { if (!D.happy.forzado) $('#hh-on').checked = true; enviar(!D.happy.forzado, e.currentTarget); };
}

// ---------- Clientes: CRM ----------
const SEG = {
  vip: { n: 'VIP', c: '#5B3FD1', bg: '#E4DCFF', d: 'El 10 % que más gasta y vino más de una vez.' },
  fiel: { n: 'Fieles', c: '#0B8A57', bg: '#D9F5E8', d: 'Vinieron 3 noches o más y siguen viniendo.' },
  nuevo: { n: 'Nuevos', c: '#2563C9', bg: '#DCE8FF', d: 'Vinieron por primera vez la última semana.' },
  riesgo: { n: 'En riesgo', c: '#C4213F', bg: '#FFE0E5', d: 'Venían seguido y hace 2 semanas o más que no vienen.' },
  dormido: { n: 'Dormidos', c: '#6B6577', bg: '#ECE8F0', d: 'Vinieron una vez y no volvieron en 2 semanas o más.' },
  ocasional: { n: 'Ocasionales', c: '#9A5B00', bg: '#FFF1D6', d: 'Vienen de vez en cuando.' },
};
let crmD = null, crmSeg = 'todos', crmOrden = 'gastado', crmQ = '', crmVer = 40;
const hace = d => d <= 0 ? 'en la última noche' : d < 7 ? `hace ${d} días` : d < 14 ? 'hace 1 semana' : `hace ${Math.floor(d / 7)} semanas`;
const intl = c => c.contacto.length === 10 ? '549' + c.contacto : c.contacto; // celulares viejos guardados sin 549
const contactoTxt = c => c.tipo === 'celular' ? intl(c).replace(/^549(\d{3})(\d{3})(\d{4})$/, '$1 $2-$3') : c.contacto;
const iniciales = n => esc((n || '?').trim().split(/\s+/).map(x => x[0]).join('').slice(0, 2).toUpperCase());
async function vClientes() {
  $('#acc').innerHTML = `<a class="btn-t sec ocultable-m" href="/api/dueno/clientes.csv?pin=${encodeURIComponent(pin)}" download>Descargar todos</a>`;
  if (!crmD) $('#vista').innerHTML = '<div class="kpis">' + '<div class="esq" style="height:96px"></div>'.repeat(4) + '</div><div class="esq" style="height:420px"></div>';
  try { crmD = await api('/api/dueno/crm'); } catch (e) { $('#vista').innerHTML = `<p class="vacio">${esc(e.message)}</p>`; return; }
  if (seccion !== 'clientes') return;
  const C = crmD.clientes, total = C.reduce((s, c) => s + c.gastado, 0) || 1;
  const cuenta = k => C.filter(c => c.segmento === k);
  const suma = L => L.reduce((s, c) => s + c.gastado, 0);
  const vip = cuenta('vip'), riesgo = cuenta('riesgo'), nuevos = cuenta('nuevo'), dormidos = cuenta('dormido');
  // Lo inteligente: qué hacer con cada grupo, con números reales de la base
  const ideas = [];
  if (vip.length) ideas.push({ s: 'vip', t: `${vip.length} VIP dejan el ${Math.round(suma(vip) / total * 100)} % de la plata`, x: 'Cuidalos primero: avisales la próxima fecha antes que a nadie o guardales un balde.' });
  if (riesgo.length) ideas.push({ s: 'riesgo', t: `${riesgo.length} clientes habituales dejaron de venir`, x: `Gastaban ${mil(suma(riesgo) / riesgo.length)} cada uno en total. Mandales una invitación esta semana, antes de que se acostumbren a otro lugar.` });
  if (nuevos.length) ideas.push({ s: 'nuevo', t: `${nuevos.length} vinieron por primera vez`, x: 'Escribiles en los próximos días con la próxima fecha, mientras se acuerdan de la noche.' });
  if (!ideas.length && dormidos.length) ideas.push({ s: 'dormido', t: `${dormidos.length} vinieron una vez y no volvieron`, x: 'Probá una promo de vuelta para ellos.' });
  $('#vista').innerHTML = `
    <section class="segs" id="segs"><span class="ind"></span>
      <button class="seg-c" data-s="todos"><small>Todos</small><b>${C.length.toLocaleString('es-AR')}</b><span>${mil(total)} en total</span></button>
      ${Object.entries(SEG).map(([k, v]) => { const L = cuenta(k); return `<button class="seg-c" data-s="${k}" style="--c:${v.c};--bg:${v.bg}" title="${esc(v.d)}"><small><i></i>${v.n}</small><b>${L.length.toLocaleString('es-AR')}</b><span>${Math.round(suma(L) / total * 100)}% de la plata</span></button>`; }).join('')}
    </section>
    ${ideas.length ? `<section class="ideas">${ideas.map((d, i) => `<article class="idea" style="--c:${SEG[d.s].c};--bg:${SEG[d.s].bg};--i:${i}"><div><b>${esc(d.t)}</b><p>${esc(d.x)}</p></div>
      <div class="idea-acc"><button class="lnk" data-ver="${d.s}">Ver quiénes</button><a class="btn-t" href="/api/dueno/clientes.csv?pin=${encodeURIComponent(pin)}&seg=${d.s}" download>Descargar lista</a></div></article>`).join('')}</section>` : ''}
    <section class="panel crm">
      <div class="herr"><label class="buscar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="crm-q" placeholder="Buscar por nombre, celular o mail" value="${esc(crmQ)}" aria-label="Buscar cliente"></label>
        <label class="orden">Ordenar<select id="crm-o"><option value="gastado">Más gastaron</option><option value="noches">Más vinieron</option><option value="ultima">Vinieron hace poco</option><option value="ausencia">Más tiempo sin venir</option><option value="ticket">Ticket más alto</option></select></label>
        <span class="crm-n" id="crm-n"></span></div>
      <div id="crm-lista"></div></section>
    <section class="arm"><div class="arm-cab"><h2>Automático</h2><span class="pronto">Próximamente</span></div>
      <p class="bajada">Mensajes que se mandan solos según lo que hace cada cliente. Los dejamos preparados para activarlos cuando conectes WhatsApp o mail.</p>
      <div class="arm-g">${[['riesgo', 'Volvé a invitar', 'A quien venía seguido y no viene hace 3 semanas, con la próxima fecha.'], ['nuevo', 'Gracias por venir', 'Al día siguiente de su primera noche, con un shot para la próxima.'], ['vip', 'Preventa VIP', 'Los VIP se enteran de cada fecha un día antes que el resto.']].map(([k, t, x]) => `<div class="arm-c"><span class="punto-s" style="background:${SEG[k].c}"></span><div><b>${t}</b><p>${x}</p></div><label class="sw" title="Disponible cuando conectes WhatsApp o mail"><input type="checkbox" disabled aria-label="${t}"></label></div>`).join('')}</div></section>`;
  $('#crm-o').value = crmOrden;
  const segs = $('#segs');
  const elegir = (k, mover = true) => { crmSeg = k; crmVer = 40; $$('.seg-c', segs).forEach(b => b.classList.toggle('on', b.dataset.s === k)); if (mover) moverSeg(); listaCrm(); };
  const moverSeg = () => { const b = $('.seg-c.on', segs), ind = $('.ind', segs); if (!b) return; ind.style.transform = `translate(${b.offsetLeft}px,${b.offsetTop}px)`; ind.style.width = b.offsetWidth + 'px'; ind.style.height = b.offsetHeight + 'px'; ind.style.setProperty('--c', b.style.getPropertyValue('--c') || 'var(--tinta)'); };
  $$('.seg-c', segs).forEach(b => b.onclick = () => elegir(b.dataset.s));
  $$('[data-ver]').forEach(b => b.onclick = () => { elegir(b.dataset.ver); $('.crm').scrollIntoView({ behavior: QUIETO ? 'auto' : 'smooth', block: 'start' }); });
  $('#crm-q').oninput = e => { crmQ = e.target.value; crmVer = 40; listaCrm(); };
  $('#crm-o').onchange = e => { crmOrden = e.target.value; listaCrm(); };
  elegir(crmSeg, false); requestAnimationFrame(moverSeg);
  addEventListener('resize', moverSeg, { once: true });
}
function listaCrm() {
  const norm = t => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const q = norm(crmQ.trim()), qd = crmQ.replace(/\D/g, '');
  let L = crmD.clientes.filter(c => (crmSeg === 'todos' || c.segmento === crmSeg) && (!q || norm(c.nombre).includes(q) || norm(c.contacto).includes(q) || (qd.length > 2 && c.contacto.includes(qd))));
  const ord = { gastado: (a, b) => b.gastado - a.gastado, noches: (a, b) => b.noches - a.noches || b.gastado - a.gastado, ultima: (a, b) => a.ausencia - b.ausencia || b.gastado - a.gastado, ausencia: (a, b) => b.ausencia - a.ausencia || b.gastado - a.gastado, ticket: (a, b) => b.ticket - a.ticket }[crmOrden];
  L = [...L].sort(ord);
  $('#crm-n').textContent = `${L.length.toLocaleString('es-AR')} cliente${L.length === 1 ? '' : 's'}`;
  const ver = L.slice(0, crmVer), maxG = Math.max(1, ...crmD.clientes.map(c => c.gastado));
  $('#crm-lista').innerHTML = L.length ? `<table class="tabla-crm"><thead><tr><th>Cliente</th><th>Grupo</th><th class="n">Noches</th><th class="n">Gastó</th><th class="n ocultable">Ticket</th><th class="ocultable">Favorito</th><th class="ocultable">Última vez</th></tr></thead><tbody>
    ${ver.map((c, i) => { const g = SEG[c.segmento]; return `<tr data-c="${esc(c.contacto)}" tabindex="0" style="--i:${Math.min(i, 20)}"><td class="cli"><span class="av" style="background:${g.bg};color:${g.c}">${iniciales(c.nombre)}</span><span>${esc(c.nombre)}<small>${esc(contactoTxt(c))}${c.avisos ? ' · <em title="Acepta avisos">acepta avisos</em>' : ''}</small></span></td>
      <td><span class="chip-s" style="--c:${g.c};--bg:${g.bg}">${g.n}</span></td><td class="n num" style="font-size:1.1rem">${c.noches}</td>
      <td class="n"><b>${pesos(c.gastado)}</b><span class="mini-b"><i style="width:${c.gastado / maxG * 100}%"></i></span></td><td class="n ocultable">${pesos(c.ticket)}</td>
      <td class="ocultable">${esc(c.favorito || '–')}</td><td class="ocultable">${hace(c.ausencia)}</td></tr>`; }).join('')}</tbody></table>
    ${L.length > crmVer ? `<button class="btn-t sec mas-c" id="crm-mas">Ver ${Math.min(40, L.length - crmVer)} más</button>` : ''}`
    : `<p class="vacio">${crmQ ? `No hay nadie que coincida con “${esc(crmQ)}”.` : 'Nadie en este grupo todavía.'}</p>`;
  $('#crm-mas')?.addEventListener('click', () => { crmVer += 40; listaCrm(); });
  $$('#crm-lista tr[data-c]').forEach(tr => { tr.onclick = () => ficha(crmD.clientes.find(c => c.contacto === tr.dataset.c)); tr.onkeydown = e => e.key === 'Enter' && tr.click(); });
}
async function ficha(c) {
  const g = SEG[c.segmento];
  const fondo = document.createElement('div'); fondo.className = 'cajon-v';
  const caj = document.createElement('aside'); caj.className = 'cajon'; caj.setAttribute('role', 'dialog'); caj.setAttribute('aria-label', `Ficha de ${c.nombre}`);
  caj.innerHTML = `<button class="x-c" aria-label="Cerrar">×</button>
    <div class="f-cab"><span class="av grande" style="background:${g.bg};color:${g.c}">${iniciales(c.nombre)}</span><div><h3>${esc(c.nombre)}</h3><p>${esc(contactoTxt(c))}</p><span class="chip-s" style="--c:${g.c};--bg:${g.bg}">${g.n}</span></div></div>
    <p class="f-seg">${esc(g.d)}</p>
    <div class="f-kpis"><div><small>Noches</small><b>${c.noches}</b></div><div><small>Gastó</small><b>${mil(c.gastado)}</b></div><div><small>Ticket</small><b>${mil(c.ticket)}</b></div><div><small>Pedidos</small><b>${c.pedidos}</b></div></div>
    <div class="f-acc">${c.tipo === 'celular' ? `<a class="btn-t" href="https://wa.me/${intl(c)}" target="_blank" rel="noopener">Escribir por WhatsApp</a>` : `<a class="btn-t" href="mailto:${esc(c.contacto)}">Mandar mail</a>`}<button class="btn-t sec" id="f-copiar">Copiar ${c.tipo === 'celular' ? 'celular' : 'mail'}</button></div>
    ${c.avisos ? '' : '<p class="f-nota">No aceptó recibir avisos: escribile sólo si él te escribió antes.</p>'}
    <div id="f-det"><div class="esq" style="height:180px;margin-top:16px"></div></div>`;
  document.body.append(fondo, caj); document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => { fondo.classList.add('on'); caj.classList.add('on'); });
  const cerrar = () => { fondo.classList.remove('on'); caj.classList.remove('on'); document.removeEventListener('keydown', tecla); setTimeout(() => { fondo.remove(); caj.remove(); document.body.style.overflow = ''; }, 300); };
  const tecla = e => e.key === 'Escape' && cerrar();
  document.addEventListener('keydown', tecla); fondo.onclick = cerrar; $('.x-c', caj).onclick = cerrar;
  $('#f-copiar', caj).onclick = async e => { try { await navigator.clipboard.writeText(c.tipo === 'celular' ? '+' + intl(c) : c.contacto); e.target.textContent = 'Copiado ✓'; setTimeout(() => e.target.textContent = `Copiar ${c.tipo === 'celular' ? 'celular' : 'mail'}`, 1400); } catch { aviso('No se pudo copiar.'); } };
  try {
    const f = await api('/api/dueno/crm/ficha?c=' + encodeURIComponent(c.contacto));
    const maxN = Math.max(1, ...f.noches.map(n => n.total));
    $('#f-det', caj).innerHTML = `${f.hora_habitual != null ? `<p class="f-hora">Suele pedir a las <b>${String(f.hora_habitual).padStart(2, '0')} h</b>${c.favorito ? ` y lo que más pide es <b>${esc(c.favorito)}</b>` : ''}.</p>` : ''}
      <h4>Lo que más toma</h4><div class="f-tragos">${f.tragos.map(t => `<span>${esc(t.nombre)} <b>×${t.n}</b></span>`).join('')}</div>
      <h4>Sus noches</h4><div class="f-noches">${f.noches.map((n, i) => `<div style="--i:${i}"><span>${fecha(n.noche)}</span><span class="mini-b"><i style="width:${n.total / maxN * 100}%"></i></span><b>${pesos(n.total)}</b></div>`).join('')}</div>`;
  } catch (e) { $('#f-det', caj).innerHTML = `<p class="vacio">${esc(e.message)}</p>`; }
}

// ---------- Calendario ----------
function calendario(modo = 'rango') {
  document.body.classList.toggle('lat-abierta', false);
  $('.cal')?.remove(); $('.cal-v')?.remove();
  const conDatos = Object.fromEntries(D.noches.map(n => [n.noche, n]));
  let sel = { desde: D.desde, hasta: D.hasta }, eligiendo = false, hover = null;
  let mes = new Date(D.hasta + 'T12:00:00'); mes.setDate(1);
  const hoy = D.hoy, primera = D.noches[D.noches.length - 1]?.noche || hoy;
  const pop = document.createElement('div'); pop.className = 'cal cal-' + modo; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'Elegir fechas');
  const fondo = document.createElement('div'); fondo.className = 'cal-v';
  const presets = () => {
    const h = new Date(hoy + 'T12:00:00'), y = h.getFullYear(), m = h.getMonth();
    return [['Últimos 7 días', isoD(new Date(y, m, h.getDate() - 6)), hoy], ['Últimos 30 días', isoD(new Date(y, m, h.getDate() - 29)), hoy], ['Mes pasado', isoD(new Date(y, m - 1, 1)), isoD(new Date(y, m, 0))], ['Todo', primera, hoy]];
  };
  const resumen = () => {
    const [a, b] = [sel.desde, eligiendo && hover ? hover : sel.hasta].sort(); const N = D.noches.filter(n => n.noche >= a && n.noche <= b);
    const f = N.reduce((s, n) => s + n.facturacion, 0);
    return `<b>${etiquetaRango({ desde: a, hasta: b })}</b><span>${N.length ? `${N.length} noche${N.length > 1 ? 's' : ''} con ventas · ${mil(f)}` : 'Sin ventas en esas fechas'}</span>`;
  };
  const grilla = () => {
    const y = mes.getFullYear(), m = mes.getMonth(), dias = new Date(y, m + 1, 0).getDate(), off = (new Date(y, m, 1).getDay() + 6) % 7;
    const fin = eligiendo && hover ? hover : sel.hasta, [a, b] = [sel.desde, fin].sort();
    let c = '<span></span>'.repeat(off);
    for (let d = 1; d <= dias; d++) {
      const f = isoD(new Date(y, m, d)), dato = conDatos[f];
      const no = f > hoy || (modo === 'noche' && !dato);
      const cls = modo === 'noche' ? [f === D.desde && 'ini fin', f === hoy && 'hoy', dato && 'datos'] : [f === a && 'ini', f === b && 'fin', f > a && f < b && 'medio', f === hoy && 'hoy', dato && 'datos'];
      c += `<button data-f="${f}" class="${cls.filter(Boolean).join(' ')}" ${no ? 'disabled' : ''} title="${dato ? `${pesos(dato.facturacion)} · ${dato.pedidos} pedidos` : 'Sin ventas'}">${d}</button>`;
    }
    const sigNo = new Date(y, m + 1, 1) > new Date(hoy + 'T12:00:00');
    return `<div class="cal-nav"><button data-mm="-1" aria-label="Mes anterior">‹</button><span class="cal-tit">${mes.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</span><button data-mm="1" aria-label="Mes siguiente" ${sigNo ? 'disabled' : ''}>›</button></div>
      <div class="cal-sem">${['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'].map(x => `<span>${x}</span>`).join('')}</div><div class="cal-dias">${c}</div>`;
  };
  const meses = () => {
    const L = {}; D.noches.forEach(n => { const k = n.noche.slice(0, 7); (L[k] = L[k] || { f: 0, n: 0 }); L[k].f += n.facturacion; L[k].n++; });
    const k0 = hoy.slice(0, 7); if (!L[k0]) L[k0] = { f: 0, n: 0 };
    return `<div class="cal-meses">${Object.keys(L).sort().reverse().map(k => { const d = new Date(k + '-15T12:00:00'); const on = D.desde === k + '-01' && modoActual() === 'mes';
      return `<button data-mes="${k}" class="${on ? 'on' : ''}"><b>${d.toLocaleDateString('es-AR', { month: 'long' }).replace(/^./, c => c.toUpperCase())}</b><span>${d.getFullYear()}</span><em>${L[k].n ? `${L[k].n} noche${L[k].n > 1 ? 's' : ''} · ${mil(L[k].f)}` : 'Sin ventas todavía'}</em></button>`; }).join('')}</div>`;
  };
  const pintar = () => {
    if (modo === 'mes') pop.innerHTML = `<div class="cal-cab"><b>Elegí un mes</b><span>Se ven todas sus noches juntas.</span></div>${meses()}`;
    else if (modo === 'noche') pop.innerHTML = `<div class="cal-cab"><b>Elegí una noche</b><span>Un toque y listo. Sólo se pueden elegir las noches que abriste.</span></div><div class="cal-mes">${grilla()}</div>`;
    else pop.innerHTML = `<div class="cal-pre">${presets().map(([n, d, h]) => `<button data-d="${d}" data-h="${h}" class="${D.desde === d && D.hasta === h ? 'on' : ''}">${n}</button>`).join('')}</div>
      <div class="cal-mes">${grilla()}<p class="cal-ayuda">${eligiendo ? 'Ahora tocá el último día.' : 'Tocá el primer día y después el último.'}</p></div>
      <div class="cal-pie"><div class="cal-res">${resumen()}</div><div class="botones"><button class="btn-t sec" data-cerrar>Cancelar</button><button class="btn-t" id="cal-ok" ${eligiendo ? 'disabled' : ''}>Ver</button></div></div>`;
    $$('[data-mm]', pop).forEach(b => b.onclick = () => { mes.setMonth(mes.getMonth() + +b.dataset.mm); pintar(); });
    $$('[data-mes]', pop).forEach(b => b.onclick = () => { const [y, m] = b.dataset.mes.split('-').map(Number); aplicar(isoD(new Date(y, m - 1, 1)), isoD(new Date(y, m, 0))); });
    $$('.cal-pre button', pop).forEach(b => b.onclick = () => aplicar(b.dataset.d, b.dataset.h));
    $$('.cal-dias button', pop).forEach(b => {
      b.onclick = () => { const f = b.dataset.f;
        if (modo === 'noche') return aplicar(f, f);
        if (!eligiendo) { sel = { desde: f, hasta: f }; eligiendo = true; } else { [sel.desde, sel.hasta] = [sel.desde, f].sort(); eligiendo = false; } pintar(); };
      b.onmouseenter = () => { if (eligiendo) { hover = b.dataset.f; const [a, z] = [sel.desde, hover].sort(); $$('.cal-dias button', pop).forEach(x => { const f = x.dataset.f; x.classList.toggle('ini', f === a); x.classList.toggle('fin', f === z); x.classList.toggle('medio', f > a && f < z); }); $('.cal-res', pop).innerHTML = resumen(); } };
    });
    $('[data-cerrar]', pop)?.addEventListener('click', cerrar); $('#cal-ok', pop)?.addEventListener('click', () => aplicar(...[sel.desde, sel.hasta].sort()));
  };
  const cerrar = () => { pop.classList.toggle('on', false); fondo.classList.toggle('on', false); document.removeEventListener('keydown', tecla); setTimeout(() => { pop.remove(); fondo.remove(); }, 220); };
  const tecla = e => e.key === 'Escape' && cerrar();
  const aplicar = (a, b) => { cerrar(); ir(a, b); };
  document.body.append(fondo, pop); document.addEventListener('keydown', tecla); fondo.onclick = cerrar;
  pintar();
  // Se abre pegado al botón de la fecha (en el celular sale desde abajo)
  const ancla = $('#fecha-lbl'); if (ancla && innerWidth > 900) { const r = ancla.getBoundingClientRect(); pop.style.top = r.bottom + 10 + 'px'; pop.style.left = Math.max(12, Math.min(innerWidth - pop.offsetWidth - 12, r.left + r.width / 2 - pop.offsetWidth / 2)) + 'px'; }
  requestAnimationFrame(() => { pop.classList.add('on'); fondo.classList.add('on'); });
}

// ---------- Buscador inteligente ----------
// Busca secciones, acciones, fechas ("noviembre", "sábado", "21/11"), tragos y clientes. Ctrl K o "/" lo abre desde cualquier lado.
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const nrm = t => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
function fechasPara(q) {
  const out = [], hoy = new Date(D.hoy + 'T12:00:00'), asc = nochesAsc(), ult = asc[asc.length - 1];
  const mesD = (y, m) => [isoD(new Date(y, m, 1)), isoD(new Date(y, m + 1, 0))];
  const add = (t, d, a, b) => out.push({ g: 'Fechas', t, d, i: 'cal', run: () => { location.hash = location.hash || '#inicio'; ir(a, b); } });
  if (/^(hoy|esta noche|anoche|ultima)/.test(q) && ult) add('Última noche', fecha(ult), ult, ult);
  if (/^(este mes|mes)/.test(q)) { const [a, b] = mesD(hoy.getFullYear(), hoy.getMonth()); add('Este mes', etiquetaRango({ desde: a, hasta: b }), a, b); }
  if (/^mes pas/.test(q)) { const [a, b] = mesD(hoy.getFullYear(), hoy.getMonth() - 1); add('Mes pasado', etiquetaRango({ desde: a, hasta: b }), a, b); }
  if (/^(semana|7 d|ultimos 7)/.test(q)) add('Últimos 7 días', '', diaMasC(D.hoy, -6), D.hoy);
  if (/^tod/.test(q) && asc[0]) add('Todo', `desde ${fecha(asc[0])}`, asc[0], D.hoy);
  MESES.forEach((n, m) => { if (q.length >= 3 && n.startsWith(q)) { let y = hoy.getFullYear(); if (m > hoy.getMonth()) y--; const [a, b] = mesD(y, m); add(n[0].toUpperCase() + n.slice(1) + ' ' + y, 'El mes entero', a, b); } });
  DIAS.forEach((n, w) => { if (q.length >= 3 && n.startsWith(q)) { const f = [...asc].reverse().find(x => new Date(x + 'T12:00:00').getDay() === w); if (f) add(`El último ${n === 'sabado' ? 'sábado' : n}`, fecha(f), f, f); } });
  const m1 = q.match(/^(\d{1,2})[\/\-. ](\d{1,2}|[a-z]{3,})/);
  if (m1) { const d = +m1[1], mm = /\d/.test(m1[2]) ? +m1[2] - 1 : MESES.findIndex(x => x.startsWith(m1[2])); if (mm >= 0) { let y = hoy.getFullYear(); if (mm > hoy.getMonth()) y--; const f = isoD(new Date(y, mm, d)); if (D.noches.some(n => n.noche === f)) add(fecha(f), 'Esa noche', f, f); else out.push({ g: 'Fechas', t: fecha(f), d: 'No abriste esa noche', i: 'cal', run: () => calendario('noche') }); } }
  return out;
}
async function buscador() {
  if ($('.bus')) return;
  document.body.classList.toggle('lat-abierta', false);
  const fondo = document.createElement('div'); fondo.className = 'bus-v';
  const caja = document.createElement('div'); caja.className = 'bus'; caja.setAttribute('role', 'dialog'); caja.setAttribute('aria-label', 'Buscar');
  caja.innerHTML = `<label class="bus-in">${LUPA}<input id="bus-q" placeholder="Buscá un trago, un cliente, una fecha o qué querés hacer" autocomplete="off" spellcheck="false" aria-label="Buscar"><kbd>Esc</kbd></label><div class="bus-res" id="bus-res" role="listbox"></div>
    <div class="bus-pie"><span><kbd>↑</kbd><kbd>↓</kbd> moverte</span><span><kbd>Enter</kbd> abrir</span><span>Probá: "fernet", "noviembre", "sábado", "riesgo"</span></div>`;
  document.body.append(fondo, caja); requestAnimationFrame(() => { fondo.classList.add('on'); caja.classList.add('on'); });
  const q = $('#bus-q', caja); q.focus();
  let items = [], act = 0;
  // Carga en segundo plano lo que haga falta para buscar tragos y clientes
  if (!carta) api('/api/dueno/productos').then(r => { carta = r; pintar(); }).catch(() => {});
  if (!crmD) api('/api/dueno/crm').then(r => { crmD = r; pintar(); }).catch(() => {});
  const irA = (h, despues) => () => { if (location.hash.slice(1) !== h) { location.hash = h; if (despues) setTimeout(despues, 380); } else if (despues) despues(); };
  const acciones = [
    { t: 'Agregar un trago o balde', d: 'Carta', k: 'agregar nuevo trago balde producto', i: 'carta', run: irA('carta', () => formulario()) },
    { t: 'Activar happy hour ahora', d: 'Baja los tragos al instante', k: 'happy hour activar promo descuento', i: 'happy', run: async () => { try { D.happy = await api('/api/dueno/happy', { method: 'POST', body: JSON.stringify({ ...D.happy, activo: true, forzado: true }) }); aviso('Happy hour activo en la app'); if (seccion === 'happy') mostrar('happy', true); } catch (e) { aviso(e.message); } } },
    { t: 'Clientes en riesgo', d: 'Habituales que dejaron de venir', k: 'riesgo clientes perdidos volver', i: 'clientes', run: irA('clientes', () => { crmSeg = 'riesgo'; vClientes(); }) },
    { t: 'Clientes VIP', d: 'Los que más gastan', k: 'vip mejores clientes', i: 'clientes', run: irA('clientes', () => { crmSeg = 'vip'; vClientes(); }) },
    { t: 'Descargar lista de clientes', d: 'Para avisar la próxima fiesta', k: 'descargar exportar lista csv excel clientes', i: 'clientes', run: () => { window.arenaDemoCsv(); } },
    { t: 'Imprimir cierre de caja', d: etiquetaRango(), k: 'imprimir cierre caja ticket', i: 'cierre', run: irA('cierre', () => setTimeout(() => print(), 400)) },
  ];
  const sugeridos = () => [
    { g: 'Sugeridos', t: 'Ventas', d: 'Qué se vende y dónde', i: 'ventas', run: irA('ventas') },
    { ...fechasPara('este mes')[0], g: 'Sugeridos' },
    { ...acciones[0], g: 'Sugeridos' }, { ...acciones[2], g: 'Sugeridos' }, { ...acciones[1], g: 'Sugeridos' }];
  const marcar = (t, qq) => { if (!qq) return esc(t); const i = nrm(t).indexOf(qq); return i < 0 ? esc(t) : esc(t.slice(0, i)) + '<mark>' + esc(t.slice(i, i + qq.length)) + '</mark>' + esc(t.slice(i + qq.length)); };
  function pintar() {
    const qq = nrm(q.value);
    if (!qq) items = sugeridos();
    else {
      const pt = (txt, k = '') => { const a = nrm(txt), b = nrm(k); return a.startsWith(qq) ? 3 : a.split(' ').some(w => w.startsWith(qq)) ? 2 : a.includes(qq) || b.includes(qq) ? 1 : 0; };
      const secc = SECCIONES.map(([k, n]) => ({ g: 'Secciones', t: n, d: SUB[k], i: k, s: pt(n, SUB[k]), run: irA(k) })).filter(x => x.s);
      const acc = acciones.map(a => ({ ...a, g: 'Acciones', s: pt(a.t, a.k) })).filter(x => x.s);
      const tragos = (carta?.productos || []).map(p => ({ g: 'Carta', t: p.nombre, d: `${pesos(p.precio)} · ${p.unidades} vendidos · ${CATS[p.categoria]}`, img: p, s: pt(p.nombre, CATS[p.categoria]), run: irA('carta', () => formulario(carta.productos.find(x => x.id === p.id))) })).filter(x => x.s).sort((a, b) => b.s - a.s).slice(0, 5);
      const cli = (crmD?.clientes || []).map(c => ({ g: 'Clientes', t: c.nombre, d: `${SEG[c.segmento].n} · gastó ${mil(c.gastado)} · ${contactoTxt(c)}`, cli: c, s: Math.max(pt(c.nombre), c.contacto.includes(q.value.replace(/\D/g, '')) && q.value.replace(/\D/g, '').length > 3 ? 1 : 0), run: irA('clientes', () => ficha(c)) })).filter(x => x.s).sort((a, b) => b.s - a.s || b.cli.gastado - a.cli.gastado).slice(0, 5);
      items = [...fechasPara(qq), ...acc, ...secc, ...tragos, ...cli].sort((a, b) => (b.s || 2.5) - (a.s || 2.5)).slice(0, 14);
      const orden = ['Fechas', 'Acciones', 'Secciones', 'Carta', 'Clientes']; items.sort((a, b) => orden.indexOf(a.g) - orden.indexOf(b.g));
    }
    act = Math.min(act, Math.max(0, items.length - 1));
    let g = '';
    $('#bus-res', caja).innerHTML = items.length ? items.map((x, i) => {
      const cab = x.g !== g ? `<div class="bus-g">${x.g}</div>` : ''; g = x.g;
      const ic = x.img ? `<span class="bus-i foto">${imgProd(x.img)}</span>` : x.cli ? `<span class="bus-i av">${iniciales(x.cli.nombre)}</span>` : `<span class="bus-i">${x.i === 'cal' ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>' : ico(x.i)}</span>`;
      return `${cab}<button class="bus-it ${i === act ? 'on' : ''}" data-i="${i}" role="option" aria-selected="${i === act}">${ic}<span class="bus-t"><b>${marcar(x.t, qq)}</b>${x.d ? `<small>${esc(x.d)}</small>` : ''}</span><span class="bus-ir">↵</span></button>`;
    }).join('') : `<p class="bus-nada">No encontramos “${esc(q.value)}”. Probá con el nombre de un trago, un cliente o un mes.</p>`;
    $$('.bus-it', caja).forEach(b => { b.onmouseenter = () => { act = +b.dataset.i; $$('.bus-it', caja).forEach(x => x.classList.toggle('on', x === b)); }; b.onclick = () => elegir(+b.dataset.i); });
  }
  const cerrar = () => { fondo.classList.toggle('on', false); caja.classList.toggle('on', false); setTimeout(() => { fondo.remove(); caja.remove(); }, 180); };
  const elegir = i => { const x = items[i]; if (!x) return; cerrar(); setTimeout(() => x.run(), 60); };
  q.oninput = () => { act = 0; pintar(); };
  q.onkeydown = e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); act = (act + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % Math.max(1, items.length); $$('.bus-it', caja).forEach(x => x.classList.toggle('on', +x.dataset.i === act)); $('.bus-it.on', caja)?.scrollIntoView({ block: 'nearest' }); }
    else if (e.key === 'Enter') { e.preventDefault(); elegir(act); }
    else if (e.key === 'Escape') cerrar();
  };
  fondo.onclick = cerrar;
  pintar();
}
addEventListener('keydown', e => {
  if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !e.target.closest('input,textarea,select') && !$('.modal-d'))) { e.preventDefault(); if ($('#raiz .lateral')) buscador(); }
});

// ---------- Carta ----------
const CATS = { tragos: 'Tragos', baldes: 'Baldes', cervezas: 'Cervezas', shots: 'Shots', 'sin-alcohol': 'Sin alcohol' };
const VASOS = { largo: 'Vaso largo', balon: 'Copa balón', bajo: 'Vaso bajo', shot: 'Shot', pinta: 'Pinta', porron: 'Porrón', lata: 'Lata', balde: 'Balde', botella: 'Botella', 'botella-agua': 'Botella de agua', champagne: 'Champagne' };
async function vCarta() {
  $('#acc').innerHTML = '<button class="btn-t" id="btn-nuevo">+ Agregar</button>';
  $('#btn-nuevo').onclick = () => formulario();
  if (!carta) $('#vista').innerHTML = '<div class="esq" style="height:56px;margin-bottom:14px"></div><div class="esq" style="height:420px"></div>';
  try { carta = await api('/api/dueno/productos'); } catch (e) { $('#vista').innerHTML = `<p class="vacio">${esc(e.message)}</p>`; return; }
  if (seccion !== 'carta') return;
  $('#vista').innerHTML = `<div class="herr"><div class="tabs-c" id="tabs-c"><span class="ind"></span></div>
      <label class="buscar">${'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>'}<input id="buscar" placeholder="Buscar trago" value="${esc(busqueda)}" aria-label="Buscar trago"></label>
      <label class="orden">Ordenar<select id="orden"><option value="carta">Como en la app</option><option value="poco">Menos ganancia primero</option><option value="mucho">Más vendidos primero</option><option value="precio">Precio</option></select></label></div>
    <section class="panel" style="padding-top:8px"><p class="bajada" id="carta-bajada"></p><div style="overflow-x:auto" id="lista"></div></section>`;
  $('#orden').value = orden;
  $('#orden').onchange = e => { orden = e.target.value; lista(); };
  $('#buscar').oninput = e => { busqueda = e.target.value; lista(); };
  tabs(); lista();
}
function tabs() {
  const t = $('#tabs-c'); const cats = Object.keys(CATS).filter(c => carta.productos.some(p => p.categoria === c));
  t.innerHTML = '<span class="ind"></span>' + ['todas', ...cats].map(c => `<button data-f="${c}" class="${filtro === c ? 'on' : ''}">${c === 'todas' ? 'Todo' : CATS[c]}<em>${c === 'todas' ? carta.productos.length : carta.productos.filter(p => p.categoria === c).length}</em></button>`).join('');
  $$('button', t).forEach(b => b.onclick = () => { filtro = b.dataset.f; $$('button', t).forEach(x => x.classList.toggle('on', x === b)); moverIndicador(t, b, false); lista(); });
  requestAnimationFrame(() => moverIndicador(t, $('button.on', t) || $('button', t), false));
}
function lista() {
  const P = carta.productos;
  $('#carta-bajada').textContent = carta.noches ? `Vendidos y ganancia de las últimas ${carta.noches} noches. Lo marcado en rojo deja poca ganancia: candidato a sacar. El precio se guarda solo.` : 'Agregá tragos y cambiá precios. Se ve al instante en la app.';
  const gan = P.map(p => p.ganancia).sort((a, b) => a - b), mediana = gan[Math.floor(gan.length / 2)] || 0, corte = gan[Math.floor(gan.length / 4)] ?? 0;
  const nuevo = p => p.creado && Date.now() - p.creado < 7 * 864e5;
  const flojo = p => carta.noches && !nuevo(p) && p.ganancia <= corte && p.ganancia < mediana / 2;
  const q = busqueda.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  let L = P.filter(p => (filtro === 'todas' || p.categoria === filtro) && (!q || p.nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(q)));
  L = { poco: () => [...L].sort((a, b) => a.ganancia - b.ganancia), mucho: () => [...L].sort((a, b) => b.unidades - a.unidades), precio: () => [...L].sort((a, b) => b.precio - a.precio) }[orden]?.() || L;
  const max = Math.max(1, ...P.map(p => p.unidades));
  $('#lista').innerHTML = L.length ? `<table class="tabla-carta"><thead><tr><th>Producto</th><th class="n">Vendidos</th><th class="ocultable" style="width:14%"></th><th class="n ocultable">Ganancia</th><th class="n">Precio</th><th class="n ocultable">Margen</th><th class="c">En la app</th><th></th></tr></thead><tbody>
    ${L.map((p, i) => `<tr class="${p.disponible ? '' : 'apagado'}" data-id="${p.id}"><td class="prod"><span class="bolita">${imgProd(p)}</span><span>${esc(p.nombre)}<small>${CATS[p.categoria]}${flojo(p) ? ' · <b class="flojo">Deja poco</b>' : nuevo(p) ? ' · <b class="nuevo-t">Nuevo</b>' : ''}</small></span></td>
      <td class="n num" style="font-size:1.1rem">${p.unidades}</td><td class="ocultable"><div class="barrita ${flojo(p) ? 'roja' : ''}" style="width:${p.unidades / max * 100}%;animation-delay:${i * 25}ms"></div></td>
      <td class="n ocultable">${pesos(p.ganancia)}</td>
      <td class="n"><span class="precio-c"><input type="text" inputmode="numeric" value="${p.precio.toLocaleString('es-AR')}" data-precio aria-label="Precio de ${esc(p.nombre)}"><span class="est"></span></span></td>
      <td class="n ocultable mrg" data-m>${Math.round((p.precio - p.costo) / p.precio * 100)}%</td>
      <td class="c"><label class="sw"><input type="checkbox" data-disp ${p.disponible ? 'checked' : ''} aria-label="${esc(p.nombre)} visible en la app"></label></td>
      <td class="acc"><button class="lnk" data-editar>Editar</button><button class="lnk rojo" data-sacar>Sacar</button></td></tr>`).join('')}</tbody></table>`
    : `<p class="vacio">${q ? `No hay nada que se llame “${esc(busqueda)}”.` : 'No hay productos en esta parte de la carta.'} <button class="lnk" id="vacio-nuevo">Agregar uno</button></p>`;
  $('#vacio-nuevo')?.addEventListener('click', () => formulario());
  $$('#lista tr[data-id]').forEach(tr => {
    const p = P.find(x => x.id === tr.dataset.id), inp = $('[data-precio]', tr), est = $('.est', tr);
    const guardar = async () => {
      const v = parseInt(inp.value.replace(/\D/g, ''), 10);
      if (v === p.precio) { inp.value = p.precio.toLocaleString('es-AR'); return; }
      if (!(v >= 100) || v <= p.costo) { inp.classList.add('sacude'); setTimeout(() => inp.classList.remove('sacude'), 400); aviso(v <= p.costo ? 'Con ese precio perdés plata: es menor que el costo.' : 'Poné un precio válido.'); inp.value = p.precio.toLocaleString('es-AR'); return; }
      const antes = p.precio; est.className = 'est gira';
      try { await api(`/api/dueno/productos/${p.id}`, { method: 'PUT', body: JSON.stringify({ precio: v }) }); p.precio = v; inp.value = v.toLocaleString('es-AR');
        $('[data-m]', tr).textContent = Math.round((v - p.costo) / v * 100) + '%'; est.className = 'est ok'; setTimeout(() => est.className = 'est', 1500);
        aviso(`${p.nombre}: ${pesos(antes)} → ${pesos(v)}`, { label: 'Deshacer', fn: async () => { await api(`/api/dueno/productos/${p.id}`, { method: 'PUT', body: JSON.stringify({ precio: antes }) }); p.precio = antes; lista(); } });
      } catch (e) { est.className = 'est'; inp.value = antes.toLocaleString('es-AR'); aviso(e.message); }
    };
    inp.onfocus = () => { inp.value = String(p.precio); setTimeout(() => inp.select(), 0); };
    inp.onblur = guardar;
    inp.onkeydown = e => { if (e.key === 'Enter') inp.blur(); if (e.key === 'Escape') { inp.value = String(p.precio); inp.blur(); } };
    $('[data-disp]', tr).onchange = async e => {
      const on = e.target.checked; tr.classList.toggle('apagado', !on);
      try { await api(`/api/dueno/productos/${p.id}`, { method: 'PUT', body: JSON.stringify({ disponible: on }) }); p.disponible = on ? 1 : 0;
        aviso(on ? `${p.nombre} vuelve a la app` : `${p.nombre} ya no se ve en la app`, on ? null : { label: 'Deshacer', fn: () => { e.target.checked = true; e.target.dispatchEvent(new Event('change')); } });
      } catch (er) { e.target.checked = !on; tr.classList.toggle('apagado', on); aviso(er.message); }
    };
    $('[data-editar]', tr).onclick = () => formulario(p);
    $('[data-sacar]', tr).onclick = () => confirmarSacar(p, tr);
  });
}
function modal(html, chica) {
  const m = document.createElement('div'); m.className = 'modal-d'; m.innerHTML = `<div class="caja-d ${chica ? 'chica' : ''}" role="dialog" aria-modal="true">${html}</div>`;
  const previo = document.activeElement; document.body.appendChild(m); document.body.style.overflow = 'hidden';
  const cerrar = () => { m.classList.add('cierra'); document.removeEventListener('keydown', tecla); setTimeout(() => { m.remove(); document.body.style.overflow = ''; previo?.focus?.(); }, 170); };
  const tecla = e => { if (e.key === 'Escape') cerrar(); };
  document.addEventListener('keydown', tecla);
  m.onmousedown = e => { if (e.target === m) cerrar(); };
  $$('[data-cerrar]', m).forEach(b => b.onclick = cerrar);
  return { m, cerrar };
}
function confirmarSacar(p, tr) {
  const { m, cerrar } = modal(`<h3>¿Sacar ${esc(p.nombre)}?</h3>
    <p class="bajada">Deja de aparecer en la app y en la barra. Lo que ya vendió sigue en tus números. Si sólo se terminó por esta noche, apagalo con el interruptor.</p>
    <div class="botones"><button class="btn-t sec" data-cerrar>Cancelar</button><button class="btn-t rojo" id="si">Sacar de la carta</button></div>`, true);
  setTimeout(() => $('#si', m).focus(), 50);
  $('#si', m).onclick = async () => {
    try { await api(`/api/dueno/productos/${p.id}`, { method: 'DELETE' }); cerrar(); tr.classList.add('sale');
      setTimeout(() => { carta.productos = carta.productos.filter(x => x.id !== p.id); tabs(); lista(); }, 330);
      aviso(`Sacaste ${p.nombre} de la carta`, { label: 'Deshacer', fn: async () => { await api(`/api/dueno/productos/${p.id}/restaurar`, { method: 'POST' }); carta = await api('/api/dueno/productos'); tabs(); lista(); $(`tr[data-id="${p.id}"]`)?.classList.add('llega'); } }, 6000);
    } catch (e) { aviso(e.message); }
  };
}
function formulario(p = null) {
  const v = p || { nombre: '', categoria: filtro !== 'todas' ? filtro : 'tragos', precio: '', costo: '', descripcion: '', ingredientes: '', ml: '', graduacion: '', vaso: filtro === 'baldes' ? 'balde' : 'largo', color: '#B3122E', prep_seg: 40, etiqueta: '', foto: null };
  let archivo = null;
  const { m, cerrar } = modal(`<form id="f-trago" novalidate>
    <div class="cab-f"><h3>${p ? 'Editar' : 'Agregar a la carta'}</h3><button type="button" class="x" data-cerrar aria-label="Cerrar">×</button></div>
    <div class="grid-f">
      <div class="vista-f"><div class="tarjeta-app" aria-label="Así se ve en la app"><div class="foto-app" id="v-foto"></div><b id="v-nombre"></b><span id="v-precio"></span></div>
        <div><label class="subir" id="subir">Subir foto<input type="file" id="f-foto" accept="image/jpeg,image/png,image/webp"></label><small class="ayuda">Arrastrala acá. Mejor sin fondo (PNG).</small></div></div>
      <div class="campos">
        <label class="c2">Nombre<input name="nombre" maxlength="40" value="${esc(v.nombre)}" placeholder="Ej.: Balde Smirnoff + 3 Speed"></label>
        <label>Parte de la carta<select name="categoria">${Object.entries(CATS).map(([k, n]) => `<option value="${k}" ${v.categoria === k ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
        <label>Etiqueta (opcional)<input name="etiqueta" maxlength="22" value="${esc(v.etiqueta || '')}" placeholder="Ej.: Nuevo, Para 6"></label>
        <label>Precio de venta<input name="precio" type="number" min="100" step="100" value="${v.precio}" placeholder="9500"></label>
        <label>Costo<input name="costo" type="number" min="0" step="100" value="${v.costo}" placeholder="2100"></label>
        <p class="c2 margen" id="v-margen"></p>
        <label class="c2">Descripción<textarea name="descripcion" maxlength="200" rows="2" placeholder="Lo que lo hace rico, en una frase">${esc(v.descripcion)}</textarea></label>
        <label class="c2">Qué lleva<input name="ingredientes" maxlength="120" value="${esc(v.ingredientes)}" placeholder="Smirnoff 750 ml · 3 Speed 473 ml · hielo"></label>
        <label>Mililitros<input name="ml" type="number" min="0" value="${v.ml}"></label>
        <label>Graduación %<input name="graduacion" type="number" min="0" max="80" step="0.5" value="${v.graduacion}"></label>
        <label>Dibujo si no hay foto<select name="vaso">${Object.entries(VASOS).map(([k, n]) => `<option value="${k}" ${v.vaso === k ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
        <label>Color de la bebida<input name="color" type="color" value="${v.color}"></label>
        <label class="c2">Tiempo para armarlo (segundos)<input name="prep_seg" type="number" min="5" max="600" value="${v.prep_seg}"><small class="ayuda">Con esto la app calcula cuánto espera la gente.</small></label>
      </div></div>
    <div class="err-f" id="f-err"></div>
    <div class="botones"><button type="button" class="btn-t sec" data-cerrar>Cancelar</button><button class="btn-t" id="f-ok">${p ? 'Guardar cambios' : 'Agregar a la carta'}</button></div></form>`);
  const f = $('#f-trago', m), val = n => f.elements[n].value;
  let fotoUrl = v.foto;
  const vista = (cambioFoto) => {
    if (cambioFoto || !$('#v-foto', m).childElementCount || !fotoUrl) $('#v-foto', m).innerHTML = fotoUrl ? `<img src="${fotoUrl}" alt="">` : vaso(val('vaso'), val('color'));
    $('#v-nombre', m).textContent = val('nombre') || 'Nombre';
    $('#v-precio', m).textContent = val('precio') ? pesos(val('precio')) : '$0';
    const pr = +val('precio'), co = +val('costo');
    $('#v-margen', m).innerHTML = pr ? (co >= pr ? '<b class="flojo">Con ese costo perdés plata en cada uno.</b>' : `Te deja <b>${pesos(pr - co)}</b> por unidad (${Math.round((pr - co) / pr * 100)}% de margen).`) : '';
  };
  f.oninput = e => { e.target.classList.remove('mal'); vista(e.target.name === 'vaso' || e.target.name === 'color'); }; vista(true);
  const usar = a => { if (!a) return; if (!/^image\/(jpeg|png|webp)$/.test(a.type)) return aviso('Subí una foto JPG, PNG o WEBP.'); if (a.size > 5e6) return aviso('La foto pesa más de 5 MB.'); archivo = a; fotoUrl = URL.createObjectURL(a); vista(true); $('#subir', m).firstChild.textContent = 'Cambiar foto'; };
  $('#f-foto', m).onchange = e => usar(e.target.files[0]);
  const zona = $('#subir', m);
  ['dragenter', 'dragover'].forEach(t => zona.addEventListener(t, e => { e.preventDefault(); zona.classList.add('sobre'); }));
  ['dragleave', 'drop'].forEach(t => zona.addEventListener(t, e => { e.preventDefault(); zona.classList.remove('sobre'); }));
  zona.addEventListener('drop', e => usar(e.dataTransfer.files[0]));
  setTimeout(() => f.elements.nombre.focus(), 60);
  f.onsubmit = async e => {
    e.preventDefault(); const b = $('#f-ok', m); $('#f-err', m).textContent = '';
    const faltan = ['nombre', 'precio'].filter(n => !val(n).trim()); faltan.forEach(n => f.elements[n].classList.add('mal'));
    if (faltan.length) { $('#f-err', m).textContent = 'Completá el nombre y el precio.'; f.elements[faltan[0]].focus(); return; }
    b.disabled = true; b.textContent = 'Guardando…';
    const datos = Object.fromEntries(new FormData(f)); delete datos.foto;
    try {
      const r = await api(p ? `/api/dueno/productos/${p.id}` : '/api/dueno/productos', { method: p ? 'PUT' : 'POST', body: JSON.stringify(datos) });
      if (archivo) { const up = await fetch(`/api/dueno/productos/${r.id}/foto`, { method: 'POST', headers: { 'Content-Type': archivo.type, 'x-pin': pin }, body: archivo });
        if (!up.ok) throw new Error((await up.json().catch(() => ({}))).error || 'No se pudo subir la foto.'); }
      cerrar(); aviso(p ? 'Cambios guardados' : `${datos.nombre} ya está en la app`);
      carta = await api('/api/dueno/productos'); if (!p && filtro !== 'todas' && filtro !== datos.categoria) filtro = datos.categoria;
      tabs(); lista(); const fila = $(`tr[data-id="${r.id}"]`); if (fila) { fila.classList.add('llega'); fila.scrollIntoView({ block: 'center', behavior: QUIETO ? 'auto' : 'smooth' }); }
    } catch (er) { $('#f-err', m).textContent = er.message; b.disabled = false; b.textContent = p ? 'Guardar cambios' : 'Agregar a la carta'; }
  };
}
// Atajo: "n" agrega un producto cuando estás en la carta
addEventListener('keydown', e => { if (seccion === 'carta' && e.key === 'n' && !e.target.closest('input,textarea,select') && !$('.modal-d')) { e.preventDefault(); formulario(); } });

// ---------- en vivo ----------
function conectar() {
  if (fuente) fuente.close();
  fuente = new EventSource(`/api/en-vivo?rol=dueno&pin=${encodeURIComponent(pin)}`);
  let t;
  fuente.addEventListener('pedido', ev => {
    const p = JSON.parse(ev.data); if (p.noche < D.desde || p.noche > D.hasta) return;
    const f = $('#feed'); if (f && p.estado === 'pagado') { f.querySelector('.vacio')?.remove(); f.insertAdjacentHTML('afterbegin', filaFeed(p, true)); }
    clearTimeout(t); t = setTimeout(async () => { await cargar(); if (seccion === 'inicio') { numeros(true); } }, 1200);
  });
}
(async () => { $('#raiz').innerHTML = `<div style="padding:32px">${esqueleto()}</div>`; try { await cargar(); armar(); conectar(); } catch (e) { login(e.status === 401 ? (pin ? 'PIN incorrecto.' : '') : e.message); } })();
