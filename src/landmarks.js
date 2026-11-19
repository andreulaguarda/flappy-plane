import * as THREE from 'three';

function mat(color, roughness = 0.65, extra = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    flatShading: true,
    ...extra
  });
}

function basicMat(color, extra = {}) {
  return new THREE.MeshBasicMaterial({ color, ...extra });
}

function addPalm(parent, x, y, z, scale = 1) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.scale.setScalar(scale);

  const trunkMat = mat(0x92400e, 0.85);
  const leafMat = mat(0x16a34a, 0.65);

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.17, 2.2, 6), trunkMat);
  trunk.position.y = 1.1;
  trunk.rotation.z = 0.08;
  g.add(trunk);

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const frond = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.25, 4), leafMat);
    frond.position.set(Math.cos(angle) * 0.45 - 0.08, 2.2, Math.sin(angle) * 0.45);
    frond.rotation.z = -Math.cos(angle) * 1.1;
    frond.rotation.x = Math.sin(angle) * 1.1;
    g.add(frond);
  }
  parent.add(g);
}

function buildLondon() {
  const group = new THREE.Group();
  const stoneMat = mat(0xd6c7a9, 0.7);
  const darkStoneMat = mat(0xa89878, 0.75);
  const roofMat = mat(0x1e293b, 0.55);
  const goldMat = mat(0xfacc15, 0.35, { metalness: 0.45 });
  const clockFaceMat = basicMat(0xfef9c3);
  const busRedMat = mat(0xdc2626, 0.45);

  // Torre del Big Ben
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(1.75, 7.6, 1.75), stoneMat);
  shaft.position.set(1.5, 3.8, 0);
  shaft.castShadow = true;
  group.add(shaft);

  // Molduras doradas y cuerpo del reloj
  const belfry = new THREE.Mesh(new THREE.BoxGeometry(2.05, 1.85, 2.05), darkStoneMat);
  belfry.position.set(1.5, 7.8, 0);
  group.add(belfry);

  const clockRim = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.14, 12), goldMat);
  clockRim.rotation.x = Math.PI / 2;
  clockRim.position.set(1.5, 7.8, 1.02);
  group.add(clockRim);

  const clockFace = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.54, 0.16, 12), clockFaceMat);
  clockFace.rotation.x = Math.PI / 2;
  clockFace.position.set(1.5, 7.8, 1.04);
  group.add(clockFace);

  const handV = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.36, 0.05), roofMat);
  handV.position.set(1.5, 7.92, 1.14);
  const handH = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.07, 0.05), roofMat);
  handH.position.set(1.6, 7.8, 1.14);
  group.add(handV, handH);

  // Chapitel gótico del Big Ben
  const spireBase = new THREE.Mesh(new THREE.ConeGeometry(1.45, 2.2, 4), roofMat);
  spireBase.rotation.y = Math.PI / 4;
  spireBase.position.set(1.5, 9.8, 0);
  group.add(spireBase);

  const spireTip = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.6, 4), goldMat);
  spireTip.rotation.y = Math.PI / 4;
  spireTip.position.set(1.5, 11.4, 0);
  group.add(spireTip);

  // Ala del Parlamento de Westminster
  const hall = new THREE.Mesh(new THREE.BoxGeometry(5.6, 3.2, 1.6), stoneMat);
  hall.position.set(-2.2, 1.6, -0.2);
  hall.castShadow = true;
  group.add(hall);

  for (let i = -2; i <= 2; i++) {
    const pinnacle = new THREE.Mesh(new THREE.ConeGeometry(0.24, 1.1, 4), goldMat);
    pinnacle.position.set(-2.2 + i * 1.15, 3.75, -0.2);
    group.add(pinnacle);
  }

  // Autobús rojo londinense de dos pisos junto a la base
  const bus = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.1, 0.75), busRedMat);
  bus.position.set(-1.5, 0.55, 1.15);
  group.add(bus);

  return group;
}

function addStrut(parent, p1, p2, r1, r2, material, radialSegments = 4) {
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const len = dir.length();
  if (len <= 0.0001) return null;
  const geo = new THREE.CylinderGeometry(r2, r1, len, radialSegments);
  if (radialSegments === 4) {
    geo.rotateY(Math.PI / 4);
  }
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.addVectors(p1, p2).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function buildParis() {
  const group = new THREE.Group();
  const ironMat = mat(0x9a714c, 0.5, { metalness: 0.38 });
  const darkIronMat = mat(0x6e4f32, 0.58, { metalness: 0.35 });
  const stonePedestalMat = mat(0xd6c7a9, 0.75);
  const goldMat = basicMat(0xfef08a);
  const mansardMat = mat(0x475569, 0.65);
  const wallMat = mat(0xe2d5b5, 0.75);

  const signs = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1]
  ];

  // 1. Pedestales de piedra y 4 pilares inclinados inferiores (con hueco real entre las patas)
  for (const [sx, sz] of signs) {
    const ped = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.45, 0.75), stonePedestalMat);
    ped.position.set(sx * 1.95, 0.22, sz * 1.35);
    group.add(ped);

    // Pata exterior e interior formando celosía
    const pBotOut = new THREE.Vector3(sx * 2.02, 0.4, sz * 1.38);
    const pTopOut = new THREE.Vector3(sx * 1.12, 3.35, sz * 0.82);
    addStrut(group, pBotOut, pTopOut, 0.22, 0.17, ironMat);

    const pBotIn = new THREE.Vector3(sx * 1.52, 0.4, sz * 1.05);
    const pTopIn = new THREE.Vector3(sx * 0.78, 3.35, sz * 0.58);
    addStrut(group, pBotIn, pTopIn, 0.18, 0.14, darkIronMat);

    // Traviesas de celosía en cada pata inferior
    for (const t of [0.28, 0.55, 0.82]) {
      const a = new THREE.Vector3().lerpVectors(pBotOut, pTopOut, t);
      const b = new THREE.Vector3().lerpVectors(pBotIn, pTopIn, t);
      addStrut(group, a, b, 0.08, 0.08, darkIronMat);
    }
  }

  // Arcos semicirculares icónicos de la base (frontal y trasero)
  [-1.12, 1.12].forEach((zPos) => {
    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(1.26, 0.11, 6, 18, Math.PI),
      darkIronMat
    );
    arch.position.set(0, 0.42, zPos);
    group.add(arch);

    const archInner = new THREE.Mesh(
      new THREE.TorusGeometry(1.1, 0.07, 6, 18, Math.PI),
      ironMat
    );
    archInner.position.set(0, 0.42, zPos);
    group.add(archInner);

    // Viga horizontal sobre el arco bajo el primer piso
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.18, 0.18), ironMat);
    lintel.position.set(0, 2.75, zPos * 0.78);
    group.add(lintel);
  });

  // 2. Primer piso (doble galería ancha)
  const deck1Low = new THREE.Mesh(new THREE.BoxGeometry(2.95, 0.24, 2.15), darkIronMat);
  deck1Low.position.set(0, 3.4, 0);
  const deck1Glow = new THREE.Mesh(new THREE.BoxGeometry(2.65, 0.18, 1.88), goldMat);
  deck1Glow.position.set(0, 3.6, 0);
  const deck1Top = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.2, 2.02), ironMat);
  deck1Top.position.set(0, 3.78, 0);
  group.add(deck1Low, deck1Glow, deck1Top);

  // 3. Tramo medio: 4 patas convergentes con hueco central visible hasta el 2.º piso
  for (const [sx, sz] of signs) {
    const mBotOut = new THREE.Vector3(sx * 0.96, 3.85, sz * 0.7);
    const mTopOut = new THREE.Vector3(sx * 0.54, 6.75, sz * 0.42);
    addStrut(group, mBotOut, mTopOut, 0.18, 0.14, ironMat);

    const mBotIn = new THREE.Vector3(sx * 0.64, 3.85, sz * 0.48);
    const mTopIn = new THREE.Vector3(sx * 0.32, 6.75, sz * 0.25);
    addStrut(group, mBotIn, mTopIn, 0.14, 0.11, darkIronMat);
  }

  // Cinturones horizontales de celosía en el tramo medio (dejando hueco en el centro)
  [4.75, 5.75].forEach((yMid, idx) => {
    const w = idx === 0 ? 1.72 : 1.42;
    const d = idx === 0 ? 1.25 : 1.02;
    const belt = new THREE.Mesh(new THREE.BoxGeometry(w, 0.16, d), darkIronMat);
    belt.position.set(0, yMid, 0);
    group.add(belt);
  });

  // 4. Segundo piso (plataforma doble)
  const deck2Low = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.22, 1.28), darkIronMat);
  deck2Low.position.set(0, 6.8, 0);
  const deck2Glow = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.14, 1.05), goldMat);
  deck2Glow.position.set(0, 6.96, 0);
  const deck2Top = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.18, 1.15), ironMat);
  deck2Top.position.set(0, 7.12, 0);
  group.add(deck2Low, deck2Glow, deck2Top);

  // 5. Aguja superior estilizada con nervios en las 4 esquinas y anillos de celosía
  for (const [sx, sz] of signs) {
    const uBot = new THREE.Vector3(sx * 0.42, 7.2, sz * 0.34);
    const uTop = new THREE.Vector3(sx * 0.15, 11.7, sz * 0.13);
    addStrut(group, uBot, uTop, 0.11, 0.065, ironMat);
  }

  const coreSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.38, 4.5, 4), darkIronMat);
  coreSpire.rotation.y = Math.PI / 4;
  coreSpire.position.set(0, 9.45, 0);
  group.add(coreSpire);

  // Anillos horizontales de celosía a lo largo de la aguja superior
  for (let i = 0; i < 6; i++) {
    const t = i / 5;
    const yRing = THREE.MathUtils.lerp(7.6, 11.3, t);
    const sRing = THREE.MathUtils.lerp(0.88, 0.42, t);
    const ring = new THREE.Mesh(
      new THREE.BoxGeometry(sRing, 0.12, sRing * 0.85),
      ironMat
    );
    ring.position.set(0, yRing, 0);
    group.add(ring);
  }

  // 6. Mirador superior, cúpula, faro y antena
  const topGallery = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.22, 0.62), darkIronMat);
  topGallery.position.set(0, 11.8, 0);
  const cupola = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.34, 0.65, 8), ironMat);
  cupola.position.set(0, 12.22, 0);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), goldMat);
  beacon.position.set(0, 12.65, 0);
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.07, 1.5, 6), ironMat);
  antenna.position.set(0, 13.5, 0);
  group.add(topGallery, cupola, beacon, antenna);

  // Edificios parisinos Haussmann bajos a los lados para enmarcar la torre
  [-4.1, 4.1].forEach((bx) => {
    const house = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.9, 1.3), wallMat);
    house.position.set(bx, 0.95, -0.5);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.38, 0.8, 4), mansardMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.set(bx, 2.3, -0.5);
    group.add(house, roof);
  });

  return group;
}

function buildRome() {
  const group = new THREE.Group();
  const travertineMat = mat(0xd6b88d, 0.75);
  const darkStoneMat = mat(0xa68963, 0.8);
  const archDarkMat = mat(0x3f2e1e, 0.9);
  const pineMat = mat(0x15803d, 0.7);
  const trunkMat = mat(0x78350f, 0.85);

  // Cilindro principal del Coliseo (escalonado)
  const outerWall = new THREE.Mesh(
    new THREE.CylinderGeometry(3.4, 3.5, 3.4, 14, 1, false, 0, Math.PI * 1.45),
    travertineMat
  );
  outerWall.position.set(0, 1.7, 0);
  outerWall.rotation.y = -0.35;
  group.add(outerWall);

  const upperTier = new THREE.Mesh(
    new THREE.CylinderGeometry(3.3, 3.35, 1.4, 12, 1, false, 0.3, Math.PI * 0.95),
    darkStoneMat
  );
  upperTier.position.set(0, 4.1, 0);
  upperTier.rotation.y = -0.15;
  group.add(upperTier);

  const innerWall = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.6, 2.6, 12), darkStoneMat);
  innerWall.position.set(0, 1.3, 0);
  group.add(innerWall);

  // Arcos frontales del Coliseo
  for (let row = 0; row < 2; row++) {
    for (let i = -3; i <= 3; i++) {
      const angle = i * 0.36;
      const arch = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.85, 0.35), archDarkMat);
      arch.position.set(Math.sin(angle) * 3.35, 0.9 + row * 1.35, Math.cos(angle) * 3.35);
      arch.rotation.y = angle;
      group.add(arch);
    }
  }

  // Columnas clásicas romanas y pino mediterráneo
  [-4.4, -3.5].forEach((cx, idx) => {
    const h = idx === 0 ? 3.4 : 2.3;
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, h, 8), travertineMat);
    col.position.set(cx, h * 0.5, 0.6);
    group.add(col);
  });

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 2.8, 6), trunkMat);
  trunk.position.set(4.5, 1.4, 0.4);
  const canopy = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 0.5, 0.9, 7), pineMat);
  canopy.position.set(4.5, 3.0, 0.4);
  group.add(trunk, canopy);

  return group;
}

function buildAthens() {
  const group = new THREE.Group();
  const rockMat = mat(0xa8a29e, 0.85);
  const marbleMat = mat(0xf8fafc, 0.5);
  const warmMarbleMat = mat(0xe2e8f0, 0.55);
  const goldMat = mat(0xfacc15, 0.4);

  // Roca de la Acrópolis
  const rockBase = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 4.6, 2.4, 8), rockMat);
  rockBase.position.set(0, 1.2, 0);
  group.add(rockBase);

  // Estilóbato (escalinata del Partenón)
  const stepBase = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.65, 2.8), warmMarbleMat);
  stepBase.position.set(0, 2.6, 0);
  group.add(stepBase);

  // Columnata dórica
  for (let i = -3; i <= 3; i++) {
    const colFront = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.23, 2.7, 8), marbleMat);
    colFront.position.set(i * 0.78, 4.25, 1.05);
    const colBack = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.23, 2.7, 8), warmMarbleMat);
    colBack.position.set(i * 0.78, 4.25, -1.05);
    group.add(colFront, colBack);
  }

  // Arquitrabe y frontón triangular
  const entablature = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.55, 2.65), marbleMat);
  entablature.position.set(0, 5.85, 0);
  group.add(entablature);

  const pediment = new THREE.Mesh(new THREE.ConeGeometry(2.9, 1.25, 4), warmMarbleMat);
  pediment.rotation.y = Math.PI / 4;
  pediment.scale.set(1.35, 1, 0.65);
  pediment.position.set(0, 6.75, 0);
  group.add(pediment);

  // Estatua dorada de Atenea junto al templo
  const statue = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 2.1, 6), goldMat);
  statue.position.set(4.0, 3.4, 0.6);
  group.add(statue);

  return group;
}

function buildCairo() {
  const group = new THREE.Group();
  const pyramidMat = mat(0xf59e0b, 0.75);
  const pyramidShadeMat = mat(0xd97706, 0.8);
  const goldCapMat = mat(0xfef08a, 0.35, { metalness: 0.4 });

  // Gran Pirámide de Keops
  const greatPyr = new THREE.Mesh(new THREE.ConeGeometry(4.6, 6.6, 4), pyramidMat);
  greatPyr.rotation.y = Math.PI / 4;
  greatPyr.position.set(-1.4, 3.3, -0.5);
  greatPyr.castShadow = true;
  group.add(greatPyr);

  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.38, 4), goldCapMat);
  cap.rotation.y = Math.PI / 4;
  cap.position.set(-1.4, 5.95, -0.5);
  group.add(cap);

  // Pirámide de Kefrén
  const secondPyr = new THREE.Mesh(new THREE.ConeGeometry(3.3, 4.9, 4), pyramidShadeMat);
  secondPyr.rotation.y = Math.PI / 4;
  secondPyr.position.set(3.2, 2.45, -1.1);
  group.add(secondPyr);

  // Esfinge low-poly en primer plano
  const sphinxBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 1.0), pyramidShadeMat);
  sphinxBody.position.set(1.6, 0.55, 1.3);
  const sphinxHead = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.0, 4), pyramidMat);
  sphinxHead.rotation.y = Math.PI / 4;
  sphinxHead.position.set(2.4, 1.45, 1.3);
  group.add(sphinxBody, sphinxHead);

  addPalm(group, -4.8, 0, 1.1, 1.05);
  addPalm(group, 5.2, 0, 0.8, 0.9);

  return group;
}

function buildBaghdad() {
  const group = new THREE.Group();
  const sandWallMat = mat(0xeab308, 0.75);
  const turquoiseMat = mat(0x06b6d4, 0.45);
  const goldDomeMat = mat(0xfacc15, 0.25, { metalness: 0.55 });

  // Cuerpo del palacio / mezquita
  const mainHall = new THREE.Mesh(new THREE.BoxGeometry(4.6, 3.3, 2.8), sandWallMat);
  mainHall.position.set(0, 1.65, 0);
  group.add(mainHall);

  // Iwan (portal turquesa)
  const portal = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.7, 0.35), turquoiseMat);
  portal.position.set(0, 1.35, 1.35);
  group.add(portal);

  // Gran cúpula dorada
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.55, 1.0, 10), turquoiseMat);
  drum.position.set(0, 3.7, 0);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.65, 12, 10), goldDomeMat);
  dome.scale.set(1, 1.25, 1);
  dome.position.set(0, 4.7, 0);
  const finial = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.2, 6), goldDomeMat);
  finial.position.set(0, 6.8, 0);
  group.add(drum, dome, finial);

  // Dos minaretes esbeltos
  [-3.4, 3.4].forEach((mx) => {
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.48, 6.4, 8), sandWallMat);
    tower.position.set(mx, 3.2, 0.3);
    const balcony = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.52, 0.4, 8), turquoiseMat);
    balcony.position.set(mx, 5.6, 0.3);
    const topCupola = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.3, 8), goldDomeMat);
    topCupola.position.set(mx, 6.9, 0.3);
    group.add(tower, balcony, topCupola);
  });

  addPalm(group, -4.6, 0, 1.2, 1.0);
  addPalm(group, 4.6, 0, 1.2, 1.0);

  return group;
}

function buildBombay() {
  const group = new THREE.Group();
  const basaltMat = mat(0xd97706, 0.72);
  const trimMat = mat(0xfef3c7, 0.65);
  const archVoidMat = mat(0x1e293b, 0.9);
  const domeMat = mat(0xb45309, 0.6);

  // Portal de la India (Gateway of India)
  const block = new THREE.Mesh(new THREE.BoxGeometry(5.2, 4.8, 2.2), basaltMat);
  block.position.set(0, 2.4, 0);
  group.add(block);

  const cornice = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.5, 2.5), trimMat);
  cornice.position.set(0, 4.9, 0);
  group.add(cornice);

  // Gran arco central
  const centerArch = new THREE.Mesh(new THREE.BoxGeometry(2.1, 3.4, 2.3), archVoidMat);
  centerArch.position.set(0, 1.7, 0);
  group.add(centerArch);

  // 4 torretas con cúpulas
  [-2.3, 2.3].forEach((tx) => {
    [-0.9, 0.9].forEach((tz) => {
      const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.4, 5.8, 8), trimMat);
      turret.position.set(tx, 2.9, tz);
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.1, 8), domeMat);
      cap.position.set(tx, 6.3, tz);
      group.add(turret, cap);
    });
  });

  const mainDome = new THREE.Mesh(new THREE.SphereGeometry(1.25, 10, 8), domeMat);
  mainDome.position.set(0, 5.4, 0);
  group.add(mainDome);

  addPalm(group, -4.2, 0, 1.0, 1.1);
  addPalm(group, 4.2, 0, 1.0, 1.1);

  return group;
}

function buildCalcutta() {
  const group = new THREE.Group();
  const marbleMat = mat(0xf8fafc, 0.45);
  const silverMat = mat(0xe2e8f0, 0.55);
  const goldMat = mat(0xfacc15, 0.35);

  // Palacio Victoria Memorial en mármol blanco
  const baseHall = new THREE.Mesh(new THREE.BoxGeometry(6.2, 2.8, 2.6), marbleMat);
  baseHall.position.set(0, 1.4, 0);
  group.add(baseHall);

  const centerBlock = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.8, 2.8), silverMat);
  centerBlock.position.set(0, 1.9, 0);
  group.add(centerBlock);

  const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.45, 1.2, 10), marbleMat);
  drum.position.set(0, 4.3, 0);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.4, 12, 10), marbleMat);
  dome.position.set(0, 5.2, 0);
  const angelSpire = new THREE.Mesh(new THREE.ConeGeometry(0.24, 1.1, 6), goldMat);
  angelSpire.position.set(0, 6.85, 0);
  group.add(drum, dome, angelSpire);

  [-2.6, 2.6].forEach((kx) => {
    const kiosk = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 1.5, 8), silverMat);
    kiosk.position.set(kx, 3.5, 0.4);
    const kDome = new THREE.Mesh(new THREE.SphereGeometry(0.58, 8, 8), marbleMat);
    kDome.position.set(kx, 4.35, 0.4);
    group.add(kiosk, kDome);
  });

  addPalm(group, -4.5, 0, 1.2, 1.0);
  addPalm(group, 4.5, 0, 1.2, 1.0);

  return group;
}

function buildBangkok() {
  const group = new THREE.Group();
  const goldMat = mat(0xfacc15, 0.3, { metalness: 0.5 });
  const redRoofMat = mat(0xdc2626, 0.55);
  const whiteWallMat = mat(0xfef9c3, 0.65);
  const emeraldMat = mat(0x10b981, 0.5);

  // Gran Prang / Pagoda Real central
  const base1 = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.8, 1.6, 8), whiteWallMat);
  base1.position.set(0, 0.8, 0);
  const base2 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.1, 1.8, 8), emeraldMat);
  base2.position.set(0, 2.5, 0);
  const spire1 = new THREE.Mesh(new THREE.ConeGeometry(1.45, 3.8, 8), goldMat);
  spire1.position.set(0, 5.2, 0);
  const spireTip = new THREE.Mesh(new THREE.ConeGeometry(0.4, 2.6, 6), goldMat);
  spireTip.position.set(0, 8.1, 0);
  group.add(base1, base2, spire1, spireTip);

  // Dos templos laterales con tejados escalonados rojos y dorados
  [-3.5, 3.5].forEach((tx) => {
    const hall = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.0, 1.8), whiteWallMat);
    hall.position.set(tx, 1.0, 0.3);
    const roof1 = new THREE.Mesh(new THREE.ConeGeometry(1.65, 1.1, 4), redRoofMat);
    roof1.rotation.y = Math.PI / 4;
    roof1.position.set(tx, 2.4, 0.3);
    const roof2 = new THREE.Mesh(new THREE.ConeGeometry(1.2, 1.0, 4), goldMat);
    roof2.rotation.y = Math.PI / 4;
    roof2.position.set(tx, 3.2, 0.3);
    const finial = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.2, 5), goldMat);
    finial.position.set(tx, 4.2, 0.3);
    group.add(hall, roof1, roof2, finial);
  });

  return group;
}

function buildSingapore() {
  const group = new THREE.Group();
  const glassTowerMat = mat(0x38bdf8, 0.25, { metalness: 0.45 });
  const steelMat = mat(0xe2e8f0, 0.4, { metalness: 0.35 });
  const supertreeTrunkMat = mat(0x9333ea, 0.55);
  const supertreeCanopyMat = mat(0xec4899, 0.5);

  // Tres torres estilo Marina Bay Sands
  [-2.0, 0, 2.0].forEach((tx) => {
    const tower = new THREE.Mesh(new THREE.BoxGeometry(1.15, 6.2, 1.3), glassTowerMat);
    tower.position.set(tx, 3.1, 0);
    tower.rotation.z = -tx * 0.025;
    group.add(tower);
  });

  // Plataforma SkyPark en forma de barco sobre las 3 torres
  const skyDeck = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.55, 1.7), steelMat);
  skyDeck.position.set(0.3, 6.45, 0);
  const bow = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.6, 4), steelMat);
  bow.rotation.z = -Math.PI / 2;
  bow.position.set(4.1, 6.45, 0);
  group.add(skyDeck, bow);

  // Supertrees laterales
  [-4.2, 4.4].forEach((sx) => {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.45, 2.8, 7), supertreeTrunkMat);
    stem.position.set(sx, 1.4, 0.8);
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 0.25, 0.65, 8), supertreeCanopyMat);
    crown.position.set(sx, 2.9, 0.8);
    group.add(stem, crown);
  });

  return group;
}

function buildManila() {
  const group = new THREE.Group();
  const stoneMat = mat(0x94a3b8, 0.82);
  const creamMat = mat(0xfef3c7, 0.7);
  const terracottaMat = mat(0xc2410c, 0.65);

  // Muralla de Intramuros y bastión
  const wall = new THREE.Mesh(new THREE.BoxGeometry(6.5, 1.8, 2.0), stoneMat);
  wall.position.set(0, 0.9, 0);
  group.add(wall);

  // Catedral colonial y torre campanario
  const churchBody = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.8, 2.2), creamMat);
  churchBody.position.set(-0.6, 3.1, 0);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.25, 10, 8), terracottaMat);
  dome.position.set(-0.6, 4.8, 0);
  group.add(churchBody, dome);

  const bellTower = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, 4.6, 8), creamMat);
  bellTower.position.set(1.9, 3.8, 0.3);
  const bellRoof = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.3, 8), terracottaMat);
  bellRoof.position.set(1.9, 6.7, 0.3);
  group.add(bellTower, bellRoof);

  addPalm(group, -4.4, 0, 1.1, 1.15);
  addPalm(group, 4.2, 0, 1.1, 1.05);

  return group;
}

function buildTokyo() {
  const group = new THREE.Group();
  const redMat = mat(0xef4444, 0.45);
  const whiteMat = mat(0xf8fafc, 0.45);
  const darkRoofMat = mat(0x1e293b, 0.65);
  const sakuraMat = mat(0xf472b6, 0.6);
  const trunkMat = mat(0x78350f, 0.85);

  // Torre de Tokio (roja y blanca)
  const segments = [
    { y: 1.3, rBot: 1.5, rTop: 1.05, h: 2.6, mat: redMat },
    { y: 3.6, rBot: 1.05, rTop: 0.72, h: 2.0, mat: whiteMat },
    { y: 5.5, rBot: 0.72, rTop: 0.45, h: 1.8, mat: redMat },
    { y: 7.2, rBot: 0.45, rTop: 0.25, h: 1.6, mat: whiteMat },
    { y: 9.0, rBot: 0.2, rTop: 0.06, h: 2.0, mat: redMat }
  ];
  for (const s of segments) {
    const part = new THREE.Mesh(new THREE.CylinderGeometry(s.rTop, s.rBot, s.h, 4), s.mat);
    part.rotation.y = Math.PI / 4;
    part.position.set(0, s.y, 0);
    group.add(part);
  }

  const obsDeck = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.55, 2.1), whiteMat);
  obsDeck.position.set(0, 2.75, 0);
  group.add(obsDeck);

  // Puerta Torii tradicional a la izquierda
  const pillarL = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 3.0, 6), redMat);
  pillarL.position.set(-4.0, 1.5, 0.8);
  const pillarR = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 3.0, 6), redMat);
  pillarR.position.set(-2.3, 1.5, 0.8);
  const lintelTop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.28, 0.36), darkRoofMat);
  lintelTop.position.set(-3.15, 3.05, 0.8);
  const lintelSub = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.22, 0.28), redMat);
  lintelSub.position.set(-3.15, 2.55, 0.8);
  group.add(pillarL, pillarR, lintelTop, lintelSub);

  // Cerezo en flor a la derecha
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 1.4, 6), trunkMat);
  trunk.position.set(3.4, 0.7, 0.7);
  const blossom1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.15, 0), sakuraMat);
  blossom1.position.set(3.4, 1.9, 0.7);
  const blossom2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85, 0), sakuraMat);
  blossom2.position.set(4.1, 1.6, 0.9);
  group.add(trunk, blossom1, blossom2);

  return group;
}

function buildMidway() {
  const group = new THREE.Group();
  const sandMat = mat(0xfef08a, 0.8);
  const lagoonMat = mat(0x22d3ee, 0.35);
  const woodMat = mat(0x92400e, 0.85);
  const towerWhiteMat = mat(0xf8fafc, 0.55);
  const orangeMat = mat(0xf97316, 0.5);

  // Atolón de arena y laguna turquesa
  const sandRing = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.9, 0.55, 12), sandMat);
  sandRing.position.set(0, 0.25, 0);
  const lagoon = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.6, 10), lagoonMat);
  lagoon.position.set(-0.8, 0.26, 0.2);
  group.add(sandRing, lagoon);

  // Torre de control de madera del aeródromo de Midway
  const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.85, 3.4, 4), woodMat);
  legs.rotation.y = Math.PI / 4;
  legs.position.set(2.0, 1.9, 0);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.1, 1.5), towerWhiteMat);
  cab.position.set(2.0, 4.0, 0);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.8, 4), orangeMat);
  roof.rotation.y = Math.PI / 4;
  roof.position.set(2.0, 4.95, 0);

  // Manga de viento naranja
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.3, 5), woodMat);
  pole.position.set(0.2, 1.1, 1.2);
  const sock = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.85, 6), orangeMat);
  sock.rotation.z = Math.PI / 2;
  sock.position.set(0.6, 1.65, 1.2);
  group.add(legs, cab, roof, pole, sock);

  addPalm(group, -2.8, 0.4, 0.6, 1.1);
  addPalm(group, -3.7, 0.4, -0.3, 0.9);

  return group;
}

function buildHonolulu() {
  const group = new THREE.Group();
  const volcanoMat = mat(0x475569, 0.85);
  const greenRidgeMat = mat(0x15803d, 0.75);
  const lavaMat = basicMat(0xf97316);
  const smokeMat = mat(0xe2e8f0, 0.7);
  const thatchMat = mat(0xd97706, 0.8);

  // Volcán hawaiano con cráter y columna de humo
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 4.4, 5.8, 8), volcanoMat);
  cone.position.set(0.5, 2.9, -0.8);
  const greenSkirt = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 4.7, 2.2, 8), greenRidgeMat);
  greenSkirt.position.set(0.5, 1.1, -0.8);
  const craterGlow = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.3, 8), lavaMat);
  craterGlow.position.set(0.5, 5.75, -0.8);
  group.add(cone, greenSkirt, craterGlow);

  // Nubes de humo saliendo del volcán
  for (let i = 0; i < 3; i++) {
    const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75 + i * 0.28, 0), smokeMat);
    puff.position.set(0.5 - i * 0.45, 6.7 + i * 1.15, -0.8);
    group.add(puff);
  }

  // Cabaña tiki de playa y palmeras
  const hutWall = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.8, 1.2, 6), thatchMat);
  hutWall.position.set(-3.2, 0.6, 0.9);
  const hutRoof = new THREE.Mesh(new THREE.ConeGeometry(1.25, 1.1, 6), thatchMat);
  hutRoof.position.set(-3.2, 1.7, 0.9);
  group.add(hutWall, hutRoof);

  addPalm(group, -4.4, 0, 1.1, 1.15);
  addPalm(group, 4.0, 0, 1.0, 1.05);

  return group;
}

function buildSanFrancisco() {
  const group = new THREE.Group();
  const bridgeRedMat = mat(0xdc2626, 0.45, { metalness: 0.25 });
  const darkRedMat = mat(0x991b1b, 0.5);
  const concreteMat = mat(0xcbd5e1, 0.75);
  const cableMat = mat(0xb91c1c, 0.4);

  // Dos grandes torres rojas Art-Deco del Golden Gate
  [-4.6, 4.6].forEach((tx) => {
    const pier = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.3, 1.7), concreteMat);
    pier.position.set(tx, 0.65, 0);
    group.add(pier);

    [-0.52, 0.52].forEach((legX) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.45, 9.6, 0.65), bridgeRedMat);
      leg.position.set(tx + legX, 5.8, 0);
      group.add(leg);
    });

    // Travesaños horizontales de cada torre
    [3.4, 5.6, 7.6, 9.5].forEach((y) => {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.42, 0.72), darkRedMat);
      strut.position.set(tx, y, 0);
      group.add(strut);
    });
  });

  // Tablero rojo del puente colgante
  const deck = new THREE.Mesh(new THREE.BoxGeometry(13.8, 0.55, 1.4), bridgeRedMat);
  deck.position.set(0, 3.1, 0);
  group.add(deck);

  // Cables catenarios principales y péndolas verticales
  const steps = 9;
  for (let i = 0; i <= steps; i++) {
    const u = (i / steps) * 2 - 1; // -1 a 1
    const x = u * 4.5;
    const cableY = 3.8 + u * u * 5.8;

    const hanger = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, cableY - 3.1, 5),
      cableMat
    );
    hanger.position.set(x, 3.1 + (cableY - 3.1) * 0.5, 0.45);
    group.add(hanger);

    const node = new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 6), darkRedMat);
    node.position.set(x, cableY, 0.45);
    group.add(node);
  }

  return group;
}

function buildNewYork() {
  const group = new THREE.Group();
  const pedestalMat = mat(0xa8a29e, 0.75);
  const libertyMat = mat(0x34d399, 0.5);
  const torchMat = basicMat(0xfacc15);
  const buildingMat1 = mat(0x475569, 0.55);
  const buildingMat2 = mat(0x334155, 0.6);

  // Estatua de la Libertad en primer plano
  const baseStar = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.75, 1.1, 6), pedestalMat);
  baseStar.position.set(-2.2, 0.55, 0.8);
  const pedestal = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.3, 1.6), pedestalMat);
  pedestal.position.set(-2.2, 2.2, 0.8);
  const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.78, 3.1, 7), libertyMat);
  robe.position.set(-2.2, 4.9, 0.8);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 7, 7), libertyMat);
  head.position.set(-2.2, 6.7, 0.8);
  const crown = new THREE.Mesh(new THREE.ConeGeometry(0.58, 0.45, 7), libertyMat);
  crown.position.set(-2.2, 7.1, 0.8);

  // Brazo con antorcha dorada
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 1.6, 6), libertyMat);
  arm.position.set(-1.7, 7.2, 0.8);
  arm.rotation.z = -0.25;
  const flame = new THREE.Mesh(new THREE.OctahedronGeometry(0.34, 0), torchMat);
  flame.position.set(-1.5, 8.15, 0.8);
  group.add(baseStar, pedestal, robe, head, crown, arm, flame);

  // Skyline de rascacielos de Nueva York (Empire State + torres)
  const empireBase = new THREE.Mesh(new THREE.BoxGeometry(2.1, 6.5, 1.8), buildingMat1);
  empireBase.position.set(1.8, 3.25, -0.5);
  const empireTier = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.2, 1.3), buildingMat1);
  empireTier.position.set(1.8, 7.5, -0.5);
  const empireSpire = new THREE.Mesh(new THREE.ConeGeometry(0.18, 2.4, 6), pedestalMat);
  empireSpire.position.set(1.8, 9.7, -0.5);

  const tower2 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5.2, 1.5), buildingMat2);
  tower2.position.set(4.1, 2.6, -0.3);
  group.add(empireBase, empireTier, empireSpire, tower2);

  return group;
}

function buildNewfoundland() {
  const group = new THREE.Group();
  const rockMat = mat(0x64748b, 0.85);
  const whiteMat = mat(0xf8fafc, 0.5);
  const redMat = mat(0xdc2626, 0.5);
  const blueHouseMat = mat(0x0284c7, 0.65);
  const yellowHouseMat = mat(0xeab308, 0.65);
  const lampMat = basicMat(0xfef08a);

  // Promontorio rocoso y faro rojiblanco
  const cliff = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8, 0), rockMat);
  cliff.scale.set(1.5, 0.8, 1.1);
  cliff.position.set(0.5, 0.8, 0);
  group.add(cliff);

  const bands = [
    { y: 2.0, rB: 0.82, rT: 0.72, m: whiteMat },
    { y: 3.3, rB: 0.72, rT: 0.62, m: redMat },
    { y: 4.6, rB: 0.62, rT: 0.52, m: whiteMat },
    { y: 5.8, rB: 0.52, rT: 0.44, m: redMat }
  ];
  for (const b of bands) {
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(b.rT, b.rB, 1.3, 8), b.m);
    seg.position.set(0.5, b.y, 0);
    group.add(seg);
  }

  const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.75, 8), lampMat);
  lantern.position.set(0.5, 6.8, 0);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.62, 0.75, 8), redMat);
  roof.position.set(0.5, 7.5, 0);
  group.add(lantern, roof);

  // Casas de madera de colores típicas de Terranova
  const houseConfigs = [
    { x: -2.8, mat: redMat },
    { x: -1.4, mat: blueHouseMat },
    { x: 3.1, mat: yellowHouseMat }
  ];
  for (const hc of houseConfigs) {
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.3, 1.1), hc.mat);
    box.position.set(hc.x, 0.65, 0.7);
    const hRoof = new THREE.Mesh(new THREE.ConeGeometry(0.95, 0.75, 4), whiteMat);
    hRoof.rotation.y = Math.PI / 4;
    hRoof.position.set(hc.x, 1.65, 0.7);
    group.add(box, hRoof);
  }

  return group;
}

function buildGreenland() {
  const group = new THREE.Group();
  const iceMat = mat(0xe0f2fe, 0.35);
  const cyanIceMat = mat(0x38bdf8, 0.3);
  const cabinRedMat = mat(0xb91c1c, 0.65);
  const snowRoofMat = mat(0xffffff, 0.5);

  // Frente glaciar monumental de hielo azul y blanco
  const spires = [
    { x: -2.2, h: 6.2, r: 1.9, m: iceMat },
    { x: 0.0, h: 7.8, r: 2.3, m: cyanIceMat },
    { x: 2.3, h: 5.6, r: 1.8, m: iceMat },
    { x: 3.8, h: 4.2, r: 1.4, m: cyanIceMat }
  ];
  for (const s of spires) {
    const crystal = new THREE.Mesh(new THREE.ConeGeometry(s.r, s.h, 5), s.m);
    crystal.position.set(s.x, s.h * 0.5, -0.4);
    crystal.rotation.y = s.x;
    group.add(crystal);
  }

  // Cabaña ártica nórdica con tejado nevado
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.3, 1.3), cabinRedMat);
  cabin.position.set(-3.4, 0.65, 0.9);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.35, 0.85, 4), snowRoofMat);
  roof.rotation.y = Math.PI / 4;
  roof.position.set(-3.4, 1.7, 0.9);
  group.add(cabin, roof);

  return group;
}

function buildReykjavik() {
  const group = new THREE.Group();
  const concreteMat = mat(0xf1f5f9, 0.55);
  const basaltMat = mat(0x1e293b, 0.85);
  const steamMat = mat(0xe2e8f0, 0.4, { transparent: true, opacity: 0.78 });

  // Iglesia Hallgrímskirkja (columnas escalonadas de basalto blanco)
  const centerTower = new THREE.Mesh(new THREE.BoxGeometry(1.35, 7.6, 1.5), concreteMat);
  centerTower.position.set(0, 3.8, 0);
  const spire = new THREE.Mesh(new THREE.ConeGeometry(0.85, 2.8, 4), concreteMat);
  spire.rotation.y = Math.PI / 4;
  spire.position.set(0, 8.9, 0);
  group.add(centerTower, spire);

  // Alas laterales escalonadas como tubos de órgano
  for (let i = 1; i <= 4; i++) {
    const h = 6.2 - i * 1.15;
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.65, h, 1.1), concreteMat);
    wingL.position.set(-0.6 - i * 0.68, h * 0.5, 0);
    const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.65, h, 1.1), concreteMat);
    wingR.position.set(0.6 + i * 0.68, h * 0.5, 0);
    group.add(wingL, wingR);
  }

  // Cráter de géiser con columna de vapor a un lado
  const vent = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.9, 6), basaltMat);
  vent.position.set(4.2, 0.45, 0.9);
  group.add(vent);

  for (let i = 0; i < 3; i++) {
    const plume = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5 + i * 0.22, 0), steamMat);
    plume.position.set(4.2, 1.3 + i * 0.95, 0.9);
    group.add(plume);
  }

  return group;
}

function buildDublin() {
  const group = new THREE.Group();
  const stoneMat = mat(0x64748b, 0.8);
  const darkStoneMat = mat(0x475569, 0.85);
  const greenMat = mat(0x16a34a, 0.55);
  const brickMat = mat(0x9a3412, 0.75);
  const lampMat = basicMat(0xfef08a);

  // Torre redonda del Castillo de Dublín con almenas
  const castleTower = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.7, 5.2, 10), stoneMat);
  castleTower.position.set(-0.8, 2.6, 0);
  const keepWall = new THREE.Mesh(new THREE.BoxGeometry(3.8, 3.2, 1.8), darkStoneMat);
  keepWall.position.set(1.4, 1.6, -0.3);
  group.add(castleTower, keepWall);

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const merlon = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.55, 0.45), darkStoneMat);
    merlon.position.set(-0.8 + Math.cos(angle) * 1.4, 5.4, Math.sin(angle) * 1.4);
    group.add(merlon);
  }

  // Faro verde del puerto de Dublín
  const lighthouse = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.65, 3.8, 8), greenMat);
  lighthouse.position.set(3.8, 1.9, 0.8);
  const lightTop = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.65, 8), lampMat);
  lightTop.position.set(3.8, 4.1, 0.8);
  const dome = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.7, 8), greenMat);
  dome.position.set(3.8, 4.75, 0.8);
  group.add(lighthouse, lightTop, dome);

  // Casa georgiana de ladrillo
  const house = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.4, 1.3), brickMat);
  house.position.set(-3.6, 1.2, 0.4);
  group.add(house);

  return group;
}

const BUILDERS = {
  london: buildLondon,
  paris: buildParis,
  rome: buildRome,
  athens: buildAthens,
  cairo: buildCairo,
  baghdad: buildBaghdad,
  bombay: buildBombay,
  calcutta: buildCalcutta,
  bangkok: buildBangkok,
  singapore: buildSingapore,
  manila: buildManila,
  tokyo: buildTokyo,
  midway: buildMidway,
  honolulu: buildHonolulu,
  san_francisco: buildSanFrancisco,
  new_york: buildNewYork,
  newfoundland: buildNewfoundland,
  greenland: buildGreenland,
  reykjavik: buildReykjavik,
  dublin: buildDublin
};

export function createLandmark(landmarkId) {
  const builder = BUILDERS[landmarkId] || BUILDERS.london;
  const mesh = builder();
  mesh.name = `landmark-${landmarkId}`;
  return mesh;
}
