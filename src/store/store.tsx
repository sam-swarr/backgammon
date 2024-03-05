import { configureStore } from "@reduxjs/toolkit";

import currentPlayerReducer from "./currentPlayerSlice";
import diceReducer from "./diceSlice";
import gameBoardReducer from "./gameBoardSlice";
import gameStateReducer from "./gameStateSlice";
import highlightedMovesReducer from "./highlightedMovesSlice";
import provisionalMovesReducer from "./provisionalMovesSlice";
import settingsReducer from "./settingsSlice";
import playersSliceReducer from "./playersSlice";
import animatableMovesSlice from "./animatableMovesSlice";

export const store = configureStore({
  reducer: {
    gameBoard: gameBoardReducer,
    gameState: gameStateReducer,
    highlightedMoves: highlightedMovesReducer,
    provisionalMoves: provisionalMovesReducer,
    dice: diceReducer,
    currentPlayer: currentPlayerReducer,
    players: playersSliceReducer,
    settings: settingsReducer,
    animatableMoves: animatableMovesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
