'use strict';

import { init as webcamInit } from "./Assets/Scripts/webcam.js";
import { Game } from "./Assets/Scripts/game.js";

window.addEventListener('load', function () {
    // Canvas Setup
    const canvas = document.getElementById('canvas-1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1440;
    canvas.height = 1080;

    const game = new Game(canvas.width, canvas.height);
    let lastTimeStamp = 0;

    // Render the whole game
    function drawGame(timeStamp) {
        const deltaTime = timeStamp - lastTimeStamp;
        lastTimeStamp = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        webcamInit(game);
        requestAnimationFrame(drawGame);
    }

    drawGame(0);
});