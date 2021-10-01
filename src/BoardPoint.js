import React from "react";
import PropTypes from "prop-types";

export default class BoardPoint extends React.Component {
  static propTypes = {
    pointNumber: PropTypes.number,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Point-wrapper">

      </div>
    );
  }
}