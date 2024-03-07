import { createSlice } from "@reduxjs/toolkit";
import { Player } from "../Types";

export type MatchScore = {
  [Player.One]: number;
  [Player.Two]: number;
  matchValue: number;
};
const initialState: MatchScore = {
  [Player.One]: 0,
  [Player.Two]: 0,
  matchValue: 1,
};

export const matchScoreSlice = createSlice({
  name: "matchScoreState",
  initialState: initialState,
  reducers: {
    setMatchScore: (_, action: { type: string; payload: MatchScore }) => {
      return action.payload;
    },
    resetMatchScore: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMatchScore, resetMatchScore } = matchScoreSlice.actions;

export default matchScoreSlice.reducer;
