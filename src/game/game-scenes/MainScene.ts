import { traverse, traverseUp } from "../graph/traverse";
import DynamicNode, { Meta as NodeMeta } from "../node/Node";

export function getNode(scene: Phaser.Scene, id: string) {
  const mainScene = scene.scene.get("MainScene") as MainScene;
  return mainScene.nodes.get(id);
}

export default class MainScene extends Phaser.Scene {
  readonly nodes: Map<string, DynamicNode>;
  private isReady: boolean;

  constructor() {
    super("MainScene");
    this.nodes = new Map<string, DynamicNode>();
    this.isReady = false;
  }

  public get ready() {
    return this.isReady;
  }

  create() {
    this.isReady = true;
  }

  update(time: number, delta: number): void {
    this.nodes.forEach((node) => {
      node.update(time, delta);
    });
  }

  /**
   * Sync node's properties, delete nodes that are not in meta, add nodes that are in meta but not in nodes
   * @param meta
   */
  sync(meta: Map<string, NodeMeta>) {
    const camera = this.cameras.main;
    const spawn = new Phaser.Math.Vector2(camera.centerX, camera.centerY);

    // Delete nodes that are not in meta
    this.nodes.forEach((node, id) => {
      if (!meta.has(id)) {
        node.selfDestruct().catch((reason) => {
          console.error(reason);
        });

        this.nodes.delete(id);
      }
    });

    const updated = Array.from(meta.values());

    if (updated.length === 0) {
      return;
    }

    const discoveryQueue: NodeMeta[] = updated;
    const discovered: NodeMeta[] = [];

    while (discoveryQueue.length > 0) {
      const node = discoveryQueue.shift()!;

      // skip if already discovered
      if (discovered.includes(node)) {
        continue;
      }

      // find root
      const root = Array.from(traverseUp(meta, node)).pop()!;

      // discover all nodes in the tree
      const traverseIt = traverse(meta, root);
      let next = traverseIt.next();

      while (!next.done) {
        const metaNode = next.value;

        if (discovered.includes(metaNode)) {
          console.error(meta);
          throw new Error(
            `Cycle detected at node "${metaNode.id}", named "${metaNode.name}"`
          );
        }

        if (!this.nodes.has(metaNode.id)) {
          const newNode = this.add.node(spawn.x, spawn.y);
          this.nodes.set(metaNode.id, newNode);
        }

        discovered.push(metaNode);
        next = traverseIt.next();
      }
    }

    // update all nodes
    this.nodes.forEach((node, id) => {
      const metaNode = meta.get(id)!;
      node.sync(metaNode);
    });
  }

  destroy() {
    this.nodes.forEach((node) => {
      node.destroy();
    });
    this.nodes.clear();
  }
}
