import { createSlice } from '@reduxjs/toolkit'

export enum GameState {
  NotStarted = "NOT_STARTED",
  PlayerRolling = "PLAYER_ROLLING",
  PlayerOfferingDouble = "PLAYER_OFFERING_DOUBLE",
  PlayerMoving = "PLAYER_MOVING",
  GameOver = "GAME_OVER",
};

type SetGameStatePayload = {
  newState: GameState,
};

export const gameStateSlice = createSlice({
  name: 'currentPlayerState',
  initialState: GameState.NotStarted,
  reducers: {
    setState: (_state, action: { type: string, payload: SetGameStatePayload }) => {
      return action.payload.newState;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setState } = gameStateSlice.actions

export default gameStateSlice.reducer