'use strict';

import { Layer } from "./layer.js";

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

export { Background };