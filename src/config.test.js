import { describe, it, expect } from 'vitest';
import { LEVELS, getLevel, speedForLevel, isLastLevel } from './config.js';
import { STRINGS } from './strings.js';

describe('LEVELS', () => {
  it('tiene cinco niveles', () => {
    expect(LEVELS).toHaveLength(5);
  });

  it('los ids son consecutivos desde 1', () => {
    LEVELS.forEach((level, index) => {
      expect(level.id).toBe(index + 1);
    });
  });

  it('cada nivel tiene 30 obstáculos', () => {
    for (const level of LEVELS) {
      expect(level.obstacleCount).toBe(30);
    }
  });

  it('la velocidad final es mayor que la inicial', () => {
    for (const level of LEVELS) {
      expect(level.speedEnd).toBeGreaterThan(level.speedStart);
    }
  });

  it('la dificultad crece entre niveles', () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].speedStart).toBeGreaterThan(LEVELS[i - 1].speedStart);
      expect(LEVELS[i].gapSize).toBeLessThan(LEVELS[i - 1].gapSize);
    }
  });

  it('cada nivel tiene tipos de obstáculo válidos', () => {
    const validTypes = ['pipe', 'tower', 'ring', 'storm'];
    for (const level of LEVELS) {
      expect(level.types.length).toBeGreaterThan(0);
      for (const type of level.types) expect(validTypes).toContain(type);
    }
  });

  it('cada nivel tiene un nombre traducido', () => {
    for (const level of LEVELS) {
      expect(STRINGS.en[level.nameKey]).toBeTruthy();
    }
  });
});

describe('getLevel', () => {
  it('devuelve el nivel por id', () => {
    expect(getLevel(3).id).toBe(3);
  });

  it('cae al nivel 1 con un id desconocido', () => {
    expect(getLevel(99).id).toBe(1);
  });
});

describe('speedForLevel', () => {
  const level = LEVELS[0];

  it('empieza en la velocidad inicial del nivel', () => {
    expect(speedForLevel(level, 0)).toBe(level.speedStart);
  });

  it('termina en la velocidad final del nivel', () => {
    expect(speedForLevel(level, level.obstacleCount)).toBe(level.speedEnd);
  });

  it('no se sale del rango del nivel', () => {
    expect(speedForLevel(level, 999)).toBe(level.speedEnd);
    expect(speedForLevel(level, -5)).toBe(level.speedStart);
  });
});

describe('isLastLevel', () => {
  it('detecta el último nivel', () => {
    expect(isLastLevel(5)).toBe(true);
    expect(isLastLevel(4)).toBe(false);
  });
});
