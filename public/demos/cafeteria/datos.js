/* La Esquina (marca de ejemplo) · carta, estado compartido entre cliente, cocina y dueño, íconos y utilidades.
   El estado vive en localStorage del navegador: si abrís la carta y la cocina en dos pestañas, se hablan solas. */
export const MARCA = { nombre: 'Café Barrio', sub: 'Cafetería · panadería propia', inicial: 'CB' };

export const CATS = [['desayunos', 'Desayunos'], ['cafes', 'Cafés'], ['tes', 'Tés'], ['panaderia', 'Panadería']];
export const CARTA = [
  { id: 'desayuno', cat: 'desayunos', nombre: 'Desayuno clásico', desc: 'Café con leche y dos medialunas de manteca. Lo más pedido de la mañana.', corta: 'Café con leche y dos medialunas', precio: 4900, foto: 'desayuno',
    elegir: { titulo: '¿Qué medialunas?', opciones: ['De manteca', 'De grasa', 'Una y una'], def: 0 }, vaBien: 'agua' },
  { id: 'merienda', cat: 'desayunos', nombre: 'Té con criollos', desc: 'Té a elección y tres criollos recién horneados.', precio: 4200, foto: 'criollos', elegir: { titulo: '¿Qué té?', opciones: ['Negro', 'Verde', 'Manzanilla'], def: 0 } },
  { id: 'cafe-leche', cat: 'cafes', nombre: 'Café con leche', desc: 'Espresso doble con leche espumada.', precio: 3200, foto: 'cafeConLeche', modelo: 'cafeConLeche', r3d: .075, medida: 'Taza de 300 ml',
    elegir: { titulo: '¿Qué tamaño?', opciones: ['Jarrito', 'Taza', 'Taza grande'], def: 1 }, sacar: ['Azúcar'], vaBien: 'medialuna' },
  { id: 'cortado', cat: 'cafes', nombre: 'Cortado', desc: 'Espresso con un toque de leche.', precio: 2700, vaBien: 'medialuna' },
  { id: 'cafe', cat: 'cafes', nombre: 'Café', desc: 'Espresso de grano tostado acá.', precio: 2400, vaBien: 'medialuna' },
  { id: 'te', cat: 'tes', nombre: 'Té', desc: 'En hebras o saquito, con leche o limón.', precio: 2200, foto: 'te', modelo: 'te', r3d: .075, medida: 'Taza de 250 ml',
    elegir: { titulo: '¿Qué té?', opciones: ['Negro', 'Verde', 'Manzanilla', 'Frutos rojos'], def: 0 }, sacar: ['Azúcar'], vaBien: 'criollo' },
  { id: 'medialuna', cat: 'panaderia', nombre: 'Medialuna de manteca', desc: 'Dulce, con almíbar. Horneada a la mañana.', precio: 900, foto: 'medialunas', modelo: 'medialunas', r3d: .09, medida: '12 cm de punta a punta' },
  { id: 'medialuna-grasa', cat: 'panaderia', nombre: 'Medialuna de grasa', desc: 'Salada y crocante, más finita.', precio: 850, foto: 'medialunaGrasa', modelo: 'medialunaGrasa', r3d: .09, medida: '13 cm de largo' },
  { id: 'criollo', cat: 'panaderia', nombre: 'Criollo', desc: 'Hojaldrado y bien dorado. Van perfecto con el mate o el té.', precio: 700, foto: 'criollos', modelo: 'criollos', r3d: .09, medida: '6 cm cada uno' },
  { id: 'agua', cat: 'panaderia', nombre: 'Agua sin gas 500 ml', desc: '', precio: 2000, oculto: true },
  { id: 'vaso-agua', cat: 'panaderia', nombre: 'Vaso de agua', desc: '', precio: 0, oculto: true },
];
for (const p of CARTA) p.tags = [];
export const FILTROS = [];
export const RAPIDOS = [
  { id: 'mozo', n: 'Llamar al mozo', sub: 'Viene a tu mesa', ic: 'mozo' }, { id: 'agua', n: 'Vaso de agua', sub: 'Sin cargo', ic: 'agua', pedido: 'vaso-agua' },
  { id: 'azucar', n: 'Azúcar o edulcorante', sub: 'Te lo traen a la mesa', ic: 'azucar' }, { id: 'servilletas', n: 'Servilletas', sub: 'Y una cucharita', ic: 'servilleta' },
  { id: 'cuenta', n: 'La cuenta', sub: 'Pagás desde acá', ic: 'cuenta' },
];
export const TXT_LLAMADO = { mozo: 'Llama al mozo', azucar: 'Pide azúcar o edulcorante', servilletas: 'Pide servilletas', cuenta: 'Pide la cuenta', agua: 'Pide un vaso de agua' };
export const porId = id => CARTA.find(p => p.id === id);
export const pesos = n => n === 0 ? 'Sin cargo' : '$ ' + Math.round(n).toLocaleString('es-AR');
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- estado compartido ---------- */
const CLAVE = 'cafebarrio-demo-v1';
const INICIAL = () => ({ pedidos: [], llamados: [], agotados: {}, recomendado: 'desayuno', clientes: [], resenas: [], promos: [] });
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
  agua: '<path d="M9 2h6v3l1.5 2.5V20a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V7.5L9 5zM7.5 11h9M7.5 16h9"/>', pan: '<path d="M4 13c0-4 3.6-7 8-7s8 3 8 7v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM9 9.5l-1 3M13 9l-1 3.5M17 10l-1 3"/>',
  hielo: '<rect x="4" y="4" width="9" height="9" rx="2"/><rect x="11" y="11" width="9" height="9" rx="2"/><path d="M7 7l3 3M14 14l3 3"/>', servilleta: '<path d="M4 4h16v16H4zM4 4l16 16M9 20v-5h-5"/>',
  camara: '<path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/>',
  mesa: '<path d="M3 9h18M6 9v11M18 9v11M8 9l-1-5M16 9l1-5M4 14h16"/>', filtro: '<path d="M4 5h16M7 12h10M10 19h4"/>', dividir: '<circle cx="8" cy="8" r="3"/><circle cx="16" cy="16" r="3"/><path d="M5 19L19 5"/>',
  azucar: '<rect x="5" y="9" width="10" height="10" rx="1.5"/><rect x="11" y="4" width="8" height="8" rx="1.5"/>',
  taza: '<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3c-1 1.3 1 2.2 0 3.6M12 3c-1 1.3 1 2.2 0 3.6"/>',
  ojo: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', nfc: '<path d="M6 8a8 8 0 0 1 0 8M9.5 6a12 12 0 0 1 0 12M13 4a16 16 0 0 1 0 16"/>',
};
export const ic = (n, s = 22, extra = '') => `<svg class="ic ${extra}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;
export const foto = (n, ancha = false) => `fotos/${n}${ancha ? '-ancha' : ''}.webp`;
