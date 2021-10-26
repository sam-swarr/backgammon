import { createSlice } from '@reduxjs/toolkit'

import { rollDiceImpl } from './dice'

export const diceSlice = createSlice({
  name: 'diceState',
  initialState: [4, 2],
  reducers: {
    rollDice: (_state) => {
      return rollDiceImpl();
    },
  },
})

// Action creators are generated for each case reducer function
export const { rollDice } = diceSlice.actions

export default diceSlice.reducer