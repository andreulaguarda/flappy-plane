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

  // Gradiente vertical por vertex colors: tierra -> roca -> profundidad casi negra
  function applyVerticalGradient(geometry, topHex, bottomHex) {
    geometry.computeBoundingBox();
    const minY = geometry.boundingBox.min.y;
    const maxY = geometry.boundingBox.max.y;
    const top = new THREE.Color(topHex);
    const bottom = new THREE.Color(bottomHex);
    const pos = geometry.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getY(i) - minY) / Math.max(0.001, maxY - minY);
      c.copy(bottom).lerp(top, t);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }

  const groundMatGrass = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    roughness: 0.65,
    flatShading: true
  });
  const groundMatGrassLip = new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    roughness: 0.7,
    flatShading: true
  });
  const gradientMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.9,
    flatShading: true
  });
  const groundMatRock = new THREE.MeshStandardMaterial({
    color: 0x6b6560,
    roughness: 0.85,
    flatShading: true
  });
  const groundMatSoil = new THREE.MeshStandardMaterial({
    color: 0x92400e,
    roughness: 0.85,
    flatShading: true
  });

  // Geometrías de bandas compartidas entre chunks (degradados idénticos)
  const soilGeo = applyVerticalGradient(
    new THREE.BoxGeometry(groundChunkWidth, 2.0, 13.2),
    0x9c6236,
    0x6b3f1d
  );
  const stoneGeo = applyVerticalGradient(
    new THREE.BoxGeometry(groundChunkWidth, 5.0, 13.0),
    0x57534e,
    0x292524
  );
  const deepGeo = applyVerticalGradient(
    new THREE.BoxGeometry(groundChunkWidth, 18.0, 13.0),
    0x292524,
    0x0c0a09
  );

  function createGroundChunk(xPos) {
    const chunk = new THREE.Group();
    chunk.position.set(xPos, CONFIG.floorY, 0);

    // 1. Capa superior: césped verde (de y=0 a y=-0.7)
    const grass = new THREE.Mesh(
      new THREE.BoxGeometry(groundChunkWidth, 0.7, 13.5),
      groundMatGrass
    );
    grass.position.set(0, -0.35, 1.5);
    grass.receiveShadow = true;
    chunk.add(grass);

    // 2. Labio de hierba que sobresale por el borde frontal (estilo Flappy Bird)
    const lip = new THREE.Mesh(
      new THREE.BoxGeometry(groundChunkWidth, 0.34, 0.55),
      groundMatGrassLip
    );
    lip.position.set(0, -0.82, 8.3);
    chunk.add(lip);

    // Mechones de hierba sobre el borde frontal
    const tufts = 5;
    for (let i = 0; i < tufts; i++) {
      const tx = -groundChunkWidth * 0.5 + ((i + Math.random() * 0.7) / tufts) * groundChunkWidth;
      const tuft = new THREE.Mesh(
        new THREE.ConeGeometry(0.09, 0.28 + Math.random() * 0.18, 4),
        groundMatGrassLip
      );
      tuft.position.set(tx, 0.12, 7.85 + Math.random() * 0.3);
      tuft.rotation.z = (Math.random() - 0.5) * 0.35;
      chunk.add(tuft);
    }

    // 3. Franja de tierra con degradado (de y=-0.7 a y=-2.7)
    const soil = new THREE.Mesh(soilGeo, gradientMat);
    soil.position.set(0, -1.7, 1.5);
    soil.receiveShadow = true;
    chunk.add(soil);

    // 4. Roca con degradado (de y=-2.7 a y=-7.7)
    const stone = new THREE.Mesh(stoneGeo, gradientMat);
    stone.position.set(0, -5.2, 1.5);
    chunk.add(stone);

    // 5. Profundidad que se funde hacia negro (de y=-7.7 a y=-25.7)
    const deep = new THREE.Mesh(deepGeo, gradientMat);
    deep.position.set(0, -16.7, 1.5);
    chunk.add(deep);

    // Rocas semienterradas en el corte frontal (colocadas con criterio, pocas)
    const embeddedRocks = 2;
    for (let i = 0; i < embeddedRocks; i++) {
      const rx = (i - 0.5) * 5 + (Math.random() - 0.5) * 2.2;
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.55 + Math.random() * 0.35, 0),
        groundMatRock
      );
      const ry = i % 2 === 0 ? -1.5 - Math.random() * 0.5 : -3.4 - Math.random() * 0.9;
      rock.scale.set(1.25, 0.85, 0.7);
      rock.rotation.set(Math.random() * 0.6, Math.random() * Math.PI, Math.random() * 0.6);
      rock.position.set(rx, ry, 8.0);
      chunk.add(rock);
    }

    // Guijarros pequeños en la franja de tierra
    for (let i = 0; i < 3; i++) {
      const pebble = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.14 + Math.random() * 0.12, 0),
        groundMatRock
      );
      pebble.position.set(
        -groundChunkWidth * 0.45 + Math.random() * groundChunkWidth * 0.9,
        -1.0 - Math.random() * 1.4,
        8.12
      );
      chunk.add(pebble);
    }

    // Árboles low-poly en el borde trasero del césped (copa de dos conos)
    for (let i = 0; i < 3; i++) {
      const treeX = (i - 1) * 3.6 + (Math.random() - 0.5) * 1.2;
      const treeZ = -2.4 - Math.random() * 1.2;
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.16, 0.6, 5),
        groundMatSoil
      );
      trunk.position.set(treeX, 0.3, treeZ);
      const foliageLow = new THREE.Mesh(
        new THREE.ConeGeometry(0.7, 1.05, 6),
        groundMatGrass
      );
      foliageLow.position.set(treeX, 0.95, treeZ);
      foliageLow.castShadow = true;
      const foliageTop = new THREE.Mesh(
        new THREE.ConeGeometry(0.48, 0.85, 6),
        groundMatGrass
      );
      foliageTop.position.set(treeX, 1.6, treeZ);
      foliageTop.castShadow = true;
      chunk.add(trunk, foliageLow, foliageTop);
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

  // Montañas en 2 capas de parallax: velocidad y profundidad constantes por capa,
  // espaciado uniforme y wrapping por ancho total de capa (nunca se solapan)
  const mountainLayers = [];
  const snowMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.55,
    flatShading: true
  });

  function createMountain(baseRadius, totalHeight, colorHex) {
    const mGroup = new THREE.Group();
    const splitRatio = 0.62 + Math.random() * 0.14;
    const baseHeight = totalHeight * splitRatio;
    const capHeight = totalHeight * (1 - splitRatio);
    const midRadius = baseRadius * (1 - splitRatio);

    const mMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.88,
      flatShading: true
    });

    // Tronco inferior (frustum)
    const baseGeo = new THREE.CylinderGeometry(midRadius, baseRadius, baseHeight, 6);
    const baseMesh = new THREE.Mesh(baseGeo, mMat);
    baseMesh.position.y = baseHeight * 0.5;
    mGroup.add(baseMesh);

    // Cumbre nevada apoyada justo encima (sin caras coplanares)
    const capGeo = new THREE.ConeGeometry(midRadius, capHeight, 6);
    const snowCap = new THREE.Mesh(capGeo, snowMat);
    snowCap.position.y = baseHeight + capHeight * 0.5;
    mGroup.add(snowCap);

    return mGroup;
  }

  function createMountainLayer({ count, spacing, z, speed, minH, maxH, minR, maxR, colors }) {
    const wrapX = -60;
    const wrapWidth = count * spacing;
    const list = [];
    for (let i = 0; i < count; i++) {
      const totalHeight = minH + Math.random() * (maxH - minH);
      const baseRadius = minR + Math.random() * (maxR - minR);
      const color = colors[i % colors.length];
      const mGroup = createMountain(baseRadius, totalHeight, color);
      const jitter = (Math.random() - 0.5) * spacing * 0.18;
      mGroup.position.set(wrapX + i * spacing + jitter, CONFIG.floorY - 3.6, z);
      envGroup.add(mGroup);
      list.push(mGroup);
    }
    mountainLayers.push({ mountains: list, speed, wrapX, wrapWidth });
  }

  // Capa lejana: más grande, pálida y lenta (perspectiva aérea)
  createMountainLayer({
    count: 6,
    spacing: 24,
    z: -34,
    speed: 0.13,
    minH: 18,
    maxH: 27,
    minR: 7,
    maxR: 10,
    colors: [0x9c7a55, 0x8d6f4f, 0xa3825c]
  });

  // Capa cercana: más pequeña, saturada y rápida
  createMountainLayer({
    count: 7,
    spacing: 22,
    z: -23,
    speed: 0.26,
    minH: 12,
    maxH: 17.5,
    minR: 5.5,
    maxR: 8,
    colors: [0x7c4a1e, 0x6b4423, 0x854d0e]
  });

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

    for (const layer of mountainLayers) {
      const dx = activeScroll * layer.speed * dt;
      for (const m of layer.mountains) {
        m.position.x -= dx;
        if (m.position.x < layer.wrapX) {
          m.position.x += layer.wrapWidth;
        }
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
