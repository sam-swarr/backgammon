import PropTypes from "prop-types";
import React from "react";
import { useSelector } from 'react-redux'


import {COLORS, MOVEMENT_DIRECTION} from './Constants';
import BoardPoint from './BoardPoint';

function GameBoard({
  playerOneColor,
  playerTwoColor,
  playerMovementDirection,
}) {
  const gameBoardState = useSelector((state) => state.gameBoard);

  const topLeftPoints = [];
  const bottomLeftPoints = [];
  const topRightPoints = [];
  const bottomRightPoints = [];

  const pointsState = gameBoardState.pointsState;
  if (playerMovementDirection === MOVEMENT_DIRECTION.COUNTERCLOCKWISE) {
    for (let i = 12; i <= 17; i++) {
      topLeftPoints.push(
        <BoardPoint
          key={i}
          checkerInfo={pointsState[i]}
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
          checkerInfo={pointsState[i]}
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
          checkerInfo={pointsState[i]}
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
          checkerInfo={pointsState[i]}
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
          checkerInfo={pointsState[i]}
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
          checkerInfo={pointsState[i]}
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
          checkerInfo={pointsState[i]}
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
          checkerInfo={pointsState[i]}
          location={"BOTTOM"}
          playerOneColor={playerOneColor}
          playerTwoColor={playerTwoColor}
          pointNumber={i} />
      );
    }
  }

  let leftHome = null;
  if (playerMovementDirection === MOVEMENT_DIRECTION.CLOCKWISE) {
    leftHome = <div className="Game-board-home" />;
  }

  let rightHome = null;
  if (playerMovementDirection === MOVEMENT_DIRECTION.COUNTERCLOCKWISE) {
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

GameBoard.propTypes = {
  playerOneColor: PropTypes.oneOf(Object.values(COLORS)).isRequired,
  playerTwoColor: PropTypes.oneOf(Object.values(COLORS)).isRequired,
  playerMovementDirection: PropTypes.oneOf(Object.values(MOVEMENT_DIRECTION)).isRequired,
};

export default GameBoard;