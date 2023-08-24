import { useCallback, useContext, useEffect, useState } from "react";
import { DataContext, DataDispatchContext } from "../../contexts/DataContext";
import GameContext from "../../contexts/GameContext";
import MainScene from "../../game/game-scenes/MainScene";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function GameHandler() {
  const data = useContext(DataContext);
  const dataDispatch = useContext(DataDispatchContext);
  const game = useContext(GameContext);
  const [isSynced, setIsSynced] = useState(false);

  const sync = useCallback(() => {
    if (!data || !dataDispatch || !game) {
      setIsSynced(false);
      return;
    }

    const mainScene = game.scene.getScene("MainScene") as MainScene;

    if (!mainScene?.ready) {
      // ignore when game is still being initialized or destroyed
      setIsSynced(false);
      return;
    }

    mainScene.sync(data);
    setIsSynced(true);
  }, [data, dataDispatch, game]);

  useEffect(() => {
    sync();
  }, [sync]);

  return isSynced ? (
    <></>
  ) : (
    <div className="absolute w-full h-full flex flex-col justify-center items-center gap-2 bg-black/10">
      <Icon icon="material-symbols:sync-rounded" width="72px" />
      <div className="flex flex-col gap-2">
        <span className="text-2xl">View is out of sync</span>
        <button
          className="bg-gray-500 text-white"
          onClick={() => {
            sync();
          }}
        >
          Sync now
        </button>
      </div>
    </div>
  );
}
