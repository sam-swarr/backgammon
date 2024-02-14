import { FunctionComponent, useState } from "react";

import { endTurn } from "./store/currentPlayerSlice";
import { getAvailableDice } from "./store/dice";
import { rollDice } from "./store/diceSlice";
import {
  applyMoves,
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
  clearProvisionalMoves,
} from "./store/provisionalMovesSlice";
import { setShowGameOverDialog } from "./store/settingsSlice";
import {
  Color,
  GameBoardState,
  GameResult,
  MovementDirection,
  Player,
  ValidMove,
} from "./Types";
import Bar from "./Bar";
import BoardPoint from "./BoardPoint";
import Dice from "./Dice";
import Home from "./Home";
import { addAnimation, clearAnimation } from "./store/animationsSlice";
import { calculateTranslationOffsets } from "./store/animations";
import BeginGameButton from "./BeginGameButton";

type GameBoardProps = {
  currentPlayer: Player;
  playerOneColor: Color;
  playerTwoColor: Color;
  playerMovementDirection: MovementDirection;
};

const GameBoard: FunctionComponent<GameBoardProps> = ({
  currentPlayer,
  playerOneColor,
  playerTwoColor,
  playerMovementDirection,
}: GameBoardProps) => {
  const [
    dice,
    originalGameBoardState,
    gameState,
    highlightedMoves,
    provisionalMoves,
    animations,
  ] = useAppSelector((state) => [
    state.dice,
    state.gameBoard,
    state.gameState,
    state.highlightedMoves.moves,
    state.provisionalMoves,
    state.animations,
  ]);
  const dispatch = useAppDispatch();
  const [disableSubmitButton, setDisableSubmitButton] = useState(false);

  const availableDice = getAvailableDice(dice, provisionalMoves);

  const gameBoardState = provisionalMoves.reduce((prevBoardState, currMove) => {
    return applyMoveToGameBoardState(
      prevBoardState,
      currMove.move,
      currentPlayer
    );
  }, originalGameBoardState);

  // Check for game win here after applying provisional moves.
  const gameResult = didPlayerWin(gameBoardState, currentPlayer);
  switch (gameResult) {
    case GameResult.NotOver:
      break;

    case GameResult.PlayerWon:
      dispatch(setState({ newState: GameState.GameOver }));
      dispatch(setShowGameOverDialog(true));
      break;

    case GameResult.PlayerWonGammon:
      dispatch(setState({ newState: GameState.GameOverGammon }));
      dispatch(setShowGameOverDialog(true));
      break;

    case GameResult.PlayerWonBackgammon:
      dispatch(setState({ newState: GameState.GameOverBackgammon }));
      dispatch(setShowGameOverDialog(true));
      break;

    default:
      console.error("Unhandled GameResult: " + gameResult);
  }

  const topLeftPoints = [];
  const bottomLeftPoints = [];
  const topRightPoints = [];
  const bottomRightPoints = [];

  const boardPointClickHandler = (pointClicked: number | "BAR" | "HOME") => {
    if (gameState != GameState.PlayerMoving) {
      return true;
    }

    // Check if player clicked on a highlighted destination.
    const movesToApply = highlightedMoves.filter(
      (m) => m.move.to === pointClicked
    );
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

      dispatch(
        addAnimation({
          location: moveToApply.move.to,
          animation: calculateTranslationOffsets(
            gameBoardState,
            moveToApply.move,
            currentPlayer,
            playerMovementDirection
          ),
        })
      );

      if (moveToApply.isHit) {
        const otherPlayer =
          currentPlayer === Player.One ? Player.Two : Player.One;
        dispatch(
          addAnimation({
            location: "BAR",
            animation: calculateTranslationOffsets(
              gameBoardState,
              {
                from: moveToApply.move.to,
                to: "BAR",
              },
              otherPlayer,
              playerMovementDirection
            ),
          })
        );
      }
      dispatch(appendProvisionalMove(moveToApply));
      dispatch(clearHighlightedMoves());
      return true;
    } else if (pointClicked !== "HOME") {
      const possibleMoves: ValidMove[] = [];
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
    dispatch(
      applyMoves({
        moves: provisionalMoves,
        currentPlayer: currentPlayer,
      })
    );
    dispatch(clearProvisionalMoves());
    dispatch(clearHighlightedMoves());
    dispatch(endTurn());
    dispatch(rollDice());
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
          animations={animations.points[i]}
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
          animations={animations.points[i]}
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
          animations={animations.points[i]}
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
          animations={animations.points[i]}
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
          animations={animations.points[i]}
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
          animations={animations.points[i]}
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
          animations={animations.points[i]}
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
          animations={animations.points[i]}
        />
      );
    }
  }

  const home = (
    <Home
      homeState={gameBoardState.homeState}
      isHighlighted={highlightedMoves.some((m) => m.move.to === "HOME")}
      clickHandler={boardPointClickHandler}
      currentPlayer={currentPlayer}
      playerOneColor={playerOneColor}
      playerTwoColor={playerTwoColor}
      playerOneAnimations={animations.HOME.filter(
        (animation) => animation.owner === Player.One
      )}
      playerTwoAnimations={animations.HOME.filter(
        (animation) => animation.owner === Player.Two
      )}
    />
  );

  let beginGameButton =
    gameState == GameState.GameWaitingToBegin ? (
      <BeginGameButton
        beginGameHandler={() => {
          dispatch(setState({ newState: GameState.CoinFlip }));
        }}
      />
    ) : null;

  let diceComponent =
    gameState == GameState.GameWaitingToBegin ? null : (
      <Dice
        currentPlayerColor={
          currentPlayer === Player.One ? playerOneColor : playerTwoColor
        }
        availableDice={availableDice}
        diceValues={dice}
        canSubmit={
          !disableSubmitButton &&
          areProvisionalMovesSubmittable(
            originalGameBoardState,
            dice,
            currentPlayer,
            provisionalMoves
          )
        }
        provisionalGameBoardState={gameBoardState}
        submitButtonHandler={submitButtonHandler}
      />
    );

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
        playerOneAnimations={animations.BAR.filter(
          (animation) => animation.owner === Player.One
        )}
        playerTwoAnimations={animations.BAR.filter(
          (animation) => animation.owner === Player.Two
        )}
        highlightedMoves={highlightedMoves}
      />
      <div className="Game-board-half">
        {beginGameButton}
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
