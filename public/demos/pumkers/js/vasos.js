// Ilustraciones de vasos: el color del líquido sale de la carta.
// Trazo de papel térmico sobre fondo oscuro, sin degradés de plantilla.
(function () {
  const L = 'var(--ficha)';
  const hielo = (x, y, s = 9) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="2" fill="#fff" fill-opacity=".55" stroke="#fff" stroke-opacity=".8" stroke-width="1"/>`;
  const brillo = (x, y1, y2) => `<path d="M${x} ${y1}V${y2}" stroke="#fff" stroke-opacity=".45" stroke-width="3" stroke-linecap="round"/>`;
  const F = {
    largo: c => `<path d="M24 16h32l-3 76a4 4 0 0 1-4 4H31a4 4 0 0 1-4-4z" fill="${c}" fill-opacity=".0"/>
      <path d="M25.6 34h28.8l-2.3 57.6a3 3 0 0 1-3 2.8H30.9a3 3 0 0 1-3-2.8z" fill="${c}"/>
      ${hielo(31, 38)}${hielo(42, 44, 8)}${hielo(34, 52, 8)}
      <path d="M47 8l-6 50" stroke="var(--cereza)" stroke-width="3" stroke-linecap="round"/>
      <path d="M24 16h32l-3 76a4 4 0 0 1-4 4H31a4 4 0 0 1-4-4z" fill="none" stroke="${L}" stroke-width="2.4" stroke-linejoin="round"/>${brillo(30, 40, 84)}`,
    balon: c => `<path d="M21 34c0 18 8 28 19 28s19-10 19-28" fill="${c}" fill-opacity=".9"/>
      ${hielo(30, 40, 8)}${hielo(41, 44, 9)}<circle cx="50" cy="36" r="4.5" fill="#7BC67E" stroke="#2f6b33" stroke-width="1"/>
      <path d="M20 14h40c1 26-6 48-20 48S19 40 20 14z" fill="none" stroke="${L}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M40 62v26M28 92h24" stroke="${L}" stroke-width="2.4" stroke-linecap="round"/>${brillo(27, 22, 40)}`,
    bajo: c => `<path d="M21.5 54h37l-2 34a4 4 0 0 1-4 3.6H27.5a4 4 0 0 1-4-3.6z" fill="${c}"/>
      <rect x="29" y="50" width="20" height="20" rx="3" fill="#fff" fill-opacity=".45" stroke="#fff" stroke-opacity=".8"/>
      <path d="M44 46c6-4 12-3 15 1" stroke="var(--ambar)" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M19 40h42l-3 49a5 5 0 0 1-5 4.6H27a5 5 0 0 1-5-4.6z" fill="none" stroke="${L}" stroke-width="2.4" stroke-linejoin="round"/>${brillo(26, 58, 84)}`,
    shot: c => `<path d="M30.5 60h19l-1.6 26a3 3 0 0 1-3 2.8h-9.8a3 3 0 0 1-3-2.8z" fill="${c}"/>
      <path d="M28 46h24l-2.6 42a4 4 0 0 1-4 3.6H34.6a4 4 0 0 1-4-3.6z" fill="none" stroke="${L}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M50 40a8 8 0 1 1 10 6" fill="#C7E36B" stroke="#6E8A1A" stroke-width="1.2"/>${brillo(34, 64, 82)}`,
    porron: c => `<path d="M35 10h10v14c0 4 9 8 9 18v46a4 4 0 0 1-4 4H30a4 4 0 0 1-4-4V42c0-10 9-14 9-18z" fill="${c}" stroke="${L}" stroke-width="2.4" stroke-linejoin="round"/>
      <rect x="27.5" y="52" width="25" height="22" rx="2" fill="var(--ficha)"/><path d="M33 63h14" stroke="var(--cereza)" stroke-width="3"/>
      <rect x="34" y="6" width="12" height="6" rx="1.5" fill="var(--ambar)"/>${brillo(31, 44, 50)}`,
    pinta: c => `<path d="M24.5 30h31l-3.6 58a4 4 0 0 1-4 3.6H32.1a4 4 0 0 1-4-3.6z" fill="${c}"/>
      <path d="M22 26c3-8 33-8 36 0v6H22z" fill="#F2F2F2"/><circle cx="30" cy="24" r="5" fill="#F2F2F2"/><circle cx="41" cy="21" r="6" fill="#F2F2F2"/><circle cx="51" cy="24" r="5" fill="#F2F2F2"/>
      <path d="M22 22h36l-4.2 66a5 5 0 0 1-5 4.6H31.2a5 5 0 0 1-5-4.6z" fill="none" stroke="${L}" stroke-width="2.4" stroke-linejoin="round"/>${brillo(30, 40, 84)}`,
    lata: c => `<rect x="25" y="16" width="30" height="76" rx="5" fill="${c}" stroke="${L}" stroke-width="2.4"/>
      <path d="M25 26h30M25 82h30" stroke="${L}" stroke-width="2" stroke-opacity=".7"/>
      <rect x="29" y="40" width="22" height="30" rx="2" fill="var(--ficha)" fill-opacity=".92"/><path d="M33 55h14" stroke="var(--tinta)" stroke-width="3"/>${brillo(30, 30, 78)}`,
    balde: c => `<path d="M31 14h6v22h-6zM39 10h6v26h-6zM47 15h6v21h-6z" fill="${c}" stroke="${L}" stroke-width="2"/>
      <rect x="31" y="11" width="6" height="4" fill="var(--ambar)"/><rect x="39" y="7" width="6" height="4" fill="var(--ambar)"/><rect x="47" y="12" width="6" height="4" fill="var(--ambar)"/>
      ${hielo(24, 30, 9)}${hielo(52, 31, 8)}
      <path d="M16 36h48l-6 52a5 5 0 0 1-5 4.4H27a5 5 0 0 1-5-4.4z" fill="var(--humo-2)" stroke="${L}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M22 50h36" stroke="${L}" stroke-opacity=".5" stroke-width="2"/>`,
    botella: c => `<path d="M35 6h10v20c0 6 11 9 11 22v40a5 5 0 0 1-5 5H29a5 5 0 0 1-5-5V48c0-13 11-16 11-22z" fill="${c}" stroke="${L}" stroke-width="2.4" stroke-linejoin="round"/>
      <rect x="26.5" y="54" width="27" height="26" rx="2" fill="var(--ficha)"/><path d="M31 62h18M31 70h12" stroke="var(--tinta)" stroke-width="2.6"/>
      <rect x="34" y="3" width="12" height="6" rx="1.5" fill="var(--cereza)"/>${brillo(30, 44, 50)}`,
    'botella-agua': c => `<path d="M34 16h12v8c6 3 8 7 8 12v52a4 4 0 0 1-4 4H30a4 4 0 0 1-4-4V36c0-5 2-9 8-12z" fill="${c}" fill-opacity=".55" stroke="${L}" stroke-width="2.4" stroke-linejoin="round"/>
      <rect x="33" y="8" width="14" height="9" rx="2" fill="var(--uv)"/><path d="M26 50h28M26 70h28" stroke="${L}" stroke-opacity=".5" stroke-width="2"/>${brillo(31, 40, 84)}`,
    champagne: c => `<path d="M36 4h8v24c0 5 12 9 12 22v38a5 5 0 0 1-5 5H29a5 5 0 0 1-5-5V50c0-13 12-17 12-22z" fill="#1F3B2C" stroke="${L}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M35 4h10v18H35z" fill="var(--ambar)"/><rect x="26.5" y="56" width="27" height="20" rx="2" fill="${c}"/><path d="M32 66h16" stroke="var(--tinta)" stroke-width="2.6"/>${brillo(30, 46, 52)}`,
  };
  window.vaso = (tipo, color, clase = '') =>
    `<svg class="vaso ${clase}" viewBox="0 0 80 100" aria-hidden="true" focusable="false">${(F[tipo] || F.largo)(color || '#999')}</svg>`;
})();
