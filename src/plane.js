import * as THREE from 'three';

export function createPlane() {
  const group = new THREE.Group();

  const redMat = new THREE.MeshStandardMaterial({ color: 0xff3b30, roughness: 0.45, flatShading: true });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5, flatShading: true });
  const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, flatShading: true });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, flatShading: true });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x7dd3fc,
    roughness: 0.15,
    metalness: 0.3,
    transparent: true,
    opacity: 0.82,
    flatShading: true
  });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xfdba74, roughness: 0.6, flatShading: true });

  const bodyGeo = new THREE.CylinderGeometry(0.42, 0.52, 1.55, 8);
  bodyGeo.rotateZ(Math.PI / 2);
  const body = new THREE.Mesh(bodyGeo, redMat);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const stripeGeo = new THREE.CylinderGeometry(0.47, 0.5, 0.42, 8);
  stripeGeo.rotateZ(Math.PI / 2);
  const stripe = new THREE.Mesh(stripeGeo, whiteMat);
  stripe.position.x = -0.05;
  stripe.castShadow = true;
  group.add(stripe);

  const noseGeo = new THREE.CylinderGeometry(0.24, 0.42, 0.42, 8);
  noseGeo.rotateZ(-Math.PI / 2);
  const nose = new THREE.Mesh(noseGeo, yellowMat);
  nose.position.x = 0.96;
  nose.castShadow = true;
  group.add(nose);

  const tailConeGeo = new THREE.CylinderGeometry(0.16, 0.52, 0.85, 8);
  tailConeGeo.rotateZ(Math.PI / 2);
  const tailCone = new THREE.Mesh(tailConeGeo, redMat);
  tailCone.position.x = -1.15;
  tailCone.castShadow = true;
  group.add(tailCone);

  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.68, 0.12), redMat);
  fin.position.set(-1.35, 0.36, 0);
  fin.rotation.z = 0.25;
  fin.castShadow = true;
  group.add(fin);

  const hStab = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.09, 1.35), whiteMat);
  hStab.position.set(-1.32, 0.1, 0);
  hStab.castShadow = true;
  group.add(hStab);

  const topWing = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.1, 2.75), whiteMat);
  topWing.position.set(0.12, 0.68, 0);
  topWing.castShadow = true;
  topWing.receiveShadow = true;
  group.add(topWing);

  const botWing = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.1, 2.45), redMat);
  botWing.position.set(0.08, -0.32, 0);
  botWing.castShadow = true;
  botWing.receiveShadow = true;
  group.add(botWing);

  const strutGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.98, 6);
  [-0.85, 0.85].forEach((zPos) => {
    const strut = new THREE.Mesh(strutGeo, yellowMat);
    strut.position.set(0.1, 0.18, zPos);
    group.add(strut);
  });

  const canopyGeo = new THREE.SphereGeometry(0.32, 8, 6);
  canopyGeo.scale(1.3, 0.85, 0.85);
  const canopy = new THREE.Mesh(canopyGeo, glassMat);
  canopy.position.set(-0.15, 0.38, 0);
  group.add(canopy);

  const pilotHead = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), skinMat);
  pilotHead.position.set(-0.22, 0.44, 0);
  group.add(pilotHead);

  const wheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 10);
  wheelGeo.rotateX(Math.PI / 2);
  [-0.38, 0.38].forEach((zPos) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6), darkMat);
    leg.position.set(0.25, -0.52, zPos * 0.85);
    leg.rotation.z = 0.2;
    group.add(leg);

    const wheel = new THREE.Mesh(wheelGeo, darkMat);
    wheel.position.set(0.32, -0.7, zPos);
    group.add(wheel);
  });

  const propeller = new THREE.Group();
  propeller.position.set(1.22, 0, 0);

  const spinner = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.25, 8), darkMat);
  spinner.rotation.z = -Math.PI / 2;
  spinner.position.x = 0.06;
  propeller.add(spinner);

  const bladeGeo = new THREE.BoxGeometry(0.05, 1.35, 0.16);
  const blade1 = new THREE.Mesh(bladeGeo, darkMat);
  const blade2 = new THREE.Mesh(bladeGeo, darkMat);
  blade2.rotation.x = Math.PI / 2;
  propeller.add(blade1, blade2);

  group.add(propeller);

  return { group, propeller };
}
