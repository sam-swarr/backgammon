import { createSlice } from '@reduxjs/toolkit'

import {STARTING_BOARD_STATE} from '../Constants';
import { GameBoardState, Player, ValidMove } from '../Types';

type ApplyMovesState = {
  moves: ValidMove[],
  currentPlayer: Player,
};

export const gameBoardSlice = createSlice({
  name: 'gameBoardState',
  initialState: STARTING_BOARD_STATE,
  reducers: {
    applyMoves: (state, action: { type: string, payload: ApplyMovesState }) => {
      return action.payload.moves.reduce((prevBoardState, currMove) => {
        return applyMoveToGameBoardState(
          prevBoardState,
          currMove,
          action.payload.currentPlayer,
        );
      }, state);
    },
  },
})

export function deepCloneGameBoardState(
  gameBoardState: GameBoardState,
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
    }
  }
}

export function applyMoveToGameBoardState(
  gameBoardState: GameBoardState,
  move: ValidMove,
  currentPlayer: Player,
): GameBoardState {
  const opponent = currentPlayer === Player.One ? Player.Two : Player.One;
  const result = deepCloneGameBoardState(gameBoardState);
  if (move.move.from === "BAR") {
    result.barState[currentPlayer] -= 1;
  } else {
    result.pointsState[move.move.from][currentPlayer] -= 1;
  }

  if (move.move.to === "HOME") {
    result.homeState[currentPlayer] += 1;
  } else {
    const destPoint = result.pointsState[move.move.to];
    if (destPoint[opponent] > 1) {
      console.error("Trying to apply invalid move. Destination occupied by 2+ opposing checkers");
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

// Action creators are generated for each case reducer function
export const { applyMoves } = gameBoardSlice.actions

export default gameBoardSlice.reducer