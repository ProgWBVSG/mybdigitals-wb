// Pantalla de la barra: los pedidos llegan pagados; el bartender sólo arma y entrega.
const $ = (s, el = document) => el.querySelector(s);
let pin = sessionStorage.getItem('tb_pin_barra') || '';
let barraId = new URLSearchParams(location.search).get('barra') || localStorage.getItem('tb_barra') || '1';
let datos = null, fuente = null, vistos = new Set();
const prods = () => Object.fromEntries((datos?.productos || []).map(p => [p.id, p]));

const api = async (url, opt = {}) => {
  const r = await fetch(url, { ...opt, headers: { 'Content-Type': 'application/json', 'x-pin': pin, ...(opt.headers || {}) } });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(d.error || 'Sin conexión con el servidor.'); e.status = r.status; throw e; }
  return d;
};
const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

function pantallaPin(msg = '') {
  $('#raiz').innerHTML = `<div class="login"><div class="caja"><img src="/demos/pumkers/pumkers/logo.png" alt="Pumker’s Cocktails" style="width:150px;display:block;margin:0 auto 10px"><h3>Barra</h3><p>Ingresa el PIN de la barra. En la demo es 1234.</p>
    <div class="digitos" id="dig">${'<span></span>'.repeat(4)}</div><div class="msg">${msg}</div>
    <div class="teclado">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map(k => `<button ${k === '' ? 'disabled style="visibility:hidden"' : ''} data-k="${k}">${k}</button>`).join('')}</div></div></div>`;
  teclado($('#raiz'), async v => { pin = v; try { await cargar(); sessionStorage.setItem('tb_pin_barra', pin); armar(); conectar(); } catch (e) { pantallaPin(e.status === 401 ? 'PIN incorrecto.' : e.message); } });
}
function teclado(el, alCompletar) {
  let v = '';
  const pintar = () => el.querySelectorAll('.digitos span').forEach((s, i) => { s.textContent = v[i] ? '•' : ''; s.classList.toggle('on', i === v.length); });
  const tecla = k => { if (k === '⌫') v = v.slice(0, -1); else if (/\d/.test(k) && v.length < 4) v += k; pintar(); if (v.length === 4) { const x = v; v = ''; setTimeout(() => { pintar(); alCompletar(x); }, 120); } };
  el.querySelectorAll('.teclado button').forEach(b => b.onclick = () => tecla(String(b.dataset.k)));
  el._tecla = tecla; pintar();
}
document.addEventListener('keydown', e => {
  const m = $('#modal'); const destino = !m.hidden ? $('#caja') : $('.login');
  if (destino?._tecla && (/^\d$/.test(e.key) || e.key === 'Backspace')) destino._tecla(e.key === 'Backspace' ? '⌫' : e.key);
  if (e.key === 'Escape') cerrarModal();
});

async function cargar() { datos = await api(`/api/barra/${barraId}`); }

function armar() {
  localStorage.setItem('tb_barra', barraId);
  $('#raiz').innerHTML = `<header class="top">
      <img src="/demos/pumkers/pumkers/marca.png" alt="Pumker’s" style="height:34px;width:auto;filter:drop-shadow(0 0 10px rgba(242,242,242,.45))">
      <h1>${datos.barra.nombre}</h1>
      <select id="sel-barra" aria-label="Cambiar de barra">${datos.barras.map(b => `<option value="${b.id}" ${b.id == barraId ? 'selected' : ''}>${b.nombre}</option>`).join('')}</select>
      <span style="display:flex;align-items:center;gap:6px;color:var(--gris);font-size:.85rem"><span class="punto"></span>En vivo</span>
      <div class="met"><div><small>En cola</small><b id="m-cola">0</b></div><div><small>Entregados hoy</small><b id="m-hechos">0</b></div><div><small>Espera media</small><b id="m-espera">–</b></div>
      <label class="buscar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="buscar" inputmode="numeric" placeholder="Turno" aria-label="Buscar turno para entregar"></label>
      <button class="boton sec" id="btn-agot">Agotados</button></div>
    </header>
    <div class="armar" id="armar"></div>
    <main class="tablero">
      <section class="col"><h2>Nuevos <i id="n-pagado">0</i></h2><div class="lista" id="c-pagado"></div></section>
      <section class="col"><h2>Armando <i id="n-preparando">0</i></h2><div class="lista" id="c-preparando"></div></section>
      <section class="col retirar"><h2>Para retirar <i id="n-listo">0</i></h2><div class="lista" id="c-listo"></div></section>
    </main>`;
  $('#sel-barra').onchange = async e => { barraId = e.target.value; await cargar(); armar(); conectar(); };
  $('#btn-agot').onclick = abrirAgotados;
  $('#buscar').onkeydown = e => { if (e.key === 'Enter') { const p = datos.pedidos.find(x => String(x.turno) === e.target.value.trim()); e.target.value = ''; if (p && p.estado === 'listo') pedirPin(p); else if (p) aviso(`El turno ${p.turno} todavía no está listo.`); else aviso('Ese turno no está en esta barra.'); } };
  datos.pedidos.forEach(p => vistos.add(p.id));
  pintar();
}

function comanda(p) {
  const P = prods();
  const seg = (Date.now() - p.pagado) / 1000;
  const cls = p.estado === 'listo' ? '' : seg > 360 ? 'tarde' : seg > 180 ? 'medio' : '';
  const accion = { pagado: ['b-empezar', 'Empezar', 'preparando'], preparando: ['b-listo', 'Listo', 'listo'], listo: ['b-entregar', 'Entregar', 'entregado'] }[p.estado];
  const atras = { preparando: 'pagado', listo: 'preparando' }[p.estado];
  return `<article class="ficha comanda ${vistos.has(p.id) ? '' : 'nueva'}" data-id="${p.id}">
    <div class="cab"><div><div class="t">${p.turno}</div><div class="quien">${p.nombre}</div></div>
    <span class="reloj ${cls}" data-desde="${p.estado === 'listo' ? p.listo : p.pagado}">${mmss(Math.max(0, (Date.now() - (p.estado === 'listo' ? p.listo : p.pagado)) / 1000))}</span></div>
    <div class="troquel"></div>
    <ul>${p.items.map(i => `<li class="${i.es_sugerencia ? 'sug' : ''}"><b>${i.cantidad}</b>${P[i.producto_id] ? vaso(P[i.producto_id].vaso, P[i.producto_id].color) : ''}${i.nombre}</li>`).join('')}</ul>
    <div class="acc">${atras ? `<button class="boton b-atras" data-a="${atras}" aria-label="Volver un paso">↶</button>` : ''}<button class="boton ${accion[0]}" data-a="${accion[2]}">${accion[1]}</button></div>
  </article>`;
}
function pintar() {
  const ped = datos.pedidos;
  for (const e of ['pagado', 'preparando', 'listo']) {
    const l = ped.filter(p => p.estado === e);
    $('#c-' + e).innerHTML = l.map(comanda).join('') || `<div class="vacia">${{ pagado: 'Sin pedidos nuevos. Llegan solos, ya pagados.', preparando: 'Toca “Empezar” en un pedido nuevo.', listo: 'Cuando esté armado, toca “Listo” y al cliente le vibra el celular.' }[e]}</div>`;
    $('#n-' + e).textContent = l.length;
  }
  ped.forEach(p => vistos.add(p.id));
  // Lo que hay que armar ahora, sumado: el bartender prepara en tanda.
  const suma = {}; const P = prods();
  ped.filter(p => p.estado !== 'listo').forEach(p => p.items.forEach(i => { suma[i.producto_id] = (suma[i.producto_id] || 0) + i.cantidad; }));
  const orden = Object.entries(suma).sort((a, b) => b[1] - a[1]);
  $('#armar').innerHTML = `<span>Para armar ahora</span>` + (orden.length ? orden.map(([id, n]) => `<span class="chip">${P[id] ? vaso(P[id].vaso, P[id].color) : ''}<b>${n}</b><span>${P[id]?.nombre || id}</span></span>`).join('') : '<span style="color:var(--gris)">Nada pendiente.</span>');
  $('#m-cola').textContent = ped.filter(p => p.estado !== 'listo').length;
  $('#m-hechos').textContent = datos.resumen?.n || 0;
  $('#m-espera').textContent = datos.resumen?.espera ? mmss(datos.resumen.espera) : '–';
  document.querySelectorAll('.comanda [data-a]').forEach(b => b.onclick = () => {
    const p = datos.pedidos.find(x => x.id === b.closest('.comanda').dataset.id);
    if (b.dataset.a === 'entregado') pedirPin(p); else mover(p, b.dataset.a);
  });
}
setInterval(() => document.querySelectorAll('.reloj[data-desde]').forEach(r => {
  const s = (Date.now() - +r.dataset.desde) / 1000; r.textContent = mmss(Math.max(0, s));
  if (!r.closest('.retirar')) { r.classList.toggle('medio', s > 180 && s <= 360); r.classList.toggle('tarde', s > 360); }
}), 1000);

async function mover(p, estado, pinCliente) {
  try {
    const n = await api(`/api/barra/pedidos/${p.id}`, { method: 'POST', body: JSON.stringify({ estado, pin: pinCliente }) });
    aplicar(n); return true;
  } catch (e) { aviso(e.message); return false; }
}
function aplicar(n) {
  if (!datos) return;
  const i = datos.pedidos.findIndex(x => x.id === n.id);
  if (n.estado === 'entregado' || String(n.barra_id) !== String(barraId)) { if (i >= 0) datos.pedidos.splice(i, 1); }
  else if (i >= 0) datos.pedidos[i] = n; else { datos.pedidos.push(n); sonar(); }
  datos.pedidos.sort((a, b) => a.pagado - b.pagado);
  pintar();
}
function sonar() { try { const a = new AudioContext(); [660, 990].forEach((f, k) => { const o = a.createOscillator(), g = a.createGain(); o.connect(g); g.connect(a.destination); o.frequency.value = f; g.gain.setValueAtTime(.15, a.currentTime + k * .12); g.gain.exponentialRampToValueAtTime(.001, a.currentTime + k * .12 + .25); o.start(a.currentTime + k * .12); o.stop(a.currentTime + k * .12 + .3); }); } catch {} }

function pedirPin(p) {
  abrirModal(`<h3>Entregar ${p.turno}</h3><p>${p.nombre} te muestra un PIN de 4 números en su celular. Escribilo acá.</p>
    <div class="digitos">${'<span></span>'.repeat(4)}</div><div class="msg" id="msg-pin"></div>
    <div class="teclado">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map(k => `<button ${k === '' ? 'disabled style="visibility:hidden"' : ''} data-k="${k}">${k}</button>`).join('')}</div>`);
  teclado($('#caja'), async v => {
    const ok = await mover(p, 'entregado', v);
    if (ok) { cerrarModal(); datos.resumen.n = (datos.resumen.n || 0) + 1; pintar(); } else $('#msg-pin').textContent = 'El PIN no coincide. Pedile que te muestre la pantalla de nuevo.';
  });
}
function abrirAgotados() {
  abrirModal(`<h3>Agotados</h3><p>Lo que apagas deja de aparecer en la carta al instante.</p>
    <div class="agot">${datos.productos.map(p => `<label><span>${p.nombre} <small>${p.categoria}</small></span><input type="checkbox" data-id="${p.id}" ${p.disponible ? 'checked' : ''} aria-label="${p.nombre} disponible"></label>`).join('')}</div>
    <button class="boton" style="width:100%" id="ok-agot">Listo</button>`);
  $('#caja').querySelectorAll('input').forEach(i => i.onchange = async () => {
    try { await api(`/api/productos/${i.dataset.id}/disponible`, { method: 'POST', body: JSON.stringify({ disponible: i.checked }) }); datos.productos.find(p => p.id === i.dataset.id).disponible = i.checked ? 1 : 0; }
    catch (e) { i.checked = !i.checked; aviso(e.message); }
  });
  $('#ok-agot').onclick = cerrarModal;
}
function abrirModal(html) { $('#caja').innerHTML = html; $('#modal').hidden = false; }
function cerrarModal() { $('#modal').hidden = true; $('#caja')._tecla = null; }
$('#modal').onclick = e => { if (e.target.id === 'modal') cerrarModal(); };
function aviso(t) { const d = document.createElement('div'); d.textContent = t; d.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:60;background:var(--ficha);color:var(--tinta);font-weight:600;padding:12px 18px;border-radius:12px;max-width:90vw'; document.body.appendChild(d); setTimeout(() => d.remove(), 2600); }

function conectar() {
  if (fuente) fuente.close();
  fuente = new EventSource(`/api/en-vivo?rol=barra&barra=${barraId}&pin=${encodeURIComponent(pin)}`);
  fuente.addEventListener('pedido', ev => aplicar(JSON.parse(ev.data)));
  fuente.onerror = () => { /* el navegador reintenta solo */ };
}

(async () => {
  if (!pin) return pantallaPin();
  try { await cargar(); armar(); conectar(); } catch (e) { pantallaPin(e.status === 401 ? 'PIN incorrecto.' : e.message); }
})();
