import * as THREE from 'three';
import { CONFIG, getStageForProgress } from './config.js';

const CITY_STYLES = {
  london: {
    wallHex: 0xb91c1c,
    secondaryHex: 0xd6c7a9,
    roofHex: 0x1e293b,
    trimHex: 0xfacc15,
    windowHex: 0xfef08a,
    crown: 'gothic'
  },
  paris: {
    wallHex: 0xeaddc5,
    secondaryHex: 0xd6c7a9,
    roofHex: 0x475569,
    trimHex: 0x8b6946,
    windowHex: 0xfef9c3,
    crown: 'mansard'
  },
  rome: {
    wallHex: 0xd6b88d,
    secondaryHex: 0xa68963,
    roofHex: 0xc2410c,
    trimHex: 0xf8fafc,
    windowHex: 0x451a03,
    crown: 'roman'
  },
  athens: {
    wallHex: 0xf8fafc,
    secondaryHex: 0xe2e8f0,
    roofHex: 0x0284c7,
    trimHex: 0xfacc15,
    windowHex: 0x0369a1,
    crown: 'hellenic'
  },
  cairo: {
    wallHex: 0xd97706,
    secondaryHex: 0xb45309,
    roofHex: 0xfacc15,
    trimHex: 0x06b6d4,
    windowHex: 0x451a03,
    crown: 'pharaonic'
  },
  baghdad: {
    wallHex: 0xeab308,
    secondaryHex: 0xca8a04,
    roofHex: 0xfacc15,
    trimHex: 0x06b6d4,
    windowHex: 0xfef08a,
    crown: 'abbasid'
  },
  bombay: {
    wallHex: 0xd97706,
    secondaryHex: 0xfef3c7,
    roofHex: 0x9a3412,
    trimHex: 0xfacc15,
    windowHex: 0xfef08a,
    crown: 'indo_saracenic'
  },
  calcutta: {
    wallHex: 0xf8fafc,
    secondaryHex: 0xcbd5e1,
    roofHex: 0xe2e8f0,
    trimHex: 0x10b981,
    windowHex: 0xfef08a,
    crown: 'neoclassical_dome'
  },
  bangkok: {
    wallHex: 0xfef9c3,
    secondaryHex: 0x10b981,
    roofHex: 0xdc2626,
    trimHex: 0xfacc15,
    windowHex: 0xfde047,
    crown: 'thai_pagoda'
  },
  singapore: {
    wallHex: 0x0284c7,
    secondaryHex: 0x0369a1,
    roofHex: 0xe2e8f0,
    trimHex: 0x22d3ee,
    windowHex: 0xa5f3fc,
    crown: 'modern_skydeck'
  },
  manila: {
    wallHex: 0xfef3c7,
    secondaryHex: 0x64748b,
    roofHex: 0xc2410c,
    trimHex: 0x92400e,
    windowHex: 0xfde68a,
    crown: 'colonial_fort'
  },
  tokyo: {
    wallHex: 0xf8fafc,
    secondaryHex: 0xef4444,
    roofHex: 0x1e293b,
    trimHex: 0xef4444,
    windowHex: 0xfbcfe8,
    crown: 'japanese_pagoda'
  },
  midway: {
    wallHex: 0xf8fafc,
    secondaryHex: 0x92400e,
    roofHex: 0xf97316,
    trimHex: 0x22d3ee,
    windowHex: 0xfef08a,
    crown: 'airfield_tower'
  },
  honolulu: {
    wallHex: 0xd97706,
    secondaryHex: 0x334155,
    roofHex: 0xb45309,
    trimHex: 0x06b6d4,
    windowHex: 0xfdba74,
    crown: 'tiki_pavilion'
  },
  san_francisco: {
    wallHex: 0xdc2626,
    secondaryHex: 0x38bdf8,
    roofHex: 0x991b1b,
    trimHex: 0xf8fafc,
    windowHex: 0xfef08a,
    crown: 'victorian_bay'
  },
  new_york: {
    wallHex: 0x475569,
    secondaryHex: 0x334155,
    roofHex: 0x1e293b,
    trimHex: 0x34d399,
    windowHex: 0xfef08a,
    crown: 'art_deco'
  },
  newfoundland: {
    wallHex: 0xdc2626,
    secondaryHex: 0x0284c7,
    roofHex: 0xf8fafc,
    trimHex: 0xeab308,
    windowHex: 0xfef9c3,
    crown: 'maritime_clapboard'
  },
  greenland: {
    wallHex: 0xb91c1c,
    secondaryHex: 0x0284c7,
    roofHex: 0xffffff,
    trimHex: 0x7dd3fc,
    windowHex: 0xfef08a,
    crown: 'nordic_arctic'
  },
  reykjavik: {
    wallHex: 0xf1f5f9,
    secondaryHex: 0x1e293b,
    roofHex: 0x334155,
    trimHex: 0x10b981,
    windowHex: 0xa855f7,
    crown: 'basalt_organ'
  },
  dublin: {
    wallHex: 0x9a3412,
    secondaryHex: 0x64748b,
    roofHex: 0x334155,
    trimHex: 0x16a34a,
    windowHex: 0xfef08a,
    crown: 'georgian_castle'
  }
};

export function resolveObstacleStyle(level, obstacleIndex = 0) {
  const total = Math.max(6, level?.obstacleCount || 8);
  const clampedIndex = Math.max(0, obstacleIndex);
  const progressRatio = clampedIndex / Math.max(1, total - 1);

  if (clampedIndex < 2 || progressRatio < 0.24) {
    return {
      category: 'city',
      cityId: level?.originLandmark || 'london',
      role: 'origin_building'
    };
  }

  if (clampedIndex >= total - 2 || progressRatio >= 0.78) {
    return {
      category: 'city',
      cityId: level?.destinationLandmark || 'paris',
      role: 'destination_building'
    };
  }

  const stage = getStageForProgress(level, progressRatio);
  return {
    category: 'journey',
    style: stage?.obstacleStyle || 'giant_trees',
    role: stage?.obstacleStyle || 'giant_trees'
  };
}

function makeMat(color, roughness = 0.65, extra = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    flatShading: true,
    ...extra
  });
}

function makeBasic(color) {
  return new THREE.MeshBasicMaterial({ color });
}

function addBuildingCrown(group, crown, yEdge, isBottom, mats) {
  const dir = isBottom ? 1 : -1;

  // Cornisa principal en el borde del hueco
  const cornice = new THREE.Mesh(new THREE.BoxGeometry(2.46, 0.36, 2.46), mats.roof);
  cornice.position.y = yEdge - dir * 0.18;
  group.add(cornice);

  const trimBand = new THREE.Mesh(new THREE.BoxGeometry(2.38, 0.22, 2.38), mats.trim);
  trimBand.position.y = yEdge - dir * 0.44;
  group.add(trimBand);

  if (crown === 'gothic' || crown === 'georgian_castle') {
    // Pináculos o almenas en las 4 esquinas
    [-0.95, 0.95].forEach((cx) => {
      [-0.95, 0.95].forEach((cz) => {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.42, 0.38), mats.trim);
        pin.position.set(cx, yEdge - dir * 0.12, cz);
        group.add(pin);
      });
    });
  } else if (crown === 'mansard' || crown === 'colonial_fort' || crown === 'victorian_bay') {
    const mansard = new THREE.Mesh(new THREE.CylinderGeometry(1.38, 1.72, 0.65, 4), mats.roof);
    mansard.rotation.y = Math.PI / 4;
    if (!isBottom) mansard.rotation.x = Math.PI;
    mansard.position.y = yEdge - dir * 0.34;
    group.add(mansard);
  } else if (crown === 'hellenic' || crown === 'roman') {
    // Frontón clásico y pilastras
    const pediment = new THREE.Mesh(new THREE.ConeGeometry(1.55, 0.62, 4), mats.secondary);
    pediment.rotation.y = Math.PI / 4;
    if (!isBottom) pediment.rotation.x = Math.PI;
    pediment.position.y = yEdge - dir * 0.32;
    group.add(pediment);
  } else if (
    crown === 'abbasid' ||
    crown === 'indo_saracenic' ||
    crown === 'neoclassical_dome'
  ) {
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.85, 10, 8), mats.trim);
    dome.position.y = yEdge - dir * 0.35;
    group.add(dome);
  } else if (crown === 'thai_pagoda' || crown === 'japanese_pagoda') {
    const eave1 = new THREE.Mesh(new THREE.ConeGeometry(1.78, 0.55, 4), mats.roof);
    eave1.rotation.y = Math.PI / 4;
    if (!isBottom) eave1.rotation.x = Math.PI;
    eave1.position.y = yEdge - dir * 0.3;
    const eave2 = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.18, 2.55), mats.trim);
    eave2.position.y = yEdge - dir * 0.12;
    group.add(eave1, eave2);
  }
}

function buildCityBuildingObstacle(cityId, gapY, gapHeight) {
  const style = CITY_STYLES[cityId] || CITY_STYLES.london;
  const root = new THREE.Group();

  const mats = {
    wall: makeMat(style.wallHex, 0.6),
    secondary: makeMat(style.secondaryHex, 0.65),
    roof: makeMat(style.roofHex, 0.7),
    trim: makeMat(style.trimHex, 0.45),
    window: makeBasic(style.windowHex)
  };

  const topBottomY = gapY + gapHeight * 0.5;
  const botTopY = gapY - gapHeight * 0.5;
  const topH = 18;
  const botH = Math.max(2.2, botTopY - (CONFIG.floorY - 1.2));

  // Edificio inferior
  const botTower = new THREE.Mesh(new THREE.BoxGeometry(2.2, botH, 2.2), mats.wall);
  botTower.position.y = botTopY - botH * 0.5;
  botTower.castShadow = true;
  botTower.receiveShadow = true;
  root.add(botTower);

  // Pilastras / esquinas arquitectónicas del edificio inferior
  [-0.96, 0.96].forEach((px) => {
    const pilaster = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, Math.max(1, botH - 0.5), 2.28),
      mats.secondary
    );
    pilaster.position.set(px, botTopY - botH * 0.5, 0);
    root.add(pilaster);
  });

  addBuildingCrown(root, style.crown, botTopY, true, mats);

  // Ventanas y balcones del edificio inferior
  for (let row = 1; row <= 6; row++) {
    const winY = botTopY - 0.4 - row * 1.35;
    if (winY < CONFIG.floorY + 0.4) break;
    for (let col = -1; col <= 1; col += 2) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.55), mats.window);
      win.position.set(col * 0.42, winY, 1.13);
      root.add(win);
    }
    if (row % 2 === 1) {
      const ledge = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 0.18), mats.trim);
      ledge.position.set(0, winY - 0.3, 1.16);
      root.add(ledge);
    }
  }

  // Edificio / estructura arquitectónica superior
  const topTower = new THREE.Mesh(new THREE.BoxGeometry(2.2, topH, 2.2), mats.wall);
  topTower.position.y = topBottomY + topH * 0.5;
  topTower.castShadow = true;
  root.add(topTower);

  [-0.96, 0.96].forEach((px) => {
    const pilaster = new THREE.Mesh(new THREE.BoxGeometry(0.28, topH - 0.5, 2.28), mats.secondary);
    pilaster.position.set(px, topBottomY + topH * 0.5, 0);
    root.add(pilaster);
  });

  addBuildingCrown(root, style.crown, topBottomY, false, mats);

  for (let row = 1; row <= 4; row++) {
    const winY = topBottomY + 0.4 + row * 1.35;
    for (let col = -1; col <= 1; col += 2) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.55), mats.window);
      win.position.set(col * 0.42, winY, 1.13);
      root.add(win);
    }
  }

  return { root, halfWidth: 1.15 };
}

function buildGiantTreesObstacle(gapY, gapHeight) {
  const root = new THREE.Group();
  const trunkMat = makeMat(0x78350f, 0.88);
  const darkLeafMat = makeMat(0x15803d, 0.68);
  const brightLeafMat = makeMat(0x22c55e, 0.65);

  const topBottomY = gapY + gapHeight * 0.5;
  const botTopY = gapY - gapHeight * 0.5;
  const botH = Math.max(2.2, botTopY - (CONFIG.floorY - 1.2));

  // Árbol gigante inferior: tronco robusto + copa frondosa escalonada hasta botTopY
  const trunkH = Math.max(1.2, botH - 1.8);
  const botTrunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.98, trunkH, 7),
    trunkMat
  );
  botTrunk.position.y = botTopY - 1.8 - trunkH * 0.5;
  botTrunk.castShadow = true;
  root.add(botTrunk);

  const crownLow = new THREE.Mesh(new THREE.ConeGeometry(1.42, 1.5, 7), darkLeafMat);
  crownLow.position.y = botTopY - 1.25;
  crownLow.castShadow = true;
  const crownMid = new THREE.Mesh(new THREE.ConeGeometry(1.25, 1.3, 7), brightLeafMat);
  crownMid.position.y = botTopY - 0.72;
  crownMid.castShadow = true;
  const crownTop = new THREE.Mesh(new THREE.DodecahedronGeometry(0.95, 0), brightLeafMat);
  crownTop.scale.set(1.2, 0.72, 1.15);
  crownTop.position.y = botTopY - 0.35;
  root.add(crownLow, crownMid, crownTop);

  // Dosel arbóreo gigante superior
  const topH = 16;
  const topTrunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.68, topH, 7),
    trunkMat
  );
  topTrunk.position.y = topBottomY + 1.5 + topH * 0.5;
  root.add(topTrunk);

  const canopyEdge = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1, 0), brightLeafMat);
  canopyEdge.scale.set(1.18, 0.75, 1.15);
  canopyEdge.position.y = topBottomY + 0.42;
  const canopyUpper = new THREE.Mesh(new THREE.CylinderGeometry(1.38, 1.2, 1.6, 7), darkLeafMat);
  canopyUpper.position.y = topBottomY + 1.35;
  root.add(canopyEdge, canopyUpper);

  return { root, halfWidth: 1.15 };
}

function buildOceanWavesObstacle(gapY, gapHeight) {
  const root = new THREE.Group();
  const deepWaterMat = makeMat(0x0369a1, 0.42);
  const midWaterMat = makeMat(0x0ea5e9, 0.38);
  const foamMat = makeMat(0xf8fafc, 0.5);

  const topBottomY = gapY + gapHeight * 0.5;
  const botTopY = gapY - gapHeight * 0.5;
  const botH = Math.max(2.2, botTopY - (CONFIG.floorY - 1.2));

  // Gran columna de ola marina inferior con cresta de espuma blanca en botTopY
  const waveColumn = new THREE.Mesh(
    new THREE.CylinderGeometry(1.05, 1.38, botH - 0.5, 8),
    deepWaterMat
  );
  waveColumn.position.y = botTopY - 0.5 - (botH - 0.5) * 0.5;
  root.add(waveColumn);

  const waveSurge = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.08, 1.1, 8), midWaterMat);
  waveSurge.position.y = botTopY - 0.65;
  root.add(waveSurge);

  for (let i = -1; i <= 1; i++) {
    const foamPuff = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 0), foamMat);
    foamPuff.position.set(i * 0.48, botTopY - 0.25, (i % 2) * 0.2);
    root.add(foamPuff);
  }

  // Tromba / ola gigante superior con espuma marina en topBottomY
  const topH = 17;
  const topColumn = new THREE.Mesh(
    new THREE.CylinderGeometry(1.35, 1.05, topH, 8),
    deepWaterMat
  );
  topColumn.position.y = topBottomY + 0.5 + topH * 0.5;
  const topSurge = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.22, 1.1, 8), midWaterMat);
  topSurge.position.y = topBottomY + 0.65;
  root.add(topColumn, topSurge);

  for (let i = -1; i <= 1; i++) {
    const foamPuff = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 0), foamMat);
    foamPuff.position.set(i * 0.48, topBottomY + 0.25, (i % 2) * 0.2);
    root.add(foamPuff);
  }

  return { root, halfWidth: 1.15 };
}

function buildAlpinePeaksObstacle(gapY, gapHeight) {
  const root = new THREE.Group();
  const rockMat = makeMat(0x475569, 0.88);
  const snowMat = makeMat(0xf8fafc, 0.5);

  const topBottomY = gapY + gapHeight * 0.5;
  const botTopY = gapY - gapHeight * 0.5;
  const botH = Math.max(2.2, botTopY - (CONFIG.floorY - 1.2));

  // Montaña escarpada inferior con cumbre nevada en botTopY
  const rockH = Math.max(1.2, botH - 1.3);
  const botRock = new THREE.Mesh(
    new THREE.CylinderGeometry(1.08, 1.48, rockH, 6),
    rockMat
  );
  botRock.position.y = botTopY - 1.3 - rockH * 0.5;
  const botSnow = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 1.15, 1.3, 6),
    snowMat
  );
  botSnow.position.y = botTopY - 0.65;
  root.add(botRock, botSnow);

  // Risco de montaña superior con cornisa de nieve en topBottomY
  const topH = 17;
  const topRock = new THREE.Mesh(
    new THREE.CylinderGeometry(1.48, 1.08, topH, 6),
    rockMat
  );
  topRock.position.y = topBottomY + 1.2 + topH * 0.5;
  const topSnow = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 0.95, 1.2, 6),
    snowMat
  );
  topSnow.position.y = topBottomY + 0.6;
  root.add(topRock, topSnow);

  return { root, halfWidth: 1.15 };
}

function buildMedIslandsRuinsObstacle(gapY, gapHeight) {
  const root = new THREE.Group();
  const cliffMat = makeMat(0xd6d3d1, 0.82);
  const marbleMat = makeMat(0xf8fafc, 0.48);
  const blueMat = makeMat(0x0284c7, 0.45);

  const topBottomY = gapY + gapHeight * 0.5;
  const botTopY = gapY - gapHeight * 0.5;
  const botH = Math.max(2.2, botTopY - (CONFIG.floorY - 1.2));

  // Peñón mediterráneo inferior coronado por columnas clásicas y cúpula azul
  const cliffH = Math.max(1.2, botH - 1.4);
  const botCliff = new THREE.Mesh(
    new THREE.CylinderGeometry(1.12, 1.35, cliffH, 7),
    cliffMat
  );
  botCliff.position.y = botTopY - 1.4 - cliffH * 0.5;
  root.add(botCliff);

  [-0.55, 0, 0.55].forEach((cx) => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 1.1, 8), marbleMat);
    col.position.set(cx, botTopY - 0.85, 0.45);
    root.add(col);
  });

  const lintel = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 2.1), marbleMat);
  lintel.position.y = botTopY - 0.18;
  const blueTrim = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.2, 1.9), blueMat);
  blueTrim.position.y = botTopY - 0.42;
  root.add(lintel, blueTrim);

  // Arco rocoso y columnata clásica superior
  const topH = 17;
  const topCliff = new THREE.Mesh(
    new THREE.CylinderGeometry(1.35, 1.12, topH, 7),
    cliffMat
  );
  topCliff.position.y = topBottomY + 0.6 + topH * 0.5;
  const topLintel = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.38, 2.1), marbleMat);
  topLintel.position.y = topBottomY + 0.19;
  const topBlue = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.22, 1.95), blueMat);
  topBlue.position.y = topBottomY + 0.46;
  root.add(topCliff, topLintel, topBlue);

  return { root, halfWidth: 1.15 };
}

function buildDesertPyramidsObstacle(gapY, gapHeight) {
  const root = new THREE.Group();
  const sandMat = makeMat(0xd97706, 0.78);
  const darkSandMat = makeMat(0xb45309, 0.82);
  const goldMat = makeMat(0xfacc15, 0.32, { metalness: 0.45 });
  const turquoiseMat = makeMat(0x06b6d4, 0.45);

  const topBottomY = gapY + gapHeight * 0.5;
  const botTopY = gapY - gapHeight * 0.5;
  const botH = Math.max(2.2, botTopY - (CONFIG.floorY - 1.2));

  // Pirámide escalonada / obelisco egipcio inferior con piramidión dorado en botTopY
  const baseH = Math.max(1.2, botH - 1.1);
  const botShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.55, baseH, 4),
    sandMat
  );
  botShaft.rotation.y = Math.PI / 4;
  botShaft.position.y = botTopY - 1.1 - baseH * 0.5;

  const stepMid = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.55, 2.15), darkSandMat);
  stepMid.position.y = botTopY - 0.82;
  const frieze = new THREE.Mesh(new THREE.BoxGeometry(2.22, 0.22, 2.22), turquoiseMat);
  frieze.position.y = botTopY - 0.45;
  const goldCap = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.34, 2.3), goldMat);
  goldCap.position.y = botTopY - 0.17;
  root.add(botShaft, stepMid, frieze, goldCap);

  // Pilono faraónico superior
  const topH = 17;
  const topShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(1.55, 1.15, topH, 4),
    sandMat
  );
  topShaft.rotation.y = Math.PI / 4;
  topShaft.position.y = topBottomY + 0.6 + topH * 0.5;
  const topGold = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.34, 2.3), goldMat);
  topGold.position.y = topBottomY + 0.17;
  const topTurquoise = new THREE.Mesh(new THREE.BoxGeometry(2.22, 0.22, 2.22), turquoiseMat);
  topTurquoise.position.y = topBottomY + 0.45;
  root.add(topShaft, topGold, topTurquoise);

  return { root, halfWidth: 1.15 };
}

function buildCanyonArchesObstacle(gapY, gapHeight) {
  const root = new THREE.Group();
  const redRockMat = makeMat(0x9a3412, 0.85);
  const terracottaMat = makeMat(0xc2410c, 0.82);
  const ochreMat = makeMat(0xd97706, 0.78);

  const topBottomY = gapY + gapHeight * 0.5;
  const botTopY = gapY - gapHeight * 0.5;
  const botH = Math.max(2.2, botTopY - (CONFIG.floorY - 1.2));

  // Pilar de cañón estratificado inferior (mesa de roca rojiza)
  const col = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 1.35, botH - 0.4, 6),
    redRockMat
  );
  col.position.y = botTopY - 0.4 - (botH - 0.4) * 0.5;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.22, 0.6, 6), ochreMat);
  band.position.y = botTopY - 1.1;
  const mesaCap = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.42, 2.35), terracottaMat);
  mesaCap.position.y = botTopY - 0.21;
  root.add(col, band, mesaCap);

  // Saliente de cañón superior
  const topH = 17;
  const topCol = new THREE.Mesh(
    new THREE.CylinderGeometry(1.35, 1.1, topH, 6),
    redRockMat
  );
  topCol.position.y = topBottomY + 0.4 + topH * 0.5;
  const topCap = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.42, 2.35), terracottaMat);
  topCap.position.y = topBottomY + 0.21;
  const topBand = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.22, 0.6, 6), ochreMat);
  topBand.position.y = topBottomY + 1.05;
  root.add(topCol, topCap, topBand);

  return { root, halfWidth: 1.15 };
}

function buildJungleTemplesObstacle(gapY, gapHeight) {
  const root = new THREE.Group();
  const stoneMat = makeMat(0x047857, 0.75);
  const goldMat = makeMat(0xfacc15, 0.32, { metalness: 0.45 });
  const vineMat = makeMat(0x16a34a, 0.7);

  const topBottomY = gapY + gapHeight * 0.5;
  const botTopY = gapY - gapHeight * 0.5;
  const botH = Math.max(2.2, botTopY - (CONFIG.floorY - 1.2));

  // Templo escalonado de la selva inferior con vegetación y remate dorado
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.15, botH - 0.4, 2.15), stoneMat);
  body.position.y = botTopY - 0.4 - (botH - 0.4) * 0.5;
  const goldTier = new THREE.Mesh(new THREE.BoxGeometry(2.38, 0.42, 2.38), goldMat);
  goldTier.position.y = botTopY - 0.21;
  const vineBand = new THREE.Mesh(new THREE.BoxGeometry(2.28, 0.45, 2.28), vineMat);
  vineBand.position.y = botTopY - 0.75;
  root.add(body, goldTier, vineBand);

  // Dosel de selva y templo superior
  const topH = 17;
  const topBody = new THREE.Mesh(new THREE.BoxGeometry(2.15, topH, 2.15), stoneMat);
  topBody.position.y = topBottomY + 0.4 + topH * 0.5;
  const topGold = new THREE.Mesh(new THREE.BoxGeometry(2.38, 0.42, 2.38), goldMat);
  topGold.position.y = topBottomY + 0.21;
  const topVine = new THREE.Mesh(new THREE.BoxGeometry(2.28, 0.45, 2.28), vineMat);
  topVine.position.y = topBottomY + 0.75;
  root.add(topBody, topGold, topVine);

  return { root, halfWidth: 1.15 };
}

function buildVolcanicSpiresObstacle(gapY, gapHeight) {
  const root = new THREE.Group();
  const basaltMat = makeMat(0x1e293b, 0.9);
  const lavaMat = makeBasic(0xf97316);
  const ashMat = makeMat(0x475569, 0.78);

  const topBottomY = gapY + gapHeight * 0.5;
  const botTopY = gapY - gapHeight * 0.5;
  const botH = Math.max(2.2, botTopY - (CONFIG.floorY - 1.2));

  // Columna volcánica de basalto inferior con borde incandescente de lava en botTopY
  const cone = new THREE.Mesh(
    new THREE.CylinderGeometry(1.08, 1.48, botH - 0.35, 7),
    basaltMat
  );
  cone.position.y = botTopY - 0.35 - (botH - 0.35) * 0.5;
  const lavaRim = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.15, 0.35, 7),
    lavaMat
  );
  lavaRim.position.y = botTopY - 0.18;
  root.add(cone, lavaRim);

  // Columna de roca basáltica y nube volcánica superior
  const topH = 17;
  const topBasalt = new THREE.Mesh(
    new THREE.CylinderGeometry(1.42, 1.08, topH, 7),
    basaltMat
  );
  topBasalt.position.y = topBottomY + 0.35 + topH * 0.5;
  const topLava = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.15, 0.35, 7),
    lavaMat
  );
  topLava.position.y = topBottomY + 0.18;
  const ashCloud = new THREE.Mesh(new THREE.DodecahedronGeometry(1.18, 0), ashMat);
  ashCloud.position.y = topBottomY + 1.05;
  root.add(topBasalt, topLava, ashCloud);

  return { root, halfWidth: 1.15 };
}

function buildSakuraPagodasObstacle(gapY, gapHeight) {
  const root = new THREE.Group();
  const trunkMat = makeMat(0x5c3a21, 0.85);
  const sakuraMat = makeMat(0xf472b6, 0.55);
  const vermilionMat = makeMat(0xef4444, 0.5);
  const slateMat = makeMat(0x1e293b, 0.65);

  const topBottomY = gapY + gapHeight * 0.5;
  const botTopY = gapY - gapHeight * 0.5;
  const botH = Math.max(2.2, botTopY - (CONFIG.floorY - 1.2));

  // Pilar japonés inferior con flores de cerezo y alero de pagoda
  const botPillar = new THREE.Mesh(new THREE.BoxGeometry(2.05, botH - 0.5, 2.05), trunkMat);
  botPillar.position.y = botTopY - 0.5 - (botH - 0.5) * 0.5;
  const botBeam = new THREE.Mesh(new THREE.BoxGeometry(2.38, 0.28, 2.38), vermilionMat);
  botBeam.position.y = botTopY - 0.45;
  const botRoof = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.28, 2.45), slateMat);
  botRoof.position.y = botTopY - 0.15;
  const blossom = new THREE.Mesh(new THREE.DodecahedronGeometry(0.95, 0), sakuraMat);
  blossom.scale.set(1.2, 0.65, 1.2);
  blossom.position.y = botTopY - 0.9;
  root.add(botPillar, botBeam, botRoof, blossom);

  // Dosel de cerezo en flor y viga Torii superior
  const topH = 17;
  const topPillar = new THREE.Mesh(new THREE.BoxGeometry(2.05, topH, 2.05), trunkMat);
  topPillar.position.y = topBottomY + 0.5 + topH * 0.5;
  const topRoof = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.28, 2.45), vermilionMat);
  topRoof.position.y = topBottomY + 0.15;
  const topBlossom = new THREE.Mesh(new THREE.DodecahedronGeometry(1.05, 0), sakuraMat);
  topBlossom.scale.set(1.2, 0.65, 1.2);
  topBlossom.position.y = topBottomY + 0.75;
  root.add(topPillar, topRoof, topBlossom);

  return { root, halfWidth: 1.15 };
}

function buildCoralAtollsObstacle(gapY, gapHeight) {
  const root = new THREE.Group();
  const coralStoneMat = makeMat(0xfde68a, 0.78);
  const turquoiseMat = makeMat(0x06b6d4, 0.4);
  const greenPalmMat = makeMat(0x16a34a, 0.65);

  const topBottomY = gapY + gapHeight * 0.5;
  const botTopY = gapY - gapHeight * 0.5;
  const botH = Math.max(2.2, botTopY - (CONFIG.floorY - 1.2));

  const botCol = new THREE.Mesh(
    new THREE.CylinderGeometry(1.12, 1.38, botH - 0.5, 7),
    coralStoneMat
  );
  botCol.position.y = botTopY - 0.5 - (botH - 0.5) * 0.5;
  const reefRing = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.22, 0.4, 7), turquoiseMat);
  reefRing.position.y = botTopY - 0.55;
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.28, 0.35, 7), greenPalmMat);
  crown.position.y = botTopY - 0.18;
  root.add(botCol, reefRing, crown);

  const topH = 17;
  const topCol = new THREE.Mesh(
    new THREE.CylinderGeometry(1.38, 1.12, topH, 7),
    coralStoneMat
  );
  topCol.position.y = topBottomY + 0.4 + topH * 0.5;
  const topTurquoise = new THREE.Mesh(
    new THREE.CylinderGeometry(1.25, 1.22, 0.4, 7),
    turquoiseMat
  );
  topTurquoise.position.y = topBottomY + 0.2;
  root.add(topCol, topTurquoise);

  return { root, halfWidth: 1.15 };
}

function buildGoldenGateRedTowersObstacle(gapY, gapHeight) {
  const root = new THREE.Group();
  const redSteelMat = makeMat(0xdc2626, 0.45, { metalness: 0.3 });
  const darkRedMat = makeMat(0x991b1b, 0.5);
  const concreteMat = makeMat(0xcbd5e1, 0.75);

  const topBottomY = gapY + gapHeight * 0.5;
  const botTopY = gapY - gapHeight * 0.5;
  const botH = Math.max(2.2, botTopY - (CONFIG.floorY - 1.2));

  // Torre de puente colgante de acero rojo inferior
  const botTower = new THREE.Mesh(new THREE.BoxGeometry(2.15, botH, 2.15), redSteelMat);
  botTower.position.y = botTopY - botH * 0.5;
  const botCross = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.42, 2.42), darkRedMat);
  botCross.position.y = botTopY - 0.21;
  const botPier = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.32, 2.35), concreteMat);
  botPier.position.y = botTopY - 1.2;
  root.add(botTower, botCross, botPier);

  // Celosía de puente colgante de acero rojo superior
  const topH = 17;
  const topTower = new THREE.Mesh(new THREE.BoxGeometry(2.15, topH, 2.15), redSteelMat);
  topTower.position.y = topBottomY + topH * 0.5;
  const topCross = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.42, 2.42), darkRedMat);
  topCross.position.y = topBottomY + 0.21;
  root.add(topTower, topCross);

  return { root, halfWidth: 1.15 };
}

function buildIcebergsGlaciersObstacle(gapY, gapHeight) {
  const root = new THREE.Group();
  const iceWhiteMat = makeMat(0xf8fafc, 0.35);
  const iceCyanMat = makeMat(0x38bdf8, 0.3);

  const topBottomY = gapY + gapHeight * 0.5;
  const botTopY = gapY - gapHeight * 0.5;
  const botH = Math.max(2.2, botTopY - (CONFIG.floorY - 1.2));

  // Iceberg / glaciar cristalino inferior
  const botIce = new THREE.Mesh(
    new THREE.CylinderGeometry(1.08, 1.45, botH - 0.4, 6),
    iceCyanMat
  );
  botIce.position.y = botTopY - 0.4 - (botH - 0.4) * 0.5;
  const botCap = new THREE.Mesh(
    new THREE.CylinderGeometry(1.18, 1.12, 0.55, 6),
    iceWhiteMat
  );
  botCap.position.y = botTopY - 0.27;
  root.add(botIce, botCap);

  // Glaciar colgante superior
  const topH = 17;
  const topIce = new THREE.Mesh(
    new THREE.CylinderGeometry(1.45, 1.08, topH, 6),
    iceCyanMat
  );
  topIce.position.y = topBottomY + 0.4 + topH * 0.5;
  const topCap = new THREE.Mesh(
    new THREE.CylinderGeometry(1.12, 1.18, 0.55, 6),
    iceWhiteMat
  );
  topCap.position.y = topBottomY + 0.27;
  root.add(topIce, topCap);

  return { root, halfWidth: 1.15 };
}

function buildSeaCliffsObstacle(gapY, gapHeight) {
  const root = new THREE.Group();
  const slateMat = makeMat(0x334155, 0.88);
  const emeraldMat = makeMat(0x16a34a, 0.65);

  const topBottomY = gapY + gapHeight * 0.5;
  const botTopY = gapY - gapHeight * 0.5;
  const botH = Math.max(2.2, botTopY - (CONFIG.floorY - 1.2));

  // Acantilado escarpado con manto de hierba esmeralda en botTopY
  const cliff = new THREE.Mesh(new THREE.BoxGeometry(2.2, botH - 0.36, 2.2), slateMat);
  cliff.position.y = botTopY - 0.36 - (botH - 0.36) * 0.5;
  const grassTop = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.38, 2.36), emeraldMat);
  grassTop.position.y = botTopY - 0.19;
  root.add(cliff, grassTop);

  // Acantilado superior
  const topH = 17;
  const topCliff = new THREE.Mesh(new THREE.BoxGeometry(2.2, topH, 2.2), slateMat);
  topCliff.position.y = topBottomY + 0.36 + topH * 0.5;
  const topEdge = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.38, 2.36), emeraldMat);
  topEdge.position.y = topBottomY + 0.19;
  root.add(topCliff, topEdge);

  return { root, halfWidth: 1.15 };
}

const JOURNEY_BUILDERS = {
  giant_trees: buildGiantTreesObstacle,
  ocean_waves: buildOceanWavesObstacle,
  alpine_peaks: buildAlpinePeaksObstacle,
  med_islands_ruins: buildMedIslandsRuinsObstacle,
  desert_pyramids: buildDesertPyramidsObstacle,
  canyon_arches: buildCanyonArchesObstacle,
  jungle_temples: buildJungleTemplesObstacle,
  volcanic_spires: buildVolcanicSpiresObstacle,
  sakura_pagodas: buildSakuraPagodasObstacle,
  coral_atolls: buildCoralAtollsObstacle,
  golden_gate_red_towers: buildGoldenGateRedTowersObstacle,
  icebergs_glaciers: buildIcebergsGlaciersObstacle,
  sea_cliffs: buildSeaCliffsObstacle
};

export function createObstacleSystem(scene) {
  const group = new THREE.Group();
  scene.add(group);

  const obstacles = [];

  function spawn(xPos, level, obstacleIndex = 0) {
    const gapHeight = level.gapSize;
    const minGapY = -3.8;
    const maxGapY = 4.2;
    const gapY = THREE.MathUtils.lerp(minGapY, maxGapY, Math.random());

    const resolved = resolveObstacleStyle(level, obstacleIndex);
    let built;
    if (resolved.category === 'city') {
      built = buildCityBuildingObstacle(resolved.cityId, gapY, gapHeight);
    } else {
      const builder = JOURNEY_BUILDERS[resolved.style] || buildGiantTreesObstacle;
      built = builder(gapY, gapHeight);
    }

    built.root.position.set(xPos, 0, 0);
    group.add(built.root);

    // Todos los obstáculos son 100% fijos (sin movimiento vertical ni anillos)
    const obstacle = {
      type: resolved.role,
      mesh: built.root,
      ringMesh: null,
      boltMesh: null,
      baseGapY: gapY,
      gapY,
      gapHeight,
      halfWidth: built.halfWidth,
      passed: false,
      oscillates: false
    };

    obstacles.push(obstacle);
    return obstacle;
  }

  function move(dt, scrollSpeed) {
    for (const obs of obstacles) {
      obs.mesh.position.x -= scrollSpeed * dt;
    }
  }

  function cleanup() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      if (obs.mesh.position.x < CONFIG.obstacleDespawnX) {
        group.remove(obs.mesh);
        obstacles.splice(i, 1);
      }
    }
  }

  function clear() {
    for (const obs of obstacles) {
      group.remove(obs.mesh);
    }
    obstacles.length = 0;
  }

  return {
    group,
    obstacles,
    spawn,
    move,
    cleanup,
    clear
  };
}
