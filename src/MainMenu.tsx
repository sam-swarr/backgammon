import { FunctionComponent } from "react";

import { createLobby } from "./Firebase";
import { useNavigate } from "react-router-dom";

type MainMenuProps = {};

const MainMenu: FunctionComponent<MainMenuProps> = () => {
  const navigate = useNavigate();

  const createLocalGame = function () {
    navigate("/local");
  };

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
