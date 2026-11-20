import * as THREE from 'three';
import { CONFIG } from './config.js';

export const COLUMN_STYLES = {
  london: {
    shaftHex: 0xd6c7a9,
    capitalHex: 0xb91c1c,
    accentHex: 0xfacc15
  },
  paris: {
    shaftHex: 0xeaddc5,
    capitalHex: 0x475569,
    accentHex: 0x9a714c
  },
  rome: {
    shaftHex: 0xd6b88d,
    capitalHex: 0xc2410c,
    accentHex: 0xf8fafc
  },
  athens: {
    shaftHex: 0xf8fafc,
    capitalHex: 0x0284c7,
    accentHex: 0xfacc15
  },
  cairo: {
    shaftHex: 0xf59e0b,
    capitalHex: 0xb45309,
    accentHex: 0x06b6d4
  },
  baghdad: {
    shaftHex: 0xeab308,
    capitalHex: 0x0891b2,
    accentHex: 0xfacc15
  },
  bombay: {
    shaftHex: 0xd97706,
    capitalHex: 0x9a3412,
    accentHex: 0xfef3c7
  },
  calcutta: {
    shaftHex: 0xf8fafc,
    capitalHex: 0x10b981,
    accentHex: 0xfacc15
  },
  bangkok: {
    shaftHex: 0xfacc15,
    capitalHex: 0xdc2626,
    accentHex: 0x10b981
  },
  singapore: {
    shaftHex: 0x0ea5e9,
    capitalHex: 0x0369a1,
    accentHex: 0xe2e8f0
  },
  manila: {
    shaftHex: 0xd6c7a9,
    capitalHex: 0xc2410c,
    accentHex: 0x78350f
  },
  tokyo: {
    shaftHex: 0xef4444,
    capitalHex: 0x1e293b,
    accentHex: 0xf8fafc
  },
  midway: {
    shaftHex: 0xfef3c7,
    capitalHex: 0x0284c7,
    accentHex: 0xf97316
  },
  honolulu: {
    shaftHex: 0x92400e,
    capitalHex: 0xf97316,
    accentHex: 0x22d3ee
  },
  san_francisco: {
    shaftHex: 0xdc2626,
    capitalHex: 0x991b1b,
    accentHex: 0xf8fafc
  },
  new_york: {
    shaftHex: 0x64748b,
    capitalHex: 0x334155,
    accentHex: 0x34d399
  },
  newfoundland: {
    shaftHex: 0xf8fafc,
    capitalHex: 0xdc2626,
    accentHex: 0x0284c7
  },
  greenland: {
    shaftHex: 0xe0f2fe,
    capitalHex: 0x0284c7,
    accentHex: 0xffffff
  },
  reykjavik: {
    shaftHex: 0x334155,
    capitalHex: 0x10b981,
    accentHex: 0xa855f7
  },
  dublin: {
    shaftHex: 0x64748b,
    capitalHex: 0x16a34a,
    accentHex: 0xfacc15
  }
};

export function resolveObstacleStyle(level, obstacleIndex = 0) {
  const total = Math.max(6, level?.obstacleCount || 8);
  const clampedIndex = Math.max(0, obstacleIndex);
  const progressRatio = clampedIndex / Math.max(1, total - 1);

  const originCity = level?.originLandmark || 'london';
  const destinationCity = level?.destinationLandmark || 'paris';

  if (clampedIndex < 2 || progressRatio < 0.34) {
    return {
      phase: 'origin',
      bottomCity: originCity,
      topCity: originCity,
      role: `column:${originCity}`
    };
  }

  if (clampedIndex >= total - 2 || progressRatio >= 0.67) {
    return {
      phase: 'destination',
      bottomCity: destinationCity,
      topCity: destinationCity,
      role: `column:${destinationCity}`
    };
  }

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

function makeMat(color, roughness = 0.45) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    flatShading: true
  });
}

// Columna sencilla y limpia con toque temático (fuste cilíndrico + capitel simple + anillo de acento)
function buildHalfColumn(cityId, isBottom, gapY, gapHeight) {
  const style = COLUMN_STYLES[cityId] || COLUMN_STYLES.london;
  const subGroup = new THREE.Group();

  const shaftMat = makeMat(style.shaftHex, 0.48);
  const capMat = makeMat(style.capitalHex, 0.42);
  const accentMat = makeMat(style.accentHex, 0.38);

  const yEdge = isBottom ? gapY - gapHeight * 0.5 : gapY + gapHeight * 0.5;
  const totalH = isBottom
    ? Math.max(2.0, (yEdge - 0.35) - (CONFIG.floorY - 1.2))
    : 18;
  const dir = isBottom ? 1 : -1;

  // Fuste cilíndrico limpio (estilo clásico original)
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(1.02, 1.02, totalH, 10),
    shaftMat
  );
  body.position.y = yEdge - dir * (0.35 + totalH * 0.5);
  body.castShadow = true;
  body.receiveShadow = true;
  subGroup.add(body);

  // Capitel/remate cilíndrico sencillo junto al hueco
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.24, 1.24, 0.68, 10), capMat);
  cap.position.y = yEdge - dir * 0.35;
  cap.castShadow = true;
  subGroup.add(cap);

  // Anillo fino temático bajo el capitel
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(1.14, 1.14, 0.16, 10), accentMat);
  collar.position.y = yEdge - dir * 0.76;
  subGroup.add(collar);

  return subGroup;
}

export function createObstacleSystem(scene) {
  const group = new THREE.Group();
  scene.add(group);

  const obstacles = [];
  let lastGapY = null;

  function pickGapY(level) {
    const minGapY = -3.6;
    const maxGapY = 4.0;
    const maxStep = Number.isFinite(level?.maxGapStep) ? level.maxGapStep : 4.5;

    if (lastGapY === null) {
      lastGapY = THREE.MathUtils.lerp(-1.4, 1.8, Math.random());
      return lastGapY;
    }

    const low = Math.max(minGapY, lastGapY - maxStep);
    const high = Math.min(maxGapY, lastGapY + maxStep);
    lastGapY = THREE.MathUtils.lerp(low, high, Math.random());
    return lastGapY;
  }

  function spawn(xPos, level, obstacleIndex = 0) {
    const gapHeight = level.gapSize;
    const gapY = pickGapY(level);

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
    lastGapY = null;
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
