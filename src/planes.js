import { CONFIG } from './config.js';

export const MAX_UPGRADE_LEVEL = 5;

export const UPGRADE_TYPES = ['magnet', 'multiplier', 'shield', 'size', 'weight'];

const UPGRADE_COSTS = [0, 12, 24, 40, 60];

export const PLANES = [
  {
    id: 'atlas_cargo',
    nameKey: 'plane1Name',
    descKey: 'plane1Desc',
    unlockCost: 0,
    baseSize: 1.15,
    baseWeight: 1.14,
    baseMagnet: 0,
    baseMultiplier: 1,
    baseShield: 0.04
  },
  {
    id: 'aero_classic',
    nameKey: 'plane2Name',
    descKey: 'plane2Desc',
    unlockCost: 25,
    baseSize: 1.0,
    baseWeight: 1.0,
    baseMagnet: 0,
    baseMultiplier: 1,
    baseShield: 0.05
  },
  {
    id: 'baron_vintage',
    nameKey: 'plane3Name',
    descKey: 'plane3Desc',
    unlockCost: 50,
    baseSize: 1.04,
    baseWeight: 0.96,
    baseMagnet: 0.4,
    baseMultiplier: 1,
    baseShield: 0.06
  },
  {
    id: 'mule_freighter',
    nameKey: 'plane4Name',
    descKey: 'plane4Desc',
    unlockCost: 80,
    baseSize: 1.07,
    baseWeight: 1.05,
    baseMagnet: 0.8,
    baseMultiplier: 1,
    baseShield: 0.08
  },
  {
    id: 'lagoon_mariner',
    nameKey: 'plane5Name',
    descKey: 'plane5Desc',
    unlockCost: 115,
    baseSize: 1.01,
    baseWeight: 0.97,
    baseMagnet: 0.6,
    baseMultiplier: 1,
    baseShield: 0.09
  },
  {
    id: 'breeze_ultralight',
    nameKey: 'plane6Name',
    descKey: 'plane6Desc',
    unlockCost: 155,
    baseSize: 0.87,
    baseWeight: 0.82,
    baseMagnet: 0.5,
    baseMultiplier: 1,
    baseShield: 0.07
  },
  {
    id: 'sovereign_exec',
    nameKey: 'plane7Name',
    descKey: 'plane7Desc',
    unlockCost: 200,
    baseSize: 0.9,
    baseWeight: 0.9,
    baseMagnet: 1.0,
    baseMultiplier: 1,
    baseShield: 0.1
  },
  {
    id: 'valkyrie_interceptor',
    nameKey: 'plane8Name',
    descKey: 'plane8Desc',
    unlockCost: 260,
    baseSize: 0.84,
    baseWeight: 0.87,
    baseMagnet: 0.8,
    baseMultiplier: 1,
    baseShield: 0.12
  },
  {
    id: 'micro_pulse',
    nameKey: 'plane9Name',
    descKey: 'plane9Desc',
    unlockCost: 330,
    baseSize: 0.76,
    baseWeight: 0.78,
    baseMagnet: 1.2,
    baseMultiplier: 1,
    baseShield: 0.15
  }
];

export const DEFAULT_PLANE_ID = PLANES[0].id;

export function getPlaneConfig(planeId) {
  return PLANES.find((p) => p.id === planeId) || PLANES[0];
}

export function createDefaultUpgrades() {
  return {
    magnet: 1,
    multiplier: 1,
    shield: 1,
    size: 1,
    weight: 1
  };
}

export function normalizePlaneUpgrades(raw) {
  const defaults = createDefaultUpgrades();
  if (!raw || typeof raw !== 'object') return defaults;
  for (const key of UPGRADE_TYPES) {
    const val = Number(raw[key]);
    if (Number.isFinite(val)) {
      defaults[key] = Math.min(MAX_UPGRADE_LEVEL, Math.max(1, Math.floor(val)));
    }
  }
  return defaults;
}

export function getUpgradeCost(currentLevel) {
  const lvl = Math.floor(Number(currentLevel) || 1);
  if (lvl < 1 || lvl >= MAX_UPGRADE_LEVEL) return null;
  return UPGRADE_COSTS[lvl] ?? 60;
}

export function getPlaneStats(planeId, upgradesRaw) {
  const plane = getPlaneConfig(planeId);
  const upgrades = normalizePlaneUpgrades(upgradesRaw);

  // Tamaño: cada nivel de mejora reduce un 3% la escala visual y el radio de colisión
  const sizeReduction = (upgrades.size - 1) * 0.03;
  const sizeMultiplier = Number((plane.baseSize * (1 - sizeReduction)).toFixed(3));
  const hitRadius = Number((CONFIG.planeRadius * sizeMultiplier).toFixed(3));

  // Peso: cada nivel de mejora reduce un 3.5% la gravedad y la velocidad máxima de caída
  const weightReduction = (upgrades.weight - 1) * 0.035;
  const weightMultiplier = Number((plane.baseWeight * (1 - weightReduction)).toFixed(3));
  const gravity = Number((CONFIG.gravity * weightMultiplier).toFixed(2));
  const maxFallSpeed = Number((CONFIG.maxFallSpeed * weightMultiplier).toFixed(2));

  // Imán: radio de atracción automática de monedas
  const magnetBonus = (upgrades.magnet - 1) * 1.45;
  const magnetRadius = Number(
    (upgrades.magnet === 1 ? plane.baseMagnet : Math.max(plane.baseMagnet, 0.6) + magnetBonus).toFixed(2)
  );

  // Multiplicador de monedas (x1 a x5)
  const coinMultiplier = upgrades.multiplier;

  // Probabilidad de escudo de emergencia ante un choque
  const shieldChance = Number(
    Math.min(0.65, plane.baseShield + (upgrades.shield - 1) * 0.11).toFixed(2)
  );

  return {
    planeId: plane.id,
    upgrades,
    sizeMultiplier,
    hitRadius,
    weightMultiplier,
    gravity,
    maxFallSpeed,
    magnetRadius,
    coinMultiplier,
    shieldChance
  };
}
