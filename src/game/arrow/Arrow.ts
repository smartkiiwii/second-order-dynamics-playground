export default class Arrow extends Phaser.GameObjects.GameObject {
  private arrow: Phaser.GameObjects.Sprite;
  private from: Phaser.GameObjects.Sprite;
  private to: Phaser.GameObjects.Sprite;
  private graphics: Phaser.GameObjects.Graphics;

  constructor(
    scene: Phaser.Scene,
    from: Phaser.GameObjects.Sprite,
    to: Phaser.GameObjects.Sprite
  ) {
    super(scene, "arrow");

    this.arrow = scene.add.sprite(0, 0, "arrow");
    this.from = from;
    this.to = to;
    this.graphics = scene.add.graphics();
  }

  sync(from: Phaser.GameObjects.Sprite, to: Phaser.GameObjects.Sprite): void {
    this.from = from;
    this.to = to;
  }

  update(): void {
    super.update();
    const vec = new Phaser.Math.Vector2(this.from.x, this.from.y);

    const from = vec
      .clone()
      .lerp(new Phaser.Math.Vector2(this.to.x, this.to.y), 0.3);
    const to = vec
      .clone()
      .lerp(new Phaser.Math.Vector2(this.to.x, this.to.y), 0.7);
    const arrow = this.arrow;

    const dx = from.x - to.x;
    const dy = from.y - to.y;
    const angle = Math.atan2(dy, dx);

    arrow.x = to.x;
    arrow.y = to.y;
    arrow.rotation = angle;

    this.graphics.clear();
    this.graphics.lineStyle(2, 0x000000);
    this.graphics.beginPath();
    this.graphics.moveTo(from.x, from.y);
    this.graphics.lineTo(to.x, to.y);
    this.graphics.closePath();
    this.graphics.strokePath();
  }

  destroy(fromScene?: boolean | undefined): void {
    this.arrow.destroy();
    this.graphics.destroy();
    super.destroy(fromScene);
  }
}
