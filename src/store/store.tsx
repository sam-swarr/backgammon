import { configureStore } from '@reduxjs/toolkit'

import currentPlayerReducer from './currentPlayerSlice'
import diceReducer from './diceSlice'
import gameBoardReducer from './gameBoardSlice'
import highlightedMovesReducer from './highlightedMovesSlice'

export const store = configureStore({
  reducer: {
    gameBoard: gameBoardReducer,
    highlightedMoves: highlightedMovesReducer,
    dice: diceReducer,
    currentPlayer: currentPlayerReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch