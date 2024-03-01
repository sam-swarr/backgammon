import { createSlice } from "@reduxjs/toolkit";

import { AnimatableMove, Move } from "../Types";
import { genAnimationID } from "../Utils";

const initialState: AnimatableMove[] = [];

export const animatableMovesSlice = createSlice({
  name: "animatableMovesSlice",
  initialState: initialState,
  reducers: {
    enqueueAnimatableMoves: (
      state,
      action: { type: string; payload: Move[] }
    ) => {
      let newMoves: AnimatableMove[] = [];
      for (let move of action.payload) {
        newMoves.push({
          animationID: genAnimationID(),
          move,
        });
      }
      return [...state, ...newMoves];
    },
    dequeueAnimatableMove: (state) => {
      return state.slice(1);
    },
    reset: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { enqueueAnimatableMoves, dequeueAnimatableMove, reset } =
  animatableMovesSlice.actions;

export default animatableMovesSlice.reducer;
