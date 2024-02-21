import { FunctionComponent } from "react";
import cx from "classnames";
import "./App.css";

import GameBoard from "./GameBoard";
import MainMenu from "./MainMenu";
import SettingsMenuButton from "./SettingsMenuButton";
import SettingsMenu from "./SettingsMenu";
import GameOverDialog from "./GameOverDialog";
import InformationText from "./InformationText";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import NetworkedGameRoom, {
  loader as NetworkedGameRoomLoader,
} from "./NetworkedGameRoom";

type AppProps = {};

const App: FunctionComponent<AppProps> = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainMenu />,
    },
    {
      path: "/local",
      element: (
        <div className={"Game-area-wrapper"}>
          <GameBoard />
          <InformationText />
        </div>
      ),
    },
    {
      path: "/:roomCode",
      element: <NetworkedGameRoom />,
      loader: NetworkedGameRoomLoader,
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
