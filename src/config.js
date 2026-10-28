export const STORAGE_BEST_KEY = 'flapy_plane_best_score_v1';
export const STORAGE_MUTE_KEY = 'flapy_plane_mute_v1';

export const STATE = {
  TAKEOFF: 'TAKEOFF',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAMEOVER: 'GAMEOVER'
};

export const CONFIG = {
  gravity: -28.5,
  jumpImpulse: 10.6,
  maxFallSpeed: -16.5,
  maxRiseSpeed: 12.5,
  ceilingY: 8.6,
  floorY: -7.8,
  planeRadius: 0.68,
  baseSpeed: 8.4,
  maxSpeed: 14.5,
  spawnIntervalDist: 11.2,
  obstacleDespawnX: -24,
  obstacleSpawnX: 28,
  speedGainPerPoint: 0.14
};

export const PHASES = [
  {
    id: 1,
    minScore: 0,
    name: 'FASE 1: TUBERÍAS',
    bannerSub: 'ZONA INICIAL',
    bannerTitle: 'FASE 1: VALLE DE TUBERÍAS',
    dotColor: '#4ade80',
    skyHex: 0x38bdf8,
    fogHex: 0xbae6fd,
    lightColor: 0xfffbeb,
    gapSize: 4.9,
    types: ['pipe']
  },
  {
    id: 2,
    minScore: 6,
    name: 'FASE 2: CIUDAD',
    bannerSub: '¡NUEVA ZONA DESBLOQUEADA!',
    bannerTitle: 'FASE 2: TORRES DE CIUDAD',
    dotColor: '#facc15',
    skyHex: 0xf59e0b,
    fogHex: 0xfde68a,
    lightColor: 0xffedd5,
    gapSize: 4.65,
    types: ['tower']
  },
  {
    id: 3,
    minScore: 13,
    name: 'FASE 3: ANILLOS',
    bannerSub: '¡ACROBACIA AÉREA!',
    bannerTitle: 'FASE 3: ANILLOS DORADOS',
    dotColor: '#38bdf8',
    skyHex: 0x6366f1,
    fogHex: 0xc7d2fe,
    lightColor: 0xe0e7ff,
    gapSize: 4.5,
    types: ['ring']
  },
  {
    id: 4,
    minScore: 21,
    name: 'FASE 4: TORMENTA',
    bannerSub: '¡PELIGRO METEOROLÓGICO!',
    bannerTitle: 'FASE 4: PICOS Y TORMENTA',
    dotColor: '#c084fc',
    skyHex: 0x1e1b4b,
    fogHex: 0x4c1d95,
    lightColor: 0xd8b4fe,
    gapSize: 4.35,
    types: ['storm']
  },
  {
    id: 5,
    minScore: 30,
    name: 'FASE 5: CAOS TOTAL',
    bannerSub: '¡NIVEL MAESTRO!',
    bannerTitle: 'FASE 5: MEZCLA EXTREMA',
    dotColor: '#f43f5e',
    skyHex: 0x0f172a,
    fogHex: 0x334155,
    lightColor: 0xfda4af,
    gapSize: 4.2,
    types: ['pipe', 'tower', 'ring', 'storm']
  }
];

export function getPhaseForScore(score) {
  let current = PHASES[0];
  for (const phase of PHASES) {
    if (score >= phase.minScore) current = phase;
  }
  return current;
}

export function speedForScore(score, config = CONFIG) {
  return Math.min(config.maxSpeed, config.baseSpeed + score * config.speedGainPerPoint);
}
