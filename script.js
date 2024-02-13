'use strict';

window.addEventListener('load', function () {
    const video = document.getElementById('webCam')
    const videoCanvas = document.getElementById('videoCanvas');
    const videoContext = videoCanvas.getContext('2d');
    const blendCanvas = document.getElementById('blendCanvas');
    const blendContext = videoCanvas.getContext('2d');

    // if (navigator.mediaDevices.getUserMedia) {
    //     navigator.mediaDevices.getUserMedia({ video: true })
    //         .then((stream) => {
    //             video.srcObject = stream;
    //         })
    //         .catch((error) => {
    //             console.error('Error accessing webcam:', error);
    //         });
    // } else {
    //     console.error('getUserMedia not supported in this browser.');
    // }

    navigator.getUserMedia({ video: true }, gotStream, noStream);

    function gotStream(stream) {
        video.srcObject = stream;
    }

    function noStream() {
        alert("No webcam found!");
    }

    function drawVideoCanvas() {
        videoContext.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
        videoContext.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
        requestAnimationFrame(drawVideoCanvas);
    }

    function drawBlendCanvas() {
        blendContext.clearRect(0, 0, blendCanvas.width, blendCanvas.height);
        blendContext.drawImage(video, 0, 0, blendCanvas.width, blendCanvas.height);
        requestAnimationFrame(drawBlendCanvas);
    }

    drawVideoCanvas();
    drawBlendCanvas();

    // Canvas Setup
    const canvas = document.getElementById('canvas-1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1440;
    canvas.height = 1080;

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

                if (e.key === 'Enter') this.game.gameStart = !this.game.gameStart;
            });

            window.addEventListener('keyup', e => {
                if (this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
            });
        }
    }

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

    class Particle {

    }

    class Player {
        constructor(game) {
            this.game = game;
            this.image = document.getElementById('player');
            this.width = this.image.width * .60 * .5;
            this.height = this.image.height * .60;
            this.x = (this.game.width * .5) - (this.width * .5);
            this.y = (this.game.height * .95) - (this.height * .95);
            this.movementSpeedX = 2;
            this.projectiles = [];
            this.fireRate = 250; // in milliseconds
            this.lastFireTimeStamp = 0;
        }

        update(deltaTime) {
            // Movement & Shooting
            if (this.game.gameOver) return;
            if (this.game.keys.includes('ArrowLeft') && this.x > 0) this.x -= this.movementSpeedX;
            if (this.game.keys.includes('ArrowRight') && this.x + this.width < this.game.width) this.x += this.movementSpeedX;

            if (this.game.keys.includes(' ')) this.shoot();

            // Projectiles
            this.lastFireTimeStamp += deltaTime;
            this.projectiles.forEach(projectile => projectile.update());
            this.projectiles = this.projectiles.filter(projectile => !projectile.forDeletion);
        }

        draw(context) {
            if (this.game.debugMode) {
                context.strokeStyle = 'red';
                context.strokeRect(this.x, this.y, this.width, this.height);
            }

            this.projectiles.forEach(projectile => projectile.draw(context));

            context.drawImage(this.image, this.x - (this.width * .5), this.y, this.width / .5, this.height);
        }

        shoot() {
            if (this.lastFireTimeStamp > this.fireRate) {
                this.projectiles.push(new PlayerProjectile(this.game, this.x + (this.width * .35), this.y));
                this.lastFireTimeStamp = 0;
            }
        }
    }

    class Enemy {
        constructor(game) {
            this.game = game;
            this.width = 93 * .8;
            this.height = 84 * .8;
            this.forDeletion = false;
            this.projectileImage = document.getElementById('enemy-default-projectile');
            this.projectiles = [];
            // this.speed = 2;
            this.lastFireTimeStamp = 0;
            // this.fireRate = 3000
        }

        update(deltaTime) {
            this.lastFireTimeStamp = Math.floor(this.lastFireTimeStamp + deltaTime);
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
            let randomFireRate = Math.floor(Math.random() * 60 + 4) * 1000;
            if (this.lastFireTimeStamp > randomFireRate) {
                this.projectiles.push(new EnemyProjectile(this.game, this.x + (this.width * .44), this.y, this.projectileImage));
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

    class Background {
        constructor(game) {
            this.game = game;
            this.bgImage = document.getElementById('bg');
            this.bg = new Layer(this.game, this.bgImage, .15);
            this.layers = [this.bg];
        }

        update() {
            this.layers.forEach(layer => layer.update());
        }

        draw(context) {
            this.layers.forEach(layer => layer.draw(context));
        }
    }

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

            context.restore();
        }
    }

    class SplashScreen {
        constructor(game) {
            this.game = game;
            this.titleFontSize = 80;
            this.textFontSize = 45;
            this.fontFamily = 'Nunito';
            this.fontColor = 'white';
            this.titleMaxWidth = 350;
            this.titlePaddingX = 100;
        }

        update() {

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



            context.restore();
        }
    }

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
            this.keys = [];
            this.deltaTime = 0;
            this.gameTimeSeconds = 0;
            this.gameTimeMinutes = 0;
            this.gameTimeHours = 0;
            this.enemyClasses = [
                BlackEnemy1,
                BlackEnemy2,
                BlackEnemy3,
                BlackEnemy4,
            ];
            // enemy row coordinates
            this.xAxis = this.width * .51;
            this.xPadding = 100;

            this.firstRowAxisY = 100;
            this.firstEnemyRow = [
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
            this.secondEnemyRow = [
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
            this.thirdEnemyRow = [
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
            this.fourthEnemyRow = [
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

            this.score = 0;
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
                }

            } else {
                this.splashScreen.update();
            }
        }

        draw(context) {
            this.background.draw(context);
            this.player.draw(context);

            if (this.gameStart) {
                this.ui.draw(context);
                this.firstRowEnemies.forEach(enemy => enemy.draw(context));

                this.secondRowEnemies.forEach(enemy => enemy.draw(context));

                this.thirdRowEnemies.forEach(enemy => enemy.draw(context));

                this.fourthRowEnemies.forEach(enemy => enemy.draw(context));

            } else {
                this.splashScreen.draw(context);
            }
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
                for (let i = 0; i < this.firstEnemyRow.length; i++) {
                    randomEnemy = Math.floor(Math.random() * this.enemyClasses.length);
                    this.firstRowEnemies.push(new this.enemyClasses[randomEnemy](this, this.firstEnemyRow[i][0], this.firstEnemyRow[i][1]));
                }
                this.isFirstRowComplete = true;
            }

            if (!this.isSecondRowComplete) {
                for (let i = 0; i < this.secondEnemyRow.length; i++) {
                    randomEnemy = Math.floor(Math.random() * this.enemyClasses.length);
                    this.secondRowEnemies.push(new this.enemyClasses[randomEnemy](this, this.secondEnemyRow[i][0], this.secondEnemyRow[i][1]));
                }
                this.isSecondRowComplete = true;
            }

            if (!this.isThirdRowComplete) {
                for (let i = 0; i < this.thirdEnemyRow.length; i++) {
                    randomEnemy = Math.floor(Math.random() * this.enemyClasses.length);
                    this.thirdRowEnemies.push(new this.enemyClasses[randomEnemy](this, this.thirdEnemyRow[i][0], this.thirdEnemyRow[i][1]));
                }
                this.isThirdRowComplete = true;
            }

            if (!this.isFourthRowComplete) {
                for (let i = 0; i < this.fourthEnemyRow.length; i++) {
                    randomEnemy = Math.floor(Math.random() * this.enemyClasses.length);
                    this.fourthRowEnemies.push(new this.enemyClasses[randomEnemy](this, this.fourthEnemyRow[i][0], this.fourthEnemyRow[i][1]));
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
                    this.playerLives--;
                    if (this.playerLives <= 0) {
                        this.player.x = 5000;
                        this.player.y = 5000;
                        this.gameOver = true;
                    }
                }

                // Check for Player Projectile-Enemy Collision
                this.player.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)) {
                        enemy.life--;
                        projectile.forDeletion = true;
                        if (enemy.life <= 0) {
                            enemy.forDeletion = true;
                            this.score += enemy.score;
                        }

                    }
                });

                // Check for Enemy Projectile-Player Collision
                enemy.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, this.player)) {
                        projectile.forDeletion = true;
                        this.playerLives--;
                        if (this.playerLives <= 0) {
                            this.player.x = 5000;
                            this.player.y = 5000;
                            this.gameOver = true;
                        }
                    }
                });
            });
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTimeStamp = 0;

    // Render the whole game
    function drawGame(timeStamp) {
        const deltaTime = timeStamp - lastTimeStamp;
        lastTimeStamp = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(drawGame);
    }

    drawGame(0);
});