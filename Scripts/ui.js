'use strict';

class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 25;
        this.fontFamily = 'Nunito';
        this.scoreColor = 'white';
        this.lifeColor = 'red';
    }

    draw(context) {
        context.save();

        if (!this.game.gameOver) {
            context.fillStyle = this.scoreColor;
            // Score
            context.font = this.fontSize + 'px ' + this.fontFamily;
            context.fillText('Score: ' + this.game.score, (this.game.width * .5) - 50, 40);

            // Game Time
            context.fillText(`Time: ${this.game.gameTimeHours}:${this.game.gameTimeMinutes}:${(this.game.gameTimeSeconds * .001).toFixed(1)}`, this.game.width * .8, 40);

            // Player Lives
            for (let i = 0; i < this.game.playerLives; i++) {
                context.fillStyle = this.lifeColor;
                context.drawImage(this.game.player.image, 20 + 50 * i, 20, this.game.player.width * .75 / .5, this.game.player.height * .75);
            }
        } else {
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.font = '80px ' + this.fontFamily;
            context.fillText('GAME OVER', this.game.width * .5, this.game.height * .35);
            context.fillStyle = 'white';
            context.fillText('GAME OVER', this.game.width * .5 + 2, this.game.height * .35 + 2);

            context.font = '45px ' + this.fontFamily;
            context.fillText(`Your Score: ${this.game.score}`, this.game.width * .5, this.game.height * .35 + 75);
            context.fillText(`Time Survived: ${this.game.timeSurvived}`, this.game.width * .5, this.game.height * .35 + 150);
            context.fillText('Press Enter to Restart', this.game.width * .5, this.game.height * .6);
        }

        context.restore();
    }
}

export { UI };