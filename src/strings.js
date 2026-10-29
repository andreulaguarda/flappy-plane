const EN = {
  documentTitle: 'Flappy Plane - 3D Arcade',

  bestLabel: 'BEST',
  soundToggle: 'Toggle sound',
  pauseToggle: 'Pause game',

  menuBadge: '3D ARCADE',
  menuTitle: 'FLAPPY PLANE',
  menuSubtitle: 'Select a level and take off.',
  levelBest: 'BEST {distance}',
  locked: 'LOCKED',

  level1Name: 'PIPE VALLEY',
  level2Name: 'CITY TOWERS',
  level3Name: 'GOLDEN RINGS',
  level4Name: 'STORM PEAKS',
  level5Name: 'TOTAL CHAOS',

  levelBannerSub: 'LEVEL {level}',
  levelBadge: 'LEVEL {level} · {name}',
  finalApproach: 'FINAL APPROACH',

  pauseBadge: 'FLIGHT ON HOLD',
  pauseTitle: 'PAUSED',
  pauseSubtitle: 'Take a breath before returning to the skies.',
  resumeFlight: 'RESUME FLIGHT',
  restartLevel: 'RESTART LEVEL',
  menu: 'MENU',

  gameOverTitle: 'CRASH LANDING!',
  distanceLabel: 'DISTANCE',
  coinsLabel: 'COINS',
  retry: 'RETRY',

  completeBadge: 'LEVEL {level} COMPLETE',
  completeTitle: 'PERFECT LANDING!',
  completeSubtitle: 'A flawless flight from takeoff to touchdown.',
  allCompleteTitle: 'ALL LEVELS COMPLETE!',
  allCompleteSubtitle: 'You have mastered every zone of the sky.',
  nextLevel: 'NEXT LEVEL',

  medalLegend: 'Rank: Air Legend',
  medalGold: 'Rank: Gold Commander',
  medalSilver: 'Rank: Silver Captain',
  medalBronze: 'Rank: Bronze Aviator',
  medalCadet: 'Rank: Flight Cadet'
};

export const STRINGS = { en: EN };

let currentLocale = 'en';

export function setLocale(locale) {
  currentLocale = STRINGS[locale] ? locale : 'en';
}

export function t(key, params = {}) {
  const dictionary = STRINGS[currentLocale] || EN;
  const template = dictionary[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (match, name) => {
    return params[name] !== undefined ? String(params[name]) : match;
  });
}

export function applyStaticTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const text = t(el.dataset.i18nTitle);
    el.title = text;
    el.setAttribute('aria-label', text);
  });
  if (root === document) {
    document.title = t('documentTitle');
  }
}
