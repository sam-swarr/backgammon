import { FunctionComponent, useContext, useEffect, useState } from "react";
import cx from "classnames";

import { getAvailableDice } from "./store/dice";
import {
  applyMoveToGameBoardState,
  didPlayerWin,
  setGameBoardState,
} from "./store/gameBoardSlice";
import { GameState } from "./store/gameStateSlice";
import {
  clearLastPointClicked,
  setLastPointClicked,
} from "./store/lastPointClickedSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  areProvisionalMovesSubmittable,
  getAllMoveSetsFromStartingPoint,
  getAllPossibleMovesForDice,
  getInverseMove,
} from "./store/moves";
import { appendProvisionalMove } from "./store/provisionalMovesSlice";
import { setShowGameOverDialog } from "./store/settingsSlice";
import { Color, GameResult, Move, MovementDirection, Player } from "./Types";
import Bar from "./Bar";
import BoardPoint, { BoardPointLocation } from "./BoardPoint";
import Dice from "./Dice";
import Home from "./Home";
import { Animation, createAnimationData } from "./Animations";
import BeginGameButton from "./BeginGameButton";
import OpeningDiceRoll from "./OpeningDiceRoll";
import { isCurrentPlayer, isGameOverState } from "./Utils";
import { ActionsContext } from "./ActionsContext";
import {
  dequeueAnimatableMove,
  enqueueAnimatableMoves,
} from "./store/animatableMovesSlice";
import RollButton from "./RollButton";
import OfferDoubleButton from "./OfferDoubleButton";
import { CHECKER_ANIMATION_PULSE_TIMER_MS } from "./Constants";
import { MatchScore } from "./store/matchScoreSlice";

enum BoardQuadrants {
  TopLeft = "TOP_LEFT",
  TopRight = "TOP_RIGHT",
  BottomLeft = "BOTTOM_LEFT",
  BottomRight = "BOTTOM_RIGHT",
}

const BOARD_POINT_LAYOUTS = {
  [Player.One]: {
    [MovementDirection.CounterClockwise]: {
      [BoardQuadrants.TopLeft]: {
        start: 12,
        end: 17,
        increment: 1,
      },
      [BoardQuadrants.TopRight]: {
        start: 18,
        end: 23,
        increment: 1,
      },
      [BoardQuadrants.BottomLeft]: {
        start: 11,
        end: 6,
        increment: -1,
      },
      [BoardQuadrants.BottomRight]: {
        start: 5,
        end: 0,
        increment: -1,
      },
    },
    [MovementDirection.Clockwise]: {
      [BoardQuadrants.TopLeft]: {
        start: 23,
        end: 18,
        increment: -1,
      },
      [BoardQuadrants.TopRight]: {
        start: 17,
        end: 12,
        increment: -1,
      },
      [BoardQuadrants.BottomLeft]: {
        start: 0,
        end: 5,
        increment: 1,
      },
      [BoardQuadrants.BottomRight]: {
        start: 6,
        end: 11,
        increment: 1,
      },
    },
  },
  [Player.Two]: {
    [MovementDirection.CounterClockwise]: {
      [BoardQuadrants.TopLeft]: {
        start: 0,
        end: 5,
        increment: 1,
      },
      [BoardQuadrants.TopRight]: {
        start: 6,
        end: 11,
        increment: 1,
      },
      [BoardQuadrants.BottomLeft]: {
        start: 23,
        end: 18,
        increment: -1,
      },
      [BoardQuadrants.BottomRight]: {
        start: 17,
        end: 12,
        increment: -1,
      },
    },
    [MovementDirection.Clockwise]: {
      [BoardQuadrants.TopLeft]: {
        start: 11,
        end: 6,
        increment: -1,
      },
      [BoardQuadrants.TopRight]: {
        start: 5,
        end: 0,
        increment: -1,
      },
      [BoardQuadrants.BottomLeft]: {
        start: 12,
        end: 17,
        increment: 1,
      },
      [BoardQuadrants.BottomRight]: {
        start: 18,
        end: 23,
        increment: 1,
      },
    },
  },
};

type GameBoardProps = {
  playerPerspective: Player;
};

const GameBoard: FunctionComponent<GameBoardProps> = ({
  playerPerspective,
}: GameBoardProps) => {
  const [
    currentPlayer,
    settings,
    diceData,
    originalGameBoardState,
    gameState,
    lastPointClicked,
    provisionalMoves,
    players,
    animatableMoves,
    matchScore,
    doublingCubeData,
    readyForNextGameData,
  ] = useAppSelector((state) => [
    state.currentPlayer,
    state.settings,
    state.dice,
    state.gameBoard,
    state.gameState,
    state.lastPointClicked,
    state.provisionalMoves,
    state.players,
    state.animatableMoves,
    state.matchScore,
    state.doublingCube,
    state.readyForNextGame,
  ]);
  const actions = useContext(ActionsContext);

  const playerOneColor = settings.playerOneColor;
  const playerTwoColor =
    settings.playerOneColor === Color.White ? Color.Black : Color.White;
  const playerMovementDirection = settings.movementDirection;

  const dispatch = useAppDispatch();
  const [disableSubmitButton, setDisableSubmitButton] = useState(false);
  const [disableHighlightedMoves, setDisableHighlightedMoves] = useState(false);
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

    // Check to see if the move that just finished animating causes the game to end.
    const gameResult = didPlayerWin(gameBoardState, currentPlayer);
    if (gameResult === GameResult.NotOver) {
      return;
    } else {
      // If this is the client of the winning player, call the gameOver action which will
      // write the changes to the DB and display the gameOver dialog locally for the winning
      // player.
      if (isCurrentPlayer(players, currentPlayer, actions)) {
        let winningGameState = GameState.GameOver;
        let multiplier = 1;
        if (gameResult === GameResult.PlayerWonGammon) {
          winningGameState = GameState.GameOverGammon;
          multiplier = 2;
        } else if (gameResult === GameResult.PlayerWonBackgammon) {
          winningGameState = GameState.GameOverBackgammon;
          multiplier = 3;
        }

        const pointsWon =
          (doublingCubeData.enabled ? doublingCubeData.gameStakes : 1) *
          multiplier;

        const newMatchScore: MatchScore = {
          [Player.One]:
            matchScore[Player.One] +
            (currentPlayer === Player.One ? pointsWon : 0),
          [Player.Two]:
            matchScore[Player.Two] +
            (currentPlayer === Player.Two ? pointsWon : 0),
          pointsRequiredToWin: matchScore.pointsRequiredToWin,
        };

        actions.gameOver(
          gameBoardState,
          winningGameState,
          newMatchScore,
          currentPlayer === Player.One ? Player.Two : Player.One,
          provisionalMoves
        );
      }
      // Else this is the client of the losing player. Now that the animations are complete,
      // show the gameOver dialog.
      else {
        dispatch(setShowGameOverDialog(true));
      }
    }
  };

  if (currAnimatableMove != null && currAnimations.length === 0) {
    setCurrAnimations(
      createAnimationData(
        originalGameBoardState,
        currAnimatableMove,
        playerMovementDirection,
        playerPerspective
      )
    );
  }

  const availableDice = getAvailableDice(
    diceData.currentRoll,
    provisionalMoves
  );

  // Setup listener to display warning dialog if user tries to navigate away.
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Trigger confirmation dialog before navigating away.
      event.preventDefault();
      // Included for legacy support
      event.returnValue = true;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Setup checker pulse animation timer
  const [checkerPulse, setCheckerPulse] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setCheckerPulse(!checkerPulse);
    }, CHECKER_ANIMATION_PULSE_TIMER_MS);
    return () => clearInterval(interval);
  }, [checkerPulse]);

  // Check if game is over and both players are ready for next game
  useEffect(() => {
    if (
      actions.isHostClient() &&
      isGameOverState(gameState) &&
      readyForNextGameData[Player.One] &&
      readyForNextGameData[Player.Two]
    ) {
      actions.bothPlayersReadyForNextGame();
    }
  }, [actions, gameState, readyForNextGameData]);

  const isPlayerActivelyMoving =
    gameState === GameState.PlayerMoving &&
    isCurrentPlayer(players, currentPlayer, actions);

  let allPossibleInitialMoves: Move[] = [];
  let allPossibleMoveSetsFromSelectedPoint: Move[][] = [];

  if (
    isPlayerActivelyMoving &&
    currAnimatableMove === null &&
    !disableHighlightedMoves
  ) {
    if (lastPointClicked.point === -1) {
      allPossibleInitialMoves = getAllPossibleMovesForDice(
        gameBoardState,
        availableDice,
        currentPlayer
      );
    } else if (lastPointClicked.point !== -1) {
      allPossibleMoveSetsFromSelectedPoint = getAllMoveSetsFromStartingPoint(
        gameBoardState,
        availableDice,
        lastPointClicked.point,
        currentPlayer
      );
    }
  }

  const boardPointClickHandler = (
    pointClicked: number | "BAR" | "HOME"
  ): boolean => {
    // Disable click handler if it's not a player's turn or if the client is not
    // the current player.
    if (!isPlayerActivelyMoving) {
      return true;
    }

    // Filter out the move sets whose first move begins on the last point clicked and
    // whose final move ends on the point currently being clicked.
    const moveSetsToApply = allPossibleMoveSetsFromSelectedPoint.filter(
      (moveSet: Move[]) =>
        moveSet[0].from === lastPointClicked.point &&
        moveSet[moveSet.length - 1].to === pointClicked
    );
    if (moveSetsToApply.length > 0) {
      // There may be multiple potential move sets to apply in the case where
      // one or both dice can bear a checker off. If this is the case, find the
      // moveset that uses the fewest dice. Or if all potential movesets are the
      // same length, use the one that uses the biggest die.
      let moveSetToApply = moveSetsToApply[0];
      for (let i = 1; i < moveSetsToApply.length; i++) {
        if (moveSetsToApply[i].length < moveSetToApply.length) {
          moveSetToApply = moveSetsToApply[i];
        } else if (moveSetsToApply[i].length === moveSetToApply.length) {
          let maxDieUsedInMoveSet = moveSetToApply.reduce(
            (prevMaxDie, currMove) =>
              prevMaxDie > currMove.dieUsed ? prevMaxDie : currMove.dieUsed,
            0
          );
          let maxDieUsedInCurrMoveSet = moveSetsToApply[i].reduce(
            (prevMaxDie, currMove) =>
              prevMaxDie > currMove.dieUsed ? prevMaxDie : currMove.dieUsed,
            0
          );
          if (maxDieUsedInCurrMoveSet > maxDieUsedInMoveSet) {
            moveSetToApply = moveSetsToApply[i];
          }
        }
      }
      moveSetToApply.forEach((move) => dispatch(appendProvisionalMove(move)));
      dispatch(enqueueAnimatableMoves(moveSetToApply));
      dispatch(clearLastPointClicked());
      return true;
    } else if (pointClicked !== "HOME") {
      let hasMovesFromPoint = allPossibleInitialMoves.some(
        (move) => move.from === pointClicked
      );
      if (hasMovesFromPoint) {
        dispatch(setLastPointClicked({ point: pointClicked }));
      } else {
        dispatch(clearLastPointClicked());
        // Don't show red no-move highlight if player is just unselected last clicked point.
        if (pointClicked === lastPointClicked.point) {
          return true;
        }
      }
      return hasMovesFromPoint;
    }
    return false;
  };

  const submitButtonHandler = async () => {
    // Temporarily prevent the submit button from showing up to avoid it
    // appearing immediately when dice are still rolling when there are no
    // legal moves.
    setDisableSubmitButton(true);
    setTimeout(() => {
      setDisableSubmitButton(false);
    }, 1300);
    await actions.submitMoves(
      gameBoardState,
      currentPlayer === Player.One ? Player.Two : Player.One,
      provisionalMoves
    );
  };

  const topLeftPoints: Array<React.ReactNode> = [];
  const bottomLeftPoints: Array<React.ReactNode> = [];
  const topRightPoints: Array<React.ReactNode> = [];
  const bottomRightPoints: Array<React.ReactNode> = [];

  const pointsState = gameBoardState.pointsState;
  let layoutData =
    BOARD_POINT_LAYOUTS[playerPerspective][playerMovementDirection];

  let topLeftData = layoutData[BoardQuadrants.TopLeft];
  for (
    let i = topLeftData.start;
    i !== topLeftData.end + topLeftData.increment;
    i += topLeftData.increment
  ) {
    topLeftPoints.push(
      <BoardPoint
        key={i}
        pointState={pointsState[i]}
        clickHandler={boardPointClickHandler}
        allPossibleInitialMoves={allPossibleInitialMoves}
        allPossibleMoveSetsFromSelectedPoint={
          allPossibleMoveSetsFromSelectedPoint
        }
        lastPointClicked={lastPointClicked}
        location={BoardPointLocation.Top}
        playerOneColor={playerOneColor}
        playerTwoColor={playerTwoColor}
        pointNumber={i}
        currAnimations={currAnimations}
        onAnimationComplete={onAnimationComplete}
        checkerPulse={checkerPulse}
      />
    );
  }

  let topRightData = layoutData[BoardQuadrants.TopRight];
  for (
    let i = topRightData.start;
    i !== topRightData.end + topRightData.increment;
    i += topRightData.increment
  ) {
    topRightPoints.push(
      <BoardPoint
        key={i}
        pointState={pointsState[i]}
        clickHandler={boardPointClickHandler}
        allPossibleInitialMoves={allPossibleInitialMoves}
        allPossibleMoveSetsFromSelectedPoint={
          allPossibleMoveSetsFromSelectedPoint
        }
        lastPointClicked={lastPointClicked}
        location={BoardPointLocation.Top}
        playerOneColor={playerOneColor}
        playerTwoColor={playerTwoColor}
        pointNumber={i}
        currAnimations={currAnimations}
        onAnimationComplete={onAnimationComplete}
        checkerPulse={checkerPulse}
      />
    );
  }

  let bottomLeftData = layoutData[BoardQuadrants.BottomLeft];
  for (
    let i = bottomLeftData.start;
    i !== bottomLeftData.end + bottomLeftData.increment;
    i += bottomLeftData.increment
  ) {
    bottomLeftPoints.push(
      <BoardPoint
        key={i}
        pointState={pointsState[i]}
        clickHandler={boardPointClickHandler}
        allPossibleInitialMoves={allPossibleInitialMoves}
        allPossibleMoveSetsFromSelectedPoint={
          allPossibleMoveSetsFromSelectedPoint
        }
        lastPointClicked={lastPointClicked}
        location={BoardPointLocation.Bottom}
        playerOneColor={playerOneColor}
        playerTwoColor={playerTwoColor}
        pointNumber={i}
        currAnimations={currAnimations}
        onAnimationComplete={onAnimationComplete}
        checkerPulse={checkerPulse}
      />
    );
  }

  let bottomRightData = layoutData[BoardQuadrants.BottomRight];
  for (
    let i = bottomRightData.start;
    i !== bottomRightData.end + bottomRightData.increment;
    i += bottomRightData.increment
  ) {
    bottomRightPoints.push(
      <BoardPoint
        key={i}
        pointState={pointsState[i]}
        clickHandler={boardPointClickHandler}
        allPossibleInitialMoves={allPossibleInitialMoves}
        allPossibleMoveSetsFromSelectedPoint={
          allPossibleMoveSetsFromSelectedPoint
        }
        lastPointClicked={lastPointClicked}
        location={BoardPointLocation.Bottom}
        playerOneColor={playerOneColor}
        playerTwoColor={playerTwoColor}
        pointNumber={i}
        currAnimations={currAnimations}
        onAnimationComplete={onAnimationComplete}
        checkerPulse={checkerPulse}
      />
    );
  }

  const home = (
    <Home
      homeState={gameBoardState.homeState}
      isHighlighted={allPossibleMoveSetsFromSelectedPoint.some(
        (moveSet: Move[]) => moveSet[moveSet.length - 1].to === "HOME"
      )}
      clickHandler={boardPointClickHandler}
      currentPlayer={currentPlayer}
      playerOneColor={playerOneColor}
      playerTwoColor={playerTwoColor}
      currAnimations={currAnimations}
      onAnimationComplete={onAnimationComplete}
      checkerPulse={checkerPulse}
      playerMovementDirection={playerMovementDirection}
      playerPerspective={playerPerspective}
    />
  );

  const onRollButtonClicked = () => {
    // Prevent highlights on possible moves from appearing
    // until after the dice have finished animating.
    setDisableHighlightedMoves(true);
    setTimeout(() => {
      setDisableHighlightedMoves(false);
    }, 1300);
  };

  let diceComponent = null;
  if (gameState === GameState.CoinFlip) {
    diceComponent = <OpeningDiceRoll />;
  } else if (gameState === GameState.PlayerMoving) {
    let canSubmitMoves = false;
    // Check that we're not currently animating a series of moves right now since we don't
    // want to unwind the provisional gameboard state until we've finished applying the
    // queue of moves.
    if (currAnimatableMove === null) {
      // Unwind the provisional moves to reconstruct the game board state
      // before there were any provisional moves so that we can validate
      // that the provisional move set is legal to submit.
      let gameBoardStateBeforeProvisionalMoves = gameBoardState;
      for (let i = provisionalMoves.length - 1; i >= 0; i--) {
        gameBoardStateBeforeProvisionalMoves = applyMoveToGameBoardState(
          gameBoardStateBeforeProvisionalMoves,
          getInverseMove(provisionalMoves[i])
        );
      }
      canSubmitMoves =
        !disableSubmitButton &&
        areProvisionalMovesSubmittable(
          gameBoardStateBeforeProvisionalMoves,
          diceData.currentRoll,
          currentPlayer,
          provisionalMoves
        );
    }

    diceComponent = (
      <Dice
        currentPlayerColor={
          currentPlayer === Player.One ? playerOneColor : playerTwoColor
        }
        availableDice={availableDice}
        diceValues={diceData.currentRoll}
        canSubmit={canSubmitMoves}
        submitButtonHandler={submitButtonHandler}
      />
    );
  } else {
    diceComponent = null;
  }

  return (
    <div className="Game-board-wrapper">
      {(playerPerspective === Player.One &&
        playerMovementDirection === MovementDirection.Clockwise) ||
      (playerPerspective === Player.Two &&
        playerMovementDirection === MovementDirection.CounterClockwise)
        ? home
        : null}
      <div
        className={cx("Game-board-half left", {
          cw:
            (playerPerspective === Player.One &&
              playerMovementDirection === MovementDirection.Clockwise) ||
            (playerPerspective === Player.Two &&
              playerMovementDirection === MovementDirection.CounterClockwise),
        })}
      >
        <OfferDoubleButton />
        <div className="Game-board-quadrant top">{topLeftPoints}</div>
        <div className="Game-board-quadrant bottom">{bottomLeftPoints}</div>
      </div>
      <Bar
        barState={gameBoardState.barState}
        checkerPulse={checkerPulse}
        clickHandler={boardPointClickHandler}
        currentPlayer={currentPlayer}
        playerOneColor={playerOneColor}
        playerTwoColor={playerTwoColor}
        currAnimations={currAnimations}
        onAnimationComplete={onAnimationComplete}
        allPossibleMoves={allPossibleInitialMoves}
        lastPointClicked={lastPointClicked}
      />
      <div
        className={cx("Game-board-half right", {
          cw:
            (playerPerspective === Player.One &&
              playerMovementDirection === MovementDirection.Clockwise) ||
            (playerPerspective === Player.Two &&
              playerMovementDirection === MovementDirection.CounterClockwise),
        })}
      >
        <BeginGameButton />
        <RollButton onRollButtonClicked={onRollButtonClicked} />
        {diceComponent}
        <div className="Game-board-quadrant top">{topRightPoints}</div>
        <div className="Game-board-quadrant bottom">{bottomRightPoints}</div>
      </div>
      {(playerPerspective === Player.One &&
        playerMovementDirection === MovementDirection.CounterClockwise) ||
      (playerPerspective === Player.Two &&
        playerMovementDirection === MovementDirection.Clockwise)
        ? home
        : null}
    </div>
  );
};

export default GameBoard;
