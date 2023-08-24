declare namespace Phaser.GameObjects {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface GameObjectFactory {
    node(
      x: number,
      y: number,
      meta?: import("../game/node/Node").Meta,
      frame?: string | number
    ): import("../game/node/Node").default;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    arrow(
      from: Phaser.GameObjects.Sprite,
      to: Phaser.GameObjects.Sprite
    ): import("../game/arrow/Arrow").default;
  }
}
