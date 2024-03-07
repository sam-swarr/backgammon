import { configureStore } from "@reduxjs/toolkit";

import currentPlayerReducer from "./currentPlayerSlice";
import diceReducer from "./diceSlice";
import gameBoardReducer from "./gameBoardSlice";
import gameStateReducer from "./gameStateSlice";
import lastPointClickedReducer from "./lastPointClickedSlice";
import provisionalMovesReducer from "./provisionalMovesSlice";
import settingsReducer from "./settingsSlice";
import playersSliceReducer from "./playersSlice";
import animatableMovesReducer from "./animatableMovesSlice";
import doublingCubeReducer from "./doublingCubeSlice";
import matchScoreReducer from "./matchScoreSlice";

export const store = configureStore({
  reducer: {
    gameBoard: gameBoardReducer,
    gameState: gameStateReducer,
    lastPointClicked: lastPointClickedReducer,
    provisionalMoves: provisionalMovesReducer,
    dice: diceReducer,
    currentPlayer: currentPlayerReducer,
    players: playersSliceReducer,
    settings: settingsReducer,
    animatableMoves: animatableMovesReducer,
    doublingCube: doublingCubeReducer,
    matchScore: matchScoreReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
