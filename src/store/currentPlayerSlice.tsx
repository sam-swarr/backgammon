import { createSlice } from "@reduxjs/toolkit";

import { Player } from "../Types";

export const currentPlayerSlice = createSlice({
  name: "currentPlayerState",
  initialState: Math.random() > 0.5 ? Player.One : Player.Two,
  reducers: {
    setCurrentPlayer: (_, action: { type: string; payload: Player }) => {
      return action.payload;
    },
    endTurn: (state) => {
      return state === Player.One ? Player.Two : Player.One;
    },
    reset: () => (Math.random() > 0.5 ? Player.One : Player.Two),
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentPlayer, endTurn, reset } = currentPlayerSlice.actions;

export default currentPlayerSlice.reducer;
