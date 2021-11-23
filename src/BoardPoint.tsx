import { FunctionComponent } from "react";
import cx from "classnames";

import Checker from './Checker';
import {Color, ValidMove, Player, PointState} from './Types';
import { useAppSelector } from "./store/hooks";

type BoardPointProps = {
  pointState: PointState,
  location: "TOP" | "BOTTOM",
  playerOneColor: Color,
  playerTwoColor: Color,
  pointNumber: number,
  clickHandler: (fromPoint: number | "BAR") => void,
  highlightedMoves: ValidMove[],
};

const BoardPoint: FunctionComponent<BoardPointProps> = ({
  pointState,
  location,
  playerOneColor,
  playerTwoColor,
  pointNumber,
  clickHandler,
  highlightedMoves,
}: BoardPointProps) => {
  const [
    animations
  ] = useAppSelector((state) => [
    state.animations
  ]);
  const animation = animations.find((a) => a.point === pointNumber);

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

    
    if (animation != null && i === checkerCount - 1) {
      checkers.push(
        <Checker key={i} color={color} animation={animation} />
      );
    } else {
      checkers.push(
        <Checker key={i} color={color} />
      );
    }
  }

  const topOrBottomClass = {
    "top": location === "TOP",
    "bottom": location === "BOTTOM",
  };

  let highlight = null;
  const isHighlightedFromPoint = highlightedMoves.some((highlightedMove: ValidMove) => highlightedMove.move.from === pointNumber);
  const isHighlightedToPoint = highlightedMoves.some((highlightedMove: ValidMove) => highlightedMove.move.to === pointNumber);
  if (isHighlightedFromPoint || isHighlightedToPoint) {
    highlight = <div className={cx("Point-wrapper-highlight", {
      ...topOrBottomClass,
      "from": isHighlightedFromPoint,
      "to": isHighlightedToPoint,
    })}/>;
  }

  return (
    <div className={cx("Point-wrapper", topOrBottomClass)} onClick={() => {clickHandler(pointNumber)}}>
      <div className={cx("Checkers-wrapper", topOrBottomClass)}>
        {checkers}
      </div>
      {highlight}
      <div className={cx("Point-triangle", {
        ...topOrBottomClass,
        "even": pointNumber % 2 === 0,
        "odd": pointNumber % 2 !== 0,
        })}/>
    </div>
  );
}

export default BoardPoint;