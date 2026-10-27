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

  const groundMatGrass = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    roughness: 0.65,
    flatShading: true
  });
  const groundMatSoil = new THREE.MeshStandardMaterial({
    color: 0x92400e,
    roughness: 0.85,
    flatShading: true
  });
  const groundMatDarkSoil = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.9,
    flatShading: true
  });
  const groundMatStone = new THREE.MeshStandardMaterial({
    color: 0x57534e,
    roughness: 0.9,
    flatShading: true
  });
  const groundMatDeepStone = new THREE.MeshStandardMaterial({
    color: 0x44403c,
    roughness: 0.95,
    flatShading: true
  });

  function createGroundChunk(xPos) {
    const chunk = new THREE.Group();
    chunk.position.set(xPos, CONFIG.floorY, 0);

    // 1. Capa superior: Césped verde (de y=0 a y=-0.7)
    const grass = new THREE.Mesh(
      new THREE.BoxGeometry(groundChunkWidth, 0.7, 13.5),
      groundMatGrass
    );
    grass.position.set(0, -0.35, 1.5);
    grass.receiveShadow = true;
    chunk.add(grass);

    // 2. Segunda capa: Tierra marrón (de y=-0.7 a y=-2.3)
    const soil = new THREE.Mesh(
      new THREE.BoxGeometry(groundChunkWidth, 1.6, 13.2),
      groundMatSoil
    );
    soil.position.set(0, -1.5, 1.5);
    soil.receiveShadow = true;
    chunk.add(soil);

    // Franja irregular de tierra oscura (de y=-2.3 a y=-3.1)
    const darkSoil = new THREE.Mesh(
      new THREE.BoxGeometry(groundChunkWidth, 0.8, 13.0),
      groundMatDarkSoil
    );
    darkSoil.position.set(0, -2.7, 1.5);
    chunk.add(darkSoil);

    // 3. Capa profunda: Piedra / Roca madre hasta muy abajo (de y=-3.1 a y=-26)
    const stone = new THREE.Mesh(
      new THREE.BoxGeometry(groundChunkWidth, 23, 13.5),
      groundMatDeepStone
    );
    stone.position.set(0, -14.6, 1.5);
    chunk.add(stone);

    // Bloques low-poly de relieve en el corte frontal (tierra y piedra)
    for (let i = 0; i < 3; i++) {
      const rx = (i - 1) * 3.8 + (Math.random() - 0.5) * 1.1;
      const soilBump = new THREE.Mesh(
        new THREE.BoxGeometry(2.4 + Math.random(), 0.9, 0.9),
        groundMatDarkSoil
      );
      soilBump.position.set(rx, -1.6 - Math.random() * 0.4, 8.1);
      chunk.add(soilBump);

      const rockFacet = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.5 + Math.random() * 0.6, 0),
        groundMatStone
      );
      rockFacet.scale.set(1.4, 0.85, 0.5);
      rockFacet.position.set(rx, -4.5 - Math.random() * 2.2, 8.2);
      chunk.add(rockFacet);
    }

    // Árboles low-poly en el borde trasero del césped
    for (let i = 0; i < 3; i++) {
      const treeX = (i - 1) * 3.6 + (Math.random() - 0.5) * 1.2;
      const treeZ = -2.4 - Math.random() * 1.2;
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.16, 0.6, 5),
        groundMatSoil
      );
      trunk.position.set(treeX, 0.3, treeZ);
      const foliage = new THREE.Mesh(
        new THREE.ConeGeometry(0.65, 1.45, 6),
        groundMatGrass
      );
      foliage.position.set(treeX, 1.05, treeZ);
      foliage.castShadow = true;
      chunk.add(trunk, foliage);
    }

    envGroup.add(chunk);
    return chunk;
  }

  for (let i = -3; i <= 4; i++) {
    groundChunks.push(createGroundChunk(i * groundChunkWidth));
  }

  // Pista de aterrizaje 3D para el inicio y despegue
  const runwayGroup = new THREE.Group();
  runwayGroup.position.set(0, CONFIG.floorY + 0.04, 0);

  const asphaltMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.8,
    flatShading: true
  });
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
  const sideLineMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });

  const runwayLength = 26;
  const asphalt = new THREE.Mesh(
    new THREE.BoxGeometry(runwayLength, 0.12, 3.2),
    asphaltMat
  );
  asphalt.receiveShadow = true;
  runwayGroup.add(asphalt);

  // Líneas laterales amarillas de la pista
  [-1.4, 1.4].forEach((zPos) => {
    const borderLine = new THREE.Mesh(
      new THREE.BoxGeometry(runwayLength, 0.14, 0.12),
      sideLineMat
    );
    borderLine.position.set(0, 0, zPos);
    runwayGroup.add(borderLine);
  });

  // Líneas centrales discontinuas blancas
  for (let x = -11; x <= 11; x += 2.4) {
    const dash = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 0.18), lineMat);
    dash.position.set(x, 0, 0);
    runwayGroup.add(dash);
  }

  envGroup.add(runwayGroup);

  function resetRunway(anchorX = -3.5) {
    runwayGroup.position.x = anchorX + 4.5;
    runwayGroup.visible = true;
  }

  // Montañas lejanas marrones en 2 tramos separados (sin solapamiento / sin efecto muaré)
  const mountains = [];
  const mountainColors = [0x854d0e, 0x78350f, 0x9a5b25, 0x6b4423];
  const snowMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.55,
    flatShading: true
  });

  for (let i = 0; i < 14; i++) {
    const mGroup = new THREE.Group();
    const totalHeight = 14 + Math.random() * 14;
    const baseRadius = 6.5 + Math.random() * 6.5;
    const splitRatio = 0.68; // 68% base marrón, 32% cumbre nevada
    const baseHeight = totalHeight * splitRatio;
    const capHeight = totalHeight * (1 - splitRatio);
    const midRadius = baseRadius * (1 - splitRatio);

    const mMat = new THREE.MeshStandardMaterial({
      color: mountainColors[i % mountainColors.length],
      roughness: 0.88,
      flatShading: true
    });

    // Tronco inferior marrón (frustum)
    const baseGeo = new THREE.CylinderGeometry(midRadius, baseRadius, baseHeight, 6);
    const baseMesh = new THREE.Mesh(baseGeo, mMat);
    baseMesh.position.y = baseHeight * 0.5;
    mGroup.add(baseMesh);

    // Cumbre nevada superior apoyada justo encima (sin caras coplanares)
    const capGeo = new THREE.ConeGeometry(midRadius, capHeight, 6);
    const snowCap = new THREE.Mesh(capGeo, snowMat);
    snowCap.position.y = baseHeight + capHeight * 0.5;
    mGroup.add(snowCap);

    mGroup.position.set(-45 + i * 10 + Math.random() * 3, CONFIG.floorY - 3.6, -22 - Math.random() * 16);
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

    if (runwayGroup.visible) {
      runwayGroup.position.x -= activeScroll * dt;
      if (runwayGroup.position.x < -38) {
        runwayGroup.visible = false;
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
    update,
    resetRunway
  };
}
