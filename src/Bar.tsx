import { FunctionComponent } from "react";

import Checker, { CheckerStatus } from "./Checker";
import { Animation } from "./Animations";
import { Color, Move, Player, PointState } from "./Types";
import { LastPointClicked } from "./store/lastPointClickedSlice";

type BarProps = {
  barState: PointState;
  clickHandler: Function;
  currentPlayer: Player;
  playerOneColor: Color;
  playerTwoColor: Color;
  currAnimations: Animation[];
  onAnimationComplete: (id: number) => void;
  allPossibleMoves: Move[];
  lastPointClicked: LastPointClicked;
};

const Bar: FunctionComponent<BarProps> = ({
  barState,
  clickHandler,
  currentPlayer,
  playerOneColor,
  playerTwoColor,
  currAnimations,
  onAnimationComplete,
  allPossibleMoves,
  lastPointClicked,
}: BarProps) => {
  const isSelected = lastPointClicked.point === "BAR";
  const isHighlighted =
    lastPointClicked.point === -1 &&
    allPossibleMoves.some((move: Move) => move.from === "BAR");

  const playerOneCheckers = [];
  for (let i = 0; i < barState[Player.One]; i++) {
    let anim = currAnimations.find((a) => {
      return (
        a.location === "BAR" &&
        a.checkerOwner === Player.One &&
        a.checkerNumber === i + 1
      );
    });

    let status = CheckerStatus.None;
    if (i === barState[Player.One] - 1 && currentPlayer === Player.One) {
      if (isSelected) {
        status = CheckerStatus.Selected;
      } else if (isHighlighted) {
        status = CheckerStatus.Highlighted;
      }
    }

    playerOneCheckers.push(
      <Checker
        key={i}
        color={playerOneColor}
        status={status}
        onAnimationComplete={onAnimationComplete}
        animation={anim}
      />
    );
  }

  const playerTwoCheckers = [];
  for (let i = 0; i < barState[Player.Two]; i++) {
    let anim = currAnimations.find((a) => {
      return (
        a.location === "BAR" &&
        a.checkerOwner === Player.Two &&
        a.checkerNumber === i + 1
      );
    });

    let status = CheckerStatus.None;
    if (i === barState[Player.Two] - 1 && currentPlayer === Player.Two) {
      if (isSelected) {
        status = CheckerStatus.Selected;
      } else if (isHighlighted) {
        status = CheckerStatus.Highlighted;
      }
    }

    playerTwoCheckers.push(
      <Checker
        key={i}
        color={playerTwoColor}
        status={status}
        onAnimationComplete={onAnimationComplete}
        animation={anim}
      />
    );
  }

  return (
    <div
      className="Game-board-bar"
      onClick={() => {
        clickHandler("BAR");
      }}
    >
      <div className={"Player-one-bar-checkers"}>{playerOneCheckers}</div>
      <div className="Game-board-bar-spacer" />
      <div className={"Player-two-bar-checkers"}>{playerTwoCheckers}</div>
    </div>
  );
};

export default Bar;
