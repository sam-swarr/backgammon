import { configureStore } from '@reduxjs/toolkit'

import currentPlayerReducer from './currentPlayerSlice'
import diceReducer from './diceSlice'
import gameBoardReducer from './gameBoardSlice'
import gameStateSlice from './gameStateSlice'
import highlightedMovesReducer from './highlightedMovesSlice'
import provisionalMovesReducer from './provisionalMovesSlice'

export const store = configureStore({
  reducer: {
    gameBoard: gameBoardReducer,
    gameState: gameStateSlice,
    highlightedMoves: highlightedMovesReducer,
    provisionalMoves: provisionalMovesReducer,
    dice: diceReducer,
    currentPlayer: currentPlayerReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch