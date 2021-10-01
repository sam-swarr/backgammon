import React from "react";
import PropTypes from "prop-types";

import {COLORS, MOVEMENT_DIRECTION, PLAYERS} from './Constants';
import BoardPoint from './BoardPoint';

export default class GameBoard extends React.Component {
  static propTypes = {
    gameBoardState: PropTypes.array,
    playerID: PropTypes.oneOf([PLAYERS.ONE, PLAYERS.TWO]),
    playerColor: PropTypes.oneOf(Object.values(COLORS)),
    playerMovementDirection: PropTypes.oneOf(Object.values(MOVEMENT_DIRECTION)),
  };

  constructor(props) {
    super(props);
  }

  render() {
    const topLeftPoints = [];
    const bottomLeftPoints = [];
    const topRightPoints = [];
    const bottomRightPoints = [];
    if (this.props.playerMovementDirection == MOVEMENT_DIRECTION.COUNTERCLOCKWISE) {
      for (let i = 12; i <= 17; i++) {
        topLeftPoints.push(
          <BoardPoint pointNumber={i} />
        );
      }
      for (let i = 11; i >= 6; i--) {
        bottomLeftPoints.push(
          <BoardPoint pointNumber={i} />
        );
      }
      for (let i = 18; i <= 23; i++) {
        topRightPoints.push(
          <BoardPoint pointNumber={i} />
        );
      }
      for (let i = 5; i >= 0; i--) {
        bottomRightPoints.push(
          <BoardPoint pointNumber={i} />
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