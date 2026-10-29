import {
  STORAGE_BESTS_KEY,
  STORAGE_COINS_KEY,
  STORAGE_LEGACY_BESTS_KEY,
  STORAGE_LEGACY_BEST_KEY,
  STORAGE_PROGRESS_KEY
} from './config.js';
import { METERS_PER_OBSTACLE } from './distance.js';

export function normalizeProgress(data, maxLevel) {
  const unlocked = Number.isFinite(data?.unlocked) ? Math.floor(data.unlocked) : 1;
  return { unlocked: Math.min(maxLevel, Math.max(1, unlocked)) };
}

export function normalizeBests(data) {
  const bests = {};
  if (!data || typeof data !== 'object') return bests;
  for (const [key, value] of Object.entries(data)) {
    const levelId = Number(key);
    const score = Number(value);
    if (Number.isInteger(levelId) && levelId > 0 && Number.isFinite(score) && score > 0) {
      bests[levelId] = Math.floor(score);
    }
  }
  return bests;
}

export function unlockNextLevel(progress, levelId, maxLevel) {
  const current = normalizeProgress(progress, maxLevel);
  if (levelId > current.unlocked) return current;
  return { unlocked: Math.min(maxLevel, Math.max(current.unlocked, levelId + 1)) };
}

export function updateBests(bests, levelId, score) {
  const current = normalizeBests(bests);
  const previous = current[levelId] || 0;
  if (score > previous) {
    current[levelId] = Math.floor(score);
  }
  return current;
}

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function readItem(storage, key) {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function writeItem(storage, key, value) {
  try {
    storage?.setItem(key, value);
  } catch {
    // Almacenamiento no disponible (modo privado, cuota llena...): el juego sigue sin guardar.
  }
}

export function loadProgress(maxLevel, storage = globalThis.localStorage) {
  return normalizeProgress(safeParse(readItem(storage, STORAGE_PROGRESS_KEY), null), maxLevel);
}

export function saveProgress(progress, storage = globalThis.localStorage) {
  writeItem(storage, STORAGE_PROGRESS_KEY, JSON.stringify(progress));
}

export function loadBests(storage = globalThis.localStorage) {
  const raw = readItem(storage, STORAGE_BESTS_KEY);
  if (raw) return normalizeBests(safeParse(raw, {}));

  // Los récords anteriores guardaban tuberías superadas; ahora se guardan metros.
  const legacyBests = normalizeBests(
    safeParse(readItem(storage, STORAGE_LEGACY_BESTS_KEY), null)
  );
  if (Object.keys(legacyBests).length > 0) {
    return convertObstacleBests(legacyBests);
  }

  const legacy = parseInt(readItem(storage, STORAGE_LEGACY_BEST_KEY) || '0', 10);
  return legacy > 0 ? { 1: legacy * METERS_PER_OBSTACLE } : {};
}

function convertObstacleBests(bests) {
  const converted = {};
  for (const [levelId, obstacles] of Object.entries(bests)) {
    converted[levelId] = Math.round(obstacles * METERS_PER_OBSTACLE);
  }
  return converted;
}

export function saveBests(bests, storage = globalThis.localStorage) {
  writeItem(storage, STORAGE_BESTS_KEY, JSON.stringify(bests));
}

export function normalizeCoins(value) {
  const coins = Number(value);
  if (!Number.isFinite(coins) || coins <= 0) return 0;
  return Math.floor(coins);
}

export function loadCoins(storage = globalThis.localStorage) {
  return normalizeCoins(readItem(storage, STORAGE_COINS_KEY));
}

export function saveCoins(coins, storage = globalThis.localStorage) {
  writeItem(storage, STORAGE_COINS_KEY, String(normalizeCoins(coins)));
}
