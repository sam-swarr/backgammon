import { createSlice } from '@reduxjs/toolkit'

export const diceSlice = createSlice({
  name: 'diceState',
  initialState: [4, 2],
  reducers: {
    rollDice: (state) => {
      // TODO
    },
  },
})

// Action creators are generated for each case reducer function
export const { rollDice } = diceSlice.actions

export default diceSlice.reducer