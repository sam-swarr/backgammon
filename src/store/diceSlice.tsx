import { createSlice } from '@reduxjs/toolkit'

import { performInitialRolls, rollDiceImpl } from './dice'

const initialRolls = performInitialRolls();

export const diceSlice = createSlice({
  name: 'diceState',
  initialState: initialRolls[initialRolls.length - 1],
  reducers: {
    rollDice: (_state) => {
      return rollDiceImpl();
    },
  },
})

// Action creators are generated for each case reducer function
export const { rollDice } = diceSlice.actions

export default diceSlice.reducer