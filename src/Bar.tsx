import { FunctionComponent } from "react";
import cx from "classnames";

import Checker from "./Checker";
import { Animation } from "./Animations";
import { Color, Move, Player, PointState } from "./Types";

type BarProps = {
  barState: PointState;
  clickHandler: Function;
  currentPlayer: Player;
  playerOneColor: Color;
  playerTwoColor: Color;
  currAnimations: Animation[];
  onAnimationComplete: (id: number) => void;
  highlightedMoves: Move[];
};

const Bar: FunctionComponent<BarProps> = ({
  barState,
  clickHandler,
  currentPlayer,
  playerOneColor,
  playerTwoColor,
  currAnimations,
  onAnimationComplete,
  highlightedMoves,
}: BarProps) => {
  const playerOneCheckers = [];
  for (let i = 0; i < barState[Player.One]; i++) {
    let anim = currAnimations.find((a) => {
      return (
        a.location === "BAR" &&
        a.checkerOwner === Player.One &&
        a.checkerNumber === i + 1
      );
    });
    playerOneCheckers.push(
      <Checker
        key={i}
        color={playerOneColor}
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
    playerTwoCheckers.push(
      <Checker
        key={i}
        color={playerTwoColor}
        onAnimationComplete={onAnimationComplete}
        animation={anim}
      />
    );
  }

  const isHighlighted = highlightedMoves.some(
    (highlightedMove: Move) => highlightedMove.from === "BAR"
  );

  return (
    <div
      className="Game-board-bar"
      onClick={() => {
        clickHandler("BAR");
      }}
    >
      <div
        className={cx("Player-one-bar-checkers", {
          highlight: isHighlighted && currentPlayer === Player.One,
        })}
      >
        {playerOneCheckers}
      </div>
      <div className="Game-board-bar-spacer" />
      <div
        className={cx("Player-two-bar-checkers", {
          highlight: isHighlighted && currentPlayer === Player.Two,
        })}
      >
        {playerTwoCheckers}
      </div>
    </div>
  );
};

export default Bar;
