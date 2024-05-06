import { FunctionComponent, useEffect, useRef, useState } from "react";

import { useLoaderData } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  FirestoreGameData,
  findLobby,
  getCurrentUser,
  hasJoinedLobby,
  joinLobbyAsPlayerTwo,
  signIn,
} from "./Firebase";
import { onSnapshot } from "firebase/firestore";
import { setState } from "./store/gameStateSlice";
import { setPlayersState } from "./store/playersSlice";
import {
  Actions,
  ActionsContext,
  NetworkedGameActions,
} from "./ActionsContext";
import { setDiceState } from "./store/diceSlice";
import { setCurrentPlayer } from "./store/currentPlayerSlice";
import {
  enqueueNetworkedMoves,
  invalidateNetworkedMoves,
} from "./store/animatableMovesSlice";
import { getClientPlayer } from "./Utils";
import GameRoom from "./GameRoom";
import { setDoublingCubeData } from "./store/doublingCubeSlice";
import { setMatchScore } from "./store/matchScoreSlice";
import { setGameBoardState } from "./store/gameBoardSlice";
import { Player } from "./Types";
import {
  default as MatchSettingsMenu,
  MatchPointValue,
} from "./MatchSettingsMenu";
import SettingsMenuButton from "./SettingsMenuButton";

type LoaderData = {
  roomCode: string;
};

export function loader({ params }: any): LoaderData {
  return { roomCode: params.roomCode };
}

const NetworkedGameRoom: FunctionComponent = () => {
  const { roomCode } = useLoaderData() as LoaderData;
  const [settings] = useAppSelector((state) => [state.settings]);
  const dispatch = useAppDispatch();

  const [matchPointsValue, setMatchPointsValue] = useState<MatchPointValue>(5);
  const [enableDoubling, setEnableDoubling] = useState(true);

  // We wrap the _gameActions state inside a Ref and use the Ref instead.
  // That's because if we just used a normal state variable, the onSnapshot()
  // callback below would just capture the value of gameActions on the very
  // first render (which would always be null).
  const [_gameActions, _setGameActions] = useState<Actions | null>(null);
  const gameActionsRef = useRef(_gameActions);
  function setGameActions(gameActions: Actions) {
    gameActionsRef.current = gameActions;
    _setGameActions(gameActions);
  }

  useEffect(() => {
    async function connectToLobby() {
      await signIn();
      const docRef = await findLobby(roomCode);
      if (docRef == null) {
        console.error("No lobby found with code: " + roomCode);
        // TODO: show error screen
      } else {
        onSnapshot(docRef, (doc) => {
          // Dispatch all relevant updates to the redux store
          let data = doc.data() as FirestoreGameData;
          dispatch(setState(data.gameState));
          dispatch(setPlayersState(data.players));
          dispatch(setCurrentPlayer(data.currentPlayer));
          dispatch(setDiceState(data.dice));
          dispatch(setDoublingCubeData(data.doublingCube));
          dispatch(setMatchScore(data.matchScore));
          if (
            data.networkedMoves != null &&
            getClientPlayer(data.players) === data.networkedMoves.animateFor
          ) {
            if (gameActionsRef.current == null) {
              // In this case, we've just reconnected to the DB mid-game. We'll be syncing the
              // up-to-date boardState at the end of this function, so we should ignore any
              // networked moves in the DB since we don't want to animate those on top of the
              // already-up-to-date board.
              dispatch(invalidateNetworkedMoves(data.networkedMoves));
            } else {
              dispatch(enqueueNetworkedMoves(data.networkedMoves));
            }
          }

          // Handle case where 2nd player is just joining for the first time
          let isHost = true;
          if (!hasJoinedLobby(data.players)) {
            if (data.players.playerTwo != null) {
              console.error(
                "Trying to join lobby as user: " +
                  getCurrentUser().uid +
                  " but room is full."
              );
              // TODO: show error screen
            } else {
              joinLobbyAsPlayerTwo(docRef);
            }
            isHost = false;
          }

          // This is the first DB read for this session, so update the gameBoardState directly
          // (since this could be a client reconnecting mid-game). From here on, the client
          // will manually track its own gameBoardState locally by applying the networkedMoves
          // that come over the wire.
          if (gameActionsRef.current == null) {
            dispatch(setGameBoardState(data.gameBoard));
            setGameActions(new NetworkedGameActions(isHost, dispatch, docRef));
          }
        });
      }
    }
    connectToLobby();
  }, [dispatch, roomCode]);

  if (gameActionsRef.current == null) {
    // Even if we don't have a NetworkedGameActions instance set up yet, we can still
    // display the match setup screen to the host while the DB loads. The Start Game
    // button will not do anything until the DB load finishes, but the latency here should
    // be very low and not noticeable.
    if (settings.showMatchSetupScreen) {
      return (
        <MatchSettingsMenu
          matchPointsValue={matchPointsValue}
          enableDoubling={enableDoubling}
          onMatchPointsChanged={(newValue) => setMatchPointsValue(newValue)}
          onEnableDoublingChanged={(enabled) => setEnableDoubling(enabled)}
          roomCode={roomCode}
        />
      );
    }
    // TODO: add spinner
    return null;
  } else {
    let contents = null;
    if (settings.showMatchSetupScreen) {
      contents = (
        <MatchSettingsMenu
          matchPointsValue={matchPointsValue}
          enableDoubling={enableDoubling}
          onMatchPointsChanged={(newValue) => setMatchPointsValue(newValue)}
          onEnableDoublingChanged={(enabled) => setEnableDoubling(enabled)}
          roomCode={roomCode}
        />
      );
    } else {
      contents = (
        <div>
          <SettingsMenuButton />
          <GameRoom
            playerPerspective={
              gameActionsRef.current.isHostClient() ? Player.One : Player.Two
            }
          />
        </div>
      );
    }
    return (
      <ActionsContext.Provider value={gameActionsRef.current}>
        {contents}
      </ActionsContext.Provider>
    );
  }
};

export default NetworkedGameRoom;
