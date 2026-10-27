import { STATE } from './config.js';

export function bindInput(game) {
  function onPointerDown(event) {
    if (event.target.closest('button') || event.target.closest('.modal-card')) return;
    if (game.state === STATE.PLAYING) {
      game.flap();
    }
  }

  function onKeyDown(event) {
    if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'KeyW') {
      event.preventDefault();
      game.primaryAction();
    } else if (event.code === 'KeyP' || event.code === 'Escape') {
      game.togglePause();
    } else if (event.code === 'KeyR') {
      if (
        game.state === STATE.PLAYING ||
        game.state === STATE.PAUSED ||
        game.state === STATE.GAMEOVER
      ) {
        game.startGame();
      }
    }
  }

  window.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('keydown', onKeyDown);

  return function destroy() {
    window.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('keydown', onKeyDown);
  };
}
