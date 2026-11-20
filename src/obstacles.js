import * as THREE from 'three';
import { CONFIG } from './config.js';

// Cada ciudad define una columna con silueta, proporciones, basa, capitel,
// acanalado y remate propios. La paleta es solo una parte del estilo.
export const COLUMN_STYLES = {
  london: {
    shaftHex: 0xd6c7a9,
    secondaryHex: 0xb91c1c,
    capHex: 0x1e293b,
    accentHex: 0xfacc15,
    sides: 8,
    rGap: 0.98,
    rBase: 1.08,
    flutes: 0,
    capital: 'gothic',
    base: 'plinth',
    band: 'ring',
    bandCount: 1,
    emblem: 'clock',
    emblemOffset: 0.3,
    emblemRadius: 1.16,
    capitalH: 1.0,
    baseH: 0.6
  },
  paris: {
    shaftHex: 0x9a714c,
    secondaryHex: 0x6e4f32,
    capHex: 0xeaddc5,
    accentHex: 0xfacc15,
    sides: 4,
    rGap: 1.0,
    rBase: 1.2,
    flutes: 4,
    capital: 'iron_gallery',
    base: 'plinth',
    band: 'lattice',
    bandCount: 2,
    emblem: 'fleur',
    emblemOffset: 0.45,
    emblemRadius: 1.12,
    capitalH: 0.95,
    baseH: 0.6
  },
  rome: {
    shaftHex: 0xd6b88d,
    secondaryHex: 0xa68963,
    capHex: 0xc2410c,
    accentHex: 0xf8fafc,
    sides: 12,
    rGap: 0.98,
    rBase: 1.06,
    flutes: 8,
    capital: 'corinthian',
    base: 'plinth',
    band: 'ring',
    bandCount: 1,
    emblem: 'laurel',
    emblemOffset: 0.5,
    emblemRadius: 1.02,
    capitalH: 1.0,
    baseH: 0.6
  },
  athens: {
    shaftHex: 0xe2e8f0,
    secondaryHex: 0xf8fafc,
    capHex: 0xf8fafc,
    accentHex: 0x0284c7,
    sides: 10,
    rGap: 1.0,
    rBase: 1.06,
    flutes: 8,
    capital: 'doric',
    base: 'stepped',
    band: 'none',
    bandCount: 0,
    emblem: 'meander',
    emblemOffset: 0.3,
    emblemRadius: 1.17,
    capitalH: 0.78,
    baseH: 0.55
  },
  cairo: {
    shaftHex: 0xd97706,
    secondaryHex: 0xb45309,
    capHex: 0xfacc15,
    accentHex: 0x06b6d4,
    sides: 4,
    rGap: 1.08,
    rBase: 1.32,
    flutes: 0,
    capital: 'obelisk',
    base: 'stepped',
    band: 'none',
    bandCount: 0,
    emblem: 'sun',
    emblemOffset: 0.55,
    emblemRadius: 1.22,
    capitalH: 0.85,
    baseH: 0.7
  },
  baghdad: {
    shaftHex: 0xeab308,
    secondaryHex: 0xb45309,
    capHex: 0xfacc15,
    accentHex: 0x06b6d4,
    sides: 10,
    rGap: 0.92,
    rBase: 1.0,
    flutes: 0,
    capital: 'muqarnas',
    base: 'octagon',
    band: 'mosaic',
    bandCount: 2,
    emblem: 'crescent',
    emblemOffset: 0.5,
    emblemRadius: 1.12,
    capitalH: 0.95,
    baseH: 0.6
  },
  bombay: {
    shaftHex: 0xd97706,
    secondaryHex: 0x9a3412,
    capHex: 0xfef3c7,
    accentHex: 0xfacc15,
    sides: 8,
    rGap: 0.96,
    rBase: 1.12,
    flutes: 4,
    capital: 'muqarnas_bulb',
    base: 'lotus',
    band: 'lattice',
    bandCount: 1,
    emblem: 'peacock',
    emblemOffset: 0.5,
    emblemRadius: 1.12,
    capitalH: 1.0,
    baseH: 0.65
  },
  calcutta: {
    shaftHex: 0xe2e8f0,
    secondaryHex: 0xf8fafc,
    capHex: 0xf8fafc,
    accentHex: 0x10b981,
    sides: 12,
    rGap: 1.0,
    rBase: 1.06,
    flutes: 8,
    capital: 'ionic',
    base: 'plinth',
    band: 'ring',
    bandCount: 1,
    emblem: 'urn',
    emblemOffset: 0.42,
    emblemRadius: 1.05,
    capitalH: 0.95,
    baseH: 0.6
  },
  bangkok: {
    shaftHex: 0xfef3c7,
    secondaryHex: 0x10b981,
    capHex: 0xdc2626,
    accentHex: 0xfacc15,
    sides: 8,
    rGap: 0.95,
    rBase: 1.1,
    flutes: 0,
    capital: 'lotus',
    base: 'lotus',
    band: 'drum',
    bandCount: 2,
    emblem: 'lotus',
    emblemOffset: 0.5,
    emblemRadius: 1.05,
    capitalH: 1.0,
    baseH: 0.65
  },
  singapore: {
    shaftHex: 0x0284c7,
    secondaryHex: 0x0369a1,
    capHex: 0xe2e8f0,
    accentHex: 0x22d3ee,
    sides: 8,
    rGap: 0.98,
    rBase: 1.12,
    flutes: 8,
    capital: 'deco_stepped',
    base: 'stepped',
    band: 'diamond',
    bandCount: 1,
    emblem: 'star',
    emblemOffset: 0.5,
    emblemRadius: 1.08,
    capitalH: 0.95,
    baseH: 0.6
  },
  manila: {
    shaftHex: 0x94a3b8,
    secondaryHex: 0xfef3c7,
    capHex: 0xc2410c,
    accentHex: 0xfacc15,
    sides: 8,
    rGap: 1.05,
    rBase: 1.18,
    flutes: 4,
    capital: 'baroque',
    base: 'plinth',
    band: 'ring',
    bandCount: 2,
    emblem: 'pineapple',
    emblemOffset: 0.5,
    emblemRadius: 1.13,
    capitalH: 1.0,
    baseH: 0.65
  },
  tokyo: {
    shaftHex: 0xef4444,
    secondaryHex: 0xf8fafc,
    capHex: 0x1e293b,
    accentHex: 0xfacc15,
    sides: 10,
    rGap: 0.95,
    rBase: 1.05,
    flutes: 0,
    capital: 'torii',
    base: 'plinth',
    band: 'drum',
    bandCount: 1,
    emblem: 'sakura',
    emblemOffset: 0.5,
    emblemRadius: 1.16,
    capitalH: 1.0,
    baseH: 0.55
  },
  midway: {
    shaftHex: 0xfef3c7,
    secondaryHex: 0x0284c7,
    capHex: 0xf97316,
    accentHex: 0x22d3ee,
    sides: 10,
    rGap: 0.92,
    rBase: 1.1,
    flutes: 0,
    capital: 'beacon',
    base: 'plinth',
    band: 'stripe',
    bandCount: 2,
    emblem: 'beacon',
    emblemOffset: 0.5,
    emblemRadius: 0.62,
    capitalH: 1.1,
    baseH: 0.55
  },
  honolulu: {
    shaftHex: 0x78350f,
    secondaryHex: 0x334155,
    capHex: 0xf97316,
    accentHex: 0xfacc15,
    sides: 6,
    rGap: 1.02,
    rBase: 1.16,
    flutes: 0,
    capital: 'tiki',
    base: 'rock',
    band: 'ring',
    bandCount: 1,
    emblem: 'volcano',
    emblemOffset: 0.55,
    emblemRadius: 1.2,
    capitalH: 1.0,
    baseH: 0.6
  },
  san_francisco: {
    shaftHex: 0xdc2626,
    secondaryHex: 0x991b1b,
    capHex: 0xcbd5e1,
    accentHex: 0xf8fafc,
    sides: 4,
    rGap: 1.0,
    rBase: 1.2,
    flutes: 4,
    capital: 'bridge',
    base: 'plinth',
    band: 'lattice',
    bandCount: 2,
    emblem: 'arch',
    emblemOffset: 0.5,
    emblemRadius: 1.16,
    capitalH: 1.0,
    baseH: 0.6
  },
  new_york: {
    shaftHex: 0x475569,
    secondaryHex: 0x334155,
    capHex: 0x1e293b,
    accentHex: 0x34d399,
    sides: 8,
    rGap: 0.95,
    rBase: 1.1,
    flutes: 8,
    capital: 'deco_spire',
    base: 'stepped',
    band: 'chevron',
    bandCount: 1,
    emblem: 'chevron',
    emblemOffset: 0.5,
    emblemRadius: 1.08,
    capitalH: 1.05,
    baseH: 0.6
  },
  newfoundland: {
    shaftHex: 0xf8fafc,
    secondaryHex: 0xdc2626,
    capHex: 0x0284c7,
    accentHex: 0xeab308,
    sides: 8,
    rGap: 0.98,
    rBase: 1.1,
    flutes: 0,
    capital: 'beacon_fog',
    base: 'plinth',
    band: 'stripe',
    bandCount: 2,
    emblem: 'wave',
    emblemOffset: 0.55,
    emblemRadius: 0.62,
    capitalH: 1.05,
    baseH: 0.55
  },
  greenland: {
    shaftHex: 0xbae6fd,
    secondaryHex: 0x38bdf8,
    capHex: 0xf8fafc,
    accentHex: 0x0284c7,
    sides: 6,
    rGap: 0.95,
    rBase: 1.15,
    flutes: 0,
    capital: 'ice',
    base: 'rock',
    band: 'snow',
    bandCount: 2,
    emblem: 'ice',
    emblemOffset: 0.55,
    emblemRadius: 1.05,
    capitalH: 1.0,
    baseH: 0.65
  },
  reykjavik: {
    shaftHex: 0x1e293b,
    secondaryHex: 0x334155,
    capHex: 0xf1f5f9,
    accentHex: 0x10b981,
    sides: 6,
    rGap: 1.0,
    rBase: 1.12,
    flutes: 0,
    capital: 'volcanic',
    base: 'rock',
    band: 'drum',
    bandCount: 1,
    emblem: 'rune',
    emblemOffset: 0.55,
    emblemRadius: 1.16,
    capitalH: 1.0,
    baseH: 0.65
  },
  dublin: {
    shaftHex: 0x64748b,
    secondaryHex: 0x9a3412,
    capHex: 0x334155,
    accentHex: 0x16a34a,
    sides: 8,
    rGap: 0.98,
    rBase: 1.08,
    flutes: 4,
    capital: 'celtic',
    base: 'plinth',
    band: 'ring',
    bandCount: 1,
    emblem: 'knot',
    emblemOffset: 0.5,
    emblemRadius: 1.1,
    capitalH: 1.0,
    baseH: 0.6
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

function makeMat(color, roughness = 0.6, extra = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    flatShading: true,
    ...extra
  });
}

const materialCache = new Map();

function getMaterials(cityId, style) {
  if (materialCache.has(cityId)) return materialCache.get(cityId);

  const mats = {
    shaft: makeMat(style.shaftHex, 0.62),
    secondary: makeMat(style.secondaryHex, 0.58),
    cap: makeMat(style.capHex, 0.5),
    accent: makeMat(style.accentHex, 0.4, { metalness: 0.15 }),
    flute: makeMat(style.secondaryHex, 0.6),
    lamp: makeMat(0xfff7d6, 0.25, { emissive: 0xf59e0b, emissiveIntensity: 1.2 }),
    lava: makeMat(0xf97316, 0.35, { emissive: 0x7c2d12, emissiveIntensity: 0.6 })
  };

  materialCache.set(cityId, mats);
  return mats;
}

function buildShaft(style, isBottom, yEdge, dir, shaftH, mats) {
  const rGap = style.rGap;
  const rBase = style.rBase ?? rGap;
  const rTop = style.rTop ?? rGap * 0.96;
  const radiusTop = isBottom ? rGap : rTop;
  const radiusBottom = isBottom ? rBase : rGap;
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, shaftH, style.sides),
    mats.shaft
  );
  if (style.sides === 4) shaft.rotation.y = Math.PI / 4;
  shaft.position.y = yEdge - dir * (style.capitalH + shaftH * 0.5);
  shaft.castShadow = true;
  shaft.receiveShadow = true;
  return shaft;
}

function buildFlutes(style, isBottom, yEdge, dir, shaftH, mats) {
  const group = new THREE.Group();
  const count = style.flutes || 0;
  if (count <= 0) return group;

  const rGap = style.rGap;
  const rBase = isBottom ? (style.rBase ?? rGap) : (style.rTop ?? rGap * 0.96);
  const avgRadius = (rGap + rBase) * 0.5;
  const radius = style.sides === 4 ? avgRadius * Math.cos(Math.PI / 4) : avgRadius;
  const fluteH = Math.max(0.8, shaftH - 0.35);
  const centerY = yEdge - dir * (style.capitalH + shaftH * 0.5);

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const rib = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, fluteH, 0.12),
      mats.flute
    );
    rib.position.set(Math.cos(angle) * radius, centerY, Math.sin(angle) * radius);
    rib.rotation.y = -angle;
    group.add(rib);
  }
  return group;
}

function buildBand(style, radius, y, mats, index) {
  const group = new THREE.Group();
  const sides = style.sides;
  const rotY = sides === 4 ? Math.PI / 4 : 0;

  switch (style.band) {
    case 'stripe': {
      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(radius + 0.06, radius + 0.06, 0.42, sides),
        index % 2 === 0 ? mats.secondary : mats.accent
      );
      ring.rotation.y = rotY;
      ring.position.y = y;
      group.add(ring);
      break;
    }
    case 'lattice': {
      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(radius + 0.05, radius + 0.05, 0.18, sides),
        mats.secondary
      );
      ring.rotation.y = rotY;
      ring.position.y = y;
      const trim = new THREE.Mesh(
        new THREE.CylinderGeometry(radius + 0.08, radius + 0.08, 0.05, sides),
        mats.accent
      );
      trim.rotation.y = rotY;
      trim.position.y = y + 0.11;
      group.add(ring, trim);
      break;
    }
    case 'mosaic': {
      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(radius + 0.05, radius + 0.05, 0.2, sides),
        mats.accent
      );
      ring.rotation.y = rotY;
      ring.position.y = y;
      group.add(ring);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const diamond = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 0.1, 0.06),
          mats.secondary
        );
        diamond.position.set(
          Math.cos(a) * (radius + 0.11),
          y,
          Math.sin(a) * (radius + 0.11)
        );
        diamond.rotation.y = -a;
        diamond.rotation.z = Math.PI / 4;
        group.add(diamond);
      }
      break;
    }
    case 'snow': {
      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(radius + 0.06, radius + 0.06, 0.22, sides),
        mats.cap
      );
      ring.rotation.y = rotY;
      ring.position.y = y;
      group.add(ring);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const spike = new THREE.Mesh(
          new THREE.ConeGeometry(0.07, 0.22, 4),
          mats.secondary
        );
        spike.position.set(
          Math.cos(a) * (radius + 0.12),
          y,
          Math.sin(a) * (radius + 0.12)
        );
        spike.rotation.z = Math.PI / 2;
        spike.rotation.y = -a;
        group.add(spike);
      }
      break;
    }
    case 'diamond': {
      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(radius + 0.04, radius + 0.04, 0.12, sides),
        mats.accent
      );
      ring.rotation.y = rotY;
      ring.position.y = y;
      group.add(ring);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const diamond = new THREE.Mesh(
          new THREE.BoxGeometry(0.14, 0.14, 0.05),
          mats.cap
        );
        diamond.position.set(
          Math.cos(a) * (radius + 0.08),
          y,
          Math.sin(a) * (radius + 0.08)
        );
        diamond.rotation.y = -a;
        diamond.rotation.z = Math.PI / 4;
        group.add(diamond);
      }
      break;
    }
    case 'chevron': {
      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(radius + 0.04, radius + 0.04, 0.12, sides),
        mats.secondary
      );
      ring.rotation.y = rotY;
      ring.position.y = y;
      group.add(ring);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const chevron = new THREE.Mesh(
          new THREE.BoxGeometry(0.26, 0.06, 0.04),
          mats.accent
        );
        chevron.position.set(
          Math.cos(a) * (radius + 0.08),
          y + 0.16,
          Math.sin(a) * (radius + 0.08)
        );
        chevron.rotation.y = -a;
        chevron.rotation.z = 0.5;
        group.add(chevron);
      }
      break;
    }
    case 'drum':
    case 'ring':
    default: {
      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(radius + 0.05, radius + 0.05, 0.18, sides),
        mats.secondary
      );
      ring.rotation.y = rotY;
      ring.position.y = y;
      group.add(ring);
      if (style.band === 'drum') {
        const trim = new THREE.Mesh(
          new THREE.CylinderGeometry(radius + 0.08, radius + 0.08, 0.05, sides),
          mats.accent
        );
        trim.rotation.y = rotY;
        trim.position.y = y + 0.11;
        group.add(trim);
      }
      break;
    }
  }
  return group;
}

function buildBands(style, isBottom, yEdge, dir, shaftH, mats) {
  const group = new THREE.Group();
  const count = style.bandCount || 0;
  if (count <= 0 || style.band === 'none') return group;

  const rGap = style.rGap;
  const rBase = isBottom ? (style.rBase ?? rGap) : (style.rTop ?? rGap * 0.96);
  const avgRadius = (rGap + rBase) * 0.5;
  const positions = count === 1 ? [0.36] : [0.28, 0.62];

  for (let i = 0; i < count; i++) {
    const at = positions[i] ?? 0.36;
    const bandY = yEdge - dir * (style.capitalH + at * shaftH);
    group.add(buildBand(style, avgRadius, bandY, mats, i));
  }
  return group;
}

function buildBase(style, mats) {
  const group = new THREE.Group();
  const baseH = style.baseH ?? 0.6;
  const floorY = CONFIG.floorY;
  const rBase = style.rBase ?? style.rGap;
  const sides = style.sides;
  const rotY = sides === 4 ? Math.PI / 4 : 0;

  switch (style.base) {
    case 'stepped': {
      const lower = new THREE.Mesh(
        new THREE.BoxGeometry(rBase * 2.1, baseH * 0.42, rBase * 2.1),
        mats.cap
      );
      lower.position.y = floorY + baseH * 0.21;
      const upper = new THREE.Mesh(
        new THREE.BoxGeometry(rBase * 1.75, baseH * 0.4, rBase * 1.75),
        mats.secondary
      );
      upper.position.y = floorY + baseH * 0.62;
      const trim = new THREE.Mesh(
        new THREE.CylinderGeometry(rBase * 0.98, rBase * 0.98, baseH * 0.18, sides),
        mats.accent
      );
      trim.rotation.y = rotY;
      trim.position.y = floorY + baseH * 0.9;
      group.add(lower, upper, trim);
      break;
    }
    case 'lotus': {
      const flare = new THREE.Mesh(
        new THREE.CylinderGeometry(rBase * 0.92, rBase * 1.18, baseH * 0.6, sides),
        mats.secondary
      );
      flare.rotation.y = rotY;
      flare.position.y = floorY + baseH * 0.3;
      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(rBase * 1.02, rBase * 1.02, baseH * 0.16, sides),
        mats.accent
      );
      ring.rotation.y = rotY;
      ring.position.y = floorY + baseH * 0.66;
      group.add(flare, ring);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const petal = new THREE.Mesh(
          new THREE.ConeGeometry(0.14, 0.34, 4),
          mats.accent
        );
        petal.position.set(
          Math.cos(a) * rBase * 1.04,
          floorY + baseH * 0.48,
          Math.sin(a) * rBase * 1.04
        );
        petal.rotation.z = Math.cos(a) * 0.45;
        petal.rotation.x = -Math.sin(a) * 0.45;
        group.add(petal);
      }
      break;
    }
    case 'octagon': {
      const lower = new THREE.Mesh(
        new THREE.CylinderGeometry(rBase * 1.15, rBase * 1.3, baseH * 0.55, 8),
        mats.secondary
      );
      lower.position.y = floorY + baseH * 0.275;
      const upper = new THREE.Mesh(
        new THREE.CylinderGeometry(rBase * 0.98, rBase * 1.1, baseH * 0.35, 8),
        mats.cap
      );
      upper.position.y = floorY + baseH * 0.7;
      group.add(lower, upper);
      break;
    }
    case 'rock': {
      const rock = new THREE.Mesh(
        new THREE.CylinderGeometry(rBase, rBase * 1.3, baseH, 6),
        mats.secondary
      );
      rock.rotation.y = 0.35;
      rock.position.y = floorY + baseH * 0.5;
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(rBase * 0.96, rBase * 1.02, baseH * 0.16, 6),
        mats.accent
      );
      cap.rotation.y = 0.35;
      cap.position.y = floorY + baseH * 0.92;
      group.add(rock, cap);
      break;
    }
    case 'plinth':
    default: {
      const plinth = new THREE.Mesh(
        new THREE.BoxGeometry(rBase * 2.1, baseH * 0.55, rBase * 2.1),
        mats.cap
      );
      plinth.position.y = floorY + baseH * 0.275;
      const torus = new THREE.Mesh(
        new THREE.CylinderGeometry(rBase * 1.02, rBase * 1.12, baseH * 0.32, sides),
        mats.secondary
      );
      torus.rotation.y = rotY;
      torus.position.y = floorY + baseH * 0.72;
      group.add(plinth, torus);
      break;
    }
  }
  return group;
}

function addMesh(group, geometry, material, x, y, z, rx = 0, ry = 0, rz = 0) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function buildCapital(style, yEdge, dir, mats) {
  const group = new THREE.Group();
  const y = (offset) => yEdge - dir * offset;

  switch (style.capital) {
    case 'gothic': {
      addMesh(group, new THREE.BoxGeometry(2.3, 0.2, 2.3), mats.cap, 0, y(0.1), 0);
      addMesh(group, new THREE.BoxGeometry(2.12, 0.18, 2.12), mats.secondary, 0, y(0.29), 0);
      addMesh(group, new THREE.CylinderGeometry(1.0, 0.9, 0.42, 8), mats.cap, 0, y(0.55), 0);
      for (const sx of [-0.92, 0.92]) {
        for (const sz of [-0.92, 0.92]) {
          addMesh(group, new THREE.BoxGeometry(0.16, 0.42, 0.16), mats.accent, sx, y(0.34), sz);
          addMesh(group, new THREE.ConeGeometry(0.09, 0.22, 4), mats.accent, sx, y(0.16), sz);
        }
      }
      break;
    }
    case 'doric': {
      addMesh(group, new THREE.BoxGeometry(2.28, 0.22, 2.28), mats.cap, 0, y(0.11), 0);
      addMesh(group, new THREE.CylinderGeometry(1.16, 0.98, 0.34, 10), mats.shaft, 0, y(0.39), 0);
      addMesh(group, new THREE.CylinderGeometry(0.97, 0.97, 0.12, 10), mats.accent, 0, y(0.62), 0);
      break;
    }
    case 'ionic': {
      addMesh(group, new THREE.BoxGeometry(2.3, 0.2, 2.3), mats.cap, 0, y(0.1), 0);
      addMesh(group, new THREE.CylinderGeometry(1.06, 0.92, 0.32, 10), mats.shaft, 0, y(0.36), 0);
      for (const sx of [-1.02, 1.02]) {
        addMesh(
          group,
          new THREE.TorusGeometry(0.22, 0.06, 6, 12),
          mats.accent,
          sx,
          y(0.32),
          0,
          0,
          Math.PI / 2,
          0
        );
      }
      addMesh(group, new THREE.CylinderGeometry(0.95, 0.95, 0.12, 10), mats.secondary, 0, y(0.58), 0);
      break;
    }
    case 'corinthian': {
      addMesh(group, new THREE.BoxGeometry(2.36, 0.22, 2.36), mats.cap, 0, y(0.11), 0);
      addMesh(group, new THREE.CylinderGeometry(1.12, 0.88, 0.5, 12), mats.cap, 0, y(0.47), 0);
      for (let row = 0; row < 2; row++) {
        const radius = row === 0 ? 1.0 : 0.92;
        const offset = row === 0 ? 0.42 : 0.62;
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2 + (row * Math.PI) / 4;
          const leaf = addMesh(
            group,
            new THREE.ConeGeometry(0.15, row === 0 ? 0.34 : 0.3, 5),
            mats.secondary,
            Math.cos(a) * radius,
            y(offset),
            Math.sin(a) * radius
          );
          leaf.rotation.z = Math.cos(a) * 0.35;
          leaf.rotation.x = -Math.sin(a) * 0.35;
        }
      }
      addMesh(group, new THREE.CylinderGeometry(0.9, 0.9, 0.12, 12), mats.accent, 0, y(0.72), 0);
      break;
    }
    case 'lotus': {
      addMesh(group, new THREE.BoxGeometry(2.3, 0.2, 2.3), mats.cap, 0, y(0.1), 0);
      addMesh(group, new THREE.CylinderGeometry(1.2, 0.8, 0.55, 10), mats.cap, 0, y(0.42), 0);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const petal = addMesh(
          group,
          new THREE.ConeGeometry(0.16, 0.45, 4),
          mats.accent,
          Math.cos(a) * 0.95,
          y(0.55),
          Math.sin(a) * 0.95
        );
        petal.rotation.z = Math.cos(a) * 0.5;
        petal.rotation.x = -Math.sin(a) * 0.5;
      }
      addMesh(group, new THREE.CylinderGeometry(0.9, 0.9, 0.12, 10), mats.accent, 0, y(0.74), 0);
      break;
    }
    case 'obelisk': {
      addMesh(group, new THREE.BoxGeometry(2.34, 0.2, 2.34), mats.cap, 0, y(0.1), 0);
      const collar = addMesh(
        group,
        new THREE.CylinderGeometry(1.12, 1.32, 0.42, 4),
        mats.cap,
        0,
        y(0.4),
        0
      );
      collar.rotation.y = Math.PI / 4;
      addMesh(group, new THREE.BoxGeometry(2.2, 0.18, 2.2), mats.accent, 0, y(0.63), 0);
      addMesh(group, new THREE.BoxGeometry(2.05, 0.16, 2.05), mats.secondary, 0, y(0.8), 0);
      break;
    }
    case 'muqarnas':
    case 'muqarnas_bulb': {
      addMesh(group, new THREE.BoxGeometry(2.26, 0.2, 2.26), mats.cap, 0, y(0.1), 0);
      addMesh(group, new THREE.BoxGeometry(2.08, 0.18, 2.08), mats.secondary, 0, y(0.29), 0);
      addMesh(group, new THREE.BoxGeometry(1.82, 0.2, 1.82), mats.cap, 0, y(0.48), 0);
      addMesh(group, new THREE.BoxGeometry(1.54, 0.22, 1.54), mats.secondary, 0, y(0.69), 0);
      if (style.capital === 'muqarnas_bulb') {
        const dome = addMesh(group, new THREE.SphereGeometry(0.52, 10, 8), mats.accent, 0, y(0.86), 0);
        dome.scale.set(1, 0.75, 1);
        addMesh(group, new THREE.ConeGeometry(0.1, 0.28, 6), mats.cap, 0, y(1.08), 0);
      } else {
        addMesh(group, new THREE.SphereGeometry(0.26, 8, 6), mats.accent, 0, y(0.86), 0);
      }
      break;
    }
    case 'torii': {
      addMesh(group, new THREE.BoxGeometry(2.36, 0.28, 2.2), mats.cap, 0, y(0.14), 0);
      addMesh(group, new THREE.BoxGeometry(1.9, 0.2, 1.9), mats.secondary, 0, y(0.38), 0);
      addMesh(group, new THREE.BoxGeometry(2.2, 0.2, 2.02), mats.shaft, 0, y(0.58), 0);
      addMesh(group, new THREE.BoxGeometry(0.34, 0.5, 0.1), mats.accent, 0, y(0.44), 1.0);
      break;
    }
    case 'iron_gallery': {
      addMesh(group, new THREE.BoxGeometry(2.35, 0.2, 2.35), mats.cap, 0, y(0.1), 0);
      addMesh(group, new THREE.BoxGeometry(2.15, 0.22, 2.15), mats.accent, 0, y(0.32), 0);
      addMesh(group, new THREE.BoxGeometry(1.95, 0.2, 1.95), mats.secondary, 0, y(0.55), 0);
      for (const sx of [-0.95, 0.95]) {
        for (const sz of [-0.95, 0.95]) {
          addMesh(group, new THREE.BoxGeometry(0.12, 0.6, 0.12), mats.accent, sx, y(0.4), sz);
        }
      }
      for (const sz of [-1.08, 1.08]) {
        addMesh(
          group,
          new THREE.TorusGeometry(0.45, 0.05, 4, 12, Math.PI),
          mats.accent,
          0,
          y(0.5),
          sz,
          0,
          sz > 0 ? 0 : Math.PI,
          0
        );
      }
      break;
    }
    case 'bridge': {
      addMesh(group, new THREE.BoxGeometry(2.4, 0.22, 2.4), mats.cap, 0, y(0.11), 0);
      addMesh(group, new THREE.BoxGeometry(2.2, 0.25, 2.2), mats.secondary, 0, y(0.36), 0);
      for (const sx of [-0.5, 0.5]) {
        addMesh(
          group,
          new THREE.TorusGeometry(0.4, 0.06, 4, 12, Math.PI),
          mats.accent,
          sx,
          y(0.5),
          1.12
        );
        addMesh(
          group,
          new THREE.TorusGeometry(0.4, 0.06, 4, 12, Math.PI),
          mats.accent,
          sx,
          y(0.5),
          -1.12,
          0,
          Math.PI,
          0
        );
      }
      for (const sx of [-0.9, 0.9]) {
        for (const sz of [-0.9, 0.9]) {
          addMesh(group, new THREE.BoxGeometry(0.14, 0.5, 0.14), mats.accent, sx, y(0.38), sz);
        }
      }
      break;
    }
    case 'deco_stepped':
    case 'deco_spire': {
      addMesh(group, new THREE.BoxGeometry(2.3, 0.2, 2.3), mats.cap, 0, y(0.1), 0);
      addMesh(group, new THREE.BoxGeometry(2.08, 0.24, 2.08), mats.secondary, 0, y(0.32), 0);
      addMesh(group, new THREE.BoxGeometry(1.82, 0.26, 1.82), mats.accent, 0, y(0.57), 0);
      addMesh(group, new THREE.BoxGeometry(1.56, 0.28, 1.56), mats.cap, 0, y(0.84), 0);
      if (style.capital === 'deco_spire') {
        for (const sx of [-0.78, 0.78]) {
          for (const sz of [-0.78, 0.78]) {
            addMesh(group, new THREE.ConeGeometry(0.1, 0.45, 4), mats.accent, sx, y(0.55), sz);
          }
        }
      } else {
        for (const sx of [-0.78, 0.78]) {
          for (const sz of [-0.78, 0.78]) {
            const diamond = addMesh(
              group,
              new THREE.BoxGeometry(0.16, 0.16, 0.06),
              mats.accent,
              sx,
              y(0.5),
              sz
            );
            diamond.rotation.z = Math.PI / 4;
          }
        }
      }
      break;
    }
    case 'beacon':
    case 'beacon_fog': {
      addMesh(group, new THREE.CylinderGeometry(1.35, 1.35, 0.2, 10), mats.cap, 0, y(0.1), 0);
      addMesh(
        group,
        new THREE.TorusGeometry(1.2, 0.04, 4, 12),
        mats.accent,
        0,
        y(0.26),
        0,
        Math.PI / 2,
        0,
        0
      );
      addMesh(group, new THREE.CylinderGeometry(0.55, 0.65, 0.55, 8), mats.lamp, 0, y(0.52), 0);
      addMesh(group, new THREE.ConeGeometry(0.8, 0.35, 8), mats.cap, 0, y(0.88), 0);
      if (style.capital === 'beacon_fog') {
        const horn = addMesh(group, new THREE.ConeGeometry(0.18, 0.5, 6), mats.accent, 0.9, y(0.55), 0);
        horn.rotation.z = -Math.PI / 2;
      }
      break;
    }
    case 'ice': {
      addMesh(group, new THREE.BoxGeometry(2.3, 0.2, 2.3), mats.cap, 0, y(0.1), 0);
      addMesh(group, new THREE.CylinderGeometry(1.25, 1.25, 0.24, 6), mats.secondary, 0, y(0.3), 0);
      addMesh(group, new THREE.CylinderGeometry(1.05, 1.05, 0.24, 6), mats.accent, 0, y(0.52), 0);
      addMesh(group, new THREE.ConeGeometry(0.9, 0.35, 6), mats.cap, 0, y(0.8), 0);
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        addMesh(
          group,
          new THREE.OctahedronGeometry(0.14),
          mats.accent,
          Math.cos(a) * 0.75,
          y(0.72),
          Math.sin(a) * 0.75
        );
      }
      break;
    }
    case 'volcanic': {
      addMesh(group, new THREE.BoxGeometry(2.3, 0.2, 2.3), mats.cap, 0, y(0.1), 0);
      addMesh(group, new THREE.CylinderGeometry(1.2, 1.2, 0.3, 6), mats.secondary, 0, y(0.35), 0);
      addMesh(group, new THREE.CylinderGeometry(1.1, 1.1, 0.12, 6), mats.lava, 0, y(0.52), 0);
      addMesh(group, new THREE.CylinderGeometry(0.95, 1.05, 0.35, 6), mats.cap, 0, y(0.66), 0);
      break;
    }
    case 'celtic': {
      addMesh(group, new THREE.BoxGeometry(2.3, 0.2, 2.3), mats.cap, 0, y(0.1), 0);
      addMesh(group, new THREE.CylinderGeometry(1.1, 0.95, 0.45, 8), mats.secondary, 0, y(0.42), 0);
      for (const sx of [-0.9, 0.9]) {
        for (const sz of [-0.9, 0.9]) {
          addMesh(group, new THREE.BoxGeometry(0.3, 0.35, 0.3), mats.accent, sx, y(0.3), sz);
        }
      }
      addMesh(group, new THREE.CylinderGeometry(0.9, 0.9, 0.1, 8), mats.accent, 0, y(0.66), 0);
      break;
    }
    case 'baroque': {
      addMesh(group, new THREE.BoxGeometry(2.35, 0.22, 2.35), mats.cap, 0, y(0.11), 0);
      addMesh(group, new THREE.BoxGeometry(2.15, 0.2, 2.15), mats.secondary, 0, y(0.32), 0);
      for (const sx of [-0.8, 0.8]) {
        addMesh(
          group,
          new THREE.TorusGeometry(0.3, 0.07, 6, 10, Math.PI),
          mats.accent,
          sx,
          y(0.45),
          1.05,
          0,
          0,
          sx > 0 ? Math.PI / 2 : -Math.PI / 2
        );
      }
      break;
    }
    case 'tiki': {
      addMesh(group, new THREE.CylinderGeometry(1.35, 1.2, 0.3, 8), mats.cap, 0, y(0.15), 0);
      addMesh(group, new THREE.BoxGeometry(0.8, 0.6, 0.5), mats.secondary, 0, y(0.5), 0.9);
      for (const sx of [-0.2, 0.2]) {
        addMesh(group, new THREE.BoxGeometry(0.14, 0.12, 0.05), mats.accent, sx, y(0.42), 1.17);
      }
      addMesh(group, new THREE.BoxGeometry(0.12, 0.18, 0.1), mats.accent, 0, y(0.52), 1.2);
      addMesh(group, new THREE.BoxGeometry(0.3, 0.05, 0.05), mats.accent, 0, y(0.62), 1.17);
      break;
    }
    default: {
      addMesh(group, new THREE.BoxGeometry(2.3, 0.2, 2.3), mats.cap, 0, y(0.1), 0);
      addMesh(group, new THREE.CylinderGeometry(1.0, 0.9, 0.4, style.sides), mats.cap, 0, y(0.45), 0);
      break;
    }
  }

  return group;
}

function buildEmblem(type, mats) {
  const group = new THREE.Group();

  switch (type) {
    case 'clock': {
      addMesh(group, new THREE.CylinderGeometry(0.22, 0.22, 0.06, 12), mats.cap, 0, 0, 0, Math.PI / 2, 0, 0);
      addMesh(group, new THREE.BoxGeometry(0.04, 0.16, 0.02), mats.accent, 0, 0.04, 0.04);
      addMesh(group, new THREE.BoxGeometry(0.12, 0.04, 0.02), mats.accent, 0.04, -0.02, 0.04);
      break;
    }
    case 'fleur': {
      addMesh(group, new THREE.ConeGeometry(0.08, 0.28, 4), mats.accent, 0, 0.04, 0);
      const left = addMesh(group, new THREE.ConeGeometry(0.06, 0.2, 4), mats.accent, -0.1, 0, 0);
      left.rotation.z = 0.5;
      const right = addMesh(group, new THREE.ConeGeometry(0.06, 0.2, 4), mats.accent, 0.1, 0, 0);
      right.rotation.z = -0.5;
      addMesh(group, new THREE.BoxGeometry(0.24, 0.04, 0.04), mats.secondary, 0, -0.1, 0);
      break;
    }
    case 'laurel': {
      addMesh(group, new THREE.TorusGeometry(0.18, 0.03, 4, 10), mats.accent, 0, 0, 0);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        addMesh(
          group,
          new THREE.ConeGeometry(0.035, 0.1, 4),
          mats.secondary,
          Math.cos(a) * 0.2,
          Math.sin(a) * 0.2,
          0.02,
          0,
          0,
          a - Math.PI / 2
        );
      }
      break;
    }
    case 'meander': {
      addMesh(group, new THREE.BoxGeometry(0.5, 0.06, 0.04), mats.accent, 0, -0.2, 0);
      addMesh(group, new THREE.BoxGeometry(0.06, 0.4, 0.04), mats.accent, -0.22, 0, 0);
      addMesh(group, new THREE.BoxGeometry(0.3, 0.06, 0.04), mats.accent, 0.02, 0.2, 0);
      addMesh(group, new THREE.BoxGeometry(0.06, 0.25, 0.04), mats.accent, 0.15, 0.05, 0);
      addMesh(group, new THREE.BoxGeometry(0.18, 0.06, 0.04), mats.accent, 0.06, -0.07, 0);
      break;
    }
    case 'sun': {
      addMesh(group, new THREE.CylinderGeometry(0.18, 0.18, 0.06, 10), mats.cap, 0, 0, 0, Math.PI / 2, 0, 0);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        addMesh(
          group,
          new THREE.ConeGeometry(0.04, 0.12, 4),
          mats.accent,
          Math.cos(a) * 0.25,
          Math.sin(a) * 0.25,
          0,
          0,
          0,
          a - Math.PI / 2
        );
      }
      break;
    }
    case 'crescent': {
      addMesh(
        group,
        new THREE.TorusGeometry(0.18, 0.045, 6, 12, Math.PI * 1.4),
        mats.accent,
        0,
        0,
        0,
        0,
        0,
        -Math.PI * 0.2
      );
      break;
    }
    case 'peacock': {
      addMesh(group, new THREE.SphereGeometry(0.09, 8, 6), mats.secondary, 0, -0.02, 0);
      for (let i = 0; i < 5; i++) {
        const a = Math.PI * 0.2 + (i / 4) * Math.PI * 0.6;
        addMesh(
          group,
          new THREE.ConeGeometry(0.035, 0.22, 4),
          mats.accent,
          Math.cos(a) * 0.12,
          Math.sin(a) * 0.14 + 0.08,
          0.01,
          0,
          0,
          a - Math.PI / 2
        );
      }
      break;
    }
    case 'lotus': {
      addMesh(group, new THREE.SphereGeometry(0.07, 8, 6), mats.accent, 0, 0, 0);
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI * 0.5 + (i / 4) * Math.PI;
        addMesh(
          group,
          new THREE.ConeGeometry(0.05, 0.18, 4),
          mats.secondary,
          Math.cos(a) * 0.12,
          Math.sin(a) * 0.12,
          0,
          0,
          0,
          a - Math.PI / 2
        );
      }
      break;
    }
    case 'urn': {
      addMesh(group, new THREE.CylinderGeometry(0.1, 0.08, 0.16, 8), mats.accent, 0, -0.06, 0);
      addMesh(group, new THREE.SphereGeometry(0.13, 8, 6), mats.accent, 0, 0.08, 0);
      addMesh(group, new THREE.CylinderGeometry(0.08, 0.12, 0.05, 8), mats.secondary, 0, 0.2, 0);
      break;
    }
    case 'sakura': {
      addMesh(group, new THREE.SphereGeometry(0.05, 6, 4), mats.accent, 0, 0, 0);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        addMesh(
          group,
          new THREE.SphereGeometry(0.06, 6, 4),
          mats.secondary,
          Math.cos(a) * 0.1,
          Math.sin(a) * 0.1,
          0
        );
      }
      break;
    }
    case 'beacon': {
      addMesh(group, new THREE.CylinderGeometry(0.1, 0.12, 0.16, 8), mats.lamp, 0, 0, 0);
      addMesh(group, new THREE.ConeGeometry(0.14, 0.1, 8), mats.cap, 0, 0.13, 0);
      break;
    }
    case 'volcano': {
      addMesh(group, new THREE.ConeGeometry(0.18, 0.22, 6), mats.secondary, 0, -0.02, 0);
      addMesh(group, new THREE.ConeGeometry(0.08, 0.08, 6), mats.lava, 0, 0.11, 0);
      break;
    }
    case 'arch': {
      addMesh(group, new THREE.TorusGeometry(0.18, 0.04, 4, 10, Math.PI), mats.accent, 0, 0, 0);
      break;
    }
    case 'chevron': {
      for (let row = 0; row < 2; row++) {
        const yy = row * 0.12 - 0.06;
        const left = addMesh(group, new THREE.BoxGeometry(0.18, 0.05, 0.04), mats.accent, -0.08, yy, 0);
        left.rotation.z = -0.5;
        const right = addMesh(group, new THREE.BoxGeometry(0.18, 0.05, 0.04), mats.accent, 0.08, yy, 0);
        right.rotation.z = 0.5;
      }
      break;
    }
    case 'wave': {
      addMesh(
        group,
        new THREE.TorusGeometry(0.16, 0.035, 4, 10, Math.PI),
        mats.accent,
        0,
        -0.04,
        0,
        0,
        0,
        Math.PI
      );
      addMesh(group, new THREE.TorusGeometry(0.16, 0.035, 4, 10, Math.PI), mats.accent, 0, 0.08, 0);
      break;
    }
    case 'ice': {
      const crystal = addMesh(group, new THREE.OctahedronGeometry(0.18), mats.accent, 0, 0, 0);
      crystal.scale.set(1, 1.4, 0.6);
      break;
    }
    case 'rune': {
      addMesh(group, new THREE.BoxGeometry(0.04, 0.34, 0.04), mats.accent, 0, 0, 0);
      const diag1 = addMesh(group, new THREE.BoxGeometry(0.04, 0.2, 0.04), mats.accent, 0.06, 0.06, 0);
      diag1.rotation.z = -0.6;
      const diag2 = addMesh(group, new THREE.BoxGeometry(0.04, 0.2, 0.04), mats.accent, 0.06, -0.06, 0);
      diag2.rotation.z = 0.6;
      break;
    }
    case 'knot': {
      addMesh(group, new THREE.TorusKnotGeometry(0.15, 0.035, 32, 4, 2, 3), mats.accent, 0, 0, 0);
      break;
    }
    case 'pineapple': {
      const body = addMesh(group, new THREE.SphereGeometry(0.15, 8, 6), mats.accent, 0, 0, 0);
      body.scale.set(1, 1.3, 0.8);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const leaf = addMesh(
          group,
          new THREE.ConeGeometry(0.04, 0.14, 4),
          mats.secondary,
          Math.cos(a) * 0.06,
          0.2,
          Math.sin(a) * 0.06
        );
        leaf.rotation.z = Math.cos(a) * 0.4;
        leaf.rotation.x = -Math.sin(a) * 0.4;
      }
      break;
    }
    case 'star': {
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        addMesh(
          group,
          new THREE.ConeGeometry(0.05, 0.18, 3),
          mats.accent,
          Math.cos(a) * 0.1,
          Math.sin(a) * 0.1,
          0,
          0,
          0,
          a - Math.PI / 2
        );
      }
      break;
    }
    default:
      break;
  }

  return group;
}

function buildHalfColumn(cityId, isBottom, gapY, gapHeight) {
  const style = COLUMN_STYLES[cityId] || COLUMN_STYLES.london;
  const subGroup = new THREE.Group();

  const mats = getMaterials(cityId, style);

  const yEdge = isBottom ? gapY - gapHeight * 0.5 : gapY + gapHeight * 0.5;
  const totalH = isBottom ? Math.max(0.8, yEdge - CONFIG.floorY) : 18;
  const dir = isBottom ? 1 : -1;
  const baseH = isBottom ? (style.baseH ?? 0.6) : 0;
  const capitalH = style.capitalH ?? 0.95;
  const shaftH = Math.max(0.2, totalH - capitalH - baseH);

  subGroup.add(buildShaft(style, isBottom, yEdge, dir, shaftH, mats));
  subGroup.add(buildFlutes(style, isBottom, yEdge, dir, shaftH, mats));
  subGroup.add(buildBands(style, isBottom, yEdge, dir, shaftH, mats));

  if (isBottom) {
    subGroup.add(buildBase(style, mats));
  }

  subGroup.add(buildCapital(style, yEdge, dir, mats));

  const emblem = buildEmblem(style.emblem, mats);
  emblem.position.set(
    0,
    yEdge - dir * (style.emblemOffset ?? 0.5),
    style.emblemRadius ?? 1.05
  );
  subGroup.add(emblem);

  return subGroup;
}

function disposeObstacleMesh(root) {
  root.traverse((child) => {
    if (child.isMesh) child.geometry.dispose();
  });
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
        disposeObstacleMesh(obs.mesh);
        obstacles.splice(i, 1);
      }
    }
  }

  function clear() {
    for (const obs of obstacles) {
      group.remove(obs.mesh);
      disposeObstacleMesh(obs.mesh);
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
