import { createSlice } from '@reduxjs/toolkit'

import {Player} from '../Types';

export const currentPlayerSlice = createSlice({
  name: 'currentPlayerState',
  initialState: Player.One,
  reducers: {
    endTurn: (state) => {
      if (state === Player.One) {
        state = Player.Two;
      } else {
        state = Player.One;
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { endTurn } = currentPlayerSlice.actions

export default currentPlayerSlice.reducer