import { Actions, LocalGameActions } from "./ActionsContext";
import { getCurrentUser } from "./Firebase";
import { Player } from "./Types";
import { GameState, setState } from "./store/gameStateSlice";
import { PlayersData, PlayersDataPayload } from "./store/playersSlice";
import {
  setShowGameOverDialog,
  setShowSettingsMenu,
} from "./store/settingsSlice";
import { reset as resetAnimatableMoves } from "./store/animatableMovesSlice";
import { reset as resetGameBoard } from "./store/gameBoardSlice";
import { reset as resetPlayerState } from "./store/playersSlice";
import { clearProvisionalMoves } from "./store/provisionalMovesSlice";
import { clearLastPointClicked } from "./store/lastPointClickedSlice";
import { performInitialRolls } from "./store/dice";
import { setDiceState } from "./store/diceSlice";
import { setCurrentPlayer } from "./store/currentPlayerSlice";
import { resetDoublingCubeData } from "./store/doublingCubeSlice";
import { resetMatchScore } from "./store/matchScoreSlice";

/**
 * Certain actions or pieces of UI should only be performed or shown to
 * the current player's client. This is a convenience function for determining
 * that. For a local game, there's only one client which is always considered
 * the "current player".
 *
 * @param players the `players` slice of the store
 * @param currentPlayer the Player value for the currently acting player
 * @param actions the Actions instance returned by useContext(ActionsContext)
 * @returns true if the current client is the currently active player
 */
export function isCurrentPlayer(
  players: PlayersData,
  currentPlayer: Player,
  actions: Actions
): boolean {
  if (actions instanceof LocalGameActions) {
    return true;
  }

  if (players.playerOne == null || players.playerTwo == null) {
    throw new Error("Player data unexpectedly null.");
  }

  let uid = getCurrentUser().uid;
  return (
    (players.playerOne.uid === uid && currentPlayer === Player.One) ||
    (players.playerTwo.uid === uid && currentPlayer === Player.Two)
  );
}

/**
 * @param players the `players` slice of the store
 * @returns the Player value corresponding to the current client
 */
export function getClientPlayer(players: PlayersDataPayload): Player {
  if (players.playerOne == null || players.playerTwo == null) {
    throw new Error("Player data unexpectedly null.");
  }

  let uid = getCurrentUser().uid;
  if (players.playerOne.uid === uid) {
    return Player.One;
  } else if (players.playerTwo.uid === uid) {
    return Player.Two;
  }
  throw new Error("Unable to find player uid in player data.");
}

let currID = 1;
export function genAnimationID(): number {
  return currID++ % Number.MAX_SAFE_INTEGER;
}

export function resetLocalStore(
  dispatchFn: Function,
  shouldResetMatchScore: boolean
): void {
  const newRolls = performInitialRolls();
  const newDiceState = {
    initialRolls: newRolls,
    currentRoll: newRolls[Object.keys(newRolls).length - 1],
  };
  dispatchFn(setShowGameOverDialog(false));
  dispatchFn(setShowSettingsMenu(false));
  dispatchFn(setState(GameState.WaitingToBegin));
  dispatchFn(setDiceState(newDiceState));
  dispatchFn(resetGameBoard());
  dispatchFn(
    setCurrentPlayer(
      newDiceState.currentRoll[0] > newDiceState.currentRoll[1]
        ? Player.One
        : Player.Two
    )
  );
  dispatchFn(resetPlayerState());
  dispatchFn(clearProvisionalMoves());
  dispatchFn(clearLastPointClicked());
  dispatchFn(resetAnimatableMoves());
  dispatchFn(resetDoublingCubeData());
  if (shouldResetMatchScore) {
    dispatchFn(resetMatchScore());
  }
}
