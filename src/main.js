import { createWorld } from './scene.js';
import { createPlane } from './plane.js';
import { createEnvironment } from './environment.js';
import { createObstacleSystem } from './obstacles.js';
import { createParticleSystem } from './particles.js';
import { UI } from './ui.js';
import { sound } from './audio.js';
import { Game } from './game.js';

const canvas = document.getElementById('game-canvas');
const world = createWorld(canvas);

const { group: plane, propeller } = createPlane();
world.scene.add(plane);

const environment = createEnvironment(world.scene);
const obstacles = createObstacleSystem(world.scene);
const particles = createParticleSystem(world.scene);
const ui = new UI();

const game = new Game({
  world,
  plane,
  propeller,
  environment,
  obstacles,
  particles,
  ui,
  sound
});

game.start();
