import { FunctionComponent, useContext, useEffect, useState } from "react";

import { getAvailableDice } from "./store/dice";
import {
  applyMoveToGameBoardState,
  didPlayerWin,
} from "./store/gameBoardSlice";
import { GameState, setState } from "./store/gameStateSlice";
import {
  clearHighlightedMoves,
  setHighlightedMoves,
} from "./store/highlightedMovesSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { areProvisionalMovesSubmittable, getMoveIfValid } from "./store/moves";
import {
  appendProvisionalMove,
  removeLastProvisionalMove,
} from "./store/provisionalMovesSlice";
import { setShowGameOverDialog } from "./store/settingsSlice";
import {
  Color,
  GameResult,
  HitStatus,
  Move,
  MovementDirection,
  Player,
} from "./Types";
import Bar from "./Bar";
import BoardPoint from "./BoardPoint";
import Dice from "./Dice";
import Home from "./Home";
import { Animation, createAnimationData } from "./Animations";
import BeginGameButton from "./BeginGameButton";
import OpeningDiceRoll from "./OpeningDiceRoll";
import { isCurrentPlayer } from "./Utils";
import { ActionsContext } from "./ActionsContext";

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
  ]);
  const actions = useContext(ActionsContext);

  const playerOneColor = settings.playerOneColor;
  const playerTwoColor =
    settings.playerOneColor === Color.White ? Color.Black : Color.White;
  const playerMovementDirection = settings.movementDirection;

  const dispatch = useAppDispatch();
  const [disableSubmitButton, setDisableSubmitButton] = useState(false);
  const [disableUndoButton, setDisableUndoButton] = useState(false);

  /*
   * Animation Callbacks
   */
  const [animationQueue, setAnimationQueue] = useState(
    Array<Array<Animation>>()
  );
  const addAnimationsToQueue = (animations: Animation[][]) => {
    let newQueue = [...animationQueue, ...animations];
    setAnimationQueue(newQueue);
  };

  const removeAnimationFromQueue = (id: number) => {
    let newCurrAnimations: Animation[] = [];
    let oldCurrAnimations = animationQueue[0];
    for (let a of oldCurrAnimations) {
      if (a.id !== id) {
        newCurrAnimations.push(a);
      } else {
        // if (a.options) {
        //   if (a.options.removeProvisionalMoveOnCompletion) {
        //     dispatch(removeLastProvisionalMove());
        //   }
        //   if (a.options.reenableUndoButtonOnCompletion) {
        //     setDisableUndoButton(false);
        //   }
        // }
      }
    }

    if (newCurrAnimations.length === oldCurrAnimations.length) {
      console.error(
        "Animation state error. Trying to remove animation " +
          id +
          " but it is not present."
      );
    }

    let newAnimationQueue: Animation[][] =
      newCurrAnimations.length > 0
        ? [newCurrAnimations, ...animationQueue.slice(1)]
        : animationQueue.slice(1);

    setAnimationQueue(newAnimationQueue);
  };

  const currAnimations = animationQueue.length > 0 ? animationQueue[0] : [];

  const availableDice = getAvailableDice(
    diceData.currentRoll,
    provisionalMoves
  );

  const gameBoardState = provisionalMoves.reduce((prevBoardState, currMove) => {
    return applyMoveToGameBoardState(prevBoardState, currMove, currentPlayer);
  }, originalGameBoardState);

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
  }, [gameBoardState, currentPlayer]);

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

      let animationsToQueue: Animation[] = createAnimationData(
        gameBoardState,
        moveToApply,
        playerMovementDirection
      );
      // animationsToQueue.push(
      //   createAnimationData(
      //     gameBoardState,
      //     moveToApply.move,
      //     moveToApply.move.to,
      //     currentPlayer,
      //     playerMovementDirection
      //   )
      // );
      // actions.addNetworkedAnimation({
      //   animateFor: otherPlayer,
      //   animationData: {
      //     location: moveToApply.move.to,
      //     move: moveToApply.move,
      //     checkerOwner: currentPlayer,
      //   },
      // });

      // if (moveToApply.hitStatus === HitStatus.IsHit) {
      //   animationsToQueue.push(
      //     createAnimationData(
      //       gameBoardState,
      //       {
      //         from: moveToApply.move.to,
      //         to: "BAR",
      //       },
      //       "BAR",
      //       otherPlayer,
      //       playerMovementDirection
      //     )
      //   );
      //   // actions.addNetworkedAnimation({
      //   //   animateFor: otherPlayer,
      //   //   animationData: {
      //   //     location: "BAR",
      //   //     move: {
      //   //       from: moveToApply.move.to,
      //   //       to: "BAR",
      //   //     },
      //   //     checkerOwner: otherPlayer,
      //   //   },
      //   // });
      // }
      addAnimationsToQueue([animationsToQueue]);
      dispatch(appendProvisionalMove(moveToApply));
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
          removeAnimationFunction={removeAnimationFromQueue}
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
          removeAnimationFunction={removeAnimationFromQueue}
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
          removeAnimationFunction={removeAnimationFromQueue}
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
          removeAnimationFunction={removeAnimationFromQueue}
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
          removeAnimationFunction={removeAnimationFromQueue}
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
          removeAnimationFunction={removeAnimationFromQueue}
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
          removeAnimationFunction={removeAnimationFromQueue}
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
          removeAnimationFunction={removeAnimationFromQueue}
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
      removeAnimationFunction={removeAnimationFromQueue}
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
        addAnimationsToQueueFunction={addAnimationsToQueue}
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
        removeAnimationFunction={removeAnimationFromQueue}
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
