import { FunctionComponent } from "react";
import cx from "classnames";
import "./App.css";

import { useAppSelector } from "./store/hooks";
import { Color } from "./Types";
import GameBoard from "./GameBoard";
import MainMenu from "./MainMenu";
import SettingsMenuButton from "./SettingsMenuButton";
import SettingsMenu from "./SettingsMenu";
import GameOverDialog from "./GameOverDialog";
import InformationText from "./InformationText";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

type AppProps = {};

const App: FunctionComponent<AppProps> = () => {
  const [currentPlayer, settings] = useAppSelector((state) => [
    state.currentPlayer,
    state.settings,
  ]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainMenu />,
    },
    {
      path: "/local",
      element: (
        <div className={"Game-area-wrapper"}>
          <GameBoard
            currentPlayer={currentPlayer}
            playerOneColor={settings.playerOneColor}
            playerTwoColor={
              settings.playerOneColor === Color.White
                ? Color.Black
                : Color.White
            }
            playerMovementDirection={settings.movementDirection}
          />
          <InformationText />
        </div>
      ),
    },
  ]);

  return (
    <div className={cx("App-wrapper")}>
      <SettingsMenuButton />
      <SettingsMenu />
      <GameOverDialog />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
