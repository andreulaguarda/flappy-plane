export function getMedalInfo(points) {
  if (points >= 30) return { icon: '💎', text: 'Rango: Leyenda Suprema del Aire' };
  if (points >= 20) return { icon: '🥇', text: 'Rango: Comandante de Oro' };
  if (points >= 10) return { icon: '🥈', text: 'Rango: Capitán de Plata' };
  if (points >= 4) return { icon: '🥉', text: 'Rango: Aviador de Bronce' };
  return { icon: '🛩️', text: 'Rango: Cadete de Vuelo' };
}

export class UI {
  constructor() {
    this.scoreDisplay = document.getElementById('score-display');
    this.hudBest = document.getElementById('hud-best');
    this.phaseNameEl = document.getElementById('phase-name');
    this.phaseDotEl = document.getElementById('phase-dot');
    this.tapHintEl = document.getElementById('tap-hint');
    this.phaseBannerEl = document.getElementById('phase-banner');
    this.bannerSubEl = document.getElementById('banner-sub');
    this.bannerTitleEl = document.getElementById('banner-title');

    this.startScreen = document.getElementById('start-screen');
    this.pauseScreen = document.getElementById('pause-screen');
    this.gameoverScreen = document.getElementById('gameover-screen');

    this.btnStart = document.getElementById('btn-start');
    this.btnResume = document.getElementById('btn-resume');
    this.btnRestartPause = document.getElementById('btn-restart-pause');
    this.btnRetry = document.getElementById('btn-retry');
    this.btnPause = document.getElementById('btn-pause');
    this.btnSound = document.getElementById('btn-sound');

    this.goScoreEl = document.getElementById('go-score');
    this.goBestEl = document.getElementById('go-best');
    this.goPhaseReachedEl = document.getElementById('go-phase-reached');
    this.goMedalIconEl = document.getElementById('go-medal-icon');
    this.goMedalTextEl = document.getElementById('go-medal-text');

    this.bannerTimeout = null;
    this.gameOverTimeout = null;
  }

  bind(handlers) {
    const wrap = (fn) => (event) => {
      event.stopPropagation();
      fn();
    };

    this.btnStart.addEventListener('click', wrap(handlers.onStart));
    this.btnResume.addEventListener('click', wrap(handlers.onResume));
    this.btnRestartPause.addEventListener('click', wrap(handlers.onRestart));
    this.btnRetry.addEventListener('click', wrap(handlers.onRetry));
    this.btnPause.addEventListener('click', wrap(handlers.onPauseToggle));
    this.btnSound.addEventListener('click', wrap(handlers.onSoundToggle));
  }

  setBest(value) {
    this.hudBest.textContent = value;
  }

  setScore(value, pop = false) {
    this.scoreDisplay.textContent = value;
    if (pop) {
      this.scoreDisplay.classList.add('pop');
      setTimeout(() => this.scoreDisplay.classList.remove('pop'), 140);
    }
  }

  setPhase(phase) {
    this.phaseNameEl.textContent = phase.name;
    this.phaseDotEl.style.background = phase.dotColor;
    this.phaseDotEl.style.boxShadow = `0 0 8px ${phase.dotColor}`;
  }

  showBanner(phase) {
    this.bannerSubEl.textContent = phase.bannerSub;
    this.bannerTitleEl.textContent = phase.bannerTitle;
    this.phaseBannerEl.classList.add('visible');
    if (this.bannerTimeout) clearTimeout(this.bannerTimeout);
    this.bannerTimeout = setTimeout(() => {
      this.phaseBannerEl.classList.remove('visible');
    }, 2600);
  }

  showTapHint() {
    this.tapHintEl.classList.remove('fade-out');
  }

  fadeTapHint() {
    this.tapHintEl.classList.add('fade-out');
  }

  hideStart() {
    this.startScreen.classList.add('hidden');
  }

  showPause() {
    this.pauseScreen.classList.remove('hidden');
  }

  hidePause() {
    this.pauseScreen.classList.add('hidden');
  }

  prepareGameOver({ score, best, phaseName, medal }) {
    this.goPhaseReachedEl.textContent = `${phaseName} ALCANZADA`;
    this.goScoreEl.textContent = score;
    this.goBestEl.textContent = best;
    this.goMedalIconEl.textContent = medal.icon;
    this.goMedalTextEl.textContent = medal.text;

    if (this.gameOverTimeout) clearTimeout(this.gameOverTimeout);
    this.gameOverTimeout = setTimeout(() => {
      this.gameoverScreen.classList.remove('hidden');
    }, 420);
  }

  hideGameOver() {
    if (this.gameOverTimeout) clearTimeout(this.gameOverTimeout);
    this.gameoverScreen.classList.add('hidden');
  }

  isGameOverVisible() {
    return !this.gameoverScreen.classList.contains('hidden');
  }

  setSoundMuted(muted) {
    this.btnSound.textContent = muted ? '🔇' : '🔊';
  }
}
