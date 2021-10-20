import { createSlice } from '@reduxjs/toolkit'

import { ValidMove } from '../Types';

type HighlightedMovesState = {
  lastPointClicked: number | "BAR",
  moves: ValidMove[],
};

const initialState: HighlightedMovesState = {
  lastPointClicked: -1,
  moves: [],
};

export const highlightedMovesSlice = createSlice({
  name: 'highlightedMovesState',
  initialState: initialState,
  reducers: {
    setHighlightedMoves: (state, action: { type: string, payload: HighlightedMovesState } ) => {
      if (action.payload.lastPointClicked === state.lastPointClicked) {
        return initialState;
      }
      return action.payload;
    },
    clearHighlightedMoves: (_state) => {
      return initialState;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setHighlightedMoves, clearHighlightedMoves } = highlightedMovesSlice.actions

export default highlightedMovesSlice.reducer