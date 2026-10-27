export function hitsGap(planeX, planeY, radius, obstacleX, halfWidth, gapY, gapHeight) {
  const dx = Math.abs(planeX - obstacleX);
  if (dx >= halfWidth + radius * 0.85) return false;

  const topLimit = gapY + gapHeight * 0.5;
  const botLimit = gapY - gapHeight * 0.5;

  return planeY + radius * 0.82 > topLimit || planeY - radius * 0.82 < botLimit;
}

export function hitsFloor(planeY, radius, floorY) {
  return planeY - radius <= floorY;
}

export function hitsCeiling(planeY, radius, ceilingY) {
  return planeY + radius > ceilingY;
}

export function passedObstacle(planeX, obstacleX, halfWidth) {
  return obstacleX < planeX - halfWidth;
}
