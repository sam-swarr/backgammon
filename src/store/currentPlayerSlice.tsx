import { createSlice } from '@reduxjs/toolkit'

import {Player} from '../Types';

export const currentPlayerSlice = createSlice({
  name: 'currentPlayerState',
  initialState: Math.random() > 0.5 ? Player.One : Player.Two,
  reducers: {
    endTurn: (state) => {
      return state === Player.One ? Player.Two : Player.One;
    },
  },
})

// Action creators are generated for each case reducer function
export const { endTurn } = currentPlayerSlice.actions

export default currentPlayerSlice.reducer