import { createContext } from "react";
import { GameState } from "./store/gameStateSlice";
import { DocumentReference } from "firebase/firestore";

export class Actions {
  setGameState(_gameState: GameState): void {
    console.error("Unexpected use of default ActionsContext.");
  }
}

export class LocalGameActions extends Actions {
  setGameState(gameState: GameState): void {
    console.log("LOCAL SET GAME STATE CALLED");
  }
}

export class NetworkedGameActions extends Actions {
  docRef: DocumentReference;

  constructor(docRef: DocumentReference) {
    super();
    this.docRef = docRef;
  }

  setGameState(gameState: GameState): void {
    console.log("NETWORKED SET GAME STATE CALLED");
    console.log(this.docRef);
    // TODO: continue here
  }
}

export const ActionsContext = createContext<Actions>(new Actions());
