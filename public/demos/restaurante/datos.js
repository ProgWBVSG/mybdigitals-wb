/* La Esquina (marca de ejemplo) · carta, estado compartido entre cliente, cocina y dueño, íconos y utilidades.
   El estado vive en localStorage del navegador: si abrís la carta y la cocina en dos pestañas, se hablan solas. */
export const MARCA = { nombre: 'La Esquina', sub: 'Bodegón · desde 1987', inicial: 'LE' };

export const CATS = [['entradas', 'Entradas'], ['principales', 'Principales'], ['pastas', 'Pastas'], ['bebidas', 'Vinos y bebidas'], ['postres', 'Postres']];

const PARA_MESA = true;
export const CARTA = [
  { id: 'empanadas', cat: 'entradas', nombre: 'Empanadas de carne', desc: 'Cortada a cuchillo, al horno de barro. Van de a dos.', precio: 4800, foto: 'empanadas', modelo: 'empanadas', r3d: .13, medida: 'Plato de 26 cm · 2 empanadas', vaBien: 'pinta' },
  { id: 'provoleta', cat: 'entradas', nombre: 'Provoleta a la parrilla', desc: 'Con orégano, ají molido y un hilo de oliva. Sale en la sartén.', precio: 7900, foto: 'provoleta', modelo: 'provoleta', r3d: .078, medida: 'Sartén de 16 cm · para compartir', tags: ['SIN TACC'], vaBien: 'malbec-copa' },
  { id: 'rabas', cat: 'entradas', nombre: 'Rabas', desc: 'Calamar rebozado, limón y alioli de la casa.', precio: 12400, sacar: ['Alioli'] },
  { id: 'picada', cat: 'entradas', nombre: 'Picada de la casa', desc: 'Salame, jamón crudo, queso de campo, aceitunas y pan tostado. Para dos.', precio: 16500 },

  { id: 'milanesa', cat: 'principales', nombre: 'Milanesa napolitana', desc: 'Nalga de ternera, salsa de tomate, jamón y muzzarella. Con papas fritas.', corta: 'La de la casa, con papas fritas', precio: 14900, foto: 'milanesa', modelo: 'milanesa', r3d: .14, medida: '28 cm · para 1 o 2 personas', sacar: ['Cebolla', 'Jamón', 'Orégano'], paraMesa: PARA_MESA, vaBien: 'malbec-copa' },
  { id: 'bife', cat: 'principales', nombre: 'Bife de chorizo', desc: '400 g a la parrilla, papas rústicas y chimichurri.', corta: '400 g a la parrilla, con papas rústicas', precio: 19800, foto: 'bife', modelo: 'bife', r3d: .14, medida: '400 g · plato de 28 cm', elegir: { titulo: '¿Cómo te gusta la carne?', opciones: ['Jugoso', 'A punto', 'Cocido'], def: 1 }, sacar: ['Chimichurri'], paraMesa: PARA_MESA, vaBien: 'malbec-copa' },
  { id: 'bondiola', cat: 'principales', nombre: 'Bondiola braseada', desc: 'Ocho horas al horno, puré de calabaza y cebollas glaseadas.', precio: 15600, sacar: ['Cebolla'], paraMesa: PARA_MESA, vaBien: 'malbec-copa' },
  { id: 'pollo', cat: 'principales', nombre: 'Pollo al verdeo', desc: 'Suprema en salsa de crema y verdeo, con arroz blanco.', precio: 13900, tags: ['SIN TACC'], paraMesa: PARA_MESA, vaBien: 'torrontes' },

  { id: 'noquis', cat: 'pastas', nombre: 'Ñoquis de papa', desc: 'Con fileto de tomates asados y albahaca.', corta: 'Fileto de tomates asados y albahaca', precio: 11500, foto: 'noquis', modelo: 'noquis', r3d: .14, medida: 'Plato de 28 cm · porción abundante', tags: ['SIN TACC'], sacar: ['Queso rallado'], paraMesa: PARA_MESA, vaBien: 'torrontes' },
  { id: 'sorrentinos', cat: 'pastas', nombre: 'Sorrentinos de jamón y queso', desc: 'Masa casera. Elegí la salsa.', precio: 12800, elegir: { titulo: 'Elegí la salsa', opciones: ['Fileto', 'Crema', 'Mixta'], def: 2 }, paraMesa: PARA_MESA, vaBien: 'torrontes' },
  { id: 'tallarines', cat: 'pastas', nombre: 'Tallarines caseros', desc: 'Al huevo, cortados a mano. Elegí la salsa.', precio: 10900, elegir: { titulo: 'Elegí la salsa', opciones: ['Fileto', 'Bolognesa', 'Pesto'], def: 1 }, paraMesa: PARA_MESA, vaBien: 'malbec-copa' },

  { id: 'malbec-copa', cat: 'bebidas', nombre: 'Malbec Reserva', desc: 'Copa · Valle de Uco, Mendoza.', precio: 5900, foto: 'vino', modelo: 'vino', d3d: .8, y3d: .1, medida: 'Copa de 250 ml' },
  { id: 'malbec-bot', cat: 'bebidas', nombre: 'Malbec Reserva, botella', desc: '750 ml · Valle de Uco, Mendoza.', precio: 24000 },
  { id: 'torrontes', cat: 'bebidas', nombre: 'Torrontés', desc: 'Copa · Cafayate, Salta. Fresco y aromático.', precio: 5400 },
  { id: 'pinta', cat: 'bebidas', nombre: 'Cerveza tirada', desc: 'Pinta de rubia artesanal.', precio: 4500 },
  { id: 'agua', cat: 'bebidas', nombre: 'Agua sin gas 500 ml', desc: 'Con o sin hielo.', precio: 2500, foto: 'agua' },
  { id: 'gaseosa', cat: 'bebidas', nombre: 'Gaseosa 500 ml', desc: 'Línea Coca-Cola.', precio: 2900 },
  { id: 'panera', cat: 'bebidas', nombre: 'Panera de la casa', desc: 'Pan de campo y grisines.', precio: 0, foto: 'panera', oculto: true },

  { id: 'flan', cat: 'postres', nombre: 'Flan casero', desc: 'Con dulce de leche y crema. Como el de la abuela.', precio: 5400, foto: 'flan', modelo: 'flan', r3d: .1, medida: 'Plato de 20 cm', sacar: ['Crema'], vaBien: 'cafe' },
  { id: 'panqueque', cat: 'postres', nombre: 'Panqueque con dulce de leche', desc: 'Caramelizado al momento.', precio: 5200, vaBien: 'cafe' },
  { id: 'helado', cat: 'postres', nombre: 'Helado, dos bochas', desc: 'Dulce de leche, chocolate o crema americana.', precio: 4900, vaBien: 'cafe' },
  { id: 'cafe', cat: 'postres', nombre: 'Café', desc: 'Espresso, cortado o lágrima.', precio: 2800 },
];
export const porId = id => CARTA.find(p => p.id === id);
export const pesos = n => n === 0 ? 'Sin cargo' : '$ ' + Math.round(n).toLocaleString('es-AR');
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- estado compartido ---------- */
const CLAVE = 'laesquina-demo-v1';
const INICIAL = () => ({ pedidos: [], llamados: [], agotados: {}, recomendado: 'milanesa', clientes: [], resenas: [], promos: [] });
let memoria = null;
export function leer() { try { const s = JSON.parse(localStorage.getItem(CLAVE)); if (s && s.pedidos) return { ...INICIAL(), ...s }; } catch {} return memoria || (memoria = INICIAL()); }
let canal = null; try { canal = new BroadcastChannel(CLAVE); } catch {}
export function guardar(fn) { const s = leer(); fn(s); memoria = s; try { localStorage.setItem(CLAVE, JSON.stringify(s)); } catch {} try { canal && canal.postMessage(1); } catch {} return s; }
export function alCambiar(fn) { try { canal && canal.addEventListener('message', fn); } catch {} window.addEventListener('storage', e => { if (e.key === CLAVE) fn(); }); }
export function reiniciar() { try { localStorage.removeItem(CLAVE); } catch {} memoria = null; try { canal && canal.postMessage(1); } catch {} }
export const nuevoId = () => Math.random().toString(36).slice(2, 9);
export const hace = ts => { const s = Math.max(0, Math.round((Date.now() - ts) / 1000)); return s < 45 ? 'recién' : s < 3600 ? `hace ${Math.round(s / 60) || 1} min` : `hace ${Math.round(s / 3600)} h`; };

/* ---------- íconos de línea ---------- */
const P = {
  campana: '<path d="M6 17h12M7 17c0-5 0-11 5-11s5 6 5 11M10 20h4M12 4v2"/>',
  atras: '<path d="M15 5l-7 7 7 7"/>', cerrar: '<path d="M6 6l12 12M18 6L6 18"/>',
  cubo: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9"/>',
  check: '<path d="M5 12.5l5 4.5 9-10"/>', mas: '<path d="M12 5v14M5 12h14"/>', menos: '<path d="M5 12h14"/>',
  regla: '<path d="M3 9h18v6H3zM6 9v3M9 9v3M12 9v3M15 9v3M18 9v3"/>',
  girar: '<path d="M19.4 14.6A8 8 0 1 1 18 7M19 3v4.5h-4.5"/>',
  cuenta: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"/>',
  copa: '<path d="M7 3h10c0 7-2 9-5 9s-5-2-5-9zM12 12v8M8 21h8"/>',
  olla: '<path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM2 10h20M9 6c0-1 1-1 1-2M14 6c0-1 1-1 1-2"/>',
  reloj: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>', nota: '<path d="M5 4h14v12l-4 4H5zM15 20v-4h4"/>',
  tarjeta: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/>', billete: '<rect x="3" y="7" width="18" height="10" rx="1.5"/><circle cx="12" cy="12" r="2.2"/>',
  celular: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
  grafico: '<path d="M4 20V10M10 20V4M16 20v-7M2 20h20"/>', lista: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
  personas: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M16 4.5a3 3 0 0 1 0 6M18 14c2 .8 3 2.8 3 6"/>',
  estrella: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8-4.3-4.1 5.9-.8z"/>',
  enviar: '<path d="M4 12l16-8-6 16-2.5-6.5z"/>', mozo: '<circle cx="12" cy="7" r="3.5"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7M10 14l2 3 2-3"/>',
  ojo: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', nfc: '<path d="M6 8a8 8 0 0 1 0 8M9.5 6a12 12 0 0 1 0 12M13 4a16 16 0 0 1 0 16"/>',
};
export const ic = (n, s = 22, extra = '') => `<svg class="ic ${extra}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;
export const foto = (n, ancha = false) => `fotos/${n}${ancha ? '-ancha' : ''}.jpg`;
