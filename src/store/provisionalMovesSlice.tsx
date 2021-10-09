import { createSlice } from '@reduxjs/toolkit'

import { GameBoardState, Move, Player } from '../Types';

const initialState: Move[] = [];

export const provisionalMovesSlice = createSlice({
  name: 'provisionalMovesState',
  initialState: initialState,
  reducers: {
    appendProvisionalMove: (state, action: { type: string, payload: Move }) => {
      return [...state, action.payload];
    },
    clearProvisionalMoves: (_state) => {
      return [];
    }
  },
})

// Action creators are generated for each case reducer function
export const { appendProvisionalMove, clearProvisionalMoves } = provisionalMovesSlice.actions

export default provisionalMovesSlice.reducer