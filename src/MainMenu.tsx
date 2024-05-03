import { FunctionComponent } from "react";

import { createLobby } from "./Firebase";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./store/hooks";
import { resetStoreForLocalGame } from "./Utils";
import { setShowMatchSetupScreen } from "./store/settingsSlice";

type MainMenuProps = {};

const MainMenu: FunctionComponent<MainMenuProps> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const createLocalGame = function () {
    resetStoreForLocalGame(dispatch);
    dispatch(setShowMatchSetupScreen(true));
    navigate("/local");
  };

  const createOnlineLobby = async function () {
    const createLobbyResult = await createLobby();
    navigate("/" + createLobbyResult.roomCode);
  };

  return (
    <div className={"Main-menu-wrapper"}>
      <div className={"Title-wrapper"}>
        <div className={"Title-text"}></div>
      </div>
      <div className={"Menu-button-wrapper"}>
        <div className={"Local-multiplayer-button"} onClick={createLocalGame} />
        <div
          className={"Online-multiplayer-button"}
          onClick={createOnlineLobby}
        />
      </div>
      <div className={"Credits-text"}>
        <div>Backgammon v 1.0.0.7bc0921</div>
        <div>by Sam Swarr (sam-swarr.github.io)</div>
        <div>font Barlow by Jeremy Tribby</div>
      </div>
    </div>
  );
};

export default MainMenu;
