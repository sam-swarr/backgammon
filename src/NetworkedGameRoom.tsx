import { FunctionComponent, useEffect, useState } from "react";

import { useLoaderData } from "react-router-dom";
import InformationText from "./InformationText";
import { useAppDispatch } from "./store/hooks";
import GameBoard from "./GameBoard";
import {
  FirestoreGameData,
  findLobby,
  getCurrentUser,
  hasJoinedLobby,
  joinLobbyAsPlayerTwo,
  signIn,
  writeNewGameStateToDB,
} from "./Firebase";
import { onSnapshot } from "firebase/firestore";
import { GameState, setState } from "./store/gameStateSlice";
import { setPlayersState } from "./store/playersSlice";
import {
  Actions,
  ActionsContext,
  LocalGameActions,
  NetworkedGameActions,
} from "./ActionsContext";

type LoaderData = {
  roomCode: string;
};

export function loader({ params }: any): LoaderData {
  return { roomCode: params.roomCode };
}

const NetworkedGameRoom: FunctionComponent = () => {
  const { roomCode } = useLoaderData() as LoaderData;
  const dispatch = useAppDispatch();
  const [gameActions, setGameActions] = useState<Actions | null>(null);

  useEffect(() => {
    const connectToLobby = async () => {
      await signIn();
      const docRef = await findLobby(roomCode);
      if (docRef == null) {
        console.error("No lobby found with code: " + roomCode);
        // TODO: show error screen
      } else {
        setGameActions(new NetworkedGameActions(docRef));
        onSnapshot(docRef, (doc) => {
          let data = doc.data() as FirestoreGameData;
          dispatch(setState(data.gameState));
          dispatch(setPlayersState(data.players));

          if (!hasJoinedLobby(data.players)) {
            if (data.players.playerTwo != null) {
              console.error(
                "Trying to join lobby as user: " +
                  getCurrentUser().uid +
                  " but room is full."
              );
              // TODO: show error screen
            } else {
              joinLobbyAsPlayerTwo(docRef).then(() => {
                writeNewGameStateToDB(docRef, GameState.WaitingToBegin);
              });
            }
          }
        });
      }
    };
    connectToLobby();
  }, [roomCode]);

  if (gameActions == null) {
    return null;
  } else {
    return (
      <ActionsContext.Provider value={gameActions}>
        <div className={"Game-area-wrapper"}>
          <GameBoard />
          <InformationText />
        </div>
      </ActionsContext.Provider>
    );
  }
};

export default NetworkedGameRoom;
