import React from "react";
import PropTypes from "prop-types";

import {COLORS} from './Constants';

function Checker({ color }) {

  const colorClass = color === COLORS.WHITE ? "white" : "black";

  return (
      <div className={"Checker " + colorClass}  />
  );
}

Checker.propTypes = {
  color: PropTypes.oneOf(Object.values(COLORS)),
};

export default Checker;