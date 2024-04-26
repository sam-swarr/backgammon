import { FunctionComponent } from "react";
import cx from "classnames";
import "./App.css";

import MainMenu from "./MainMenu";
import SettingsMenuButton from "./SettingsMenuButton";
import GameOverDialog from "./GameOverDialog";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import NetworkedGameRoom, {
  loader as NetworkedGameRoomLoader,
} from "./NetworkedGameRoom";
import { ActionsContext, LocalGameActions } from "./ActionsContext";
import { useAppDispatch } from "./store/hooks";
import GameRoom from "./GameRoom";
import { Player } from "./Types";

type AppProps = {};

const App: FunctionComponent<AppProps> = () => {
  const dispatch = useAppDispatch();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainMenu />,
    },
    {
      path: "/local",
      element: (
        <ActionsContext.Provider value={new LocalGameActions(dispatch)}>
          <GameRoom playerPerspective={Player.One} />
        </ActionsContext.Provider>
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
      <GameOverDialog />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
