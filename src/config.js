import { LEVELS, getStageForProgress, getTimeOfDayPhase } from './levels.js';
import {
  MAX_LEVEL_DURATION_SEC,
  MAX_LEVEL_KM,
  KM_PER_SECOND,
  levelDurationSec
} from './distance.js';

export {
  LEVELS,
  getStageForProgress,
  getTimeOfDayPhase,
  MAX_LEVEL_DURATION_SEC,
  MAX_LEVEL_KM,
  KM_PER_SECOND,
  levelDurationSec
};

export const STORAGE_MUTE_KEY = 'flapy_plane_mute_v1';
export const STORAGE_LEGACY_BEST_KEY = 'flapy_plane_best_score_v1';
export const STORAGE_LEGACY_BESTS_KEY = 'flapy_plane_bests_v2';
export const STORAGE_BESTS_KEY = 'flapy_plane_bests_v4';
export const STORAGE_PROGRESS_KEY = 'flapy_plane_progress_v1';
export const STORAGE_COINS_KEY = 'flapy_plane_coins_v1';
export const STORAGE_HANGAR_KEY = 'flapy_plane_hangar_v1';

// Modo testing: permite jugar los 20 niveles desde el principio.
// Poner a false para restaurar el desbloqueo progresivo de la campaña.
export const UNLOCK_ALL_LEVELS = true;

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
  coinRadius: 0.6,
  spawnIntervalDist: 11.2,
  obstacleDespawnX: -24,
  obstacleSpawnX: 28,
  takeoffDuration: 1.75,
  takeoffSpeedStart: 0.55,
  takeoffSpeedRamp: 0.4,
  takeoffRotateAt: 0.32,
  takeoffRotateBlend: 0.18,
  takeoffLiftAt: 0.3,
  takeoffExitY: -2.65,
  takeoffExitVelY: 2.5,
  landingDuration: 2.1,
  landingApproachDistance: 26,
  landingTouchdownAt: 0.7,
  landingSpeedAtTouchdown: 0.88
};

export function getLevel(id) {
  return LEVELS.find((level) => level.id === id) || LEVELS[0];
}

export function speedForLevel(level, score) {
  const total = Math.max(1, level.obstacleCount || 1);
  const ratio = Math.min(1, Math.max(0, score / total));
  return level.speedStart + (level.speedEnd - level.speedStart) * ratio;
}

export function speedForProgress(level, progressRatio) {
  const ratio = Math.min(1, Math.max(0, progressRatio));
  return level.speedStart + (level.speedEnd - level.speedStart) * ratio;
}

export function isLastLevel(id) {
  return id >= LEVELS[LEVELS.length - 1].id;
}
