'use strict';

class SplashScreen {
    constructor(game) {
        this.game = game;
        this.titleFontSize = 80;
        this.textFontSize = 45;
        this.subtextFontSize = 25;
        this.fontFamily = 'Nunito';
        this.fontColor = 'white';
        this.titleMaxWidth = 350;
        this.titlePaddingX = 100;
        this.sound = new Audio();
        this.sound.src = "Assets/Audio/TitleScreen.wav";
        this.sound.volume *= .5;
    }

    update() {
        if (this.game.deltaTime >= 1) {
            this.sound.play().catch(() => console.log());

            if (this.sound.currentTime >= this.sound.duration - .05) this.sound.currentTime = 0;
        }

    }

    draw(context) {
        context.save();
        context.fillStyle = this.fontColor;

        // Title
        context.font = this.titleFontSize + 'px ' + this.fontFamily;
        context.textAlign = 'center';
        context.fillText(`SPACE DEFENDER`, this.game.width * .5, this.game.height * .35);

        // Controls
        context.font = this.textFontSize + 'px ' + this.fontFamily;
        context.fillText(`Press Enter to Start`, this.game.width * .5, this.game.height * .5);
        context.font = this.subtextFontSize + 'px ' + this.fontFamily;
        context.fillText(`Use your webcam to move left, right, and shoot.`, this.game.width * .5, this.game.height * .55);
        context.fillText(`Motion found within the red boxes triggers corresponding movement.`, this.game.width * .5, this.game.height * .58);
        context.fillText(`Alternatively, use the arrow keys and spacebar to move and shoot.`, this.game.width * .5, this.game.height * .61);

        context.restore();
    }
}

export { SplashScreen };