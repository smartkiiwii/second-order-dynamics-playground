import "./App.css";
import DataProvider from "./components/data-provider/DataProvider";
import GameHandler from "./components/game-handler/GameHandler";
import UI from "./components/ui/UI";

function App() {
  return (
    <DataProvider>
      <UI />
      <GameHandler />
    </DataProvider>
  );
}

export default App;
