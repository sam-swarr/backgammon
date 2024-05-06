import { FunctionComponent, useState } from "react";

import { createLobby } from "./Firebase";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./store/hooks";
import { resetStoreForLocalGame } from "./Utils";
import { setShowMatchSetupScreen } from "./store/settingsSlice";

type MainMenuProps = {};

const MainMenu: FunctionComponent<MainMenuProps> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isCreatingMultiplayerLobby, setIsCreatingMultiplayerLobby] =
    useState(false);

  const createLocalGame = () => {
    if (isCreatingMultiplayerLobby) {
      return;
    }
    resetStoreForLocalGame(dispatch);
    dispatch(setShowMatchSetupScreen(true));
    navigate("/local");
  };

  const createOnlineLobby = async () => {
    if (isCreatingMultiplayerLobby) {
      return;
    }
    setIsCreatingMultiplayerLobby(true);
    const createLobbyResult = await createLobby();
    dispatch(setShowMatchSetupScreen(true));
    navigate("/" + createLobbyResult.roomCode);
  };

  let onlineButtonOrSpinner = (
    <div className={"Online-multiplayer-button"} onClick={createOnlineLobby} />
  );
  if (isCreatingMultiplayerLobby) {
    onlineButtonOrSpinner = (
      <div className={"Online-multiplayer-button-spinner"} />
    );
  }

  return (
    <div className={"Main-menu-wrapper"}>
      <div className={"Title-wrapper"}>
        <div className={"Title-text"}></div>
      </div>
      <div className={"Menu-button-wrapper"}>
        <div className={"Local-multiplayer-button"} onClick={createLocalGame} />
        {onlineButtonOrSpinner}
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
