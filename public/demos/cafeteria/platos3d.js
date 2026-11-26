/* Platos en 3D para la carta del restaurante: sirven de "foto" de cada plato (render fijo con luz cálida sobre madera)
   y de visor 3D dentro del celular (el plato gira con la medida real). Medidas en metros: el plato mide 28 cm.
   Uso: const P = crearPlatos(THREE); P.foto(renderer, 'milanesa', 512, 512) -> canvas; P.visor(renderer, t, w, h) -> canvas. */
export function crearPlatos(THREE) {
  const mate = (c, r = .7, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
  const M = {
    plato: mate('#F6F3EC', .25), borde: mate('#E9E3D6', .3), mila: mate('#B8722E', .78), milaOsc: mate('#8E5420', .85), salsa: mate('#B9301C', .45),
    queso: mate('#F3DE9A', .42), jamon: mate('#D98C86', .55), oregano: mate('#4C6A2A', .9), papa: mate('#E8B94A', .62), papaOsc: mate('#C98F2C', .7),
    noqui: mate('#EBCF8C', .55), albahaca: mate('#3E7A2E', .6), parme: mate('#F4ECD2', .8), vino: new THREE.MeshPhysicalMaterial({ color: '#5A0E1A', roughness: .1, transmission: 0, clearcoat: 1 }),
    vidrio: new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: .05, transparent: true, opacity: .28, clearcoat: 1 }), cebolla: mate('#F2EEE4', .35),
    madera: mate('#6E4A2E', .55), mimbre: mate('#9A6A36', .85), pan: mate('#D39A52', .6), panOsc: mate('#A86A2E', .7), agua: new THREE.MeshPhysicalMaterial({ color: '#cfe6f2', roughness: .05, transparent: true, opacity: .45 }), tapa: mate('#1d3a8a', .4),
  };
  const m = (geo, mat, x, y, z, padre) => { const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; padre.add(o); return o; };
  const rnd = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  function plato(padre, r = .14) { const pl = [[0, 0], [r * .7, 0], [r * .93, .011], [r, .019], [r * .97, .021], [r * .74, .008], [0, .008]].map(([x, y]) => new THREE.Vector2(x, y)); m(new THREE.LatheGeometry(pl, 64), M.plato, 0, 0, 0, padre); }
  // milanesa napolitana con papas fritas (cebolla opcional)
  /* texturas pintadas a mano en un lienzo (viajan dentro del GLB y del USDZ) */
  const texCache = {};
  function textura(nombre, fn, lado = 512) { if (texCache[nombre]) return texCache[nombre]; const c = document.createElement('canvas'); c.width = c.height = lado; const g = c.getContext('2d'); fn(g, lado);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.userData.mimeType = 'image/jpeg'; return texCache[nombre] = t; }
  const motas = (g, L, n, colores, rMin, rMax, semilla, a = [.5, .95]) => { for (let i = 0; i < n; i++) { g.globalAlpha = a[0] + rnd(semilla + i * 3.1) * (a[1] - a[0]); g.fillStyle = colores[i % colores.length]; g.beginPath(); g.ellipse(rnd(semilla + i) * L, rnd(semilla + i * 1.7) * L, rMin + rnd(semilla + i * 2.3) * (rMax - rMin), rMin + rnd(semilla + i * 5.9) * (rMax - rMin), rnd(i) * 3, 0, 7); g.fill(); } g.globalAlpha = 1; };
  const TX = {
    rebozado: () => textura('rebozado', (g, L) => { const gr = g.createRadialGradient(L / 2, L / 2, L * .1, L / 2, L / 2, L * .52); gr.addColorStop(0, '#D49544'); gr.addColorStop(.75, '#C4823A'); gr.addColorStop(1, '#93531F'); g.fillStyle = gr; g.fillRect(0, 0, L, L);
      motas(g, L, 60, ['#A8622A', '#B8702E'], 10, 26, 11, [.25, .5]); motas(g, L, 2600, ['#8E4E1C', '#E4AE62', '#A35F27', '#F0C47E', '#7A4116'], .8, 2.6, 7); }),
    salsa: () => textura('salsa', (g, L) => { g.fillStyle = '#B42D1B'; g.fillRect(0, 0, L, L); motas(g, L, 40, ['#C93C22', '#9A2416'], 6, 15, 3, [.3, .55]); motas(g, L, 260, ['#7E1A10', '#D85A36', '#9C2817'], .6, 2, 5); }, 256),
    gratinado: () => textura('gratinado', (g, L) => { const gr = g.createRadialGradient(L / 2, L / 2, 0, L / 2, L / 2, L * .55); gr.addColorStop(0, '#F6E7B6'); gr.addColorStop(.8, '#F1DC9C'); gr.addColorStop(1, '#E8C877'); g.fillStyle = gr; g.fillRect(0, 0, L, L);
      motas(g, L, 26, ['#DDAE5E', '#D49A48'], 10, 34, 21, [.35, .65]); motas(g, L, 90, ['#B9772E', '#C88A3C'], 2, 7, 23, [.5, .85]); motas(g, L, 300, ['#FFF6DA'], 1, 3, 29, [.3, .6]); }),
    jamon: () => textura('jamon', (g, L) => { g.fillStyle = '#E0948C'; g.fillRect(0, 0, L, L); motas(g, L, 30, ['#F2B9B1', '#C9746B'], 3, 11, 31, [.25, .5]); }, 128),
    papa: () => textura('papa', (g, L) => { const gr = g.createLinearGradient(0, 0, L, 0); gr.addColorStop(0, '#C98A2E'); gr.addColorStop(.12, '#EBC060'); gr.addColorStop(.88, '#F0C866'); gr.addColorStop(1, '#C07F28'); g.fillStyle = gr; g.fillRect(0, 0, L, L); motas(g, L, 160, ['#D9A447', '#F7D985'], 1, 4, 41, [.3, .6]); }, 128),
  };
  // óvalo blando: una esfera aplastada con borde irregular suave y relieve arriba. UV plano desde arriba (la textura no se estira).
  function ovalo({ a, b, h, borde = [], relieve = 0, base = .35, sem = 1, seg = 72 }) {
    const geo = new THREE.SphereGeometry(1, seg, Math.round(seg / 2)), p = geo.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const ang = Math.atan2(v.z, v.x); let f = 1; for (const [amp, fr, fase] of borde) f += amp * Math.sin(ang * fr + fase);
      let y = v.y > 0 ? v.y : v.y * base; if (v.y > 0 && relieve) { const x = v.x * a, z = v.z * b; y += relieve * v.y * (Math.sin(x * 260 + sem) * Math.sin(z * 240 + sem * 2) + .6 * Math.sin(x * 610 + z * 430 + sem * 3)); }
      p.setXYZ(i, v.x * a * f, y * h, v.z * b * f); }
    geo.computeBoundingBox(); const bb = geo.boundingBox, uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) - bb.min.x) / (bb.max.x - bb.min.x), (p.getZ(i) - bb.min.z) / (bb.max.z - bb.min.z));
    geo.computeVertexNormals(); return geo; }
  const conTex = (tex, r = .7, extra = {}) => new THREE.MeshStandardMaterial({ map: tex, roughness: r, ...extra });
  // milanesa napolitana con papas fritas (cebolla opcional): capas apoyadas una sobre otra, sin huecos
  function milanesa(cebolla = false) { const g = new THREE.Group(); plato(g);
    const cx = -.032, piso = .008, alto = .0074; // la milanesa mide ~1,2 cm de alto
    m(ovalo({ a: .094, b: .07, h: alto, borde: [[.05, 2, .7], [.03, 3, 2.1], [.015, 5, .3]], relieve: .09, base: .4, sem: 2, seg: 60 }), conTex(TX.rebozado(), .82), cx, piso + alto * .4, 0, g);
    const tope = piso + alto * 1.4; // arriba del rebozado
    m(ovalo({ a: .076, b: .055, h: .0016, borde: [[.07, 3, 1.2], [.04, 5, .2], [.025, 8, 2.4]], base: .2, sem: 4, seg: 40 }), conTex(TX.salsa(), .38), cx + .002, tope - .0004, .001, g);
    for (const [x, z, r] of [[-.022, -.018, .03], [.014, .02, .028]]) m(ovalo({ a: r, b: r * .86, h: .0012, borde: [[.04, 4, r * 90]], base: .2, sem: 6, seg: 32 }), conTex(TX.jamon(), .55), cx + x, tope + .0012, z, g);
    const queso = m(ovalo({ a: .072, b: .053, h: .0046, borde: [[.08, 3, .4], [.05, 5, 1.7], [.03, 9, .9]], relieve: .2, base: .15, sem: 8, seg: 60 }), conTex(TX.gratinado(), .42), cx, tope + .0018, 0, g);
    const yq = tope + .0018 + .0046;
    for (let i = 0; i < 40; i++) { const a = rnd(i * 5) * 6.283, r = Math.sqrt(rnd(i * 9)) * .9, o = m(new THREE.BoxGeometry(.0028, .0006, .0016), M.oregano, cx + Math.cos(a) * r * .062, yq - (r * r) * .0028, Math.sin(a) * r * .045, g); o.rotation.y = rnd(i) * 3; }
    // papas: apiladas dentro del plato, cada una apoyada en la de abajo
    const papa = conTex(TX.papa(), .6), papaOsc = conTex(TX.papa(), .6, { color: '#E2B98A' }); let puestas = 0;
    for (let i = 0; i < 80 && puestas < 26; i++) { const L = .045 + rnd(i * 2.3) * .02, capa = puestas < 15 ? 0 : 1, x = .074 + rnd(i * 3.7) * .036, z = -.055 + rnd(i * 6.1) * .11, ang = Math.PI / 2 + (rnd(i * 8.3) - .5) * 1.1;
      const ex = Math.cos(ang) * L / 2, ez = Math.sin(ang) * L / 2; if (Math.hypot(x + Math.abs(ex), Math.abs(z) + Math.abs(ez)) > .124) continue;
      const f = m(new THREE.BoxGeometry(L, .009, .009), puestas % 4 ? papa : papaOsc, x, piso + .0045 + capa * .0087, z, g); f.rotation.set(0, -ang, (rnd(i) - .5) * (capa ? .18 : .05)); puestas++; }
    if (cebolla) for (let i = 0; i < 7; i++) { const c = m(new THREE.TorusGeometry(.011 + (i % 3) * .003, .0022, 8, 24), M.cebolla, cx - .04 + i * .013, yq + .0018, (i % 2) * .016 - .008, g); c.rotation.x = Math.PI / 2; c.scale.z = .5; }
    return g; }
  function noquis() { const g = new THREE.Group(); plato(g);
    const sal = m(new THREE.CylinderGeometry(.095, .1, .006, 40), M.salsa, 0, .012, 0, g); sal.scale.z = .9;
    for (let i = 0; i < 26; i++) { const a = rnd(i) * Math.PI * 2, r = Math.sqrt(rnd(i * 3)) * .075; const n = m(new THREE.CapsuleGeometry(.009, .016, 6, 10), M.noqui, Math.cos(a) * r, .022 + rnd(i * 5) * .01, Math.sin(a) * r, g); n.rotation.set(Math.PI / 2, 0, rnd(i * 7) * Math.PI); }
    for (let i = 0; i < 4; i++) { const h = m(new THREE.SphereGeometry(.014, 10, 8), M.albahaca, -.02 + i * .015, .04, -.01 + (i % 2) * .02, g); h.scale.set(1.3, .25, .8); h.rotation.y = i; }
    for (let i = 0; i < 30; i++) m(new THREE.BoxGeometry(.004, .002, .004), M.parme, -.06 + rnd(i * 11) * .12, .04, -.06 + rnd(i * 13) * .12, g);
    return g; }
  function copaVino() { const g = new THREE.Group();
    const perfil = [[0, 0], [.04, 0], [.042, .004], [.006, .008], [.005, .11], [.03, .13], [.043, .17], [.041, .215], [.038, .215], [.04, .17], [.028, .135], [.004, .115]].map(([x, y]) => new THREE.Vector2(x, y));
    m(new THREE.LatheGeometry(perfil, 48), M.vidrio, 0, 0, 0, g);
    const liq = [[0, .117], [.025, .133], [.037, .16], [0, .16]].map(([x, y]) => new THREE.Vector2(x, y)); m(new THREE.LatheGeometry(liq, 48), M.vino, 0, 0, 0, g); return g; }
  function panera() { const g = new THREE.Group(); const c = m(new THREE.CylinderGeometry(.09, .07, .055, 28, 1, true), M.mimbre, 0, .028, 0, g); c.material.side = THREE.DoubleSide; m(new THREE.CylinderGeometry(.07, .07, .004, 28), M.mimbre, 0, .002, 0, g);
    for (let i = 0; i < 5; i++) { const b = m(new THREE.SphereGeometry(.032, 16, 12), i % 2 ? M.pan : M.panOsc, -.035 + (i % 3) * .035, .06, -.025 + Math.floor(i / 3) * .045, g); b.scale.set(1.25, .72, .9); b.rotation.y = i; } return g; }
  function agua() { const g = new THREE.Group(); m(new THREE.CylinderGeometry(.034, .034, .19, 24), M.agua, 0, .095, 0, g); m(new THREE.CylinderGeometry(.014, .03, .04, 16), M.agua, 0, .21, 0, g); m(new THREE.CylinderGeometry(.015, .015, .018, 16), M.tapa, 0, .238, 0, g); return g; }
  const M2 = { masa: mate('#D9A25A', .62), masaOsc: mate('#B97A34', .7), hierro: mate('#2A2623', .55, .4), provo: mate('#EBC46A', .45), dorado: mate('#B8701F', .6),
    aji: mate('#B3261A', .7), carne: mate('#6E3A22', .72), grill: mate('#2A160C', .9), grasa: mate('#E9D3A8', .5), chimi: mate('#3F5E22', .8), papaR: mate('#D9A048', .66),
    flan: mate('#EDB84E', .32), caramelo: new THREE.MeshPhysicalMaterial({ color: '#8A4510', roughness: .15, clearcoat: 1 }), ddl: mate('#94562A', .5), crema: mate('#FBF6EC', .6) };
  // empanadas de carne con repulgue
  function empanadas() { const g = new THREE.Group(); plato(g, .13);
    [[-.035, -.02, .3], [.04, .015, -.5], [-.01, .055, 2.6]].forEach(([x, z, ry], k) => { const e = new THREE.Group(); const s = new THREE.Shape(); s.moveTo(-.058, 0); s.absarc(0, 0, .058, Math.PI, 0, true); s.lineTo(-.058, 0);
      const geo = new THREE.ExtrudeGeometry(s, { depth: .004, bevelEnabled: true, bevelThickness: .013, bevelSize: .009, bevelSegments: 3, curveSegments: 20 }); geo.rotateX(-Math.PI / 2); m(geo, k % 2 ? M2.masaOsc : M2.masa, 0, .018, 0, e);
      for (let i = 0; i <= 12; i++) { const a = Math.PI - i / 12 * Math.PI, b = m(new THREE.SphereGeometry(.0075, 8, 6), M2.masaOsc, Math.cos(a) * .064, .02, -Math.sin(a) * .064, e); b.scale.set(1.25, .55, .8); b.rotation.y = -a; }
      e.position.set(x, 0, z); e.rotation.y = ry; g.add(e); });
    return g; }
  // provoleta en sartén de hierro
  function provoleta() { const g = new THREE.Group(); m(new THREE.CylinderGeometry(.078, .07, .022, 40), M2.hierro, 0, .011, 0, g); const mango = m(new THREE.BoxGeometry(.09, .01, .022), M2.hierro, .12, .018, 0, g); mango.rotation.z = .12;
    m(new THREE.CylinderGeometry(.066, .066, .016, 40), M2.provo, 0, .024, 0, g);
    for (let i = 0; i < 16; i++) { const a = rnd(i) * 6.28, r = Math.sqrt(rnd(i * 3)) * .055, d = m(new THREE.SphereGeometry(.012 + rnd(i * 2) * .01, 12, 8), M2.dorado, Math.cos(a) * r, .032, Math.sin(a) * r, g); d.scale.y = .12; }
    for (let i = 0; i < 26; i++) m(new THREE.BoxGeometry(.003, .001, .003), M.oregano, -.05 + rnd(i * 5) * .1, .034, -.05 + rnd(i * 9) * .1, g);
    for (let i = 0; i < 14; i++) m(new THREE.BoxGeometry(.0025, .001, .0025), M2.aji, -.05 + rnd(i * 17) * .1, .034, -.05 + rnd(i * 19) * .1, g);
    return g; }
  // bife de chorizo con papas rústicas y chimichurri
  function bife() { const g = new THREE.Group(); plato(g);
    const s = new THREE.Shape(); for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 2, rr = .07 + .008 * Math.sin(a * 2 + .5) + .004 * Math.sin(a * 5); s[i ? 'lineTo' : 'moveTo'](Math.cos(a) * rr * 1.2, Math.sin(a) * rr * .78); }
    const geo = new THREE.ExtrudeGeometry(s, { depth: .014, bevelEnabled: true, bevelThickness: .005, bevelSize: .005, bevelSegments: 3 }); geo.rotateX(-Math.PI / 2); m(geo, M2.carne, -.03, .012, 0, g);
    const borde = m(new THREE.TorusGeometry(.06, .006, 8, 24, 1.6), M2.grasa, -.03, .024, 0, g); borde.rotation.x = Math.PI / 2; borde.rotation.z = 2.2; borde.scale.set(1.35, .9, 1);
    for (let i = 0; i < 5; i++) { const b = m(new THREE.BoxGeometry(.13, .0012, .005), M2.grill, -.03 + (i - 2) * .024, .0315, 0, g); b.rotation.y = .75; b.scale.x = 1 - Math.abs(i - 2) * .16; }
    for (let i = 0; i < 7; i++) { const p = m(new THREE.SphereGeometry(.019, 12, 10), i % 2 ? M2.papaR : M.papaOsc, .085 + rnd(i * 3) * .03, .02, -.055 + i * .018, g); p.scale.set(1.5, .7, .8); p.rotation.y = rnd(i) * 3; }
    for (let i = 0; i < 18; i++) { const c = m(new THREE.SphereGeometry(.004, 8, 6), M2.chimi, -.06 + rnd(i * 23) * .06, .033, -.03 + rnd(i * 29) * .05, g); c.scale.y = .35; }
    return g; }
  // flan casero con dulce de leche y crema
  function flan() { const g = new THREE.Group(); plato(g, .1);
    const perfil = [[0, 0], [.044, 0], [.045, .004], [.035, .046], [0, .046]].map(([x, y]) => new THREE.Vector2(x, y)); m(new THREE.LatheGeometry(perfil, 48), M2.flan, 0, .008, 0, g);
    m(new THREE.CylinderGeometry(.035, .035, .003, 40), M2.caramelo, 0, .055, 0, g); const charco = m(new THREE.CylinderGeometry(.062, .062, .002, 40), M2.caramelo, 0, .009, 0, g); charco.scale.z = .92;
    const d = m(new THREE.SphereGeometry(.022, 16, 12), M2.ddl, .052, .022, .035, g); d.scale.y = .7; const c = m(new THREE.SphereGeometry(.02, 16, 12), M2.crema, -.05, .02, .04, g); c.scale.y = .75;
    const p = m(new THREE.ConeGeometry(.01, .02, 12), M2.crema, -.05, .038, .04, g); p.rotation.z = .2;
    return g; }
  /* ---------- cafetería ---------- */
  const loza = mate('#FBF8F2', .18), verdeTaza = mate('#2F4A3A', .35), cuchara = mate('#D7DADF', .22, .35);
  const TXC = {
    latte: () => textura('latte', (g, L) => { const c = L / 2, gr = g.createRadialGradient(c, c, 0, c, c, c); gr.addColorStop(0, '#EAD3AE'); gr.addColorStop(.55, '#DDBB8C'); gr.addColorStop(.82, '#B98652'); gr.addColorStop(1, '#8C5A30'); g.fillStyle = gr; g.fillRect(0, 0, L, L);
      g.fillStyle = '#F4E6CC'; g.globalAlpha = .9; g.beginPath(); const s = L * .2; g.moveTo(c, c + s * .9); g.bezierCurveTo(c - s * 1.6, c - s * .1, c - s * .7, c - s * 1.2, c, c - s * .45); g.bezierCurveTo(c + s * .7, c - s * 1.2, c + s * 1.6, c - s * .1, c, c + s * .9); g.fill(); g.globalAlpha = 1;
      motas(g, L, 160, ['#F7EAD2', '#C99B66'], 1, 3, 51, [.2, .45]); }, 256),
    te: () => textura('te', (g, L) => { const c = L / 2, gr = g.createRadialGradient(c * .8, c * .8, 0, c, c, c); gr.addColorStop(0, '#C5702A'); gr.addColorStop(.7, '#9A4A14'); gr.addColorStop(1, '#6E300C'); g.fillStyle = gr; g.fillRect(0, 0, L, L); }, 128),
    medialuna: (grasa) => textura(grasa ? 'mgrasa' : 'mmanteca', (g, L) => { const gr = g.createLinearGradient(0, 0, 0, L);
      if (grasa) { gr.addColorStop(0, '#E8C487'); gr.addColorStop(.5, '#C98E46'); gr.addColorStop(1, '#E8C487'); } else { gr.addColorStop(0, '#E9B56A'); gr.addColorStop(.25, '#C67A2C'); gr.addColorStop(.5, '#A65E1E'); gr.addColorStop(.75, '#C67A2C'); gr.addColorStop(1, '#E9B56A'); }
      g.fillStyle = gr; g.fillRect(0, 0, L, L); g.strokeStyle = grasa ? 'rgba(150,95,40,.55)' : 'rgba(110,55,15,.6)'; g.lineWidth = L * .012; for (let k = 1; k < 7; k++) { g.beginPath(); g.moveTo(L * k / 7, 0); g.lineTo(L * k / 7, L); g.stroke(); }
      motas(g, L, 220, grasa ? ['#F1D39C', '#B98040'] : ['#F2C47E', '#8E4E18'], .8, 2.4, grasa ? 61 : 67, [.3, .6]); }, 256),
    criollo: () => textura('criollo', (g, L) => { const c = L / 2, gr = g.createRadialGradient(c, c, 0, c, c, c * 1.05); gr.addColorStop(0, '#D9A35C'); gr.addColorStop(.7, '#C98D45'); gr.addColorStop(1, '#E3BD82'); g.fillStyle = gr; g.fillRect(0, 0, L, L);
      g.strokeStyle = 'rgba(120,70,25,.75)'; g.lineWidth = L * .018; for (let k = -4; k <= 4; k++) { g.beginPath(); g.moveTo(c + k * L * .1 - L, -L * .1 + 0); g.lineTo(c + k * L * .1 + L, L * 1.1); g.stroke(); g.beginPath(); g.moveTo(c + k * L * .1 + L, -L * .1); g.lineTo(c + k * L * .1 - L, L * 1.1); g.stroke(); }
      motas(g, L, 200, ['#EFCB8E', '#A86A2A'], .8, 2.4, 71, [.25, .55]); }, 256),
  };
  function platito(padre, r = .075, x = 0, z = 0) { const pl = [[0, 0], [r * .6, 0], [r * .88, .007], [r, .014], [r * .97, .016], [r * .62, .005], [0, .005]].map(([a, b]) => new THREE.Vector2(a, b)); m(new THREE.LatheGeometry(pl, 64), loza, x, 0, z, padre); }
  // taza con plato: el perfil es la pared real (por fuera y por dentro), con asa y una línea verde en el borde
  function taza(liquido) { const g = new THREE.Group(); platito(g);
    const prof = [[0, .006], [.026, .006], [.03, .009], [.036, .03], [.041, .06], [.043, .072], [.04, .072], [.038, .061], [.033, .032], [.026, .012], [0, .012]].map(([a, b]) => new THREE.Vector2(a, b));
    m(new THREE.LatheGeometry(prof, 64), loza, 0, 0, 0, g); const borde = m(new THREE.TorusGeometry(.0415, .0012, 8, 64), verdeTaza, 0, .0705, 0, g); borde.rotation.x = Math.PI / 2;
    const asa = m(new THREE.TorusGeometry(.014, .0038, 12, 32, Math.PI * 1.25), loza, .045, .042, 0, g); asa.rotation.z = -Math.PI * .62;
    const sup = m(new THREE.CircleGeometry(.0385, 48).rotateX(-Math.PI / 2), conTex(liquido === 'te' ? TXC.te() : TXC.latte(), liquido === 'te' ? .08 : .55), 0, .064, 0, g);
    if (liquido === 'te') { const hilo = m(new THREE.CylinderGeometry(.0004, .0004, .05, 4), mate('#EDE6D6', .9), .041, .062, .012, g); hilo.rotation.z = .5; const tag = m(new THREE.BoxGeometry(.003, .022, .016), mate('#E9DFC9', .85), .053, .036, .012, g); tag.rotation.z = .1; }
    const c = new THREE.Group(); m(ovaloSimple(.0085, .0035, .013), cuchara, 0, 0, 0, c); const mango = m(new THREE.BoxGeometry(.034, .0016, .005), cuchara, .024, .0015, 0, c); mango.rotation.z = .05; c.position.set(-.024, .0075, .055); c.rotation.y = .12; g.add(c);
    return g; }
  const ovaloSimple = (a, h, b) => { const s = new THREE.SphereGeometry(1, 24, 12); s.scale(a, h, b); return s; };
  // medialuna: un tubo en arco que se afina en las puntas, con siete "rulos" de masa
  function medialunaGeo(grasa) { const S = 96, C = 28, R = grasa ? .07 : .042, arco = grasa ? Math.PI * .55 : Math.PI * 1.15, pos = [], uv = [], idx = [];
    for (let i = 0; i <= S; i++) { const s = i / S, th = -arco / 2 + s * arco, env = Math.pow(Math.sin(Math.PI * s), .55), rulo = 1 + .13 * Math.abs(Math.sin(s * Math.PI * 7)), r = (grasa ? .013 : .017) * env * rulo;
      const cx = Math.cos(th) * R, cz = Math.sin(th) * R, nx = Math.cos(th), nz = Math.sin(th);
      for (let j = 0; j <= C; j++) { const ph = j / C * Math.PI * 2, cy = Math.sin(ph), cr = Math.cos(ph), yy = (cy > 0 ? cy * (grasa ? .55 : .78) : cy * .25) * r;
        pos.push(cx + nx * cr * r, yy + r * .25, cz + nz * cr * r); uv.push(s, j / C); } }
    for (let i = 0; i < S; i++) for (let j = 0; j < C; j++) { const a = i * (C + 1) + j, b = a + C + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
    if (grasa) geo.translate(-R * .82, 0, 0); else geo.translate(-R * .3, 0, 0); return geo; }
  function medialunas(grasa = false, n = 2) { const g = new THREE.Group(); platito(g, .09); const mat = conTex(TXC.medialuna(grasa), grasa ? .62 : .32, { side: THREE.DoubleSide });
    const k = n === 1 ? 1 : .8, pos = n === 1 ? [[grasa ? -.012 : .004, 0, grasa ? 0 : Math.PI / 2]] : grasa ? [[.005, -.004, 0], [.044, .004, 0]] : [[0, -.034, Math.PI / 2], [0, .036, Math.PI / 2]];
    for (const [x, z, ry] of pos) { const o = m(medialunaGeo(grasa), mat, x, .005, z, g); o.rotation.y = ry; o.scale.setScalar(k); } return g; }
  function criollos() { const g = new THREE.Group(); platito(g, .09); const mat = conTex(TXC.criollo(), .7);
    for (const [x, z] of [[-.03, -.012], [.03, -.016], [0, .036]]) m(ovalo({ a: .028, b: .028, h: .015, borde: [[.03, 3, x * 90], [.02, 5, z * 70]], base: .2, sem: 3, seg: 40 }), mat, x, .005 + .003, z, g);
    return g; }
  function desayuno() { const g = new THREE.Group(); const t = taza('latte'); t.position.set(-.078, 0, -.012); g.add(t); const md = medialunas(false, 2); md.position.set(.09, 0, .02); md.scale.setScalar(.95); g.add(md); return g; }
  const MODELOS = { milanesa: () => milanesa(false), noquis, vino: copaVino, panera, agua, empanadas, provoleta, bife, flan,
    cafeConLeche: () => taza('latte'), te: () => taza('te'), medialunas: () => medialunas(false, 1), medialunaGrasa: () => medialunas(true, 1), criollos, desayuno };

  /* estudio para las fotos y el visor */
  const escena = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(30, 1, .01, 10);
  const hemi = new THREE.HemisphereLight('#fff1dc', '#3a2a1c', .9); escena.add(hemi);
  const key = new THREE.DirectionalLight('#ffe6c6', 2.4); key.position.set(-.6, 1.2, .5); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); Object.assign(key.shadow.camera, { left: -.3, right: .3, top: .3, bottom: -.3, near: .1, far: 3 }); key.shadow.bias = -.0005; escena.add(key);
  const rim = new THREE.DirectionalLight('#ffffff', .8); rim.position.set(.8, .6, -.8); escena.add(rim);
  const madera = (() => { const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d'); for (let i = 0; i < 6; i++) { g.fillStyle = ['#6a4529', '#5e3c22', '#73492b'][i % 3]; g.fillRect(0, i * 86, 512, 86); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, i * 86, 512, 2); for (let k = 0; k < 40; k++) { g.fillStyle = `rgba(255,220,180,${.03 + rnd(i * 40 + k) * .04})`; g.fillRect(rnd(k * 3 + i) * 512, i * 86 + rnd(k * 7) * 86, 60 + rnd(k) * 120, 1); } } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const mesa = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.4), new THREE.MeshStandardMaterial({ map: madera, roughness: .6 })); mesa.rotation.x = -Math.PI / 2; mesa.receiveShadow = true; escena.add(mesa);
  const piso = new THREE.Mesh(new THREE.CircleGeometry(.4, 48), new THREE.ShadowMaterial({ opacity: .35 })); piso.rotation.x = -Math.PI / 2; piso.position.y = .0005; piso.receiveShadow = true; escena.add(piso);
  const cache = {}; let actual = null;
  function poner(nombre) { if (actual) escena.remove(actual); if (!cache[nombre]) cache[nombre] = MODELOS[nombre](); actual = cache[nombre]; escena.add(actual); return actual; }
  function render(R, w, h, fondo) { const sz = new THREE.Vector2(); R.getSize(sz); const prevT = R.toneMapping, prevE = R.toneMappingExposure;
    R.setScissorTest(true); R.setViewport(0, sz.y - h, w, h); R.setScissor(0, sz.y - h, w, h); R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.15;
    escena.background = fondo ? new THREE.Color(fondo) : null; R.render(escena, cam); R.setScissorTest(false); R.setViewport(0, 0, sz.x, sz.y); R.toneMapping = prevT; R.toneMappingExposure = prevE;
    const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(R.domElement, 0, 0, w, h, 0, 0, w, h); return c; }
  // foto fija: cámara a 3/4 desde arriba, sobre la madera
  function foto(R, nombre, w = 512, h = 512, { dist = .52, alt = .46, objetivo = [0, .02, 0], ry = .5 } = {}) {
    mesa.visible = true; piso.visible = false; const o = poner(nombre); o.rotation.y = ry; cam.aspect = w / h; cam.fov = 30; cam.updateProjectionMatrix();
    cam.position.set(Math.sin(.4) * dist, alt, Math.cos(.4) * dist); cam.lookAt(...objetivo); return render(R, w, h, '#6a4529'); }
  // visor: el plato gira sobre fondo neutro con su sombra
  const lienzoVisor = document.createElement('canvas'); const gV = lienzoVisor.getContext('2d');
  function visor(R, t, w, h, nombre = 'milanesa') { mesa.visible = false; piso.visible = true; const o = poner(nombre); o.rotation.y = t * .9; cam.aspect = w / h; cam.fov = 28; cam.updateProjectionMatrix();
    const a = .55 + Math.sin(t * .6) * .08; cam.position.set(Math.sin(.3) * .62, a * .62 + .05, Math.cos(.3) * .62); cam.lookAt(0, .02, 0);
    const c = render(R, w, h, '#ECE7DE'); lienzoVisor.width = w; lienzoVisor.height = h; gV.drawImage(c, 0, 0); return lienzoVisor; }
  // punto 3D del estudio a píxeles de la imagen del visor/foto (para dibujar la medida)
  function aPixel(x, y, z, w, h) { const v = new THREE.Vector3(x, y, z).project(cam); return [(v.x + 1) / 2 * w, (1 - v.y) / 2 * h]; }
  // visor en vivo (la app maneja el render y el giro con el dedo)
  function estudio(nombre) { mesa.visible = false; piso.visible = true; const o = poner(nombre); o.rotation.y = 0; escena.background = null; return { escena, cam, obj: o }; }
  return { MODELOS, foto, visor, aPixel, estudio, crear: n => MODELOS[n]() };
}
