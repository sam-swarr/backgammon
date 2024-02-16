import { createSlice } from "@reduxjs/toolkit";

export enum GameState {
  GameWaitingToBegin = "GAME_WAITING_TO_BEGIN",
  CoinFlip = "COIN_FLIP",
  PlayerRolling = "PLAYER_ROLLING",
  PlayerOfferingDouble = "PLAYER_OFFERING_DOUBLE",
  PlayerMoving = "PLAYER_MOVING",
  GameOver = "GAME_OVER",
  GameOverGammon = "GAME_OVER_GAMMON",
  GameOverBackgammon = "GAME_OVER_BACKGAMMON",
}

type SetGameStatePayload = {
  newState: GameState;
};

export const gameStateSlice = createSlice({
  name: "currentPlayerState",
  initialState: GameState.GameWaitingToBegin,
  reducers: {
    setState: (
      _state,
      action: { type: string; payload: SetGameStatePayload }
    ) => {
      return action.payload.newState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setState } = gameStateSlice.actions;

export default gameStateSlice.reducer;
