import * as THREE from 'three';
import { LEVELS } from './config.js';

const SUNSET_SKY = new THREE.Color(0xf97316);
const SUNSET_FOG = new THREE.Color(0xfed7aa);
const SUNSET_LIGHT = new THREE.Color(0xffc085);

const NIGHT_SKY = new THREE.Color(0x1e3a8a);
const NIGHT_FOG = new THREE.Color(0x334155);
const NIGHT_LIGHT = new THREE.Color(0xdbeafe);

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
  const baseSkyColor = new THREE.Color(LEVELS[0].skyHex);
  const targetSkyColor = new THREE.Color(LEVELS[0].skyHex);

  const currentFogColor = new THREE.Color(LEVELS[0].fogHex);
  const baseFogColor = new THREE.Color(LEVELS[0].fogHex);
  const targetFogColor = new THREE.Color(LEVELS[0].fogHex);

  const baseLightColor = new THREE.Color(LEVELS[0].lightColor);
  const targetLightColor = new THREE.Color(LEVELS[0].lightColor);

  let targetFogNear = 58;
  let targetFogFar = 135;
  let targetDirIntensity = 1.7;
  let targetHemiIntensity = 1.15;
  let currentProgress = 0;

  scene.background = currentSkyColor;
  scene.fog = new THREE.Fog(currentFogColor, targetFogNear, targetFogFar);

  const camera = new THREE.PerspectiveCamera(44, 1, 0.5, 160);

  let planeAnchorX = -3.8;
  const cameraBasePos = new THREE.Vector3(0, 0.8, 25);
  const cameraLookTarget = new THREE.Vector3(1.2, 0.3, 0);
  const currentLookTarget = new THREE.Vector3(1.2, 0.3, 0);
  let hangarView = false;
  let hangarFocusY = 0.4;
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
      currentLookTarget.copy(cameraLookTarget);
      camera.lookAt(currentLookTarget);
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

  function computeTimeOfDayTargets(p) {
    const clamped = Math.min(1, Math.max(0, Number.isFinite(p) ? p : 0));

    // Más día (0.00 - 0.45), más atardecer (0.45 - 0.82) y menos noche (0.82 - 1.00), con noche mucho más luminosa
    if (clamped < 0.45) {
      const sunsetBlend = THREE.MathUtils.smoothstep(clamped, 0.36, 0.48);
      targetSkyColor.copy(baseSkyColor).lerp(SUNSET_SKY, sunsetBlend * 0.82);
      targetFogColor.copy(baseFogColor).lerp(SUNSET_FOG, sunsetBlend * 0.8);
      targetLightColor.copy(baseLightColor).lerp(SUNSET_LIGHT, sunsetBlend);
      targetDirIntensity = THREE.MathUtils.lerp(1.7, 1.55, sunsetBlend);
      targetHemiIntensity = THREE.MathUtils.lerp(1.15, 1.05, sunsetBlend);
    } else if (clamped < 0.82) {
      const toSunset = THREE.MathUtils.smoothstep(clamped, 0.36, 0.5);
      const toNight = THREE.MathUtils.smoothstep(clamped, 0.74, 0.86);
      targetSkyColor
        .copy(baseSkyColor)
        .lerp(SUNSET_SKY, toSunset * 0.85)
        .lerp(NIGHT_SKY, toNight * 0.88);
      targetFogColor
        .copy(baseFogColor)
        .lerp(SUNSET_FOG, toSunset * 0.82)
        .lerp(NIGHT_FOG, toNight * 0.85);
      targetLightColor
        .copy(baseLightColor)
        .lerp(SUNSET_LIGHT, toSunset)
        .lerp(NIGHT_LIGHT, toNight);
      targetDirIntensity = THREE.MathUtils.lerp(1.55, 1.36, toNight);
      targetHemiIntensity = THREE.MathUtils.lerp(1.05, 0.98, toNight);
    } else {
      const nightBlend = THREE.MathUtils.smoothstep(clamped, 0.74, 0.88);
      targetSkyColor.copy(SUNSET_SKY).lerp(NIGHT_SKY, nightBlend * 0.88);
      targetFogColor.copy(SUNSET_FOG).lerp(NIGHT_FOG, nightBlend * 0.85);
      targetLightColor.copy(SUNSET_LIGHT).lerp(NIGHT_LIGHT, nightBlend);
      targetDirIntensity = THREE.MathUtils.lerp(1.55, 1.36, nightBlend);
      targetHemiIntensity = THREE.MathUtils.lerp(1.05, 0.98, nightBlend);
    }
  }

  function setPhase(phase, instant = false) {
    if (!phase) return;
    baseSkyColor.setHex(phase.skyHex ?? LEVELS[0].skyHex);
    baseFogColor.setHex(phase.fogHex ?? LEVELS[0].fogHex);
    baseLightColor.setHex(phase.lightColor ?? 0xfffbeb);
    targetFogNear = Number.isFinite(phase.fogNear) ? phase.fogNear : 56;
    targetFogFar = Number.isFinite(phase.fogFar) ? phase.fogFar : 135;

    if (instant) {
      currentProgress = 0;
    }
    computeTimeOfDayTargets(currentProgress);

    if (instant) {
      currentSkyColor.copy(targetSkyColor);
      currentFogColor.copy(targetFogColor);
      dirLight.color.copy(targetLightColor);
      dirLight.intensity = targetDirIntensity;
      hemiLight.intensity = targetHemiIntensity;
      scene.fog.near = targetFogNear;
      scene.fog.far = targetFogFar;
    }
  }

  function setTimeOfDay(progressRatio = 0) {
    currentProgress = Math.min(1, Math.max(0, Number.isFinite(progressRatio) ? progressRatio : 0));
    computeTimeOfDayTargets(currentProgress);
  }

  function updateColors(dt) {
    currentSkyColor.lerp(targetSkyColor, dt * 2.4);
    currentFogColor.lerp(targetFogColor, dt * 2.4);
    dirLight.color.lerp(targetLightColor, dt * 2.4);
    dirLight.intensity = THREE.MathUtils.lerp(dirLight.intensity, targetDirIntensity, dt * 2.4);
    hemiLight.intensity = THREE.MathUtils.lerp(hemiLight.intensity, targetHemiIntensity, dt * 2.4);
    scene.fog.near = THREE.MathUtils.lerp(scene.fog.near, targetFogNear, dt * 2.0);
    scene.fog.far = THREE.MathUtils.lerp(scene.fog.far, targetFogFar, dt * 2.0);
  }

  function shake(duration) {
    screenShakeTime = Math.max(screenShakeTime, duration);
  }

  function resetShake() {
    screenShakeTime = 0;
  }

  function setHangarView(active, focusY = hangarFocusY) {
    hangarView = Boolean(active);
    if (Number.isFinite(focusY)) {
      hangarFocusY = THREE.MathUtils.clamp(focusY, 0.15, 0.85);
    }
  }

  function updateCamera(dt, planeY) {
    if (hangarView) {
      const hangarCamX = planeAnchorX;
      const hangarCamY = planeY + 0.55;
      const hangarCamZ = 17.5;
      const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);
      const ndcY = 1 - 2 * hangarFocusY;
      const k = ndcY * Math.tan(halfFov);
      const tanPlane = (planeY - hangarCamY) / hangarCamZ;
      const tanTarget = (tanPlane - k) / (1 + k * tanPlane);
      const targetLookX = planeAnchorX;
      const targetLookY = hangarCamY + tanTarget * hangarCamZ;
      const targetLookZ = 0;

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, hangarCamX, dt * 8);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, hangarCamY, dt * 8);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, hangarCamZ, dt * 8);
      currentLookTarget.x = THREE.MathUtils.lerp(currentLookTarget.x, targetLookX, dt * 8);
      currentLookTarget.y = THREE.MathUtils.lerp(currentLookTarget.y, targetLookY, dt * 8);
      currentLookTarget.z = THREE.MathUtils.lerp(currentLookTarget.z, targetLookZ, dt * 8);
      camera.lookAt(currentLookTarget);
      return;
    }

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
    currentLookTarget.lerp(cameraLookTarget, dt * 8);
    camera.lookAt(currentLookTarget);
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
    setTimeOfDay,
    setHangarView,
    updateColors,
    updateCamera,
    shake,
    resetShake
  };
}
