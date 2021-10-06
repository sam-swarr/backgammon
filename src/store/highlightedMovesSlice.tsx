import { createSlice } from '@reduxjs/toolkit'

import { Move } from '../Types';

const initialState: Move[] = [];

export const highlightedMovesSlice = createSlice({
  name: 'highlightedMovesState',
  initialState: initialState,
  reducers: {
    addHighlightedMove: (state, action: { type: string, payload: Move} ) => {
      state.push(action.payload);
    },
    clearHighlightedMoves: (state) => {
      state = [];
    }
  },
})

// Action creators are generated for each case reducer function
export const { addHighlightedMove, clearHighlightedMoves } = highlightedMovesSlice.actions

export default highlightedMovesSlice.reducer