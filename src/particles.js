import * as THREE from 'three';

export function createParticleSystem(scene) {
  const group = new THREE.Group();
  scene.add(group);

  const particles = [];
  const smokeGeo = new THREE.DodecahedronGeometry(0.22, 0);
  const sparkGeo = new THREE.OctahedronGeometry(0.2, 0);

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

  function update(dt, scrollSpeed) {
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
      p.mesh.material.opacity = ratio;
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
  }

  return {
    group,
    spawnSmoke,
    spawnBurst,
    update,
    clear
  };
}
