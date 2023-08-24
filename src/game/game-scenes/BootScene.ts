import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.svg("node", "assets/images/node.svg", { scale: 2 });
    this.load.svg("handle", "assets/images/handle.svg", { scale: 0.28 });
    this.load.svg("arrow", "assets/images/arrow.svg", { scale: 1 });

    this.load.on("complete", () => {
      this.scene.start("MainScene");
    });
  }
}
