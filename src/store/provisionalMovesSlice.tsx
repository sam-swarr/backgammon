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
    removeLastProvisionalMove: (state) => {
      state.pop();
      return state;
    },
    clearProvisionalMoves: () => {
      return [];
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  appendProvisionalMove,
  removeLastProvisionalMove,
  clearProvisionalMoves,
} = provisionalMovesSlice.actions

export default provisionalMovesSlice.reducer