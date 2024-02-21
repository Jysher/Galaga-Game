'use strict';

import { PlayerProjectile } from "./playerProjectile.js";

class Player {
    constructor(game) {
        this.game = game;
        this.image = document.getElementById('player');
        this.width = this.image.width * .60 * .5;
        this.height = this.image.height * .60;
        this.x = (this.game.width * .5) - (this.width * .5);
        this.y = (this.game.height * .95) - (this.height * .95);
        this.boundsX = (this.game.width * .5) - this.width;
        this.movementSpeedX = 2;
        this.keysSpeedMultiplier = 1;
        this.camSpeedMultiplier = 2;
        this.projectiles = [];
        this.fireRate = 500; // in milliseconds
        this.lastFireTimeStamp = 0;
        this.isInvincible = false;
        this.timeInvincible = 3000; //in milliseconds
        this.blinkRate = 250;
        this.blinkTimer = this.blinkRate * 2;
        this.defaultBlinkTimer = this.blinkTimer;
        this.isBlinking = false;
        this.shootSound = new Audio();
        this.shootSound.src = "Assets/Audio/playerLaserSFX.ogg";
        this.shootSound.volume *= .8;
        this.hitSound = new Audio();
        this.hitSound.src = "Assets/Audio/playerHit.ogg";
        this.hitSound.volume *= .8;
    }

    update(deltaTime) {
        // Movement & Shooting
        if (this.game.gameOver) return;
        if (this.game.keys.includes('ArrowLeft')) this.moveLeft(this.keysSpeedMultiplier);
        if (this.game.keys.includes('ArrowRight')) this.moveRight(this.keysSpeedMultiplier);

        if (this.game.keys.includes(' ')) this.shoot();

        // Projectiles
        this.lastFireTimeStamp += deltaTime;
        this.projectiles.forEach(projectile => projectile.update());
        this.projectiles = this.projectiles.filter(projectile => !projectile.forDeletion);

        if (this.isInvincible) {
            this.timeInvincible -= deltaTime;
            if (this.timeInvincible <= 0) {
                this.isInvincible = false;
                this.isBlinking = false;
                this.timeInvincible = 3000;
                return;
            }

            if (this.blinkTimer >= this.blinkRate) {
                this.isBlinking = true;
                this.blinkTimer -= deltaTime;
            }

            if (this.blinkTimer <= this.blinkRate) {
                this.isBlinking = false;
                this.blinkTimer -= deltaTime;
            }

            if (this.blinkTimer <= 0) this.blinkTimer = this.defaultBlinkTimer;
        }
    }

    draw(context) {
        if (this.game.debugMode) {
            context.strokeStyle = 'red';
            context.strokeRect(this.x, this.y, this.width, this.height);
        }

        this.projectiles.forEach(projectile => projectile.draw(context));

        if (!this.isBlinking) context.drawImage(this.image, this.x - (this.width * .5), this.y, this.width / .5, this.height);
    }

    moveLeft(speedMultiplier = 1) {
        if (this.boundsX > 0) {
            this.x = this.x - this.movementSpeedX * speedMultiplier;
            this.boundsX = this.boundsX - this.movementSpeedX * speedMultiplier;
        }
    }

    moveRight(speedMultiplier = 1) {
        if (this.boundsX + (this.width / .5) < this.game.width) {
            this.x = this.x + this.movementSpeedX * speedMultiplier;
            this.boundsX = this.boundsX + this.movementSpeedX * speedMultiplier;
        }
    }

    shoot() {
        if (this.lastFireTimeStamp > this.fireRate) {
            this.projectiles.push(new PlayerProjectile(this.game, this.x + (this.width * .35), this.y));
            this.lastFireTimeStamp = 0;
            this.shootSound.play();
        }
    }

    restart() {
        this.isInvincible = false;
        this.isBlinking = false;
        this.projectiles.length = 0;
        this.x = (this.game.width * .5) - (this.width * .5);
        this.y = (this.game.height * .95) - (this.height * .95);
        this.boundsX = (this.game.width * .5) - this.width;
        this.lastFireTimeStamp = 0;
    }
}

export { Player };