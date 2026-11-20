import { t } from './strings.js';
import { formatDistance, levelDistanceKm } from './distance.js';
import { UNLOCK_ALL_LEVELS } from './config.js';
import {
  PLANES,
  MAX_UPGRADE_LEVEL,
  getPlaneConfig,
  getPlaneStats,
  getUpgradeCost
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
    this.btnSoundMenu.addEventListener('click', wrap(handlers.onSoundToggle));

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
      const chip = event.target.closest('[data-plane-id]');
      if (chip) {
        const planeId = chip.dataset.planeId;
        this.previewPlaneId = planeId;
        handlers.onPreviewPlane?.(planeId);
        if (this.lastMenuData) {
          this.renderHangar(this.lastMenuData);
        }
        return;
      }

      const actionBtn = event.target.closest('[data-plane-action]');
      if (actionBtn && !actionBtn.disabled) {
        handlers.onEquipOrBuyPlane?.(actionBtn.dataset.planeAction);
        return;
      }

      const upgBtn = event.target.closest('[data-upgrade-stat]');
      if (upgBtn && !upgBtn.disabled) {
        handlers.onUpgradePlane?.(
          upgBtn.dataset.upgradePlane,
          upgBtn.dataset.upgradeStat
        );
      }
    });
  }

  setTab(tab) {
    this.activeTab = tab === 'hangar' ? 'hangar' : 'stages';
    const isHangar = this.activeTab === 'hangar';
    this.tabStages?.classList.toggle('active', !isHangar);
    this.tabHangar?.classList.toggle('active', isHangar);
    this.levelList?.classList.toggle('hidden-panel', isHangar);
    this.hangarPanel?.classList.toggle('hidden-panel', !isHangar);

    if (!isHangar && this.lastMenuData?.hangar) {
      this.previewPlaneId = this.lastMenuData.hangar.selectedPlane;
      this.handlers?.onPreviewPlane?.(this.previewPlaneId);
    } else if (isHangar) {
      this.handlers?.onPreviewPlane?.(this.previewPlaneId);
    }
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
    if (!this.previewPlaneId) {
      this.previewPlaneId = hangar.selectedPlane;
    }

    const plane = getPlaneConfig(this.previewPlaneId);
    const isUnlocked = hangar.unlockedPlanes.includes(plane.id);
    const isEquipped = hangar.selectedPlane === plane.id;
    const planeUpgrades = hangar.upgrades[plane.id];
    const stats = getPlaneStats(plane.id, planeUpgrades);

    const rosterHtml = PLANES.map((p, idx) => {
      const unlocked = hangar.unlockedPlanes.includes(p.id);
      const equipped = hangar.selectedPlane === p.id;
      const active = plane.id === p.id;
      const statusIcon = equipped ? '✓' : unlocked ? '✈' : `🔒${p.unlockCost}`;
      return `
        <button type="button" class="plane-chip${active ? ' active' : ''}${equipped ? ' equipped' : ''}" data-plane-id="${p.id}">
          <span class="plane-chip-top">
            <span>#${String(idx + 1).padStart(2, '0')}</span>
            <span>${statusIcon}</span>
          </span>
          <span class="plane-chip-name">${t(p.nameKey)}</span>
        </button>
      `;
    }).join('');

    let actionBtnHtml = '';
    if (isEquipped) {
      actionBtnHtml = `<button type="button" class="plane-action-btn equipped" disabled>${t('selectedPlaneBtn')}</button>`;
    } else if (isUnlocked) {
      actionBtnHtml = `<button type="button" class="plane-action-btn" data-plane-action="${plane.id}">${t('selectPlaneBtn')}</button>`;
    } else {
      const canAffordPlane = coins >= plane.unlockCost;
      actionBtnHtml = `<button type="button" class="plane-action-btn" data-plane-action="${plane.id}" ${canAffordPlane ? '' : 'disabled'}>${t('buyPlaneBtn', { cost: plane.unlockCost })}</button>`;
    }

    const upgradeSpecs = [
      {
        key: 'size',
        label: t('statSize'),
        valueText: `${Math.round(stats.sizeMultiplier * 100)}%`
      },
      {
        key: 'weight',
        label: t('statWeight'),
        valueText: `${Math.round(stats.weightMultiplier * 100)}%`
      },
      {
        key: 'magnet',
        label: t('statMagnet'),
        valueText: `${stats.magnetRadius.toFixed(1)}m`
      },
      {
        key: 'multiplier',
        label: t('statMultiplier'),
        valueText: `x${stats.coinMultiplier}`
      },
      {
        key: 'shield',
        label: t('statShield'),
        valueText: `${Math.round(stats.shieldChance * 100)}%`
      }
    ];

    const upgradesHtml = upgradeSpecs
      .map((u) => {
        const lvl = stats.upgrades[u.key] || 1;
        const cost = getUpgradeCost(lvl);
        const isMax = lvl >= MAX_UPGRADE_LEVEL || cost === null;
        const canUpgrade = isUnlocked && !isMax && coins >= cost;
        const pips = Array.from({ length: MAX_UPGRADE_LEVEL }, (_, i) => {
          return `<span class="upgrade-pip${i < lvl ? ' filled' : ''}"></span>`;
        }).join('');
        const btnLabel = isMax ? t('maxLevelBtn') : t('upgradeBtn', { cost });

        return `
          <div class="upgrade-row">
            <div class="upgrade-info">
              <div class="upgrade-label-row">
                <span>${u.label}</span>
                <span class="upgrade-value">${u.valueText}</span>
              </div>
              <div class="upgrade-pips">${pips}</div>
            </div>
            <button type="button" class="upgrade-btn" data-upgrade-plane="${plane.id}" data-upgrade-stat="${u.key}" ${canUpgrade ? '' : 'disabled'}>
              ${btnLabel}
            </button>
          </div>
        `;
      })
      .join('');

    this.hangarPanel.innerHTML = `
      <div class="plane-roster">${rosterHtml}</div>
      <div class="plane-detail-card">
        <div class="plane-detail-header">
          <div>
            <div class="plane-detail-title">${t(plane.nameKey)}</div>
            <div class="plane-detail-desc">${t(plane.descKey)}</div>
          </div>
        </div>
        ${actionBtnHtml}
        <div class="upgrade-list">${upgradesHtml}</div>
      </div>
    `;
  }

  showMenu({ levels, progress, bests, coins, hangar }) {
    this.lastMenuData = { levels, progress, bests, coins, hangar };
    this.levelList.innerHTML = '';
    this.menuCoins.textContent = coins;

    if (hangar && (!this.previewPlaneId || !getPlaneConfig(this.previewPlaneId))) {
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
