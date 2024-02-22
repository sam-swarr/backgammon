import { createContext } from "react";
import { GameState, setState } from "./store/gameStateSlice";
import { DocumentReference } from "firebase/firestore";
import { writeNewGameStateToDB } from "./Firebase";

export class Actions {
  beginCoinFlip(): void {
    console.error("Unexpected use of default ActionsContext.");
  }

  beginFirstTurn(): void {
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
}

export class NetworkedGameActions extends Actions {
  docRef: DocumentReference;

  constructor(docRef: DocumentReference) {
    super();
    this.docRef = docRef;
  }

  beginCoinFlip(): void {
    writeNewGameStateToDB(this.docRef, GameState.CoinFlip);
  }

  beginFirstTurn(): void {
    writeNewGameStateToDB(this.docRef, GameState.PlayerMoving);
  }
}

export const ActionsContext = createContext<Actions>(new Actions());
