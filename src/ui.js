import { t } from './strings.js';
import { formatDistance, levelDistanceM } from './distance.js';

export function getMedalInfo(points, total) {
  const ratio = total > 0 ? points / total : 0;
  if (ratio >= 1) return { icon: '💎', text: t('medalLegend') };
  if (ratio >= 0.75) return { icon: '🥇', text: t('medalGold') };
  if (ratio >= 0.5) return { icon: '🥈', text: t('medalSilver') };
  if (ratio >= 0.25) return { icon: '🥉', text: t('medalBronze') };
  return { icon: '🛩️', text: t('medalCadet') };
}

export class UI {
  constructor() {
    this.uiLayer = document.getElementById('ui-layer');
    this.scoreDisplay = document.getElementById('score-display');
    this.hudBest = document.getElementById('hud-best');
    this.hudCoins = document.getElementById('hud-coins');
    this.menuCoins = document.getElementById('menu-coins');
    this.phaseBannerEl = document.getElementById('phase-banner');
    this.bannerSubEl = document.getElementById('banner-sub');
    this.bannerTitleEl = document.getElementById('banner-title');

    this.menuScreen = document.getElementById('menu-screen');
    this.levelList = document.getElementById('level-list');
    this.pauseScreen = document.getElementById('pause-screen');
    this.gameoverScreen = document.getElementById('gameover-screen');
    this.completeScreen = document.getElementById('complete-screen');

    this.btnResume = document.getElementById('btn-resume');
    this.btnRestartPause = document.getElementById('btn-restart-pause');
    this.btnMenuPause = document.getElementById('btn-menu-pause');
    this.btnRetry = document.getElementById('btn-retry');
    this.btnMenuGameOver = document.getElementById('btn-menu-gameover');
    this.btnNextLevel = document.getElementById('btn-next-level');
    this.btnRetryComplete = document.getElementById('btn-retry-complete');
    this.btnMenuComplete = document.getElementById('btn-menu-complete');
    this.btnPause = document.getElementById('btn-pause');
    this.btnSound = document.getElementById('btn-sound');
    this.btnSoundMenu = document.getElementById('btn-sound-menu');

    this.soundIcons = [
      {
        on: document.getElementById('icon-sound-on'),
        off: document.getElementById('icon-sound-off')
      },
      {
        on: document.getElementById('icon-sound-on-menu'),
        off: document.getElementById('icon-sound-off-menu')
      }
    ];

    this.goLevelEl = document.getElementById('go-level');
    this.goDistanceEl = document.getElementById('go-distance');
    this.goBestEl = document.getElementById('go-best');
    this.goCoinsEl = document.getElementById('go-coins');
    this.goMedalIconEl = document.getElementById('go-medal-icon');
    this.goMedalTextEl = document.getElementById('go-medal-text');

    this.completeBadgeEl = document.getElementById('complete-badge');
    this.completeTitleEl = document.getElementById('complete-title');
    this.completeSubtitleEl = document.getElementById('complete-subtitle');
    this.completeDistanceEl = document.getElementById('complete-distance');
    this.completeBestEl = document.getElementById('complete-best');
    this.completeCoinsEl = document.getElementById('complete-coins');
    this.completeMedalIconEl = document.getElementById('complete-medal-icon');
    this.completeMedalTextEl = document.getElementById('complete-medal-text');

    this.bannerTimeout = null;
    this.gameOverTimeout = null;
    this.completeTimeout = null;
  }

  bind(handlers) {
    const wrap = (fn) => (event) => {
      event.stopPropagation();
      fn();
    };

    this.btnResume.addEventListener('click', wrap(handlers.onResume));
    this.btnRestartPause.addEventListener('click', wrap(handlers.onRestart));
    this.btnMenuPause.addEventListener('click', wrap(handlers.onMenu));
    this.btnRetry.addEventListener('click', wrap(handlers.onRetry));
    this.btnMenuGameOver.addEventListener('click', wrap(handlers.onMenu));
    this.btnNextLevel.addEventListener('click', wrap(handlers.onNextLevel));
    this.btnRetryComplete.addEventListener('click', wrap(handlers.onRetry));
    this.btnMenuComplete.addEventListener('click', wrap(handlers.onMenu));
    this.btnPause.addEventListener('click', wrap(handlers.onPauseToggle));
    this.btnSound.addEventListener('click', wrap(handlers.onSoundToggle));
    this.btnSoundMenu.addEventListener('click', wrap(handlers.onSoundToggle));

    this.levelList.addEventListener('click', (event) => {
      const card = event.target.closest('[data-level]');
      if (!card || card.disabled) return;
      handlers.onSelectLevel(Number(card.dataset.level));
    });
  }

  setBest(meters) {
    this.hudBest.textContent = formatDistance(meters);
  }

  setDistance(meters) {
    this.scoreDisplay.textContent = formatDistance(meters);
  }

  setCoins(value, pop = false) {
    this.hudCoins.textContent = value;
    if (pop) {
      this.hudCoins.classList.add('pop');
      setTimeout(() => this.hudCoins.classList.remove('pop'), 160);
    }
  }

  showBanner({ sub, title }) {
    this.bannerSubEl.textContent = sub;
    this.bannerTitleEl.textContent = title;
    this.phaseBannerEl.classList.add('visible');
    if (this.bannerTimeout) clearTimeout(this.bannerTimeout);
    this.bannerTimeout = setTimeout(() => {
      this.phaseBannerEl.classList.remove('visible');
    }, 2600);
  }

  hideBanner() {
    if (this.bannerTimeout) clearTimeout(this.bannerTimeout);
    this.phaseBannerEl.classList.remove('visible');
  }

  showHud() {
    this.uiLayer.classList.remove('ui-hidden');
  }

  hideHud() {
    this.uiLayer.classList.add('ui-hidden');
  }

  showMenu({ levels, progress, bests, coins }) {
    this.levelList.innerHTML = '';
    this.menuCoins.textContent = coins;

    for (const level of levels) {
      const unlocked = level.id <= progress.unlocked;
      const best = bests[level.id] || 0;
      const completed = best >= levelDistanceM(level);

      const card = document.createElement('button');
      card.type = 'button';
      card.className = `level-card${unlocked ? '' : ' locked'}${completed ? ' completed' : ''}`;
      card.dataset.level = String(level.id);
      card.disabled = !unlocked;

      const meta = unlocked ? t('levelBest', { distance: formatDistance(best) }) : t('locked');
      const state = completed ? '✓' : unlocked ? '▶' : '🔒';

      card.innerHTML = `
        <span class="level-number">${String(level.id).padStart(2, '0')}</span>
        <span class="level-info">
          <span class="level-name">${t(level.nameKey)}</span>
          <span class="level-meta">${meta}</span>
        </span>
        <span class="level-state">${state}</span>
      `;

      this.levelList.appendChild(card);
    }

    this.menuScreen.classList.remove('hidden');
    this.hideHud();
  }

  hideMenu() {
    this.menuScreen.classList.add('hidden');
  }

  showPause() {
    this.pauseScreen.classList.remove('hidden');
  }

  hidePause() {
    this.pauseScreen.classList.add('hidden');
  }

  prepareGameOver({ level, distance, best, coins, medal }) {
    this.goLevelEl.textContent = t('levelBadge', {
      level: level.id,
      name: t(level.nameKey)
    });
    this.goDistanceEl.textContent = formatDistance(distance);
    this.goBestEl.textContent = formatDistance(best);
    this.goCoinsEl.textContent = `+${coins}`;
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

  prepareLevelComplete({ level, distance, best, coins, medal, hasNext }) {
    this.completeBadgeEl.textContent = t('completeBadge', { level: level.id });
    this.completeTitleEl.textContent = t(hasNext ? 'completeTitle' : 'allCompleteTitle');
    this.completeSubtitleEl.textContent = t(
      hasNext ? 'completeSubtitle' : 'allCompleteSubtitle'
    );
    this.completeDistanceEl.textContent = formatDistance(distance);
    this.completeBestEl.textContent = formatDistance(best);
    this.completeCoinsEl.textContent = `+${coins}`;
    this.completeMedalIconEl.textContent = medal.icon;
    this.completeMedalTextEl.textContent = medal.text;
    this.btnNextLevel.style.display = hasNext ? '' : 'none';

    if (this.completeTimeout) clearTimeout(this.completeTimeout);
    this.completeTimeout = setTimeout(() => {
      this.completeScreen.classList.remove('hidden');
    }, 600);
  }

  hideComplete() {
    if (this.completeTimeout) clearTimeout(this.completeTimeout);
    this.completeScreen.classList.add('hidden');
  }

  setSoundMuted(muted) {
    for (const icons of this.soundIcons) {
      icons.on?.classList.toggle('hidden-icon', muted);
      icons.off?.classList.toggle('hidden-icon', !muted);
    }
  }
}
