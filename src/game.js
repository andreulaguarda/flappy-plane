import * as THREE from 'three';
import {
  CONFIG,
  STATE,
  PHASES,
  STORAGE_BEST_KEY,
  getPhaseForScore,
  speedForScore
} from './config.js';
import { hitsGap, hitsFloor, hitsCeiling, passedObstacle } from './collision.js';
import { bindInput } from './input.js';
import { getMedalInfo } from './ui.js';

export class Game {
  constructor({ world, plane, propeller, environment, obstacles, particles, ui, sound }) {
    this.world = world;
    this.plane = plane;
    this.propeller = propeller;
    this.environment = environment;
    this.obstacles = obstacles;
    this.particles = particles;
    this.ui = ui;
    this.sound = sound;

    this.state = STATE.MENU;
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem(STORAGE_BEST_KEY) || '0', 10);
    this.currentPhaseId = 1;

    this.planeY = 0.5;
    this.planeVelY = 0;
    this.scrollSpeed = CONFIG.baseSpeed;
    this.distSinceLastSpawn = 0;
    this.smokeTimer = 0;
    this.elapsedTime = 0;
    this.clock = new THREE.Clock();

    this.ui.bind({
      onStart: () => this.startGame(),
      onResume: () => this.togglePause(),
      onRestart: () => this.startGame(),
      onRetry: () => this.startGame(),
      onPauseToggle: () => this.togglePause(),
      onSoundToggle: () => this.toggleSound()
    });

    bindInput(this);

    this.ui.setBest(this.bestScore);
    this.ui.setSoundMuted(this.sound.muted);

    this.applyPhase(PHASES[0], false);
    this.plane.position.set(this.world.planeAnchorX, this.planeY, 0);
  }

  start() {
    const animate = () => {
      requestAnimationFrame(animate);
      this.update();
    };
    animate();
  }

  startGame() {
    this.sound.playClick();
    this.obstacles.clear();
    this.particles.clear();

    this.score = 0;
    this.currentPhaseId = 1;
    this.planeY = 1.0;
    this.planeVelY = 0;
    this.scrollSpeed = CONFIG.baseSpeed;
    this.distSinceLastSpawn = 0;
    this.smokeTimer = 0;

    this.plane.position.set(this.world.planeAnchorX, this.planeY, 0);
    this.plane.rotation.set(0, 0, 0);
    this.world.resetShake();

    this.ui.setScore(0);
    this.ui.hideStart();
    this.ui.hidePause();
    this.ui.hideGameOver();
    this.ui.showTapHint();
    this.applyPhase(PHASES[0], false);

    this.obstacles.spawn(12, 0);
    this.obstacles.spawn(12 + CONFIG.spawnIntervalDist, 0);

    this.state = STATE.PLAYING;
    this.flap();
  }

  flap() {
    if (this.state !== STATE.PLAYING) return;
    this.planeVelY = CONFIG.jumpImpulse;
    this.sound.playFlap();
    this.particles.spawnSmoke(this.plane.position.x - 1.2, this.plane.position.y - 0.1, 0);
    if (this.score >= 1) {
      this.ui.fadeTapHint();
    }
  }

  primaryAction() {
    if (this.state === STATE.PLAYING) {
      this.flap();
    } else if (this.state === STATE.MENU) {
      this.startGame();
    } else if (this.state === STATE.GAMEOVER && this.ui.isGameOverVisible()) {
      this.startGame();
    }
  }

  togglePause() {
    if (this.state === STATE.PLAYING) {
      this.state = STATE.PAUSED;
      this.ui.showPause();
      this.sound.playClick();
    } else if (this.state === STATE.PAUSED) {
      this.state = STATE.PLAYING;
      this.ui.hidePause();
      this.sound.playClick();
    }
  }

  toggleSound() {
    const muted = this.sound.toggleMute();
    this.ui.setSoundMuted(muted);
  }

  applyPhase(phase, announce = false) {
    this.world.setPhase(phase);
    this.ui.setPhase(phase);

    if (announce) {
      this.sound.playPhaseUp();
      this.ui.showBanner(phase);
    }
  }

  triggerGameOver() {
    if (this.state === STATE.GAMEOVER) return;
    this.state = STATE.GAMEOVER;

    this.sound.playCrash();
    this.world.shake(0.42);
    this.particles.spawnBurst(
      this.plane.position.x,
      this.plane.position.y,
      0,
      [0xff5733, 0xfacc15, 0xffffff, 0xef4444],
      28
    );

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem(STORAGE_BEST_KEY, String(this.bestScore));
      this.ui.setBest(this.bestScore);
    }

    const phase = getPhaseForScore(this.score);
    this.ui.prepareGameOver({
      score: this.score,
      best: this.bestScore,
      phaseName: phase.name,
      medal: getMedalInfo(this.score)
    });
  }

  update() {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.elapsedTime += dt;

    this.world.updateColors(dt);
    this.propeller.rotation.x += (this.state === STATE.GAMEOVER ? 8 : 34) * dt;

    const activeScroll =
      this.state === STATE.PAUSED
        ? 0
        : this.state === STATE.PLAYING
          ? this.scrollSpeed
          : 4.5;

    this.environment.update(dt, activeScroll);

    if (this.state === STATE.MENU) {
      this.updateMenu(dt);
    } else if (this.state === STATE.PLAYING) {
      this.updatePlaying(dt);
    } else if (this.state === STATE.GAMEOVER) {
      this.updateGameOver(dt);
    }

    if (this.state !== STATE.PAUSED) {
      this.particles.update(dt, activeScroll);
    }

    this.world.updateCamera(dt, this.planeY);
    this.world.renderer.render(this.world.scene, this.world.camera);
  }

  updateMenu(dt) {
    this.planeY = 0.8 + Math.sin(this.elapsedTime * 2.6) * 0.85;
    this.plane.position.set(this.world.planeAnchorX, this.planeY, 0);
    this.plane.rotation.z = Math.cos(this.elapsedTime * 2.6) * 0.16;
    this.plane.rotation.x = Math.sin(this.elapsedTime * 1.8) * 0.08;

    this.smokeTimer += dt;
    if (this.smokeTimer > 0.11) {
      this.smokeTimer = 0;
      this.particles.spawnSmoke(this.plane.position.x - 1.25, this.plane.position.y - 0.08, 0);
    }
  }

  updatePlaying(dt) {
    this.planeVelY += CONFIG.gravity * dt;
    this.planeVelY = THREE.MathUtils.clamp(
      this.planeVelY,
      CONFIG.maxFallSpeed,
      CONFIG.maxRiseSpeed
    );
    this.planeY += this.planeVelY * dt;

    if (hitsCeiling(this.planeY, CONFIG.planeRadius, CONFIG.ceilingY)) {
      this.planeY = CONFIG.ceilingY - CONFIG.planeRadius;
      this.planeVelY = Math.min(0, this.planeVelY);
    }

    this.plane.position.set(this.world.planeAnchorX, this.planeY, 0);

    const targetPitch = THREE.MathUtils.clamp(this.planeVelY * 0.065, -0.75, 0.58);
    this.plane.rotation.z = THREE.MathUtils.lerp(this.plane.rotation.z, targetPitch, dt * 12);
    this.plane.rotation.x = Math.sin(this.elapsedTime * 5) * 0.05;

    this.smokeTimer += dt;
    if (this.smokeTimer > 0.065) {
      this.smokeTimer = 0;
      this.particles.spawnSmoke(this.plane.position.x - 1.25, this.plane.position.y - 0.1, 0);
    }

    if (hitsFloor(this.planeY, CONFIG.planeRadius, CONFIG.floorY)) {
      this.planeY = CONFIG.floorY + CONFIG.planeRadius;
      this.plane.position.y = this.planeY;
      this.triggerGameOver();
    }

    this.distSinceLastSpawn += this.scrollSpeed * dt;
    if (this.distSinceLastSpawn >= CONFIG.spawnIntervalDist) {
      this.distSinceLastSpawn = 0;
      this.obstacles.spawn(CONFIG.obstacleSpawnX, this.score);
    }

    this.obstacles.move(dt, this.scrollSpeed, this.elapsedTime);

    const planeX = this.plane.position.x;
    for (let i = 0; i < this.obstacles.obstacles.length; i++) {
      const obs = this.obstacles.obstacles[i];

      if (
        hitsGap(
          planeX,
          this.planeY,
          CONFIG.planeRadius,
          obs.mesh.position.x,
          obs.halfWidth,
          obs.gapY,
          obs.gapHeight
        )
      ) {
        this.triggerGameOver();
        break;
      }

      if (!obs.passed && passedObstacle(planeX, obs.mesh.position.x, obs.halfWidth)) {
        obs.passed = true;
        this.score++;
        this.ui.setScore(this.score, true);
        this.sound.playScore(obs.type === 'ring');

        if (obs.type === 'ring') {
          this.particles.spawnBurst(
            obs.mesh.position.x,
            obs.gapY,
            0,
            [0xfacc15, 0x38bdf8, 0xffffff],
            14
          );
        }

        this.scrollSpeed = speedForScore(this.score, CONFIG);

        const newPhase = getPhaseForScore(this.score);
        if (newPhase.id !== this.currentPhaseId) {
          this.currentPhaseId = newPhase.id;
          this.applyPhase(newPhase, true);
        }
      }
    }

    this.obstacles.cleanup();
  }

  updateGameOver(dt) {
    if (this.planeY - CONFIG.planeRadius > CONFIG.floorY) {
      this.planeVelY += CONFIG.gravity * dt;
      this.planeY += this.planeVelY * dt;
      this.plane.position.y = Math.max(CONFIG.floorY + CONFIG.planeRadius, this.planeY);
      this.plane.rotation.z -= 5.5 * dt;
      this.plane.rotation.x += 7.0 * dt;
    }
  }
}
