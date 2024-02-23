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
import {
  AddNetworkedAnimationPayload,
  addNetworkedAnimation,
  clearNetworkedAnimations,
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
    _newCurrentPlayer: Player,
    _networkedAnimations: AddNetworkedAnimationPayload[]
  ): void {
    console.error("Unexpected use of default ActionsContext.");
  }

  addNetworkedAnimation(_payload: AddNetworkedAnimationPayload) {
    console.error("Unexpected use of default ActionsContext.");
  }

  clearNetworkedAnimations() {
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
    newCurrentPlayer: Player,
    _networkedAnimations: AddNetworkedAnimationPayload[]
  ): void {
    this.dispatchFn(clearProvisionalMoves());
    this.dispatchFn(clearHighlightedMoves());
    this.dispatchFn(setGameBoardState(newGameBoardState));
    this.dispatchFn(setCurrentPlayer(newCurrentPlayer));
    this.dispatchFn(rollDice());
  }

  // No need to do anything for a local game
  addNetworkedAnimation(_payload: AddNetworkedAnimationPayload) {}
  // No need to do anything for a local game
  clearNetworkedAnimations() {}
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
    newCurrentPlayer: Player,
    networkedAnimations: AddNetworkedAnimationPayload[]
  ): void {
    this.dispatchFn(clearProvisionalMoves());
    this.dispatchFn(clearHighlightedMoves());
    this.dispatchFn(clearNetworkedAnimations());
    writeEndTurnToDB(
      this.docRef,
      newGameBoardState,
      newCurrentPlayer,
      networkedAnimations
    );
  }

  addNetworkedAnimation(payload: AddNetworkedAnimationPayload) {
    this.dispatchFn(addNetworkedAnimation(payload));
  }

  clearNetworkedAnimations() {
    this.dispatchFn(clearNetworkedAnimations());
  }
}

export const ActionsContext = createContext<Actions>(new Actions());
