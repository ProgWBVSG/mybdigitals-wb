/* El plato en tu mesa, con la cámara y en tamaño real.
   - Android con Chrome (ARCore): realidad aumentada propia con WebXR. Detecta superficies horizontales, distingue mesa de piso
     por la altura y mide a qué distancia está el celular. Al tocar, sirve el plato en tamaño real con su medida.
   - iPhone: Safari no deja usar WebXR, así que se abre el visor de Apple (AR Quick Look) con el modelo en tamaño real.
   - Android sin WebXR: Scene Viewer de Google, también en tamaño real.
   - Compu: no hay cámara útil; se muestra un QR para abrirlo en el celular. */
export const esIOS = () => { try { return document.createElement('a').relList.supports('ar'); } catch { return false; } };
export const esAndroid = () => /Android/i.test(navigator.userAgent);
let soporte = null;
export async function soportaWebXR() { if (soporte != null) return soporte; try { soporte = !!(navigator.xr && await navigator.xr.isSessionSupported('immersive-ar')); } catch { soporte = false; } return soporte; }
export function modoAR() { return esIOS() ? 'ios' : esAndroid() ? 'android' : 'compu'; }
export const urlUSDZ = m => new URL(`modelos/${m}.usdz#allowsContentScaling=0`, document.baseURI).href;
export function urlSceneViewer(m, titulo) { const glb = new URL(`modelos/${m}.glb`, document.baseURI).href, vuelta = location.href;
  return `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(glb)}&mode=ar_preferred&resizable=false&title=${encodeURIComponent(titulo)}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(vuelta)};end;`; }

/* clasifica lo que apunta la cámara */
export function clasificar({ horizontal, alturaPiso, caida, distancia }) {
  if (!horizontal) return { tipo: 'no', txt: 'Apuntá a una superficie plana' };
  let tipo;
  if (alturaPiso != null) tipo = alturaPiso > .4 && alturaPiso < 1.3 ? 'mesa' : alturaPiso < .25 ? 'piso' : 'duda';
  else tipo = caida < .85 ? 'mesa' : caida > 1.05 ? 'piso' : 'duda';
  if (tipo === 'piso') return { tipo, txt: 'Eso parece el piso. Apuntá a la mesa' };
  if (distancia > 1.3) return { tipo: 'lejos', txt: `Mesa a ${metros(distancia)}. Acercate un poco` };
  if (distancia < .18) return { tipo: 'cerca', txt: 'Muy cerca. Alejá un poco el celular' };
  return { tipo: tipo === 'duda' ? 'duda' : 'ok', txt: tipo === 'duda' ? `Superficie a ${metros(distancia)}. ¿Es la mesa? Tocá para servir` : `Mesa encontrada a ${metros(distancia)}. Tocá para servir` };
}
export const metros = d => d < 1 ? `${Math.round(d * 100)} cm` : `${d.toFixed(1).replace('.', ',')} m`;

/* sesión propia con WebXR (Android) */
export async function iniciarWebXR({ THREE, PLATOS, plato, ui, alAgregar, alTerminar }) {
  const sesion = await navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay', 'local-floor', 'light-estimation'], domOverlay: { root: ui } });
  let tipoRef = 'local'; try { await sesion.requestReferenceSpace('local-floor'); tipoRef = 'local-floor'; } catch {}
  const R = new THREE.WebGLRenderer({ antialias: true, alpha: true }); R.setPixelRatio(Math.min(devicePixelRatio, 2)); R.outputColorSpace = THREE.SRGBColorSpace;
  R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.1; R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  R.xr.enabled = true; R.xr.setReferenceSpaceType(tipoRef); R.domElement.style.display = 'none'; document.body.appendChild(R.domElement); await R.xr.setSession(sesion);
  const escena = new THREE.Scene(), cam = new THREE.PerspectiveCamera();
  escena.add(new THREE.HemisphereLight('#fff6ea', '#5a4a3c', 1.1)); const sol = new THREE.DirectionalLight('#fff1dc', 1.8); sol.position.set(-.4, 1.2, .3); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024);
  Object.assign(sol.shadow.camera, { left: -.3, right: .3, top: .3, bottom: -.3, near: .05, far: 3 }); sol.shadow.bias = -.0004; escena.add(sol, sol.target);
  const radio = plato.r3d || .1, verde = new THREE.Color('#C3D809'), blanco = new THREE.Color('#ffffff'), rojo = new THREE.Color('#FF8A65');
  // marca en la mesa: un círculo del tamaño real del plato, con su medida
  const marca = new THREE.Group(); marca.matrixAutoUpdate = false; marca.visible = false; escena.add(marca);
  const aro = new THREE.Mesh(new THREE.RingGeometry(radio - .004, radio, 64).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: blanco, transparent: true, opacity: .95 }));
  const relleno = new THREE.Mesh(new THREE.CircleGeometry(radio, 64).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: blanco, transparent: true, opacity: .12 }));
  const punto = new THREE.Mesh(new THREE.CircleGeometry(.006, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: blanco })); marca.add(relleno, aro, punto);
  const cotaTxt = plato.medida?.match(/(\d+)\s*cm/)?.[1];
  const etiqueta = texto => { const c = document.createElement('canvas'); c.width = 256; c.height = 96; const g = c.getContext('2d'); g.fillStyle = 'rgba(20,18,16,.88)'; g.beginPath(); g.roundRect(8, 14, 240, 68, 34); g.fill();
    g.fillStyle = '#fff'; g.font = '600 40px Geist, system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(texto, 128, 50); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true })); s.scale.set(.085, .032, 1); s.renderOrder = 9; return s; };
  const cota = (y) => { const g = new THREE.Group(); const pts = [new THREE.Vector3(-radio, y, radio + .025), new THREE.Vector3(radio, y, radio + .025)];
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: '#ffffff', dashSize: .008, gapSize: .006, depthTest: false })); l.computeLineDistances(); l.renderOrder = 8; g.add(l);
    for (const x of [-radio, radio]) { const t = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, y, radio + .015), new THREE.Vector3(x, y, radio + .035)]), new THREE.LineBasicMaterial({ color: '#ffffff', depthTest: false })); t.renderOrder = 8; g.add(t); }
    if (cotaTxt) { const e = etiqueta(cotaTxt + ' cm'); e.position.set(0, y + .012, radio + .06); g.add(e); } return g; };
  if (plato.r3d) marca.add(cota(.002));
  // el plato servido
  const servido = new THREE.Group(); servido.visible = false; escena.add(servido);
  const modelo = PLATOS.crear(plato.modelo); modelo.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); servido.add(modelo);
  const sombra = new THREE.Mesh(new THREE.PlaneGeometry(.8, .8).rotateX(-Math.PI / 2), new THREE.ShadowMaterial({ opacity: .32 })); sombra.receiveShadow = true; sombra.position.y = .0005; servido.add(sombra);
  if (plato.r3d) servido.add(cota(.0015));
  const fuente = await sesion.requestHitTestSource({ space: await sesion.requestReferenceSpace('viewer') });
  const $ = s => ui.querySelector(s), estado = $('[data-ar-estado]'), pista = $('[data-ar-pista]'), btnMover = $('[data-ar-mover]'), btnGirar = $('[data-ar-girar]');
  let modo = 'buscar', ultimo = null, ultimoClas = null, pegado = 0;
  const pintarEstado = (txt, tipo) => { estado.textContent = txt; estado.dataset.tipo = tipo; };
  ui.querySelectorAll('button, a').forEach(b => b.addEventListener('beforexrselect', e => e.preventDefault()));
  sesion.addEventListener('select', () => { if (modo !== 'buscar' || !ultimo || ultimoClas?.tipo === 'no') return;
    servido.position.setFromMatrixPosition(marca.matrix); servido.quaternion.setFromRotationMatrix(marca.matrix); servido.visible = true; marca.visible = false; modo = 'servido';
    sol.target.position.copy(servido.position); sol.position.copy(servido.position).add(new THREE.Vector3(-.4, 1.2, .3)); pegado = performance.now();
    btnMover.hidden = false; btnGirar.hidden = false; pista.textContent = plato.r3d ? `Así se ve en tu mesa: ${plato.medida}` : plato.medida || 'Tamaño real';
    try { navigator.vibrate && navigator.vibrate(18); } catch {} });
  btnMover.onclick = () => { modo = 'buscar'; servido.visible = false; btnMover.hidden = true; btnGirar.hidden = true; pista.textContent = 'Movete despacio para que encuentre la mesa'; };
  btnGirar.onclick = () => { modelo.rotation.y += Math.PI / 4; };
  $('[data-ar-agregar]').onclick = () => { alAgregar && alAgregar(); sesion.end(); };
  $('[data-ar-cerrar]').onclick = () => sesion.end();
  const p = new THREE.Vector3(), q = new THREE.Vector3(), n = new THREE.Vector3(), mtx = new THREE.Matrix4();
  R.setAnimationLoop((t, frame) => { if (!frame) return; const ref = R.xr.getReferenceSpace(), vista = frame.getViewerPose(ref); if (!vista) return;
    const cp = vista.transform.position; q.set(cp.x, cp.y, cp.z);
    if (modo === 'buscar') { const hits = frame.getHitTestResults(fuente);
      if (hits.length) { const pose = hits[0].getPose(ref); mtx.fromArray(pose.transform.matrix); marca.matrix.copy(mtx); marca.visible = true; p.setFromMatrixPosition(mtx); n.set(0, 1, 0).applyQuaternion(new THREE.Quaternion().setFromRotationMatrix(mtx));
        const c = clasificar({ horizontal: n.y > .92, alturaPiso: tipoRef === 'local-floor' ? p.y : null, caida: q.y - p.y, distancia: p.distanceTo(q) }); ultimo = p.clone(); ultimoClas = c;
        const col = c.tipo === 'ok' ? verde : c.tipo === 'piso' || c.tipo === 'no' ? rojo : blanco; aro.material.color.copy(col); relleno.material.color.copy(col); punto.material.color.copy(col);
        pintarEstado(c.txt, c.tipo); pista.textContent = c.tipo === 'ok' ? 'El círculo es el tamaño real del plato' : 'Movete despacio para que encuentre la mesa';
      } else { marca.visible = false; ultimo = null; pintarEstado('Buscando la mesa…', 'buscar'); } }
    else { const d = servido.position.distanceTo(q); pintarEstado(`Plato servido · estás a ${metros(d)}`, 'ok'); }
    R.render(escena, cam); });
  sesion.addEventListener('end', () => { R.setAnimationLoop(null); try { fuente.cancel(); } catch {} R.dispose(); R.domElement.remove(); alTerminar && alTerminar(); }, { once: true });
  return sesion;
}
