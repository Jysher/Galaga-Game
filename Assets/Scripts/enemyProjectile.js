'use strict';

class EnemyProjectile {
    constructor(game, x, y, projectileImage) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 9;
        this.height = 37;
        this.speed = 3;
        this.forDeletion = false;
        this.projectileImage = projectileImage;
    }

    update() {
        this.y += this.speed;
        if (this.y > this.game.height) this.forDeletion = true;
    }

    draw(context) {
        if (this.game.debugMode) {
            context.strokeStyle = 'yellow';
            context.strokeRect(this.x, this.y, this.width, this.height);
        }

        context.drawImage(this.projectileImage, this.x, this.y, this.width, this.height);
    }
}

export { EnemyProjectile };