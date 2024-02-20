'use strict';

class PlayerProjectile {
    constructor(game, x, y) {
        this.game = game;
        this.image = document.getElementById('player-projectile');
        this.x = x;
        this.y = y;
        this.width = 9;
        this.height = 37;
        this.speed = 3;
        this.forDeletion = false;
    }

    update() {
        this.y -= this.speed;
        if (this.y < 1) this.forDeletion = true;
    }

    draw(context) {
        if (this.game.debugMode) {
            context.strokeStyle = 'yellow';
            context.strokeRect(this.x, this.y, this.width, this.height);
        }

        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export { PlayerProjectile };