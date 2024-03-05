import { createContext } from "react";
import { GameState, setState } from "./store/gameStateSlice";
import { DocumentReference } from "firebase/firestore";
import { writeEndTurnToDB, writeNewGameStateToDB } from "./Firebase";
import { clearProvisionalMoves } from "./store/provisionalMovesSlice";
import { clearHighlightedMoves } from "./store/highlightedMovesSlice";
import { setCurrentPlayer } from "./store/currentPlayerSlice";
import { rollDice } from "./store/diceSlice";
import { setGameBoardState } from "./store/gameBoardSlice";
import { GameBoardState, Move, Player } from "./Types";
import { genAnimationID } from "./Utils";
import { NetworkedMovesPayload } from "./store/animatableMovesSlice";

export class Actions {
  beginCoinFlip(): void {
    console.error("Unexpected use of default ActionsContext.");
  }

  beginFirstTurn(): void {
    console.error("Unexpected use of default ActionsContext.");
  }

  async submitMoves(
    _newGameBoardState: GameBoardState,
    _newCurrentPlayer: Player,
    _movesToSubmit: Move[]
  ): Promise<void> {
    console.error("Unexpected use of default ActionsContext.");
  }
}

export class LocalGameActions extends Actions {
  dispatchFn: Function;

  constructor(dispatchFn: Function) {
    super();
    this.dispatchFn = dispatchFn;
  }

  beginCoinFlip(): void {
    this.dispatchFn(setState(GameState.CoinFlip));
  }

  beginFirstTurn(): void {
    this.dispatchFn(setState(GameState.PlayerMoving));
  }

  async submitMoves(
    newGameBoardState: GameBoardState,
    newCurrentPlayer: Player,
    _movesToSubmit: Move[]
  ): Promise<void> {
    this.dispatchFn(clearProvisionalMoves());
    this.dispatchFn(clearHighlightedMoves());
    this.dispatchFn(setGameBoardState(newGameBoardState));
    this.dispatchFn(setCurrentPlayer(newCurrentPlayer));
    this.dispatchFn(rollDice());
  }
}

export class NetworkedGameActions extends Actions {
  dispatchFn: Function;
  docRef: DocumentReference;

  constructor(dispatchFn: Function, docRef: DocumentReference) {
    super();
    this.dispatchFn = dispatchFn;
    this.docRef = docRef;
  }

  beginCoinFlip(): void {
    writeNewGameStateToDB(this.docRef, GameState.CoinFlip);
  }

  beginFirstTurn(): void {
    writeNewGameStateToDB(this.docRef, GameState.PlayerMoving);
  }

  async submitMoves(
    newGameBoardState: GameBoardState,
    newCurrentPlayer: Player,
    movesToSubmit: Move[]
  ): Promise<void> {
    let networkedMoves: NetworkedMovesPayload = {
      animateFor: newCurrentPlayer,
      id: genAnimationID(),
      moves: movesToSubmit,
    };

    this.dispatchFn(clearProvisionalMoves());
    this.dispatchFn(clearHighlightedMoves());

    await writeEndTurnToDB(
      this.docRef,
      newGameBoardState,
      newCurrentPlayer,
      networkedMoves
    );
  }
}

export const ActionsContext = createContext<Actions>(new Actions());
