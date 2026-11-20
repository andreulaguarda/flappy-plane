import { CONFIG } from './config.js';

export const PLANES = [
  {
    id: 'aero_classic',
    nameKey: 'plane1Name',
    descKey: 'plane1Desc',
    unlockCost: 0,
    sizeMultiplier: 1.0,
    magnetRadius: 0,
    coinMultiplier: 1,
    shieldChance: 0,
    badgeColor: '#ef4444'
  },
  {
    id: 'sky_cub',
    nameKey: 'plane2Name',
    descKey: 'plane2Desc',
    unlockCost: 150,
    sizeMultiplier: 0.94,
    magnetRadius: 2.2,
    coinMultiplier: 1,
    shieldChance: 0.1,
    badgeColor: '#facc15'
  },
  {
    id: 'baron_vintage',
    nameKey: 'plane3Name',
    descKey: 'plane3Desc',
    unlockCost: 350,
    sizeMultiplier: 0.9,
    magnetRadius: 3.0,
    coinMultiplier: 2,
    shieldChance: 0.18,
    badgeColor: '#16a34a'
  },
  {
    id: 'bush_scout',
    nameKey: 'plane4Name',
    descKey: 'plane4Desc',
    unlockCost: 650,
    sizeMultiplier: 0.86,
    magnetRadius: 4.0,
    coinMultiplier: 2,
    shieldChance: 0.28,
    badgeColor: '#f97316'
  },
  {
    id: 'island_hopper',
    nameKey: 'plane5Name',
    descKey: 'plane5Desc',
    unlockCost: 1100,
    sizeMultiplier: 0.82,
    magnetRadius: 5.0,
    coinMultiplier: 3,
    shieldChance: 0.38,
    badgeColor: '#06b6d4'
  },
  {
    id: 'apex_racer',
    nameKey: 'plane6Name',
    descKey: 'plane6Desc',
    unlockCost: 1750,
    sizeMultiplier: 0.75,
    magnetRadius: 6.2,
    coinMultiplier: 4,
    shieldChance: 0.5,
    badgeColor: '#a855f7'
  }
];

export const DEFAULT_PLANE_ID = PLANES[0].id;

export function getPlaneConfig(planeId) {
  return PLANES.find((p) => p.id === planeId) || PLANES[0];
}

export function getPlaneStats(planeId) {
  const plane = getPlaneConfig(planeId);
  const sizeMultiplier = Number(plane.sizeMultiplier.toFixed(3));
  const hitRadius = Number((CONFIG.planeRadius * sizeMultiplier).toFixed(3));

  return {
    planeId: plane.id,
    sizeMultiplier,
    hitRadius,
    magnetRadius: plane.magnetRadius,
    coinMultiplier: plane.coinMultiplier,
    shieldChance: plane.shieldChance
  };
}
