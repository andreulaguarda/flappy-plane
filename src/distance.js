export const MAX_LEVEL_DURATION_SEC = 120;
export const MAX_LEVEL_KM = 4150;
export const KM_PER_SECOND = MAX_LEVEL_KM / MAX_LEVEL_DURATION_SEC;

export function formatDistance(km) {
  const safeKm = Number.isFinite(km) ? Math.max(0, km) : 0;
  return `${Math.floor(safeKm)} km`;
}

export function levelDistanceKm(level) {
  const km = Number(level?.distanceKm);
  return Number.isFinite(km) && km > 0 ? km : 0;
}

// Alias de compatibilidad: toda la campaña trabaja exclusivamente en kilómetros reales
export function levelDistanceM(level) {
  return levelDistanceKm(level);
}

export function levelDurationSec(level) {
  return (levelDistanceKm(level) / MAX_LEVEL_KM) * MAX_LEVEL_DURATION_SEC;
}
