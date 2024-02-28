import { FunctionComponent, useState } from "react";
import cx from "classnames";

import Checker from "./Checker";
import { Color, ValidMove, Player, PointState } from "./Types";
import { Animation } from "./Animations";

type BoardPointProps = {
  pointState: PointState;
  location: "TOP" | "BOTTOM";
  playerOneColor: Color;
  playerTwoColor: Color;
  pointNumber: number;
  clickHandler: (fromPoint: number | "BAR") => boolean;
  highlightedMoves: ValidMove[];
  currAnimations: Animation[];
  removeAnimationFunction: (id: number) => void;
};

const BoardPoint: FunctionComponent<BoardPointProps> = ({
  pointState,
  location,
  playerOneColor,
  playerTwoColor,
  pointNumber,
  clickHandler,
  highlightedMoves,
  currAnimations,
  removeAnimationFunction,
}: BoardPointProps) => {
  if (pointState[Player.One] > 0 && pointState[Player.Two] > 0) {
    console.error("Invalid PointState on point " + pointNumber);
    console.error(pointState);
  }
  const [showNoMoveHighlight, setShowNoMoveHighlight] = useState(false);

  const occupyingPlayer =
    pointState[Player.One] > pointState[Player.Two] ? Player.One : Player.Two;
  const checkerCount =
    pointState[Player.One] > pointState[Player.Two]
      ? pointState[Player.One]
      : pointState[Player.Two];

  const checkers = [];
  for (let i = 0; i < checkerCount; i++) {
    const color =
      occupyingPlayer === Player.One ? playerOneColor : playerTwoColor;

    let anim = currAnimations.find((a) => {
      return a.location === pointNumber && a.checkerNumber === i + 1;
    });

    checkers.push(
      <Checker
        // It's important to include the color here in the key. If not, when a checker hits another checker,
        // the checker doing the hit is essentially replacing the hit checker in the dom. Without including
        // the color in the key, React recycles the same element to render, which causes a bug in the checker
        // animations since the component never unmounts/remounts so the CSSTransition component doesn't properly
        // invoke the onEnter callbacks again.
        key={i + color}
        color={color}
        animation={anim}
        removeAnimationFunction={removeAnimationFunction}
      />
    );
  }

  const topOrBottomClass = {
    top: location === "TOP",
    bottom: location === "BOTTOM",
  };

  let highlight = null;
  const isHighlightedFromPoint = highlightedMoves.some(
    (highlightedMove: ValidMove) => highlightedMove.move.from === pointNumber
  );
  const isHighlightedToPoint = highlightedMoves.some(
    (highlightedMove: ValidMove) => highlightedMove.move.to === pointNumber
  );
  if (isHighlightedFromPoint || isHighlightedToPoint || showNoMoveHighlight) {
    highlight = (
      <div
        className={cx("Point-wrapper-highlight", {
          ...topOrBottomClass,
          from: isHighlightedFromPoint,
          to: isHighlightedToPoint,
          noMove: showNoMoveHighlight,
        })}
      />
    );
  }

  return (
    <div
      className={cx("Point-wrapper", topOrBottomClass)}
      onClick={() => {
        const result = clickHandler(pointNumber);
        if (!result) {
          setShowNoMoveHighlight(true);
          setTimeout(() => {
            setShowNoMoveHighlight(false);
          }, 1000);
        }
      }}
    >
      <div className={cx("Checkers-wrapper", topOrBottomClass)}>{checkers}</div>
      {highlight}
      <div
        className={cx("Point-triangle", {
          ...topOrBottomClass,
          even: pointNumber % 2 === 0,
          odd: pointNumber % 2 !== 0,
        })}
      />
    </div>
  );
};

export default BoardPoint;
