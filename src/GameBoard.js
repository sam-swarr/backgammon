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
    if (this.props.playerMovementDirection == MOVEMENT_DIRECTION.COUNTERCLOCKWISE) {
      for (let i = 12; i <= 17; i++) {
        topLeftPoints.push(
          <BoardPoint pointNumber={i} />
        );
      }
    }

    return (
      <div className="Game-board-wrapper">
        <div className="Game-board-half">
          <div className="Game-board-quadrant top">
            {topLeftPoints}
          </div>
          <div className="Game-board-quadrant bottom">
            <BoardPoint pointNumber={11} />
            <BoardPoint pointNumber={10} />
            <BoardPoint pointNumber={9} />
            <BoardPoint pointNumber={8} />
            <BoardPoint pointNumber={7} />
            <BoardPoint pointNumber={6} />
          </div>
        </div>
        <div className="Game-board-bar">

        </div>
        <div className="Game-board-half">
          <div className="Game-board-quadrant top">
            <BoardPoint pointNumber={18} />
            <BoardPoint pointNumber={19} />
            <BoardPoint pointNumber={20} />
            <BoardPoint pointNumber={21} />
            <BoardPoint pointNumber={22} />
            <BoardPoint pointNumber={23} />
          </div>
          <div className="Game-board-quadrant bottom">
            <BoardPoint pointNumber={5} />
            <BoardPoint pointNumber={4} />
            <BoardPoint pointNumber={3} />
            <BoardPoint pointNumber={2} />
            <BoardPoint pointNumber={1} />
            <BoardPoint pointNumber={0} />
          </div>
        </div>
        <div className="Game-board-home">

        </div>
      </div>
    );
  }
}