import React from "react";
import PropTypes from "prop-types";

import {COLORS, MOVEMENT_DIRECTION, PLAYERS} from './Constants';
import BoardPoint from './BoardPoint';

export default class GameBoard extends React.Component {
  static propTypes = {
    gameBoardState: PropTypes.array.isRequired,
    playerOneColor: PropTypes.oneOf(Object.values(COLORS)).isRequired,
    playerTwoColor: PropTypes.oneOf(Object.values(COLORS)).isRequired,
    playerMovementDirection: PropTypes.oneOf(Object.values(MOVEMENT_DIRECTION)).isRequired,
  };

  constructor(props) {
    super(props);

    for (let i = 0; i < this.props.gameBoardState.length; i++) {
      const currentPoint = this.props.gameBoardState[i];
      if (currentPoint.player === PLAYERS.NOBODY) {
        if (currentPoint.count !== 0) {
          console.warn("Invalid board state. Non-zero number of checkers on NOBODY point.");
          console.warn(this.props.gameBoardState);
        }
      } else {
        if (currentPoint.count <= 0) {
          console.warn("Invalid board state. Non-positive number of checkers on PLAYER point.");
          console.warn(this.props.gameBoardState);
        }
      }
    }
  }

  render() {
    const topLeftPoints = [];
    const bottomLeftPoints = [];
    const topRightPoints = [];
    const bottomRightPoints = [];
    if (this.props.playerMovementDirection === MOVEMENT_DIRECTION.COUNTERCLOCKWISE) {
      for (let i = 12; i <= 17; i++) {
        topLeftPoints.push(
          <BoardPoint
            key={i}
            checkerInfo={this.props.gameBoardState[i]}
            location={"TOP"}
            playerOneColor={this.props.playerOneColor}
            playerTwoColor={this.props.playerTwoColor}
            pointNumber={i} />
        );
      }
      for (let i = 11; i >= 6; i--) {
        bottomLeftPoints.push(
          <BoardPoint
            key={i}
            checkerInfo={this.props.gameBoardState[i]}
            location={"BOTTOM"}
            playerOneColor={this.props.playerOneColor}
            playerTwoColor={this.props.playerTwoColor}
            pointNumber={i} />
        );
      }
      for (let i = 18; i <= 23; i++) {
        topRightPoints.push(
          <BoardPoint
            key={i}
            checkerInfo={this.props.gameBoardState[i]}
            location={"TOP"}
            playerOneColor={this.props.playerOneColor}
            playerTwoColor={this.props.playerTwoColor}
            pointNumber={i} />
        );
      }
      for (let i = 5; i >= 0; i--) {
        bottomRightPoints.push(
          <BoardPoint
            key={i}
            checkerInfo={this.props.gameBoardState[i]}
            location={"BOTTOM"}
            playerOneColor={this.props.playerOneColor}
            playerTwoColor={this.props.playerTwoColor}
            pointNumber={i} />
        );
      }
    } else {

    }

    return (
      <div className="Game-board-wrapper">
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
        <div className="Game-board-home">

        </div>
      </div>
    );
  }
}