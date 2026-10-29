import * as THREE from 'three';
import { LEVELS } from './config.js';

export function createWorld(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const currentSkyColor = new THREE.Color(LEVELS[0].skyHex);
  const targetSkyColor = new THREE.Color(LEVELS[0].skyHex);
  const currentFogColor = new THREE.Color(LEVELS[0].fogHex);
  const targetFogColor = new THREE.Color(LEVELS[0].fogHex);

  scene.background = currentSkyColor;
  scene.fog = new THREE.Fog(currentFogColor, 58, 135);

  const camera = new THREE.PerspectiveCamera(44, 1, 0.5, 160);

  let planeAnchorX = -3.8;
  const cameraBasePos = new THREE.Vector3(0, 0.8, 25);
  const cameraLookTarget = new THREE.Vector3(1.2, 0.3, 0);
  let screenShakeTime = 0;
  let cameraInitialized = false;

  function updateResponsive() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / h;

    renderer.setSize(w, h);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    const halfFovRad = THREE.MathUtils.degToRad(camera.fov * 0.5);
    const minVisibleHeight = 21.5;
    const minVisibleWidth = 16.5;

    const zForHeight = (minVisibleHeight * 0.5) / Math.tan(halfFovRad);
    const zForWidth = (minVisibleWidth * 0.5) / (Math.tan(halfFovRad) * aspect);
    const optimalZ = Math.max(zForHeight, Math.min(zForWidth, 42));

    if (aspect < 0.75) {
      planeAnchorX = -3.2;
      cameraBasePos.set(1.3, 0.6, optimalZ);
      cameraLookTarget.set(1.6, 0.2, 0);
    } else {
      planeAnchorX = -4.5;
      cameraBasePos.set(0.5, 0.7, optimalZ);
      cameraLookTarget.set(0.8, 0.2, 0);
    }

    if (!cameraInitialized) {
      camera.position.copy(cameraBasePos);
      camera.lookAt(cameraLookTarget);
      cameraInitialized = true;
    }
  }

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 1.15);
  hemiLight.position.set(0, 25, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.7);
  dirLight.position.set(12, 24, 18);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.near = 5;
  dirLight.shadow.camera.far = 65;
  const d = 22;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  scene.add(dirLight);

  function setPhase(phase) {
    targetSkyColor.setHex(phase.skyHex);
    targetFogColor.setHex(phase.fogHex);
    dirLight.color.setHex(phase.lightColor);
  }

  function updateColors(dt) {
    currentSkyColor.lerp(targetSkyColor, dt * 2.2);
    currentFogColor.lerp(targetFogColor, dt * 2.2);
  }

  function shake(duration) {
    screenShakeTime = Math.max(screenShakeTime, duration);
  }

  function resetShake() {
    screenShakeTime = 0;
  }

  function updateCamera(dt, planeY) {
    if (screenShakeTime > 0) {
      screenShakeTime -= dt;
      const intensity = screenShakeTime * 1.4;
      camera.position.set(
        cameraBasePos.x + (Math.random() - 0.5) * intensity,
        cameraBasePos.y + (Math.random() - 0.5) * intensity,
        cameraBasePos.z
      );
    } else {
      const targetCamY = cameraBasePos.y + planeY * 0.12;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, cameraBasePos.x, dt * 6);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, dt * 6);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, cameraBasePos.z, dt * 6);
    }
    camera.lookAt(cameraLookTarget);
  }

  window.addEventListener('resize', updateResponsive);
  updateResponsive();

  return {
    renderer,
    scene,
    camera,
    hemiLight,
    dirLight,
    get planeAnchorX() {
      return planeAnchorX;
    },
    setPhase,
    updateColors,
    updateCamera,
    shake,
    resetShake
  };
}
