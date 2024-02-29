import { createSlice } from "@reduxjs/toolkit";

import { STARTING_BOARD_STATE } from "../Constants";
import { GameBoardState, GameResult, Move, Player } from "../Types";

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
  move: Move,
  currentPlayer: Player
): GameBoardState {
  const opponent = currentPlayer === Player.One ? Player.Two : Player.One;
  const result = deepCloneGameBoardState(gameBoardState);
  if (move.from === "BAR") {
    result.barState[currentPlayer] -= 1;
  } else if (move.from === "HOME") {
    result.homeState[currentPlayer] -= 1;
  } else {
    result.pointsState[move.from][currentPlayer] -= 1;
  }

  if (move.to === "HOME") {
    result.homeState[currentPlayer] += 1;
  } else if (move.to === "BAR") {
    result.barState[currentPlayer] += 1;
  } else {
    const destPoint = result.pointsState[move.to];
    if (destPoint[opponent] > 1) {
      console.error(
        "Trying to apply invalid move. Destination occupied by 2+ opposing checkers"
      );
      console.error(gameBoardState);
      console.error(move);
    }
    if (destPoint[opponent] === 1) {
      result.barState[opponent] += 1;
      destPoint[opponent] -= 1;
    }
    destPoint[currentPlayer] += 1;
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
