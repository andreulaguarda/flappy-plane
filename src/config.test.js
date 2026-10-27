import { describe, it, expect } from 'vitest';
import { PHASES, CONFIG, getPhaseForScore, speedForScore } from './config.js';

describe('getPhaseForScore', () => {
  it('empieza en la fase 1', () => {
    expect(getPhaseForScore(0).id).toBe(1);
  });

  it('mantiene la fase 1 antes del primer umbral', () => {
    expect(getPhaseForScore(5).id).toBe(1);
  });

  it('desbloquea la fase 2 en el umbral exacto', () => {
    expect(getPhaseForScore(6).id).toBe(2);
  });

  it('desbloquea la fase 3 en el umbral exacto', () => {
    expect(getPhaseForScore(13).id).toBe(3);
  });

  it('desbloquea la fase 4 en el umbral exacto', () => {
    expect(getPhaseForScore(21).id).toBe(4);
  });

  it('desbloquea la fase 5 en el umbral exacto', () => {
    expect(getPhaseForScore(30).id).toBe(5);
  });

  it('se queda en la fase 5 con puntuaciones altas', () => {
    expect(getPhaseForScore(999).id).toBe(5);
  });

  it('los umbrales están en orden creciente', () => {
    for (let i = 1; i < PHASES.length; i++) {
      expect(PHASES[i].minScore).toBeGreaterThan(PHASES[i - 1].minScore);
    }
  });
});

describe('speedForScore', () => {
  it('usa la velocidad base al empezar', () => {
    expect(speedForScore(0)).toBe(CONFIG.baseSpeed);
  });

  it('aumenta la velocidad con la puntuación', () => {
    expect(speedForScore(10)).toBeGreaterThan(CONFIG.baseSpeed);
  });

  it('no supera la velocidad máxima', () => {
    expect(speedForScore(10000)).toBe(CONFIG.maxSpeed);
  });
});
