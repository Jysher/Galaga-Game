'use strict';

import { InputHandler } from "./inputHandler.js";
import { Player } from "./player.js";
import { BlackEnemy1, BlackEnemy2, BlackEnemy3, BlackEnemy4 } from "./enemies.js";
import { Background } from "./background.js";
import { UI } from "./ui.js";
import { SplashScreen } from "./splashScreen.js";

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.splashScreen = new SplashScreen(this);
        this.background = new Background(this);
        this.ui = new UI(this);
        this.input = new InputHandler(this);
        this.player = new Player(this);
        this.playerLives = 3;
        this.maxPlayerLives = 9;
        this.keys = [];
        this.deltaTime = 0;
        this.gameTimeSeconds = 0;
        this.gameTimeMinutes = 0;
        this.gameTimeHours = 0;
        this.defaultTimeIncDiff = 1;
        this.timeToIncreaseDifficulty = this.defaultTimeIncDiff;
        this.increaseDifficulty = false;
        this.timeSurvived = '';
        this.fireSuccessChance = 10;
        this.fireRateStartRange = 5;
        this.fireRateEndRange = 50;
        this.enemyClasses = [
            BlackEnemy1,
            BlackEnemy2,
            BlackEnemy3,
            BlackEnemy4,
        ];
        // enemy row coordinates
        this.xAxis = this.width * .50;
        this.xPadding = 100;

        this.firstRowAxisY = 100;
        this.firstEnemyRowLoc = [
            [this.xAxis, this.firstRowAxisY],
            [(this.xAxis + this.xPadding), this.firstRowAxisY],
            [(this.xAxis + this.xPadding * 2), this.firstRowAxisY],
            [(this.xAxis + this.xPadding * 3), this.firstRowAxisY],
            [(this.xAxis + this.xPadding * 4), this.firstRowAxisY],
            [(this.xAxis + this.xPadding * 5), this.firstRowAxisY],
            [(this.xAxis - this.xPadding), this.firstRowAxisY],
            [(this.xAxis - this.xPadding * 2), this.firstRowAxisY],
            [(this.xAxis - this.xPadding * 3), this.firstRowAxisY],
            [(this.xAxis - this.xPadding * 4), this.firstRowAxisY],
            [(this.xAxis - this.xPadding * 5), this.firstRowAxisY],
            [(this.xAxis - this.xPadding * 6), this.firstRowAxisY],
        ];
        this.isFirstRowComplete = false;
        this.firstRowEnemies = [];
        this.firstRowSpawnCounter = 0;
        this.firstRowRespawn = 5000;

        this.secondRowAxisY = 200;
        this.secondEnemyRowLoc = [
            [this.xAxis, this.secondRowAxisY],
            [(this.xAxis + this.xPadding), this.secondRowAxisY],
            [(this.xAxis + this.xPadding * 2), this.secondRowAxisY],
            [(this.xAxis + this.xPadding * 3), this.secondRowAxisY],
            [(this.xAxis + this.xPadding * 4), this.secondRowAxisY],
            [(this.xAxis + this.xPadding * 5), this.secondRowAxisY],
            [(this.xAxis - this.xPadding), this.secondRowAxisY],
            [(this.xAxis - this.xPadding * 2), this.secondRowAxisY],
            [(this.xAxis - this.xPadding * 3), this.secondRowAxisY],
            [(this.xAxis - this.xPadding * 4), this.secondRowAxisY],
            [(this.xAxis - this.xPadding * 5), this.secondRowAxisY],
            [(this.xAxis - this.xPadding * 6), this.secondRowAxisY],
        ];
        this.isSecondRowComplete = false;
        this.secondRowEnemies = [];
        this.secondRowSpawnCounter = 0;
        this.secondRowRespawn = 5000;

        this.thirdRowAxisY = 300;
        this.thirdEnemyRowLoc = [
            [this.xAxis, this.thirdRowAxisY],
            [(this.xAxis + this.xPadding), this.thirdRowAxisY],
            [(this.xAxis + this.xPadding * 2), this.thirdRowAxisY],
            [(this.xAxis + this.xPadding * 3), this.thirdRowAxisY],
            [(this.xAxis + this.xPadding * 4), this.thirdRowAxisY],
            [(this.xAxis + this.xPadding * 5), this.thirdRowAxisY],
            [(this.xAxis - this.xPadding), this.thirdRowAxisY],
            [(this.xAxis - this.xPadding * 2), this.thirdRowAxisY],
            [(this.xAxis - this.xPadding * 3), this.thirdRowAxisY],
            [(this.xAxis - this.xPadding * 4), this.thirdRowAxisY],
            [(this.xAxis - this.xPadding * 5), this.thirdRowAxisY],
            [(this.xAxis - this.xPadding * 6), this.thirdRowAxisY],
        ];
        this.isThirdRowComplete = false;
        this.thirdRowEnemies = [];
        this.thirdRowSpawnCounter = 0;
        this.thirdRowRespawn = 5000;

        this.fourthRowAxisY = 400;
        this.fourthEnemyRowLoc = [
            [this.xAxis, this.fourthRowAxisY],
            [(this.xAxis + this.xPadding), this.fourthRowAxisY],
            [(this.xAxis + this.xPadding * 2), this.fourthRowAxisY],
            [(this.xAxis + this.xPadding * 3), this.fourthRowAxisY],
            [(this.xAxis + this.xPadding * 4), this.fourthRowAxisY],
            [(this.xAxis + this.xPadding * 5), this.fourthRowAxisY],
            [(this.xAxis - this.xPadding), this.fourthRowAxisY],
            [(this.xAxis - this.xPadding * 2), this.fourthRowAxisY],
            [(this.xAxis - this.xPadding * 3), this.fourthRowAxisY],
            [(this.xAxis - this.xPadding * 4), this.fourthRowAxisY],
            [(this.xAxis - this.xPadding * 5), this.fourthRowAxisY],
            [(this.xAxis - this.xPadding * 6), this.fourthRowAxisY],
        ];
        this.isFourthRowComplete = false;
        this.fourthRowEnemies = [];
        this.fourthRowSpawnCounter = 0;
        this.fourthRowRespawn = 5000;

        this.startBGM = new Audio();
        this.startBGM.src = "Assets/Audio/GameStart.wav";
        this.startBGM.volume *= .5;
        this.endBGM = new Audio();
        this.endBGM.src = "Assets/Audio/Ending.wav";
        this.endBGM.volume *= .5;
        this.score = 0;
        this.scoreToIncreaseLife = 2000;
        this.gameSpeed = 1;
        this.gameStart = false;
        this.gameOver = false;
        this.debugMode = false;
    }

    update(deltaTime) {
        this.deltaTime += deltaTime;
        this.background.update();
        this.player.update(deltaTime);

        if (this.gameStart) {
            this.gameTimeSeconds += deltaTime;

            if (this.gameTimeSeconds > 60000) {
                this.gameTimeMinutes++;
                this.gameTimeSeconds = 0;
            }
            if (this.gameTimeMinutes >= 60) {
                this.gameTimeHours++;
                this.gameTimeMinutes = 0;
                this.timeToIncreaseDifficulty = this.defaultTimeIncDiff;
            }

            if (this.increaseDifficulty) {
                if (this.fireSuccessChance < 100) this.fireSuccessChance += 5;
                if (this.fireSuccessChance >= 100) {
                    if (this.fireRateStartRange > 1) this.fireRateStartRange--;
                    if (this.fireRateEndRange > 2) this.fireRateEndRange--;
                }
                this.increaseDifficulty = false;
            }

            if (this.gameTimeMinutes >= this.timeToIncreaseDifficulty) {
                this.timeToIncreaseDifficulty += this.defaultTimeIncDiff;
                this.increaseDifficulty = true;
            }

            if (this.firstRowEnemies.length === 0 && this.isFirstRowComplete) this.firstRowSpawnCounter += deltaTime;
            if (this.secondRowEnemies.length === 0 && this.isSecondRowComplete) this.secondRowSpawnCounter += deltaTime;
            if (this.thirdRowEnemies.length === 0 && this.isThirdRowComplete) this.thirdRowSpawnCounter += deltaTime;
            if (this.fourthRowEnemies.length === 0 && this.isFourthRowComplete) this.fourthRowSpawnCounter += deltaTime;

            this.firstRowEnemies.forEach(enemy => enemy.update(deltaTime));
            this.firstRowEnemies = this.firstRowEnemies.filter(enemy => !enemy.forDeletion);

            this.secondRowEnemies.forEach(enemy => enemy.update(deltaTime));
            this.secondRowEnemies = this.secondRowEnemies.filter(enemy => !enemy.forDeletion);

            this.thirdRowEnemies.forEach(enemy => enemy.update(deltaTime));
            this.thirdRowEnemies = this.thirdRowEnemies.filter(enemy => !enemy.forDeletion);

            this.fourthRowEnemies.forEach(enemy => enemy.update(deltaTime));
            this.fourthRowEnemies = this.fourthRowEnemies.filter(enemy => !enemy.forDeletion);

            this.onEnemyCollision(...this.firstRowEnemies, ...this.secondRowEnemies, ...this.thirdRowEnemies, ...this.fourthRowEnemies);

            if (!this.gameOver) {
                this.addEnemy();

                this.splashScreen.sound.pause();
                this.startBGM.play();
                this.endBGM.currentTime = 0;
                this.endBGM.pause();

                if (this.startBGM.currentTime >= this.startBGM.duration - .05) this.startBGM.currentTime = 0;
            } else {
                this.startBGM.pause();
                this.startBGM.currentTime = 0;
                this.endBGM.play();

                if (this.endBGM.currentTime >= this.endBGM.duration - .05) this.endBGM.currentTime = 0;

                this.firstRowEnemies.length = 0;
                this.secondRowEnemies.length = 0;
                this.thirdRowEnemies.length = 0;
                this.fourthRowEnemies.length = 0;
                this.player.projectiles.length = 0;
            }
        } else {
            this.splashScreen.update();
        }

    }

    draw(context) {
        this.background.draw(context);
        this.player.draw(context);

        if (this.gameStart) {
            this.firstRowEnemies.forEach(enemy => enemy.draw(context));

            this.secondRowEnemies.forEach(enemy => enemy.draw(context));

            this.thirdRowEnemies.forEach(enemy => enemy.draw(context));

            this.fourthRowEnemies.forEach(enemy => enemy.draw(context));

        } else {
            this.splashScreen.draw(context);
        }

        this.ui.draw(context);
    }

    addEnemy() {
        let randomEnemy = 0;

        if (this.firstRowSpawnCounter > this.firstRowRespawn) {
            this.firstRowSpawnCounter = 0;
            this.isFirstRowComplete = false;
        }

        if (this.secondRowSpawnCounter > this.secondRowRespawn) {
            this.secondRowSpawnCounter = 0;
            this.isSecondRowComplete = false;
        }

        if (this.thirdRowSpawnCounter > this.thirdRowRespawn) {
            this.thirdRowSpawnCounter = 0;
            this.isThirdRowComplete = false;
        }

        if (this.fourthRowSpawnCounter > this.fourthRowRespawn) {
            this.fourthRowSpawnCounter = 0;
            this.isFourthRowComplete = false;
        }

        if (!this.isFirstRowComplete) {
            for (let i = 0; i < this.firstEnemyRowLoc.length; i++) {
                randomEnemy = Math.floor(Math.random() * this.enemyClasses.length);
                this.firstRowEnemies.push(new this.enemyClasses[randomEnemy](this, this.firstEnemyRowLoc[i][0], this.firstEnemyRowLoc[i][1]));
            }
            this.isFirstRowComplete = true;
        }

        if (!this.isSecondRowComplete) {
            for (let i = 0; i < this.secondEnemyRowLoc.length; i++) {
                randomEnemy = Math.floor(Math.random() * this.enemyClasses.length);
                this.secondRowEnemies.push(new this.enemyClasses[randomEnemy](this, this.secondEnemyRowLoc[i][0], this.secondEnemyRowLoc[i][1]));
            }
            this.isSecondRowComplete = true;
        }

        if (!this.isThirdRowComplete) {
            for (let i = 0; i < this.thirdEnemyRowLoc.length; i++) {
                randomEnemy = Math.floor(Math.random() * this.enemyClasses.length);
                this.thirdRowEnemies.push(new this.enemyClasses[randomEnemy](this, this.thirdEnemyRowLoc[i][0], this.thirdEnemyRowLoc[i][1]));
            }
            this.isThirdRowComplete = true;
        }

        if (!this.isFourthRowComplete) {
            for (let i = 0; i < this.fourthEnemyRowLoc.length; i++) {
                randomEnemy = Math.floor(Math.random() * this.enemyClasses.length);
                this.fourthRowEnemies.push(new this.enemyClasses[randomEnemy](this, this.fourthEnemyRowLoc[i][0], this.fourthEnemyRowLoc[i][1]));
            }
            this.isFourthRowComplete = true;
        }
    }

    checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    onEnemyCollision(...enemies) {
        enemies.forEach(enemy => {
            // Check for Player-Enemy Collision
            if (this.checkCollision(this.player, enemy)) {
                enemy.forDeletion = true;
                this.onPlayerHit();
            }

            // Check for Player Projectile-Enemy Collision
            this.player.projectiles.forEach(projectile => {
                if (this.checkCollision(projectile, enemy)) {
                    enemy.life--;
                    projectile.forDeletion = true;
                    if (enemy.life <= 0) {
                        enemy.destroySound.play();
                        enemy.forDeletion = true;
                        this.score += enemy.score;

                        if (this.score > this.scoreToIncreaseLife) {
                            if (this.playerLives < this.maxPlayerLives) this.playerLives++;
                            this.scoreToIncreaseLife += this.scoreToIncreaseLife;
                        }
                    }

                }
            });

            // Check for Enemy Projectile-Player Collision
            enemy.projectiles.forEach(projectile => {
                if (this.checkCollision(projectile, this.player)) {
                    projectile.forDeletion = true;
                    this.onPlayerHit();
                }
            });
        });
    }

    onPlayerHit() {
        if (!this.player.isInvincible) {
            this.player.isInvincible = true;
            this.playerLives--;
            this.player.hitSound.play();
            if (this.playerLives <= 0) {
                this.player.x = 5000;
                this.player.y = 5000;
                this.gameOver = true;
                this.timeSurvived = this.gameTimeHours + ":" + this.gameTimeMinutes + ":" + (this.gameTimeSeconds * .001).toFixed(1);
            }
        }
    }

    restartGame() {
        this.gameOver = false;
        this.player.restart();
        this.playerLives = 3;
        this.deltaTime = 0;
        this.score = 0;
        this.gameTimeSeconds = 0;
        this.gameTimeMinutes = 0;
        this.gameTimeHours = 0;
        this.keys.length = 0;
        this.firstRowEnemies.length = 0;
        this.secondRowEnemies.length = 0;
        this.thirdRowEnemies.length = 0;
        this.fourthRowEnemies.length = 0;
        this.isFirstRowComplete = false;
        this.isSecondRowComplete = false;
        this.isThirdRowComplete = false;
        this.isFourthRowComplete = false;
        this.fireSuccessChance = 10;
        this.fireRateStartRange = 5;
        this.fireRateEndRange = 50;
    }
}

export { Game };