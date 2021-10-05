import React, { FunctionComponent } from "react";

import {Color} from './Types';

type CheckerProps = {
  color: Color,
};

const Checker: FunctionComponent<CheckerProps> = ({ color }: CheckerProps) => {
  const colorClass = color === Color.White ? "white" : "black";
  return (
      <div className={"Checker " + colorClass}  />
  );
}

export default Checker;