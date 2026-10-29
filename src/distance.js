export const METERS_PER_WORLD_UNIT = 3;

// Metros equivalentes a una tubería. Se usa para migrar los récords antiguos
// (que guardaban el número de obstáculos superados) y para saber si un nivel
// se ha completado.
export const METERS_PER_OBSTACLE = 36;

export function formatDistance(meters) {
  const safeMeters = Number.isFinite(meters) ? Math.max(0, meters) : 0;
  if (safeMeters < 1000) {
    return `${Math.floor(safeMeters)} m`;
  }
  return `${(safeMeters / 1000).toFixed(2)} km`;
}

export function levelDistanceM(level) {
  return level.obstacleCount * METERS_PER_OBSTACLE;
}
