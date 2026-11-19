import * as THREE from 'three';
import { CONFIG } from './config.js';

export const COLUMN_STYLES = {
  london: {
    shaftHex: 0xd6c7a9,
    fluteHex: 0xb91c1c,
    capitalHex: 0x1e293b,
    accentHex: 0xfacc15,
    shaftSides: 8,
    ringStyle: 'celtic_gothic',
    capitalStyle: 'gothic_crown'
  },
  paris: {
    shaftHex: 0x9a714c,
    fluteHex: 0x6e4f32,
    capitalHex: 0xeaddc5,
    accentHex: 0xfacc15,
    shaftSides: 8,
    ringStyle: 'lattice',
    capitalStyle: 'iron_belle_epoque'
  },
  rome: {
    shaftHex: 0xd6b88d,
    fluteHex: 0xa68963,
    capitalHex: 0xf8fafc,
    accentHex: 0xc2410c,
    shaftSides: 12,
    ringStyle: 'spiral',
    capitalStyle: 'corinthian_acanthus'
  },
  athens: {
    shaftHex: 0xf8fafc,
    fluteHex: 0xcbd5e1,
    capitalHex: 0x0284c7,
    accentHex: 0xfacc15,
    shaftSides: 12,
    ringStyle: 'classic_fluted',
    capitalStyle: 'ionic_volutes'
  },
  cairo: {
    shaftHex: 0xf59e0b,
    fluteHex: 0xb45309,
    capitalHex: 0x06b6d4,
    accentHex: 0xfef08a,
    shaftSides: 12,
    ringStyle: 'hieroglyph',
    capitalStyle: 'lotus_bell'
  },
  baghdad: {
    shaftHex: 0xeab308,
    fluteHex: 0x06b6d4,
    capitalHex: 0xfacc15,
    accentHex: 0x0891b2,
    shaftSides: 10,
    ringStyle: 'hieroglyph',
    capitalStyle: 'muqarnas_bulb'
  },
  bombay: {
    shaftHex: 0xd97706,
    fluteHex: 0x9a3412,
    capitalHex: 0xfef3c7,
    accentHex: 0xfacc15,
    shaftSides: 8,
    ringStyle: 'celtic_gothic',
    capitalStyle: 'muqarnas_bulb'
  },
  calcutta: {
    shaftHex: 0xf8fafc,
    fluteHex: 0xe2e8f0,
    capitalHex: 0x10b981,
    accentHex: 0xfacc15,
    shaftSides: 12,
    ringStyle: 'classic_fluted',
    capitalStyle: 'corinthian_acanthus'
  },
  bangkok: {
    shaftHex: 0xfacc15,
    fluteHex: 0xdc2626,
    capitalHex: 0x10b981,
    accentHex: 0xfef08a,
    shaftSides: 10,
    ringStyle: 'pagoda_brackets',
    capitalStyle: 'oriental_bracket'
  },
  singapore: {
    shaftHex: 0x0284c7,
    fluteHex: 0xe2e8f0,
    capitalHex: 0x22d3ee,
    accentHex: 0xec4899,
    shaftSides: 8,
    ringStyle: 'lattice',
    capitalStyle: 'art_deco_stepped'
  },
  manila: {
    shaftHex: 0xd6c7a9,
    fluteHex: 0x78350f,
    capitalHex: 0xc2410c,
    accentHex: 0xfacc15,
    shaftSides: 8,
    ringStyle: 'pagoda_brackets',
    capitalStyle: 'oriental_bracket'
  },
  tokyo: {
    shaftHex: 0xef4444,
    fluteHex: 0x1e293b,
    capitalHex: 0x1e293b,
    accentHex: 0xfacc15,
    shaftSides: 12,
    ringStyle: 'pagoda_brackets',
    capitalStyle: 'oriental_bracket'
  },
  midway: {
    shaftHex: 0xfef3c7,
    fluteHex: 0x22d3ee,
    capitalHex: 0xf97316,
    accentHex: 0x0284c7,
    shaftSides: 10,
    ringStyle: 'classic_fluted',
    capitalStyle: 'beacon_crown'
  },
  honolulu: {
    shaftHex: 0x78350f,
    fluteHex: 0x334155,
    capitalHex: 0xf97316,
    accentHex: 0x22d3ee,
    shaftSides: 8,
    ringStyle: 'hieroglyph',
    capitalStyle: 'beacon_crown'
  },
  san_francisco: {
    shaftHex: 0xdc2626,
    fluteHex: 0x991b1b,
    capitalHex: 0xf8fafc,
    accentHex: 0xfacc15,
    shaftSides: 8,
    ringStyle: 'lattice',
    capitalStyle: 'iron_belle_epoque'
  },
  new_york: {
    shaftHex: 0x475569,
    fluteHex: 0x34d399,
    capitalHex: 0x1e293b,
    accentHex: 0xfacc15,
    shaftSides: 8,
    ringStyle: 'classic_fluted',
    capitalStyle: 'art_deco_stepped'
  },
  newfoundland: {
    shaftHex: 0xf8fafc,
    fluteHex: 0xdc2626,
    capitalHex: 0x0284c7,
    accentHex: 0xeab308,
    shaftSides: 10,
    ringStyle: 'spiral',
    capitalStyle: 'beacon_crown'
  },
  greenland: {
    shaftHex: 0xe0f2fe,
    fluteHex: 0x38bdf8,
    capitalHex: 0xb91c1c,
    accentHex: 0xffffff,
    shaftSides: 6,
    ringStyle: 'glacial',
    capitalStyle: 'glacial_basalt'
  },
  reykjavik: {
    shaftHex: 0x1e293b,
    fluteHex: 0xf1f5f9,
    capitalHex: 0x10b981,
    accentHex: 0xa855f7,
    shaftSides: 6,
    ringStyle: 'glacial',
    capitalStyle: 'glacial_basalt'
  },
  dublin: {
    shaftHex: 0x64748b,
    fluteHex: 0x9a3412,
    capitalHex: 0x16a34a,
    accentHex: 0xfacc15,
    shaftSides: 8,
    ringStyle: 'celtic_gothic',
    capitalStyle: 'gothic_crown'
  }
};

export function resolveObstacleStyle(level, obstacleIndex = 0) {
  const total = Math.max(6, level?.obstacleCount || 8);
  const clampedIndex = Math.max(0, obstacleIndex);
  const progressRatio = clampedIndex / Math.max(1, total - 1);

  const originCity = level?.originLandmark || 'london';
  const destinationCity = level?.destinationLandmark || 'paris';

  // Primer tramo: columnas de la ciudad de origen
  if (clampedIndex < 2 || progressRatio < 0.34) {
    return {
      phase: 'origin',
      bottomCity: originCity,
      topCity: originCity,
      role: `column:${originCity}`
    };
  }

  // Último tramo: columnas de la ciudad de destino
  if (clampedIndex >= total - 2 || progressRatio >= 0.67) {
    return {
      phase: 'destination',
      bottomCity: destinationCity,
      topCity: destinationCity,
      role: `column:${destinationCity}`
    };
  }

  // Tramo central: mezcla entre columnas de origen y de destino
  // (mitad y mitad arriba/abajo o alternando una de cada)
  const mixMode = clampedIndex % 4;
  if (mixMode === 0) {
    return {
      phase: 'mixed',
      bottomCity: originCity,
      topCity: destinationCity,
      role: `column:${originCity}+${destinationCity}`
    };
  }
  if (mixMode === 1) {
    return {
      phase: 'mixed',
      bottomCity: destinationCity,
      topCity: originCity,
      role: `column:${destinationCity}+${originCity}`
    };
  }
  if (mixMode === 2) {
    return {
      phase: 'mixed',
      bottomCity: destinationCity,
      topCity: destinationCity,
      role: `column:${destinationCity}`
    };
  }
  return {
    phase: 'mixed',
    bottomCity: originCity,
    topCity: originCity,
    role: `column:${originCity}`
  };
}

function makeMat(color, roughness = 0.55, extra = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    flatShading: true,
    ...extra
  });
}

function buildColumnCapital(group, style, yEdge, isBottom, mats) {
  const dir = isBottom ? 1 : -1;

  // 1. Ábaco superior (losa cuadrada que marca con precisión el límite del hueco)
  const abacus = new THREE.Mesh(new THREE.BoxGeometry(2.26, 0.24, 2.26), mats.capital);
  abacus.position.y = yEdge - dir * 0.12;
  abacus.castShadow = true;
  group.add(abacus);

  const abacusTrim = new THREE.Mesh(new THREE.BoxGeometry(2.34, 0.1, 2.34), mats.accent);
  abacusTrim.position.y = yEdge - dir * 0.26;
  group.add(abacusTrim);

  // 2. Cuerpo del capitel según el estilo arquitectónico de la ciudad
  const capStyle = style.capitalStyle;
  if (capStyle === 'ionic_volutes') {
    const echinus = new THREE.Mesh(
      new THREE.CylinderGeometry(
        isBottom ? 1.08 : 0.86,
        isBottom ? 0.86 : 1.08,
        0.44,
        style.shaftSides
      ),
      mats.shaft
    );
    echinus.position.y = yEdge - dir * 0.52;
    group.add(echinus);

    // Volutas jónicas laterales
    [-0.92, 0.92].forEach((vx) => {
      const volute = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 1.88, 10),
        mats.accent
      );
      volute.rotation.x = Math.PI / 2;
      volute.position.set(vx, yEdge - dir * 0.38, 0);
      group.add(volute);
    });
  } else if (capStyle === 'lotus_bell') {
    // Capitel campaniforme egipcio (flor de loto/papiro abierta)
    const bell = new THREE.Mesh(
      new THREE.CylinderGeometry(
        isBottom ? 1.18 : 0.78,
        isBottom ? 0.78 : 1.18,
        0.65,
        12
      ),
      mats.capital
    );
    bell.position.y = yEdge - dir * 0.58;
    const goldBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.92, 0.92, 0.16, 12),
      mats.accent
    );
    goldBand.position.y = yEdge - dir * 0.86;
    group.add(bell, goldBand);
  } else if (capStyle === 'muqarnas_bulb') {
    // Capitel bulboso islámico / indo-sarraceno
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.96, 10, 8), mats.accent);
    bulb.scale.set(1.05, 0.65, 1.05);
    bulb.position.y = yEdge - dir * 0.55;
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.18, 10), mats.flute);
    collar.position.y = yEdge - dir * 0.88;
    group.add(bulb, collar);
  } else if (capStyle === 'oriental_bracket') {
    // Capitel escalonado de ménsulas orientales (kumimono / templo)
    const step1 = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.22, 2.05), mats.flute);
    step1.position.y = yEdge - dir * 0.4;
    const step2 = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.24, 1.75), mats.accent);
    step2.position.y = yEdge - dir * 0.62;
    const step3 = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.2, 1.48), mats.capital);
    step3.position.y = yEdge - dir * 0.82;
    group.add(step1, step2, step3);
  } else if (capStyle === 'gothic_crown' || capStyle === 'art_deco_stepped') {
    // Capitel octogonal escalonado con relieves en las esquinas
    const crown = new THREE.Mesh(
      new THREE.CylinderGeometry(
        isBottom ? 1.12 : 0.85,
        isBottom ? 0.85 : 1.12,
        0.58,
        8
      ),
      mats.flute
    );
    crown.position.y = yEdge - dir * 0.56;
    group.add(crown);

    [-0.85, 0.85].forEach((cx) => {
      [-0.85, 0.85].forEach((cz) => {
        const spur = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.48, 0.32), mats.accent);
        spur.position.set(cx, yEdge - dir * 0.48, cz);
        group.add(spur);
      });
    });
  } else if (capStyle === 'iron_belle_epoque') {
    // Capitel de celosía de hierro con arcos decorativos
    const ironCap = new THREE.Mesh(
      new THREE.CylinderGeometry(
        isBottom ? 1.15 : 0.82,
        isBottom ? 0.82 : 1.15,
        0.58,
        8
      ),
      mats.flute
    );
    ironCap.position.y = yEdge - dir * 0.56;
    const rivetBelt = new THREE.Mesh(new THREE.BoxGeometry(2.12, 0.16, 2.12), mats.accent);
    rivetBelt.position.y = yEdge - dir * 0.42;
    group.add(ironCap, rivetBelt);
  } else if (capStyle === 'glacial_basalt') {
    // Capitel de prismas hexagonales escalonados
    const hex1 = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.08, 0.3, 6), mats.flute);
    hex1.position.y = yEdge - dir * 0.42;
    const hex2 = new THREE.Mesh(new THREE.CylinderGeometry(0.94, 0.94, 0.3, 6), mats.accent);
    hex2.position.y = yEdge - dir * 0.7;
    group.add(hex1, hex2);
  } else {
    // Corinthian / Beacon crown
    const bell = new THREE.Mesh(
      new THREE.CylinderGeometry(
        isBottom ? 1.12 : 0.82,
        isBottom ? 0.82 : 1.12,
        0.6,
        style.shaftSides
      ),
      mats.capital
    );
    bell.position.y = yEdge - dir * 0.56;
    group.add(bell);
  }

  // 3. Collarino (anillo astrágalo entre el fuste y el capitel)
  const astragal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 0.95, 0.16, style.shaftSides),
    mats.accent
  );
  astragal.position.y = yEdge - dir * 0.94;
  group.add(astragal);
}

function buildHalfColumn(cityId, isBottom, gapY, gapHeight) {
  const style = COLUMN_STYLES[cityId] || COLUMN_STYLES.london;
  const subGroup = new THREE.Group();

  const mats = {
    shaft: makeMat(style.shaftHex, 0.55),
    flute: makeMat(style.fluteHex, 0.6),
    capital: makeMat(style.capitalHex, 0.5),
    accent: makeMat(style.accentHex, 0.38, { metalness: 0.3 })
  };

  const yEdge = isBottom ? gapY - gapHeight * 0.5 : gapY + gapHeight * 0.5;
  const totalH = isBottom
    ? Math.max(2.2, yEdge - (CONFIG.floorY - 1.2))
    : 18;
  const shaftH = Math.max(1.2, totalH - 1.0);
  const dir = isBottom ? 1 : -1;

  // Fuste principal de la columna
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.84, 0.9, shaftH, style.shaftSides),
    mats.shaft
  );
  const shaftCenterY = yEdge - dir * (1.0 + shaftH * 0.5);
  shaft.position.y = shaftCenterY;
  shaft.castShadow = true;
  shaft.receiveShadow = true;
  subGroup.add(shaft);

  // Estrías verticales (fluting) o nervios arquitectónicos en el fuste
  const ribs = style.shaftSides >= 10 ? 6 : 4;
  for (let i = 0; i < ribs; i++) {
    const angle = (i / ribs) * Math.PI * 2;
    const rib = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, Math.max(0.8, shaftH - 0.3), 0.18),
      mats.flute
    );
    rib.position.set(Math.cos(angle) * 0.82, shaftCenterY, Math.sin(angle) * 0.82);
    rib.rotation.y = -angle;
    subGroup.add(rib);
  }

  // Anillos, tambores o bandas decorativas a lo largo del fuste según la ciudad
  const ringStep = 1.65;
  const maxRings = Math.min(7, Math.floor(shaftH / ringStep));
  for (let r = 1; r <= maxRings; r++) {
    const ry = yEdge - dir * (1.0 + r * ringStep);
    if (style.ringStyle === 'spiral') {
      const band = new THREE.Mesh(
        new THREE.CylinderGeometry(0.96, 0.96, 0.24, style.shaftSides),
        r % 2 === 0 ? mats.accent : mats.flute
      );
      band.position.y = ry;
      band.rotation.z = (r % 2 === 0 ? 1 : -1) * 0.18;
      subGroup.add(band);
    } else if (style.ringStyle === 'hieroglyph') {
      const drum1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.95, 0.95, 0.28, style.shaftSides),
        mats.flute
      );
      drum1.position.y = ry;
      const drum2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.98, 0.98, 0.12, style.shaftSides),
        mats.accent
      );
      drum2.position.y = ry + dir * 0.2;
      subGroup.add(drum1, drum2);
    } else if (style.ringStyle === 'lattice') {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.22, 1.92), mats.flute);
      frame.position.y = ry;
      const dot = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.1, 1.98), mats.accent);
      dot.position.y = ry;
      subGroup.add(frame, dot);
    } else if (style.ringStyle === 'pagoda_brackets') {
      const collar = new THREE.Mesh(new THREE.BoxGeometry(2.02, 0.2, 2.02), mats.accent);
      collar.position.y = ry;
      const eave = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.14, 2.18), mats.capital);
      eave.position.y = ry - dir * 0.14;
      subGroup.add(collar, eave);
    } else if (style.ringStyle === 'glacial') {
      const prism = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.92, 0.45, 6), mats.accent);
      prism.position.y = ry;
      subGroup.add(prism);
    } else {
      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(0.95, 0.95, 0.2, style.shaftSides),
        r % 2 === 0 ? mats.accent : mats.capital
      );
      ring.position.y = ry;
      subGroup.add(ring);
    }
  }

  // Basa / pedestal en el suelo para la columna inferior
  if (isBottom) {
    const plinthY = CONFIG.floorY + 0.35;
    if (yEdge - plinthY > 1.3) {
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.65, 2.25), mats.capital);
      plinth.position.y = plinthY;
      const torusBase = new THREE.Mesh(
        new THREE.CylinderGeometry(1.06, 1.14, 0.35, style.shaftSides),
        mats.accent
      );
      torusBase.position.y = plinthY + 0.45;
      subGroup.add(plinth, torusBase);
    }
  }

  // Capitel y ábaco junto al hueco
  buildColumnCapital(subGroup, style, yEdge, isBottom, mats);

  return subGroup;
}

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

    const root = new THREE.Group();
    const bottomCol = buildHalfColumn(resolved.bottomCity, true, gapY, gapHeight);
    const topCol = buildHalfColumn(resolved.topCity, false, gapY, gapHeight);
    root.add(bottomCol, topCol);

    root.position.set(xPos, 0, 0);
    group.add(root);

    const obstacle = {
      type: resolved.role,
      phase: resolved.phase,
      bottomCity: resolved.bottomCity,
      topCity: resolved.topCity,
      mesh: root,
      ringMesh: null,
      boltMesh: null,
      baseGapY: gapY,
      gapY,
      gapHeight,
      halfWidth: 1.15,
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
