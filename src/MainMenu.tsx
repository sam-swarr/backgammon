import { FunctionComponent } from "react";

import { GameState, setState } from "./store/gameStateSlice";
import { useAppDispatch } from "./store/hooks";
import { createLobby } from "./Firebase";

type MainMenuProps = {};

const MainMenu: FunctionComponent<MainMenuProps> = () => {
  const dispatch = useAppDispatch();

  const createOnlineLobby = async function () {
    console.log("CREATING ONLINE LOBBY");
    await createLobby();
  };

  return (
    <div className={"Main-menu-wrapper"}>
      <div className={"Title-wrapper"}>Backgammon</div>
      <div className={"Menu-button-wrapper"}>
        <button
          className={"Local-multiplayer-button"}
          onClick={() => {
            dispatch(setState({ newState: GameState.GameWaitingToBegin }));
          }}
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
