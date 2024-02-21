'use strict';

import { EnemyProjectile } from "./enemyProjectile.js";

class Enemy {
    constructor(game) {
        this.game = game;
        this.width = 93 * .8;
        this.height = 84 * .8;
        this.forDeletion = false;
        this.projectileImage = document.getElementById('enemy-default-projectile');
        this.projectiles = [];
        this.lastFireTimeStamp = 0;
        this.fireRate = 1000;
        // this.speed = 2;
        this.shootSound = new Audio();
        this.shootSound.src = "/Assets/Audio/enemyLaserSFX.ogg";
        this.shootSound.volume *= .7;
        this.destroySound = new Audio();
        this.destroySound.src = "/Assets/Audio/enemyDestroyed.ogg";
        this.destroySound.volume *= .7;
    }

    update(deltaTime) {
        this.lastFireTimeStamp += deltaTime;
        this.shoot();

        this.projectiles.forEach(projectile => projectile.update());
        this.projectiles = this.projectiles.filter(projectile => !projectile.forDeletion);
    }

    draw(context) {
        if (this.game.debugMode) {
            context.strokeStyle = 'red';
            context.strokeRect(this.x, this.y, this.width, this.height);
        }

        this.projectiles.forEach(projectile => projectile.draw(context));

        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    shoot() {
        let randomFireRate = Math.floor(((Math.random() * this.game.fireRateEndRange) + this.game.fireRateStartRange) * 1000);

        if (this.lastFireTimeStamp >= randomFireRate) {

            let fireChance = Math.round(Math.random() * 100);
            if (this.game.fireSuccessChance >= fireChance) {
                this.projectiles.push(new EnemyProjectile(this.game, this.x + (this.width * .44), this.y, this.projectileImage));
                this.shootSound.play();
            }
            this.lastFireTimeStamp = 0;

        }

    }
}

class BlackEnemy1 extends Enemy {
    constructor(game, x, y) {
        super(game);
        super.projectileImage = document.getElementById('enemy-1-projectile');
        this.image = document.getElementById('enemy-1');
        this.x = x;
        this.y = y;
        this.life = 5;
        this.score = 300;
        // this.speed = 2;
    }

    update(deltaTime) {
        super.update(deltaTime);
        // this.y += this.speed;
        // if (this.y > this.game.height) this.forDeletion = true;
    }
}

class BlackEnemy2 extends Enemy {
    constructor(game, x, y) {
        super(game);
        super.projectileImage = document.getElementById('enemy-2-projectile');
        this.image = document.getElementById('enemy-2');
        this.x = x;
        this.y = y;
        this.life = 4;
        this.score = 100;
        // this.speed = 2;
    }

    update(deltaTime) {
        super.update(deltaTime);
        // this.y += this.speed;
        // if (this.y > this.game.height) this.forDeletion = true;
    }
}

class BlackEnemy3 extends Enemy {
    constructor(game, x, y) {
        super(game);
        this.image = document.getElementById('enemy-3');
        this.x = x;
        this.y = y;
        this.life = 2;
        this.score = 100;
        // this.speed = 2;
    }

    update(deltaTime) {
        super.update(deltaTime);
        // this.y += this.speed;
        // if (this.y > this.game.height) this.forDeletion = true;
    }
}

class BlackEnemy4 extends Enemy {
    constructor(game, x, y) {
        super(game);
        this.image = document.getElementById('enemy-4');
        this.x = x;
        this.y = y;
        this.life = 1;
        this.score = 100;
        // this.speed = 2;
    }

    update(deltaTime) {
        super.update(deltaTime);
        // this.y += this.speed;
        // if (this.y > this.game.height) this.forDeletion = true;
    }
}

export { Enemy, BlackEnemy1, BlackEnemy2, BlackEnemy3, BlackEnemy4 };