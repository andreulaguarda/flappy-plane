import * as THREE from 'three';

export function createParticleSystem(scene) {
  const group = new THREE.Group();
  scene.add(group);

  const particles = [];
  const smokeGeo = new THREE.DodecahedronGeometry(0.22, 0);
  const sparkGeo = new THREE.OctahedronGeometry(0.2, 0);
  const ambientGeo = new THREE.OctahedronGeometry(0.16, 0);

  let ambientMode = null;
  let ambientTimer = 0;

  function spawnSmoke(x, y, z) {
    const mat = new THREE.MeshBasicMaterial({
      color: 0xf1f5f9,
      transparent: true,
      opacity: 0.75
    });
    const mesh = new THREE.Mesh(smokeGeo, mat);
    mesh.position.set(x, y + (Math.random() - 0.5) * 0.15, z + (Math.random() - 0.5) * 0.15);
    group.add(mesh);

    particles.push({
      mesh,
      vx: -2.8 - Math.random() * 1.5,
      vy: (Math.random() - 0.5) * 0.8,
      vz: (Math.random() - 0.5) * 0.8,
      life: 0.55,
      maxLife: 0.55,
      grow: 1.8
    });
  }

  function spawnBurst(x, y, z, colors, count = 20) {
    for (let i = 0; i < count; i++) {
      const col = colors[i % colors.length];
      const mat = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 1
      });
      const mesh = new THREE.Mesh(sparkGeo, mat);
      mesh.position.set(x, y, z);
      group.add(mesh);

      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 7.5;
      particles.push({
        mesh,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 1.5,
        vz: (Math.random() - 0.5) * 6,
        life: 0.75 + Math.random() * 0.35,
        maxLife: 0.9,
        grow: -0.5
      });
    }
  }

  function spawnAmbientParticle(mode) {
    let color = 0xffffff;
    let x = -14 + Math.random() * 34;
    let y = -6 + Math.random() * 14;
    let z = -3 + Math.random() * 6;
    let vx = -2;
    let vy = -1;
    let life = 2.2;
    let grow = 0.2;
    let geo = ambientGeo;

    if (mode === 'snow') {
      color = Math.random() > 0.3 ? 0xffffff : 0xe0f2fe;
      x = -12 + Math.random() * 34;
      y = 9.5 + Math.random() * 2;
      vx = -2.2 - Math.random() * 2.0;
      vy = -3.2 - Math.random() * 1.8;
      life = 3.2;
      grow = -0.2;
    } else if (mode === 'sand') {
      color = Math.random() > 0.4 ? 0xfdba74 : 0xd97706;
      x = 18 + Math.random() * 8;
      y = -7.2 + Math.random() * 12;
      vx = -8.5 - Math.random() * 5.0;
      vy = (Math.random() - 0.45) * 1.6;
      life = 2.1;
      grow = 0.5;
    } else if (mode === 'volcano_ash') {
      color = Math.random() > 0.35 ? 0x64748b : 0xf97316;
      x = -8 + Math.random() * 28;
      y = -7.0 + Math.random() * 4;
      vx = -1.8 - Math.random() * 2.0;
      vy = 2.2 + Math.random() * 2.4;
      life = 2.4;
      grow = 1.1;
    } else if (mode === 'mist') {
      color = 0xe2e8f0;
      geo = smokeGeo;
      x = 16 + Math.random() * 8;
      y = -6.5 + Math.random() * 13;
      vx = -3.5 - Math.random() * 2.5;
      vy = (Math.random() - 0.5) * 0.4;
      life = 2.6;
      grow = 2.4;
    } else if (mode === 'geyser_steam') {
      color = 0xe2e8f0;
      geo = smokeGeo;
      x = -6 + Math.random() * 24;
      y = -7.4;
      vx = -1.2 - Math.random() * 1.5;
      vy = 3.0 + Math.random() * 2.5;
      life = 2.0;
      grow = 2.0;
    } else if (mode === 'sakura') {
      color = Math.random() > 0.4 ? 0xf472b6 : 0xfbcfe8;
      x = -8 + Math.random() * 30;
      y = 7.5 + Math.random() * 3;
      vx = -2.5 - Math.random() * 2.0;
      vy = -1.8 - Math.random() * 1.2;
      life = 3.0;
      grow = -0.1;
    } else {
      return;
    }

    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: mode === 'mist' ? 0.38 : 0.82
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    group.add(mesh);

    particles.push({
      mesh,
      vx,
      vy,
      vz: (Math.random() - 0.5) * 0.6,
      life,
      maxLife: life,
      grow,
      baseOpacity: mat.opacity
    });
  }

  function setAmbientMode(mode) {
    ambientMode = mode || null;
  }

  function update(dt, scrollSpeed) {
    if (ambientMode) {
      ambientTimer += dt;
      const interval = ambientMode === 'snow' || ambientMode === 'sand' ? 0.055 : 0.085;
      while (ambientTimer >= interval) {
        ambientTimer -= interval;
        spawnAmbientParticle(ambientMode);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        group.remove(p.mesh);
        p.mesh.material.dispose();
        particles.splice(i, 1);
        continue;
      }
      p.mesh.position.x += (p.vx - scrollSpeed * 0.35) * dt;
      p.mesh.position.y += p.vy * dt;
      p.mesh.position.z += p.vz * dt;
      p.mesh.rotation.x += 4 * dt;
      p.mesh.rotation.y += 4 * dt;

      const ratio = Math.max(0, p.life / p.maxLife);
      const baseOp = p.baseOpacity ?? 1;
      p.mesh.material.opacity = ratio * baseOp;
      const s = Math.max(0.1, 1 + (1 - ratio) * p.grow);
      p.mesh.scale.setScalar(s);
    }
  }

  function clear() {
    for (const p of particles) {
      group.remove(p.mesh);
      p.mesh.material.dispose();
    }
    particles.length = 0;
    ambientTimer = 0;
  }

  return {
    group,
    spawnSmoke,
    spawnBurst,
    setAmbientMode,
    update,
    clear
  };
}
