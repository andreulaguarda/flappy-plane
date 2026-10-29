import * as THREE from 'three';
import {
  CONFIG,
  STATE,
  LEVELS,
  getLevel,
  speedForLevel,
  isLastLevel
} from './config.js';
import { hitsGap, hitsFloor, hitsCeiling, passedObstacle } from './collision.js';
import { bindInput } from './input.js';
import { getMedalInfo } from './ui.js';
import { METERS_PER_WORLD_UNIT } from './distance.js';
import {
  loadProgress,
  saveProgress,
  loadBests,
  saveBests,
  loadCoins,
  saveCoins,
  unlockNextLevel,
  updateBests
} from './progress.js';
import { t } from './strings.js';

export class Game {
  constructor({
    world,
    plane,
    propeller,
    environment,
    obstacles,
    coins,
    particles,
    ui,
    sound
  }) {
    this.world = world;
    this.plane = plane;
    this.propeller = propeller;
    this.environment = environment;
    this.obstacles = obstacles;
    this.coins = coins;
    this.particles = particles;
    this.ui = ui;
    this.sound = sound;

    this.state = STATE.MENU;
    this.level = LEVELS[0];
    this.distanceM = 0;
    this.obstaclesPassed = 0;
    this.lastDisplayedMeters = -1;
    this.progress = loadProgress(LEVELS.length);
    this.bests = loadBests();
    this.bestScore = this.bests[this.level.id] || 0;
    this.wallet = loadCoins();
    this.runCoins = 0;

    this.runwayPlaneY = CONFIG.floorY + 0.88;
    this.planeY = this.runwayPlaneY;
    this.planeVelY = 0;
    this.scrollSpeed = 0;
    this.distSinceLastSpawn = 0;
    this.obstaclesSpawned = 0;
    this.smokeTimer = 0;
    this.takeoffTimer = 0;
    this.crashStopDuration = 0.7;
    this.crashStartSpeed = 0;
    this.crashScrollSpeed = 0;
    this.crashStopTimer = 0;
    this.landingTimer = 0;
    this.landingDuration = CONFIG.landingDuration;
    this.landingStartY = this.runwayPlaneY;
    this.landingStartSpeed = 0;
    this.landingApproachDistance = 0;
    this.runwaySpawned = false;
    this.elapsedTime = 0;
    this.clock = new THREE.Clock();

    this.ui.bind({
      onResume: () => this.togglePause(),
      onRestart: () => {
        this.sound.playClick();
        this.startLevel(this.level.id);
      },
      onRetry: () => {
        this.sound.playClick();
        this.startLevel(this.level.id);
      },
      onPauseToggle: () => this.togglePause(),
      onSoundToggle: () => this.toggleSound(),
      onSelectLevel: (id) => {
        this.sound.playClick();
        this.startLevel(id);
      },
      onNextLevel: () => {
        this.sound.playClick();
        this.startLevel(this.level.id + 1);
      },
      onMenu: () => {
        this.sound.playClick();
        this.showMenu();
      }
    });

    bindInput(this);

    this.ui.setSoundMuted(this.sound.muted);
    this.showMenu();
  }

  start() {
    const animate = () => {
      requestAnimationFrame(animate);
      this.update();
    };
    animate();
  }

  resetRun() {
    this.obstacles.clear();
    this.coins.clear();
    this.particles.clear();

    this.distanceM = 0;
    this.obstaclesPassed = 0;
    this.lastDisplayedMeters = -1;
    this.runCoins = 0;
    this.runwayPlaneY = CONFIG.floorY + 0.88;
    this.planeY = this.runwayPlaneY;
    this.planeVelY = 0;
    this.scrollSpeed = 0;
    this.distSinceLastSpawn = 0;
    this.obstaclesSpawned = 0;
    this.smokeTimer = 0;
    this.takeoffTimer = 0;
    this.crashStartSpeed = 0;
    this.crashScrollSpeed = 0;
    this.crashStopTimer = 0;
    this.landingTimer = 0;
    this.landingDuration = CONFIG.landingDuration;
    this.landingStartY = this.runwayPlaneY;
    this.landingStartSpeed = 0;
    this.landingApproachDistance = 0;
    this.runwaySpawned = false;

    this.environment.resetRunway(this.world.planeAnchorX);
    this.plane.position.set(this.world.planeAnchorX, this.planeY, 0);
    this.plane.rotation.set(0, 0, 0.06);
    this.world.resetShake();
  }

  showMenu() {
    this.resetRun();
    this.state = STATE.MENU;
    this.level = LEVELS[0];
    this.bestScore = this.bests[this.level.id] || 0;

    this.world.setPhase(this.level);
    this.ui.setDistance(0);
    this.ui.setBest(this.bestScore);
    this.ui.setCoins(this.wallet);
    this.ui.hideBanner();
    this.ui.hidePause();
    this.ui.hideGameOver();
    this.ui.hideComplete();
    this.ui.hideHud();
    saveBests(this.bests);
    saveCoins(this.wallet);
    this.ui.showMenu({
      levels: LEVELS,
      progress: this.progress,
      bests: this.bests,
      coins: this.wallet
    });
  }

  startLevel(id) {
    if (id < 1 || id > this.progress.unlocked) return;
    const level = getLevel(id);
    if (!level) return;

    this.level = level;
    this.bestScore = this.bests[level.id] || 0;

    this.resetRun();
    this.world.setPhase(level);

    this.ui.hideMenu();
    this.ui.showHud();
    this.ui.setDistance(0);
    this.ui.setBest(this.bestScore);
    this.ui.setCoins(this.wallet);
    this.ui.hidePause();
    this.ui.hideGameOver();
    this.ui.hideComplete();
    this.ui.showBanner({
      sub: t('levelBannerSub', { level: level.id }),
      title: t(level.nameKey)
    });

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

    this.bests = updateBests(this.bests, this.level.id, this.distanceM);
    this.bestScore = this.bests[this.level.id] || 0;
    saveBests(this.bests);
    saveCoins(this.wallet);
    this.ui.setBest(this.bestScore);

    this.ui.prepareGameOver({
      level: this.level,
      distance: this.distanceM,
      best: this.bestScore,
      coins: this.runCoins,
      medal: getMedalInfo(this.obstaclesPassed, this.level.obstacleCount)
    });
  }

  completeLevel() {
    this.state = STATE.LEVEL_COMPLETE;

    this.bests = updateBests(this.bests, this.level.id, this.distanceM);
    this.bestScore = this.bests[this.level.id] || 0;
    this.progress = unlockNextLevel(this.progress, this.level.id, LEVELS.length);
    saveBests(this.bests);
    saveProgress(this.progress);
    saveCoins(this.wallet);

    this.ui.setBest(this.bestScore);
    this.sound.playPhaseUp();
    this.ui.prepareLevelComplete({
      level: this.level,
      distance: this.distanceM,
      best: this.bestScore,
      coins: this.runCoins,
      medal: getMedalInfo(this.obstaclesPassed, this.level.obstacleCount),
      hasNext: !isLastLevel(this.level.id)
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
    } else if (this.state === STATE.LANDING) {
      this.propeller.rotation.x += 22 * dt;
    } else if (this.state === STATE.GAMEOVER) {
      this.propeller.rotation.x += 8 * dt;
    } else if (this.state === STATE.MENU) {
      this.propeller.rotation.x += 5 * dt;
    }

    let activeScroll = 0;
    if (
      this.state === STATE.PLAYING ||
      this.state === STATE.TAKEOFF ||
      this.state === STATE.LANDING
    ) {
      activeScroll = this.scrollSpeed;
    } else if (this.state === STATE.GAMEOVER) {
      activeScroll = this.crashScrollSpeed;
    }

    this.environment.update(dt, activeScroll);

    if (this.state === STATE.TAKEOFF) {
      this.updateTakeoff(dt);
    } else if (this.state === STATE.PLAYING) {
      this.updatePlaying(dt);
    } else if (this.state === STATE.LANDING) {
      this.updateLanding(dt);
    } else if (this.state === STATE.GAMEOVER) {
      this.updateGameOver(dt);
    }

    // Las monedas se actualizan después de mover los obstáculos para quedar
    // siempre perfectamente centradas en su hueco.
    if (this.state === STATE.PLAYING || this.state === STATE.GAMEOVER) {
      this.coins.move(dt, this.elapsedTime);
      this.coins.cleanup();
      if (this.state === STATE.PLAYING) {
        this.collectCoins();
      }
    }

    if (
      this.state === STATE.TAKEOFF ||
      this.state === STATE.PLAYING ||
      this.state === STATE.LANDING
    ) {
      this.addDistance(this.scrollSpeed * dt * METERS_PER_WORLD_UNIT);
    }

    if (this.state !== STATE.PAUSED && this.state !== STATE.MENU) {
      this.particles.update(dt, activeScroll);
    }

    this.world.updateCamera(dt, this.planeY);
    this.world.renderer.render(this.world.scene, this.world.camera);
  }

  addDistance(meters) {
    this.distanceM += meters;
    const displayedMeters = Math.floor(this.distanceM);
    if (displayedMeters === this.lastDisplayedMeters) return;

    this.lastDisplayedMeters = displayedMeters;
    this.ui.setDistance(this.distanceM);

    if (this.distanceM > this.bestScore) {
      this.bestScore = this.distanceM;
      this.bests = updateBests(this.bests, this.level.id, this.bestScore);
      this.ui.setBest(this.bestScore);
    }
  }

  updateTakeoff(dt) {
    this.takeoffTimer += dt;
    const t = Math.min(1, this.takeoffTimer / CONFIG.takeoffDuration);
    const easeOut = (x) => 1 - (1 - x) * (1 - x);

    // Aceleración: arranca ya con carrera y llega a la velocidad de crucero pronto,
    // para que el despegue se sienta más horizontal.
    const rampT = Math.min(1, t / CONFIG.takeoffSpeedRamp);
    const speedFactor =
      CONFIG.takeoffSpeedStart + (1 - CONFIG.takeoffSpeedStart) * easeOut(rampT);
    this.scrollSpeed = this.level.speedStart * speedFactor;

    // Fases: carrera en tierra, rotación del morro y ascenso progresivo
    const rotT = THREE.MathUtils.clamp(
      (t - CONFIG.takeoffRotateAt) / CONFIG.takeoffRotateBlend,
      0,
      1
    );
    const rotSmooth = rotT * rotT * (3 - 2 * rotT);
    const liftT = Math.max(0, (t - CONFIG.takeoffLiftAt) / (1 - CONFIG.takeoffLiftAt));
    const liftSmooth = liftT * liftT * (3 - 2 * liftT);

    // Subida repartida en más tiempo y con menos altura: ángulo de ascenso menor
    this.planeY = THREE.MathUtils.lerp(this.runwayPlaneY, CONFIG.takeoffExitY, liftSmooth);

    // Vibración de la carrera en tierra, se desvanece al ganar altura
    const groundRumble = (1 - liftSmooth) * Math.min(1, t / 0.35);
    const rumble = Math.sin(this.elapsedTime * 47) * 0.022 * groundRumble;
    this.plane.position.set(this.world.planeAnchorX, this.planeY + rumble, 0);

    // Morro: estable en carrera, se levanta en la rotación y se asienta al ascender
    const noseUp = THREE.MathUtils.lerp(0.06, 0.22, rotSmooth);
    this.plane.rotation.z = THREE.MathUtils.lerp(noseUp, 0.18, liftSmooth);
    this.plane.rotation.x = Math.sin(this.elapsedTime * 9) * 0.04 * (0.3 + groundRumble);

    // Humo: de las ruedas durante la carrera, del escape una vez en el aire
    this.smokeTimer += dt;
    const airborne = liftT > 0;
    const smokeInterval = airborne ? 0.055 : 0.09 - 0.04 * rotT;
    if (this.smokeTimer > smokeInterval) {
      this.smokeTimer = 0;
      const smokeY = airborne ? this.planeY - 0.1 : this.runwayPlaneY - 0.72;
      this.particles.spawnSmoke(this.plane.position.x - 1.25, smokeY, 0);
    }

    if (t >= 1) {
      this.scrollSpeed = this.level.speedStart;
      // Velocidad vertical coherente con la subida suave (sin salto brusco)
      this.planeVelY = CONFIG.takeoffExitVelY;
      this.distSinceLastSpawn = 0;
      this.obstaclesSpawned = 2;
      const firstObstacle = this.obstacles.spawn(16, this.level, this.obstaclesPassed);
      const secondObstacle = this.obstacles.spawn(
        16 + CONFIG.spawnIntervalDist,
        this.level,
        this.obstaclesPassed
      );
      this.coins.spawn(firstObstacle);
      this.coins.spawn(secondObstacle);
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

      // Tras superar el último obstáculo el tramo final es seguro: no se puede
      // perder el nivel mientras se aproxima la pista de aterrizaje.
      if (this.obstaclesPassed < this.level.obstacleCount) {
        this.triggerGameOver();
        return;
      }
      this.planeVelY = Math.max(0, this.planeVelY);
    }

    this.distSinceLastSpawn += this.scrollSpeed * dt;
    if (
      this.obstaclesSpawned < this.level.obstacleCount &&
      this.distSinceLastSpawn >= CONFIG.spawnIntervalDist
    ) {
      this.distSinceLastSpawn = 0;
      const newObstacle = this.obstacles.spawn(
        CONFIG.obstacleSpawnX,
        this.level,
        this.obstaclesPassed
      );
      this.coins.spawn(newObstacle);
      this.obstaclesSpawned++;
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
        this.obstaclesPassed++;
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

        this.scrollSpeed = speedForLevel(this.level, this.obstaclesPassed);
      }
    }

    this.obstacles.cleanup();

    this.updateLandingApproach(dt);
  }

  collectCoins() {
    const picked = this.coins.collect(
      this.plane.position.x,
      this.planeY,
      CONFIG.planeRadius
    );
    if (picked.length === 0) return;

    this.wallet += picked.length;
    this.runCoins += picked.length;
    saveCoins(this.wallet);
    this.ui.setCoins(this.wallet, true);
    this.sound.playCoin();

    for (const coin of picked) {
      this.particles.spawnBurst(coin.x, coin.y, 0, [0xfde047, 0xfbbf24, 0xffffff], 10);
    }
  }

  updateLandingApproach(dt) {
    if (this.state !== STATE.PLAYING) return;
    const planeX = this.plane.position.x;

    // Cuando ya se han superado todos los obstáculos, aparece la pista al fondo
    // y el avión vuela hacia ella antes de iniciar la maniobra de aterrizaje.
    if (!this.runwaySpawned && this.obstaclesPassed >= this.level.obstacleCount) {
      const lastObstacle = this.obstacles.obstacles[this.obstacles.obstacles.length - 1];
      const obstacleClear = !lastObstacle || lastObstacle.mesh.position.x < planeX - 8;
      if (obstacleClear) {
        this.runwaySpawned = true;
        this.landingApproachDistance = 0;
        this.environment.resetRunway(this.world.planeAnchorX + 38);
        this.ui.showBanner({
          sub: t('levelBannerSub', { level: this.level.id }),
          title: t('finalApproach')
        });
      }
    }

    if (!this.runwaySpawned) return;

    this.landingApproachDistance += this.scrollSpeed * dt;
    if (this.landingApproachDistance >= CONFIG.landingApproachDistance) {
      this.beginLanding();
    }
  }

  beginLanding() {
    this.state = STATE.LANDING;
    this.landingTimer = 0;
    this.landingStartY = this.planeY;
    this.landingStartSpeed = this.scrollSpeed;
    this.landingDuration = THREE.MathUtils.clamp(
      CONFIG.landingDuration + Math.max(0, this.planeY - 0.8) * 0.06,
      CONFIG.landingDuration,
      3.0
    );
    this.planeVelY = 0;
    this.smokeTimer = 0;
  }

  updateLanding(dt) {
    this.landingTimer += dt;
    const t = Math.min(1, this.landingTimer / this.landingDuration);
    const ease = (x) => x * x * (3 - 2 * x);

    const touchdownAt = CONFIG.landingTouchdownAt;
    const touchdown = Math.min(1, t / touchdownAt);
    const touchSmooth = ease(touchdown);
    const rollT = t <= touchdownAt ? 0 : (t - touchdownAt) / (1 - touchdownAt);
    const groundBlend = ease(rollT);

    const previousY = this.planeY;

    // Altura: planeo progresivo durante toda la aproximación y rodadura al final
    this.planeY = THREE.MathUtils.lerp(this.landingStartY, this.runwayPlaneY, touchSmooth);

    // Velocidad: se mantiene alta hasta el contacto y frena ya en pista
    if (t < touchdownAt) {
      this.scrollSpeed = THREE.MathUtils.lerp(
        this.landingStartSpeed,
        this.landingStartSpeed * CONFIG.landingSpeedAtTouchdown,
        touchSmooth
      );
    } else {
      this.scrollSpeed =
        this.landingStartSpeed * CONFIG.landingSpeedAtTouchdown * (1 - groundBlend);
    }

    const rumble = Math.sin(this.elapsedTime * 47) * 0.022 * groundBlend;
    this.plane.position.set(this.world.planeAnchorX, this.planeY + rumble, 0);

    // Morro: sigue la pendiente de descenso, hace flare al tocar y se asienta en pista
    const velY = (this.planeY - previousY) / Math.max(dt, 1 / 240);
    const flare = THREE.MathUtils.clamp((touchdown - 0.72) / 0.28, 0, 1);
    const airPitch = THREE.MathUtils.clamp(velY * 0.07, -0.32, 0.16) + 0.16 * flare;
    const targetPitch = THREE.MathUtils.lerp(airPitch, 0.06, groundBlend);
    this.plane.rotation.z = THREE.MathUtils.lerp(this.plane.rotation.z, targetPitch, dt * 10);
    this.plane.rotation.x = Math.sin(this.elapsedTime * 9) * 0.04 * (0.3 + groundBlend);

    // Humo: escape durante el planeo, ruedas tras el contacto
    this.smokeTimer += dt;
    const onGround = t >= touchdownAt;
    const smokeInterval = onGround ? 0.09 : 0.055;
    if (this.smokeTimer > smokeInterval) {
      this.smokeTimer = 0;
      const smokeY = onGround ? this.runwayPlaneY - 0.72 : this.planeY - 0.1;
      this.particles.spawnSmoke(this.plane.position.x - 1.25, smokeY, 0);
    }

    if (t >= 1) {
      this.scrollSpeed = 0;
      this.planeY = this.runwayPlaneY;
      this.plane.position.set(this.world.planeAnchorX, this.planeY, 0);
      this.plane.rotation.set(0, 0, 0.06);
      this.completeLevel();
    }
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
