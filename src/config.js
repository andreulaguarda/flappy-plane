export const STORAGE_MUTE_KEY = 'flapy_plane_mute_v1';
export const STORAGE_LEGACY_BEST_KEY = 'flapy_plane_best_score_v1';
export const STORAGE_BESTS_KEY = 'flapy_plane_bests_v2';
export const STORAGE_PROGRESS_KEY = 'flapy_plane_progress_v1';

export const STATE = {
  MENU: 'MENU',
  TAKEOFF: 'TAKEOFF',
  PLAYING: 'PLAYING',
  LANDING: 'LANDING',
  LEVEL_COMPLETE: 'LEVEL_COMPLETE',
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
  spawnIntervalDist: 11.2,
  obstacleDespawnX: -24,
  obstacleSpawnX: 28,
  takeoffDuration: 2.1,
  landingDuration: 2.1,
  landingApproachDistance: 26
};

export const LEVELS = [
  {
    id: 1,
    nameKey: 'level1Name',
    skyHex: 0x38bdf8,
    fogHex: 0xbae6fd,
    lightColor: 0xfffbeb,
    gapSize: 4.9,
    types: ['pipe'],
    obstacleCount: 30,
    speedStart: 8.4,
    speedEnd: 9.2
  },
  {
    id: 2,
    nameKey: 'level2Name',
    skyHex: 0xf59e0b,
    fogHex: 0xfde68a,
    lightColor: 0xffedd5,
    gapSize: 4.65,
    types: ['tower'],
    obstacleCount: 30,
    speedStart: 9.0,
    speedEnd: 9.8
  },
  {
    id: 3,
    nameKey: 'level3Name',
    skyHex: 0x6366f1,
    fogHex: 0xc7d2fe,
    lightColor: 0xe0e7ff,
    gapSize: 4.5,
    types: ['ring'],
    obstacleCount: 30,
    speedStart: 9.6,
    speedEnd: 10.6
  },
  {
    id: 4,
    nameKey: 'level4Name',
    skyHex: 0x1e1b4b,
    fogHex: 0x4c1d95,
    lightColor: 0xd8b4fe,
    gapSize: 4.35,
    types: ['storm'],
    obstacleCount: 30,
    speedStart: 10.2,
    speedEnd: 11.4
  },
  {
    id: 5,
    nameKey: 'level5Name',
    skyHex: 0x0f172a,
    fogHex: 0x334155,
    lightColor: 0xfda4af,
    gapSize: 4.2,
    types: ['pipe', 'tower', 'ring', 'storm'],
    obstacleCount: 30,
    speedStart: 10.8,
    speedEnd: 12.2
  }
];

export function getLevel(id) {
  return LEVELS.find((level) => level.id === id) || LEVELS[0];
}

export function speedForLevel(level, score) {
  const ratio = Math.min(1, Math.max(0, score / level.obstacleCount));
  return level.speedStart + (level.speedEnd - level.speedStart) * ratio;
}

export function isLastLevel(id) {
  return id >= LEVELS[LEVELS.length - 1].id;
}
