import { createContext } from "react";
import { GameState, setState } from "./store/gameStateSlice";
import { DocumentReference } from "firebase/firestore";
import { writeNewGameStateToDB } from "./Firebase";

export class Actions {
  setGameState(_gameState: GameState): void {
    console.error("Unexpected use of default ActionsContext.");
  }
}

export class LocalGameActions extends Actions {
  dispatchFn: Function;

  constructor(dispatchFn: Function) {
    super();
    this.dispatchFn = dispatchFn;
  }

  setGameState(gameState: GameState): void {
    this.dispatchFn(setState(gameState));
  }
}

export class NetworkedGameActions extends Actions {
  docRef: DocumentReference;

  constructor(docRef: DocumentReference) {
    super();
    this.docRef = docRef;
  }

  setGameState(gameState: GameState): void {
    writeNewGameStateToDB(this.docRef, gameState);
  }
}

export const ActionsContext = createContext<Actions>(new Actions());
