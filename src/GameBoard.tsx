import { FunctionComponent, useContext, useEffect, useState } from "react";

import { getAvailableDice } from "./store/dice";
import {
  applyMoveToGameBoardState,
  didPlayerWin,
  setGameBoardState,
} from "./store/gameBoardSlice";
import { GameState, setState } from "./store/gameStateSlice";
import {
  clearHighlightedMoves,
  setHighlightedMoves,
} from "./store/highlightedMovesSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { areProvisionalMovesSubmittable, getMoveIfValid } from "./store/moves";
import { appendProvisionalMove } from "./store/provisionalMovesSlice";
import { setShowGameOverDialog } from "./store/settingsSlice";
import { Color, GameResult, Move, MovementDirection, Player } from "./Types";
import Bar from "./Bar";
import BoardPoint from "./BoardPoint";
import Dice from "./Dice";
import Home from "./Home";
import { Animation, createAnimationData } from "./Animations";
import BeginGameButton from "./BeginGameButton";
import OpeningDiceRoll from "./OpeningDiceRoll";
import { isCurrentPlayer } from "./Utils";
import { ActionsContext } from "./ActionsContext";
import {
  dequeueAnimatableMove,
  enqueueAnimatableMoves,
} from "./store/animatableMovesSlice";

const GameBoard: FunctionComponent = () => {
  const [
    currentPlayer,
    settings,
    diceData,
    originalGameBoardState,
    gameState,
    highlightedMoves,
    provisionalMoves,
    players,
    networkedAnimations,
    animatableMoves,
  ] = useAppSelector((state) => [
    state.currentPlayer,
    state.settings,
    state.dice,
    state.gameBoard,
    state.gameState,
    state.highlightedMoves.moves,
    state.provisionalMoves,
    state.players,
    state.networkedAnimations,
    state.animatableMoves,
  ]);
  const actions = useContext(ActionsContext);

  const playerOneColor = settings.playerOneColor;
  const playerTwoColor =
    settings.playerOneColor === Color.White ? Color.Black : Color.White;
  const playerMovementDirection = settings.movementDirection;

  const dispatch = useAppDispatch();
  const [disableSubmitButton, setDisableSubmitButton] = useState(false);
  const [disableUndoButton, setDisableUndoButton] = useState(false);
  const [currAnimations, setCurrAnimations] = useState(new Array<Animation>());

  const currAnimatableMove =
    animatableMoves.length > 0 ? animatableMoves[0] : null;

  // If we have a current animating move, apply it on top of the base board state.
  const gameBoardState =
    currAnimatableMove != null
      ? applyMoveToGameBoardState(
          originalGameBoardState,
          currAnimatableMove.move
        )
      : originalGameBoardState;

  const onAnimationComplete = (id: number) => {
    // If this animation id is not present, then a sibling animation must've already
    // finished before it. Just do nothing.
    if (!currAnimations.some((a) => a.id === id)) {
      return;
    }

    if (currAnimatableMove == null) {
      console.error("Current animatable move is unexpectedly null.");
    }

    // Now that the animation for the move is finished, actually update the base game
    // board state with that move and dequeue it from the animatable moves queue.
    dispatch(setGameBoardState(gameBoardState));
    dispatch(dequeueAnimatableMove());
    setCurrAnimations([]);
  };

  if (currAnimatableMove != null && currAnimations.length === 0) {
    setCurrAnimations(
      createAnimationData(
        originalGameBoardState,
        currAnimatableMove,
        playerMovementDirection
      )
    );
  }

  const availableDice = getAvailableDice(
    diceData.currentRoll,
    provisionalMoves
  );

  // Define useEffect function to check for game win, which will run immediately after
  // render (since we can't be dispatching state updates while in the render path).
  // We define it here so it'll capture the board state after applying provisional moves.
  useEffect(() => {
    const gameResult = didPlayerWin(gameBoardState, currentPlayer);
    switch (gameResult) {
      case GameResult.NotOver:
        break;

      case GameResult.PlayerWon:
        dispatch(setState(GameState.GameOver));
        dispatch(setShowGameOverDialog(true));
        break;

      case GameResult.PlayerWonGammon:
        dispatch(setState(GameState.GameOverGammon));
        dispatch(setShowGameOverDialog(true));
        break;

      case GameResult.PlayerWonBackgammon:
        dispatch(setState(GameState.GameOverBackgammon));
        dispatch(setShowGameOverDialog(true));
        break;

      default:
        console.error("Unhandled GameResult: " + gameResult);
    }
  }, [gameBoardState, currentPlayer, dispatch]);

  const topLeftPoints = [];
  const bottomLeftPoints = [];
  const topRightPoints = [];
  const bottomRightPoints = [];

  const boardPointClickHandler = (
    pointClicked: number | "BAR" | "HOME"
  ): boolean => {
    // Disable click handler if it's not a player's turn or if the client is not
    // the current player.
    if (
      gameState !== GameState.PlayerMoving ||
      !isCurrentPlayer(players, currentPlayer, actions)
    ) {
      return true;
    }

    // Check if player clicked on a highlighted destination.
    const movesToApply = highlightedMoves.filter((m) => m.to === pointClicked);
    if (movesToApply.length > 0) {
      // There may be multiple potential moves to apply in the case where
      // both dice can bear a checker off. If this is the case, find the
      // move that uses the bigger die.
      let moveToApply = movesToApply[0];
      for (let i = 1; i < movesToApply.length; i++) {
        if (movesToApply[i].dieUsed > moveToApply.dieUsed) {
          moveToApply = movesToApply[i];
        }
      }
      dispatch(appendProvisionalMove(moveToApply));
      dispatch(enqueueAnimatableMoves([moveToApply]));
      dispatch(clearHighlightedMoves());
      return true;
    } else if (pointClicked !== "HOME") {
      const possibleMoves: Move[] = [];
      const seenDieValues = new Set();
      for (let i = 0; i < availableDice.length; i++) {
        if (!seenDieValues.has(availableDice[i])) {
          const possibleMove = getMoveIfValid(
            gameBoardState,
            pointClicked,
            availableDice[i],
            currentPlayer
          );
          if (possibleMove !== null) {
            possibleMoves.push(possibleMove);
          }
        }
        seenDieValues.add(availableDice[i]);
      }
      dispatch(
        setHighlightedMoves({
          lastPointClicked: pointClicked,
          moves: possibleMoves,
        })
      );
      return possibleMoves.length > 0;
    }
    return false;
  };

  const submitButtonHandler = () => {
    // Temporarily prevent the submit button from showing up to avoid it
    // appearing immediately when dice are still rolling when there are no
    // legal moves.
    setDisableSubmitButton(true);
    setTimeout(() => {
      setDisableSubmitButton(false);
    }, 1300);
    actions.submitMoves(
      gameBoardState,
      currentPlayer === Player.One ? Player.Two : Player.One,
      networkedAnimations
    );
  };

  const pointsState = gameBoardState.pointsState;
  if (playerMovementDirection === MovementDirection.CounterClockwise) {
    for (let i = 12; i <= 17; i++) {
      topLeftPoints.push(
        <BoardPoint
          key={i}
          pointState={pointsState[i]}
          clickHandler={boardPointClickHandler}
          highlightedMoves={highlightedMoves}
          location={"TOP"}
          playerOneColor={playerOneColor}
          playerTwoColor={playerTwoColor}
          pointNumber={i}
          currAnimations={currAnimations}
          onAnimationComplete={onAnimationComplete}
        />
      );
    }
    for (let i = 11; i >= 6; i--) {
      bottomLeftPoints.push(
        <BoardPoint
          key={i}
          pointState={pointsState[i]}
          clickHandler={boardPointClickHandler}
          highlightedMoves={highlightedMoves}
          location={"BOTTOM"}
          playerOneColor={playerOneColor}
          playerTwoColor={playerTwoColor}
          pointNumber={i}
          currAnimations={currAnimations}
          onAnimationComplete={onAnimationComplete}
        />
      );
    }
    for (let i = 18; i <= 23; i++) {
      topRightPoints.push(
        <BoardPoint
          key={i}
          pointState={pointsState[i]}
          clickHandler={boardPointClickHandler}
          highlightedMoves={highlightedMoves}
          location={"TOP"}
          playerOneColor={playerOneColor}
          playerTwoColor={playerTwoColor}
          pointNumber={i}
          currAnimations={currAnimations}
          onAnimationComplete={onAnimationComplete}
        />
      );
    }
    for (let i = 5; i >= 0; i--) {
      bottomRightPoints.push(
        <BoardPoint
          key={i}
          pointState={pointsState[i]}
          clickHandler={boardPointClickHandler}
          highlightedMoves={highlightedMoves}
          location={"BOTTOM"}
          playerOneColor={playerOneColor}
          playerTwoColor={playerTwoColor}
          pointNumber={i}
          currAnimations={currAnimations}
          onAnimationComplete={onAnimationComplete}
        />
      );
    }
  } else {
    for (let i = 23; i >= 18; i--) {
      topLeftPoints.push(
        <BoardPoint
          key={i}
          pointState={pointsState[i]}
          clickHandler={boardPointClickHandler}
          highlightedMoves={highlightedMoves}
          location={"TOP"}
          playerOneColor={playerOneColor}
          playerTwoColor={playerTwoColor}
          pointNumber={i}
          currAnimations={currAnimations}
          onAnimationComplete={onAnimationComplete}
        />
      );
    }
    for (let i = 0; i <= 5; i++) {
      bottomLeftPoints.push(
        <BoardPoint
          key={i}
          pointState={pointsState[i]}
          clickHandler={boardPointClickHandler}
          highlightedMoves={highlightedMoves}
          location={"BOTTOM"}
          playerOneColor={playerOneColor}
          playerTwoColor={playerTwoColor}
          pointNumber={i}
          currAnimations={currAnimations}
          onAnimationComplete={onAnimationComplete}
        />
      );
    }
    for (let i = 17; i >= 12; i--) {
      topRightPoints.push(
        <BoardPoint
          key={i}
          pointState={pointsState[i]}
          clickHandler={boardPointClickHandler}
          highlightedMoves={highlightedMoves}
          location={"TOP"}
          playerOneColor={playerOneColor}
          playerTwoColor={playerTwoColor}
          pointNumber={i}
          currAnimations={currAnimations}
          onAnimationComplete={onAnimationComplete}
        />
      );
    }
    for (let i = 6; i <= 11; i++) {
      bottomRightPoints.push(
        <BoardPoint
          key={i}
          pointState={pointsState[i]}
          clickHandler={boardPointClickHandler}
          highlightedMoves={highlightedMoves}
          location={"BOTTOM"}
          playerOneColor={playerOneColor}
          playerTwoColor={playerTwoColor}
          pointNumber={i}
          currAnimations={currAnimations}
          onAnimationComplete={onAnimationComplete}
        />
      );
    }
  }

  const home = (
    <Home
      homeState={gameBoardState.homeState}
      isHighlighted={highlightedMoves.some((m) => m.to === "HOME")}
      clickHandler={boardPointClickHandler}
      currentPlayer={currentPlayer}
      playerOneColor={playerOneColor}
      playerTwoColor={playerTwoColor}
      currAnimations={currAnimations}
      onAnimationComplete={onAnimationComplete}
    />
  );

  let diceComponent = null;
  if (gameState === GameState.CoinFlip) {
    diceComponent = <OpeningDiceRoll />;
  } else if (
    gameState === GameState.WaitingToBegin ||
    gameState === GameState.WaitingForPlayers
  ) {
    diceComponent = null;
  } else {
    diceComponent = (
      <Dice
        currentPlayerColor={
          currentPlayer === Player.One ? playerOneColor : playerTwoColor
        }
        availableDice={availableDice}
        diceValues={diceData.currentRoll}
        canSubmit={
          !disableSubmitButton &&
          areProvisionalMovesSubmittable(
            originalGameBoardState,
            diceData.currentRoll,
            currentPlayer,
            provisionalMoves
          )
        }
        provisionalGameBoardState={gameBoardState}
        submitButtonHandler={submitButtonHandler}
        disableUndoButton={disableUndoButton}
        setDisableUndoButton={setDisableUndoButton}
      />
    );
  }

  return (
    <div className="Game-board-wrapper">
      {playerMovementDirection === MovementDirection.Clockwise ? home : null}
      <div className="Game-board-half">
        <div className="Game-board-quadrant top">{topLeftPoints}</div>
        <div className="Game-board-quadrant bottom">{bottomLeftPoints}</div>
      </div>
      <Bar
        barState={gameBoardState.barState}
        clickHandler={boardPointClickHandler}
        currentPlayer={currentPlayer}
        playerOneColor={playerOneColor}
        playerTwoColor={playerTwoColor}
        currAnimations={currAnimations}
        onAnimationComplete={onAnimationComplete}
        highlightedMoves={highlightedMoves}
      />
      <div className="Game-board-half">
        <BeginGameButton />
        {diceComponent}
        <div className="Game-board-quadrant top">{topRightPoints}</div>
        <div className="Game-board-quadrant bottom">{bottomRightPoints}</div>
      </div>
      {playerMovementDirection === MovementDirection.CounterClockwise
        ? home
        : null}
    </div>
  );
};

export default GameBoard;
