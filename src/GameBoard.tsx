import { FunctionComponent } from 'react';

import { endTurn } from './store/currentPlayerSlice';
import { getAvailableDice } from './store/dice';
import { rollDice } from './store/diceSlice';
import { applyMoves, applyMoveToGameBoardState } from './store/gameBoardSlice';
import { clearHighlightedMoves, setHighlightedMoves } from './store/highlightedMovesSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { areProvisionalMovesSubmittable, getMoveIfValid } from './store/moves';
import { appendProvisionalMove, clearProvisionalMoves } from './store/provisionalMovesSlice';
import {Color, MovementDirection, Player, ValidMove} from './Types';
import Bar from './Bar';
import BoardPoint from './BoardPoint';
import Dice from './Dice';

type GameBoardProps = {
  currentPlayer: Player,
  playerOneColor: Color,
  playerTwoColor: Color,
  playerMovementDirection: MovementDirection,
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
    highlightedMoves,
    provisionalMoves,
  ]= useAppSelector((state) => [
    state.dice,
    state.gameBoard,
    state.highlightedMoves.moves,
    state.provisionalMoves,
  ]);
  const dispatch = useAppDispatch();

  const availableDice = getAvailableDice(
    dice,
    provisionalMoves,
  );

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
    const moveToApply = highlightedMoves.find(m => m.move.to === pointClicked);
    if (moveToApply != null) {
      dispatch(appendProvisionalMove(moveToApply));
      dispatch(clearHighlightedMoves());
    } else {
      const possibleMoves: ValidMove[] = [];
      const seenDieValues = new Set();
      for (let i = 0; i < availableDice.length; i++) {
        if (!seenDieValues.has(availableDice[i])) {
          const possibleMove = getMoveIfValid(
            gameBoardState,
            pointClicked,
            availableDice[i],
            currentPlayer,
          );
          if (possibleMove !== null) {
            possibleMoves.push(possibleMove);
          }
        }
        seenDieValues.add(availableDice[i]);
      }
      dispatch(setHighlightedMoves({
        lastPointClicked: pointClicked,
        moves: possibleMoves,
      }));
    }
  };

  const submitButtonHandler = () => {
    dispatch(applyMoves({
      moves: provisionalMoves,
      currentPlayer: currentPlayer,
    }));
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
      <Bar
        barState={gameBoardState.barState}
        clickHandler={boardPointClickHandler}
        playerOneColor={playerOneColor}
        playerTwoColor={playerTwoColor} />
      <div className="Game-board-half">
        <Dice
          currentPlayerColor={currentPlayer === Player.One ? playerOneColor : playerTwoColor}
          diceValues={dice}
          hasProvisionalMoves={provisionalMoves.length > 0}
          canSubmit={areProvisionalMovesSubmittable(
            originalGameBoardState,
            dice,
            currentPlayer,
            provisionalMoves,
          )}
          submitButtonHandler={submitButtonHandler} />
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