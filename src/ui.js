import { t } from './strings.js';
import { formatDistance, levelDistanceKm } from './distance.js';
import { UNLOCK_ALL_LEVELS } from './config.js';
import {
  PLANES,
  getPlaneConfig,
  getPlaneStats
} from './planes.js';

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
    this.menuCard = this.menuScreen?.querySelector('.menu-card');
    this.levelList = document.getElementById('level-list');
    this.hangarPanel = document.getElementById('hangar-panel');
    this.tabStages = document.getElementById('tab-stages');
    this.tabHangar = document.getElementById('tab-hangar');

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

    this.soundIcons = [
      {
        on: document.getElementById('icon-sound-on'),
        off: document.getElementById('icon-sound-off')
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

    this.activeTab = 'stages';
    this.previewPlaneId = PLANES[0].id;
    this.lastMenuData = null;
    this.handlers = null;

    this.bannerTimeout = null;
    this.gameOverTimeout = null;
    this.completeTimeout = null;
  }

  bind(handlers) {
    this.handlers = handlers;
    const wrap = (fn) => (event) => {
      event.stopPropagation();
      fn?.();
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

    this.tabStages?.addEventListener('click', (event) => {
      event.stopPropagation();
      this.setTab('stages');
    });

    this.tabHangar?.addEventListener('click', (event) => {
      event.stopPropagation();
      this.setTab('hangar');
    });

    this.levelList.addEventListener('click', (event) => {
      const card = event.target.closest('[data-level]');
      if (!card || card.disabled) return;
      handlers.onSelectLevel?.(Number(card.dataset.level));
    });

    this.hangarPanel?.addEventListener('click', (event) => {
      const navBtn = event.target.closest('[data-hangar-nav]');
      if (navBtn) {
        const dir = navBtn.dataset.hangarNav === 'next' ? 1 : -1;
        this.stepPreviewPlane(dir);
        return;
      }

      const actionBtn = event.target.closest('[data-plane-action]');
      if (actionBtn && !actionBtn.disabled) {
        handlers.onEquipOrBuyPlane?.(actionBtn.dataset.planeAction);
      }
    });
  }

  stepPreviewPlane(direction = 1) {
    const currentIndex = Math.max(
      0,
      PLANES.findIndex((p) => p.id === this.previewPlaneId)
    );
    const nextIndex = (currentIndex + direction + PLANES.length) % PLANES.length;
    this.selectPreviewPlane(PLANES[nextIndex].id);
  }

  selectPreviewPlane(planeId) {
    const plane = getPlaneConfig(planeId);
    this.previewPlaneId = plane.id;
    this.handlers?.onPreviewPlane?.(plane.id);
    if (this.lastMenuData) {
      this.renderHangar(this.lastMenuData);
    }
  }

  setTab(tab) {
    this.activeTab = tab === 'hangar' ? 'hangar' : 'stages';
    const isHangar = this.activeTab === 'hangar';
    this.tabStages?.classList.toggle('active', !isHangar);
    this.tabHangar?.classList.toggle('active', isHangar);
    this.levelList?.classList.toggle('hidden-panel', isHangar);
    this.hangarPanel?.classList.toggle('hidden-panel', !isHangar);
    this.menuScreen?.classList.toggle('hangar-mode', isHangar);
    this.menuCard?.classList.toggle('hangar-active', isHangar);

    if (!isHangar && this.lastMenuData?.hangar) {
      this.previewPlaneId = this.lastMenuData.hangar.selectedPlane;
    }
    if (isHangar && this.lastMenuData) {
      this.renderHangar(this.lastMenuData);
    }
    this.handlers?.onHangarViewChange?.(isHangar, this.previewPlaneId);
  }

  setBest(km) {
    this.hudBest.textContent = formatDistance(km);
  }

  setDistance(km) {
    this.scoreDisplay.textContent = formatDistance(km);
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

  renderHangar({ hangar, coins }) {
    if (!this.hangarPanel || !hangar) return;
    if (!this.previewPlaneId || !PLANES.some((p) => p.id === this.previewPlaneId)) {
      this.previewPlaneId = hangar.selectedPlane;
    }

    const planeIndex = Math.max(
      0,
      PLANES.findIndex((p) => p.id === this.previewPlaneId)
    );
    const plane = PLANES[planeIndex];
    const isUnlocked = hangar.unlockedPlanes.includes(plane.id);
    const isEquipped = hangar.selectedPlane === plane.id;
    const stats = getPlaneStats(plane.id);

    let statusClass = '';
    let statusText = '';
    if (isEquipped) {
      statusClass = 'selected';
      statusText = t('statusSelected');
    } else if (isUnlocked) {
      statusClass = '';
      statusText = t('statusUnlocked');
    } else {
      statusClass = 'locked';
      statusText = t('statusLocked', { cost: plane.unlockCost });
    }

    let actionBtnHtml = '';
    if (isEquipped) {
      actionBtnHtml = `<button type="button" class="plane-action-btn equipped" disabled>${t('selectedPlaneBtn')}</button>`;
    } else if (isUnlocked) {
      actionBtnHtml = `<button type="button" class="plane-action-btn" data-plane-action="${plane.id}">${t('selectPlaneBtn')}</button>`;
    } else {
      const canAfford = coins >= plane.unlockCost;
      actionBtnHtml = `<button type="button" class="plane-action-btn" data-plane-action="${plane.id}" ${canAfford ? '' : 'disabled'}>${t('buyPlaneBtn', { cost: plane.unlockCost })}</button>`;
    }

    // Barras visuales de los 4 atributos fijos del avión
    const sizeMeters = Math.round(15 * Math.pow(stats.sizeMultiplier, 4));
    const sizePct = Math.round(((1.05 - stats.sizeMultiplier) / 0.32) * 100);
    const magnetPct = Math.round((stats.magnetRadius / 6.2) * 100);
    const multPct = Math.round((stats.coinMultiplier / 4) * 100);
    const shieldPct = Math.round((stats.shieldChance / 0.5) * 100);

    const attrs = [
      {
        label: t('statSize'),
        value: `${sizeMeters} mt`,
        pct: Math.min(100, Math.max(15, sizePct))
      },
      {
        label: t('statMagnet'),
        value: `${stats.magnetRadius.toFixed(1)} m`,
        pct: Math.min(100, Math.max(6, magnetPct))
      },
      {
        label: t('statMultiplier'),
        value: `${stats.coinMultiplier}x`,
        pct: Math.min(100, Math.max(20, multPct))
      },
      {
        label: t('statShield'),
        value: `${Math.round(stats.shieldChance * 100)}%`,
        pct: Math.min(100, Math.max(6, shieldPct))
      }
    ];

    const attrsHtml = attrs
      .map(
        (a) => `
        <div class="hangar-attr-card">
          <div class="hangar-attr-header">
            <span>${a.label}</span>
            <span class="hangar-attr-val">${a.value}</span>
          </div>
          <div class="hangar-attr-track">
            <div class="hangar-attr-fill" style="width: ${a.pct}%;"></div>
          </div>
        </div>
      `
      )
      .join('');

    this.hangarPanel.innerHTML = `
      <div class="hangar-showcase-stage">
        <div class="hangar-stage-top">
          <span class="hangar-counter-pill">${planeIndex + 1} / ${PLANES.length}</span>
          <span class="hangar-status-pill ${statusClass}">${statusText}</span>
        </div>
        <button type="button" class="hangar-arrow-btn prev" data-hangar-nav="prev" aria-label="${t('prevPlaneAria')}">◀</button>
        <button type="button" class="hangar-arrow-btn next" data-hangar-nav="next" aria-label="${t('nextPlaneAria')}">▶</button>
        <div class="hangar-stage-bottom">
          <div class="plane-detail-title">${t(plane.nameKey)}</div>
        </div>
      </div>

      <div class="plane-detail-card">
        <div class="plane-detail-desc">${t(plane.descKey)}</div>
        <div class="hangar-attrs-grid">${attrsHtml}</div>
        ${actionBtnHtml}
      </div>
    `;
  }

  getHangarStageCenterY() {
    const stage = this.hangarPanel?.querySelector('.hangar-showcase-stage');
    if (!stage) return 0.4;
    const rect = stage.getBoundingClientRect();
    return (rect.top + rect.height * 0.5) / Math.max(1, window.innerHeight);
  }

  showMenu({ levels, progress, bests, coins, hangar }) {
    this.lastMenuData = { levels, progress, bests, coins, hangar };
    this.levelList.innerHTML = '';
    this.menuCoins.textContent = coins;

    if (hangar && (!this.previewPlaneId || !PLANES.some((p) => p.id === this.previewPlaneId))) {
      this.previewPlaneId = hangar.selectedPlane;
    }

    for (const level of levels) {
      const unlocked = UNLOCK_ALL_LEVELS || level.id <= progress.unlocked;
      const best = bests[level.id] || 0;
      const targetKm = levelDistanceKm(level);
      const completed = best >= targetKm;

      const card = document.createElement('button');
      card.type = 'button';
      card.className = `level-card${unlocked ? '' : ' locked'}${completed ? ' completed' : ''}`;
      card.dataset.level = String(level.id);
      card.disabled = !unlocked;

      const meta = unlocked
        ? t('levelBest', {
            distance: formatDistance(best),
            total: formatDistance(targetKm)
          })
        : t('locked', { total: formatDistance(targetKm) });
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

    if (hangar) {
      this.renderHangar({ hangar, coins });
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
