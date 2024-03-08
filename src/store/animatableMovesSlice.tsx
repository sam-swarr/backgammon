import { createSlice } from "@reduxjs/toolkit";

import { AnimatableMove, Move, Player } from "../Types";
import { genAnimationID } from "../Utils";

export type NetworkedMovesPayload = {
  // whose client should show the animation
  animateFor: Player;
  // identifer for this payload so we can track which payloads have been processed
  id: number;
  // the moves to animate
  moves: Move[];
};

const initialState: AnimatableMove[] = [];
const seenPayloadIDs: Set<number> = new Set();

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
    enqueueNetworkedMoves: (
      state,
      action: { type: string; payload: NetworkedMovesPayload }
    ) => {
      // if we've already seen this payload, just ignore it and return the state as it is
      if (seenPayloadIDs.has(action.payload.id)) {
        return state;
      } else {
        seenPayloadIDs.add(action.payload.id);
        let newMoves: AnimatableMove[] = [];
        for (let move of action.payload.moves) {
          newMoves.push({
            animationID: genAnimationID(),
            move,
          });
        }
        return [...state, ...newMoves];
      }
    },
    invalidateNetworkedMoves: (
      state,
      action: { type: string; payload: NetworkedMovesPayload }
    ) => {
      seenPayloadIDs.add(action.payload.id);
      return state;
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
export const {
  enqueueAnimatableMoves,
  enqueueNetworkedMoves,
  invalidateNetworkedMoves,
  dequeueAnimatableMove,
  reset,
} = animatableMovesSlice.actions;

export default animatableMovesSlice.reducer;
