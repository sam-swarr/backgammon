import { createContext } from "react";
import { GameState, setState } from "./store/gameStateSlice";
import { DocumentReference } from "firebase/firestore";
import { writeEndTurnToDB, writeNewGameStateToDB } from "./Firebase";
import { clearProvisionalMoves } from "./store/provisionalMovesSlice";
import { clearHighlightedMoves } from "./store/highlightedMovesSlice";
import { setCurrentPlayer } from "./store/currentPlayerSlice";
import { rollDice } from "./store/diceSlice";
import { setGameBoardState } from "./store/gameBoardSlice";
import { GameBoardState, Player } from "./Types";
import { AddAnimationPayload } from "./store/animationsSlice";
import {
  addNetworkedAnimationPayload,
  clearNetworkedAnimationPayloads,
} from "./store/networkedAnimationsSlice";

export class Actions {
  beginCoinFlip(): void {
    console.error("Unexpected use of default ActionsContext.");
  }

  beginFirstTurn(): void {
    console.error("Unexpected use of default ActionsContext.");
  }

  submitMoves(
    _newGameBoardState: GameBoardState,
    _newCurrentPlayer: Player
  ): void {
    console.error("Unexpected use of default ActionsContext.");
  }

  addNetworkedAnimationPayload(_payload: AddAnimationPayload) {
    console.error("Unexpected use of default ActionsContext.");
  }

  clearNetworkedAnimationPayloads() {
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

  submitMoves(
    newGameBoardState: GameBoardState,
    newCurrentPlayer: Player
  ): void {
    this.dispatchFn(clearProvisionalMoves());
    this.dispatchFn(clearHighlightedMoves());
    this.dispatchFn(setGameBoardState(newGameBoardState));
    this.dispatchFn(setCurrentPlayer(newCurrentPlayer));
    this.dispatchFn(rollDice());
  }

  // No need to do anything for a local game
  addNetworkedAnimationPayload(_payload: AddAnimationPayload) {}
  // No need to do anything for a local game
  clearNetworkedAnimationPayloads() {}
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

  submitMoves(
    newGameBoardState: GameBoardState,
    newCurrentPlayer: Player
  ): void {
    this.dispatchFn(clearProvisionalMoves());
    this.dispatchFn(clearHighlightedMoves());
    this.dispatchFn(clearNetworkedAnimationPayloads());
    writeEndTurnToDB(this.docRef, newGameBoardState, newCurrentPlayer);
  }

  addNetworkedAnimationPayload(payload: AddAnimationPayload) {
    this.dispatchFn(addNetworkedAnimationPayload(payload));
  }

  clearNetworkedAnimationPayloads() {
    this.dispatchFn(clearNetworkedAnimationPayloads());
  }
}

export const ActionsContext = createContext<Actions>(new Actions());
