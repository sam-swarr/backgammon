import React, { FunctionComponent } from "react";

import Checker from './Checker';
import {Color, Player, PointState} from './Types';

type BoardPointProps = {
  pointState: PointState,
  location: "TOP" | "BOTTOM",
  playerOneColor: Color,
  playerTwoColor: Color,
  pointNumber: number,
};

const BoardPoint: FunctionComponent<BoardPointProps> = ({
  pointState,
  location,
  playerOneColor,
  playerTwoColor,
  pointNumber,
}: BoardPointProps) => {
  if (pointState[Player.One] > 0 && pointState[Player.Two] > 0) {
    console.error("Invalid PointState on point " + pointNumber);
    console.error(pointState);
  }

  const occupyingPlayer = pointState[Player.One] > pointState[Player.Two] ? Player.One : Player.Two;
  const checkerCount = pointState[Player.One] > pointState[Player.Two] ? pointState[Player.One] : pointState[Player.Two];

  const checkers = [];
  for (let i = 0; i < checkerCount; i++) {
    const color = occupyingPlayer === Player.One ?
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