import { describe, it, expect } from 'vitest';
import {
  normalizeProgress,
  normalizeBests,
  unlockNextLevel,
  updateBests,
  loadProgress,
  saveProgress,
  loadBests,
  saveBests,
  normalizeCoins,
  loadCoins,
  saveCoins
} from './progress.js';

function createStorage(entries = {}) {
  return {
    getItem(key) {
      return entries[key] ?? null;
    },
    setItem(key, value) {
      entries[key] = value;
    }
  };
}

describe('normalizeProgress', () => {
  it('empieza en el nivel 1 si no hay datos', () => {
    expect(normalizeProgress(null, 5)).toEqual({ unlocked: 1 });
  });

  it('acota el progreso entre 1 y el máximo', () => {
    expect(normalizeProgress({ unlocked: 0 }, 5)).toEqual({ unlocked: 1 });
    expect(normalizeProgress({ unlocked: 42 }, 5)).toEqual({ unlocked: 5 });
  });
});

describe('unlockNextLevel', () => {
  it('desbloquea el siguiente nivel al completar el actual', () => {
    expect(unlockNextLevel({ unlocked: 1 }, 1, 5)).toEqual({ unlocked: 2 });
  });

  it('no retrocede si ya había más progreso', () => {
    expect(unlockNextLevel({ unlocked: 4 }, 1, 5)).toEqual({ unlocked: 4 });
  });

  it('no salta niveles si se completa uno bloqueado', () => {
    expect(unlockNextLevel({ unlocked: 1 }, 3, 5)).toEqual({ unlocked: 1 });
  });

  it('no pasa del último nivel', () => {
    expect(unlockNextLevel({ unlocked: 5 }, 5, 5)).toEqual({ unlocked: 5 });
  });
});

describe('updateBests', () => {
  it('guarda el récord de un nivel', () => {
    expect(updateBests({}, 2, 12)).toEqual({ 2: 12 });
  });

  it('solo reemplaza si mejora', () => {
    expect(updateBests({ 2: 12 }, 2, 8)).toEqual({ 2: 12 });
    expect(updateBests({ 2: 12 }, 2, 18)).toEqual({ 2: 18 });
  });

  it('normaliza datos corruptos', () => {
    expect(normalizeBests({ 1: '10', bad: 4, 0: 7, 2: -1 })).toEqual({ 1: 10 });
  });
});

describe('almacenamiento', () => {
  it('guarda y recupera el progreso', () => {
    const storage = createStorage();
    saveProgress({ unlocked: 3 }, storage);
    expect(loadProgress(5, storage)).toEqual({ unlocked: 3 });
  });

  it('recupera el récord antiguo como nivel 1 en metros', () => {
    const storage = createStorage({ flapy_plane_best_score_v1: '14' });
    expect(loadBests(storage)).toEqual({ 1: 504 });
  });

  it('migra los récords por nivel de obstáculos a metros', () => {
    const storage = createStorage({
      flapy_plane_bests_v2: JSON.stringify({ 1: 10, 2: 30 })
    });
    expect(loadBests(storage)).toEqual({ 1: 360, 2: 1080 });
  });

  it('prioriza los récords nuevos en metros', () => {
    const storage = createStorage({
      flapy_plane_bests_v3: JSON.stringify({ 1: 950 }),
      flapy_plane_bests_v2: JSON.stringify({ 1: 30 })
    });
    expect(loadBests(storage)).toEqual({ 1: 950 });
  });

  it('guarda y recupera los récords por nivel', () => {
    const storage = createStorage();
    saveBests({ 1: 1080, 2: 420 }, storage);
    expect(loadBests(storage)).toEqual({ 1: 1080, 2: 420 });
  });
});

describe('monedas', () => {
  it('normaliza valores no válidos a cero', () => {
    expect(normalizeCoins(null)).toBe(0);
    expect(normalizeCoins(-4)).toBe(0);
    expect(normalizeCoins('abc')).toBe(0);
  });

  it('redondea hacia abajo y acepta cadenas numéricas', () => {
    expect(normalizeCoins('12.9')).toBe(12);
    expect(normalizeCoins(7)).toBe(7);
  });

  it('guarda y recupera la cartera', () => {
    const storage = createStorage();
    saveCoins(37, storage);
    expect(loadCoins(storage)).toBe(37);
  });

  it('empieza sin monedas si no hay datos', () => {
    expect(loadCoins(createStorage())).toBe(0);
  });
});
