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
  })
};

function createPropellerUnit(scale = 1, fourBlades = true, bladeColor = 0x1e293b, spinnerColor = 0x1e293b) {
  const prop = new THREE.Group();
  prop.scale.setScalar(scale);
  const bMat = mat(bladeColor, 0.5);
  const sMat = mat(spinnerColor, 0.4);

  const spinner = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.25, 8), sMat);
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
  }

  return prop;
}

// 1. AERO CLASSIC: El avión original (biplano acrobático rojo, blanco y amarillo)
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

// 2. HIGHWING CUB: Avioneta clásica monoplano de ala alta con montantes en V
function buildSkyCub() {
  const model = new THREE.Group();
  const sunYellowMat = mat(0xfacc15, 0.42);
  const blueTrimMat = mat(0x1d4ed8, 0.48);

  // Cabina y fuselaje de avioneta ligera
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.76, 0.82), sunYellowMat);
  cabin.position.set(0.05, -0.02, 0);
  cabin.castShadow = true;
  model.add(cabin);

  // Franja lateral azul cobalto
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.18, 0.86), blueTrimMat);
  stripe.position.set(0.02, -0.08, 0);
  model.add(stripe);

  // Parabrisas y ventanillas de cabina cerrada
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.36, 0.84), COMMON_MATS.glass);
  windshield.position.set(0.18, 0.28, 0);
  model.add(windshield);

  const pilot = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), COMMON_MATS.skin);
  pilot.position.set(0.15, 0.28, 0);
  model.add(pilot);

  // Morro del motor
  const noseGeo = new THREE.CylinderGeometry(0.26, 0.38, 0.48, 8);
  noseGeo.rotateZ(-Math.PI / 2);
  const nose = new THREE.Mesh(noseGeo, blueTrimMat);
  nose.position.set(1.0, -0.04, 0);
  model.add(nose);

  // Cono de cola ahusado
  const tailGeo = new THREE.CylinderGeometry(0.15, 0.4, 1.0, 8);
  tailGeo.rotateZ(Math.PI / 2);
  const tailCone = new THREE.Mesh(tailGeo, sunYellowMat);
  tailCone.position.set(-1.12, 0.02, 0);
  model.add(tailCone);

  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.72, 0.1), blueTrimMat);
  fin.position.set(-1.42, 0.42, 0);
  fin.rotation.z = 0.28;
  const hStab = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 1.42), sunYellowMat);
  hStab.position.set(-1.38, 0.12, 0);
  model.add(fin, hStab);

  // Gran ala alta única con puntas azules
  const highWing = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.1, 2.95), sunYellowMat);
  highWing.position.set(0.12, 0.56, 0);
  highWing.castShadow = true;
  const wingStripe = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.11, 2.98), blueTrimMat);
  wingStripe.position.set(0.28, 0.56, 0);
  model.add(highWing, wingStripe);

  // Montantes diagonales desde la base de la cabina hacia las alas
  [-0.75, 0.75].forEach((zPos) => {
    const strut = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.98, 6),
      COMMON_MATS.steel
    );
    strut.position.set(0.12, 0.1, zPos);
    strut.rotation.x = -zPos * 0.65;
    model.add(strut);
  });

  // Tren de aterrizaje clásico
  const wheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 10);
  wheelGeo.rotateX(Math.PI / 2);
  [-0.4, 0.4].forEach((zPos) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.42, 6), COMMON_MATS.dark);
    leg.position.set(0.22, -0.5, zPos * 0.85);
    leg.rotation.z = 0.18;
    const wheel = new THREE.Mesh(wheelGeo, COMMON_MATS.dark);
    wheel.position.set(0.28, -0.7, zPos);
    model.add(leg, wheel);
  });

  const prop = createPropellerUnit(0.98, true, 0x1e293b, 0xf8fafc);
  prop.position.set(1.26, -0.04, 0);
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

  const prop = createPropellerUnit(1.05, false, 0x78350f, 0xd97706);
  prop.position.set(1.32, 0, 0);
  model.add(prop);

  return { model, props: [prop] };
}

// 4. TUNDRA SCOUT: Avioneta bush-plane de exploración con neumáticos tundra grandes
function buildBushScout() {
  const model = new THREE.Group();
  const orangeMat = mat(0xf97316, 0.45);
  const slateMat = mat(0x334155, 0.58);

  // Fuselaje robusto de exploración
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.82, 0.88), orangeMat);
  cabin.position.set(0.05, 0.04, 0);
  cabin.castShadow = true;
  model.add(cabin);

  const lowerGuard = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.26, 0.92), slateMat);
  lowerGuard.position.set(0.05, -0.26, 0);
  model.add(lowerGuard);

  const glass = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.36, 0.9), COMMON_MATS.glass);
  glass.position.set(0.22, 0.32, 0);
  model.add(glass);

  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.56, 0.76), slateMat);
  nose.position.set(1.02, -0.02, 0);
  model.add(nose);

  const tailConeGeo = new THREE.CylinderGeometry(0.16, 0.42, 1.05, 6);
  tailConeGeo.rotateZ(Math.PI / 2);
  const tail = new THREE.Mesh(tailConeGeo, orangeMat);
  tail.position.set(-1.15, 0.06, 0);
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.78, 0.12), slateMat);
  fin.position.set(-1.48, 0.45, 0);
  const hStab = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.1, 1.5), COMMON_MATS.white);
  hStab.position.set(-1.45, 0.14, 0);
  model.add(tail, fin, hStab);

  // Ala alta reforzada con bandas blancas
  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.12, 3.0), orangeMat);
  wing.position.set(0.1, 0.62, 0);
  wing.castShadow = true;
  const wingTips = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 3.12), slateMat);
  wingTips.position.set(0.1, 0.61, 0);
  model.add(wing, wingTips);

  [-0.8, 0.8].forEach((zPos) => {
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.95, 6), slateMat);
    strut.position.set(0.12, 0.15, zPos);
    strut.rotation.x = -zPos * 0.6;
    model.add(strut);
  });

  // Neumáticos tundra sobredimensionados para aterrizaje todoterreno
  const bigWheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.2, 12);
  bigWheelGeo.rotateX(Math.PI / 2);
  [-0.45, 0.45].forEach((zPos) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.46, 6), slateMat);
    leg.position.set(0.28, -0.48, zPos * 0.82);
    leg.rotation.z = 0.22;
    const wheel = new THREE.Mesh(bigWheelGeo, COMMON_MATS.dark);
    wheel.position.set(0.35, -0.68, zPos);
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.22, 8).rotateX(Math.PI / 2),
      orangeMat
    );
    hub.position.set(0.35, -0.68, zPos);
    model.add(leg, wheel, hub);
  });

  const prop = createPropellerUnit(1.02, true, 0x1e293b, 0xf97316);
  prop.position.set(1.34, -0.02, 0);
  model.add(prop);

  return { model, props: [prop] };
}

// 5. LAGOON HOPPER: Avioneta ligera con flotadores bajo las alas
function buildIslandHopper() {
  const model = new THREE.Group();
  const tealMat = mat(0x06b6d4, 0.42);
  const creamMat = mat(0xfef3c7, 0.5);
  const coralMat = mat(0xef4444, 0.45);

  const bodyGeo = new THREE.CylinderGeometry(0.38, 0.46, 1.65, 8);
  bodyGeo.rotateZ(Math.PI / 2);
  const body = new THREE.Mesh(bodyGeo, creamMat);
  body.castShadow = true;
  model.add(body);

  const belly = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.28, 0.78), tealMat);
  belly.position.set(0, -0.18, 0);
  model.add(belly);

  const noseGeo = new THREE.CylinderGeometry(0.22, 0.38, 0.45, 8);
  noseGeo.rotateZ(-Math.PI / 2);
  const nose = new THREE.Mesh(noseGeo, coralMat);
  nose.position.set(1.02, 0, 0);
  model.add(nose);

  const canopy = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.34, 0.76), COMMON_MATS.glass);
  canopy.position.set(0.15, 0.32, 0);
  model.add(canopy);

  const tailGeo = new THREE.CylinderGeometry(0.14, 0.42, 0.92, 8);
  tailGeo.rotateZ(Math.PI / 2);
  const tail = new THREE.Mesh(tailGeo, tealMat);
  tail.position.set(-1.2, 0.04, 0);
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.75, 0.1), coralMat);
  fin.position.set(-1.48, 0.44, 0);
  const hStab = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.09, 1.42), creamMat);
  hStab.position.set(-1.45, 0.32, 0);
  model.add(tail, fin, hStab);

  const highWing = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 2.85), creamMat);
  highWing.position.set(0.1, 0.62, 0);
  highWing.castShadow = true;
  const wingEdge = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.11, 2.88), coralMat);
  wingEdge.position.set(0.32, 0.62, 0);
  model.add(highWing, wingEdge);

  // Dos flotadores aerodinámicos de avioneta anfibia
  [-0.52, 0.52].forEach((zPos) => {
    const floatGeo = new THREE.CylinderGeometry(0.14, 0.16, 1.65, 8);
    floatGeo.rotateZ(Math.PI / 2);
    const pontoon = new THREE.Mesh(floatGeo, tealMat);
    pontoon.position.set(0.12, -0.66, zPos);

    const floatTip = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.35, 8), coralMat);
    floatTip.rotation.z = -Math.PI / 2;
    floatTip.position.set(1.1, -0.66, zPos);

    const strut1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.48, 6),
      COMMON_MATS.steel
    );
    strut1.position.set(0.35, -0.42, zPos * 0.9);
    const strut2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.48, 6),
      COMMON_MATS.steel
    );
    strut2.position.set(-0.2, -0.42, zPos * 0.9);
    model.add(pontoon, floatTip, strut1, strut2);
  });

  const prop = createPropellerUnit(0.96, true, 0x1e293b, 0xfef3c7);
  prop.position.set(1.28, 0, 0);
  model.add(prop);

  return { model, props: [prop] };
}

// 6. COMET RACER: Avioneta deportiva monoplaza de acrobacias y carreras (estilo Gee Bee / Extra)
function buildApexRacer() {
  const model = new THREE.Group();
  const purpleMat = mat(0x7c3aed, 0.38);
  const goldMat = mat(0xfacc15, 0.32, { metalness: 0.35 });
  const crimsonMat = mat(0xdc2626, 0.42);

  // Fuselaje corto tipo lágrima con gran capó radial delantero
  const cowlGeo = new THREE.CylinderGeometry(0.5, 0.54, 0.65, 10);
  cowlGeo.rotateZ(Math.PI / 2);
  const cowl = new THREE.Mesh(cowlGeo, goldMat);
  cowl.position.set(0.65, 0, 0);
  cowl.castShadow = true;
  model.add(cowl);

  const bodyGeo = new THREE.CylinderGeometry(0.54, 0.38, 1.15, 10);
  bodyGeo.rotateZ(Math.PI / 2);
  const body = new THREE.Mesh(bodyGeo, purpleMat);
  body.position.set(-0.2, 0, 0);
  body.castShadow = true;
  model.add(body);

  const racingStripe = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.16, 0.92), goldMat);
  racingStripe.position.set(-0.15, 0, 0);
  model.add(racingStripe);

  const tailGeo = new THREE.CylinderGeometry(0.15, 0.38, 0.72, 10);
  tailGeo.rotateZ(Math.PI / 2);
  const tail = new THREE.Mesh(tailGeo, crimsonMat);
  tail.position.set(-1.08, 0.02, 0);
  model.add(tail);

  const fin = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.72, 4), goldMat);
  fin.position.set(-1.28, 0.4, 0);
  const hStab = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.08, 1.25), goldMat);
  hStab.position.set(-1.22, 0.08, 0);
  model.add(fin, hStab);

  // Cúpula de burbuja deportiva trasera
  const canopyGeo = new THREE.SphereGeometry(0.31, 8, 6);
  canopyGeo.scale(1.45, 0.82, 0.85);
  const canopy = new THREE.Mesh(canopyGeo, COMMON_MATS.glass);
  canopy.position.set(-0.35, 0.36, 0);
  const pilot = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), COMMON_MATS.skin);
  pilot.position.set(-0.38, 0.38, 0);
  model.add(canopy, pilot);

  // Ala baja deportiva corta y rápida
  const lowWing = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.1, 2.45), crimsonMat);
  lowWing.position.set(0.15, -0.22, 0);
  lowWing.castShadow = true;
  const wingTips = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.11, 2.52), goldMat);
  wingTips.position.set(0.28, -0.22, 0);
  model.add(lowWing, wingTips);

  // Carenados aerodinámicos en forma de gota sobre las ruedas (wheel spats)
  [-0.45, 0.45].forEach((zPos) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.36, 0.08), purpleMat);
    leg.position.set(0.32, -0.44, zPos);
    const spatGeo = new THREE.SphereGeometry(0.2, 8, 6);
    spatGeo.scale(1.85, 0.85, 0.65);
    const spat = new THREE.Mesh(spatGeo, goldMat);
    spat.position.set(0.35, -0.64, zPos);
    model.add(leg, spat);
  });

  const prop = createPropellerUnit(1.05, true, 0x1e293b, 0xdc2626);
  prop.position.set(1.05, 0, 0);
  model.add(prop);

  return { model, props: [prop] };
}

const PLANE_BUILDERS = {
  aero_classic: buildAeroClassic,
  sky_cub: buildSkyCub,
  baron_vintage: buildBaronVintage,
  bush_scout: buildBushScout,
  island_hopper: buildIslandHopper,
  apex_racer: buildApexRacer
};

export function createPlane(initialPlaneId = DEFAULT_PLANE_ID) {
  const group = new THREE.Group();
  const modelHolder = new THREE.Group();
  group.add(modelHolder);

  // Escudo de emergencia 3D alrededor del avión
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
    const builder = PLANE_BUILDERS[planeId] || PLANE_BUILDERS.aero_classic;
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
