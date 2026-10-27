import * as THREE from 'three';
import { CONFIG } from './config.js';

export function createEnvironment(scene) {
  const envGroup = new THREE.Group();
  scene.add(envGroup);

  const sunMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(5.5, 1),
    new THREE.MeshBasicMaterial({ color: 0xfde047 })
  );
  sunMesh.position.set(18, 12, -52);
  envGroup.add(sunMesh);

  const groundChunks = [];
  const groundChunkWidth = 12;
  const groundMatWater = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.35,
    flatShading: true
  });
  const groundMatGrass = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    roughness: 0.7,
    flatShading: true
  });
  const groundMatSoil = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.85,
    flatShading: true
  });

  function createGroundChunk(xPos) {
    const chunk = new THREE.Group();
    chunk.position.set(xPos, CONFIG.floorY - 1.2, 0);

    const soil = new THREE.Mesh(new THREE.BoxGeometry(groundChunkWidth, 2.4, 8), groundMatSoil);
    soil.position.y = -0.4;
    soil.receiveShadow = true;
    chunk.add(soil);

    const grass = new THREE.Mesh(new THREE.BoxGeometry(groundChunkWidth, 0.55, 8.2), groundMatGrass);
    grass.position.y = 0.95;
    grass.receiveShadow = true;
    chunk.add(grass);

    const water = new THREE.Mesh(new THREE.BoxGeometry(groundChunkWidth, 1.8, 10), groundMatWater);
    water.position.set(0, -0.15, 7);
    chunk.add(water);

    for (let i = 0; i < 3; i++) {
      const treeX = (i - 1) * 3.6 + (Math.random() - 0.5) * 1.2;
      const treeZ = -2.2 - Math.random() * 1.2;
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.16, 0.6, 5),
        groundMatSoil
      );
      trunk.position.set(treeX, 1.4, treeZ);
      const foliage = new THREE.Mesh(
        new THREE.ConeGeometry(0.65, 1.45, 6),
        groundMatGrass
      );
      foliage.position.set(treeX, 2.15, treeZ);
      foliage.castShadow = true;
      chunk.add(trunk, foliage);
    }

    envGroup.add(chunk);
    return chunk;
  }

  for (let i = -3; i <= 4; i++) {
    groundChunks.push(createGroundChunk(i * groundChunkWidth));
  }

  const mountains = [];
  const mountainColors = [0x475569, 0x64748b, 0x334155];
  for (let i = 0; i < 14; i++) {
    const mGroup = new THREE.Group();
    const height = 10 + Math.random() * 16;
    const radius = 6 + Math.random() * 7;
    const mMat = new THREE.MeshStandardMaterial({
      color: mountainColors[i % mountainColors.length],
      roughness: 0.85,
      flatShading: true
    });
    const mMesh = new THREE.Mesh(new THREE.ConeGeometry(radius, height, 6), mMat);
    mMesh.position.y = height * 0.5 - 11;
    mGroup.add(mMesh);

    const snowCap = new THREE.Mesh(
      new THREE.ConeGeometry(radius * 0.36, height * 0.36, 6),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5, flatShading: true })
    );
    snowCap.position.y = height * 0.82 - 11;
    mGroup.add(snowCap);

    mGroup.position.set(-45 + i * 10 + Math.random() * 3, 0, -24 - Math.random() * 20);
    mGroup.userData.speedFactor = 0.18 + Math.random() * 0.14;
    envGroup.add(mGroup);
    mountains.push(mGroup);
  }

  const clouds = [];
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.6,
    flatShading: true
  });

  function createCloud() {
    const cGroup = new THREE.Group();
    const puffs = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < puffs; i++) {
      const r = 0.8 + Math.random() * 0.85;
      const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 0), cloudMat);
      puff.position.set(
        (i - (puffs - 1) * 0.5) * 1.05,
        (Math.random() - 0.5) * 0.35,
        (Math.random() - 0.5) * 0.4
      );
      cGroup.add(puff);
    }
    return cGroup;
  }

  for (let i = 0; i < 12; i++) {
    const c = createCloud();
    c.position.set(
      -35 + i * 8 + Math.random() * 4,
      2 + Math.random() * 9,
      -8 - Math.random() * 22
    );
    const scale = 0.7 + Math.random() * 0.9;
    c.scale.setScalar(scale);
    c.userData.speedFactor = 0.25 + Math.random() * 0.35;
    envGroup.add(c);
    clouds.push(c);
  }

  function update(dt, activeScroll) {
    if (activeScroll <= 0) return;

    for (const chunk of groundChunks) {
      chunk.position.x -= activeScroll * dt;
      if (chunk.position.x < -groundChunkWidth * 3.5) {
        chunk.position.x += groundChunkWidth * groundChunks.length;
      }
    }

    for (const m of mountains) {
      m.position.x -= activeScroll * m.userData.speedFactor * dt;
      if (m.position.x < -55) {
        m.position.x += 135;
      }
    }

    for (const c of clouds) {
      c.position.x -= activeScroll * c.userData.speedFactor * dt;
      if (c.position.x < -45) {
        c.position.x = 48 + Math.random() * 10;
        c.position.y = 1.5 + Math.random() * 9;
      }
    }
  }

  return {
    group: envGroup,
    update
  };
}
