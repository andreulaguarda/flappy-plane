import { describe, it, expect } from 'vitest';
import {
  hitsGap,
  hitsFloor,
  hitsCeiling,
  passedObstacle,
  hitsCoin
} from './collision.js';

describe('hitsGap', () => {
  const radius = 0.5;
  const obstacleX = 0;
  const halfWidth = 1;
  const gapY = 0;
  const gapHeight = 4;

  it('no colisiona en el centro del hueco', () => {
    expect(hitsGap(0, 0, radius, obstacleX, halfWidth, gapY, gapHeight)).toBe(false);
  });

  it('colisiona al superar el borde superior del hueco', () => {
    expect(hitsGap(0, 3, radius, obstacleX, halfWidth, gapY, gapHeight)).toBe(true);
  });

  it('colisiona al superar el borde inferior del hueco', () => {
    expect(hitsGap(0, -3, radius, obstacleX, halfWidth, gapY, gapHeight)).toBe(true);
  });

  it('no colisiona si está lejos horizontalmente', () => {
    expect(hitsGap(10, 3, radius, obstacleX, halfWidth, gapY, gapHeight)).toBe(false);
  });

  it('permite pasar cerca del borde sin tocarlo', () => {
    // topLimit = 2; planeY + radius*0.82 = 1.5 + 0.41 = 1.91 < 2
    expect(hitsGap(0, 1.5, radius, obstacleX, halfWidth, gapY, gapHeight)).toBe(false);
  });

  it('colisiona justo al tocar el borde', () => {
    // topLimit = 2; planeY + radius*0.82 = 1.6 + 0.41 = 2.01 > 2
    expect(hitsGap(0, 1.6, radius, obstacleX, halfWidth, gapY, gapHeight)).toBe(true);
  });
});

describe('hitsFloor y hitsCeiling', () => {
  it('detecta el suelo al tocarlo', () => {
    expect(hitsFloor(-7.3, 0.5, -7.8)).toBe(true);
  });

  it('no detecta el suelo si está por encima', () => {
    expect(hitsFloor(-5, 0.5, -7.8)).toBe(false);
  });

  it('detecta el techo al tocarlo', () => {
    expect(hitsCeiling(8.2, 0.5, 8.6)).toBe(true);
  });

  it('no detecta el techo si está por debajo', () => {
    expect(hitsCeiling(5, 0.5, 8.6)).toBe(false);
  });
});

describe('passedObstacle', () => {
  it('marca superado cuando el obstáculo queda a la izquierda del avión', () => {
    expect(passedObstacle(-4.5, -6, 1)).toBe(true);
  });

  it('no lo marca antes de pasarlo', () => {
    expect(passedObstacle(-4.5, 0, 1)).toBe(false);
  });
});

describe('hitsCoin', () => {
  const radius = 0.5;
  const coinRadius = 0.4;

  it('recoge la moneda al pasar por encima', () => {
    expect(hitsCoin(0, 0, radius, 0, 0, coinRadius)).toBe(true);
  });

  it('la recoge cerca del borde con margen generoso', () => {
    // alcance = 0.5 * 0.85 + 0.4 = 0.825
    expect(hitsCoin(0.8, 0, radius, 0, 0, coinRadius)).toBe(true);
  });

  it('no la recoge si está demasiado lejos', () => {
    expect(hitsCoin(2, 0, radius, 0, 0, coinRadius)).toBe(false);
  });
});
