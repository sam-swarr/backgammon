import { createSlice } from '@reduxjs/toolkit'

import {Player} from '../Types';

export enum GameState {
  NotStarted = "NOT_STARTED",
  PlayerRolling = "PLAYER_ROLLING",
  PlayerOfferingDouble = "PLAYER_OFFERING_DOUBLE",
};

export const gameStateSlice = createSlice({
  name: 'currentPlayerState',
  initialState: Math.random() > 0.5 ? Player.One : Player.Two,
  reducers: {
    endTurn: (state) => {
      return state === Player.One ? Player.Two : Player.One;
    },
  },
})

// Action creators are generated for each case reducer function
export const { endTurn } = gameStateSlice.actions

export default gameStateSlice.reducer