import * as THREE from 'three';
import { CONFIG, getPhaseForScore } from './config.js';

export function createObstacleSystem(scene) {
  const group = new THREE.Group();
  scene.add(group);

  const obstacles = [];

  const MATS = {
    pipeBody: new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4, flatShading: true }),
    pipeRim: new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.4, flatShading: true }),
    towerWall: new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.55, flatShading: true }),
    towerRoof: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7, flatShading: true }),
    windowGlow: new THREE.MeshBasicMaterial({ color: 0xfef08a }),
    zeppBody: new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.45, flatShading: true }),
    ringGold: new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.45,
      roughness: 0.25,
      flatShading: true
    }),
    ringPylon: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.6, flatShading: true }),
    rockSpire: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85, flatShading: true }),
    stormCloud: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7, flatShading: true }),
    lightning: new THREE.MeshBasicMaterial({ color: 0xfacc15 })
  };

  function buildPipeObstacle(gapY, gapHeight) {
    const root = new THREE.Group();
    const topBottomY = gapY + gapHeight * 0.5;
    const botTopY = gapY - gapHeight * 0.5;
    const topPipeHeight = 18;
    const botPipeHeight = Math.max(2, (botTopY - 0.35) - (CONFIG.floorY - 1.2));

    const topPipe = new THREE.Group();
    const topBody = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 1.05, topPipeHeight, 10),
      MATS.pipeBody
    );
    topBody.position.y = topBottomY + topPipeHeight * 0.5 + 0.35;
    topBody.castShadow = true;
    topBody.receiveShadow = true;

    const topCap = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.7, 10), MATS.pipeRim);
    topCap.position.y = topBottomY + 0.35;
    topCap.castShadow = true;
    topPipe.add(topBody, topCap);

    const botPipe = new THREE.Group();
    const botBody = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 1.05, botPipeHeight, 10),
      MATS.pipeBody
    );
    botBody.position.y = botTopY - 0.35 - botPipeHeight * 0.5;
    botBody.castShadow = true;
    botBody.receiveShadow = true;

    const botCap = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.7, 10), MATS.pipeRim);
    botCap.position.y = botTopY - 0.35;
    botCap.castShadow = true;
    botPipe.add(botBody, botCap);

    root.add(topPipe, botPipe);
    return { root, halfWidth: 1.15 };
  }

  function buildTowerObstacle(gapY, gapHeight) {
    const root = new THREE.Group();
    const topBottomY = gapY + gapHeight * 0.5;
    const botTopY = gapY - gapHeight * 0.5;
    const topH = 18;
    const botH = Math.max(2, botTopY - (CONFIG.floorY - 1.2));

    const botTower = new THREE.Mesh(new THREE.BoxGeometry(2.2, botH, 2.2), MATS.towerWall);
    botTower.position.y = botTopY - botH * 0.5;
    botTower.castShadow = true;
    botTower.receiveShadow = true;
    root.add(botTower);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 2.4), MATS.towerRoof);
    roof.position.y = botTopY - 0.2;
    root.add(roof);

    for (let row = 1; row <= 5; row++) {
      const winY = botTopY - row * 1.4;
      if (winY < CONFIG.floorY + 0.5) break;
      for (let col = -1; col <= 1; col += 2) {
        const win = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.52), MATS.windowGlow);
        win.position.set(col * 0.45, winY, 1.12);
        root.add(win);
      }
    }

    const topTower = new THREE.Mesh(new THREE.BoxGeometry(2.1, topH, 2.1), MATS.towerRoof);
    topTower.position.y = topBottomY + topH * 0.5;
    topTower.castShadow = true;
    root.add(topTower);

    const topTrim = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.45, 2.35), MATS.zeppBody);
    topTrim.position.y = topBottomY + 0.22;
    root.add(topTrim);

    return { root, halfWidth: 1.15 };
  }

  function buildRingObstacle(gapY, gapHeight) {
    const root = new THREE.Group();
    const ringRadius = gapHeight * 0.52;
    const tubeRadius = 0.42;

    const torusGeo = new THREE.TorusGeometry(ringRadius, tubeRadius, 8, 18);
    torusGeo.rotateY(Math.PI / 2);
    const ringMesh = new THREE.Mesh(torusGeo, MATS.ringGold);
    ringMesh.position.y = gapY;
    ringMesh.castShadow = true;
    root.add(ringMesh);

    const topPylonH = 16;
    const topPylon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, topPylonH, 8),
      MATS.ringPylon
    );
    topPylon.position.y = gapY + ringRadius + tubeRadius + topPylonH * 0.5;
    root.add(topPylon);

    const botRingBottom = gapY - ringRadius - tubeRadius;
    const botPylonH = Math.max(1.5, botRingBottom - (CONFIG.floorY - 1.5));
    const botPylon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, botPylonH, 8),
      MATS.ringPylon
    );
    botPylon.position.y = botRingBottom - botPylonH * 0.5;
    root.add(botPylon);

    return { root, ringMesh, halfWidth: 0.75 };
  }

  function buildStormObstacle(gapY, gapHeight) {
    const root = new THREE.Group();
    const topBottomY = gapY + gapHeight * 0.5;
    const botTopY = gapY - gapHeight * 0.5;

    const spireH = Math.max(2.5, (botTopY + 0.6) - (CONFIG.floorY - 1.5));
    const botSpire = new THREE.Mesh(new THREE.ConeGeometry(1.85, spireH, 6), MATS.rockSpire);
    botSpire.position.y = botTopY - spireH * 0.5 + 0.6;
    botSpire.castShadow = true;
    root.add(botSpire);

    const topRock = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.1, 16, 6), MATS.stormCloud);
    topRock.position.y = topBottomY + 8 + 1.2;
    root.add(topRock);

    const stormCluster = new THREE.Group();
    stormCluster.position.y = topBottomY + 1.1;
    for (let i = -1; i <= 1; i++) {
      const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(1.25, 0), MATS.stormCloud);
      puff.position.set(i * 0.65, Math.abs(i) * 0.25, (i % 2) * 0.3);
      stormCluster.add(puff);
    }

    const bolt = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.35, 4), MATS.lightning);
    bolt.rotation.x = Math.PI;
    bolt.position.y = -0.75;
    stormCluster.add(bolt);

    root.add(stormCluster);
    return { root, bolt, halfWidth: 1.1 };
  }

  function spawn(xPos, currentScore) {
    const phase = getPhaseForScore(currentScore);
    const types = phase.types;
    const chosenType = types[Math.floor(Math.random() * types.length)];

    const gapHeight = phase.gapSize;
    const minGapY = -3.8;
    const maxGapY = 4.2;
    const gapY = THREE.MathUtils.lerp(minGapY, maxGapY, Math.random());

    let built;
    if (chosenType === 'pipe') {
      built = buildPipeObstacle(gapY, gapHeight);
    } else if (chosenType === 'tower') {
      built = buildTowerObstacle(gapY, gapHeight);
    } else if (chosenType === 'ring') {
      built = buildRingObstacle(gapY, gapHeight);
    } else {
      built = buildStormObstacle(gapY, gapHeight);
    }

    built.root.position.set(xPos, 0, 0);
    group.add(built.root);

    const oscillates = (chosenType === 'ring' || chosenType === 'storm') && currentScore >= 15;

    const obstacle = {
      type: chosenType,
      mesh: built.root,
      ringMesh: built.ringMesh || null,
      boltMesh: built.bolt || null,
      baseGapY: gapY,
      gapY,
      gapHeight,
      halfWidth: built.halfWidth,
      passed: false,
      oscillates,
      oscSpeed: 1.5 + Math.random() * 1.1,
      oscAmp: 0.85 + Math.random() * 0.55,
      oscPhase: Math.random() * Math.PI * 2
    };

    obstacles.push(obstacle);
    return obstacle;
  }

  function move(dt, scrollSpeed, elapsedTime) {
    for (const obs of obstacles) {
      obs.mesh.position.x -= scrollSpeed * dt;

      if (obs.oscillates) {
        const offset = Math.sin(elapsedTime * obs.oscSpeed + obs.oscPhase) * obs.oscAmp;
        obs.mesh.position.y = offset;
        obs.gapY = obs.baseGapY + offset;
      }

      if (obs.ringMesh) {
        obs.ringMesh.rotation.x += 1.4 * dt;
      }
      if (obs.boltMesh) {
        obs.boltMesh.scale.y = 0.85 + Math.sin(elapsedTime * 18) * 0.25;
      }
    }
  }

  function cleanup() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      if (obs.mesh.position.x < CONFIG.obstacleDespawnX) {
        group.remove(obs.mesh);
        obstacles.splice(i, 1);
      }
    }
  }

  function clear() {
    for (const obs of obstacles) {
      group.remove(obs.mesh);
    }
    obstacles.length = 0;
  }

  return {
    group,
    obstacles,
    spawn,
    move,
    cleanup,
    clear
  };
}
