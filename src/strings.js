const EN = {
  documentTitle: 'Flappy Plane - Around the World in 80 Days',

  bestLabel: 'BEST',
  soundToggle: 'Toggle sound',
  pauseToggle: 'Pause game',

  menuBadge: 'AROUND THE WORLD',
  menuTitle: 'FLAPPY PLANE',
  menuSubtitle: '20 stages around the globe. Select a route or upgrade your fleet.',
  tabStages: '20 STAGES',
  tabHangar: 'HANGAR (9 PLANES)',
  levelBest: 'BEST {distance} / {total}',
  locked: 'LOCKED · {total}',

  plane1Name: 'ATLAS CARGO',
  plane1Desc: 'Heavy twin-engine freighter. Large frame and heavy descent.',
  plane2Name: 'AERO CLASSIC',
  plane2Desc: 'Balanced aerobatic biplane with classic handling.',
  plane3Name: 'BARON VINTAGE',
  plane3Desc: 'Touring biplane with lighter wings and smooth glide.',
  plane4Name: 'MULE FREIGHTER',
  plane4Desc: 'Medium twin-tail utility prop with magnetic cargo hold.',
  plane5Name: 'LAGOON MARINER',
  plane5Desc: 'Twin-float seaplane with overhead engine and sturdy hull.',
  plane6Name: 'BREEZE ULTRALIGHT',
  plane6Desc: 'Featherweight delta parasol glider with slow, gentle fall.',
  plane7Name: 'SOVEREIGN EXEC',
  plane7Desc: 'Sleek swept-wing executive jet with compact profile.',
  plane8Name: 'VALKYRIE INTERCEPTOR',
  plane8Desc: 'Agile delta-wing interceptor built for tight gaps.',
  plane9Name: 'MICRO PULSE X-9',
  plane9Desc: 'Experimental sub-compact canard prototype. Tiny & ultralight.',

  statSize: 'SIZE (SMALLER = EASIER)',
  statWeight: 'WEIGHT (LIGHTER = SLOWER FALL)',
  statMagnet: 'COIN MAGNET',
  statMultiplier: 'COIN MULTIPLIER',
  statShield: 'EMERGENCY SHIELD',

  selectPlaneBtn: 'EQUIP PLANE',
  selectedPlaneBtn: 'EQUIPPED ✓',
  buyPlaneBtn: 'UNLOCK · {cost} COINS',
  upgradeBtn: 'UPGRADE · {cost}',
  maxLevelBtn: 'MAX',

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
