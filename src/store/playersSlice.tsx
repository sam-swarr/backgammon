import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUser } from "../Firebase";

type PlayerData = {
  uid: string;
};

export type PlayersData = {
  playerOne: PlayerData | null;
  playerTwo: PlayerData | null;
  isHost: boolean;
};

export type PlayersDataPayload = {
  playerOne: PlayerData | null;
  playerTwo: PlayerData | null;
};

const initialState: PlayersData = {
  playerOne: null,
  playerTwo: null,
  isHost: false,
};

export const playersSlice = createSlice({
  name: "playersState",
  initialState: initialState,
  reducers: {
    setPlayersState: (
      _,
      action: { type: string; payload: PlayersDataPayload }
    ) => {
      let isHost = false;
      if (action.payload.playerOne != null) {
        isHost = getCurrentUser().uid === action.payload.playerOne.uid;
      }

      return {
        playerOne: action.payload.playerOne,
        playerTwo: action.payload.playerTwo,
        isHost,
      };
    },
    reset: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const { setPlayersState, reset } = playersSlice.actions;

export default playersSlice.reducer;
