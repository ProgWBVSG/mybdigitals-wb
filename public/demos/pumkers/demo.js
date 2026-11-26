/* Pumker’s Cocktails · demo de prueba (todo corre en el navegador, sin servidor).
   Reemplaza fetch('/api/...') y EventSource('/api/en-vivo') por una copia de la lógica del servidor real (server.js + cuentas.js).
   El estado vive en localStorage y se comparte entre pestañas del mismo navegador (BroadcastChannel): abrí cliente, barra y dueño en pestañas distintas.
   Los números del panel del dueño son datos de ejemplo guardados en datos-demo.json. Nada se cobra ni se envía. */
(() => {
  const BASE = new URL('.', document.currentScript.src).pathname;           // p. ej. /demos/pumkers/
  const KEY = 'pumkers_demo_v1', PIN_BARRA = '1234', BIENVENIDA_PCT = 5, CATEGORIAS = ['tragos', 'baldes', 'cervezas', 'shots', 'sin-alcohol'], VASOS = ['largo', 'balon', 'bajo', 'shot', 'porron', 'pinta', 'lata', 'balde', 'botella', 'hampagne'];
  const ch = new BroadcastChannel('pumkers-demo'), oyentes = new Set();
  const ahora = () => Date.now(), uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + ahora());
  const hex = n => Array.from(crypto.getRandomValues(new Uint8Array(n)), b => b.toString(16).padStart(2, '0')).join('');
  const nocheDe = ms => new Date(ms - 8 * 3600e3).toLocaleDateString('sv-SE');
  const fotoUrl = f => f && f.startsWith('/fotos/') ? BASE + f.slice(1) : f;

  const cargaDatos = fetch(BASE + 'datos-demo.json').then(r => r.text()).then(t => JSON.parse(t.replaceAll('"/fotos/', '"' + BASE + 'fotos/')));
  let DATOS = null;
  async function estado() {
    DATOS = DATOS || await cargaDatos;
    let s = null; try { s = JSON.parse(localStorage.getItem(KEY)); } catch {}
    if (!s || s.v !== DATOS.generado) {
      s = { v: DATOS.generado, productos: DATOS.productos.map(({ unidades, ganancia, ...p }) => ({ ...p, foto: fotoUrl(p.foto) })), ventas: Object.fromEntries(DATOS.productos.map(p => [p.id, { unidades: p.unidades, ganancia: p.ganancia }])),
        barras: DATOS.barras, pedidos: [], cuentas: [], codigos: {}, sesion: null, happy: DATOS.happy };
      guardar(s);
    }
    return s;
  }
  const guardar = s => localStorage.setItem(KEY, JSON.stringify(s));

  /* ---------- tiempo real: mismos eventos que el servidor, entre pestañas ---------- */
  const coincide = (o, d) => d.todos || (d.rol === 'dueno' && o.rol === 'dueno') || (d.rol === 'cliente' && o.rol === 'cliente') || (d.pedido && o.pedido === d.pedido) || (d.barra !== undefined && o.rol === 'barra' && (!o.barra || o.barra == d.barra));
  function repartir(ev, datos, dest) { for (const f of oyentes) if (coincide(f.o, dest)) f.disparar(ev, datos); }
  function emitir(ev, datos, ...dests) { for (const d of dests) { repartir(ev, datos, d); ch.postMessage({ ev, datos, dest: d }); } }
  ch.onmessage = e => repartir(e.data.ev, e.data.datos, e.data.dest);
  class FakeES {
    constructor(url) { const u = new URL(url, location.href).searchParams; this.o = { rol: u.get('rol') || 'cliente', barra: u.get('barra'), pedido: u.get('pedido') || null }; this.l = {}; this.readyState = 1; oyentes.add(this); }
    addEventListener(t, f) { (this.l[t] = this.l[t] || []).push(f); }
    disparar(ev, datos) { const e = { data: JSON.stringify(datos), type: ev }; (this.l[ev] || []).forEach(f => f(e)); if (this['on' + ev]) this['on' + ev](e); }
    close() { oyentes.delete(this); this.readyState = 2; }
  }
  const EsReal = window.EventSource;
  window.EventSource = function (url, o) { return String(url).includes('/api/en-vivo') ? new FakeES(url) : new EsReal(url, o); };

  /* ---------- lógica del servidor ---------- */
  const err = (m, st = 400, extra) => { const e = new Error(m); e.st = st; Object.assign(e, extra || {}); return e; };
  function happyHour(s, ms = ahora()) {
    const h = s.happy, d = new Date(ms), min = d.getHours() * 60 + d.getMinutes(), [dh, dm] = h.desde.split(':').map(Number), [hh, hm] = h.hasta.split(':').map(Number), a = dh * 60 + dm, b = hh * 60 + hm;
    const dentro = a <= b ? (min >= a && min < b) : (min >= a || min < b), activo = h.activo && (h.forzado || dentro); let termina = null;
    if (activo && !h.forzado) { const t = new Date(d); t.setHours(hh, hm, 0, 0); if (t <= d) t.setDate(t.getDate() + 1); termina = t.getTime(); }
    return { ...h, vigente: activo, termina };
  }
  const precioFinal = (p, hh) => hh.vigente && hh.categorias.includes(p.categoria) ? Math.round(p.precio * (100 - hh.porcentaje) / 100) : p.precio;
  const prod = (s, id) => s.productos.find(p => p.id === id);
  function cargaBarra(s, bid) {
    const act = s.pedidos.filter(p => p.barra_id == bid && ['pagado', 'preparando'].includes(p.estado));
    const seg = act.reduce((t, p) => t + p.items.reduce((u, i) => u + i.cantidad * (prod(s, i.producto_id)?.prep_seg || 40), 0), 0), b = s.barras.find(x => x.id == bid);
    return { segundos: Math.round(seg / Math.max(1, b?.bartenders || 1)), pedidos: act.length };
  }
  const esperaEstimada = s => Math.max(1, Math.ceil((Math.min(...s.barras.filter(b => b.abierta).map(b => cargaBarra(s, b.id).segundos)) + 90) / 60));
  function armar(s, id) {
    const o = s.pedidos.find(p => p.id === id); if (!o) return null;
    const p = { ...o, items: o.items.map(({ producto_id, nombre, cantidad, precio, es_sugerencia }) => ({ producto_id, nombre, cantidad, precio, es_sugerencia })) };
    const b = s.barras.find(x => x.id == p.barra_id); p.barra = b ? { nombre: b.nombre, ubicacion: b.ubicacion } : null;
    if (p.estado === 'pagado' || p.estado === 'preparando') {
      p.delante = s.pedidos.filter(x => x.barra_id == p.barra_id && ['pagado', 'preparando'].includes(x.estado) && x.pagado < p.pagado).length;
      const seg = s.pedidos.filter(x => x.barra_id == p.barra_id && ['pagado', 'preparando'].includes(x.estado) && x.pagado <= p.pagado).reduce((t, x) => t + x.items.reduce((u, i) => u + i.cantidad * (prod(s, i.producto_id)?.prep_seg || 40), 0), 0);
      p.espera_min = Math.max(1, Math.ceil(seg / (b?.bartenders || 1) / 60));
    }
    return p;
  }
  const publico = ({ token, telefono, pago_ref, cuenta_id, ...r }) => r;
  function sugerencia(s, items) {
    const prods = items.map(i => ({ ...prod(s, i.id), cantidad: i.cantidad })), bebidas = prods.filter(p => ['tragos', 'cervezas'].includes(p.categoria)).reduce((t, p) => t + p.cantidad, 0);
    if (!bebidas || prods.some(p => p.categoria === 'shots')) return null;
    const shot = s.productos.filter(p => p.categoria === 'shots' && p.disponible && !p.archivado).sort((a, b) => (b.precio - b.costo) - (a.precio - a.costo))[0]; if (!shot) return null;
    const cant = Math.min(bebidas, 6), pct = 20, unit = Math.round(shot.precio * (100 - pct) / 100);
    return { producto_id: shot.id, nombre: shot.nombre, cantidad: cant, precio_unit: unit, precio_lista: shot.precio, porcentaje: pct, texto: cant > 1 ? `¿Un ${shot.nombre.toLowerCase()} para cada uno?` : `¿Le sumas un ${shot.nombre.toLowerCase()}?`, vaso: shot.vaso, color: shot.color };
  }
  function crearPedido(s, b, cuenta) {
    if (!cuenta) throw err('Entra con tu mail o celular para pedir.', 401);
    const hh = happyHour(s), lineas = [];
    for (const it of (b.items || []).slice(0, 30)) {
      const p = prod(s, String(it.id)), cant = Math.max(1, Math.min(20, parseInt(it.cantidad, 10) || 1));
      if (!p || p.archivado) throw err('Uno de los productos ya no existe. Actualiza la carta.');
      if (!p.disponible) throw err(`Se agotó ${p.nombre}. Sácalo de la ronda para seguir.`);
      lineas.push({ p, cant, precio: precioFinal(p, hh), sug: 0 });
    }
    if (!lineas.length) throw err('La ronda está vacía.');
    const sug = sugerencia(s, lineas.map(l => ({ id: l.p.id, cantidad: l.cant })));
    if (sug && b.sugerencia_aceptada) lineas.push({ p: prod(s, sug.producto_id), cant: sug.cantidad, precio: sug.precio_unit, sug: 1 });
    const lista = lineas.reduce((t, l) => t + l.p.precio * l.cant, 0); let total = lineas.reduce((t, l) => t + l.precio * l.cant, 0);
    const yaPago = s.pedidos.some(p => p.cuenta_id === cuenta.id && p.estado !== 'esperando_pago'), bienvenida = !cuenta.bienvenida_usada && !yaPago ? Math.floor(total * BIENVENIDA_PCT / 100) : 0; total -= bienvenida;
    const t = ahora(), id = uid(), token = hex(12);
    s.pedidos.push({ id, token, noche: nocheDe(t), telefono: cuenta.contacto, nombre: cuenta.nombre, estado: 'esperando_pago', subtotal: lista, descuento: lista - total, total, medio_pago: b.medio_pago === 'tarjeta' ? 'tarjeta' : 'mercadopago',
      sugerencia_ofrecida: sug ? 1 : 0, sugerencia_aceptada: sug && b.sugerencia_aceptada ? 1 : 0, sugerencia_monto: sug && b.sugerencia_aceptada ? sug.precio_unit * sug.cantidad : 0, repetido: b.repetido ? 1 : 0,
      happy: lineas.some(l => l.precio < l.p.precio && !l.sug) ? 1 : 0, creado: t, cuenta_id: cuenta.id, bienvenida, pagado: null, turno: null, pin: null, barra_id: null, iniciado: null, listo: null, entregado: null,
      items: lineas.map(l => ({ producto_id: l.p.id, nombre: l.p.nombre, cantidad: l.cant, precio: l.precio, costo: l.p.costo, es_sugerencia: l.sug })) });
    return { id, token, total };
  }
  function confirmarPago(s, id) {
    const p = s.pedidos.find(x => x.id === id); if (!p || p.estado !== 'esperando_pago') return p;
    const barra = s.barras.filter(b => b.abierta).map(b => ({ id: b.id, c: cargaBarra(s, b.id).segundos })).sort((a, b) => a.c - b.c)[0].id;
    p.turno = (Math.max(100, ...s.pedidos.filter(x => x.noche === p.noche && x.turno).map(x => x.turno))) + 1; p.pin = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    Object.assign(p, { estado: 'pagado', pagado: ahora(), barra_id: barra, pago_ref: 'demo-' + ahora() });
    if (p.bienvenida && p.cuenta_id) { const c = s.cuentas.find(x => x.id === p.cuenta_id); if (c) c.bienvenida_usada = 1; }
    guardar(s); const full = armar(s, id);
    emitir('pedido', publico(full), { rol: 'barra', barra: full.barra_id }, { rol: 'dueno' }); emitir('estado', publico(full), { pedido: id }); emitir('espera', { minutos: esperaEstimada(s) }, { rol: 'cliente' });
    return full;
  }
  const TRANS = { pagado: ['preparando'], preparando: ['listo', 'pagado'], listo: ['entregado', 'preparando'] };
  function cambiarEstado(s, id, nuevo, pin) {
    const p = s.pedidos.find(x => x.id === id); if (!p) throw err('No existe ese pedido.', 404);
    if (!(TRANS[p.estado] || []).includes(nuevo)) throw err(`Ese pedido está ${p.estado}; no se puede pasar a ${nuevo}.`);
    if (nuevo === 'entregado' && String(pin) !== p.pin) throw err('El PIN no coincide. Pídele al cliente que te muestre su pantalla.');
    p.estado = nuevo; const col = { preparando: 'iniciado', listo: 'listo', entregado: 'entregado' }[nuevo]; if (col) p[col] = ahora();
    guardar(s); const full = armar(s, id);
    emitir('pedido', publico(full), { rol: 'barra', barra: full.barra_id }, { rol: 'dueno' }); emitir('estado', publico(full), { pedido: id }); emitir('espera', { minutos: esperaEstimada(s) }, { rol: 'cliente' });
    return full;
  }
  function datosProducto(b) {
    const t = (v, n) => String(v ?? '').trim().slice(0, n), num = (v, mn, mx, df) => { const x = Number(v); return Number.isFinite(x) ? Math.min(mx, Math.max(mn, x)) : df; };
    const d = { nombre: t(b.nombre, 40), categoria: CATEGORIAS.includes(b.categoria) ? b.categoria : null, descripcion: t(b.descripcion, 200), ingredientes: t(b.ingredientes, 120), precio: Math.round(num(b.precio, 0, 1e7, 0)), costo: Math.round(num(b.costo, 0, 1e7, 0)),
      ml: Math.round(num(b.ml, 0, 5000, 0)), graduacion: num(b.graduacion, 0, 80, 0), vaso: VASOS.includes(b.vaso) ? b.vaso : 'largo', color: /^#[0-9a-f]{6}$/i.test(b.color) ? b.color : '#B3122E', prep_seg: Math.round(num(b.prep_seg, 5, 600, 40)), etiqueta: t(b.etiqueta, 22) || null };
    if (d.nombre.length < 2) throw err('Pon el nombre del trago.'); if (!d.categoria) throw err('Elige en qué parte de la carta va.'); if (d.precio < 1) throw err('Pon el precio de venta.');
    if (d.costo >= d.precio) throw err('El costo no puede ser igual o mayor que el precio: perderías dinero con cada uno.'); return d;
  }
  /* cuentas: código de prueba, sin envío */
  function normalizar(tipo, valor) {
    const v = String(valor || '').trim();
    if (tipo === 'mail') { const m = v.toLowerCase(); if (!/^[^\s@]{1,64}@[^\s@]{1,120}\.[a-z]{2,}$/.test(m)) throw err('Revisa el mail: parece que le falta algo.'); return m; }
    if (tipo === 'celular') { let d = v.replace(/\D/g, ''); if (d.length === 11 && d.startsWith('1')) d = d.slice(1);
      if (d.length !== 10) throw err('Escribe tu celular con código de área. Ej.: 305 555 0142'); return '1' + d; }
    throw err('Elige mail o celular.');
  }
  const publica = c => c && { nombre: c.nombre, tipo: c.tipo, contacto: c.tipo === 'celular' ? '+' + c.contacto : c.contacto, bienvenida: !c.bienvenida_usada, bienvenida_pct: BIENVENIDA_PCT, acepta_avisos: !!c.acepta_avisos };
  const cuentaDe = s => s.cuentas.find(c => c.id === s.sesion) || null;

  /* ---------- rutas ---------- */
  const rutas = [
    ['GET', /^\/api\/carta$/, async s => { const hh = happyHour(s), mp = {}; s.pedidos.filter(p => p.pagado > ahora() - 45 * 60e3).forEach(p => p.items.forEach(i => mp[i.producto_id] = (mp[i.producto_id] || 0) + i.cantidad));
      return { productos: s.productos.filter(p => p.disponible && !p.archivado).sort((a, b) => a.orden - b.orden).map(p => ({ ...p, precio_final: precioFinal(p, hh) })), happy: hh, espera_min: esperaEstimada(s), mas_pedidos: Object.entries(mp).sort((a, b) => b[1] - a[1]).slice(0, 3).map(x => x[0]), pagos: 'demo', registro: { mail: false, celular: false, prueba: true } }; }],
    ['POST', /^\/api\/sugerencia$/, async (s, b) => ({ sugerencia: sugerencia(s, (b.items || []).filter(i => prod(s, String(i.id)))) })],
    ['POST', /^\/api\/pedidos$/, async (s, b) => { const r = crearPedido(s, b, cuentaDe(s)); guardar(s); return { ...r, pago: { modo: 'demo' } }; }],
    ['POST', /^\/api\/pedidos\/([\w-]+)\/pago-demo$/, async (s, b, [, id]) => { const p = s.pedidos.find(x => x.id === id); if (!p || p.token !== b.token) throw err('No encontramos ese pedido.', 404); return publico(confirmarPago(s, id)); }],
    ['GET', /^\/api\/pedidos\/([\w-]+)$/, async (s, b, [, id], u) => { const o = s.pedidos.find(x => x.id === id); if (!o || !(o.token === u.get('t') || (o.cuenta_id && cuentaDe(s)?.id === o.cuenta_id))) throw err('No encontramos ese pedido.', 404); return publico(armar(s, id)); }],
    ['GET', /^\/api\/mis-pedidos$/, async s => { const c = cuentaDe(s); if (!c) return []; return s.pedidos.filter(p => p.cuenta_id === c.id && p.estado !== 'esperando_pago').sort((a, b) => b.creado - a.creado).slice(0, 15).map(p => ({ ...publico(armar(s, p.id)), t: p.token })); }],
    ['GET', /^\/api\/cuenta$/, async s => { const c = cuentaDe(s); if (!c) throw err('Sin sesión.', 401); return publica(c); }],
    ['POST', /^\/api\/cuenta\/codigo$/, async (s, b) => { const contacto = normalizar(b.tipo, b.contacto), codigo = String(Math.floor(Math.random() * 1e6)).padStart(6, '0'); s.codigos[contacto] = { codigo, expira: ahora() + 10 * 60e3, intentos: 0 }; guardar(s);
      return { enviado: true, nueva: !s.cuentas.some(c => c.contacto === contacto), codigo_prueba: codigo }; }],
    ['POST', /^\/api\/cuenta\/verificar$/, async (s, b) => { const contacto = normalizar(b.tipo, b.contacto), c = s.codigos[contacto];
      if (!c || c.expira < ahora()) throw err('El código venció. Pide uno nuevo.'); if (c.intentos >= 5) throw err('Demasiados intentos. Pide un código nuevo.', 429);
      if (c.codigo !== String(b.codigo || '').replace(/\D/g, '')) { c.intentos++; guardar(s); throw err(`Ese código no es. Te quedan ${5 - c.intentos} intentos.`); }
      let cuenta = s.cuentas.find(x => x.contacto === contacto);
      if (!cuenta) { const nombre = String(b.nombre || '').trim().slice(0, 30); if (nombre.length < 2) throw err('Pon tu nombre: así te llaman en la barra.', 400, { falta_nombre: true });
        cuenta = { id: uid(), tipo: b.tipo, contacto, nombre, acepta_avisos: b.acepta_avisos ? 1 : 0, bienvenida_usada: 0, creado: ahora() }; s.cuentas.push(cuenta); }
      delete s.codigos[contacto]; s.sesion = cuenta.id; guardar(s); return publica(cuenta); }],
    ['POST', /^\/api\/cuenta\/salir$/, async s => { s.sesion = null; guardar(s); return { ok: true }; }],
    ['GET', /^\/api\/barra\/(\d+)$/, async (s, b, [, bid], u, h) => { if (h['x-pin'] !== PIN_BARRA) throw err('PIN incorrecto.', 401); const hoy = nocheDe(ahora());
      const ids = s.pedidos.filter(p => p.barra_id == bid && ['pagado', 'preparando', 'listo'].includes(p.estado)).sort((a, b) => a.pagado - b.pagado).map(p => p.id), hechos = s.pedidos.filter(p => p.barra_id == bid && p.noche === hoy && p.listo);
      return { barra: s.barras.find(x => x.id == bid), barras: s.barras.map(({ id, nombre }) => ({ id, nombre })), pedidos: ids.map(i => publico(armar(s, i))), resumen: { n: hechos.length, espera: hechos.length ? hechos.reduce((t, p) => t + (p.listo - p.pagado) / 1000, 0) / hechos.length : null },
        productos: s.productos.filter(p => !p.archivado).sort((a, b) => a.orden - b.orden).map(({ id, nombre, categoria, disponible, vaso, color }) => ({ id, nombre, categoria, disponible, vaso, color })) }; }],
    ['POST', /^\/api\/barra\/pedidos\/([\w-]+)$/, async (s, b, [, id], u, h) => { if (h['x-pin'] !== PIN_BARRA) throw err('PIN incorrecto.', 401); return publico(cambiarEstado(s, id, b.estado, b.pin)); }],
    ['POST', /^\/api\/productos\/([\w-]+)\/disponible$/, async (s, b, [, id], u, h) => { if (h['x-pin'] !== PIN_BARRA) throw err('PIN incorrecto.', 401); const p = prod(s, id); if (p) p.disponible = b.disponible ? 1 : 0; guardar(s); emitir('carta', { id, disponible: !!b.disponible }, { todos: 1 }); return { ok: true }; }],
    /* dueño: los números históricos son un resumen guardado; la carta y el happy hour sí se pueden cambiar */
    ['GET', /^\/api\/dueno\/resumen$/, async (s, b, m, u) => { const R = DATOS.resumen, n = u.get('noche') || (u.get('desde') && u.get('desde') === u.get('hasta') ? u.get('desde') : null);
      const base = n && R[n] ? R[n] : (u.get('desde') && u.get('hasta') && u.get('desde') !== u.get('hasta') ? R._todo : R._def); return { ...base, happy: happyHour(s), espera_min: esperaEstimada(s) }; }],
    ['GET', /^\/api\/dueno\/crm$/, async () => DATOS.crm],
    ['GET', /^\/api\/dueno\/crm\/ficha$/, async (s, b, m, u) => { const f = DATOS.fichas[u.get('c')]; if (!f) throw err('En la demo se abren las fichas de los 80 clientes que más gastan.', 404); return f; }],
    ['POST', /^\/api\/dueno\/happy$/, async (s, b) => { const h = s.happy; s.happy = { activo: !!b.activo, desde: /^\d\d:\d\d$/.test(b.desde) ? b.desde : h.desde, hasta: /^\d\d:\d\d$/.test(b.hasta) ? b.hasta : h.hasta,
      porcentaje: Math.max(5, Math.min(60, parseInt(b.porcentaje, 10) || h.porcentaje)), categorias: Array.isArray(b.categorias) && b.categorias.length ? b.categorias : h.categorias, forzado: !!b.forzado }; guardar(s); emitir('carta', { happy: true }, { todos: 1 }); return happyHour(s); }],
    ['POST', /^\/api\/dueno\/precio\/([\w-]+)$/, async (s, b, [, id]) => { const v = parseInt(b.precio, 10); if (!(v >= 1)) throw err('Pon un precio válido.'); const p = prod(s, id); if (p) p.precio = v; guardar(s); emitir('carta', { id }, { todos: 1 }); return { ok: true }; }],
    ['GET', /^\/api\/dueno\/productos$/, async s => ({ noches: DATOS.noches_n, productos: s.productos.filter(p => !p.archivado).sort((a, b) => a.orden - b.orden).map(p => ({ ...p, unidades: s.ventas[p.id]?.unidades || 0, ganancia: s.ventas[p.id]?.ganancia || 0 })) })],
    ['POST', /^\/api\/dueno\/productos$/, async (s, b) => { const d = datosProducto(b); let id = d.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'trago';
      while (prod(s, id)) id += '-' + Math.floor(10 + Math.random() * 90); const mx = Math.max(...s.productos.filter(p => p.categoria === d.categoria).map(p => p.orden), 0) + .5;
      const n = { id, ...d, disponible: 1, orden: mx, foto: null, archivado: 0, creado: ahora() }; s.productos.push(n); guardar(s); emitir('carta', { id }, { todos: 1 }); return n; }],
    ['PUT', /^\/api\/dueno\/productos\/([\w-]+)$/, async (s, b, [, id]) => { const p = prod(s, id); if (!p || p.archivado) throw err('Ese trago ya no existe.', 404);
      if (Object.keys(b).length === 1 && 'disponible' in b) p.disponible = b.disponible ? 1 : 0; else Object.assign(p, datosProducto({ ...p, ...b })); guardar(s); emitir('carta', { id }, { todos: 1 }); return p; }],
    ['DELETE', /^\/api\/dueno\/productos\/([\w-]+)$/, async (s, b, [, id]) => { const p = prod(s, id); if (p) { p.archivado = 1; p.disponible = 0; } guardar(s); emitir('carta', { id }, { todos: 1 }); return { ok: true }; }],
    ['POST', /^\/api\/dueno\/productos\/([\w-]+)\/restaurar$/, async (s, b, [, id]) => { const p = prod(s, id); if (p) { p.archivado = 0; p.disponible = 1; } guardar(s); emitir('carta', { id }, { todos: 1 }); return p; }],
    ['POST', /^\/api\/dueno\/productos\/([\w-]+)\/foto$/, async (s, b, [, id], u, h, raw) => { const p = prod(s, id); if (!p) throw err('Ese trago ya no existe.', 404); if (raw.size > 300e3) throw err('En la demo la foto tiene que pesar menos de 300 KB.', 413);
      p.foto = await new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(raw); }); guardar(s); emitir('carta', { id }, { todos: 1 }); return p; }],
  ];

  const JSONRES = (d, st = 200) => new Response(JSON.stringify(d), { status: st, headers: { 'Content-Type': 'application/json' } });
  const fetchReal = window.fetch.bind(window);
  window.fetch = async (input, opts = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.startsWith('/api/')) return fetchReal(input, opts);
    const metodo = (opts.method || 'GET').toUpperCase(), headers = Object.fromEntries(Object.entries(opts.headers || {}).map(([k, v]) => [k.toLowerCase(), v]));
    try {
      const s = await estado();
      for (const [m, re, fn] of rutas) { const mt = url.pathname.match(re); if (mt && m === metodo) {
        const raw = opts.body instanceof Blob || opts.body instanceof ArrayBuffer ? (opts.body instanceof Blob ? opts.body : new Blob([opts.body])) : null;
        const body = !raw && typeof opts.body === 'string' ? JSON.parse(opts.body || '{}') : {};
        await new Promise(r => setTimeout(r, 40)); return JSONRES(await fn(s, body, mt, url.searchParams, headers, raw)); } }
      return JSONRES({ error: 'Ruta inexistente.' }, 404);
    } catch (e) { return JSONRES({ error: e.message || 'Error', ...(e.falta_nombre ? { falta_nombre: true } : {}) }, e.st || 500); }
  };

  /* lista de clientes (CSV) generada en el navegador */
  window.pumkersDemoCsv = async seg => { await estado(); const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const filas = DATOS.crm.clientes.filter(c => c.avisos && (!seg || c.segmento === seg));
    const csv = '\ufeffNombre,Celular o mail,Segmento,Noches que vino,Pedidos,Gastado,Última noche,Trago favorito\n' + filas.map(f => [f.nombre, f.tipo === 'celular' ? '+' + f.contacto : f.contacto, f.segmento, f.noches, f.pedidos, f.gastado, f.ultima, f.favorito].map(esc).join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = `clientes-${seg || 'todos'}.csv`; document.body.appendChild(a); a.click(); a.remove(); };
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('a[href*="/api/dueno/clientes.csv"]'); if (!a) return; e.preventDefault(); window.pumkersDemoCsv(new URL(a.href).searchParams.get('seg')); }, true);

  /* aviso de demo (se va solo) */
  addEventListener('DOMContentLoaded', () => { const d = document.createElement('div'); d.textContent = 'Demo de prueba · nada se cobra · MYB Digitals';
    d.style.cssText = 'position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:99999;background:rgba(12,12,12,.94);color:#fff;border:1px solid rgba(255,255,255,.45);font:600 11px/1 system-ui,sans-serif;letter-spacing:.04em;padding:7px 12px;border-radius:99px;pointer-events:none;transition:opacity .6s;white-space:nowrap';
    document.body.appendChild(d); setTimeout(() => d.style.opacity = '0', 5500); setTimeout(() => d.remove(), 6300); });
})();
