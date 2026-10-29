import * as THREE from 'three';
import { CONFIG } from './config.js';
import { hitsCoin } from './collision.js';

function createStarGeometry() {
  const shape = new THREE.Shape();
  const outerRadius = 0.3;
  const innerRadius = 0.13;
  const points = 5;

  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: false });
  geometry.translate(0, 0, -0.02);
  return geometry;
}

function createGlowTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255, 247, 200, 0.95)');
  gradient.addColorStop(0.35, 'rgba(255, 210, 70, 0.5)');
  gradient.addColorStop(1, 'rgba(255, 170, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createCoinSystem(scene) {
  const group = new THREE.Group();
  scene.add(group);

  const coins = [];

  const bodyGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 28);
  bodyGeo.rotateX(Math.PI / 2);
  const rimGeo = new THREE.TorusGeometry(0.6, 0.09, 8, 28);
  const faceGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.34, 24);
  faceGeo.rotateX(Math.PI / 2);
  const starGeo = createStarGeometry();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xffc928,
    metalness: 0.4,
    roughness: 0.18,
    emissive: 0xff9f1c,
    emissiveIntensity: 0.45
  });
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xffe066,
    metalness: 0.5,
    roughness: 0.14,
    emissive: 0xffb300,
    emissiveIntensity: 0.5
  });
  const faceMat = new THREE.MeshStandardMaterial({
    color: 0xffd84d,
    metalness: 0.35,
    roughness: 0.22,
    emissive: 0xffa500,
    emissiveIntensity: 0.4
  });
  const starMat = new THREE.MeshStandardMaterial({
    color: 0xfff7cc,
    metalness: 0.25,
    roughness: 0.3,
    emissive: 0xfff1a8,
    emissiveIntensity: 0.6
  });
  const glowMat = new THREE.SpriteMaterial({
    map: createGlowTexture(),
    color: 0xffe066,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false
  });

  function spawn(obstacle) {
    const mesh = new THREE.Group();

    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    const rim = new THREE.Mesh(rimGeo, rimMat);
    const face = new THREE.Mesh(faceGeo, faceMat);

    const starFront = new THREE.Mesh(starGeo, starMat);
    starFront.position.z = 0.185;
    const starBack = new THREE.Mesh(starGeo, starMat);
    starBack.position.z = -0.185;
    starBack.rotation.y = Math.PI;

    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(2.4, 2.4, 1);

    mesh.add(body, rim, face, starFront, starBack, glow);
    mesh.rotation.y = Math.random() * Math.PI * 2;
    group.add(mesh);

    const coin = {
      mesh,
      obstacle,
      phase: Math.random() * Math.PI * 2
    };
    coins.push(coin);
    return coin;
  }

  function move(dt, elapsedTime) {
    for (const coin of coins) {
      const obstacle = coin.obstacle;
      if (!obstacle) continue;

      // La moneda vive en el centro del hueco: sigue al obstáculo tanto en
      // horizontal como en su oscilación vertical.
      coin.mesh.position.x = obstacle.mesh.position.x;
      coin.mesh.position.y = obstacle.gapY + Math.sin(elapsedTime * 2.4 + coin.phase) * 0.08;
      coin.mesh.rotation.y += 4.4 * dt;
    }
  }

  function collect(planeX, planeY, planeRadius) {
    const picked = [];
    for (let i = coins.length - 1; i >= 0; i--) {
      const coin = coins[i];
      const mesh = coin.mesh;
      if (
        hitsCoin(
          planeX,
          planeY,
          planeRadius,
          mesh.position.x,
          mesh.position.y,
          CONFIG.coinRadius
        )
      ) {
        picked.push({ x: mesh.position.x, y: mesh.position.y });
        group.remove(mesh);
        coins.splice(i, 1);
      }
    }
    return picked;
  }

  function cleanup() {
    for (let i = coins.length - 1; i >= 0; i--) {
      const coin = coins[i];
      if (coin.mesh.position.x < CONFIG.obstacleDespawnX) {
        group.remove(coin.mesh);
        coins.splice(i, 1);
      }
    }
  }

  function clear() {
    for (const coin of coins) {
      group.remove(coin.mesh);
    }
    coins.length = 0;
  }

  return {
    group,
    coins,
    spawn,
    move,
    collect,
    cleanup,
    clear
  };
}
