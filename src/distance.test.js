import { describe, it, expect } from 'vitest';
import {
  MAX_LEVEL_DURATION_SEC,
  MAX_LEVEL_KM,
  KM_PER_SECOND,
  formatDistance,
  levelDistanceKm,
  levelDurationSec
} from './distance.js';

describe('formatDistance', () => {
  it('muestra siempre kilómetros enteros sin metros', () => {
    expect(formatDistance(0)).toBe('0 km');
    expect(formatDistance(42.9)).toBe('42 km');
    expect(formatDistance(340)).toBe('340 km');
    expect(formatDistance(4150)).toBe('4150 km');
  });

  it('protege contra valores no válidos o negativos', () => {
    expect(formatDistance(-20)).toBe('0 km');
    expect(formatDistance(Number.NaN)).toBe('0 km');
    expect(formatDistance(null)).toBe('0 km');
  });
});

describe('levelDistanceKm y levelDurationSec', () => {
  it('devuelve los kilómetros reales del nivel', () => {
    expect(levelDistanceKm({ distanceKm: 340 })).toBe(340);
    expect(levelDistanceKm({ distanceKm: 4150 })).toBe(4150);
  });

  it('asigna 120 segundos al nivel más largo (4150 km)', () => {
    expect(levelDurationSec({ distanceKm: MAX_LEVEL_KM })).toBe(MAX_LEVEL_DURATION_SEC);
  });

  it('calcula duraciones proporcionales manteniendo km/s constante', () => {
    const londonParis = { distanceKm: 340 };
    const parisRome = { distanceKm: 1100 };
    expect(levelDurationSec(londonParis)).toBeCloseTo(340 / KM_PER_SECOND, 5);
    expect(levelDurationSec(parisRome)).toBeCloseTo(1100 / KM_PER_SECOND, 5);
  });
});
