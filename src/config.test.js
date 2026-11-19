import { describe, it, expect } from 'vitest';
import {
  LEVELS,
  MAX_LEVEL_DURATION_SEC,
  MAX_LEVEL_KM,
  KM_PER_SECOND,
  getLevel,
  getStageForProgress,
  speedForLevel,
  speedForProgress,
  isLastLevel
} from './config.js';
import { STRINGS } from './strings.js';
import { createLandmark } from './landmarks.js';
import { createStageProp } from './stageProps.js';

describe('LEVELS (Campaña La Vuelta al Mundo en 20 niveles)', () => {
  it('tiene veinte niveles', () => {
    expect(LEVELS).toHaveLength(20);
  });

  it('los ids son consecutivos desde 1 hasta 20', () => {
    LEVELS.forEach((level, index) => {
      expect(level.id).toBe(index + 1);
    });
  });

  it('coincide con los kilómetros reales del itinerario de 20 tramos', () => {
    const expectedKm = [
      340, 1100, 1050, 1120, 1300, 3300, 1650, 1620, 1430, 2400,
      3000, 4100, 2100, 3850, 4150, 1850, 1600, 1400, 1500, 460
    ];
    expect(LEVELS.map((l) => l.distanceKm)).toEqual(expectedKm);
  });

  it('calcula duraciones proporcionales con 120s para el tramo más largo (4150 km)', () => {
    const longest = getLevel(15);
    expect(longest.distanceKm).toBe(MAX_LEVEL_KM);
    expect(longest.durationSec).toBeCloseTo(MAX_LEVEL_DURATION_SEC, 5);

    for (const level of LEVELS) {
      expect(level.distanceKm / level.durationSec).toBeCloseTo(KM_PER_SECOND, 5);
    }
  });

  it('encadena el hito de destino de cada nivel con el hito de salida del siguiente', () => {
    for (let i = 0; i < LEVELS.length - 1; i++) {
      expect(LEVELS[i].destinationLandmark).toBe(LEVELS[i + 1].originLandmark);
    }
    // El nivel 20 regresa a Londres cerrando la vuelta al mundo
    expect(LEVELS[LEVELS.length - 1].destinationLandmark).toBe(LEVELS[0].originLandmark);
  });

  it('cada nivel tiene etapas visuales encadenadas ordenadas de 0 a 1', () => {
    for (const level of LEVELS) {
      expect(level.stages.length).toBeGreaterThanOrEqual(3);
      expect(level.stages[0].at).toBe(0);
      for (let i = 1; i < level.stages.length; i++) {
        expect(level.stages[i].at).toBeGreaterThan(level.stages[i - 1].at);
        expect(level.stages[i].at).toBeLessThan(1);
      }
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

  it('construye los monumentos 3D de origen y destino y los props de cada etapa sin errores', () => {
    const testedLandmarks = new Set();
    const testedProps = new Set();

    for (const level of LEVELS) {
      for (const id of [level.originLandmark, level.destinationLandmark]) {
        if (!testedLandmarks.has(id)) {
          const landmark = createLandmark(id);
          expect(landmark.children.length).toBeGreaterThan(0);
          testedLandmarks.add(id);
        }
      }

      for (const stage of level.stages) {
        for (const propType of stage.propTypes) {
          if (!testedProps.has(propType)) {
            const prop = createStageProp(propType);
            expect(prop.children.length).toBeGreaterThan(0);
            testedProps.add(propType);
          }
        }
      }
    }

    expect(testedLandmarks.size).toBe(20);
  });
});

describe('getStageForProgress', () => {
  it('selecciona la etapa correspondiente según el porcentaje de kilómetros recorridos', () => {
    const level1 = getLevel(1);
    expect(getStageForProgress(level1, 0).id).toBe('english_countryside');
    expect(getStageForProgress(level1, 0.45).id).toBe('english_channel');
    expect(getStageForProgress(level1, 0.7).id).toBe('french_countryside');
    expect(getStageForProgress(level1, 0.95).id).toBe('paris_entry');
  });
});

describe('getLevel', () => {
  it('devuelve el nivel por id', () => {
    expect(getLevel(14).id).toBe(14);
  });

  it('cae al nivel 1 con un id desconocido', () => {
    expect(getLevel(99).id).toBe(1);
  });
});

describe('speedForLevel y speedForProgress', () => {
  const level = LEVELS[0];

  it('empieza en la velocidad inicial del nivel', () => {
    expect(speedForLevel(level, 0)).toBe(level.speedStart);
    expect(speedForProgress(level, 0)).toBe(level.speedStart);
  });

  it('termina en la velocidad final del nivel', () => {
    expect(speedForLevel(level, level.obstacleCount)).toBe(level.speedEnd);
    expect(speedForProgress(level, 1)).toBe(level.speedEnd);
  });

  it('no se sale del rango del nivel', () => {
    expect(speedForLevel(level, 999)).toBe(level.speedEnd);
    expect(speedForLevel(level, -5)).toBe(level.speedStart);
    expect(speedForProgress(level, 4)).toBe(level.speedEnd);
    expect(speedForProgress(level, -1)).toBe(level.speedStart);
  });
});

describe('isLastLevel', () => {
  it('detecta el nivel 20 como último nivel', () => {
    expect(isLastLevel(20)).toBe(true);
    expect(isLastLevel(19)).toBe(false);
    expect(isLastLevel(5)).toBe(false);
  });
});
