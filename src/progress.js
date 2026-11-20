import {
  STORAGE_BESTS_KEY,
  STORAGE_COINS_KEY,
  STORAGE_HANGAR_KEY,
  STORAGE_PROGRESS_KEY
} from './config.js';
import {
  PLANES,
  DEFAULT_PLANE_ID,
  UPGRADE_TYPES,
  MAX_UPGRADE_LEVEL,
  getPlaneConfig,
  getUpgradeCost,
  normalizePlaneUpgrades
} from './planes.js';

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
  return raw ? normalizeBests(safeParse(raw, {})) : {};
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

export function normalizeHangar(data) {
  const validIds = new Set(PLANES.map((p) => p.id));
  const rawUnlocked = Array.isArray(data?.unlockedPlanes) ? data.unlockedPlanes : [];
  const unlockedSet = new Set([DEFAULT_PLANE_ID]);
  for (const id of rawUnlocked) {
    if (validIds.has(id)) unlockedSet.add(id);
  }

  const unlockedPlanes = Array.from(unlockedSet);
  const selectedPlane = unlockedSet.has(data?.selectedPlane)
    ? data.selectedPlane
    : DEFAULT_PLANE_ID;

  const upgrades = {};
  for (const plane of PLANES) {
    upgrades[plane.id] = normalizePlaneUpgrades(data?.upgrades?.[plane.id]);
  }

  return {
    selectedPlane,
    unlockedPlanes,
    upgrades
  };
}

export function loadHangar(storage = globalThis.localStorage) {
  return normalizeHangar(safeParse(readItem(storage, STORAGE_HANGAR_KEY), null));
}

export function saveHangar(hangar, storage = globalThis.localStorage) {
  writeItem(storage, STORAGE_HANGAR_KEY, JSON.stringify(normalizeHangar(hangar)));
}

export function selectPlane(hangar, planeId) {
  const current = normalizeHangar(hangar);
  if (!current.unlockedPlanes.includes(planeId)) return current;
  return {
    ...current,
    selectedPlane: planeId
  };
}

export function unlockPlane(hangar, wallet, planeId) {
  const current = normalizeHangar(hangar);
  const safeWallet = normalizeCoins(wallet);
  const plane = getPlaneConfig(planeId);

  if (!plane || current.unlockedPlanes.includes(plane.id)) {
    return { success: false, hangar: current, wallet: safeWallet };
  }
  if (safeWallet < plane.unlockCost) {
    return { success: false, hangar: current, wallet: safeWallet };
  }

  const nextHangar = {
    ...current,
    selectedPlane: plane.id,
    unlockedPlanes: [...current.unlockedPlanes, plane.id]
  };
  return {
    success: true,
    hangar: nextHangar,
    wallet: safeWallet - plane.unlockCost
  };
}

export function upgradePlaneStat(hangar, wallet, planeId, statKey) {
  const current = normalizeHangar(hangar);
  const safeWallet = normalizeCoins(wallet);

  if (!current.unlockedPlanes.includes(planeId) || !UPGRADE_TYPES.includes(statKey)) {
    return { success: false, hangar: current, wallet: safeWallet };
  }

  const planeUpgrades = current.upgrades[planeId] || normalizePlaneUpgrades(null);
  const currentLvl = planeUpgrades[statKey] || 1;
  if (currentLvl >= MAX_UPGRADE_LEVEL) {
    return { success: false, hangar: current, wallet: safeWallet };
  }

  const cost = getUpgradeCost(currentLvl);
  if (cost === null || safeWallet < cost) {
    return { success: false, hangar: current, wallet: safeWallet };
  }

  const nextHangar = {
    ...current,
    upgrades: {
      ...current.upgrades,
      [planeId]: {
        ...planeUpgrades,
        [statKey]: currentLvl + 1
      }
    }
  };

  return {
    success: true,
    hangar: nextHangar,
    wallet: safeWallet - cost,
    cost
  };
}
