import { createSlice } from "@reduxjs/toolkit";
import { Player } from "../Types";

export type ReadyForNextGameData = {
  [Player.One]: boolean;
  [Player.Two]: boolean;
};

export const InitialReadyForNextGameData: ReadyForNextGameData = {
  [Player.One]: false,
  [Player.Two]: false,
};

export const readyForNextGameSlice = createSlice({
  name: "readyForNextGameState",
  initialState: InitialReadyForNextGameData,
  reducers: {
    setReadyForNextGameData: (
      _,
      action: { type: string; payload: ReadyForNextGameData }
    ) => {
      return action.payload;
    },
    reset: () => InitialReadyForNextGameData,
  },
});

// Action creators are generated for each case reducer function
export const { setReadyForNextGameData, reset } = readyForNextGameSlice.actions;

export default readyForNextGameSlice.reducer;
