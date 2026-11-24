// App del cliente: carta, cuenta, ronda, pago y seguimiento del turno.
const $ = (s, el = document) => el.querySelector(s);
const pesos = n => '$' + Math.round(n).toLocaleString('es-AR');
const CATS = [['tragos', 'Tragos'], ['baldes', 'Baldes'], ['cervezas', 'Cervezas'], ['shots', 'Shots'], ['sin-alcohol', 'Sin alcohol']];
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const leer = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };

let carta = { productos: [], happy: {}, mas_pedidos: [] };
let ronda = new Map(leer('tb_ronda', []));
let cuenta = null;           // { nombre, tipo, contacto, bienvenida, bienvenida_pct }
let pedidos = [];            // pedidos de la cuenta (del servidor)
let sugerencia = null, sumarSug = false, medio = leer('tb_medio', 'mercadopago'), repetida = false;
let fuentePedido = null, pedidoActual = null;

const prod = id => carta.productos.find(p => p.id === id);
const api = async (url, opt = {}) => {
  const r = await fetch(url, { credentials: 'same-origin', ...opt, headers: { 'Content-Type': 'application/json', ...(opt.headers || {}) } });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(d.error || 'No pudimos conectar con la barra. Revisá tu señal.'); e.status = r.status; e.datos = d; throw e; }
  return d;
};
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('ver'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('ver'), 2200); }
function vibrar(p) { try { navigator.vibrate && navigator.vibrate(p); } catch {} }
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Foto real del producto; si no carga, queda el vaso dibujado.
const foto = (p, cls = '') => p.foto ? `<span class="ph ${cls}"><img src="${p.foto}" alt="" loading="lazy" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false">${'<span hidden>' + vaso(p.vaso, p.color) + '</span>'}</span>` : `<span class="ph ${cls}">${vaso(p.vaso, p.color)}</span>`;

// ---------- carta ----------
async function cargarCarta() {
  carta = await api('/api/carta');
  for (const id of [...ronda.keys()]) if (!prod(id)) ronda.delete(id);
  guardar('tb_ronda', [...ronda]);
  $('#espera-min').textContent = carta.espera_min + ' min';
}
async function cargarCuenta() {
  try { cuenta = await api('/api/cuenta'); } catch { cuenta = null; }
  pintarCuenta();
  if (cuenta) pedidos = await api('/api/mis-pedidos').catch(() => []);
  const activos = pedidos.filter(p => ['pagado', 'preparando', 'listo'].includes(p.estado)).length;
  const i = $('#mis-n'); i.hidden = !activos; i.textContent = activos;
}
function pintarCuenta() {
  const b = $('#btn-cuenta');
  b.innerHTML = cuenta ? `<span class="ini">${esc(cuenta.nombre[0]).toUpperCase()}</span>` : '<span class="entrar">Entrar</span>';
  b.setAttribute('aria-label', cuenta ? `Tu cuenta, ${cuenta.nombre}` : 'Entrar o registrarte');
}
function precioHTML(p) {
  return p.precio_final < p.precio ? `<span class="precio oferta"><s>${pesos(p.precio)}</s>${pesos(p.precio_final)}</span>` : `<span class="precio">${pesos(p.precio)}</span>`;
}
function vistaCarta() {
  pedidoActual = null; if (fuentePedido) { fuentePedido.close(); fuentePedido = null; }
  const v = $('#vista'); const hh = carta.happy;
  let html = '';
  if (!cuenta) html += `<button class="promo" id="promo"><span class="pct">5%</span><span><b>Registrate una vez y pedí sin cargar nada.</b> Tenés 5% menos en tu primer pedido.</span><span class="flecha">→</span></button>`;
  if (hh.vigente) html += `<div class="happy"><span class="pct">−${hh.porcentaje}%</span><p><b>Happy hour en tragos.</b> El precio ya está aplicado.${hh.termina ? `<small id="hh-reloj">Termina en ${reloj(hh.termina)}</small>` : ''}</p></div>`;
  const ultimo = pedidos.find(p => p.items?.some(i => !i.es_sugerencia && prod(i.producto_id)));
  if (ultimo) {
    const disp = ultimo.items.filter(i => !i.es_sugerencia && prod(i.producto_id));
    const tot = disp.reduce((s, i) => s + prod(i.producto_id).precio_final * i.cantidad, 0);
    html += `<button class="repetir" id="repetir"><span class="mini">${disp.slice(0, 3).map(i => foto(prod(i.producto_id))).join('')}</span>
      <div><b>Otra igual</b><span>${disp.map(i => `${i.cantidad} ${esc(prod(i.producto_id).nombre)}`).join(' · ')}</span></div><em>${pesos(tot)}</em></button>`;
  }
  html += `<nav class="tabs" role="tablist">${CATS.filter(([c]) => carta.productos.some(p => p.categoria === c)).map(([c, n], i) => `<button class="tab" role="tab" data-cat="${c}" aria-selected="${i === 0}">${n}</button>`).join('')}</nav>`;
  for (const [c, n] of CATS) {
    const ps = carta.productos.filter(p => p.categoria === c); if (!ps.length) continue;
    html += `<h2 class="cat" id="cat-${c}">${n}</h2>${c === 'baldes' ? '<p class="cat-sub">Botella, mezcla y hielo en un balde. Te lo llevan o lo retirás.</p>' : ''}<div class="grilla ${c === 'baldes' ? 'ancha' : ''}">${ps.map(tarjeta).join('')}</div>`;
  }
  v.innerHTML = html;
  $('#promo')?.addEventListener('click', () => abrirRegistro());
  $('#repetir')?.addEventListener('click', () => { ronda = new Map(); ultimo.items.forEach(i => !i.es_sugerencia && prod(i.producto_id) && ronda.set(i.producto_id, i.cantidad)); repetida = true; guardar('tb_ronda', [...ronda]); pintarRonda(); abrirPagar(); });
  v.querySelectorAll('.tab').forEach(t => t.onclick = () => $('#cat-' + t.dataset.cat).scrollIntoView({ behavior: 'smooth' }));
  enlazarTarjetas(v); observarTabs(); pintarRonda();
}
function tarjeta(p) {
  const n = ronda.get(p.id) || 0; const fuego = carta.mas_pedidos.includes(p.id);
  return `<article class="prod ${n ? 'en-ronda' : ''} ${p.categoria === 'baldes' ? 'balde' : ''}" data-id="${p.id}" tabindex="0" aria-label="${esc(p.nombre)}, ${pesos(p.precio_final)}">
    ${n ? `<span class="cant">${n}</span>` : ''}
    ${fuego ? '<span class="tag fuego">Lo piden ahora</span>' : p.etiqueta ? `<span class="tag">${esc(p.etiqueta)}</span>` : ''}
    <div class="foto">${foto(p)}</div>
    <div class="txt"><h3>${esc(p.nombre)}</h3>${p.categoria === 'baldes' ? `<p class="inc">${esc(p.ingredientes.split(' · ').slice(0, 2).join(' + '))}</p>` : ''}
    <div class="pie">${precioHTML(p)}<button class="mas" aria-label="Sumar ${esc(p.nombre)}">+</button></div></div>
  </article>`;
}
function enlazarTarjetas(el) {
  el.querySelectorAll('.prod').forEach(b => {
    b.onclick = e => { if (e.target.closest('.mas')) sumar(b.dataset.id, 1); else abrirProducto(b.dataset.id); };
    b.onkeydown = e => { if (e.key === 'Enter') abrirProducto(b.dataset.id); };
  });
}
function observarTabs() {
  const tabs = [...document.querySelectorAll('.tab')];
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) tabs.forEach(t => { const on = t.dataset.cat === e.target.id.slice(4); t.setAttribute('aria-selected', on); if (on) t.scrollIntoView({ inline: 'center', block: 'nearest' }); });
  }), { rootMargin: '-70px 0px -70% 0px' });
  document.querySelectorAll('h2.cat').forEach(h => io.observe(h));
}
function reloj(fin) { const s = Math.max(0, Math.round((fin - Date.now()) / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }
setInterval(() => { const r = $('#hh-reloj'); if (r && carta.happy.termina) { r.textContent = 'Termina en ' + reloj(carta.happy.termina); if (carta.happy.termina < Date.now()) cargarCarta().then(vistaCarta); } }, 1000);

// ---------- ronda ----------
function sumar(id, n) {
  const v = Math.max(0, Math.min(20, (ronda.get(id) || 0) + n));
  v ? ronda.set(id, v) : ronda.delete(id);
  guardar('tb_ronda', [...ronda]); repetida = false;
  if (n > 0) { vibrar(12); toast(`${prod(id).nombre} a tu ronda`); }
  const card = document.querySelector(`.prod[data-id="${id}"]`);
  if (card) { const tmp = document.createElement('div'); tmp.innerHTML = tarjeta(prod(id)); card.replaceWith(tmp.firstElementChild); enlazarTarjetas(document.querySelector(`.prod[data-id="${id}"]`).parentElement); }
  pintarRonda();
}
const totalRonda = () => [...ronda].reduce((s, [id, n]) => s + (prod(id)?.precio_final || 0) * n, 0);
function pintarRonda() {
  const n = [...ronda.values()].reduce((a, b) => a + b, 0);
  $('#ronda-n').textContent = n; $('#ronda-total').textContent = pesos(totalRonda());
  $('#ronda').classList.toggle('visible', n > 0 && !pedidoActual);
}

// ---------- hojas ----------
function abrirHoja(html, etiqueta) {
  const h = $('#hoja'); h.innerHTML = `<div class="asa"></div><button class="cerrar" aria-label="Cerrar">×</button>` + html;
  h.setAttribute('aria-label', etiqueta); h.classList.add('abierta'); $('#velo').classList.add('abierto'); h.scrollTop = 0;
  h.querySelector('.cerrar').onclick = cerrarHoja; document.body.classList.add('sin-scroll');
  return h;
}
function cerrarHoja() { $('#hoja').classList.remove('abierta'); $('#velo').classList.remove('abierto'); document.body.classList.remove('sin-scroll'); }
$('#velo').onclick = cerrarHoja;
document.addEventListener('keydown', e => e.key === 'Escape' && cerrarHoja());

function abrirProducto(id) {
  const p = prod(id); const yaEsta = ronda.has(id); let n = Math.max(1, ronda.get(id) || 1);
  const h = abrirHoja(`<div class="det">
    <div class="det-foto">${foto(p)}</div>
    <h3>${esc(p.nombre)}</h3><p>${esc(p.descripcion)}</p>
    <div class="datos"><span>${esc(p.ingredientes)}</span>${p.ml ? `<span>${p.ml} ml</span>` : ''}${p.graduacion ? `<span>${p.graduacion}% alc.</span>` : '<span>Sin alcohol</span>'}</div>
    <div class="acc"><div class="paso"><button data-d="-1" aria-label="Uno menos">−</button><output id="det-n">${n}</output><button data-d="1" aria-label="Uno más">+</button></div>
    <button class="boton" id="det-ok"><span id="det-txt">${yaEsta ? 'Actualizar' : 'Sumar'}</span><span id="det-t">${pesos(p.precio_final * n)}</span></button></div></div>`, p.nombre);
  h.querySelectorAll('.paso button').forEach(b => b.onclick = () => { n = Math.max(yaEsta ? 0 : 1, Math.min(20, n + +b.dataset.d)); $('#det-n').textContent = n; $('#det-t').textContent = pesos(p.precio_final * n); $('#det-txt').textContent = n === 0 ? 'Sacar' : (yaEsta ? 'Actualizar' : 'Sumar'); });
  $('#det-ok').onclick = () => { sumar(id, n - (ronda.get(id) || 0)); cerrarHoja(); };
}

// ---------- registro ----------
let reg = { tipo: leer('tb_tipo', 'celular'), contacto: '', nueva: false, prueba: null, luego: null, espera: 0 };
function abrirRegistro(luego = null) {
  reg.luego = luego;
  // Sólo se ofrecen los canales que el boliche tiene configurados (en modo prueba, los dos)
  const can = carta.registro || { mail: true, celular: true, prueba: true };
  const ambos = can.prueba || (can.mail && can.celular);
  if (!ambos) reg.tipo = can.mail ? 'mail' : 'celular';
  const h = abrirHoja(`<div class="reg"><span class="sello">5% OFF</span><h4>Entrá una vez<br>y listo</h4>
    <p class="bajada">Te mandamos un código para confirmar que sos vos. Después pedís sin cargar nada y tenés <b>5% menos en tu primer pedido</b>.</p>
    ${ambos ? `<div class="seg" role="tablist" aria-label="Cómo querés entrar">
      <button role="tab" data-t="celular" aria-selected="${reg.tipo === 'celular'}">Celular</button><button role="tab" data-t="mail" aria-selected="${reg.tipo === 'mail'}">Mail</button></div>` : ''}
    <label class="campo"><span id="lbl-c"></span><input id="r-contacto"></label>
    <div id="r-err"></div>
    <button class="boton ancho" id="r-enviar">Mandame el código</button>
    <p class="aviso">Usamos tu ${reg.tipo === 'mail' ? 'mail' : 'celular'} sólo para avisarte cuando tu pedido esté listo y, si querés, de la próxima fiesta.</p></div>`, 'Entrar');
  const pint = () => {
    const i = $('#r-contacto'), cel = reg.tipo === 'celular';
    $('#lbl-c').textContent = cel ? 'Tu celular (con característica, sin 0 ni 15)' : 'Tu mail';
    Object.assign(i, { type: cel ? 'tel' : 'email', inputMode: cel ? 'tel' : 'email', autocomplete: cel ? 'tel-national' : 'email', placeholder: cel ? '351 555 1234' : 'nombre@mail.com', value: reg.contacto && (reg.contacto.includes('@') !== cel) ? reg.contacto : '' });
    h.querySelectorAll('.seg button').forEach(b => b.setAttribute('aria-selected', b.dataset.t === reg.tipo));
  };
  h.querySelectorAll('.seg button').forEach(b => b.onclick = () => { reg.tipo = b.dataset.t; guardar('tb_tipo', reg.tipo); pint(); $('#r-contacto').focus(); });
  pint();
  const enviar = async () => {
    const btn = $('#r-enviar'); btn.disabled = true; btn.textContent = 'Enviando…'; $('#r-err').innerHTML = '';
    try {
      reg.contacto = $('#r-contacto').value.trim();
      const r = await api('/api/cuenta/codigo', { method: 'POST', body: JSON.stringify({ tipo: reg.tipo, contacto: reg.contacto }) });
      reg.nueva = r.nueva; reg.prueba = r.codigo_prueba || null; reg.espera = Date.now() + 30e3; pasoCodigo();
    } catch (e) { $('#r-err').innerHTML = `<div class="error">${esc(e.message)}</div>`; btn.disabled = false; btn.textContent = 'Mandame el código'; }
  };
  $('#r-enviar').onclick = enviar; $('#r-contacto').onkeydown = e => e.key === 'Enter' && enviar();
}
function pasoCodigo() {
  const h = abrirHoja(`<div class="reg"><h4>Escribí<br>el código</h4>
    <p class="bajada">Te lo mandamos ${reg.tipo === 'mail' ? 'al mail' : 'por WhatsApp al'} <b>${esc(reg.contacto)}</b>.</p>
    ${reg.prueba ? `<button class="prueba" id="r-prueba">Modo prueba: tu código es <b>${reg.prueba}</b> · tocá para completarlo</button>` : ''}
    <label class="campo"><span>Código de 6 números</span><input id="r-codigo" class="codigo" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="······"></label>
    ${reg.nueva ? `<label class="campo"><span>Tu nombre (así te llaman en la barra)</span><input id="r-nombre" autocomplete="given-name" maxlength="30"></label>
      <label class="check"><input type="checkbox" id="r-avisos" checked><span>Avisame de la próxima fiesta</span></label>` : ''}
    <div id="r-err"></div>
    <button class="boton ancho" id="r-ok">${reg.nueva ? 'Crear mi cuenta' : 'Entrar'}</button>
    <div class="r-links"><button id="r-volver">Cambiar ${reg.tipo === 'mail' ? 'mail' : 'celular'}</button><button id="r-reenviar"></button></div></div>`, 'Código');
  const cod = $('#r-codigo'); setTimeout(() => cod.focus(), 250);
  $('#r-prueba')?.addEventListener('click', () => { cod.value = reg.prueba; (reg.nueva ? $('#r-nombre') : $('#r-ok')).focus(); });
  $('#r-volver').onclick = () => abrirRegistro(reg.luego);
  const rr = $('#r-reenviar');
  const tic = () => { const s = Math.ceil((reg.espera - Date.now()) / 1000); rr.disabled = s > 0; rr.textContent = s > 0 ? `Reenviar en ${s} s` : 'Reenviar código'; if (s > 0 && document.body.contains(rr)) setTimeout(tic, 1000); };
  tic();
  rr.onclick = async () => { try { const r = await api('/api/cuenta/codigo', { method: 'POST', body: JSON.stringify({ tipo: reg.tipo, contacto: reg.contacto }) }); reg.prueba = r.codigo_prueba || null; reg.espera = Date.now() + 30e3; pasoCodigo(); toast('Te mandamos otro código'); } catch (e) { $('#r-err').innerHTML = `<div class="error">${esc(e.message)}</div>`; } };
  const ok = async () => {
    const btn = $('#r-ok'); btn.disabled = true; $('#r-err').innerHTML = '';
    try {
      cuenta = await api('/api/cuenta/verificar', { method: 'POST', body: JSON.stringify({ tipo: reg.tipo, contacto: reg.contacto, codigo: cod.value, nombre: $('#r-nombre')?.value, acepta_avisos: $('#r-avisos')?.checked }) });
      vibrar([15, 40, 15]); pintarCuenta(); cargarCuenta();
      toast(cuenta.bienvenida ? `¡Listo, ${cuenta.nombre}! Tenés 5% en tu primer pedido` : `¡Hola de nuevo, ${cuenta.nombre}!`);
      if (reg.luego) reg.luego(); else { cerrarHoja(); if (!pedidoActual) vistaCarta(); }
    } catch (e) { $('#r-err').innerHTML = `<div class="error">${esc(e.message)}</div>`; btn.disabled = false; }
  };
  $("#r-ok").onclick = ok; cod.oninput = () => { cod.value = cod.value.replace(/\D/g, ''); if (cod.value.length === 6 && !reg.nueva) ok(); };
}
function abrirCuenta() {
  if (!cuenta) return abrirRegistro();
  const h = abrirHoja(`<div class="reg"><h4>Hola,<br>${esc(cuenta.nombre)}</h4><p class="bajada">${esc(cuenta.contacto)}</p>
    ${cuenta.bienvenida ? '<div class="regalo"><span class="pct">5%</span><span>Tenés 5% menos en tu primer pedido. Se aplica solo al pagar.</span></div>' : ''}
    <button class="boton sec ancho" id="c-pedidos">Mis pedidos</button>
    <button class="r-salir" id="c-salir">Cerrar sesión</button></div>`, 'Tu cuenta');
  $('#c-pedidos').onclick = abrirPedidos;
  $('#c-salir').onclick = async () => { await api('/api/cuenta/salir', { method: 'POST' }).catch(() => {}); cuenta = null; pedidos = []; pintarCuenta(); cerrarHoja(); vistaCarta(); toast('Cerraste sesión'); };
}

// ---------- pagar ----------
async function abrirPagar() {
  if (!ronda.size) return;
  if (!cuenta) return abrirRegistro(abrirPagar);
  const items = [...ronda].map(([id, cantidad]) => ({ id, cantidad }));
  try { sugerencia = (await api('/api/sugerencia', { method: 'POST', body: JSON.stringify({ items }) })).sugerencia; } catch { sugerencia = null; }
  const h = abrirHoja(`<h4>Tu ronda</h4><div id="lineas"></div><div id="sug"></div>
    <div class="quien"><span class="ini">${esc(cuenta.nombre[0]).toUpperCase()}</span><div><b>${esc(cuenta.nombre)}</b><span>Te avisamos a ${esc(cuenta.contacto)}</span></div></div>
    <div class="medios" role="radiogroup" aria-label="Medio de pago">
      <label class="medio"><input type="radio" name="medio" value="mercadopago" ${medio === 'mercadopago' ? 'checked' : ''}><i style="background:#00B1EA;color:#fff">MP</i>Mercado Pago</label>
      <label class="medio"><input type="radio" name="medio" value="tarjeta" ${medio === 'tarjeta' ? 'checked' : ''}><i style="background:var(--ficha);color:var(--tinta)">VISA</i>Tarjeta</label>
    </div>
    <div class="desglose" id="desglose"></div>
    <div id="err"></div>
    <button class="boton ancho" id="btn-pagar">Pagar</button>
    <p class="aviso">${carta.pagos === 'demo' ? 'Modo prueba: el pago se confirma solo, no se cobra nada.' : 'Te llevamos a Mercado Pago y volvés acá con tu turno.'}</p>`, 'Tu ronda');
  h.querySelectorAll('[name=medio]').forEach(r => r.onchange = () => { medio = r.value; guardar('tb_medio', medio); });
  pintarLineas(); pintarSug();
  $('#btn-pagar').onclick = pagar;
}
function pintarLineas() {
  const el = $('#lineas'); if (!el) return;
  el.innerHTML = [...ronda].map(([id, n]) => { const p = prod(id); return `<div class="linea">${foto(p, 'chica')}<div class="nom">${esc(p.nombre)}<small>${pesos(p.precio_final)} c/u</small></div>
    <div class="paso"><button data-id="${id}" data-d="-1" aria-label="Uno menos">−</button><output>${n}</output><button data-id="${id}" data-d="1" aria-label="Uno más">+</button></div></div>`; }).join('');
  el.querySelectorAll('button').forEach(b => b.onclick = () => { sumar(b.dataset.id, +b.dataset.d); if (!ronda.size) { cerrarHoja(); return; } pintarLineas(); pintarTotal(); });
  pintarTotal();
}
function pintarSug() {
  const el = $('#sug'); if (!el) return;
  if (!sugerencia) { el.innerHTML = ''; return; }
  const s = sugerencia, p = prod(s.producto_id) || s;
  el.innerHTML = `<div class="sug ${sumarSug ? 'sumada' : ''}">${prod(s.producto_id) ? foto(p, 'chica') : vaso(s.vaso, s.color)}<div><b>${esc(s.texto)}</b><span>${s.cantidad} × ${pesos(s.precio_unit)} <s>${pesos(s.precio_lista)}</s> · ${s.porcentaje}% menos</span></div>
    <button id="btn-sug">${sumarSug ? 'Quitar' : 'Sumar'}</button></div>`;
  $('#btn-sug').onclick = () => { sumarSug = !sumarSug; vibrar(10); pintarSug(); pintarTotal(); };
}
function pintarTotal() {
  const lista = [...ronda].reduce((s, [id, n]) => s + prod(id).precio * n, 0);
  const sug = sumarSug && sugerencia ? sugerencia.precio_unit * sugerencia.cantidad : 0;
  let t = totalRonda() + sug;
  const ahorro = lista - totalRonda() + (sumarSug && sugerencia ? (sugerencia.precio_lista - sugerencia.precio_unit) * sugerencia.cantidad : 0);
  const bienv = cuenta?.bienvenida ? Math.floor(t * cuenta.bienvenida_pct / 100 / 100) * 100 : 0;
  t -= bienv;
  $('#desglose').innerHTML = `${ahorro > 0 ? `<div><span>Descuentos de la carta</span><span>−${pesos(ahorro)}</span></div>` : ''}
    ${bienv ? `<div class="verde"><span>Bienvenida 5%</span><span>−${pesos(bienv)}</span></div>` : ''}
    <div class="tot"><span>Total</span><span class="num">${pesos(t)}</span></div>`;
  $('#btn-pagar').textContent = `Pagar ${pesos(t)}`;
}
async function pagar() {
  const btn = $('#btn-pagar'), err = $('#err');
  btn.disabled = true; btn.textContent = 'Confirmando pago…'; err.innerHTML = '';
  try {
    const items = [...ronda].map(([id, cantidad]) => ({ id, cantidad }));
    const r = await api('/api/pedidos', { method: 'POST', body: JSON.stringify({ items, medio_pago: medio, sugerencia_aceptada: sumarSug && !!sugerencia, repetido: repetida }) });
    if (r.pago.modo === 'mercadopago') { location.href = r.pago.url; return; }
    await new Promise(ok => setTimeout(ok, 700));
    await api(`/api/pedidos/${r.id}/pago-demo`, { method: 'POST', body: JSON.stringify({ token: r.token }) });
    ronda.clear(); guardar('tb_ronda', []); sumarSug = false; repetida = false; if (cuenta) cuenta.bienvenida = false;
    cerrarHoja(); vibrar([20, 40, 20]); cargarCuenta(); verPedido(r.id, r.token, true);
  } catch (e) {
    if (e.status === 401) { cuenta = null; pintarCuenta(); return abrirRegistro(abrirPagar); }
    err.innerHTML = `<div class="error">${esc(e.message)}</div>`; btn.disabled = false; pintarTotal();
    if (/agot/i.test(e.message)) { await cargarCarta(); pintarLineas(); }
  }
}

// ---------- seguimiento ----------
const ESTADOS = { pagado: ['Pagado. Ya está en la barra', 1], preparando: ['Lo están armando', 2], listo: ['Listo para retirar', 3], entregado: ['Retirado', 3] };
async function verPedido(id, token, push) {
  if (push) history.pushState({}, '', `${location.pathname}?pedido=${id}&t=${token}`);
  let p; try { p = await api(`/api/pedidos/${id}?t=${token}`); } catch (e) { $('#vista').innerHTML = `<p class="vacio">${esc(e.message)}</p>`; return; }
  pedidoActual = { ...p, t: token }; pintarRonda(); window.scrollTo(0, 0);
  pintarPedido(pedidoActual);
  if (fuentePedido) fuentePedido.close();
  fuentePedido = new EventSource(`/api/en-vivo?rol=cliente&pedido=${id}&t=${token}`);
  fuentePedido.addEventListener('estado', ev => { const n = JSON.parse(ev.data); const antes = pedidoActual?.estado; pedidoActual = { ...pedidoActual, ...n }; pintarPedido(pedidoActual); if (n.estado === 'listo' && antes !== 'listo') listaYa(pedidoActual); });
  if (p.estado === 'listo') listaYa(p);
}
function pintarPedido(p) {
  const [txt, paso] = ESTADOS[p.estado] || ['Esperando el pago', 0];
  const cuenta_ = p.estado === 'pagado' || p.estado === 'preparando';
  $('#vista').innerHTML = `<div class="seg-p">
    <button class="volver" id="volver">← Volver a la carta</button>
    <article class="ficha turno" aria-live="polite">
      <div class="arriba"><div><div class="etq">Tu turno</div><div class="grande">${p.turno ?? '—'}</div></div>
      <div class="pin"><div class="etq">PIN de retiro</div><div class="num">${p.pin ?? '····'}</div></div></div>
      <div class="estado">${txt}</div>
      <div class="pasos">${[1, 2, 3].map(i => `<i class="${i < paso || p.estado === 'entregado' || (i === paso && p.estado === 'listo') ? 'on' : i === paso ? 'ahora' : ''}"></i>`).join('')}</div>
      <div class="troquel"></div>
      <ul>${p.items.map(i => `<li><span>${i.cantidad} × ${esc(i.nombre)}</span><span>${pesos(i.precio * i.cantidad)}</span></li>`).join('')}
      ${p.bienvenida ? `<li><span>Bienvenida 5%</span><span>−${pesos(p.bienvenida)}</span></li>` : ''}</ul>
      <div class="tot mono"><span>Pagado</span><span>${pesos(p.total)}</span></div>
    </article>
    ${p.barra ? `<div class="donde"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--uv)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
      <div><b>Retirás en ${esc(p.barra.nombre)}</b><span>${esc(p.barra.ubicacion)}${cuenta_ ? ` · falta${p.espera_min > 1 ? 'n' : ''} ~${p.espera_min} min${p.delante ? `, ${p.delante} pedido${p.delante > 1 ? 's' : ''} antes` : ''}` : ''}</span></div></div>` : ''}
    <div class="acciones">${cuenta_ ? '<p class="aviso">Volvé a la pista tranquilo: el celular vibra cuando esté lista.</p>' : ''}
      ${p.estado === 'entregado' ? '<button class="boton ancho" id="otra">Pedir otra igual</button>' : ''}</div></div>`;
  $('#volver').onclick = () => { history.pushState({}, '', location.pathname); vistaCarta(); };
  $('#otra')?.addEventListener('click', () => otraIgual(p));
}
function otraIgual(p) {
  ronda = new Map(); p.items.filter(i => !i.es_sugerencia && prod(i.producto_id)).forEach(i => ronda.set(i.producto_id, i.cantidad));
  repetida = true; guardar('tb_ronda', [...ronda]); history.pushState({}, '', location.pathname); vistaCarta(); abrirPagar();
}
function listaYa(p) {
  document.querySelector('.lista-ya')?.remove();
  vibrar([300, 120, 300, 120, 500]);
  try { const a = new AudioContext(), o = a.createOscillator(), g = a.createGain(); o.connect(g); g.connect(a.destination); o.frequency.value = 880; g.gain.setValueAtTime(.2, a.currentTime); g.gain.exponentialRampToValueAtTime(.001, a.currentTime + .6); o.start(); o.stop(a.currentTime + .6); } catch {}
  const el = document.createElement('div'); el.className = 'lista-ya'; el.setAttribute('role', 'alertdialog'); el.setAttribute('aria-label', 'Tu ronda está lista');
  el.innerHTML = `<div><h2>Tu ronda<br>está lista</h2><p>Andá a <b>${esc(p.barra?.nombre || 'la barra')}</b> y mostrá esta pantalla.</p></div>
    <div class="t">${p.turno}</div>
    <div><div class="bloque"><span>PIN de retiro</span><span class="num">${p.pin}</span></div>
    <button class="boton ancho">Listo, ya la tengo</button></div>`;
  el.querySelector('button').onclick = () => el.remove();
  document.body.appendChild(el);
}

// ---------- mis pedidos ----------
function abrirPedidos() {
  if (!cuenta) return abrirRegistro();
  abrirHoja(`<h4>Tus pedidos</h4>${pedidos.map(p => `<button class="linea ped" data-id="${p.id}" data-t="${p.t}">
    <span class="num">${p.turno ?? '—'}</span><span class="nom">${p.items.map(i => `${i.cantidad} ${esc(i.nombre)}`).join(', ')}<small>${(ESTADOS[p.estado] || ['Sin pagar'])[0]}</small></span><span>${pesos(p.total)}</span></button>`).join('') || '<p class="vacio">Todavía no pediste nada.</p>'}`, 'Tus pedidos');
  $('#hoja').querySelectorAll('.ped').forEach(b => b.onclick = () => { cerrarHoja(); verPedido(b.dataset.id, b.dataset.t, true); });
}
$('#btn-mis').onclick = () => cargarCuenta().then(abrirPedidos);
$('#btn-cuenta').onclick = abrirCuenta;

// ---------- tiempo real ----------
const vivo = new EventSource('/api/en-vivo?rol=cliente');
vivo.addEventListener('carta', async () => { await cargarCarta(); if (!pedidoActual) vistaCarta(); });
vivo.addEventListener('espera', ev => { $('#espera-min').textContent = JSON.parse(ev.data).minutos + ' min'; });
$('#btn-ronda').onclick = abrirPagar;
window.addEventListener('popstate', () => { const u = new URLSearchParams(location.search); u.get('pedido') ? verPedido(u.get('pedido'), u.get('t')) : vistaCarta(); });

(async () => {
  await Promise.all([cargarCarta().catch(e => { $('#vista').innerHTML = `<p class="vacio">${esc(e.message)}</p>`; }), cargarCuenta()]);
  const u = new URLSearchParams(location.search);
  if (u.get('pedido')) verPedido(u.get('pedido'), u.get('t')); else vistaCarta();
  setInterval(cargarCuenta, 30000);
})();
