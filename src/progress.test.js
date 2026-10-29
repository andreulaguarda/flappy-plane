import { describe, it, expect } from 'vitest';
import {
  normalizeProgress,
  normalizeBests,
  unlockNextLevel,
  updateBests,
  loadProgress,
  saveProgress,
  loadBests,
  saveBests
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

  it('recupera el récord antiguo como nivel 1', () => {
    const storage = createStorage({ flapy_plane_best_score_v1: '14' });
    expect(loadBests(storage)).toEqual({ 1: 14 });
  });

  it('guarda y recupera los récords por nivel', () => {
    const storage = createStorage();
    saveBests({ 1: 30, 2: 12 }, storage);
    expect(loadBests(storage)).toEqual({ 1: 30, 2: 12 });
  });
});
