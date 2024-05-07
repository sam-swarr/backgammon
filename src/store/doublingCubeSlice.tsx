import { createSlice } from "@reduxjs/toolkit";
import { Player } from "../Types";

export type DoublingCubeData = {
  owner: Player | null;
  gameStakes: number;
  enabled: boolean;
};

export const InitialDoublingCubeState: DoublingCubeData = {
  owner: null,
  gameStakes: 1,
  enabled: true,
};

export const doublingCubeSlice = createSlice({
  name: "doublingCubeState",
  initialState: InitialDoublingCubeState,
  reducers: {
    setDoublingCubeData: (
      _,
      action: { type: string; payload: DoublingCubeData }
    ) => {
      return action.payload;
    },
    resetDoublingCubeData: (state) => {
      return {
        ...InitialDoublingCubeState,
        enabled: state.enabled,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDoublingCubeData, resetDoublingCubeData } =
  doublingCubeSlice.actions;

export default doublingCubeSlice.reducer;
