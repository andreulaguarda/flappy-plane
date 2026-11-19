import * as THREE from 'three';

const MATS = {
  trunk: new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85, flatShading: true }),
  woodDark: new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.82, flatShading: true }),
  woodWarm: new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8, flatShading: true }),
  greenLeaf: new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.65, flatShading: true }),
  limeLeaf: new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.65, flatShading: true }),
  cypressLeaf: new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.7, flatShading: true }),
  borealLeaf: new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.75, flatShading: true }),
  jungleLeaf: new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.65, flatShading: true }),
  sakuraPink: new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.55, flatShading: true }),
  sakuraLight: new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.55, flatShading: true }),
  stoneLight: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6, flatShading: true }),
  stoneCream: new THREE.MeshStandardMaterial({ color: 0xeaddc5, roughness: 0.68, flatShading: true }),
  stoneGrey: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8, flatShading: true }),
  stoneDark: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85, flatShading: true }),
  basalt: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9, flatShading: true }),
  marble: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45, flatShading: true }),
  sandGold: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.78, flatShading: true }),
  ochre: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.75, flatShading: true }),
  terracotta: new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.8, flatShading: true }),
  canyonRed: new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.82, flatShading: true }),
  brickRed: new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.72, flatShading: true }),
  gold: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.45, flatShading: true }),
  red: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5, flatShading: true }),
  orange: new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.55, flatShading: true }),
  blueDome: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.45, flatShading: true }),
  navyHull: new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.55, flatShading: true }),
  turquoise: new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.35, flatShading: true }),
  iceWhite: new THREE.MeshStandardMaterial({ color: 0xf0f9ff, roughness: 0.35, flatShading: true }),
  iceCyan: new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, flatShading: true }),
  lavaGlow: new THREE.MeshBasicMaterial({ color: 0xf97316 }),
  windowGlow: new THREE.MeshBasicMaterial({ color: 0xfef08a }),
  steam: new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.5,
    transparent: true,
    opacity: 0.82,
    flatShading: true
  })
};

// Casco de barco realista con proa puntiaguda, cuerpo central y popa
function buildShipHull(length, width, height, hullMat, trimMat) {
  const hullGroup = new THREE.Group();
  const midLen = length * 0.58;
  const bowLen = length * 0.26;
  const sternLen = length * 0.18;

  // Obra muerta central
  const mid = new THREE.Mesh(new THREE.BoxGeometry(midLen, height, width), hullMat);
  mid.position.y = height * 0.5;
  hullGroup.add(mid);

  // Proa puntiaguda (delante, hacia -X o +X)
  const bow = new THREE.Mesh(new THREE.ConeGeometry(width * 0.52, bowLen, 4), hullMat);
  bow.rotation.z = Math.PI / 2;
  bow.rotation.x = Math.PI / 4;
  bow.scale.set(1, 1, height / width);
  bow.position.set(-midLen * 0.5 - bowLen * 0.48, height * 0.5, 0);
  hullGroup.add(bow);

  // Popa ahusada
  const stern = new THREE.Mesh(new THREE.ConeGeometry(width * 0.5, sternLen, 4), hullMat);
  stern.rotation.z = -Math.PI / 2;
  stern.rotation.x = Math.PI / 4;
  stern.scale.set(1, 1, height / width);
  stern.position.set(midLen * 0.5 + sternLen * 0.48, height * 0.5, 0);
  hullGroup.add(stern);

  // Línea de flotación / cubierta
  if (trimMat) {
    const gunwale = new THREE.Mesh(
      new THREE.BoxGeometry(midLen * 1.04, height * 0.22, width * 1.05),
      trimMat
    );
    gunwale.position.y = height * 0.9;
    hullGroup.add(gunwale);
  }

  return hullGroup;
}

function addSmallHouse(parent, x, z, w, h, d, wallMat, roofMat, roofType = 'gable') {
  const house = new THREE.Group();
  house.position.set(x, 0, z);

  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
  body.position.y = h * 0.5;
  body.castShadow = true;
  house.add(body);

  const win = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.26, h * 0.34), MATS.windowGlow);
  win.position.set(-w * 0.2, h * 0.56, d * 0.51);
  const win2 = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.26, h * 0.34), MATS.windowGlow);
  win2.position.set(w * 0.2, h * 0.56, d * 0.51);
  house.add(win, win2);

  if (roofType === 'dome') {
    const dome = new THREE.Mesh(new THREE.SphereGeometry(Math.min(w, d) * 0.45, 8, 6), roofMat);
    dome.position.y = h + 0.15;
    house.add(dome);
  } else if (roofType === 'flat') {
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(w * 1.06, 0.16, d * 1.06), roofMat);
    parapet.position.y = h + 0.08;
    house.add(parapet);
  } else {
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(Math.max(w, d) * 0.76, h * 0.55, 4),
      roofMat
    );
    roof.rotation.y = Math.PI / 4;
    roof.position.y = h + h * 0.27;
    house.add(roof);
  }

  parent.add(house);
  return house;
}

export function createStageProp(type) {
  const g = new THREE.Group();

  switch (type) {
    // =========================================================================
    // BARCOS Y NAVÍOS REGIONALES REALISTAS
    // =========================================================================
    case 'ships':
    case 'classic_steamer': {
      // Vapor clásico de época con casco ahusado, cubierta blanca y 2 chimeneas humeantes
      const hull = buildShipHull(2.7, 0.78, 0.5, MATS.basalt, MATS.red);
      g.add(hull);

      const deckHouse = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.38, 0.58), MATS.marble);
      deckHouse.position.set(0, 0.68, 0);
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.32, 0.52), MATS.marble);
      bridge.position.set(-0.35, 0.98, 0);
      g.add(deckHouse, bridge);

      [-0.1, 0.32].forEach((fx, i) => {
        const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.62, 7), MATS.gold);
        funnel.position.set(fx, 1.1, 0);
        funnel.rotation.z = -0.15;
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.14, 7), MATS.basalt);
        rim.position.set(fx + 0.03, 1.38, 0);
        rim.rotation.z = -0.15;
        const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(0.2 + i * 0.05, 0), MATS.steam);
        puff.position.set(fx + 0.22, 1.62 + i * 0.12, 0);
        g.add(funnel, rim, puff);
      });

      [-0.85, 0.85].forEach((mx) => {
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 1.25, 5), MATS.woodWarm);
        mast.position.set(mx, 1.05, 0);
        g.add(mast);
      });
      break;
    }

    case 'sailboat_yacht': {
      // Velero con casco blanco y azul y dos velas triangulares
      const hull = buildShipHull(2.0, 0.62, 0.4, MATS.marble, MATS.blueDome);
      g.add(hull);

      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 1.95, 6), MATS.woodWarm);
      mast.position.set(-0.05, 1.25, 0);
      const mainSail = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.55, 3), MATS.marble);
      mainSail.position.set(0.28, 1.25, 0);
      mainSail.rotation.z = -0.15;
      const jibSail = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.25, 3), MATS.red);
      jibSail.position.set(-0.42, 1.15, 0);
      jibSail.rotation.z = 0.22;
      g.add(mast, mainSail, jibSail);
      break;
    }

    case 'arabian_dhows': {
      // Dhow árabe tradicional de madera con gran vela latina triangular
      const hull = buildShipHull(2.2, 0.68, 0.45, MATS.woodWarm, MATS.gold);
      g.add(hull);

      const sternCastle = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.56), MATS.woodDark);
      sternCastle.position.set(0.45, 0.62, 0);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.75, 6), MATS.woodDark);
      mast.position.set(-0.1, 1.15, 0);
      mast.rotation.z = 0.14;
      const lateenSail = new THREE.Mesh(new THREE.ConeGeometry(0.78, 1.75, 3), MATS.stoneCream);
      lateenSail.position.set(0.05, 1.32, 0);
      lateenSail.rotation.z = -0.35;
      g.add(sternCastle, mast, lateenSail);
      break;
    }

    case 'asian_junk': {
      // Junco tradicional asiático con velas rojas nervadas
      const hull = buildShipHull(2.25, 0.72, 0.46, MATS.woodDark, MATS.ochre);
      g.add(hull);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.4, 0.58), MATS.woodWarm);
      cabin.position.set(0.42, 0.65, 0);
      [-0.35, 0.22].forEach((sx, idx) => {
        const h = idx === 0 ? 1.45 : 1.2;
        const sail = new THREE.Mesh(new THREE.BoxGeometry(0.55, h * 0.7, 0.08), MATS.red);
        sail.position.set(sx, 0.95, 0);
        sail.rotation.y = 0.18;
        const batten = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.11), MATS.gold);
        batten.position.set(sx, 0.95, 0);
        batten.rotation.y = 0.18;
        g.add(sail, batten);
      });
      break;
    }

    case 'cargo_ships': {
      // Buque mercante transoceánico con puente en popa y contenedores
      const hull = buildShipHull(3.2, 0.85, 0.55, MATS.navyHull, MATS.red);
      g.add(hull);

      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.85, 0.68), MATS.marble);
      bridge.position.set(0.75, 0.92, 0);
      const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.45, 6), MATS.orange);
      funnel.position.set(0.88, 1.45, 0);

      const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.38, 0.64), MATS.red);
      c1.position.set(-0.45, 0.72, 0);
      const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.38, 0.64), MATS.gold);
      c2.position.set(0.15, 0.72, 0);
      const c3 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.34, 0.62), MATS.turquoise);
      c3.position.set(-0.45, 1.06, 0);
      g.add(bridge, funnel, c1, c2, c3);
      break;
    }

    case 'fishing_trawler': {
      // Pesquero del Atlántico Norte / Ártico
      const hull = buildShipHull(2.15, 0.74, 0.5, MATS.blueDome, MATS.red);
      g.add(hull);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 0.55), MATS.marble);
      cabin.position.set(-0.2, 0.75, 0);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.12, 0.6), MATS.orange);
      roof.position.set(-0.2, 1.06, 0);
      const derrick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 1.25, 5), MATS.gold);
      derrick.position.set(0.35, 1.05, 0);
      derrick.rotation.z = -0.25;
      g.add(cabin, roof, derrick);
      break;
    }

    // =========================================================================
    // EDIFICIOS PEQUEÑOS CARACTERÍSTICOS POR CIUDAD (2+ EDIFICIOS POR GRUPO)
    // =========================================================================
    case 'london_buildings': {
      addSmallHouse(g, -0.65, 0, 0.95, 1.35, 0.85, MATS.brickRed, MATS.stoneDark, 'gable');
      addSmallHouse(g, 0.6, -0.15, 0.9, 1.15, 0.8, MATS.stoneCream, MATS.woodDark, 'gable');
      // Cabina telefónica roja londinense
      const booth = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.62, 0.28), MATS.red);
      booth.position.set(0.0, 0.31, 0.45);
      g.add(booth);
      break;
    }

    case 'paris_buildings': {
      addSmallHouse(g, -0.6, 0, 1.1, 1.5, 0.9, MATS.stoneCream, MATS.stoneDark, 'gable');
      addSmallHouse(g, 0.65, -0.1, 0.95, 1.25, 0.85, MATS.stoneLight, MATS.stoneGrey, 'gable');
      const awning = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 0.28), MATS.red);
      awning.position.set(-0.6, 0.48, 0.52);
      g.add(awning);
      break;
    }

    case 'rome_buildings': {
      addSmallHouse(g, -0.6, 0, 1.1, 1.2, 0.9, MATS.ochre, MATS.terracotta, 'gable');
      addSmallHouse(g, 0.65, -0.1, 0.9, 1.05, 0.85, MATS.stoneCream, MATS.terracotta, 'dome');
      break;
    }

    case 'athens_buildings': {
      addSmallHouse(g, -0.6, 0, 0.95, 1.1, 0.85, MATS.marble, MATS.blueDome, 'dome');
      addSmallHouse(g, 0.6, -0.1, 0.9, 0.95, 0.8, MATS.marble, MATS.blueDome, 'flat');
      break;
    }

    case 'cairo_buildings': {
      addSmallHouse(g, -0.6, 0, 1.0, 1.25, 0.85, MATS.sandGold, MATS.ochre, 'flat');
      addSmallHouse(g, 0.62, -0.1, 0.88, 1.0, 0.8, MATS.ochre, MATS.gold, 'dome');
      break;
    }

    case 'baghdad_buildings': {
      addSmallHouse(g, -0.6, 0, 1.05, 1.2, 0.85, MATS.sandGold, MATS.gold, 'dome');
      addSmallHouse(g, 0.62, -0.1, 0.85, 1.1, 0.8, MATS.stoneCream, MATS.turquoise, 'dome');
      break;
    }

    case 'bombay_buildings': {
      addSmallHouse(g, -0.6, 0, 1.05, 1.35, 0.88, MATS.ochre, MATS.canyonRed, 'dome');
      addSmallHouse(g, 0.62, -0.1, 0.9, 1.15, 0.82, MATS.stoneCream, MATS.terracotta, 'gable');
      break;
    }

    case 'calcutta_buildings': {
      addSmallHouse(g, -0.6, 0, 1.1, 1.3, 0.9, MATS.marble, MATS.stoneLight, 'flat');
      addSmallHouse(g, 0.65, -0.1, 0.9, 1.1, 0.85, MATS.stoneLight, MATS.jungleLeaf, 'dome');
      break;
    }

    case 'bangkok_buildings': {
      addSmallHouse(g, -0.6, 0, 0.95, 1.15, 0.85, MATS.stoneCream, MATS.red, 'gable');
      addSmallHouse(g, 0.6, -0.1, 0.85, 1.25, 0.8, MATS.gold, MATS.red, 'gable');
      break;
    }

    case 'singapore_buildings': {
      addSmallHouse(g, -0.6, 0, 0.9, 1.65, 0.85, MATS.blueDome, MATS.stoneLight, 'flat');
      addSmallHouse(g, 0.6, -0.1, 0.95, 1.15, 0.82, MATS.turquoise, MATS.terracotta, 'gable');
      break;
    }

    case 'manila_buildings': {
      addSmallHouse(g, -0.6, 0, 1.05, 1.25, 0.88, MATS.stoneCream, MATS.terracotta, 'gable');
      addSmallHouse(g, 0.62, -0.1, 0.88, 1.1, 0.82, MATS.stoneGrey, MATS.woodDark, 'gable');
      break;
    }

    case 'tokyo_buildings': {
      addSmallHouse(g, -0.6, 0, 1.0, 1.15, 0.85, MATS.stoneCream, MATS.basalt, 'gable');
      addSmallHouse(g, 0.62, -0.1, 0.88, 1.35, 0.82, MATS.red, MATS.basalt, 'gable');
      break;
    }

    case 'midway_buildings': {
      addSmallHouse(g, -0.6, 0, 1.0, 0.95, 0.82, MATS.marble, MATS.orange, 'gable');
      addSmallHouse(g, 0.6, -0.1, 0.88, 0.85, 0.78, MATS.stoneLight, MATS.blueDome, 'flat');
      break;
    }

    case 'honolulu_buildings': {
      addSmallHouse(g, -0.6, 0, 0.95, 0.95, 0.85, MATS.woodWarm, MATS.ochre, 'gable');
      addSmallHouse(g, 0.6, -0.1, 0.88, 0.85, 0.8, MATS.stoneCream, MATS.woodWarm, 'gable');
      break;
    }

    case 'san_francisco_buildings': {
      addSmallHouse(g, -0.58, 0, 0.88, 1.45, 0.85, MATS.iceCyan, MATS.red, 'gable');
      addSmallHouse(g, 0.58, -0.05, 0.88, 1.38, 0.85, MATS.sandGold, MATS.brickRed, 'gable');
      break;
    }

    case 'new_york_buildings': {
      addSmallHouse(g, -0.6, 0, 0.95, 1.75, 0.88, MATS.canyonRed, MATS.stoneDark, 'flat');
      addSmallHouse(g, 0.62, -0.1, 0.95, 1.45, 0.85, MATS.stoneGrey, MATS.basalt, 'flat');
      break;
    }

    case 'newfoundland_buildings': {
      addSmallHouse(g, -0.58, 0, 0.9, 1.15, 0.82, MATS.red, MATS.marble, 'gable');
      addSmallHouse(g, 0.58, -0.08, 0.9, 1.1, 0.82, MATS.blueDome, MATS.gold, 'gable');
      break;
    }

    case 'greenland_buildings': {
      addSmallHouse(g, -0.58, 0, 0.92, 1.1, 0.82, MATS.brickRed, MATS.iceWhite, 'gable');
      addSmallHouse(g, 0.58, -0.08, 0.88, 1.0, 0.8, MATS.blueDome, MATS.iceWhite, 'gable');
      break;
    }

    case 'reykjavik_buildings': {
      addSmallHouse(g, -0.58, 0, 0.92, 1.15, 0.82, MATS.marble, MATS.red, 'gable');
      addSmallHouse(g, 0.58, -0.08, 0.88, 1.1, 0.8, MATS.stoneLight, MATS.greenLeaf, 'gable');
      break;
    }

    case 'dublin_buildings': {
      addSmallHouse(g, -0.6, 0, 0.98, 1.3, 0.85, MATS.canyonRed, MATS.stoneDark, 'gable');
      addSmallHouse(g, 0.62, -0.08, 0.9, 1.15, 0.82, MATS.stoneGrey, MATS.greenLeaf, 'gable');
      break;
    }

    // =========================================================================
    // GRANJAS, MOLINOS Y CONSTRUCCIONES RURALES DE TRAVESÍA
    // =========================================================================
    case 'countryside_farm': {
      // Granero rojo + silo cilíndrico plateado + casita de granja
      addSmallHouse(g, -0.55, 0, 1.15, 1.1, 0.92, MATS.red, MATS.marble, 'gable');
      const silo = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.55, 8), MATS.stoneLight);
      silo.position.set(0.28, 0.77, -0.15);
      const siloDome = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 6), MATS.marble);
      siloDome.position.set(0.28, 1.55, -0.15);
      addSmallHouse(g, 0.88, 0.1, 0.75, 0.82, 0.72, MATS.stoneCream, MATS.terracotta, 'gable');
      g.add(silo, siloDome);
      break;
    }

    case 'windmill_farm': {
      // Molino tradicional con aspas y granero anexo
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.56, 1.65, 8), MATS.stoneCream);
      tower.position.set(-0.35, 0.82, 0);
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.44, 0.45, 8), MATS.woodDark);
      cap.position.set(-0.35, 1.85, 0);
      for (let i = 0; i < 4; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.55, 0.05), MATS.marble);
        blade.position.set(-0.35, 1.55, 0.44);
        blade.rotation.z = (i * Math.PI) / 4 + 0.35;
        g.add(blade);
      }
      addSmallHouse(g, 0.58, -0.1, 0.85, 0.85, 0.75, MATS.ochre, MATS.terracotta, 'gable');
      g.add(tower, cap);
      break;
    }

    case 'vineyard_estate': {
      // Masía / villa mediterránea con hileras de viñedos
      addSmallHouse(g, -0.45, 0, 1.1, 1.15, 0.88, MATS.stoneCream, MATS.terracotta, 'gable');
      for (let i = 0; i < 3; i++) {
        const vineRow = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.32, 0.22), MATS.limeLeaf);
        vineRow.position.set(0.65, 0.16, -0.3 + i * 0.32);
        g.add(vineRow);
      }
      break;
    }

    case 'desert_caravanserai': {
      // Caravanserai / puesto de oasis con cúpula y torre vigía
      addSmallHouse(g, -0.45, 0, 1.1, 0.95, 0.88, MATS.sandGold, MATS.gold, 'dome');
      const watchtower = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.45, 0.55), MATS.ochre);
      watchtower.position.set(0.55, 0.72, -0.1);
      g.add(watchtower);
      break;
    }

    case 'rural_stilt_village': {
      // Cabañas rurales tropicales sobre pilotes de madera
      [-0.55, 0.55].forEach((hx, idx) => {
        const hut = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.65, 0.72), MATS.woodWarm);
        hut.position.set(hx, 0.65, idx * -0.1);
        const roof = new THREE.Mesh(new THREE.ConeGeometry(0.68, 0.55, 4), MATS.ochre);
        roof.rotation.y = Math.PI / 4;
        roof.position.set(hx, 1.25, idx * -0.1);
        g.add(hut, roof);
      });
      break;
    }

    case 'alpine_chalet': {
      // Chalet de montaña con tejado nevado
      addSmallHouse(g, -0.4, 0, 1.15, 1.0, 0.9, MATS.woodWarm, MATS.iceWhite, 'gable');
      addSmallHouse(g, 0.65, -0.15, 0.75, 0.8, 0.7, MATS.woodDark, MATS.iceWhite, 'gable');
      break;
    }

    // =========================================================================
    // ELEMENTOS NATURALES Y PAISAJÍSTICOS DE TRAVESÍA
    // =========================================================================
    case 'english_trees': {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.65, 5), MATS.trunk);
      trunk.position.y = 0.32;
      const low = new THREE.Mesh(new THREE.ConeGeometry(0.72, 1.05, 6), MATS.greenLeaf);
      low.position.y = 0.98;
      low.castShadow = true;
      const top = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.85, 6), MATS.greenLeaf);
      top.position.y = 1.62;
      top.castShadow = true;
      g.add(trunk, low, top);
      break;
    }

    case 'french_poplars': {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.7, 5), MATS.trunk);
      trunk.position.y = 0.35;
      const crown = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.9, 6), MATS.limeLeaf);
      crown.position.y = 1.45;
      crown.castShadow = true;
      g.add(trunk, crown);
      break;
    }

    case 'cottage':
    case 'irish_cottages': {
      addSmallHouse(
        g,
        -0.45,
        0,
        1.0,
        0.9,
        0.85,
        MATS.marble,
        type === 'irish_cottages' ? MATS.stoneDark : MATS.terracotta,
        'gable'
      );
      addSmallHouse(g, 0.55, -0.1, 0.8, 0.78, 0.75, MATS.stoneCream, MATS.woodWarm, 'gable');
      break;
    }

    case 'channel_buoys':
    case 'fog_buoys': {
      const floatBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 0.35, 6), MATS.red);
      floatBase.position.y = 0.15;
      const tower = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.9, 4), MATS.marble);
      tower.position.y = 0.72;
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.15, 6, 6), MATS.windowGlow);
      beacon.position.y = 1.25;
      g.add(floatBase, tower, beacon);
      break;
    }

    case 'alpine_peaks':
    case 'snow_peaks': {
      const h = 1.9 + Math.random() * 0.9;
      const rock = new THREE.Mesh(new THREE.ConeGeometry(1.1, h, 5), MATS.stoneGrey);
      rock.position.y = h * 0.5;
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.58, h * 0.45, 5), MATS.iceWhite);
      cap.position.y = h * 0.78;
      g.add(rock, cap);
      break;
    }

    case 'pine_trees':
    case 'boreal_pines': {
      const leafMat = type === 'boreal_pines' ? MATS.borealLeaf : MATS.cypressLeaf;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 0.55, 5), MATS.trunk);
      trunk.position.y = 0.27;
      for (let i = 0; i < 3; i++) {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.68 - i * 0.15, 0.85, 6), leafMat);
        cone.position.y = 0.75 + i * 0.48;
        g.add(cone);
      }
      g.add(trunk);
      break;
    }

    case 'italian_cypress': {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.5, 5), MATS.trunk);
      trunk.position.y = 0.25;
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.34, 2.1, 6), MATS.cypressLeaf);
      spire.position.y = 1.45;
      g.add(trunk, spire);
      break;
    }

    case 'roman_ruins':
    case 'greek_columns': {
      const col1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 1.5, 7), MATS.marble);
      col1.position.set(-0.35, 0.75, 0);
      const col2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 1.0, 7), MATS.marble);
      col2.position.set(0.35, 0.5, 0);
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.22, 0.35), MATS.stoneLight);
      beam.position.set(-0.15, 1.58, 0);
      g.add(col1, col2, beam);
      break;
    }

    case 'med_islands': {
      const rock = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.35, 1.1, 6), MATS.stoneLight);
      rock.position.y = 0.55;
      const house = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 0.6), MATS.marble);
      house.position.set(0, 1.35, 0);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), MATS.blueDome);
      dome.position.set(0, 1.65, 0);
      g.add(rock, house, dome);
      break;
    }

    case 'oasis_palms': {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, 1.65, 6), MATS.trunk);
      trunk.position.y = 0.82;
      trunk.rotation.z = 0.08;
      g.add(trunk);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.85, 4), MATS.greenLeaf);
        leaf.position.set(Math.cos(a) * 0.32 - 0.06, 1.65, Math.sin(a) * 0.32);
        leaf.rotation.z = -Math.cos(a) * 1.1;
        leaf.rotation.x = Math.sin(a) * 1.1;
        g.add(leaf);
      }
      break;
    }

    case 'sand_dunes': {
      const dune = new THREE.Mesh(new THREE.ConeGeometry(1.45, 1.25, 4), MATS.sandGold);
      dune.rotation.y = Math.PI / 4;
      dune.position.y = 0.62;
      g.add(dune);
      break;
    }

    case 'clay_mesa':
    case 'canyon_buttes':
    case 'western_mesas': {
      const matChoice = type === 'clay_mesa' ? MATS.terracotta : MATS.canyonRed;
      const h = 1.4 + Math.random() * 0.85;
      const mesa = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 1.15, h, 6), matChoice);
      mesa.position.y = h * 0.5;
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.78, 0.25, 6), MATS.sandGold);
      cap.position.y = h + 0.1;
      g.add(mesa, cap);
      break;
    }

    case 'river_reeds': {
      for (let i = -1; i <= 1; i++) {
        const stalk = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.95, 5), MATS.limeLeaf);
        stalk.position.set(i * 0.28, 0.45, (i % 2) * 0.15);
        g.add(stalk);
      }
      break;
    }

    case 'arabian_domes': {
      addSmallHouse(g, -0.5, 0, 0.95, 0.9, 0.85, MATS.sandGold, MATS.gold, 'dome');
      addSmallHouse(g, 0.55, -0.1, 0.8, 0.8, 0.75, MATS.stoneCream, MATS.turquoise, 'dome');
      break;
    }

    case 'banyan_trees':
    case 'mangroves': {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 0.75, 6), MATS.trunk);
      trunk.position.y = 0.37;
      const c1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85, 0), MATS.jungleLeaf);
      c1.position.set(0, 1.15, 0);
      const c2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.62, 0), MATS.greenLeaf);
      c2.position.set(0.45, 0.95, 0.15);
      g.add(trunk, c1, c2);
      break;
    }

    case 'stepped_temples': {
      for (let i = 0; i < 3; i++) {
        const w = 1.35 - i * 0.34;
        const step = new THREE.Mesh(
          new THREE.BoxGeometry(w, 0.55, w),
          i % 2 === 0 ? MATS.gold : MATS.jungleLeaf
        );
        step.position.y = 0.28 + i * 0.55;
        g.add(step);
      }
      const pinnacle = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.65, 5), MATS.gold);
      pinnacle.position.y = 1.95;
      g.add(pinnacle);
      break;
    }

    case 'thai_pagodas': {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.78, 0.7, 8), MATS.marble);
      base.position.y = 0.35;
      const bell = new THREE.Mesh(new THREE.ConeGeometry(0.52, 1.35, 8), MATS.gold);
      bell.position.y = 1.35;
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.95, 6), MATS.gold);
      spire.position.y = 2.4;
      g.add(base, bell, spire);
      break;
    }

    case 'archipelago_islets': {
      const rock = new THREE.Mesh(new THREE.ConeGeometry(1.05, 1.5, 6), MATS.stoneDark);
      rock.position.y = 0.75;
      const greenery = new THREE.Mesh(new THREE.DodecahedronGeometry(0.68, 0), MATS.jungleLeaf);
      greenery.position.y = 1.35;
      g.add(rock, greenery);
      break;
    }

    case 'volcanic_islands':
    case 'hawaiian_volcanoes': {
      const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 1.45, 1.85, 7), MATS.basalt);
      cone.position.y = 0.92;
      const lava = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.14, 7), MATS.lavaGlow);
      lava.position.y = 1.85;
      const smoke1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38, 0), MATS.steam);
      smoke1.position.set(0, 2.35, 0);
      const smoke2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.52, 0), MATS.steam);
      smoke2.position.set(-0.25, 2.9, 0);
      g.add(cone, lava, smoke1, smoke2);
      break;
    }

    case 'sakura_trees': {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.7, 5), MATS.trunk);
      trunk.position.y = 0.35;
      const p1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75, 0), MATS.sakuraPink);
      p1.position.set(0, 1.15, 0);
      const p2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 0), MATS.sakuraLight);
      p2.position.set(0.4, 1.0, 0.15);
      g.add(trunk, p1, p2);
      break;
    }

    case 'torii_gates': {
      const pL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.45, 6), MATS.red);
      pL.position.set(-0.45, 0.72, 0);
      const pR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.45, 6), MATS.red);
      pR.position.set(0.45, 0.72, 0);
      const bar = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.16, 0.2), MATS.red);
      bar.position.set(0, 1.45, 0);
      g.add(pL, pR, bar);
      break;
    }

    case 'skyscrapers': {
      addSmallHouse(g, -0.55, 0, 0.9, 1.9, 0.85, MATS.stoneDark, MATS.basalt, 'flat');
      addSmallHouse(g, 0.55, -0.1, 0.85, 1.45, 0.8, MATS.stoneGrey, MATS.stoneLight, 'flat');
      break;
    }

    case 'coral_atolls': {
      const sand = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.5, 0.28, 8), MATS.windowGlow);
      sand.position.y = 0.14;
      const lagoon = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.32, 8), MATS.turquoise);
      lagoon.position.y = 0.15;
      g.add(sand, lagoon);
      break;
    }

    case 'red_bridge_towers': {
      const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.65, 2.7, 0.45), MATS.red);
      pylon.position.y = 1.35;
      const cross = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.24, 0.5), MATS.red);
      cross.position.y = 2.1;
      g.add(pylon, cross);
      break;
    }

    case 'prairie_windmills': {
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.32, 1.7, 4), MATS.trunk);
      mast.position.y = 0.85;
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.1, 8), MATS.stoneLight);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(0, 1.7, 0.15);
      addSmallHouse(g, 0.7, 0, 0.85, 0.85, 0.75, MATS.red, MATS.marble, 'gable');
      g.add(mast, wheel);
      break;
    }

    case 'icebergs':
    case 'glacier_spires': {
      const h = 1.6 + Math.random() * 1.1;
      const berg1 = new THREE.Mesh(new THREE.ConeGeometry(0.95, h, 5), MATS.iceWhite);
      berg1.position.y = h * 0.5;
      const berg2 = new THREE.Mesh(new THREE.ConeGeometry(0.65, h * 0.72, 5), MATS.iceCyan);
      berg2.position.set(0.55, h * 0.35, 0.2);
      g.add(berg1, berg2);
      break;
    }

    case 'geysers': {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.75, 0.6, 6), MATS.basalt);
      cone.position.y = 0.3;
      const p1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.36, 0), MATS.steam);
      p1.position.set(0, 1.0, 0);
      const p2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5, 0), MATS.steam);
      p2.position.set(0, 1.65, 0);
      g.add(cone, p1, p2);
      break;
    }

    case 'lava_rocks': {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75, 0), MATS.basalt);
      rock.position.y = 0.45;
      const crack = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.18, 0.85), MATS.lavaGlow);
      crack.position.y = 0.25;
      g.add(rock, crack);
      break;
    }

    case 'sea_cliffs': {
      const cliff = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 1.1), MATS.stoneDark);
      cliff.position.y = 0.9;
      const turf = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.25, 1.15), MATS.greenLeaf);
      turf.position.y = 1.9;
      g.add(cliff, turf);
      break;
    }

    default: {
      const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 0), MATS.greenLeaf);
      bush.position.y = 0.45;
      g.add(bush);
      break;
    }
  }

  return g;
}
