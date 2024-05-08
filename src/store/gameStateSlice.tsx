import { createSlice } from "@reduxjs/toolkit";

export enum GameState {
  WaitingForPlayers = "WAITING_FOR_PLAYERS",
  WaitingToBegin = "WAITING_TO_BEGIN",
  CoinFlip = "COIN_FLIP",
  PlayerRolling = "PLAYER_ROLLING",
  PlayerOfferingDouble = "PLAYER_OFFERING_DOUBLE",
  PlayerMoving = "PLAYER_MOVING",
  GameOver = "GAME_OVER",
  GameOverGammon = "GAME_OVER_GAMMON",
  GameOverBackgammon = "GAME_OVER_BACKGAMMON",
  GameOverForfeit = " GAME_OVER_FORFEIT",
}

export const gameStateSlice = createSlice({
  name: "currentPlayerState",
  initialState: GameState.WaitingToBegin,
  reducers: {
    setState: (_state, action: { type: string; payload: GameState }) => {
      return action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setState } = gameStateSlice.actions;

export default gameStateSlice.reducer;
