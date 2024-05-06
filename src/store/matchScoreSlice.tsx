import { createSlice } from "@reduxjs/toolkit";
import { Player } from "../Types";

export type MatchScore = {
  [Player.One]: number;
  [Player.Two]: number;
  pointsRequiredToWin: number;
};

export const InitialMatchScoreState: MatchScore = {
  [Player.One]: 0,
  [Player.Two]: 0,
  pointsRequiredToWin: 1,
};

export const matchScoreSlice = createSlice({
  name: "matchScoreState",
  initialState: InitialMatchScoreState,
  reducers: {
    setMatchScore: (_, action: { type: string; payload: MatchScore }) => {
      return action.payload;
    },
    setPointsRequiredToWin: (
      state,
      action: { type: string; payload: number }
    ) => {
      state.pointsRequiredToWin = action.payload;
      return state;
    },
    resetMatchScore: () => {
      return InitialMatchScoreState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMatchScore, setPointsRequiredToWin, resetMatchScore } =
  matchScoreSlice.actions;

export default matchScoreSlice.reducer;
