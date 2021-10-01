import React from "react";
import PropTypes from "prop-types";

import {COLORS, PLAYERS} from './Constants';

export default class BoardPoint extends React.Component {
  static propTypes = {
    checkerInfo: PropTypes.shape({
      player: PropTypes.oneOf(Object.values(PLAYERS)),
      count: PropTypes.number
    }),
    playerColor: PropTypes.oneOf(Object.values(COLORS)),
    playerID: PropTypes.oneOf([PLAYERS.ONE, PLAYERS.TWO]),
    pointNumber: PropTypes.number,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Point-wrapper">
        {this.props.pointNumber + 1}
      </div>
    );
  }
}