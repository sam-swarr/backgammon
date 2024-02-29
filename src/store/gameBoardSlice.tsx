import { createSlice } from "@reduxjs/toolkit";

import { STARTING_BOARD_STATE } from "../Constants";
import { GameBoardState, GameResult, HitStatus, Move, Player } from "../Types";

export const gameBoardSlice = createSlice({
  name: "gameBoardState",
  initialState: STARTING_BOARD_STATE,
  reducers: {
    setGameBoardState: (
      _,
      action: { type: string; payload: GameBoardState }
    ) => {
      return action.payload;
    },
    reset: () => STARTING_BOARD_STATE,
  },
});

export function deepCloneGameBoardState(
  gameBoardState: GameBoardState
): GameBoardState {
  const pointsState = [];
  for (let i = 0; i <= 23; i++) {
    const newPointState = {
      ...gameBoardState.pointsState[i],
    };
    pointsState.push(newPointState);
  }

  return {
    pointsState: pointsState,
    barState: {
      ...gameBoardState.barState,
    },
    homeState: {
      ...gameBoardState.homeState,
    },
  };
}

export function applyMoveToGameBoardState(
  gameBoardState: GameBoardState,
  move: Move
): GameBoardState {
  let movingPlayer = move.checkerOwner;
  let nonMovingPlayer =
    move.checkerOwner === Player.One ? Player.Two : Player.One;

  const result = deepCloneGameBoardState(gameBoardState);

  if (move.from === "BAR") {
    result.barState[movingPlayer] -= 1;
  } else if (move.from === "HOME") {
    result.homeState[movingPlayer] -= 1;
  } else {
    const fromPoint = result.pointsState[move.from];
    fromPoint[movingPlayer] -= 1;
    if (move.hitStatus === HitStatus.UndoesHit) {
      if (fromPoint[movingPlayer] !== 0 || fromPoint[nonMovingPlayer] !== 0) {
        console.error(
          "Trying to undo a hit but from point is unexpectedly occupied."
        );
        console.error(gameBoardState);
        console.error(move);
      }
      if (result.barState[nonMovingPlayer] <= 0) {
        console.error(
          "Trying to undo a hit but non-moving player has no checkers on the bar."
        );
        console.error(gameBoardState);
        console.error(move);
      }
      result.barState[nonMovingPlayer] -= 1;
      fromPoint[nonMovingPlayer] += 1;
    }
  }

  if (move.to === "HOME") {
    result.homeState[movingPlayer] += 1;
  } else if (move.to === "BAR") {
    result.barState[movingPlayer] += 1;
  } else {
    const toPoint = result.pointsState[move.to];
    if (toPoint[nonMovingPlayer] > 1) {
      console.error(
        "Trying to apply invalid move. Destination occupied by 2+ opposing checkers"
      );
      console.error(gameBoardState);
      console.error(move);
    }
    if (move.hitStatus === HitStatus.IsHit) {
      if (toPoint[nonMovingPlayer] !== 1) {
        console.error(
          "Trying to apply a hit but destination does not have a single opposing checker."
        );
        console.error(gameBoardState);
        console.error(move);
      }
      result.barState[nonMovingPlayer] += 1;
      toPoint[nonMovingPlayer] -= 1;
    } else {
      if (toPoint[nonMovingPlayer] > 0) {
        console.error(
          "Trying to apply a non-hit move but destination contains opposing checkers."
        );
        console.error(gameBoardState);
        console.error(move);
      }
    }
    toPoint[movingPlayer] += 1;
  }

  return result;
}

export function didPlayerWin(
  gameBoardState: GameBoardState,
  currentPlayer: Player
): GameResult {
  // Check for any checkers on bar or points.
  if (
    gameBoardState.barState[currentPlayer] > 0 ||
    gameBoardState.pointsState.some((point) => point[currentPlayer] > 0)
  ) {
    return GameResult.NotOver;
  }

  const otherPlayer = currentPlayer === Player.One ? Player.Two : Player.One;
  // Just a normal win if the other player has borne off at least one checker.
  if (gameBoardState.homeState[otherPlayer] > 0) {
    return GameResult.PlayerWon;
  }

  let otherPlayerHasCheckerInWinnersHomeBoard = false;
  if (otherPlayer === Player.One) {
    for (let i = 18; i < 23; i++) {
      if (gameBoardState.pointsState[i][otherPlayer] > 0) {
        otherPlayerHasCheckerInWinnersHomeBoard = true;
        break;
      }
    }
  } else {
    for (let i = 0; i < 5; i++) {
      if (gameBoardState.pointsState[i][otherPlayer] > 0) {
        otherPlayerHasCheckerInWinnersHomeBoard = true;
        break;
      }
    }
  }

  if (
    gameBoardState.barState[otherPlayer] > 0 ||
    otherPlayerHasCheckerInWinnersHomeBoard
  ) {
    return GameResult.PlayerWonBackgammon;
  }

  return GameResult.PlayerWonGammon;
}

// Action creators are generated for each case reducer function
export const { setGameBoardState, reset } = gameBoardSlice.actions;

export default gameBoardSlice.reducer;
