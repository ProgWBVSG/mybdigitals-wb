import { CATS, CARTA, FILTROS, RAPIDOS, porId, pesos, esc, leer, guardar, alCambiar, reiniciar, nuevoId, hace, ic, foto } from './datos.js';
import { soportaWebXR, modoAR, urlUSDZ, urlSceneViewer, iniciarWebXR } from './ar.js';

const $ = s => document.querySelector(s);
const qs = new URLSearchParams(location.search);
const MESA = (qs.get('mesa') || '7').replace(/\D/g, '').slice(0, 3) || '7';
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
let SESION = ls.get('laesquina-sesion', null); if (!SESION) { SESION = nuevoId(); ls.set('laesquina-sesion', SESION); }
let carrito = ls.get('laesquina-carrito', []);
let sellos = ls.get('laesquina-sellos', 3);
let filtro = null;
const guardarCarrito = () => ls.set('laesquina-carrito', carrito);
const misPedidos = () => leer().pedidos.filter(p => p.sesion === SESION);
const misLlamados = () => leer().llamados.filter(l => l.sesion === SESION);
const agotado = id => !!leer().agotados[id];
const simple = p => !p.sacar && !p.elegir && !p.paraMesa;

/* ---------- 3D: se precarga en segundo plano para que abra al instante ---------- */
const URL_THREE = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
let cargando3D = null;
function cargar3D() { if (!cargando3D) cargando3D = Promise.all([import(URL_THREE), import('./platos3d.js')]).then(([THREE, m]) => ({ THREE, PLATOS: m.crearPlatos(THREE) })); return cargando3D; }
const ahorrarDatos = () => { try { return !!navigator.connection?.saveData; } catch { return false; } };
const enReposo = fn => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 4000 }) : setTimeout(fn, 2500));
addEventListener('load', () => setTimeout(() => enReposo(() => { if (!ahorrarDatos()) cargar3D().catch(() => {}); }), 1800));
const precargada = new Set(); const precargar = src => { if (precargada.has(src)) return; precargada.add(src); const i = new Image(); i.decoding = 'async'; i.src = src; };

/* ---------- avisos y navegación con el botón atrás ---------- */
let tAviso; function aviso(txt, icono = 'check') { const a = $('#aviso'); a.innerHTML = ic(icono, 20) + `<span>${txt}</span>`; a.classList.add('ve'); clearTimeout(tAviso); tAviso = setTimeout(() => a.classList.remove('ve'), 2800); }
const pila = [];
function abrir(el, html) { if (html != null) el.innerHTML = html; if (!el.classList.contains('ve')) el.scrollTop = 0; requestAnimationFrame(() => el.classList.add('ve')); if (!pila.includes(el)) { pila.push(el); history.pushState({ capa: pila.length }, ''); } if (el.id === 'hoja') $('#velo').classList.add('ve'); document.body.style.overflow = 'hidden'; }
function cerrarEl(el) { el.classList.remove('ve'); if (el.id === 'hoja') { $('#velo').classList.remove('ve'); el.dataset.tipo = ''; } if (el.id === 'visor') pararVisor(); const i = pila.indexOf(el); if (i >= 0) pila.splice(i, 1); if (!pila.length) document.body.style.overflow = ''; }
function cerrar(el) { if (pila[pila.length - 1] === el) history.back(); else cerrarEl(el); }
window.addEventListener('popstate', () => { const el = pila[pila.length - 1]; if (el) cerrarEl(el); });
$('#velo').onclick = () => cerrar($('#hoja'));
const hojaAbierta = t => $('#hoja').classList.contains('ve') && $('#hoja').dataset.tipo === t;

/* ---------- bienvenida: como si acercaras el celular a la mesa ---------- */
(function bienvenida() { const b = $('#bienv'); const d = new Date(); $('#bHora').textContent = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  $('#bDia').textContent = d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }); $('#bMesa').textContent = `Abrir la carta · Mesa ${MESA}`;
  let visto = false; try { visto = sessionStorage.getItem('laesquina-bienv') === '1'; } catch {} if (visto || qs.has('directo')) return;
  b.hidden = false; const entrar = () => { b.classList.add('fuera'); try { sessionStorage.setItem('laesquina-bienv', '1'); } catch {} setTimeout(() => b.hidden = true, 600); };
  b.addEventListener('click', entrar); })();

/* ---------- carta ---------- */
$('#mesa').textContent = `MESA ${MESA}`; $('#btnCampana').innerHTML = ic('campana', 24); $('#btnCampana').onclick = () => hojaRapidos();
$('#tabs').innerHTML = CATS.map(([id, n], i) => `<button data-ir="${id}" class="${i ? '' : 'on'}">${n}</button>`).join('');
$('#tabs').onclick = e => { const b = e.target.closest('[data-ir]'); if (!b) return; const s = document.getElementById('s-' + b.dataset.ir); if (s) s.scrollIntoView({ behavior: 'smooth' }); };
const cantEnCarrito = id => carrito.filter(c => c.id === id).reduce((a, c) => a + c.cant, 0);
const pasaFiltro = p => !filtro || p.cat === 'bebidas' || p[filtro];
function fila(p) { const ag = agotado(p.id), n = cantEnCarrito(p.id), rapido = simple(p) && !ag;
  const lateral = rapido ? (n ? `<div class="mini"><button data-menos="${p.id}" aria-label="Uno menos">${ic('menos', 18)}</button><b>${n}</b><button data-mas="${p.id}" aria-label="Uno más">${ic('mas', 18)}</button></div>` : `<button class="mas" data-mas="${p.id}" aria-label="Agregar ${p.nombre}">${ic('mas', 20)}</button>`) : '';
  return `<div class="fila-w ${ag ? 'agotado' : ''} ${rapido ? 'con-mas' : ''} ${rapido && n ? 'con-mini' : ''}"><button class="fila" data-plato="${p.id}">${p.foto ? `<img src="${foto(p.foto)}" alt="" loading="lazy" decoding="async" width="88" height="88">` : ''}<span class="tx"><span class="top"><b>${p.nombre}</b><span class="p">${pesos(p.precio)}</span></span><p>${p.desc}</p>${ag ? '<span class="tag no">HOY NO HAY</span>' : p.tags.map(t => `<span class="tag">${t}</span>`).join(' ')}${p.modelo && !ag ? ` <span class="tag ar">${ic('cubo', 13)} 3D</span>` : ''}${n && !ag && !rapido ? `<span class="cant">${ic('check', 14)} ${n} en tu pedido</span>` : ''}</span></button>${lateral}</div>`; }
function pintarCarta() { const s = leer(), rec = porId(s.recomendado) || porId('milanesa'); let h = `<div class="filtros" role="group" aria-label="Filtrar la carta">${FILTROS.map(([k, n]) => `<button data-filtro="${k}" aria-pressed="${filtro === k}">${n}</button>`).join('')}</div>`;
  if (rec && !s.agotados[rec.id] && pasaFiltro(rec)) h += `<section class="sec"><h2>Recomendado hoy</h2><button class="hero" data-plato="${rec.id}"><img src="${foto(rec.foto || 'milanesa', true)}" alt="" fetchpriority="high" decoding="async"><span class="tx"><span><b>${rec.nombre}</b><span>${rec.corta || rec.desc}</span></span><span class="p">${pesos(rec.precio)}</span></span></button></section>`;
  for (const [id, n] of CATS) { const items = CARTA.filter(p => p.cat === id && !p.oculto && pasaFiltro(p)); if (items.length) h += `<section class="sec" id="s-${id}"><h2>${n}</h2>${items.map(fila).join('')}</section>`; }
  if (filtro) h += `<p class="fin-filtro">Mostrando sólo lo ${FILTROS.find(f => f[0] === filtro)[1].toLowerCase()}. <button data-filtro="${filtro}">Ver toda la carta</button></p>`;
  $('#carta').innerHTML = h; }
$('#carta').onclick = e => { const f = e.target.closest('[data-filtro]'); if (f) { filtro = filtro === f.dataset.filtro ? null : f.dataset.filtro; pintarTodo(); $('#tabs').scrollIntoView({ block: 'start' }); return; }
  const mas = e.target.closest('[data-mas]'), menos = e.target.closest('[data-menos]');
  if (mas || menos) { const id = (mas || menos).dataset.mas || menos.dataset.menos, p = porId(id);
    if (mas) { const c = carrito.find(x => x.id === id && !x.mods.length && !x.nota); if (c) c.cant++; else carrito.push({ key: nuevoId(), id, cant: 1, mods: [], nota: '', precioU: p.precio }); try { navigator.vibrate && navigator.vibrate(8); } catch {} }
    else { const c = [...carrito].reverse().find(x => x.id === id); if (c) { c.cant--; if (c.cant <= 0) carrito = carrito.filter(x => x !== c); } }
    guardarCarrito(); pintarTodo(); return; }
  const b = e.target.closest('[data-plato]'); if (!b) return; if (agotado(b.dataset.plato)) { aviso('Hoy se terminó. Preguntale al mozo qué hay parecido.', 'reloj'); return; } abrirFicha(b.dataset.plato); };
// al apoyar el dedo en un plato ya empieza a bajar su foto grande
$('#carta').addEventListener('pointerdown', e => { const b = e.target.closest('[data-plato]'); if (!b) return; const p = porId(b.dataset.plato); if (p?.foto) precargar(foto(p.foto, true)); if (p?.modelo && !ahorrarDatos()) cargar3D().catch(() => {}); }, { passive: true });
const obs = new IntersectionObserver(es => { for (const e of es) if (e.isIntersecting) { const id = e.target.id.slice(2); document.querySelectorAll('#tabs button').forEach(b => { const on = b.dataset.ir === id; b.classList.toggle('on', on); if (on) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); }); } }, { rootMargin: '-45% 0px -50% 0px' });
const observar = () => { obs.disconnect(); document.querySelectorAll('main .sec[id]').forEach(s => obs.observe(s)); };

/* ---------- estado del pedido ---------- */
function etapa(p) { if (p.estado === 'listo' || p.estado === 'entregado') return 2; return Date.now() - p.creado > 6000 ? 1 : 0; }
const ETAPAS = [['Recibido en la cocina', 'Ya lo tienen en la pantalla'], ['Lo están preparando', 'Te avisamos cuando salga'], ['Ya sale para tu mesa', 'Buen provecho']];
const vistos = { etapa: {}, llamado: {} };
function pintarEstado() { const ps = misPedidos().filter(p => p.estado !== 'entregado' && !p.rapido); const el = $('#estado'); if (!ps.length) el.innerHTML = '';
  else { const p = ps[ps.length - 1], e = etapa(p); el.innerHTML = `<button class="estado ${e === 2 ? 'listo' : ''}" id="btnSeguir"><span class="pt"></span><span><b>${ETAPAS[e][0]}</b><span>${ps.length > 1 ? `${ps.length} pedidos · ` : ''}${ETAPAS[e][1]}</span></span>${ic('atras', 18)}</button>`; $('#btnSeguir').onclick = () => hojaSeguimiento(); }
  for (const q of misPedidos()) { const et = etapa(q); if (vistos.etapa[q.id] != null && et === 2 && vistos.etapa[q.id] < 2) aviso(q.rapido ? `Ya te llevan ${q.items[0].id === 'panera' ? 'el pan' : 'el agua'}` : `${q.items[0].nombre} ya sale para tu mesa`, 'olla'); vistos.etapa[q.id] = et; }
  for (const l of misLlamados()) { if (vistos.llamado[l.id] === false && l.atendido) aviso(l.tipo === 'cuenta' ? 'El mozo ya va con la cuenta' : l.tipo === 'mozo' ? 'El mozo ya va a tu mesa' : `Ya te llevan ${l.tipo === 'hielo' ? 'el hielo' : 'las servilletas'}`, 'mozo'); vistos.llamado[l.id] = !!l.atendido; } }
// sin la pantalla de cocina abierta, la demo avanza sola: el pedido sale al minuto y el mozo "va" a los 20 s
setInterval(() => { const ahora = Date.now(), ps = misPedidos().filter(p => p.estado === 'cocina' && ahora - p.creado > (p.rapido ? 25000 : 60000)), ll = misLlamados().filter(l => !l.atendido && ahora - l.ts > 20000);
  if (ps.length || ll.length) guardar(s => { s.pedidos.forEach(p => { if (ps.some(v => v.id === p.id)) { p.estado = 'listo'; p.listoEn = ahora; } }); s.llamados.forEach(l => { if (ll.some(v => v.id === l.id)) l.atendido = true; }); });
  pintarEstado(); if (hojaAbierta('seguir')) hojaSeguimiento(true); if (hojaAbierta('rapidos')) hojaRapidos(true); }, 2000);

/* ---------- barra de abajo: siempre a mano del pulgar ---------- */
const totalCarrito = () => carrito.reduce((a, c) => a + c.precioU * c.cant, 0);
const cantCarrito = () => carrito.reduce((a, c) => a + c.cant, 0);
function pintarBarra() { const b = $('#barra'), n = cantCarrito(), hay = misPedidos().some(p => !p.rapido);
  const mozo = `<button class="btn-mesa ${n || hay ? '' : 'ancho'}" id="bbMesa">${ic('campana', 22)}<span><b>${n || hay ? 'Mozo' : 'Mozo, agua o pan'}</b>${n || hay ? '' : '<small>Lo pedís desde acá</small>'}</span></button>`;
  b.innerHTML = mozo + (n ? `<button class="btn" id="bbPed"><span class="burbuja">${n}</span>Ver pedido · ${pesos(totalCarrito())}</button>` : hay ? `<button class="btn borde" id="bbCta">${ic('cuenta', 20)} La cuenta</button>` : '');
  b.classList.add('ve'); $('#bbMesa').onclick = () => hojaRapidos(); const pd = $('#bbPed'); if (pd) pd.onclick = hojaPedido; const ct = $('#bbCta'); if (ct) ct.onclick = abrirCuenta; }

/* ---------- ficha del plato ---------- */
let F = null;
function abrirFicha(id) { const p = porId(id); F = { id, cant: 1, sacar: new Set(), elegido: p.elegir ? p.elegir.def : null, panera: false, agua: false, nota: '' };
  if (p.modelo && !ahorrarDatos()) cargar3D().catch(() => {});
  const yaPanera = carrito.some(c => c.id === 'panera') || misPedidos().some(x => x.items.some(i => i.id === 'panera'));
  const el = $('#ficha'); el.classList.toggle('sinfoto', !p.foto);
  el.innerHTML = `${p.foto ? `<div class="ph"><img src="${foto(p.foto, true)}" alt="" decoding="async"><button class="volver" data-cerrar aria-label="Volver">${ic('atras')}</button>${p.modelo ? `<div class="ph-btns"><button class="ver3d" id="ver3d">${ic('cubo')} 3D</button><button class="ver3d fuerte" id="verAR">${ic('camara')} En tu mesa</button></div>` : ''}</div>` : `<div class="top-bar"><button class="volver" data-cerrar aria-label="Volver">${ic('atras')}</button><h1></h1><span></span></div>`}
  <div class="cuerpo"><h2>${p.nombre}<span class="p">${pesos(p.precio)}</span></h2><p class="desc">${p.desc}</p>
  <div class="datos-plato">${p.medida ? `<span>${ic('regla', 16)} ${p.medida}</span>` : ''}${p.alerg ? `<span>${ic('nota', 16)} ${p.alerg}</span>` : ''}${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
  ${p.elegir ? `<div class="grupo"><h3>${p.elegir.titulo}</h3>${p.elegir.opciones.map((o, i) => `<button class="op" role="radio" data-elegir="${i}" aria-checked="${i === F.elegido}">${o}<span class="mk radio"></span></button>`).join('')}</div>` : ''}
  ${p.sacar ? `<div class="grupo"><h3>¿Querés sacar algo?</h3>${p.sacar.map(s => `<button class="op" role="checkbox" data-sacar="${s}" aria-checked="false">Sin ${s.toLowerCase()}<span class="mk">${ic('check', 18)}</span></button>`).join('')}</div>` : ''}
  ${p.paraMesa ? `<div class="grupo"><h3>Para la mesa</h3>${yaPanera ? '' : `<button class="op" role="checkbox" data-extra="panera" aria-checked="false"><span>Panera<small>Sin cargo</small></span><span class="mk circ">${ic('mas', 18)}</span></button>`}<button class="op" role="checkbox" data-extra="agua" aria-checked="false"><span>Agua sin gas 500 ml<small>${pesos(2500)}</small></span><span class="mk circ">${ic('mas', 18)}</span></button></div>` : ''}
  <div class="grupo"><h3>Algo para la cocina</h3><textarea class="nota" id="nota" maxlength="140" placeholder="Ej.: las papas bien doradas"></textarea></div></div>
  <div class="pie fila-pie"><div class="stepper"><button data-c="-1" aria-label="Uno menos">${ic('menos', 20)}</button><b id="fCant">1</b><button data-c="1" aria-label="Uno más">${ic('mas', 20)}</button></div><button class="btn" id="fAgregar"></button></div>`;
  pintarBotonFicha(); abrir(el);
  el.onclick = e => { const t = e.target.closest('button'); if (!t) return;
    if (t.hasAttribute('data-cerrar')) return cerrar(el);
    if (t.id === 'ver3d') return abrirVisor(id);
    if (t.id === 'verAR') return abrirAR(id);
    if (t.dataset.elegir != null) { F.elegido = +t.dataset.elegir; el.querySelectorAll('[data-elegir]').forEach(b => b.setAttribute('aria-checked', +b.dataset.elegir === F.elegido)); }
    if (t.dataset.sacar) { const on = !F.sacar.has(t.dataset.sacar); on ? F.sacar.add(t.dataset.sacar) : F.sacar.delete(t.dataset.sacar); t.setAttribute('aria-checked', on); }
    if (t.dataset.extra) { const k = t.dataset.extra; F[k] = !F[k]; t.setAttribute('aria-checked', F[k]); t.querySelector('.mk').innerHTML = ic(F[k] ? 'check' : 'mas', 18); }
    if (t.dataset.c) { F.cant = Math.max(1, Math.min(9, F.cant + +t.dataset.c)); $('#fCant').textContent = F.cant; }
    if (t.id === 'fAgregar') return agregarFicha();
    pintarBotonFicha(); };
  $('#nota').oninput = e => F.nota = e.target.value; }
function pintarBotonFicha() { const p = porId(F.id); $('#fAgregar').textContent = `Agregar · ${pesos(p.precio * F.cant + (F.agua ? 2500 : 0))}`; }
function agregarFicha(cerrarla = true) { const p = porId(F.id); const mods = [...F.sacar].map(s => 'Sin ' + s.toLowerCase()); if (p.elegir) mods.unshift(p.elegir.opciones[F.elegido]);
  carrito.push({ key: nuevoId(), id: p.id, cant: F.cant, mods, nota: F.nota.trim(), precioU: p.precio });
  if (F.panera) carrito.push({ key: nuevoId(), id: 'panera', cant: 1, mods: [], nota: '', precioU: 0 });
  if (F.agua) carrito.push({ key: nuevoId(), id: 'agua', cant: 1, mods: [], nota: '', precioU: 2500 });
  guardarCarrito(); if (cerrarla) cerrar($('#ficha')); pintarTodo(); aviso(`${p.nombre} en tu pedido`); }

/* ---------- visor 3D: la foto aparece al toque y el 3D la reemplaza cuando está listo ---------- */
let V = null;
async function abrirVisor(id) { const p = porId(id), el = $('#visor');
  el.innerHTML = `<div class="top-bar"><button class="volver" data-cerrar aria-label="Volver">${ic('atras')}</button><h1>${p.nombre}<small>Vista 3D</small></h1><span></span></div>
  <div class="lienzo" id="lienzo"><img class="poster" src="${foto(p.foto)}" alt=""><span class="cargando" id="carg3d"><i></i>Armando el plato en 3D</span><svg class="medida" id="medida"></svg></div>
  <p class="pista">${ic('girar', 18)} Girá con el dedo para verlo de todos lados</p>
  <div class="segm" id="segm"><i></i><button class="on" data-m="girar">Girar</button><button data-m="real">Con medida</button></div>
  <p class="dato">${p.medida || ''}</p>
  <div class="pie fila-pie"><button class="btn borde" id="vAR">${ic('camara', 20)} En tu mesa</button><button class="btn" id="vAgregar">Agregar · ${pesos(p.precio)}</button></div>`;
  abrir(el);
  el.onclick = e => { const t = e.target.closest('button'); if (!t) return; if (t.hasAttribute('data-cerrar')) return cerrar(el);
    if (t.id === 'vAR') return abrirAR(id);
    if (t.id === 'vAgregar') { cerrar(el); setTimeout(() => $('#fAgregar') && agregarFicha(), 380); return; }
    if (t.dataset.m && V) { V.real = t.dataset.m === 'real'; el.querySelectorAll('[data-m]').forEach(b => b.classList.toggle('on', b === t)); $('#segm').classList.toggle('der', V.real); } };
  try { await iniciarVisor(p); } catch (err) { const c = $('#carg3d'); if (c) c.textContent = 'No se pudo cargar el 3D en este celular.'; console.warn(err); } }
async function iniciarVisor(p) {
  const { THREE, PLATOS } = await cargar3D(); const caja = $('#lienzo'); if (!caja || !pila.includes($('#visor')) || V) return; const { escena, cam, obj } = PLATOS.estudio(p.modelo);
  const R = new THREE.WebGLRenderer({ antialias: true, alpha: true }); R.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); R.shadowMap.enabled = true; R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.15;
  caja.prepend(R.domElement); R.domElement.className = 'gl';
  V = { R, real: false, rot: .6, vel: 0, elev: .55, arr: null, vivo: true, auto: true };
  const tam = () => { const w = caja.clientWidth, h = caja.clientHeight; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }; tam(); V.ro = new ResizeObserver(tam); V.ro.observe(caja);
  caja.onpointerdown = e => { V.arr = { x: e.clientX, y: e.clientY }; V.auto = false; caja.setPointerCapture(e.pointerId); };
  caja.onpointermove = e => { if (!V.arr) return; const dx = e.clientX - V.arr.x, dy = e.clientY - V.arr.y; V.arr = { x: e.clientX, y: e.clientY }; V.vel = dx * .012; V.rot += V.vel; if (!V.real) V.elev = Math.max(.2, Math.min(1.1, V.elev + dy * .004)); };
  caja.onpointerup = caja.onpointercancel = () => { V.arr = null; };
  const svg = $('#medida'), radio = p.r3d || .14, etiqueta = (p.medida || '').match(/(\d+)\s*cm/)?.[1];
  const dist = p.d3d || Math.max(.45, radio * 4.7), mira = p.y3d ?? .025;
  let el = V.elev, t0 = performance.now(), primero = true;
  const cuadro = now => { if (!V || !V.vivo) return; const dt = Math.min(.05, (now - t0) / 1000); t0 = now;
    if (!V.arr) { V.vel *= .94; V.rot += V.vel + (V.auto && !V.real ? dt * .45 : 0); }
    const objetivoElev = V.real ? .95 : V.elev; el += (objetivoElev - el) * Math.min(1, dt * 6);
    obj.rotation.y = V.rot; const d = dist * (caja.clientWidth < caja.clientHeight ? 1.12 : 1); cam.position.set(Math.sin(.3) * d * Math.cos(el * .9), Math.sin(el * .9) * d + mira, Math.cos(.3) * d * Math.cos(el * .9)); cam.lookAt(0, mira, 0); R.render(escena, cam);
    if (primero) { primero = false; caja.classList.add('listo3d'); }
    if (V.real && etiqueta && p.r3d) { const w = caja.clientWidth, h = caja.clientHeight, pr = (x, z) => { const v = new THREE.Vector3(x, 0, z).project(cam); return [(v.x + 1) / 2 * w, (1 - v.y) / 2 * h]; };
      const [ax] = pr(-radio, 0), [bx] = pr(radio, 0), [, fy] = pr(0, radio), y = Math.min(h - 40, fy + 26);
      svg.innerHTML = `<g stroke="#1F1A16" stroke-width="1.6" fill="none"><path d="M${ax} ${y}H${bx}" stroke-dasharray="5 5"/><path d="M${ax} ${y - 9}v18M${bx} ${y - 9}v18"/></g><rect x="${(ax + bx) / 2 - 40}" y="${y + 12}" width="80" height="30" rx="6" fill="#1F1A16"/><text x="${(ax + bx) / 2}" y="${y + 32}" fill="#fff" font-family="Geist, sans-serif" font-weight="600" font-size="15" text-anchor="middle">${etiqueta} cm</text>`;
      svg.classList.add('ve'); } else svg.classList.remove('ve');
    V.raf = requestAnimationFrame(cuadro); };
  V.raf = requestAnimationFrame(cuadro); }
function pararVisor() { if (!V) return; V.vivo = false; cancelAnimationFrame(V.raf); V.ro && V.ro.disconnect(); try { V.R.dispose(); V.R.forceContextLoss(); } catch {} V = null; }

/* ---------- el plato en tu mesa, con la cámara ---------- */
async function abrirAR(id) { const p = porId(id), el = $('#hoja'); el.dataset.tipo = 'ar'; const webxr = await soportaWebXR(), modo = webxr ? 'webxr' : modoAR();
  const pasos = `<ol class="pasos-ar"><li>${ic('camara', 20)}<span><b>Apuntá a la mesa</b>Movete despacio unos segundos.</span></li><li>${ic('mesa', 20)}<span><b>${modo === 'webxr' ? 'Te decimos si es la mesa y a qué distancia' : 'Aparece un plato en la mesa'}</b>${modo === 'webxr' ? 'Si apuntás al piso, te avisa.' : 'Tu celular encuentra la superficie solo.'}</span></li><li>${ic('regla', 20)}<span><b>Lo ves en tamaño real</b>${p.medida || ''}.</span></li></ol>`;
  let boton;
  if (modo === 'webxr') boton = `<button class="btn" id="arIr" disabled>Preparando la cámara…</button>`;
  else if (modo === 'ios') boton = `<a class="btn" rel="ar" href="${urlUSDZ(p.modelo)}"><img src="${foto(p.foto)}" alt="" width="1" height="1" style="position:absolute;opacity:0">${ic('camara', 20)} Abrir la cámara</a>`;
  else if (modo === 'android') boton = `<a class="btn" href="${urlSceneViewer(p.modelo, p.nombre)}">${ic('camara', 20)} Abrir la cámara</a>`;
  el.innerHTML = `<div class="asa"></div><h2>${p.nombre}, en tu mesa</h2><p class="sub">${modo === 'compu' ? 'La cámara se usa desde el celular. Escaneá este código y tocá “En tu mesa”.' : 'Vas a verlo con la cámara, del tamaño que llega a la mesa. Te vamos a pedir permiso para usarla.'}</p>
    ${modo === 'compu' ? `<div class="qr-ar" id="qrAR"></div>` : pasos + boton}${modo === 'ios' ? '<p class="nota-ar">Se abre el visor de realidad aumentada de tu iPhone.</p>' : ''}`;
  abrir(el); el.onclick = null;
  if (modo === 'compu') { pintarQR($('#qrAR'), location.href.split('#')[0]); return; }
  if (modo !== 'webxr') return;
  try { const { THREE, PLATOS } = await cargar3D(); const b = $('#arIr'); if (!b) return; b.disabled = false; b.innerHTML = `${ic('camara', 20)} Abrir la cámara`;
    b.onclick = async () => { const ui = $('#arUI'); ui.hidden = false; ui.querySelector('[data-ar-titulo]').textContent = p.nombre; ui.querySelector('[data-ar-agregar]').textContent = `Agregar · ${pesos(p.precio)}`;
      ui.querySelector('[data-ar-pista]').textContent = 'Movete despacio para que encuentre la mesa'; ui.querySelector('[data-ar-mover]').hidden = ui.querySelector('[data-ar-girar]').hidden = true;
      try { await iniciarWebXR({ THREE, PLATOS, plato: p, ui, alAgregar: () => { if (!F || F.id !== id) F = { id, cant: 1, sacar: new Set(), elegido: p.elegir ? p.elegir.def : null, panera: false, agua: false, nota: '' }; agregarFicha(false); }, alTerminar: () => { ui.hidden = true; } }); cerrar(el); }
      catch (err) { ui.hidden = true; aviso('No se pudo abrir la cámara. Revisá el permiso.', 'camara'); console.warn(err); } }; }
  catch { const b = $('#arIr'); if (b) b.textContent = 'No se pudo preparar la cámara'; } }
function pintarQR(caja, url) { const dibujar = () => { const q = window.qrcode(0, 'M'); q.addData(url); q.make(); caja.innerHTML = q.createSvgTag({ cellSize: 6, margin: 3, scalable: true }); };
  if (window.qrcode) return dibujar(); const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'; s.onload = dibujar; document.head.appendChild(s); }

/* ---------- pedidos rápidos: mozo, agua, pan, hielo, servilletas, cuenta ---------- */
function rapidoPendiente(r) { const ahora = Date.now(); if (r.pedido) return misPedidos().find(p => p.rapido === r.id && p.estado === 'cocina' && ahora - p.creado < 6e5); return misLlamados().find(l => l.tipo === r.id && !l.atendido && ahora - l.ts < 6e5); }
function rapidoListo(r) { const ahora = Date.now(); if (r.pedido) return misPedidos().find(p => p.rapido === r.id && p.estado !== 'cocina' && ahora - (p.listoEn || p.creado) < 9e4); return misLlamados().find(l => l.tipo === r.id && l.atendido && ahora - l.ts < 9e4); }
function hojaRapidos(soloPintar = false) { const el = $('#hoja'); el.dataset.tipo = 'rapidos';
  el.innerHTML = `<div class="asa"></div><h2>¿Qué te traemos?</h2><p class="sub">Mesa ${MESA} · le llega al mozo al instante</p><div class="rapidos">${RAPIDOS.map(r => { const pend = r.id !== 'cuenta' && rapidoPendiente(r), listo = !pend && r.id !== 'cuenta' && rapidoListo(r);
    return `<button class="rap ${pend ? 'pend' : listo ? 'hecho' : ''}" data-rap="${r.id}">${ic(pend || listo ? 'check' : r.ic, 26)}<b>${r.n}</b><span>${pend ? `${r.pedido ? 'Pedido' : 'Avisado'} ${hace(pend.ts || pend.creado)}` : listo ? (r.id === 'mozo' ? 'El mozo va a tu mesa' : 'Ya va para tu mesa') : r.sub}</span></button>`; }).join('')}</div>
    ${bloqueSugerencia()}`;
  if (!soloPintar) abrir(el);
  el.onclick = e => { const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.rap) { const r = RAPIDOS.find(x => x.id === t.dataset.rap); if (r.id === 'cuenta') { cerrar(el); setTimeout(abrirCuenta, 380); return; } if (rapidoPendiente(r)) return;
      if (r.pedido) { const p = porId(r.pedido); guardar(s => s.pedidos.push({ id: nuevoId(), sesion: SESION, mesa: MESA, rapido: r.id, items: [{ id: p.id, nombre: r.id === 'pan' ? 'Más pan' : 'Agua sin gas 500 ml', cant: 1, mods: [], nota: '', precio: p.precio }], total: p.precio, estado: 'cocina', creado: Date.now() })); }
      else guardar(s => s.llamados.push({ id: nuevoId(), sesion: SESION, mesa: MESA, tipo: r.id, ts: Date.now(), atendido: false }));
      try { navigator.vibrate && navigator.vibrate(15); } catch {} vistos.llamado = Object.fromEntries(misLlamados().map(l => [l.id, !!l.atendido])); hojaRapidos(true); pintarTodo(); }
    if (t.dataset.sug) agregarSug(t.dataset.sug, t); }; }

/* ---------- sugerencia: lo que va bien con lo que pediste ---------- */
function sugerencia() { const ids = [...carrito.map(c => c.id), ...misPedidos().flatMap(p => p.items.map(i => i.id))]; for (let i = ids.length - 1; i >= 0; i--) { const p = porId(ids[i]); if (p && p.vaBien && !ids.includes(p.vaBien) && !agotado(p.vaBien)) return [p, porId(p.vaBien)]; } return null; }
function bloqueSugerencia() { const s = sugerencia(); if (!s) return ''; const [base, v] = s; const corto = base.nombre.split(',')[0].split(' ')[0].toLowerCase();
  return `<div class="sug-w"><h3>Va bien con ${base.cat === 'postres' ? 'el' : 'tu'} ${corto === 'empanadas' ? 'empanada' : corto}</h3><div class="sug">${v.foto ? `<img src="${foto(v.foto)}" alt="">` : `<span class="sin">${ic(v.cat === 'bebidas' ? 'copa' : 'olla', 28)}</span>`}<span class="tx"><b>${v.nombre}</b><span>${v.desc.split('.')[0]}</span><em>${pesos(v.precio)}</em></span><button class="pild" data-sug="${v.id}">Agregar</button></div></div>`; }
function agregarSug(id, btn) { const p = porId(id); carrito.push({ key: nuevoId(), id, cant: 1, mods: [], nota: '', precioU: p.precio }); guardarCarrito(); btn.classList.add('on'); btn.textContent = 'Agregado'; btn.disabled = true; pintarTodo(); }

/* ---------- hoja del pedido ---------- */
function hojaPedido() { const el = $('#hoja'); el.dataset.tipo = 'pedido';
  if (!carrito.length) { cerrar(el); return; }
  el.innerHTML = `<div class="asa"></div><h2>Tu pedido</h2><p class="sub">Mesa ${MESA} · revisalo y mandalo a la cocina</p>
  ${carrito.map(c => { const p = porId(c.id); return `<div class="item">${p.foto ? `<img src="${foto(p.foto)}" alt="">` : ''}<span class="tx"><b>${p.nombre}</b>${c.mods.length ? `<div class="mods">${c.mods.map(esc).join(' · ').toUpperCase()}</div>` : ''}${c.nota ? `<div class="mods n">“${esc(c.nota)}”</div>` : ''}<span class="p">${pesos(c.precioU * c.cant)}</span></span><div class="stepper"><button data-k="${c.key}" data-c="-1" aria-label="Uno menos">${ic(c.cant === 1 ? 'cerrar' : 'menos', 18)}</button><b>${c.cant}</b><button data-k="${c.key}" data-c="1" aria-label="Uno más">${ic('mas', 18)}</button></div></div>`; }).join('')}
  ${bloqueSugerencia()}<div class="total"><span>Total</span><b>${pesos(totalCarrito())}</b></div><button class="btn" id="enviar">${ic('enviar', 20)} Enviar a la cocina</button>`;
  abrir(el);
  el.onclick = e => { const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.k) { const c = carrito.find(x => x.key === t.dataset.k); c.cant += +t.dataset.c; if (c.cant <= 0) carrito = carrito.filter(x => x !== c); guardarCarrito(); pintarTodo(); hojaPedido(); }
    if (t.dataset.sug) { agregarSug(t.dataset.sug, t); setTimeout(hojaPedido, 500); }
    if (t.id === 'enviar') enviar(); }; }
function enviar() { const items = carrito.map(c => { const p = porId(c.id); return { id: c.id, nombre: p.nombre, cant: c.cant, mods: c.mods, nota: c.nota, precio: c.precioU }; });
  const total = totalCarrito(); guardar(s => s.pedidos.push({ id: nuevoId(), sesion: SESION, mesa: MESA, items, total, estado: 'cocina', creado: Date.now() }));
  carrito = []; guardarCarrito(); const el = $('#hoja');
  el.innerHTML = `<div class="asa"></div><div class="exito"><span class="cir">${ic('check', 36)}</span><b>Ya está en la cocina</b><span>Lo ven en su pantalla ahora mismo.<br>Te avisamos cuando salga para tu mesa.</span></div><button class="btn borde" id="ok">Seguir mirando la carta</button>`;
  el.onclick = e => { if (e.target.closest('#ok')) cerrar(el); }; pintarTodo(); setTimeout(() => { if (el.classList.contains('ve') && el.querySelector('.exito')) cerrar(el); }, 3200); }

/* ---------- seguimiento ---------- */
function hojaSeguimiento(soloPintar = false) { const el = $('#hoja'); el.dataset.tipo = 'seguir'; const ps = misPedidos().filter(p => p.estado !== 'entregado' && !p.rapido).reverse();
  el.innerHTML = `<div class="asa"></div><h2>Tu pedido</h2><p class="sub">Mesa ${MESA}</p>` + ps.map(p => { const e = etapa(p); return `<div style="margin-top:18px"><p style="font-size:13px;color:var(--gris);margin-bottom:12px">${p.items.map(i => `${i.cant} ${esc(i.nombre)}`).join(' · ')} · ${hace(p.creado)}</p><div class="pasos">${ETAPAS.map(([t, s], i) => `<div class="paso ${i < e || e === 2 ? 'ok' : i === e ? 'ya' : ''}"><span class="bol">${i < e || e === 2 ? ic('check', 14) : ''}</span><span><b>${t}</b><span>${i === e ? s : ''}</span></span></div>`).join('')}</div></div>`; }).join('<hr style="border:0;border-top:1.5px solid var(--linea)">') + `<button class="btn borde" id="ok" style="margin-top:8px">Listo</button>`;
  el.onclick = e => { if (e.target.closest('#ok')) cerrar(el); }; if (!soloPintar) abrir(el); }

/* ---------- cuenta: propina, dividir y medio de pago ---------- */
let propina = 10, medio = 'cel', partes = 1;
function abrirCuenta() { const el = $('#cuenta'); const items = misPedidos().flatMap(p => p.items); const sub = items.reduce((a, i) => a + i.precio * i.cant, 0);
  const prop = Math.round(sub * propina / 100), tot = sub + prop, parte = Math.ceil(tot / partes);
  el.innerHTML = `<div class="top-bar"><button class="volver" data-cerrar aria-label="Volver">${ic('atras')}</button><h1>La cuenta<small>Mesa ${MESA}</small></h1><span></span></div><div class="bloque">
  ${items.length ? items.map(i => `<div class="item"><span class="tx"><b>${i.cant > 1 ? i.cant + ' × ' : ''}${esc(i.nombre)}</b>${i.mods.length ? `<div class="mods">${i.mods.map(esc).join(' · ').toUpperCase()}</div>` : ''}</span><span class="p">${pesos(i.precio * i.cant)}</span></div>`).join('') : `<p class="gris" style="padding:30px 0;text-align:center">Todavía no mandaste nada a la cocina.</p>`}
  ${carrito.length ? `<p style="margin-top:12px;font-size:13px;color:var(--terra)">Tenés ${cantCarrito()} sin enviar en tu pedido: no están en la cuenta.</p>` : ''}
  ${items.length ? `<div class="grupo"><h3>Propina para el equipo</h3><div class="chips">${[0, 10, 15].map(v => `<button data-prop="${v}" class="${v === propina ? 'on' : ''}">${v ? v + ' %' : 'Sin propina'}</button>`).join('')}</div></div>
  <div class="grupo"><h3>¿La dividen?</h3><div class="dividir"><span>${partes === 1 ? 'Paga una sola persona' : `Entre ${partes} personas`}</span><div class="stepper"><button data-partes="-1" aria-label="Menos personas">${ic('menos', 18)}</button><b>${partes}</b><button data-partes="1" aria-label="Más personas">${ic('mas', 18)}</button></div></div></div>
  <div class="item" style="border:0;padding-top:18px"><span class="tx gris">Consumo</span><span class="p">${pesos(sub)}</span></div><div class="item" style="padding-top:0"><span class="tx gris">Propina</span><span class="p">${prop ? pesos(prop) : '—'}</span></div>
  <div class="total"><span>${partes > 1 ? `Total · cada uno ${pesos(parte)}` : 'Total'}</span><b>${pesos(tot)}</b></div>
  <div class="grupo" style="margin-top:6px"><h3>¿Cómo pagás?</h3>
  ${[['cel', 'celular', 'Desde el celular', 'Mercado Pago o tarjeta, sin esperar'], ['posnet', 'tarjeta', 'Con el mozo', 'Te trae el posnet a la mesa'], ['efectivo', 'billete', 'Efectivo', 'Te traemos la cuenta impresa']].map(([k, i, t, s]) => `<button class="medio" role="radio" data-medio="${k}" aria-checked="${medio === k}">${ic(i)}<span><b>${t}</b><span>${s}</span></span><span class="mk"></span></button>`).join('')}</div>` : ''}
  </div><div class="pie">${items.length ? `<button class="btn" id="pagar">${medio === 'cel' ? (partes > 1 ? `Pagar mi parte · ${pesos(parte)}` : `Pagar ${pesos(tot)}`) : 'Avisarle al mozo'}</button>` : `<button class="btn borde" data-cerrar>Volver a la carta</button>`}</div>`;
  if (!el.classList.contains('ve')) abrir(el);
  el.onclick = e => { const t = e.target.closest('button'); if (!t) return; if (t.hasAttribute('data-cerrar')) return cerrar(el);
    if (t.dataset.prop) { propina = +t.dataset.prop; abrirCuenta(); }
    if (t.dataset.partes) { partes = Math.max(1, Math.min(12, partes + +t.dataset.partes)); abrirCuenta(); }
    if (t.dataset.medio) { medio = t.dataset.medio; abrirCuenta(); }
    if (t.id === 'pagar') pagar(tot, parte); }; }
function pagar(tot, parte) { const b = $('#pagar'); b.disabled = true;
  const cerrarMesa = s => s.pedidos.forEach(p => { if (p.sesion === SESION) { p.estado = 'entregado'; p.pagado = tot; } });
  if (medio === 'cel') { b.textContent = 'Procesando…'; setTimeout(() => { guardar(cerrarMesa); exitoCuenta('Pago aprobado', partes > 1 ? `Pagaste tu parte: ${pesos(parte)}. Los demás pagan escaneando la mesa con su celular.` : `${pesos(tot)} · te llega el comprobante por WhatsApp`); }, 1300); }
  else { guardar(s => { s.llamados.push({ id: nuevoId(), sesion: SESION, mesa: MESA, tipo: 'cuenta', medio, partes, total: tot, ts: Date.now(), atendido: false }); cerrarMesa(s); }); exitoCuenta('El mozo ya viene', (medio === 'posnet' ? 'Con el posnet' : 'Con la cuenta impresa') + (partes > 1 ? `, dividida en ${partes}` : '')); } }
function exitoCuenta(t, s) { const el = $('#cuenta'); el.innerHTML = `<div class="bloque" style="padding-top:12vh"><div class="exito"><span class="cir">${ic('check', 36)}</span><b>${t}</b><span>${s}</span></div><button class="btn" id="seguir" style="margin-top:20px">Seguir</button></div>`;
  el.onclick = e => { if (e.target.closest('#seguir')) { cerrarEl(el); history.replaceState(null, ''); abrirGracias(); } }; pintarTodo(); }

/* ---------- gracias: datos, sellos y reseña ---------- */
let estrellas = 0, datosOk = false, promos = true;
function abrirGracias() { const el = $('#gracias');
  el.innerHTML = `<header class="cab"><div class="marca"><b>La Esquina</b><small>Bodegón · desde 1987</small></div></header><div class="bloque" style="padding-bottom:40px">
  <h2 class="serif" style="font-size:27px;margin-top:14px">Gracias por venir</h2><p class="gris" style="font-size:14px;margin-top:4px">Dejá tus datos, sumá tu sello y te avisamos las promos de la casa.</p>
  <div id="formDatos">${datosOk ? '' : `<label class="campo"><span>Nombre</span><input id="dNom" autocomplete="given-name" maxlength="30"></label><label class="campo"><span>WhatsApp</span><input id="dTel" inputmode="tel" autocomplete="tel" maxlength="20"></label>
  <button class="casilla" id="dProm" role="checkbox" aria-checked="${promos}"><i>${ic('check', 18)}</i>Quiero recibir promos</button><button class="btn" id="dOk" style="margin-top:20px">Guardar y sumar mi sello</button>`}</div>
  <div class="tarjeta-casa"><header><b>Tarjeta de la casa</b><span id="nSellos">${sellos} de 6</span></header><div class="sellos" id="sellos"></div><p>Al sexto, la casa te invita una copa.</p></div>
  <h3 class="serif" style="font-size:21px;margin-top:30px">¿Cómo estuvo?</h3><div class="estrellas" id="estr">${[1, 2, 3, 4, 5].map(i => `<button data-e="${i}" aria-label="${i} de 5">${ic('estrella', 34)}</button>`).join('')}</div><div id="resena"></div>
  <button class="btn borde" id="gVolver" style="margin-top:30px">Volver a la carta</button><button id="gReset" style="display:block;margin:22px auto 0;font-size:13px;color:var(--gris);text-decoration:underline">Empezar la demo de nuevo</button></div>`;
  pintarSellos(); pintarEstrellas(); abrir(el);
  el.onclick = e => { const t = e.target.closest('button'); if (!t) return;
    if (t.id === 'dProm') { promos = !promos; t.setAttribute('aria-checked', promos); }
    if (t.id === 'dOk') { const n = $('#dNom').value.trim(), tel = $('#dTel').value.trim(); if (!n) { $('#dNom').focus(); aviso('Poné tu nombre para sumar el sello', 'nota'); return; }
      guardar(s => s.clientes.unshift({ nombre: n, tel, promos, ts: Date.now(), visitas: 1, sellos: sellos + 1 })); datosOk = true; sellos = Math.min(6, sellos + 1); ls.set('laesquina-sellos', sellos);
      $('#formDatos').innerHTML = `<p style="margin-top:18px;font-size:15px;color:var(--verde);font-weight:600;display:flex;gap:8px;align-items:center">${ic('check', 20)} Listo, ${esc(n)}. Sumaste un sello.</p>`; pintarSellos(true); }
    if (t.dataset.e) { estrellas = +t.dataset.e; pintarEstrellas(); }
    if (t.id === 'rGoogle') { guardar(s => s.resenas.unshift({ estrellas, texto: '', publica: true, ts: Date.now() })); t.disabled = true; t.textContent = 'Gracias por tu reseña'; aviso('En el restaurante real, esto abre su ficha de Google', 'estrella'); }
    if (t.id === 'rPriv') { const tx = $('#rTxt').value.trim(); guardar(s => s.resenas.unshift({ estrellas, texto: tx, publica: false, ts: Date.now() })); $('#resena').innerHTML = `<p style="margin-top:14px;font-size:15px;color:var(--verde);font-weight:600">Le llegó al dueño. Gracias por decírnoslo.</p>`; }
    if (t.id === 'gVolver') cerrar(el);
    if (t.id === 'gReset') { reiniciar(); ['laesquina-carrito', 'laesquina-sellos', 'laesquina-sesion'].forEach(k => { try { localStorage.removeItem(k); } catch {} }); try { sessionStorage.clear(); } catch {} location.href = location.pathname + (MESA !== '7' ? `?mesa=${MESA}` : ''); } }; }
function pintarSellos(nuevo) { $('#sellos').innerHTML = Array.from({ length: 6 }, (_, i) => `<span class="sello ${i < sellos ? 'on' : ''} ${nuevo && i === sellos - 1 ? 'nuevo' : ''}" style="${i < sellos ? `transform:rotate(${-17 + i * 13}deg)` : ''}">${i < sellos ? 'LE' : ''}</span>`).join(''); $('#nSellos').textContent = `${sellos} de 6`; }
function pintarEstrellas() { document.querySelectorAll('#estr button').forEach(b => b.classList.toggle('on', +b.dataset.e <= estrellas)); const r = $('#resena'); if (!estrellas) { r.innerHTML = ''; return; }
  r.innerHTML = estrellas >= 4 ? `<button class="btn borde" id="rGoogle" style="margin-top:14px">Publicar reseña en Google</button>` : `<p class="gris" style="font-size:14px;margin-top:10px">Contanos qué pasó. Le llega directo al dueño, no se publica.</p><textarea class="nota" id="rTxt" maxlength="300" placeholder="Lo que tendríamos que mejorar"></textarea><button class="btn" id="rPriv" style="margin-top:12px">Mandárselo a la casa</button>`; }

/* ---------- todo junto ---------- */
function pintarTodo() { const y = scrollY; pintarCarta(); pintarEstado(); pintarBarra(); observar(); scrollTo(0, y); }
for (const l of misLlamados()) vistos.llamado[l.id] = !!l.atendido; for (const p of misPedidos()) vistos.etapa[p.id] = etapa(p);
alCambiar(() => { pintarTodo(); if (hojaAbierta('seguir')) hojaSeguimiento(true); if (hojaAbierta('rapidos')) hojaRapidos(true); });
pintarTodo();
