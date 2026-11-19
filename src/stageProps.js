import * as THREE from 'three';

const MATS = {
  trunk: new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85, flatShading: true }),
  greenLeaf: new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.65, flatShading: true }),
  limeLeaf: new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.65, flatShading: true }),
  cypressLeaf: new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.7, flatShading: true }),
  borealLeaf: new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.75, flatShading: true }),
  jungleLeaf: new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.65, flatShading: true }),
  sakuraPink: new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.55, flatShading: true }),
  sakuraLight: new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.55, flatShading: true }),
  stoneLight: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6, flatShading: true }),
  stoneGrey: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8, flatShading: true }),
  stoneDark: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85, flatShading: true }),
  basalt: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9, flatShading: true }),
  marble: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45, flatShading: true }),
  sandGold: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.78, flatShading: true }),
  terracotta: new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.8, flatShading: true }),
  canyonRed: new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.82, flatShading: true }),
  gold: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.45, flatShading: true }),
  red: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5, flatShading: true }),
  blueDome: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.45, flatShading: true }),
  turquoise: new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.35, flatShading: true }),
  iceWhite: new THREE.MeshStandardMaterial({ color: 0xf0f9ff, roughness: 0.35, flatShading: true }),
  iceCyan: new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, flatShading: true }),
  lavaGlow: new THREE.MeshBasicMaterial({ color: 0xf97316 }),
  windowGlow: new THREE.MeshBasicMaterial({ color: 0xfef08a }),
  steam: new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.5,
    transparent: true,
    opacity: 0.8,
    flatShading: true
  })
};

export function createStageProp(type) {
  const g = new THREE.Group();

  switch (type) {
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
      const wall = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.85, 0.9), MATS.marble);
      wall.position.y = 0.42;
      const roofMat = type === 'irish_cottages' ? MATS.stoneDark : MATS.terracotta;
      const roof = new THREE.Mesh(new THREE.ConeGeometry(0.88, 0.65, 4), roofMat);
      roof.rotation.y = Math.PI / 4;
      roof.position.y = 1.15;
      g.add(wall, roof);
      break;
    }

    case 'paris_buildings': {
      const h = 1.5 + Math.random() * 0.9;
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, h, 1.0), MATS.stoneLight);
      body.position.y = h * 0.5;
      const roof = new THREE.Mesh(new THREE.ConeGeometry(0.95, 0.55, 4), MATS.stoneDark);
      roof.rotation.y = Math.PI / 4;
      roof.position.y = h + 0.27;
      g.add(body, roof);
      break;
    }

    case 'ships':
    case 'cargo_ships': {
      const isCargo = type === 'cargo_ships';
      const hullLen = isCargo ? 2.6 : 1.8;
      const hull = new THREE.Mesh(
        new THREE.BoxGeometry(hullLen, 0.5, 0.75),
        isCargo ? MATS.stoneDark : MATS.red
      );
      hull.position.y = 0.22;
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.45, 0.6), MATS.marble);
      cabin.position.set(-0.2, 0.65, 0);
      const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.55, 6), MATS.gold);
      funnel.position.set(0.2, 0.75, 0);
      g.add(hull, cabin, funnel);
      if (isCargo) {
        const container = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.62), MATS.blueDome);
        container.position.set(0.65, 0.6, 0);
        g.add(container);
      }
      break;
    }

    case 'arabian_dhows': {
      const hull = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.42, 0.65), MATS.trunk);
      hull.position.y = 0.2;
      const sail = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.55, 3), MATS.marble);
      sail.position.set(0, 1.1, 0);
      sail.rotation.z = -0.15;
      g.add(hull, sail);
      break;
    }

    case 'channel_buoys':
    case 'fog_buoys': {
      const floatBase = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.25, 0.35, 6), MATS.red);
      floatBase.position.y = 0.15;
      const tower = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.85, 4), MATS.marble);
      tower.position.y = 0.7;
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 6), MATS.windowGlow);
      beacon.position.y = 1.2;
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
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(0.68 - i * 0.15, 0.85, 6),
          leafMat
        );
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
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.85, 0.9), MATS.sandGold);
      base.position.y = 0.42;
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.46, 8, 8), MATS.gold);
      dome.position.y = 0.98;
      g.add(base, dome);
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
      const h = 1.8 + Math.random() * 1.6;
      const tower = new THREE.Mesh(new THREE.BoxGeometry(1.05, h, 1.0), MATS.stoneDark);
      tower.position.y = h * 0.5;
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 1.04), MATS.windowGlow);
      win.position.y = h * 0.72;
      g.add(tower, win);
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
