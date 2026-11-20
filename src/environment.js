import * as THREE from 'three';
import { CONFIG, LEVELS, getStageForProgress } from './config.js';
import { createLandmark } from './landmarks.js';
import { createStageProp } from './stageProps.js';

const WATER_SURFACES = new Set([
  'sea',
  'mediterranean',
  'arabian_sea',
  'turquoise_sea',
  'deep_pacific',
  'sunset_ocean',
  'north_atlantic'
]);

const WATER_PROP_TYPES = new Set([
  'ships',
  'classic_steamer',
  'sailboat_yacht',
  'arabian_dhows',
  'asian_junk',
  'cargo_ships',
  'fishing_trawler',
  'channel_buoys',
  'fog_buoys',
  'med_islands',
  'archipelago_islets',
  'volcanic_islands',
  'coral_atolls',
  'icebergs',
  'red_bridge_towers'
]);

export function createEnvironment(scene) {
  const envGroup = new THREE.Group();
  scene.add(envGroup);

  const sunMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
  const sunMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(5.5, 1), sunMat);
  sunMesh.position.set(18, 13, -52);
  envGroup.add(sunMesh);

  // Estrellas 3D para la fase nocturna del ciclo día/atardecer/noche
  const starsGroup = new THREE.Group();
  const starMat = new THREE.MeshBasicMaterial({
    color: 0xfef9c3,
    transparent: true,
    opacity: 0
  });
  const starGeo = new THREE.OctahedronGeometry(0.24, 0);
  for (let i = 0; i < 36; i++) {
    const star = new THREE.Mesh(starGeo, starMat);
    star.position.set(
      -42 + (i * 2.45) + (Math.random() - 0.5) * 1.5,
      3.5 + (i % 7) * 2.3 + Math.random() * 1.2,
      -42 - (i % 3) * 4
    );
    const s = 0.65 + (i % 4) * 0.25;
    star.scale.setScalar(s);
    starsGroup.add(star);
  }
  starsGroup.visible = false;
  envGroup.add(starsGroup);

  // Monte Fuji monumental en el horizonte lejano (Nivel 11: Manila -> Tokio)
  const fujiGroup = new THREE.Group();
  fujiGroup.position.set(8, CONFIG.floorY - 2.2, -46);
  const fujiBase = new THREE.Mesh(
    new THREE.CylinderGeometry(3.2, 16.5, 17.5, 10),
    new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.75, flatShading: true })
  );
  fujiBase.position.y = 8.75;
  const fujiSnow = new THREE.Mesh(
    new THREE.CylinderGeometry(2.3, 6.8, 6.2, 10),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45, flatShading: true })
  );
  fujiSnow.position.y = 14.5;
  fujiGroup.add(fujiBase, fujiSnow);
  fujiGroup.visible = false;
  envGroup.add(fujiGroup);

  // Aurora boreal verde y violeta (Nivel 18: Groenlandia -> Reikiavik)
  const auroraGroup = new THREE.Group();
  auroraGroup.position.set(0, 8.5, -36);
  const auroraRibbons = [];
  const auroraColors = [0x10b981, 0xa855f7, 0x34d399, 0xc084fc];
  for (let i = 0; i < 4; i++) {
    const ribbonMat = new THREE.MeshBasicMaterial({
      color: auroraColors[i],
      transparent: true,
      opacity: 0.36,
      side: THREE.DoubleSide
    });
    const ribbon = new THREE.Mesh(new THREE.PlaneGeometry(56, 4.2, 14, 1), ribbonMat);
    ribbon.position.set((i - 1.5) * 4, (i % 2) * 2.2, -i * 2.5);
    ribbon.rotation.z = (i - 1.5) * 0.04;
    auroraGroup.add(ribbon);
    auroraRibbons.push(ribbon);
  }
  auroraGroup.visible = false;
  envGroup.add(auroraGroup);

  const groundChunks = [];
  const groundChunkWidth = 12;

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

  // Materiales exclusivos de TIERRA (nunca se tiñen de azul cuando llega una etapa de mar)
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
  const groundMatSoil = new THREE.MeshStandardMaterial({
    color: 0x92400e,
    roughness: 0.85,
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

  // Materiales exclusivos de MAR / OCÉANO (llegan hasta abajo del todo en la pantalla)
  const waterSurfaceMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.3,
    metalness: 0.15,
    flatShading: true
  });
  const waterWaveMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.35,
    flatShading: true
  });
  const waterFoamMat = new THREE.MeshStandardMaterial({
    color: 0xf0f9ff,
    roughness: 0.45,
    flatShading: true
  });
  const waterDepthMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.55,
    flatShading: true
  });

  const fishMaterials = [
    new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.35, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4, flatShading: true })
  ];
  const bubbleMat = new THREE.MeshBasicMaterial({
    color: 0xe0f2fe,
    transparent: true,
    opacity: 0.65
  });

  const targetTopColor = new THREE.Color(0x22c55e);
  const targetLipColor = new THREE.Color(0x16a34a);
  const targetSubColor = new THREE.Color(0x92400e);
  const targetWaterSurfaceColor = new THREE.Color(0x0284c7);
  const targetWaterWaveColor = new THREE.Color(0x38bdf8);
  const targetSunColor = new THREE.Color(0xfde047);
  const targetCloudColor = new THREE.Color(0xffffff);

  let currentLevel = LEVELS[0];
  let currentStage = getStageForProgress(currentLevel, 0);
  let waveTime = 0;
  let targetSunY = 13;
  let targetStarOpacity = 0;

  // Geometrías de estratos de TIERRA
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

  // Geometrías de profundidad de MAR (agua continua hasta el borde inferior de la pantalla)
  const waterMidGeo = applyVerticalGradient(
    new THREE.BoxGeometry(groundChunkWidth, 6.5, 13.4),
    0x0284c7,
    0x075985
  );
  const waterAbyssGeo = applyVerticalGradient(
    new THREE.BoxGeometry(groundChunkWidth, 19.0, 13.3),
    0x075985,
    0x020617
  );

  function createFishMesh(matIndex) {
    const fishGroup = new THREE.Group();
    const fMat = fishMaterials[matIndex % fishMaterials.length];

    // Cuerpo fusiforme del pez
    const body = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), fMat);
    body.scale.set(1.75, 0.78, 0.55);
    fishGroup.add(body);

    // Aleta caudal (cola)
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.28, 3), fMat);
    tail.rotation.z = -Math.PI / 2;
    tail.position.set(0.42, 0, 0);
    fishGroup.add(tail);

    fishGroup.userData.tail = tail;
    return fishGroup;
  }

  function populateChunkProps(chunk, stage, forceLand = false) {
    const propsGroup = chunk.userData.propsGroup;
    while (propsGroup.children.length > 0) {
      propsGroup.remove(propsGroup.children[0]);
    }

    const isWater = !forceLand && WATER_SURFACES.has(stage?.surface);
    chunk.userData.isWater = isWater;
    chunk.userData.landGroup.visible = !isWater;
    chunk.userData.waterGroup.visible = isWater;

    const rawProps = stage?.propTypes || ['english_trees'];
    const filteredProps = rawProps.filter((p) =>
      isWater ? WATER_PROP_TYPES.has(p) : !WATER_PROP_TYPES.has(p)
    );
    const propTypes =
      filteredProps.length > 0
        ? filteredProps
        : isWater
          ? ['classic_steamer', 'sailboat_yacht']
          : ['english_trees', 'cottage'];

    const count = isWater ? 2 : 3;
    for (let i = 0; i < count; i++) {
      const chosenType =
        propTypes[(i + Math.floor(Math.random() * propTypes.length)) % propTypes.length];
      const propMesh = createStageProp(chosenType);
      const px = isWater
        ? (i - 0.5) * 5.2 + (Math.random() - 0.5) * 1.4
        : (i - 1) * 3.6 + (Math.random() - 0.5) * 1.1;
      const pz = isWater ? -1.8 - Math.random() * 2.2 : -2.3 - Math.random() * 1.3;
      const scale = 0.85 + Math.random() * 0.32;
      propMesh.position.set(px, isWater ? -0.1 : 0, pz);
      propMesh.scale.setScalar(scale);
      propsGroup.add(propMesh);
    }
  }

  function createGroundChunk(xPos) {
    const chunk = new THREE.Group();
    chunk.position.set(xPos, CONFIG.floorY, 0);

    // =========================================================================
    // 1. SUBGRUPO DE TIERRA (Césped/Arena/Roca + Estratos subterráneos)
    // =========================================================================
    const landGroup = new THREE.Group();

    const grass = new THREE.Mesh(
      new THREE.BoxGeometry(groundChunkWidth, 0.7, 13.5),
      groundMatGrass
    );
    grass.position.set(0, -0.35, 1.5);
    grass.receiveShadow = true;
    landGroup.add(grass);

    const lip = new THREE.Mesh(
      new THREE.BoxGeometry(groundChunkWidth, 0.34, 0.55),
      groundMatGrassLip
    );
    lip.position.set(0, -0.82, 8.3);
    landGroup.add(lip);

    const tufts = 5;
    for (let i = 0; i < tufts; i++) {
      const tx =
        -groundChunkWidth * 0.5 + ((i + Math.random() * 0.7) / tufts) * groundChunkWidth;
      const tuft = new THREE.Mesh(
        new THREE.ConeGeometry(0.09, 0.28 + Math.random() * 0.18, 4),
        groundMatGrassLip
      );
      tuft.position.set(tx, 0.12, 7.85 + Math.random() * 0.3);
      tuft.rotation.z = (Math.random() - 0.5) * 0.35;
      landGroup.add(tuft);
    }

    const soil = new THREE.Mesh(soilGeo, groundMatSoil);
    soil.position.set(0, -1.7, 1.5);
    soil.receiveShadow = true;
    landGroup.add(soil);

    const stone = new THREE.Mesh(stoneGeo, gradientMat);
    stone.position.set(0, -5.2, 1.5);
    landGroup.add(stone);

    const deep = new THREE.Mesh(deepGeo, gradientMat);
    deep.position.set(0, -16.7, 1.5);
    landGroup.add(deep);

    for (let i = 0; i < 2; i++) {
      const rx = (i - 0.5) * 5 + (Math.random() - 0.5) * 2.2;
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.55 + Math.random() * 0.35, 0),
        groundMatRock
      );
      const ry = i % 2 === 0 ? -1.5 - Math.random() * 0.5 : -3.4 - Math.random() * 0.9;
      rock.scale.set(1.25, 0.85, 0.7);
      rock.rotation.set(Math.random() * 0.6, Math.random() * Math.PI, Math.random() * 0.6);
      rock.position.set(rx, ry, 8.0);
      landGroup.add(rock);
    }

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
      landGroup.add(pebble);
    }

    chunk.add(landGroup);

    // =========================================================================
    // 2. SUBGRUPO DE MAR / OCÉANO (Agua hasta abajo del todo + Olas + Peces)
    // =========================================================================
    const waterGroup = new THREE.Group();
    waterGroup.visible = false;

    // Capa superficial del mar
    const surfaceWater = new THREE.Mesh(
      new THREE.BoxGeometry(groundChunkWidth, 0.9, 13.5),
      waterSurfaceMat
    );
    surfaceWater.position.set(0, -0.45, 1.5);
    surfaceWater.receiveShadow = true;
    waterGroup.add(surfaceWater);

    // Columna de agua marina media y abisal (llega hasta abajo del todo sin rocas)
    const midWater = new THREE.Mesh(waterMidGeo, waterDepthMat);
    midWater.position.set(0, -4.15, 1.5);
    waterGroup.add(midWater);

    const abyssWater = new THREE.Mesh(waterAbyssGeo, waterDepthMat);
    abyssWater.position.set(0, -16.9, 1.5);
    waterGroup.add(abyssWater);

    // Crestas de olas 3D y rodillos de espuma blanca sobre la superficie
    const waveList = [];
    for (let i = 0; i < 6; i++) {
      const wx = -groundChunkWidth * 0.42 + (i / 5) * groundChunkWidth * 0.84;
      const wz = -1.5 + (i % 3) * 3.8;
      const waveRidge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.48, 2.2, 5),
        i % 2 === 0 ? waterFoamMat : waterWaveMat
      );
      waveRidge.rotation.z = Math.PI / 2;
      waveRidge.position.set(wx, 0.05, wz);
      waterGroup.add(waveRidge);
      waveList.push(waveRidge);
    }

    // Espuma blanca de las olas en el corte frontal del mar
    const frontFoam = new THREE.Mesh(
      new THREE.BoxGeometry(groundChunkWidth, 0.24, 0.48),
      waterFoamMat
    );
    frontFoam.position.set(0, -0.08, 8.28);
    waterGroup.add(frontFoam);

    // Peces low-poly nadando bajo el agua y burbujas marinas
    const fishList = [];
    for (let i = 0; i < 4; i++) {
      const fish = createFishMesh(i);
      const baseX = -4.2 + i * 2.7 + (Math.random() - 0.5) * 0.8;
      const baseY = -1.65 - (i % 3) * 1.45 - Math.random() * 0.5;
      fish.position.set(baseX, baseY, 8.26);
      fish.userData.baseX = baseX;
      fish.userData.baseY = baseY;
      fish.userData.phase = Math.random() * Math.PI * 2;
      fish.userData.speed = 2.2 + Math.random() * 1.6;
      waterGroup.add(fish);
      fishList.push(fish);

      const bubble = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.08 + (i % 2) * 0.04, 0),
        bubbleMat
      );
      bubble.position.set(baseX - 0.45, baseY + 0.45, 8.3);
      waterGroup.add(bubble);
    }

    chunk.add(waterGroup);

    const propsGroup = new THREE.Group();
    chunk.add(propsGroup);

    chunk.userData.landGroup = landGroup;
    chunk.userData.waterGroup = waterGroup;
    chunk.userData.propsGroup = propsGroup;
    chunk.userData.waves = waveList;
    chunk.userData.fishes = fishList;
    chunk.userData.isWater = false;

    populateChunkProps(chunk, currentStage, true);

    envGroup.add(chunk);
    return chunk;
  }

  for (let i = -3; i <= 4; i++) {
    groundChunks.push(createGroundChunk(i * groundChunkWidth));
  }

  // Pista de aterrizaje/despegue 3D + contenedor del monumento icónico
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

  [-1.4, 1.4].forEach((zPos) => {
    const borderLine = new THREE.Mesh(
      new THREE.BoxGeometry(runwayLength, 0.14, 0.12),
      sideLineMat
    );
    borderLine.position.set(0, 0, zPos);
    runwayGroup.add(borderLine);
  });

  for (let x = -11; x <= 11; x += 2.4) {
    const dash = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 0.18), lineMat);
    dash.position.set(x, 0, 0);
    runwayGroup.add(dash);
  }

  const landmarkSlot = new THREE.Group();
  landmarkSlot.position.set(1.5, -0.04, -4.4);
  runwayGroup.add(landmarkSlot);

  envGroup.add(runwayGroup);

  function setRunwayLandmark(landmarkId) {
    while (landmarkSlot.children.length > 0) {
      landmarkSlot.remove(landmarkSlot.children[0]);
    }
    if (!landmarkId) return;
    const monument = createLandmark(landmarkId);
    landmarkSlot.add(monument);
  }

  function ensureLandUnderRunway() {
    if (!runwayGroup.visible) return;
    const rx = runwayGroup.position.x;
    for (const chunk of groundChunks) {
      if (Math.abs(chunk.position.x - rx) < 22 && chunk.userData.isWater) {
        populateChunkProps(chunk, currentStage, true);
      }
    }
  }

  function resetRunway(anchorX = -3.5, landmarkId = currentLevel?.originLandmark) {
    runwayGroup.position.x = anchorX + 4.5;
    runwayGroup.visible = true;
    if (landmarkId) {
      setRunwayLandmark(landmarkId);
    }
    ensureLandUnderRunway();
  }

  // Capas de montañas / horizonte en parallax
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

    const baseGeo = new THREE.CylinderGeometry(midRadius, baseRadius, baseHeight, 6);
    const baseMesh = new THREE.Mesh(baseGeo, mMat);
    baseMesh.position.y = baseHeight * 0.5;
    mGroup.add(baseMesh);

    const capGeo = new THREE.ConeGeometry(midRadius, capHeight, 6);
    const snowCap = new THREE.Mesh(capGeo, snowMat);
    snowCap.position.y = baseHeight + capHeight * 0.5;
    mGroup.add(snowCap);

    const skirtHeight = 14;
    const skirtGeo = new THREE.CylinderGeometry(baseRadius, baseRadius, skirtHeight, 6);
    const skirt = new THREE.Mesh(skirtGeo, mMat);
    skirt.position.y = -skirtHeight * 0.5;
    mGroup.add(skirt);

    mGroup.userData.baseMat = mMat;
    mGroup.userData.targetColor = new THREE.Color(colorHex);
    mGroup.userData.snowCap = snowCap;
    mGroup.userData.targetScaleY = 1;

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

  createMountainLayer({
    count: 6,
    spacing: 24,
    z: -34,
    speed: 0.13,
    minH: 16,
    maxH: 23,
    minR: 7,
    maxR: 10,
    colors: [0x9c7a55, 0x8d6f4f, 0xa3825c]
  });

  createMountainLayer({
    count: 7,
    spacing: 22,
    z: -23,
    speed: 0.26,
    minH: 11.5,
    maxH: 16.5,
    minR: 5.5,
    maxR: 8,
    colors: [0x7c4a1e, 0x6b4423, 0x854d0e]
  });

  function applyBackdropProfile(stage, instant = false) {
    if (!stage) return;
    const colors = stage.backdropColors || [0x64748b, 0x475569, 0x334155];
    const showSnow = Boolean(stage.snowCaps);

    let heightFactor = 1.0;
    if (stage.backdrop === 'open_sea') heightFactor = 0.22;
    else if (stage.backdrop === 'island_chain') heightFactor = 0.55;
    else if (stage.backdrop === 'rolling_hills' || stage.backdrop === 'desert_dunes')
      heightFactor = 0.72;
    else if (stage.backdrop === 'high_alps') heightFactor = 1.15;

    for (const layer of mountainLayers) {
      layer.mountains.forEach((m, idx) => {
        const hex = colors[idx % colors.length];
        m.userData.targetColor.setHex(hex);
        m.userData.snowCap.visible = true;
        m.userData.snowCap.material = showSnow ? snowMat : m.userData.baseMat;
        m.userData.targetScaleY = heightFactor;
        if (instant) {
          m.userData.baseMat.color.setHex(hex);
          m.scale.y = heightFactor;
        }
      });
    }
  }

  function setStage(stage, instant = false) {
    if (!stage) return;
    const stageChanged = !currentStage || currentStage.id !== stage.id;
    currentStage = stage;

    const isWaterStage = WATER_SURFACES.has(stage.surface);
    if (isWaterStage) {
      targetWaterSurfaceColor.setHex(stage.topHex ?? 0x0284c7);
      targetWaterWaveColor.setHex(stage.lipHex ?? 0x38bdf8);
    } else {
      targetTopColor.setHex(stage.topHex ?? 0x22c55e);
      targetLipColor.setHex(stage.lipHex ?? 0x16a34a);
      targetSubColor.setHex(stage.subHex ?? 0x92400e);
    }

    fujiGroup.visible = Boolean(stage.fuji);
    auroraGroup.visible = Boolean(stage.aurora);

    applyBackdropProfile(stage, instant);

    if (instant) {
      groundMatGrass.color.copy(targetTopColor);
      groundMatGrassLip.color.copy(targetLipColor);
      groundMatSoil.color.copy(targetSubColor);
      waterSurfaceMat.color.copy(targetWaterSurfaceColor);
      waterWaveMat.color.copy(targetWaterWaveColor);
      // Al iniciar cualquier nivel siempre se despega desde tierra firme
      for (const chunk of groundChunks) {
        populateChunkProps(chunk, currentStage, true);
      }
    } else if (stageChanged) {
      // Actualiza inmediatamente los chunks que aún están fuera de cámara a la derecha
      for (const chunk of groundChunks) {
        if (chunk.position.x > 16) {
          const underRunway =
            runwayGroup.visible && Math.abs(chunk.position.x - runwayGroup.position.x) < 22;
          populateChunkProps(chunk, currentStage, underRunway);
        }
      }
    }
  }

  function setTimeOfDay(progressRatio = 0, instant = false) {
    const p = Math.min(1, Math.max(0, Number.isFinite(progressRatio) ? progressRatio : 0));

    // [0..0.45] Día -> [0.45..0.82] Atardecer -> [0.82..1.00] Noche breve y clara
    if (p < 0.45) {
      const sunsetBlend = THREE.MathUtils.smoothstep(p, 0.36, 0.48);
      targetSunColor.setHex(0xfde047).lerp(new THREE.Color(0xf97316), sunsetBlend);
      targetCloudColor.setHex(0xffffff).lerp(new THREE.Color(0xfed7aa), sunsetBlend);
      targetSunY = THREE.MathUtils.lerp(13.2, 8.0, sunsetBlend);
      targetStarOpacity = 0;
    } else if (p < 0.82) {
      const toNight = THREE.MathUtils.smoothstep(p, 0.74, 0.86);
      targetSunColor.setHex(0xf97316).lerp(new THREE.Color(0xf8fafc), toNight);
      targetCloudColor.setHex(0xfed7aa).lerp(new THREE.Color(0xcbd5e1), toNight);
      targetSunY = THREE.MathUtils.lerp(8.0, 12.6, toNight);
      targetStarOpacity = toNight * 0.78;
    } else {
      const nightBlend = THREE.MathUtils.smoothstep(p, 0.74, 0.88);
      targetSunColor.setHex(0xf97316).lerp(new THREE.Color(0xf8fafc), nightBlend);
      targetCloudColor.setHex(0xfed7aa).lerp(new THREE.Color(0xcbd5e1), nightBlend);
      targetSunY = THREE.MathUtils.lerp(8.0, 12.6, nightBlend);
      targetStarOpacity = nightBlend * 0.78;
    }

    if (instant) {
      sunMat.color.copy(targetSunColor);
      cloudMat.color.copy(targetCloudColor);
      sunMesh.position.y = targetSunY;
      starMat.opacity = targetStarOpacity;
      starsGroup.visible = targetStarOpacity > 0.02;
    }
  }

  function setLevel(level, anchorX = -3.5) {
    currentLevel = level || LEVELS[0];
    const firstStage = getStageForProgress(currentLevel, 0);
    setStage(firstStage, true);
    setTimeOfDay(0, true);
    resetRunway(anchorX, currentLevel.originLandmark);
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
    waveTime += dt;

    // Transición suave de materiales y ciclo día/atardecer/noche
    groundMatGrass.color.lerp(targetTopColor, dt * 2.5);
    groundMatGrassLip.color.lerp(targetLipColor, dt * 2.5);
    groundMatSoil.color.lerp(targetSubColor, dt * 2.5);
    waterSurfaceMat.color.lerp(targetWaterSurfaceColor, dt * 2.5);
    waterWaveMat.color.lerp(targetWaterWaveColor, dt * 2.5);
    sunMat.color.lerp(targetSunColor, dt * 2.4);
    cloudMat.color.lerp(targetCloudColor, dt * 2.4);
    sunMesh.position.y = THREE.MathUtils.lerp(sunMesh.position.y, targetSunY, dt * 2.2);
    starMat.opacity = THREE.MathUtils.lerp(starMat.opacity, targetStarOpacity, dt * 2.4);
    starsGroup.visible = starMat.opacity > 0.02;

    for (const layer of mountainLayers) {
      for (const m of layer.mountains) {
        m.userData.baseMat.color.lerp(m.userData.targetColor, dt * 2.2);
        m.scale.y = THREE.MathUtils.lerp(m.scale.y, m.userData.targetScaleY, dt * 2.0);
      }
    }

    if (auroraGroup.visible) {
      auroraRibbons.forEach((ribbon, idx) => {
        ribbon.position.y = (idx % 2) * 2.0 + Math.sin(waveTime * 1.6 + idx * 1.4) * 0.75;
        ribbon.rotation.z = Math.sin(waveTime * 0.9 + idx) * 0.08;
      });
    }

    // Animación de olas, barcos y peces submarinos en los bloques de mar
    for (const chunk of groundChunks) {
      if (chunk.userData.isWater) {
        chunk.userData.waves.forEach((wave, idx) => {
          wave.position.y =
            0.05 + Math.sin(waveTime * 3.8 + idx * 1.1 + chunk.position.x * 0.25) * 0.11;
        });
        chunk.userData.fishes.forEach((fish, idx) => {
          const phase = waveTime * fish.userData.speed + fish.userData.phase;
          fish.position.x = fish.userData.baseX + Math.sin(phase * 0.7) * 0.55;
          fish.position.y = fish.userData.baseY + Math.cos(phase) * 0.22;
          if (fish.userData.tail) {
            fish.userData.tail.rotation.y = Math.sin(waveTime * 10 + idx) * 0.35;
          }
        });
      }
    }

    if (activeScroll <= 0) return;

    for (const chunk of groundChunks) {
      chunk.position.x -= activeScroll * dt;
      if (chunk.position.x < -groundChunkWidth * 3.5) {
        chunk.position.x += groundChunkWidth * groundChunks.length;
        const underRunway =
          runwayGroup.visible && Math.abs(chunk.position.x - runwayGroup.position.x) < 22;
        populateChunkProps(chunk, currentStage, underRunway);
      }
    }

    if (runwayGroup.visible) {
      runwayGroup.position.x -= activeScroll * dt;
      ensureLandUnderRunway();
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
    resetRunway,
    setLevel,
    setStage,
    setTimeOfDay
  };
}
