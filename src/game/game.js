const phaser = require("phaser");

const sizes = {
  width: 200,
  height: 400,
};

const speedDown = 300;

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
  }

  preload() {
    this.load.image("bg", "/assets/images/bgFish.png");
  }
  create() {
    this.add.image(0, 0, "bg");
  }
  update() {}
}

const config = {
  type: Phaser.WEBGL,
  canvas: document.getElementById("game-container"),
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: true,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "game-container",
    width: window.innerWidth * window.devicePixelRatio,
    height: window.innerHeight * window.devicePixelRatio,
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);
