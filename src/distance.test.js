import { describe, it, expect } from 'vitest';
import { formatDistance, levelDistanceM, METERS_PER_OBSTACLE } from './distance.js';

describe('formatDistance', () => {
  it('muestra metros enteros por debajo de 1000', () => {
    expect(formatDistance(0)).toBe('0 m');
    expect(formatDistance(842.9)).toBe('842 m');
    expect(formatDistance(999.9)).toBe('999 m');
  });

  it('cambia a kilómetros a partir de 1000 metros', () => {
    expect(formatDistance(1000)).toBe('1.00 km');
    expect(formatDistance(1234.5)).toBe('1.23 km');
    expect(formatDistance(1105)).toBe('1.10 km');
  });

  it('protege contra valores no válidos o negativos', () => {
    expect(formatDistance(-20)).toBe('0 m');
    expect(formatDistance(Number.NaN)).toBe('0 m');
  });
});

describe('levelDistanceM', () => {
  it('calcula la distancia de referencia de un nivel', () => {
    expect(levelDistanceM({ obstacleCount: 30 })).toBe(30 * METERS_PER_OBSTACLE);
  });
});
