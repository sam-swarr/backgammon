import { createSlice } from "@reduxjs/toolkit";

import { Player } from "../Types";

export const currentPlayerSlice = createSlice({
  name: "currentPlayerState",
  initialState: Player.One,
  reducers: {
    setCurrentPlayer: (_, action: { type: string; payload: Player }) => {
      return action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentPlayer } = currentPlayerSlice.actions;

export default currentPlayerSlice.reducer;
