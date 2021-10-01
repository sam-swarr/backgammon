import React from "react";
import PropTypes from "prop-types";

import {COLORS, PLAYERS} from './Constants';
import Checker from './Checker';

export default class BoardPoint extends React.Component {
  static propTypes = {
    checkerInfo: PropTypes.shape({
      player: PropTypes.oneOf(Object.values(PLAYERS)),
      count: PropTypes.number
    }).isRequired,
    location: PropTypes.oneOf(["TOP", "BOTTOM"]).isRequired,
    playerOneColor: PropTypes.oneOf(Object.values(COLORS)).isRequired,
    playerTwoColor: PropTypes.oneOf(Object.values(COLORS)).isRequired,
    pointNumber: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const checkers = [];
    for (let i = 0; i < this.props.checkerInfo.count; i++) {
      const color = this.props.checkerInfo.player === PLAYERS.ONE ?
        this.props.playerOneColor : this.props.playerTwoColor;

      checkers.push(
        <Checker key={i} color={color} />
      );
    }

    const topOrBottom = this.props.location === "TOP" ? "top" : "bottom";
    const evenOrOdd = this.props.pointNumber % 2 === 0 ? "even" : "odd";

    return (
      <div className={"Point-wrapper " + topOrBottom}>
        <div className={"Checkers-wrapper " + topOrBottom}>
          {checkers}
        </div>
        <div className={"Point-triangle " + topOrBottom + " " + evenOrOdd}/>
      </div>
    );
  }
}