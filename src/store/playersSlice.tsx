import { createSlice } from "@reduxjs/toolkit";

type PlayerData = {
  uid: string;
  username: string;
};

export type PlayersData = {
  playerOne: PlayerData | null;
  playerTwo: PlayerData | null;
};

const initialState: PlayersData = {
  playerOne: null,
  playerTwo: null,
};

export const playersSlice = createSlice({
  name: "playersState",
  initialState: initialState,
  reducers: {
    setPlayersState: (_, action: { type: string; payload: PlayersData }) => {
      return action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPlayersState } = playersSlice.actions;

export default playersSlice.reducer;
