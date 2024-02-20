'use strict';

class Layer {
    constructor(game, image, speedModifier) {
        this.game = game;
        this.image = image;
        this.speedModifier = speedModifier;
        this.width = 2048;
        this.height = 2048;
        this.x = 0;
        this.y = 0;
    }

    update() {
        if (this.y >= this.height) {
            this.y = 0;
        }

        this.y += this.game.gameSpeed * this.speedModifier;
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y);
        context.drawImage(this.image, this.x, 1 + (this.y - this.height));
    }
}

export { Layer };