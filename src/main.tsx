import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Phaser from "phaser";
import GameNode, { Meta } from "./game/node/Node.ts";
import BootScene from "./game/game-scenes/BootScene.ts";
import MainScene from "./game/game-scenes/MainScene.ts";
import GameContext from "./contexts/GameContext.tsx";
import Arrow from "./game/arrow/Arrow.ts";
import GesturesPlugin from "phaser3-rex-plugins/plugins/gestures-plugin.js";

Phaser.GameObjects.GameObjectFactory.register(
  "node",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    meta: Meta,
    frame?: string | number
  ) {
    const node = new GameNode(this.scene, x, y, meta, frame);

    this.displayList.add(node);
    this.updateList.add(node);

    return node;
  }
);

Phaser.GameObjects.GameObjectFactory.register(
  "arrow",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    from: Phaser.GameObjects.Sprite,
    to: Phaser.GameObjects.Sprite
  ) {
    const arrow = new Arrow(this.scene, from, to);

    this.displayList.add(arrow);
    this.updateList.add(arrow);

    return arrow;
  }
);

const game = new Phaser.Game({
  width: 1270,
  height: 720,
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
  },
  plugins: {
    scene: [
      {
        key: "rexGestures",
        plugin: GesturesPlugin,
        mapping: "rexGestures",
      },
    ],
  },
  backgroundColor: "#f5f5f5",
  scene: [BootScene, MainScene],
  parent: "game",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GameContext.Provider value={game}>
      <App />
    </GameContext.Provider>
  </React.StrictMode>
);
