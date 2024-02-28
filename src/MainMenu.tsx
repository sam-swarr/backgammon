import { FunctionComponent } from "react";

import { createLobby } from "./Firebase";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./store/hooks";
import { GameState, setState } from "./store/gameStateSlice";
import { resetStoreForLocalGame } from "./Utils";

type MainMenuProps = {};

const MainMenu: FunctionComponent<MainMenuProps> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const createLocalGame = function () {
    resetStoreForLocalGame(dispatch);
    navigate("/local");
  };

  const createOnlineLobby = async function () {
    const createLobbyResult = await createLobby();
    navigate("/" + createLobbyResult.roomCode);
  };

  return (
    <div className={"Main-menu-wrapper"}>
      <div className={"Title-wrapper"}>Backgammon</div>
      <div className={"Menu-button-wrapper"}>
        <button
          className={"Local-multiplayer-button"}
          onClick={createLocalGame}
        >
          Local Multiplayer
        </button>
        <button
          className={"Online-multiplayer-button"}
          onClick={createOnlineLobby}
        >
          Online Multiplayer
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
