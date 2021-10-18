import React, { FunctionComponent } from 'react';

import { applyMoveToGameBoardState } from './store/gameBoardSlice';
import { clearHighlightedMoves, setHighlightedMoves } from './store/highlightedMovesSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { getMoveIfValid } from './store/moves';
import { appendProvisionalMove } from './store/provisionalMovesSlice';
import {Color, Move, MovementDirection, Player} from './Types';
import BoardPoint from './BoardPoint';
import Dice from './Dice';

type GameBoardProps = {
  currentPlayer: Player,
  dice: number[],
  playerOneColor: Color,
  playerTwoColor: Color,
  playerMovementDirection: MovementDirection,
};

const GameBoard: FunctionComponent<GameBoardProps> = ({
  currentPlayer,
  dice,
  playerOneColor,
  playerTwoColor,
  playerMovementDirection,
}: GameBoardProps) => {
  const [
    originalGameBoardState,
    highlightedMoves,
    provisionalMoves,
  ]= useAppSelector((state) => [
    state.gameBoard,
    state.highlightedMoves.moves,
    state.provisionalMoves,
  ]);
  const dispatch = useAppDispatch();

  const gameBoardState = provisionalMoves.reduce((prevBoardState, currMove) => {
    return applyMoveToGameBoardState(
      prevBoardState,
      currMove,
      currentPlayer,
    );
  }, originalGameBoardState);

  const topLeftPoints = [];
  const bottomLeftPoints = [];
  const topRightPoints = [];
  const bottomRightPoints = [];

  const boardPointClickHandler = (pointClicked: number | "BAR") => {
    // Check if player clicked on a highlighted destination.
    const moveToApply = highlightedMoves.find(move => move.to === pointClicked);
    if (moveToApply != null) {
      dispatch(appendProvisionalMove(moveToApply));
      dispatch(clearHighlightedMoves());
    } else {
      const possibleMoves: Move[] = [];
      const seenDieValues = new Set();
      for (let i = 0; i < dice.length; i++) {
        if (!seenDieValues.has(dice[i])) {
          const possibleMove = getMoveIfValid(
            gameBoardState,
            pointClicked,
            dice[i],
            currentPlayer,
          );
          if (possibleMove !== null) {
            possibleMoves.push(possibleMove);
          }
        }
        seenDieValues.add(dice[i]);
      }
      dispatch(setHighlightedMoves({
        lastPointClicked: pointClicked,
        moves: possibleMoves,
      }));
    }
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
          pointNumber={i} />
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
          pointNumber={i} />
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
          pointNumber={i} />
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
          pointNumber={i} />
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
          pointNumber={i} />
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
          pointNumber={i} />
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
          pointNumber={i} />
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
          pointNumber={i} />
      );
    }
  }

  let leftHome = null;
  if (playerMovementDirection === MovementDirection.Clockwise) {
    leftHome = <div className="Game-board-home" />;
  }

  let rightHome = null;
  if (playerMovementDirection === MovementDirection.CounterClockwise) {
    rightHome = <div className="Game-board-home" />;
  }

  return (
    <div className="Game-board-wrapper">
      {leftHome}
      <div className="Game-board-half">
        <div className="Game-board-quadrant top">
          {topLeftPoints}
        </div>
        <div className="Game-board-quadrant bottom">
          {bottomLeftPoints}
        </div>
      </div>
      <div className="Game-board-bar">

      </div>
      <div className="Game-board-half">
        <Dice
          currentPlayerColor={currentPlayer === Player.One ? playerOneColor : playerTwoColor}
          diceValues={dice} />
        <div className="Game-board-quadrant top">
          {topRightPoints}
        </div>
        <div className="Game-board-quadrant bottom">
          {bottomRightPoints}
        </div>
      </div>
      {rightHome}
    </div>
  );
}

export default GameBoard;