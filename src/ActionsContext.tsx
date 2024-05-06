import { createContext } from "react";
import { GameState, setState } from "./store/gameStateSlice";
import { DocumentReference } from "firebase/firestore";
import {
  writeAcceptDoubleToDB,
  writeAutomaticDoubleToDB,
  writeEndTurnToDB,
  writeGameOverToDB,
  writeMatchSettingsToDB,
  writeNewGameStateToDB,
} from "./Firebase";
import { clearProvisionalMoves } from "./store/provisionalMovesSlice";
import { clearLastPointClicked } from "./store/lastPointClickedSlice";
import { setCurrentPlayer } from "./store/currentPlayerSlice";
import { rollDice } from "./store/diceSlice";
import { setGameBoardState } from "./store/gameBoardSlice";
import { GameBoardState, Move, Player } from "./Types";
import { genAnimationID } from "./Utils";
import { NetworkedMovesPayload } from "./store/animatableMovesSlice";
import {
  InitialDoublingCubeState,
  setDoublingCubeData,
} from "./store/doublingCubeSlice";
import {
  setShowGameOverDialog,
  setShowMatchSetupScreen,
} from "./store/settingsSlice";
import { setPointsRequiredToWin } from "./store/matchScoreSlice";
import { setWipeTransition } from "./store/wipeTransitionSlice";

export class Actions {
  /**
   * Certain actions or pieces of UI should only be performed or shown to
   * the "host" client. For a networked game, this will be the player who
   * created the lobby. For a local game, there's only one client which is
   * always the host.
   *
   * @returns true if the current client is the host
   */
  isHostClient(): boolean {
    console.error("Unexpected use of default ActionsContext.");
    return false;
  }

  beginCoinFlip(): void {
    console.error("Unexpected use of default ActionsContext.");
  }

  beginFirstTurn(_startingPlayer: Player): void {
    console.error("Unexpected use of default ActionsContext.");
  }

  async rollButtonClicked(): Promise<void> {
    console.error("Unexpected use of default ActionsContext.");
  }

  async offerDoubleButtonClicked(): Promise<void> {
    console.error("Unexpected use of default ActionsContext.");
  }

  async acceptDoubleButtonClicked(
    _newDoublingCubeOwner: Player,
    _newGameStakes: number
  ): Promise<void> {
    console.error("Unexpected use of default ActionsContext.");
  }

  async automaticDouble(): Promise<void> {
    console.error("Unexpected use of default ActionsContext.");
  }

  async forfeitButtonClicked(): Promise<void> {
    console.error("Unexpected use of default ActionsContext.");
  }

  async submitMoves(
    _newGameBoardState: GameBoardState,
    _newCurrentPlayer: Player,
    _movesToSubmit: Move[]
  ): Promise<void> {
    console.error("Unexpected use of default ActionsContext.");
  }

  async gameOver(
    _newGameBoardState: GameBoardState,
    _winningGameState:
      | GameState.GameOver
      | GameState.GameOverGammon
      | GameState.GameOverBackgammon,
    _losingPlayer: Player,
    _winningMoves: Move[]
  ): Promise<void> {
    console.error("Unexpected use of default ActionsContext.");
  }

  async updateMatchSettings(
    _matchPoints: number,
    _enableDoubling: boolean
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

  isHostClient(): boolean {
    return true;
  }

  beginCoinFlip(): void {
    this.dispatchFn(setState(GameState.CoinFlip));
  }

  beginFirstTurn(startingPlayer: Player): void {
    this.dispatchFn(setCurrentPlayer(startingPlayer));
    this.dispatchFn(setState(GameState.PlayerMoving));
  }

  async rollButtonClicked(): Promise<void> {
    this.dispatchFn(setState(GameState.PlayerMoving));
  }

  async offerDoubleButtonClicked(): Promise<void> {
    this.dispatchFn(setState(GameState.PlayerOfferingDouble));
  }

  async acceptDoubleButtonClicked(
    newDoublingCubeOwner: Player,
    newGameStakes: number
  ): Promise<void> {
    this.dispatchFn(
      setDoublingCubeData({
        owner: newDoublingCubeOwner,
        gameStakes: newGameStakes,
        enabled: true,
      })
    );
    this.dispatchFn(setState(GameState.PlayerRolling));
  }

  async automaticDouble(): Promise<void> {
    this.dispatchFn(
      setDoublingCubeData({
        owner: null,
        gameStakes: 2,
        enabled: true,
      })
    );
  }

  async forfeitButtonClicked(): Promise<void> {
    // TODO
    console.log("FORFEIT");
  }

  async submitMoves(
    newGameBoardState: GameBoardState,
    newCurrentPlayer: Player,
    _movesToSubmit: Move[]
  ): Promise<void> {
    this.dispatchFn(clearProvisionalMoves());
    this.dispatchFn(clearLastPointClicked());
    this.dispatchFn(setState(GameState.PlayerRolling));
    this.dispatchFn(setGameBoardState(newGameBoardState));
    this.dispatchFn(setCurrentPlayer(newCurrentPlayer));
    this.dispatchFn(rollDice());
  }

  async gameOver(
    newGameBoardState: GameBoardState,
    winningGameState:
      | GameState.GameOver
      | GameState.GameOverGammon
      | GameState.GameOverBackgammon,
    _losingPlayer: Player,
    _winningMoves: Move[]
  ): Promise<void> {
    this.dispatchFn(clearProvisionalMoves());
    this.dispatchFn(clearLastPointClicked());
    this.dispatchFn(setState(winningGameState));
    this.dispatchFn(setGameBoardState(newGameBoardState));
    this.dispatchFn(setShowGameOverDialog(true));
  }

  async updateMatchSettings(
    pointsRequiredToWin: number,
    enableDoubling: boolean
  ): Promise<void> {
    this.dispatchFn(setPointsRequiredToWin(pointsRequiredToWin));
    this.dispatchFn(
      setDoublingCubeData({
        ...InitialDoublingCubeState,
        enabled: enableDoubling,
      })
    );
    this.dispatchFn(setShowMatchSetupScreen(false));
    this.dispatchFn(setWipeTransition(true));
  }
}

export class NetworkedGameActions extends Actions {
  isHost: boolean;
  dispatchFn: Function;
  docRef: DocumentReference;

  constructor(
    isHostClient: boolean,
    dispatchFn: Function,
    docRef: DocumentReference
  ) {
    super();
    this.isHost = isHostClient;
    this.dispatchFn = dispatchFn;
    this.docRef = docRef;
  }

  isHostClient(): boolean {
    return this.isHost;
  }

  beginCoinFlip(): void {
    writeNewGameStateToDB(this.docRef, GameState.CoinFlip);
  }

  beginFirstTurn(_startingPlayer: Player): void {
    // The correct starting player is already written to the DB upon lobby creation
    // so no need to do anything with startingPlayer here.
    writeNewGameStateToDB(this.docRef, GameState.PlayerMoving);
  }

  async offerDoubleButtonClicked(): Promise<void> {
    writeNewGameStateToDB(this.docRef, GameState.PlayerOfferingDouble);
  }

  async acceptDoubleButtonClicked(
    newDoublingCubeOwner: Player,
    newGameStakes: number
  ): Promise<void> {
    const newDoublingCubeData = {
      owner: newDoublingCubeOwner,
      gameStakes: newGameStakes,
      enabled: true,
    };

    // Optimistically update local client.
    this.dispatchFn(setDoublingCubeData(newDoublingCubeData));
    this.dispatchFn(setState(GameState.PlayerRolling));

    return await writeAcceptDoubleToDB(this.docRef, newDoublingCubeData);
  }

  async automaticDouble(): Promise<void> {
    // Optimistically update local client.
    this.dispatchFn(
      setDoublingCubeData({
        owner: null,
        gameStakes: 2,
        enabled: true,
      })
    );

    return await writeAutomaticDoubleToDB(this.docRef);
  }

  async forfeitButtonClicked(): Promise<void> {
    // TODO
    console.log("FORFEIT");
  }

  async rollButtonClicked(): Promise<void> {
    await writeNewGameStateToDB(this.docRef, GameState.PlayerMoving);
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
    this.dispatchFn(clearLastPointClicked());

    // Optimistically write these changes to the local store first so that
    // local client gets a fast update. The same changes will propagate to the
    // other client via the DB write after this.
    this.dispatchFn(setState(GameState.PlayerRolling));
    this.dispatchFn(setGameBoardState(newGameBoardState));
    this.dispatchFn(setCurrentPlayer(newCurrentPlayer));

    return await writeEndTurnToDB(
      this.docRef,
      newGameBoardState,
      newCurrentPlayer,
      networkedMoves
    );
  }

  async gameOver(
    newGameBoardState: GameBoardState,
    winningGameState:
      | GameState.GameOver
      | GameState.GameOverGammon
      | GameState.GameOverBackgammon,
    losingPlayer: Player,
    winningMoves: Move[]
  ): Promise<void> {
    let networkedMoves: NetworkedMovesPayload = {
      animateFor: losingPlayer,
      id: genAnimationID(),
      moves: winningMoves,
    };

    this.dispatchFn(clearProvisionalMoves());
    this.dispatchFn(clearLastPointClicked());

    // Optimistically write these changes to the local store first so that
    // local client gets a fast update. The same changes will propagate to the
    // other client via the DB write after this.
    this.dispatchFn(setState(winningGameState));
    this.dispatchFn(setGameBoardState(newGameBoardState));
    this.dispatchFn(setShowGameOverDialog(true));

    return await writeGameOverToDB(
      this.docRef,
      newGameBoardState,
      winningGameState,
      networkedMoves
    );
  }

  async updateMatchSettings(
    pointsRequiredToWin: number,
    enableDoubling: boolean
  ): Promise<void> {
    // Optimistically write these changes to the local store first so that
    // local client gets a fast update. The same changes will propagate to the
    // other client via the DB write after this.
    this.dispatchFn(setPointsRequiredToWin(pointsRequiredToWin));
    this.dispatchFn(
      setDoublingCubeData({
        ...InitialDoublingCubeState,
        enabled: enableDoubling,
      })
    );
    this.dispatchFn(setShowMatchSetupScreen(false));
    this.dispatchFn(setWipeTransition(true));

    return await writeMatchSettingsToDB(
      this.docRef,
      pointsRequiredToWin,
      enableDoubling
    );
  }
}

export const ActionsContext = createContext<Actions>(new Actions());
