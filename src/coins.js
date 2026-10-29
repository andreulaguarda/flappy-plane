import * as THREE from 'three';
import { CONFIG } from './config.js';
import { hitsCoin } from './collision.js';

export function createCoinSystem(scene) {
  const group = new THREE.Group();
  scene.add(group);

  const coins = [];

  const bodyGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.14, 18);
  bodyGeo.rotateX(Math.PI / 2);
  const rimGeo = new THREE.TorusGeometry(0.55, 0.06, 6, 18);
  const faceGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.16, 12);
  faceGeo.rotateX(Math.PI / 2);

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.75,
    roughness: 0.22,
    emissive: 0xb45309,
    emissiveIntensity: 0.35,
    flatShading: true
  });
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x92400e,
    emissiveIntensity: 0.3,
    flatShading: true
  });
  const faceMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    metalness: 0.6,
    roughness: 0.3,
    emissive: 0x78350f,
    emissiveIntensity: 0.25,
    flatShading: true
  });

  function spawn(x, y) {
    const mesh = new THREE.Group();
    mesh.position.set(x, y, 0);

    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    const rim = new THREE.Mesh(rimGeo, rimMat);
    const face = new THREE.Mesh(faceGeo, faceMat);

    mesh.add(body, rim, face);
    mesh.rotation.y = Math.random() * Math.PI * 2;
    group.add(mesh);

    const coin = {
      mesh,
      baseY: y,
      phase: Math.random() * Math.PI * 2
    };
    coins.push(coin);
    return coin;
  }

  function move(dt, scrollSpeed, elapsedTime) {
    for (const coin of coins) {
      coin.mesh.position.x -= scrollSpeed * dt;
      coin.mesh.position.y = coin.baseY + Math.sin(elapsedTime * 2.2 + coin.phase) * 0.12;
      coin.mesh.rotation.y += 3.4 * dt;
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
