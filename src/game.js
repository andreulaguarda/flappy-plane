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

    this.state = STATE.TAKEOFF;
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem(STORAGE_BEST_KEY) || '0', 10);
    this.currentPhaseId = 1;

    this.runwayPlaneY = CONFIG.floorY + 0.88;
    this.planeY = this.runwayPlaneY;
    this.planeVelY = 0;
    this.scrollSpeed = 0;
    this.distSinceLastSpawn = 0;
    this.smokeTimer = 0;
    this.takeoffTimer = 0;
    this.crashStopDuration = 0.7;
    this.crashStartSpeed = 0;
    this.crashScrollSpeed = 0;
    this.crashStopTimer = 0;
    this.elapsedTime = 0;
    this.clock = new THREE.Clock();

    this.ui.bind({
      onResume: () => this.togglePause(),
      onRestart: () => {
        this.sound.playClick();
        this.resetToRunway();
      },
      onRetry: () => {
        this.sound.playClick();
        this.resetToRunway();
      },
      onPauseToggle: () => this.togglePause(),
      onSoundToggle: () => this.toggleSound()
    });

    bindInput(this);

    this.ui.setBest(this.bestScore);
    this.ui.setSoundMuted(this.sound.muted);

    this.resetToRunway();
  }

  start() {
    const animate = () => {
      requestAnimationFrame(animate);
      this.update();
    };
    animate();
  }

  resetToRunway() {
    this.obstacles.clear();
    this.particles.clear();

    this.score = 0;
    this.currentPhaseId = 1;
    this.runwayPlaneY = CONFIG.floorY + 0.88;
    this.planeY = this.runwayPlaneY;
    this.planeVelY = 0;
    this.scrollSpeed = 0;
    this.distSinceLastSpawn = 0;
    this.smokeTimer = 0;
    this.takeoffTimer = 0;
    this.crashStartSpeed = 0;
    this.crashScrollSpeed = 0;
    this.crashStopTimer = 0;

    this.environment.resetRunway(this.world.planeAnchorX);
    this.plane.position.set(this.world.planeAnchorX, this.planeY, 0);
    this.plane.rotation.set(0, 0, 0.06);
    this.world.resetShake();

    this.ui.setScore(0);
    this.ui.hidePause();
    this.ui.hideGameOver();
    this.applyPhase(PHASES[0], false);

    this.beginTakeoff();
  }

  beginTakeoff() {
    this.state = STATE.TAKEOFF;
    this.takeoffTimer = 0;
    this.sound.playFlap();
  }

  flap() {
    if (this.state !== STATE.PLAYING) return;
    this.planeVelY = CONFIG.jumpImpulse;
    this.sound.playFlap();
    this.particles.spawnSmoke(this.plane.position.x - 1.2, this.plane.position.y - 0.1, 0);
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

    if (announce) {
      this.sound.playPhaseUp();
      this.ui.showBanner(phase);
    }
  }

  triggerGameOver() {
    if (this.state === STATE.GAMEOVER) return;
    this.state = STATE.GAMEOVER;

    // El mundo entero se frena junto con el avión (suelo, árboles, montañas, nubes y obstáculos)
    this.crashStartSpeed = this.scrollSpeed;
    this.crashScrollSpeed = this.scrollSpeed;
    this.crashStopTimer = 0;

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

    if (this.state === STATE.PLAYING) {
      this.propeller.rotation.x += 36 * dt;
    } else if (this.state === STATE.TAKEOFF) {
      const pSpeed = 12 + 26 * Math.min(1, this.takeoffTimer / 1.0);
      this.propeller.rotation.x += pSpeed * dt;
    } else if (this.state === STATE.GAMEOVER) {
      this.propeller.rotation.x += 8 * dt;
    }

    let activeScroll;
    if (this.state === STATE.PAUSED) {
      activeScroll = 0;
    } else if (this.state === STATE.PLAYING || this.state === STATE.TAKEOFF) {
      activeScroll = this.scrollSpeed;
    } else {
      // GAMEOVER: scroll residual que decae en updateGameOver hasta congelar el mundo
      activeScroll = this.crashScrollSpeed;
    }

    this.environment.update(dt, activeScroll);

    if (this.state === STATE.TAKEOFF) {
      this.updateTakeoff(dt);
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

  updateTakeoff(dt) {
    const duration = 2.1;
    this.takeoffTimer += dt;
    const t = Math.min(1, this.takeoffTimer / duration);

    // Aceleración progresiva por la pista
    this.scrollSpeed = CONFIG.baseSpeed * (t * t * (3 - 2 * t));

    // Fases: carrera en tierra (0-0.55), rotación del morro (0.42-0.62), ascenso (0.58-1)
    const rollT = Math.min(1, t / 0.55);
    const rotT = THREE.MathUtils.clamp((t - 0.42) / 0.2, 0, 1);
    const rotSmooth = rotT * rotT * (3 - 2 * rotT);
    const liftT = Math.max(0, (t - 0.58) / 0.42);
    const liftSmooth = liftT * liftT * (3 - 2 * liftT);

    this.planeY = THREE.MathUtils.lerp(this.runwayPlaneY, 0.8, liftSmooth);

    // Vibración de la carrera en tierra, se desvanece al ganar altura
    const groundRumble = (1 - liftSmooth) * rollT;
    const rumble = Math.sin(this.elapsedTime * 47) * 0.022 * groundRumble;
    this.plane.position.set(this.world.planeAnchorX, this.planeY + rumble, 0);

    // Morro: estable en carrera, se levanta en la rotación y se asienta al ascender
    const noseUp = THREE.MathUtils.lerp(0.06, 0.32, rotSmooth);
    this.plane.rotation.z = THREE.MathUtils.lerp(noseUp, 0.24, liftSmooth);
    this.plane.rotation.x = Math.sin(this.elapsedTime * 9) * 0.04 * (0.3 + groundRumble);

    // Humo: de las ruedas durante la carrera, del escape una vez en el aire
    this.smokeTimer += dt;
    const smokeInterval = liftT > 0 ? 0.055 : 0.09 - 0.04 * rollT;
    if (this.smokeTimer > smokeInterval) {
      this.smokeTimer = 0;
      const smokeY = liftT > 0 ? this.planeY - 0.1 : this.runwayPlaneY - 0.72;
      this.particles.spawnSmoke(this.plane.position.x - 1.25, smokeY, 0);
    }

    if (t >= 1) {
      this.scrollSpeed = CONFIG.baseSpeed;
      // Impulso suave, coherente con el final del ascenso (sin salto brusco)
      this.planeVelY = CONFIG.jumpImpulse * 0.42;
      this.distSinceLastSpawn = 0;
      this.obstacles.spawn(16, 0);
      this.obstacles.spawn(16 + CONFIG.spawnIntervalDist, 0);
      this.state = STATE.PLAYING;
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
    // Desaceleración suave del mundo tras el choque (ease-out hasta parar)
    if (this.crashStopTimer < this.crashStopDuration) {
      this.crashStopTimer = Math.min(this.crashStopDuration, this.crashStopTimer + dt);
      const k = 1 - this.crashStopTimer / this.crashStopDuration;
      this.crashScrollSpeed = this.crashStartSpeed * k * k;
      this.obstacles.move(dt, this.crashScrollSpeed, this.elapsedTime);
    }

    if (this.planeY - CONFIG.planeRadius > CONFIG.floorY) {
      this.planeVelY += CONFIG.gravity * dt;
      this.planeY += this.planeVelY * dt;
      this.plane.position.y = Math.max(CONFIG.floorY + CONFIG.planeRadius, this.planeY);
      this.plane.rotation.z -= 5.5 * dt;
      this.plane.rotation.x += 7.0 * dt;
    }
  }
}
