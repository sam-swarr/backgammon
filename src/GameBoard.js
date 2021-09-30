import React from "react";
import PropTypes from "prop-types";
import {COLORS, MOVEMENT_DIRECTION} from './Constants';

export default class GameBoard extends React.Component {
  static propTypes = {
    gameBoardState: PropTypes.array,
    playerColor: PropTypes.oneOf(Object.values(COLORS)),
    playerMovementDirection: PropTypes.oneOf(Object.values(MOVEMENT_DIRECTION)),
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Game-board-wrapper">
        Backgammon
      </div>
    );
  }
}