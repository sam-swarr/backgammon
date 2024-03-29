import { FunctionComponent, useState } from "react";
import cx from "classnames";

import Checker, { CheckerStatus } from "./Checker";
import { Color, Move, Player, PointState } from "./Types";
import { Animation } from "./Animations";
import { LastPointClicked } from "./store/lastPointClickedSlice";

type BoardPointProps = {
  pointState: PointState;
  location: "TOP" | "BOTTOM";
  playerOneColor: Color;
  playerTwoColor: Color;
  pointNumber: number;
  clickHandler: (fromPoint: number | "BAR") => boolean;
  allPossibleInitialMoves: Move[];
  allPossibleMoveSetsFromSelectedPoint: Move[][];
  lastPointClicked: LastPointClicked;
  currAnimations: Animation[];
  onAnimationComplete: (id: number) => void;
};

const BoardPoint: FunctionComponent<BoardPointProps> = ({
  pointState,
  location,
  playerOneColor,
  playerTwoColor,
  pointNumber,
  clickHandler,
  allPossibleInitialMoves,
  allPossibleMoveSetsFromSelectedPoint,
  lastPointClicked,
  currAnimations,
  onAnimationComplete,
}: BoardPointProps) => {
  if (pointState[Player.One] > 0 && pointState[Player.Two] > 0) {
    console.error("Invalid PointState on point " + pointNumber);
    console.error(pointState);
  }
  const [showNoMoveHighlight, setShowNoMoveHighlight] = useState(false);

  const topOrBottomClass = {
    top: location === "TOP",
    bottom: location === "BOTTOM",
  };

  let highlight = null;
  const isHighlightedToPoint =
    lastPointClicked.point !== -1 &&
    allPossibleMoveSetsFromSelectedPoint.some(
      (moveSet: Move[]) =>
        moveSet[moveSet.length - 1].to === pointNumber &&
        moveSet[0].from === lastPointClicked.point
    );
  if (isHighlightedToPoint || showNoMoveHighlight) {
    highlight = (
      <div
        className={cx("Point-wrapper-highlight", {
          ...topOrBottomClass,
          to: isHighlightedToPoint,
          noMove: showNoMoveHighlight,
        })}
      />
    );
  }

  const isSelectedFromPoint = lastPointClicked.point === pointNumber;
  const isHighlightedFromPoint =
    lastPointClicked.point === -1 &&
    allPossibleInitialMoves.some((move: Move) => move.from === pointNumber);

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

    let status = CheckerStatus.None;
    if (i === checkerCount - 1) {
      if (isSelectedFromPoint) {
        status = CheckerStatus.Selected;
      } else if (isHighlightedFromPoint) {
        status = CheckerStatus.Highlighted;
      }
    }

    checkers.push(
      <Checker
        // It's important to include the color here in the key. If not, when a checker hits another checker,
        // the checker doing the hit is essentially replacing the hit checker in the dom. Without including
        // the color in the key, React recycles the same element to render, which causes a bug in the checker
        // animations since the component never unmounts/remounts so the CSSTransition component doesn't properly
        // invoke the onEnter callbacks again.
        key={i + color}
        color={color}
        status={status}
        animation={anim}
        onAnimationComplete={onAnimationComplete}
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
