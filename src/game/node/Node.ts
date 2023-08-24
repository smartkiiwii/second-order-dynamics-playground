import SecondOrderDynamics, {
  Config as DynamicsConfig,
} from "../../helpers/SecondOrderDynamics";
import { getNode } from "../game-scenes/MainScene";
import Vector2 = Phaser.Math.Vector2;
import Arrow from "../arrow/Arrow";

export type ParentLink = {
  id: string;
  offset: {
    x: number;
    y: number;
  };
};

export type Meta = {
  id: string;
  name: string;
  properties: DynamicsConfig & {
    parent: ParentLink | null;
    children: string[];
  };
};

export default class Node extends Phaser.GameObjects.Sprite {
  private parent: { node: Node; link: ParentLink } | null;
  private children: Node[];
  private dynamics: SecondOrderDynamics;
  private arrow: Arrow | null;
  private follower: Phaser.GameObjects.Sprite;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    meta?: Meta,
    frame?: string | number
  ) {
    super(scene, x, y, "handle", frame);
    this.alpha = 1;

    this.follower = scene.add.sprite(0, 0, "node");

    this.parent = null;
    this.children = [];
    this.arrow = null;

    if (meta) {
      this.children = meta.properties.children.map((id) => {
        const childNode = getNode(scene, id);

        if (!childNode) {
          throw new Error(`Child node ${id} not found`);
        }

        return childNode;
      });

      if (meta.properties.parent) {
        const parentNode = getNode(scene, meta.properties.parent.id);

        if (!parentNode) {
          throw new Error(`Parent node ${meta.properties.parent.id} not found`);
        }

        this.x = parentNode.x + meta.properties.parent.offset.x;
        this.y = parentNode.y + meta.properties.parent.offset.y;
        this.parent = {
          node: parentNode,
          link: meta.properties.parent,
        };

        this.arrow = new Arrow(scene, this.follower, parentNode.follower);
      }
    }

    this.dynamics = new SecondOrderDynamics(
      new Vector2(this.x, this.y)
      // meta.properties
    );

    this.setInteractive({ useHandCursor: true });
    this.scene.input.setDraggable(this);

    this.on("drag", (pointer: Phaser.Input.Pointer) => {
      this.updatePosition(new Vector2(pointer.x, pointer.y));
    });

    this.on("pointerover", () => {
      if (!this.parent) {
        this.enterButtonHoverState();
      }
    });

    this.on("pointerout", () => {
      if (!this.parent) {
        this.enterButtonRestState();
      }
    });

    this.on("pointerdown", () => {
      if (!this.parent) {
        this.enterButtonActiveState();
      }
    });

    this.on("pointerup", () => {
      if (!this.parent) {
        this.enterButtonHoverState();
      }
    });

    this.scene.tweens.add({
      targets: this.follower,
      scale: { from: 0, to: 1 },
      duration: 200,
      ease: Phaser.Math.Easing.Back.Out,
    });
  }

  public sync(meta: Meta): void {
    const parentLink = meta.properties.parent;

    if (parentLink) {
      const parentNode = getNode(this.scene, parentLink.id);

      if (!parentNode) {
        throw new Error(`Parent node ${parentLink.id} not found`);
      }

      this.parent = {
        node: parentNode,
        link: parentLink,
      };

      this.alpha = 0;
      if (!this.arrow) {
        this.arrow = new Arrow(this.scene, this.follower, parentNode.follower);
      }
      this.arrow.sync(this.follower, parentNode.follower);
    } else {
      this.alpha = 1;
      this.parent = null;

      this.arrow?.destroy();
      this.arrow = null;
    }

    this.children = meta.properties.children.map((id) => {
      const childNode = getNode(this.scene, id);

      if (!childNode) {
        throw new Error(`Child node ${id} not found`);
      }

      return childNode;
    });

    if (this.parent) {
      this.x = this.parent.node.x + this.parent.link.offset.x;
      this.y = this.parent.node.y + this.parent.link.offset.y;
    }

    this.dynamics.setDynamics(meta.properties);
  }

  public selfDestruct(): Promise<void> {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: [this, this.follower],
        scale: { from: 1, to: 0 },
        duration: 200,
        ease: Phaser.Math.Easing.Back.In,
        onComplete: () => {
          this.destroy();
          resolve();
        },
      });
    });
  }

  public updatePosition(target: Vector2) {
    if (this.parent) {
      this.x = this.parent.node.follower.x + this.parent.link.offset.x;
      this.y = this.parent.node.follower.y + this.parent.link.offset.y;
    } else {
      this.x = target.x;
      this.y = target.y;
    }
  }

  public update(time: number, delta: number): void {
    super.update();

    if (this.arrow) {
      this.arrow.update();
    }

    const pos = this.dynamics.update(delta, new Vector2(this.x, this.y));
    this.follower.x = pos.x;
    this.follower.y = pos.y;

    this.children.forEach((child) => {
      child.updatePosition(new Vector2(this.follower.x, this.follower.y));
    });
  }

  private enterButtonHoverState() {
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.2,
      scaleY: 1.2,
      alpha: 1,
      duration: 100,
      ease: "Linear",
    });
  }

  private enterButtonRestState() {
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      alpha: 1,
      duration: 100,
      ease: "Linear",
    });
  }

  private enterButtonActiveState() {
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.4,
      scaleY: 1.4,
      alpha: 0.5,
      duration: 100,
      ease: "Linear",
    });
  }

  destroy(fromScene?: boolean | undefined): void {
    this.arrow?.destroy();
    this.follower.destroy();
    super.destroy(fromScene);
  }
}
