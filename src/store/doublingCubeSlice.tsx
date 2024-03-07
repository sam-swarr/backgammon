import { createSlice } from "@reduxjs/toolkit";
import { Player } from "../Types";

export type DoublingCubeData = {
  owner: Player | null;
  gameStakes: number;
};
const initialState: DoublingCubeData = {
  owner: null,
  gameStakes: 1,
};

export const doublingCubeSlice = createSlice({
  name: "doublingCubeState",
  initialState: initialState,
  reducers: {
    setDoublingCubeData: (
      _,
      action: { type: string; payload: DoublingCubeData }
    ) => {
      return action.payload;
    },
    resetDoublingCubeData: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDoublingCubeData, resetDoublingCubeData } =
  doublingCubeSlice.actions;

export default doublingCubeSlice.reducer;
