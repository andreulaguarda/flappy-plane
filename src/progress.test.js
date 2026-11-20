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
  saveCoins,
  normalizeHangar,
  loadHangar,
  saveHangar,
  selectPlane,
  unlockPlane
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
    expect(normalizeProgress(null, 20)).toEqual({ unlocked: 1 });
  });

  it('acota el progreso entre 1 y el máximo de 20 niveles', () => {
    expect(normalizeProgress({ unlocked: 0 }, 20)).toEqual({ unlocked: 1 });
    expect(normalizeProgress({ unlocked: 42 }, 20)).toEqual({ unlocked: 20 });
  });
});

describe('unlockNextLevel', () => {
  it('desbloquea el siguiente nivel al completar el actual', () => {
    expect(unlockNextLevel({ unlocked: 1 }, 1, 20)).toEqual({ unlocked: 2 });
  });

  it('no retrocede si ya había más progreso', () => {
    expect(unlockNextLevel({ unlocked: 14 }, 3, 20)).toEqual({ unlocked: 14 });
  });

  it('no salta niveles si se completa uno bloqueado', () => {
    expect(unlockNextLevel({ unlocked: 1 }, 3, 20)).toEqual({ unlocked: 1 });
  });

  it('no pasa del último nivel (20)', () => {
    expect(unlockNextLevel({ unlocked: 20 }, 20, 20)).toEqual({ unlocked: 20 });
  });
});

describe('updateBests', () => {
  it('guarda el récord en kilómetros de un nivel', () => {
    expect(updateBests({}, 2, 1100)).toEqual({ 2: 1100 });
  });

  it('solo reemplaza si mejora', () => {
    expect(updateBests({ 2: 850 }, 2, 420)).toEqual({ 2: 850 });
    expect(updateBests({ 2: 850 }, 2, 1100)).toEqual({ 2: 1100 });
  });

  it('normaliza datos corruptos', () => {
    expect(normalizeBests({ 1: '340', bad: 4, 0: 7, 2: -1 })).toEqual({ 1: 340 });
  });
});

describe('almacenamiento', () => {
  it('guarda y recupera el progreso de la campaña de 20 niveles', () => {
    const storage = createStorage();
    saveProgress({ unlocked: 12 }, storage);
    expect(loadProgress(20, storage)).toEqual({ unlocked: 12 });
  });

  it('guarda y recupera los récords en kilómetros por nivel', () => {
    const storage = createStorage();
    saveBests({ 1: 340, 2: 1100, 15: 4150 }, storage);
    expect(loadBests(storage)).toEqual({ 1: 340, 2: 1100, 15: 4150 });
  });

  it('empieza vacío si no hay récords guardados', () => {
    expect(loadBests(createStorage())).toEqual({});
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

describe('hangar de avionetas', () => {
  it('desbloquea y selecciona por defecto Aero Classic', () => {
    const hangar = normalizeHangar(null);
    expect(hangar.selectedPlane).toBe('aero_classic');
    expect(hangar.unlockedPlanes).toEqual(['aero_classic']);
  });

  it('permite comprar y seleccionar una avioneta nueva con monedas suficientes', () => {
    const initial = normalizeHangar(null);
    const failRes = unlockPlane(initial, 80, 'sky_cub');
    expect(failRes.success).toBe(false);

    const okRes = unlockPlane(initial, 200, 'sky_cub');
    expect(okRes.success).toBe(true);
    expect(okRes.wallet).toBe(50);
    expect(okRes.hangar.selectedPlane).toBe('sky_cub');
    expect(okRes.hangar.unlockedPlanes).toContain('sky_cub');

    const switched = selectPlane(okRes.hangar, 'aero_classic');
    expect(switched.selectedPlane).toBe('aero_classic');
  });

  it('guarda y recupera el estado del hangar en storage', () => {
    const storage = createStorage();
    const res = unlockPlane(loadHangar(storage), 500, 'baron_vintage');
    expect(res.success).toBe(true);
    saveHangar(res.hangar, storage);

    const loaded = loadHangar(storage);
    expect(loaded.selectedPlane).toBe('baron_vintage');
    expect(loaded.unlockedPlanes).toContain('baron_vintage');
  });
});
