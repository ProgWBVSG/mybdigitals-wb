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
  function milanesa(cebolla = false) { const g = new THREE.Group(); plato(g);
    const forma = new THREE.Shape(); for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 2, rr = .085 + .01 * Math.sin(a * 3) + .006 * Math.sin(a * 7); forma[i ? 'lineTo' : 'moveTo'](Math.cos(a) * rr * 1.15, Math.sin(a) * rr * .8); }
    const ext = new THREE.ExtrudeGeometry(forma, { depth: .011, bevelEnabled: true, bevelThickness: .004, bevelSize: .005, bevelSegments: 3 }); ext.rotateX(-Math.PI / 2);
    const mi = m(ext, M.mila, -.025, .012, .0, g);
    const sal = new THREE.Shape(); for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 2, rr = .068 + .007 * Math.sin(a * 4 + 1); sal[i ? 'lineTo' : 'moveTo'](Math.cos(a) * rr * 1.12, Math.sin(a) * rr * .74); }
    const sg = new THREE.ExtrudeGeometry(sal, { depth: .002, bevelEnabled: true, bevelThickness: .0015, bevelSize: .003, bevelSegments: 2 }); sg.rotateX(-Math.PI / 2); m(sg, M.salsa, -.025, .03, 0, g);
    for (let i = 0; i < 3; i++) { const j = m(new THREE.CylinderGeometry(.03, .03, .003, 20), M.jamon, -.06 + i * .03, .034, -.01 + (i % 2) * .02, g); j.scale.z = .8; }
    for (let i = 0; i < 14; i++) { const q = m(new THREE.SphereGeometry(.018 + rnd(i) * .008, 14, 10), M.queso, -.08 + rnd(i * 3) * .11, .036, -.04 + rnd(i * 7) * .08, g); q.scale.y = .28; }
    for (let i = 0; i < 22; i++) m(new THREE.BoxGeometry(.003, .001, .003), M.oregano, -.08 + rnd(i * 5) * .11, .041, -.04 + rnd(i * 9) * .08, g);
    for (let i = 0; i < 16; i++) { const f = m(new THREE.BoxGeometry(.042 + rnd(i) * .016, .0065, .0065), i % 3 ? M.papa : M.papaOsc, .085 + rnd(i * 2) * .025, .014 + (i % 3) * .008, -.05 + rnd(i * 4) * .1, g); f.rotation.y = rnd(i * 6) * Math.PI; f.rotation.z = (rnd(i) - .5) * .3; }
    if (cebolla) for (let i = 0; i < 7; i++) { const c = m(new THREE.TorusGeometry(.012 + (i % 3) * .004, .0028, 6, 18), M.cebolla, -.07 + i * .017, .044, (i % 2) * .018 - .009, g); c.rotation.x = Math.PI / 2 + (i - 3) * .15; }
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
      const geo = new THREE.ExtrudeGeometry(s, { depth: .004, bevelEnabled: true, bevelThickness: .013, bevelSize: .009, bevelSegments: 5, curveSegments: 28 }); geo.rotateX(-Math.PI / 2); m(geo, k % 2 ? M2.masaOsc : M2.masa, 0, .018, 0, e);
      for (let i = 0; i <= 12; i++) { const a = Math.PI - i / 12 * Math.PI, b = m(new THREE.SphereGeometry(.0075, 10, 8), M2.masaOsc, Math.cos(a) * .064, .02, -Math.sin(a) * .064, e); b.scale.set(1.25, .55, .8); b.rotation.y = -a; }
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
  const MODELOS = { milanesa: () => milanesa(false), milanesaCebolla: () => milanesa(true), noquis, vino: copaVino, panera, agua, empanadas, provoleta, bife, flan };

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
