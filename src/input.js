import { STATE } from './config.js';

export function bindInput(game) {
  function onPointerDown(event) {
    if (event.target.closest('button') || event.target.closest('.modal-card')) return;
    if (game.state === STATE.PLAYING) {
      game.flap();
    }
  }

  window.addEventListener('pointerdown', onPointerDown);

  return function destroy() {
    window.removeEventListener('pointerdown', onPointerDown);
  };
}
