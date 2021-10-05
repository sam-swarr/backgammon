import { configureStore } from '@reduxjs/toolkit'

import gameBoardReducer from './gameBoardSlice'

export const store = configureStore({
  reducer: {
    gameBoard: gameBoardReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch