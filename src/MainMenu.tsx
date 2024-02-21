import { FunctionComponent } from "react";

import { FirestoreGameData, createLobby } from "./Firebase";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./store/hooks";
import { onSnapshot } from "firebase/firestore";
import { setPlayersState } from "./store/playersSlice";
import { setState } from "./store/gameStateSlice";

type MainMenuProps = {};

const MainMenu: FunctionComponent<MainMenuProps> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const createLocalGame = function () {
    navigate("/local");
  };

  const createOnlineLobby = async function () {
    const createLobbyResult = await createLobby();

    // TODO: where is best place to unsub?
    const unsub = onSnapshot(createLobbyResult.docRef, (doc) => {
      let data = doc.data() as FirestoreGameData;
      dispatch(setState(data.gameState));
      dispatch(setPlayersState(data.players));
    });

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
