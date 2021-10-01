import React from "react";
import PropTypes from "prop-types";
import {COLORS, MOVEMENT_DIRECTION, PLAYERS} from './Constants';

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
    return (
      <div className="Game-board-wrapper">
        <div className="Game-board-half">

        </div>
        <div className="Game-board-bar">

        </div>
        <div className="Game-board-half">

        </div>
        <div className="Game-board-home">

        </div>
      </div>
    );
  }
}