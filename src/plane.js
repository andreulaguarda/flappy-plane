import * as THREE from 'three';
import { DEFAULT_PLANE_ID } from './planes.js';

function mat(color, roughness = 0.48, extra = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    flatShading: true,
    ...extra
  });
}

const COMMON_MATS = {
  dark: mat(0x1e293b, 0.6),
  steel: mat(0x64748b, 0.45, { metalness: 0.35 }),
  white: mat(0xf8fafc, 0.5),
  yellow: mat(0xfacc15, 0.4),
  skin: mat(0xfdba74, 0.6),
  glass: mat(0x7dd3fc, 0.15, {
    metalness: 0.3,
    transparent: true,
    opacity: 0.82
  }),
  amberGlass: mat(0xfbbf24, 0.18, {
    metalness: 0.4,
    transparent: true,
    opacity: 0.85
  })
};

function createPropellerUnit(scale = 1, fourBlades = false, bladeColor = 0x1e293b) {
  const prop = new THREE.Group();
  prop.scale.setScalar(scale);
  const bMat = mat(bladeColor, 0.5);

  const spinner = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.25, 8), bMat);
  spinner.rotation.z = -Math.PI / 2;
  spinner.position.x = 0.06;
  prop.add(spinner);

  const bladeGeo = new THREE.BoxGeometry(0.05, 1.35, 0.16);
  const blade1 = new THREE.Mesh(bladeGeo, bMat);
  prop.add(blade1);

  if (fourBlades) {
    const blade2 = new THREE.Mesh(bladeGeo, bMat);
    blade2.rotation.x = Math.PI / 2;
    prop.add(blade2);
  } else {
    const tipGeo = new THREE.BoxGeometry(0.055, 1.35, 0.14);
    const blade2 = new THREE.Mesh(tipGeo, bMat);
    blade2.rotation.x = Math.PI / 2;
    prop.add(blade2);
  }

  return prop;
}

// 1. ATLAS CARGO: Carguero/pasajeros grande y pesado bimotor con cola en T
function buildAtlasCargo() {
  const model = new THREE.Group();
  const props = [];
  const blueMat = mat(0x2563eb, 0.48);
  const navyMat = mat(0x1e3a8a, 0.55);

  // Fuselaje ancho de transporte
  const fuselageGeo = new THREE.CylinderGeometry(0.58, 0.64, 2.35, 10);
  fuselageGeo.rotateZ(Math.PI / 2);
  const fuselage = new THREE.Mesh(fuselageGeo, COMMON_MATS.white);
  fuselage.castShadow = true;
  model.add(fuselage);

  // Panza azul de carga
  const bellyGeo = new THREE.BoxGeometry(2.15, 0.46, 1.12);
  const belly = new THREE.Mesh(bellyGeo, blueMat);
  belly.position.set(-0.05, -0.26, 0);
  model.add(belly);

  // Morro redondeado y parabrisas de cabina de mando
  const noseGeo = new THREE.SphereGeometry(0.58, 10, 8);
  noseGeo.scale(1.15, 0.92, 0.95);
  const nose = new THREE.Mesh(noseGeo, blueMat);
  nose.position.set(1.12, -0.04, 0);
  model.add(nose);

  const cockpitGlass = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.28, 0.88),
    COMMON_MATS.glass
  );
  cockpitGlass.position.set(1.02, 0.24, 0);
  model.add(cockpitGlass);

  // Rampa y cono de cola trasero
  const tailGeo = new THREE.CylinderGeometry(0.22, 0.6, 1.05, 10);
  tailGeo.rotateZ(Math.PI / 2);
  const tailCone = new THREE.Mesh(tailGeo, COMMON_MATS.white);
  tailCone.position.set(-1.55, 0.08, 0);
  model.add(tailCone);

  // Cola alta en T
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.05, 0.16), navyMat);
  fin.position.set(-1.82, 0.62, 0);
  fin.rotation.z = 0.22;
  const tStab = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 1.75), blueMat);
  tStab.position.set(-1.95, 1.12, 0);
  model.add(fin, tStab);

  // Gran ala alta de carguero
  const mainWing = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.16, 3.65), COMMON_MATS.white);
  mainWing.position.set(0.08, 0.56, 0);
  mainWing.castShadow = true;
  model.add(mainWing);

  // Dos góndolas de motor en las alas con hélices
  [-1.12, 1.12].forEach((zPos) => {
    const nacelleGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.85, 8);
    nacelleGeo.rotateZ(Math.PI / 2);
    const nacelle = new THREE.Mesh(nacelleGeo, navyMat);
    nacelle.position.set(0.32, 0.36, zPos);
    model.add(nacelle);

    const p = createPropellerUnit(0.76, true);
    p.position.set(0.78, 0.36, zPos);
    model.add(p);
    props.push(p);
  });

  // Tren de aterrizaje pesado multipar
  const wheelGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.14, 10);
  wheelGeo.rotateX(Math.PI / 2);
  [-0.5, 0.5].forEach((zPos) => {
    const pod = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.28, 0.24), navyMat);
    pod.position.set(0.05, -0.52, zPos);
    model.add(pod);

    [-0.22, 0.24].forEach((xOff) => {
      const wheel = new THREE.Mesh(wheelGeo, COMMON_MATS.dark);
      wheel.position.set(0.05 + xOff, -0.7, zPos);
      model.add(wheel);
    });
  });

  return { model, props };
}

// 2. AERO CLASSIC: El avión original (biplano acrobático rojo, blanco y amarillo)
function buildAeroClassic() {
  const model = new THREE.Group();
  const redMat = mat(0xff3b30, 0.45);

  const bodyGeo = new THREE.CylinderGeometry(0.42, 0.52, 1.55, 8);
  bodyGeo.rotateZ(Math.PI / 2);
  const body = new THREE.Mesh(bodyGeo, redMat);
  body.castShadow = true;
  body.receiveShadow = true;
  model.add(body);

  const stripeGeo = new THREE.CylinderGeometry(0.47, 0.5, 0.42, 8);
  stripeGeo.rotateZ(Math.PI / 2);
  const stripe = new THREE.Mesh(stripeGeo, COMMON_MATS.white);
  stripe.position.x = -0.05;
  stripe.castShadow = true;
  model.add(stripe);

  const noseGeo = new THREE.CylinderGeometry(0.24, 0.42, 0.42, 8);
  noseGeo.rotateZ(-Math.PI / 2);
  const nose = new THREE.Mesh(noseGeo, COMMON_MATS.yellow);
  nose.position.x = 0.96;
  nose.castShadow = true;
  model.add(nose);

  const tailConeGeo = new THREE.CylinderGeometry(0.16, 0.52, 0.85, 8);
  tailConeGeo.rotateZ(Math.PI / 2);
  const tailCone = new THREE.Mesh(tailConeGeo, redMat);
  tailCone.position.x = -1.15;
  tailCone.castShadow = true;
  model.add(tailCone);

  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.68, 0.12), redMat);
  fin.position.set(-1.35, 0.36, 0);
  fin.rotation.z = 0.25;
  fin.castShadow = true;
  model.add(fin);

  const hStab = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.09, 1.35), COMMON_MATS.white);
  hStab.position.set(-1.32, 0.1, 0);
  hStab.castShadow = true;
  model.add(hStab);

  const topWing = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.1, 2.75), COMMON_MATS.white);
  topWing.position.set(0.12, 0.68, 0);
  topWing.castShadow = true;
  topWing.receiveShadow = true;
  model.add(topWing);

  const botWing = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.1, 2.45), redMat);
  botWing.position.set(0.08, -0.32, 0);
  botWing.castShadow = true;
  botWing.receiveShadow = true;
  model.add(botWing);

  const strutGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.98, 6);
  [-0.85, 0.85].forEach((zPos) => {
    const strut = new THREE.Mesh(strutGeo, COMMON_MATS.yellow);
    strut.position.set(0.1, 0.18, zPos);
    model.add(strut);
  });

  const canopyGeo = new THREE.SphereGeometry(0.32, 8, 6);
  canopyGeo.scale(1.3, 0.85, 0.85);
  const canopy = new THREE.Mesh(canopyGeo, COMMON_MATS.glass);
  canopy.position.set(-0.15, 0.38, 0);
  model.add(canopy);

  const pilotHead = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), COMMON_MATS.skin);
  pilotHead.position.set(-0.22, 0.44, 0);
  model.add(pilotHead);

  const wheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 10);
  wheelGeo.rotateX(Math.PI / 2);
  [-0.38, 0.38].forEach((zPos) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6), COMMON_MATS.dark);
    leg.position.set(0.25, -0.52, zPos * 0.85);
    leg.rotation.z = 0.2;
    model.add(leg);

    const wheel = new THREE.Mesh(wheelGeo, COMMON_MATS.dark);
    wheel.position.set(0.32, -0.7, zPos);
    model.add(wheel);
  });

  const prop = createPropellerUnit(1, true);
  prop.position.set(1.22, 0, 0);
  model.add(prop);

  return { model, props: [prop] };
}

// 3. BARON VINTAGE: Biplano histórico verde inglés y crema de morro largo
function buildBaronVintage() {
  const model = new THREE.Group();
  const greenMat = mat(0x15803d, 0.5);
  const creamMat = mat(0xfef3c7, 0.55);
  const brassMat = mat(0xd97706, 0.35, { metalness: 0.4 });

  const bodyGeo = new THREE.CylinderGeometry(0.38, 0.46, 1.85, 8);
  bodyGeo.rotateZ(Math.PI / 2);
  const body = new THREE.Mesh(bodyGeo, greenMat);
  body.castShadow = true;
  model.add(body);

  const cowlGeo = new THREE.CylinderGeometry(0.36, 0.4, 0.45, 8);
  cowlGeo.rotateZ(Math.PI / 2);
  const cowl = new THREE.Mesh(cowlGeo, brassMat);
  cowl.position.x = 1.05;
  model.add(cowl);

  const tailGeo = new THREE.CylinderGeometry(0.14, 0.46, 0.95, 8);
  tailGeo.rotateZ(Math.PI / 2);
  const tail = new THREE.Mesh(tailGeo, greenMat);
  tail.position.x = -1.3;
  model.add(tail);

  const rudder = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.1, 8), creamMat);
  rudder.rotation.x = Math.PI / 2;
  rudder.position.set(-1.62, 0.32, 0);
  const hStab = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 1.45), creamMat);
  hStab.position.set(-1.5, 0.08, 0);
  model.add(rudder, hStab);

  // Doble ala escalonada en color crema con montantes dobles
  const topWing = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.09, 3.05), creamMat);
  topWing.position.set(0.32, 0.74, 0);
  topWing.castShadow = true;
  const botWing = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.09, 2.75), creamMat);
  botWing.position.set(-0.05, -0.34, 0);
  model.add(topWing, botWing);

  [-1.05, -0.55, 0.55, 1.05].forEach((zPos) => {
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.12, 5), brassMat);
    strut.position.set(0.14, 0.2, zPos);
    strut.rotation.z = -0.32;
    model.add(strut);
  });

  const pilot = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), COMMON_MATS.skin);
  pilot.position.set(-0.35, 0.48, 0);
  model.add(pilot);

  const wheelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.1, 10);
  wheelGeo.rotateX(Math.PI / 2);
  [-0.42, 0.42].forEach((zPos) => {
    const wheel = new THREE.Mesh(wheelGeo, COMMON_MATS.dark);
    wheel.position.set(0.42, -0.68, zPos);
    model.add(wheel);
  });

  const prop = createPropellerUnit(1.05, false, 0x78350f);
  prop.position.set(1.32, 0, 0);
  model.add(prop);

  return { model, props: [prop] };
}

// 4. MULE FREIGHTER: Avión de hélice de carga media con fuselaje cuadrado y doble cola
function buildMuleFreighter() {
  const model = new THREE.Group();
  const props = [];
  const yellowMat = mat(0xeab308, 0.5);
  const slateMat = mat(0x334155, 0.6);

  // Fuselaje cuadrado industrial
  const boxBody = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.92, 0.98), yellowMat);
  boxBody.castShadow = true;
  model.add(boxBody);

  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.68, 0.86), slateMat);
  nose.position.set(1.22, -0.1, 0);
  const windshield = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.32, 0.88),
    COMMON_MATS.glass
  );
  windshield.position.set(0.95, 0.25, 0);
  model.add(nose, windshield);

  // Doble botalón / cola en H
  const hBoom = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.42, 0.8), slateMat);
  hBoom.position.set(-1.35, 0.12, 0);
  const hTail = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.1, 1.85), yellowMat);
  hTail.position.set(-1.72, 0.28, 0);
  model.add(hBoom, hTail);

  [-0.88, 0.88].forEach((zPos) => {
    const twinFin = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.78, 0.12), slateMat);
    twinFin.position.set(-1.72, 0.35, zPos);
    model.add(twinFin);
  });

  const highWing = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.14, 3.25), slateMat);
  highWing.position.set(0.15, 0.52, 0);
  model.add(highWing);

  [-0.95, 0.95].forEach((zPos) => {
    const engine = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.36, 0.38), COMMON_MATS.dark);
    engine.position.set(0.42, 0.38, zPos);
    model.add(engine);

    const p = createPropellerUnit(0.82, true);
    p.position.set(0.85, 0.38, zPos);
    model.add(p);
    props.push(p);
  });

  const wheelGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.14, 10);
  wheelGeo.rotateX(Math.PI / 2);
  [-0.46, 0.46].forEach((zPos) => {
    const wheel = new THREE.Mesh(wheelGeo, COMMON_MATS.dark);
    wheel.position.set(0.2, -0.66, zPos);
    model.add(wheel);
  });

  return { model, props };
}

// 5. LAGOON MARINER: Hidroavión con flotadores inferiores y motor elevado sobre pilón
function buildLagoonMariner() {
  const model = new THREE.Group();
  const cyanMat = mat(0x0284c7, 0.45);
  const orangeMat = mat(0xf97316, 0.45);

  // Casco de hidroavión
  const hullGeo = new THREE.CylinderGeometry(0.42, 0.5, 1.9, 8);
  hullGeo.rotateZ(Math.PI / 2);
  const hull = new THREE.Mesh(hullGeo, COMMON_MATS.white);
  hull.castShadow = true;
  model.add(hull);

  const bow = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.65, 8), cyanMat);
  bow.rotation.z = -Math.PI / 2;
  bow.position.set(1.22, 0, 0);
  model.add(bow);

  const canopy = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.34, 0.72), COMMON_MATS.glass);
  canopy.position.set(0.45, 0.3, 0);
  model.add(canopy);

  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.42, 0.45), cyanMat);
  tail.position.set(-1.25, 0.12, 0);
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.85, 0.12), orangeMat);
  fin.position.set(-1.58, 0.55, 0);
  const hStab = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 1.5), COMMON_MATS.white);
  hStab.position.set(-1.55, 0.62, 0);
  model.add(tail, fin, hStab);

  // Ala parasol y motor elevado sobre el ala
  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.12, 3.1), orangeMat);
  wing.position.set(0.05, 0.58, 0);
  model.add(wing);

  const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.48, 0.16), cyanMat);
  pylon.position.set(0.15, 0.82, 0);
  const enginePod = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.75, 8), cyanMat);
  enginePod.rotation.z = Math.PI / 2;
  enginePod.position.set(0.25, 1.05, 0);
  model.add(pylon, enginePod);

  const prop = createPropellerUnit(0.85, true);
  prop.position.set(0.68, 1.05, 0);
  model.add(prop);

  // Dos grandes flotadores/patines inferiores
  [-0.58, 0.58].forEach((zPos) => {
    const pontoonGeo = new THREE.CylinderGeometry(0.16, 0.18, 1.75, 8);
    pontoonGeo.rotateZ(Math.PI / 2);
    const pontoon = new THREE.Mesh(pontoonGeo, cyanMat);
    pontoon.position.set(0.15, -0.66, zPos);
    const strut = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.55, 6),
      COMMON_MATS.steel
    );
    strut.position.set(0.15, -0.38, zPos);
    model.add(pontoon, strut);
  });

  return { model, props: [prop] };
}

// 6. BREEZE ULTRALIGHT: Ultraligero de ala delta parasol y chasis tubular abierto
function buildBreezeUltralight() {
  const model = new THREE.Group();
  const limeMat = mat(0x84cc16, 0.45);
  const tealMat = mat(0x06b6d4, 0.45);

  // Barquilla abierta y piloto
  const pod = new THREE.Mesh(new THREE.ConeGeometry(0.36, 1.15, 6), limeMat);
  pod.rotation.z = -Math.PI / 2;
  pod.position.set(0.35, -0.18, 0);
  model.add(pod);

  const pilot = new THREE.Mesh(new THREE.SphereGeometry(0.21, 8, 8), COMMON_MATS.skin);
  pilot.position.set(0.15, 0.15, 0);
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.24, 0.42), COMMON_MATS.glass);
  visor.position.set(0.45, 0.1, 0);
  model.add(pilot, visor);

  // Viga tubular trasera y cola ligera
  const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.85, 6), COMMON_MATS.steel);
  boom.rotation.z = Math.PI / 2;
  boom.position.set(-0.62, -0.05, 0);
  const fin = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.75, 3), tealMat);
  fin.position.set(-1.42, 0.28, 0);
  model.add(boom, fin);

  // Ala delta superior sobre mástil en A
  const deltaWing = new THREE.Mesh(new THREE.ConeGeometry(1.55, 1.5, 3), limeMat);
  deltaWing.rotation.z = -Math.PI / 2;
  deltaWing.scale.set(0.12, 1.15, 1.75);
  deltaWing.position.set(0.05, 0.72, 0);
  model.add(deltaWing);

  [-0.35, 0.35].forEach((zPos) => {
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.92, 5), COMMON_MATS.steel);
    mast.position.set(0.1, 0.25, zPos);
    mast.rotation.x = -zPos * 0.55;
    model.add(mast);
  });

  // Hélice impulsora trasera (pusher)
  const prop = createPropellerUnit(0.75, false);
  prop.position.set(-0.38, 0.22, 0);
  model.add(prop);

  // Ruedas ligeras de triciclo
  const wheelGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 8);
  wheelGeo.rotateX(Math.PI / 2);
  [-0.35, 0.35].forEach((zPos) => {
    const w = new THREE.Mesh(wheelGeo, COMMON_MATS.dark);
    w.position.set(0.1, -0.64, zPos);
    model.add(w);
  });

  return { model, props: [prop] };
}

// 7. SOVEREIGN EXEC: Jet ejecutivo estilizado con alas en flecha y turbinas traseras
function buildSovereignExec() {
  const model = new THREE.Group();
  const props = [];
  const sapphireMat = mat(0x1d4ed8, 0.35, { metalness: 0.25 });
  const goldMat = mat(0xfacc15, 0.3, { metalness: 0.45 });

  const bodyGeo = new THREE.CylinderGeometry(0.38, 0.42, 2.05, 10);
  bodyGeo.rotateZ(Math.PI / 2);
  const body = new THREE.Mesh(bodyGeo, COMMON_MATS.white);
  body.castShadow = true;
  model.add(body);

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.08, 0.12, 0.84), goldMat);
  stripe.position.set(0, 0.02, 0);
  model.add(stripe);

  // Morro ejecutivo afilado
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.85, 10), COMMON_MATS.white);
  nose.rotation.z = -Math.PI / 2;
  nose.position.set(1.42, 0, 0);
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.24, 0.66), COMMON_MATS.glass);
  visor.position.set(0.88, 0.22, 0);
  model.add(nose, visor);

  // Alas bajas en flecha con winglets azules
  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.09, 2.75), sapphireMat);
  wing.position.set(-0.05, -0.18, 0);
  model.add(wing);

  [-1.36, 1.36].forEach((zPos) => {
    const winglet = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.42, 0.08), goldMat);
    winglet.position.set(-0.18, 0.02, zPos);
    model.add(winglet);
  });

  // Dos turbinas traseras junto a la cola
  [-0.58, 0.58].forEach((zPos) => {
    const podGeo = new THREE.CylinderGeometry(0.22, 0.2, 0.72, 8);
    podGeo.rotateZ(Math.PI / 2);
    const pod = new THREE.Mesh(podGeo, sapphireMat);
    pod.position.set(-0.85, 0.18, zPos);
    model.add(pod);

    const fan = createPropellerUnit(0.35, true, 0xfacc15);
    fan.position.set(-0.48, 0.18, zPos);
    model.add(fan);
    props.push(fan);
  });

  // Cola en T estilizada
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.82, 0.1), sapphireMat);
  fin.position.set(-1.25, 0.52, 0);
  fin.rotation.z = 0.35;
  const tTail = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 1.25), COMMON_MATS.white);
  tTail.position.set(-1.42, 0.9, 0);
  model.add(fin, tTail);

  return { model, props };
}

// 8. VALKYRIE INTERCEPTOR: Caza de ala delta, morro afilado y doble cola en V
function buildValkyrieInterceptor() {
  const model = new THREE.Group();
  const titaniumMat = mat(0x334155, 0.42, { metalness: 0.35 });
  const crimsonMat = mat(0xdc2626, 0.45);
  const afterburnerMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.44, 1.95, 6), titaniumMat);
  body.rotation.z = Math.PI / 2;
  body.castShadow = true;
  model.add(body);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.05, 6), crimsonMat);
  nose.rotation.z = -Math.PI / 2;
  nose.position.set(1.48, 0, 0);
  model.add(nose);

  const canopyGeo = new THREE.SphereGeometry(0.28, 8, 6);
  canopyGeo.scale(1.85, 0.75, 0.78);
  const canopy = new THREE.Mesh(canopyGeo, COMMON_MATS.amberGlass);
  canopy.position.set(0.35, 0.28, 0);
  model.add(canopy);

  // Ala delta ancha
  const deltaGeo = new THREE.ConeGeometry(1.5, 1.7, 3);
  deltaGeo.rotateZ(-Math.PI / 2);
  const deltaWing = new THREE.Mesh(deltaGeo, titaniumMat);
  deltaWing.scale.set(0.08, 1.15, 1.75);
  deltaWing.position.set(-0.18, -0.05, 0);
  model.add(deltaWing);

  [-1.32, 1.32].forEach((zPos) => {
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.85, 6), crimsonMat);
    rail.rotation.z = Math.PI / 2;
    rail.position.set(-0.2, -0.05, zPos);
    model.add(rail);
  });

  // Doble deriva inclinada en V
  [-0.38, 0.38].forEach((zPos) => {
    const vFin = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.68, 0.09), crimsonMat);
    vFin.position.set(-1.05, 0.42, zPos);
    vFin.rotation.x = -zPos * 0.7;
    vFin.rotation.z = 0.28;
    model.add(vFin);
  });

  // Tobera trasera con postquemador y rotor
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.32, 0.35, 8), COMMON_MATS.dark);
  nozzle.rotation.z = Math.PI / 2;
  nozzle.position.set(-1.12, 0, 0);
  const glow = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), afterburnerMat);
  glow.position.set(-1.26, 0, 0);
  model.add(nozzle, glow);

  const rotor = createPropellerUnit(0.45, true, 0xf97316);
  rotor.position.set(-1.25, 0, 0);
  model.add(rotor);

  return { model, props: [rotor] };
}

// 9. MICRO PULSE X-9: Prototipo compacto experimental con planos canard
function buildMicroPulse() {
  const model = new THREE.Group();
  const violetMat = mat(0x7c3aed, 0.38, { metalness: 0.3 });
  const cyanMat = mat(0x22d3ee, 0.3, { metalness: 0.35 });
  const goldMat = mat(0xfacc15, 0.3, { metalness: 0.45 });

  // Chasis compacto fusiforme en diamante
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 1), violetMat);
  core.scale.set(1.95, 0.68, 0.92);
  core.castShadow = true;
  model.add(core);

  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), COMMON_MATS.glass);
  dome.scale.set(1.55, 0.78, 0.85);
  dome.position.set(0.22, 0.24, 0);
  model.add(dome);

  // Planos canard delanteros + alas principales compactas
  const canard = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 1.35), goldMat);
  canard.position.set(0.58, 0.02, 0);
  const mainWing = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.08, 2.15), cyanMat);
  mainWing.position.set(-0.25, -0.04, 0);
  model.add(canard, mainWing);

  // Anillo propulsor trasero con rotor energético
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 6, 12), goldMat);
  ring.rotation.y = Math.PI / 2;
  ring.position.set(-0.98, 0.05, 0);
  model.add(ring);

  const rotor = createPropellerUnit(0.48, true, 0x22d3ee);
  rotor.position.set(-0.98, 0.05, 0);
  model.add(rotor);

  return { model, props: [rotor] };
}

const PLANE_BUILDERS = {
  atlas_cargo: buildAtlasCargo,
  aero_classic: buildAeroClassic,
  baron_vintage: buildBaronVintage,
  mule_freighter: buildMuleFreighter,
  lagoon_mariner: buildLagoonMariner,
  breeze_ultralight: buildBreezeUltralight,
  sovereign_exec: buildSovereignExec,
  valkyrie_interceptor: buildValkyrieInterceptor,
  micro_pulse: buildMicroPulse
};

export function createPlane(initialPlaneId = DEFAULT_PLANE_ID) {
  const group = new THREE.Group();
  const modelHolder = new THREE.Group();
  group.add(modelHolder);

  // Escudo de emergencia 3D alrededor del avión (oculto salvo al activarse)
  const shieldMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.34,
    wireframe: false
  });
  const shieldWireMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.72,
    wireframe: true
  });
  const shieldBubble = new THREE.Group();
  const innerSphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, 1), shieldMat);
  const outerWire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.62, 1), shieldWireMat);
  shieldBubble.add(innerSphere, outerWire);
  shieldBubble.visible = false;
  group.add(shieldBubble);

  let activePropellers = [];
  const propeller = new THREE.Group();

  propeller.rotation._onChange(() => {
    const rx = propeller.rotation.x;
    for (const p of activePropellers) {
      p.rotation.x = rx;
    }
  });

  function setModel(planeId) {
    while (modelHolder.children.length > 0) {
      modelHolder.remove(modelHolder.children[0]);
    }
    const builder = PLANE_BUILDERS[planeId] || PLANE_BUILDERS.atlas_cargo;
    const built = builder();
    modelHolder.add(built.model);
    activePropellers = built.props || [];
    for (const p of activePropellers) {
      p.rotation.x = propeller.rotation.x;
    }
  }

  function setShieldActive(active, elapsedTime = 0) {
    shieldBubble.visible = Boolean(active);
    if (active) {
      const pulse = 1 + Math.sin(elapsedTime * 16) * 0.08;
      shieldBubble.scale.setScalar(pulse);
      shieldBubble.rotation.y = elapsedTime * 2.5;
    }
  }

  setModel(initialPlaneId);
  group.userData.setModel = setModel;
  group.userData.setShieldActive = setShieldActive;

  return {
    group,
    propeller,
    setModel,
    setShieldActive
  };
}
