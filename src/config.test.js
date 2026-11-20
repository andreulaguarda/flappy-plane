import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  LEVELS,
  MAX_LEVEL_DURATION_SEC,
  MAX_LEVEL_KM,
  KM_PER_SECOND,
  getLevel,
  getStageForProgress,
  getTimeOfDayPhase,
  speedForLevel,
  speedForProgress,
  isLastLevel
} from './config.js';
import { STRINGS } from './strings.js';
import { createLandmark } from './landmarks.js';
import { createStageProp } from './stageProps.js';
import {
  COLUMN_STYLES,
  createObstacleSystem,
  resolveObstacleStyle
} from './obstacles.js';
import { PLANES, getPlaneStats } from './planes.js';
import { createPlane } from './plane.js';

const WATER_SURFACES = new Set([
  'sea',
  'mediterranean',
  'arabian_sea',
  'turquoise_sea',
  'deep_pacific',
  'sunset_ocean',
  'north_atlantic'
]);

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
    expect(LEVELS[LEVELS.length - 1].destinationLandmark).toBe(LEVELS[0].originLandmark);
  });

  it('cada nivel despega desde tierra firme y aterriza en tierra firme', () => {
    for (const level of LEVELS) {
      expect(level.stages.length).toBeGreaterThanOrEqual(3);
      const firstStage = level.stages[0];
      const lastStage = level.stages[level.stages.length - 1];
      expect(WATER_SURFACES.has(firstStage.surface)).toBe(false);
      expect(WATER_SURFACES.has(lastStage.surface)).toBe(false);
    }
  });

  it('la velocidad final es mayor que la inicial y la dificultad crece combinando hueco, separación y variación de altura', () => {
    for (const level of LEVELS) {
      expect(level.speedEnd).toBeGreaterThan(level.speedStart);
    }
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].speedStart).toBeGreaterThan(LEVELS[i - 1].speedStart);
      expect(LEVELS[i].gapSize).toBeLessThan(LEVELS[i - 1].gapSize);
      expect(LEVELS[i].spawnIntervalDist).toBeLessThan(LEVELS[i - 1].spawnIntervalDist);
      expect(LEVELS[i].maxGapStep).toBeGreaterThan(LEVELS[i - 1].maxGapStep);
    }
  });

  it('todos los obstáculos son columnas temáticas fijas: origen -> mezcla en mitad -> destino', () => {
    const scene = new THREE.Scene();
    const obstacleSystem = createObstacleSystem(scene);

    for (const level of LEVELS) {
      expect(COLUMN_STYLES[level.originLandmark]).toBeTruthy();
      expect(COLUMN_STYLES[level.destinationLandmark]).toBeTruthy();

      const startStyle = resolveObstacleStyle(level, 0);
      expect(startStyle).toEqual({
        phase: 'origin',
        bottomCity: level.originLandmark,
        topCity: level.originLandmark,
        role: `column:${level.originLandmark}`
      });

      const midIndex = Math.floor(level.obstacleCount * 0.5);
      const midStyle = resolveObstacleStyle(level, midIndex);
      expect(midStyle.phase).toBe('mixed');
      expect([level.originLandmark, level.destinationLandmark]).toContain(midStyle.bottomCity);
      expect([level.originLandmark, level.destinationLandmark]).toContain(midStyle.topCity);

      const endStyle = resolveObstacleStyle(level, level.obstacleCount - 1);
      expect(endStyle).toEqual({
        phase: 'destination',
        bottomCity: level.destinationLandmark,
        topCity: level.destinationLandmark,
        role: `column:${level.destinationLandmark}`
      });

      const obsStart = obstacleSystem.spawn(10, level, 0);
      const obsMid = obstacleSystem.spawn(20, level, midIndex);
      const obsEnd = obstacleSystem.spawn(30, level, level.obstacleCount - 1);
      expect(obsStart.oscillates).toBe(false);
      expect(obsMid.oscillates).toBe(false);
      expect(obsEnd.oscillates).toBe(false);
      expect(obsStart.mesh.children).toHaveLength(2);
      expect(obsMid.mesh.children).toHaveLength(2);
      expect(obsEnd.mesh.children).toHaveLength(2);
      obstacleSystem.clear();
    }
  });

  it('cada nivel tiene un nombre traducido', () => {
    for (const level of LEVELS) {
      expect(STRINGS.en[level.nameKey]).toBeTruthy();
    }
  });

  it('construye los monumentos 3D, edificios de ciudad, granjas y barcos sin errores', () => {
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

describe('getTimeOfDayPhase', () => {
  it('asigna más día (0-45%), más atardecer (45-82%) y menos noche (82-100%)', () => {
    expect(getTimeOfDayPhase(0)).toBe('day');
    expect(getTimeOfDayPhase(0.4)).toBe('day');
    expect(getTimeOfDayPhase(0.48)).toBe('sunset');
    expect(getTimeOfDayPhase(0.75)).toBe('sunset');
    expect(getTimeOfDayPhase(0.85)).toBe('night');
    expect(getTimeOfDayPhase(1)).toBe('night');
  });
});

describe('PLANES (Catálogo de 9 aviones y mejoras)', () => {
  it('define 9 aviones seleccionables con textos traducidos y modelos 3D', () => {
    expect(PLANES).toHaveLength(9);
    expect(PLANES[0].unlockCost).toBe(0);

    const planeCtrl = createPlane();
    for (const plane of PLANES) {
      expect(STRINGS.en[plane.nameKey]).toBeTruthy();
      expect(STRINGS.en[plane.descKey]).toBeTruthy();
      planeCtrl.setModel(plane.id);
      expect(planeCtrl.group.children.length).toBeGreaterThan(0);
    }
  });

  it('mejora los 5 atributos propios de cada avión del nivel 1 al 5', () => {
    const base = getPlaneStats('atlas_cargo', {
      magnet: 1,
      multiplier: 1,
      shield: 1,
      size: 1,
      weight: 1
    });
    const maxed = getPlaneStats('atlas_cargo', {
      magnet: 5,
      multiplier: 5,
      shield: 5,
      size: 5,
      weight: 5
    });

    expect(maxed.hitRadius).toBeLessThan(base.hitRadius);
    expect(maxed.weightMultiplier).toBeLessThan(base.weightMultiplier);
    expect(Math.abs(maxed.gravity)).toBeLessThan(Math.abs(base.gravity));
    expect(maxed.magnetRadius).toBeGreaterThan(base.magnetRadius);
    expect(maxed.coinMultiplier).toBe(5);
    expect(maxed.shieldChance).toBeGreaterThan(base.shieldChance);
  });
});

describe('getStageForProgress', () => {
  it('selecciona la etapa correspondiente según el porcentaje de kilómetros recorridos', () => {
    const level1 = getLevel(1);
    expect(getStageForProgress(level1, 0).id).toBe('london_departure_countryside');
    expect(getStageForProgress(level1, 0.45).id).toBe('english_channel');
    expect(getStageForProgress(level1, 0.65).id).toBe('french_countryside');
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
