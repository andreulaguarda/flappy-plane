const EN = {
  documentTitle: 'Flappy Plane - Around the World in 80 Days',

  bestLabel: 'BEST',
  soundToggle: 'Toggle sound',
  pauseToggle: 'Pause game',

  menuBadge: 'AROUND THE WORLD',
  menuTitle: 'FLAPPY PLANE',
  menuSubtitle: '20 stages around the globe. Select a route or visit the hangar.',
  tabStages: '20 STAGES',
  tabHangar: 'HANGAR',
  levelBest: 'BEST {distance} / {total}',
  locked: 'LOCKED · {total}',

  plane1Name: 'AERO CLASSIC',
  plane1Desc: 'Standard classic biplane. Reliable flight with no special bonuses.',
  plane2Name: 'HIGHWING CUB',
  plane2Desc: 'Light high-wing cabin monoplane with slightly smaller hitbox and light magnet.',
  plane3Name: 'BARON VINTAGE',
  plane3Desc: 'Touring biplane with compact wings, 2x coin bonus and emergency shield.',
  plane4Name: 'TUNDRA SCOUT',
  plane4Desc: 'Rugged bush-plane with reinforced frame, strong coin magnet and 28% shield.',
  plane5Name: 'LAGOON HOPPER',
  plane5Desc: 'Sleek amphibious floatplane with 3x coin multiplier and high survivability.',
  plane6Name: 'COMET RACER',
  plane6Desc: 'Ultra-compact air-race championship plane. Tiny hitbox, 4x coins and 50% shield.',

  statSize: 'SIZE',
  statMagnet: 'COIN MAGNET',
  statMultiplier: 'COIN MULTIPLIER',
  statShield: 'SHIELD PROBABILITY',

  statusSelected: 'SELECTED ✓',
  statusUnlocked: 'UNLOCKED',
  statusLocked: 'LOCKED · {cost} COINS',

  selectPlaneBtn: 'SELECT PLANE',
  selectedPlaneBtn: 'SELECTED ✓',
  buyPlaneBtn: 'BUY · {cost} COINS',
  prevPlaneAria: 'Previous plane',
  nextPlaneAria: 'Next plane',

  shieldSubBanner: 'EMERGENCY SHIELD',
  shieldActivatedBanner: 'IMPACT DEFLECTED!',

  level1Name: 'LONDON → PARIS',
  level2Name: 'PARIS → ROME',
  level3Name: 'ROME → ATHENS',
  level4Name: 'ATHENS → CAIRO',
  level5Name: 'CAIRO → BAGHDAD',
  level6Name: 'BAGHDAD → BOMBAY',
  level7Name: 'BOMBAY → CALCUTTA',
  level8Name: 'CALCUTTA → BANGKOK',
  level9Name: 'BANGKOK → SINGAPORE',
  level10Name: 'SINGAPORE → MANILA',
  level11Name: 'MANILA → TOKYO',
  level12Name: 'TOKYO → MIDWAY ISLANDS',
  level13Name: 'MIDWAY → HONOLULU',
  level14Name: 'HONOLULU → SAN FRANCISCO',
  level15Name: 'SAN FRANCISCO → NEW YORK',
  level16Name: 'NEW YORK → NEWFOUNDLAND',
  level17Name: 'NEWFOUNDLAND → GREENLAND',
  level18Name: 'GREENLAND → REYKJAVIK',
  level19Name: 'REYKJAVIK → DUBLIN',
  level20Name: 'DUBLIN → LONDON',

  levelBannerSub: 'STAGE {level} · {distance}',
  levelBadge: 'STAGE {level} · {name}',
  finalApproach: 'FINAL APPROACH · {city}',

  pauseBadge: 'FLIGHT ON HOLD',
  pauseTitle: 'PAUSED',
  pauseSubtitle: 'Take a breath before returning to the skies.',
  resumeFlight: 'RESUME FLIGHT',
  restartLevel: 'RESTART STAGE',
  menu: 'MENU',

  gameOverTitle: 'CRASH LANDING!',
  distanceLabel: 'DISTANCE',
  coinsLabel: 'COINS',
  retry: 'RETRY',

  completeBadge: 'STAGE {level} COMPLETE',
  completeTitle: 'PERFECT LANDING!',
  completeSubtitle: 'A flawless flight from takeoff to touchdown.',
  allCompleteTitle: 'WORLD TOUR COMPLETE!',
  allCompleteSubtitle: 'You have circled the globe from London back to London!',
  nextLevel: 'NEXT STAGE',

  medalLegend: 'Rank: World Navigator',
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
