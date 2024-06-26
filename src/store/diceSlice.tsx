import { createSlice } from "@reduxjs/toolkit";

import { performInitialRolls, rollDiceImpl } from "./dice";

const initialRolls = performInitialRolls();

export type InitialDiceRolls = {
  [key: number]: number[];
};

export type DiceData = {
  initialRolls: InitialDiceRolls;
  currentRoll: number[];
};

export const diceSlice = createSlice({
  name: "diceState",
  initialState: {
    initialRolls: initialRolls,
    currentRoll: initialRolls[Object.keys(initialRolls).length - 1],
  },
  reducers: {
    rollDice: (state) => {
      return {
        initialRolls: state.initialRolls,
        currentRoll: rollDiceImpl(),
      };
    },
    setDiceState: (_, action: { payload: DiceData }) => {
      return action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { rollDice, setDiceState } = diceSlice.actions;

export default diceSlice.reducer;
