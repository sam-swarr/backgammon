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
  NetworkedGameActions,
} from "./ActionsContext";
import { setDiceState } from "./store/diceSlice";
import { setCurrentPlayer } from "./store/currentPlayerSlice";
import { enqueueNetworkedMoves } from "./store/animatableMovesSlice";
import { getClientPlayer } from "./Utils";

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
        setGameActions(new NetworkedGameActions(dispatch, docRef));
        onSnapshot(docRef, (doc) => {
          // Dispatch all relevant updates to the redux store
          let data = doc.data() as FirestoreGameData;
          dispatch(setState(data.gameState));
          dispatch(setPlayersState(data.players));
          dispatch(setCurrentPlayer(data.currentPlayer));
          dispatch(setDiceState(data.dice));
          if (
            data.networkedMoves != null &&
            getClientPlayer(data.players) === data.networkedMoves.animateFor
          ) {
            dispatch(enqueueNetworkedMoves(data.networkedMoves));
          }

          // Handle case where 2nd player is just joining for the first time
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
  }, [roomCode, dispatch]);

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
