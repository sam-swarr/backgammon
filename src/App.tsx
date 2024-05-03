import { FunctionComponent } from "react";
import cx from "classnames";
import "./App.scss";

import MainMenu from "./MainMenu";
import SettingsMenuButton from "./SettingsMenuButton";
import GameOverDialog from "./GameOverDialog";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import NetworkedGameRoom, {
  loader as NetworkedGameRoomLoader,
} from "./NetworkedGameRoom";
import LocalGameRoom from "./LocalGameRoom";

type AppProps = {};

const App: FunctionComponent<AppProps> = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainMenu />,
    },
    {
      path: "/local",
      element: <LocalGameRoom />,
    },
    {
      path: "/:roomCode",
      element: (
        <div>
          <SettingsMenuButton />
          <NetworkedGameRoom />
        </div>
      ),
      loader: NetworkedGameRoomLoader,
    },
  ]);

  const initialFloatingCircles = new Array(50);
  for (let i = 0; i < 50; i++) {
    initialFloatingCircles.push(
      <div key={i} className={"Initial-floating-circle"} />
    );
  }

  const floatingCircles = new Array(50);
  for (let i = 0; i < 50; i++) {
    floatingCircles.push(<div key={i} className={"Floating-circle"} />);
  }

  return (
    <div className={cx("App-wrapper")}>
      <div>{initialFloatingCircles}</div>
      <div>{floatingCircles}</div>
      <GameOverDialog />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
