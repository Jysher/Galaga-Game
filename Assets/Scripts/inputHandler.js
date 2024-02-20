'use strict';

class InputHandler {
    constructor(game) {
        this.game = game;
        window.addEventListener('keydown', e => {
            if (((e.key === 'ArrowLeft') ||
                (e.key === 'ArrowRight') ||
                (e.key === ' ')) &&

                this.game.keys.indexOf(e.key) === -1) {
                this.game.keys.push(e.key);
            }

            if (e.key === 'd') this.game.debugMode = !this.game.debugMode;

            if (e.key === 'Enter' && !this.game.gameStart) {
                this.game.gameStart = !this.game.gameStart;
                this.game.restartGame();
            }
            if (e.key === 'Enter' && this.game.gameOver) this.game.restartGame();
        });

        window.addEventListener('keyup', e => {
            if (this.game.keys.indexOf(e.key) > -1) {
                this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
            }
        });
    }
}

export { InputHandler };