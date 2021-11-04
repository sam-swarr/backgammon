import { createSlice } from '@reduxjs/toolkit'
import { Color, MovementDirection } from '../Types';

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    movementDirection: MovementDirection.CounterClockwise,
    playerOneColor: Color.White,
    showSettingsMenu: false,
  },
  reducers: {
    setMovementDirection: (state, action: { type: string, payload: MovementDirection }) => {
      state.movementDirection = action.payload;
      return state;
    },
    setPlayerOneColor: (state, action: { type: string, payload: Color }) => {
      state.playerOneColor = action.payload;
      return state;
    },
    setShowSettingsMenu: (state, action: { type: string, payload: boolean }) => {
      state.showSettingsMenu = action.payload;
      return state;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setMovementDirection, setPlayerOneColor, setShowSettingsMenu } = settingsSlice.actions

export default settingsSlice.reducer