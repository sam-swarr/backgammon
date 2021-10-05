import { createSlice } from '@reduxjs/toolkit'

import {STARTING_BOARD_STATE} from '../Constants';

export const gameBoardSlice = createSlice({
  name: 'gameBoardState',
  initialState: STARTING_BOARD_STATE,
  reducers: {
    applyMove: (state, move) => {
      // TODO
    },
    undoMove: (state, move) => {
      // TODO
    }
  },
})

// Action creators are generated for each case reducer function
export const { applyMove, undoMove } = gameBoardSlice.actions

export default gameBoardSlice.reducer