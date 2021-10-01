import React from "react";
import PropTypes from "prop-types";

import {COLORS, PLAYERS} from './Constants';

export default class Checker extends React.Component {
  static propTypes = {
    color: PropTypes.oneOf(Object.values(COLORS)),
  };

  constructor(props) {
    super(props);
  }

  render() {
    const colorClass = this.props.color === COLORS.WHITE ? "white" : "black";
    return (
      <div className={"Checker " + colorClass}  />
    );
  }
}