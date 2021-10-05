import React, { FunctionComponent } from "react";

import Checker from './Checker';
import {Color, Player, PointState} from './Types';

type BoardPointProps = {
  checkerInfo: PointState,
  location: "TOP" | "BOTTOM",
  playerOneColor: Color,
  playerTwoColor: Color,
  pointNumber: number,
};

const BoardPoint: FunctionComponent<BoardPointProps> = ({
  checkerInfo,
  location,
  playerOneColor,
  playerTwoColor,
  pointNumber,
}: BoardPointProps) => {
  const checkers = [];
  for (let i = 0; i < checkerInfo.count; i++) {
    const color = checkerInfo.player === Player.One ?
      playerOneColor : playerTwoColor;

    checkers.push(
      <Checker key={i} color={color} />
    );
  }

  const topOrBottom = location === "TOP" ? "top" : "bottom";
  const evenOrOdd = pointNumber % 2 === 0 ? "even" : "odd";

  return (
    <div className={"Point-wrapper " + topOrBottom}>
      <div className={"Checkers-wrapper " + topOrBottom}>
        {checkers}
      </div>
      <div className={"Point-triangle " + topOrBottom + " " + evenOrOdd}/>
    </div>
  );
}

export default BoardPoint;