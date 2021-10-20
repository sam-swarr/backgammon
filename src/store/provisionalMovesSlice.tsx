import { createSlice } from '@reduxjs/toolkit';

import { ValidMove } from '../Types';

const initialState: ValidMove[] = [];

export const provisionalMovesSlice = createSlice({
  name: 'provisionalMovesState',
  initialState: initialState,
  reducers: {
    appendProvisionalMove: (state, action: { type: string, payload: ValidMove }) => {
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