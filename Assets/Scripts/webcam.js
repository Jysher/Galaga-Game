'use strict';

// Webcam Setup
const video = document.getElementById('webCam')
const videoCanvas = document.getElementById('videoCanvas');
const videoContext = videoCanvas.getContext('2d', { willReadFrequently: true });
const blendCanvas = document.getElementById('blendCanvas');
const blendContext = blendCanvas.getContext('2d', { willReadFrequently: true });
let currentImage, lastImage, blendImage;
const controlAreas = [
    {
        name: 'Left',
        x: blendCanvas.width * .75,
        y: 0,
        width: blendCanvas.width * .25,
        height: blendCanvas.height
    },
    {
        name: 'Right',
        x: 0,
        y: 0,
        width: blendCanvas.width * .25,
        height: blendCanvas.height
    },
    {
        name: 'Shoot',
        x: blendCanvas.width * .25,
        y: 0,
        width: blendCanvas.width * .50,
        height: blendCanvas.height
    }
];

navigator.getUserMedia({ video: true }, gotStream, noStream);

function gotStream(stream) {
    video.srcObject = stream;
}

function noStream() {
    alert("No webcam found!");
}

function drawVideoCanvas(game) {
    videoContext.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
    videoContext.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
    drawBlendCanvas();
    checkAreas(game);
}

function drawBlendCanvas() {
    let width = videoCanvas.width;
    let height = videoCanvas.height;
    currentImage = videoContext.getImageData(0, 0, width, height,);
    if (!lastImage) lastImage = videoContext.getImageData(0, 0, width, height);
    blendImage = videoContext.createImageData(width, height);
    checkDiff(currentImage.data, lastImage.data, blendImage.data);
    blendContext.putImageData(blendImage, 0, 0);

    lastImage = currentImage;
}

function threshold(value) {
    return (value > 0x15) ? 0xff : 0;
}

function checkDiff(currentImage, lastImage, blendImage) {
    if (currentImage.length != lastImage.length) return null;
    let i = 0;
    while (i < (currentImage.length / 4)) {
        let average1 = (currentImage[4 * i] + currentImage[4 * i + 1] + currentImage[4 * i + 2]) / 3;
        let average2 = (lastImage[4 * i] + lastImage[4 * i + 1] + lastImage[4 * i + 2]) / 3;
        let diff = threshold(Math.abs(average1 - average2));
        blendImage[4 * i] = diff;
        blendImage[4 * i + 1] = diff;
        blendImage[4 * i + 2] = diff;
        blendImage[4 * i + 3] = 0xff;
        ++i;
    }
}

function checkAreas(game) {
    controlAreas.forEach(area => {
        videoContext.strokeStyle = 'red';
        videoContext.strokeRect(area.x, area.y, area.width, area.height);

        let name = area.name;
        let blendData = blendContext.getImageData(area.x, area.y, area.width, area.height);
        let i = 0;
        let average = 0;

        while (i < (blendData.data.length / 4)) {
            average += (blendData.data[i * 4] + blendData.data[i * 4 + 1] + blendData.data[i * 4 + 2]) / 3;
            ++i;
        }

        average = (Math.round(average / (blendData.data.length / 4)));

        if (average > 10) {
            if (name === 'Left') game.player.moveLeft(game.player.camSpeedMultiplier);
            if (name === 'Right') game.player.moveRight(game.player.camSpeedMultiplier);
            if (name === 'Shoot') game.player.shoot();
        }
    });
}

function init(game) {
    drawVideoCanvas(game);
}

export { init };