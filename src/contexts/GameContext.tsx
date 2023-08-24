import { createContext } from "react";

const GameContext = createContext<Phaser.Game | null>(null);

export default GameContext;
