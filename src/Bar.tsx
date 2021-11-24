import { FunctionComponent } from "react";
import cx from "classnames";

import Checker from "./Checker";
import { Animation } from "./store/animationsSlice";
import { Color, Player, PointState, ValidMove } from './Types';

type BarProps = {
  barState: PointState,
  clickHandler: Function,
  currentPlayer: Player,
  playerOneColor: Color,
  playerTwoColor: Color,
  playerOneAnimations: Animation[],
  playerTwoAnimations: Animation[],
  highlightedMoves: ValidMove[],
};

const Bar: FunctionComponent<BarProps> = ({
  barState,
  clickHandler,
  currentPlayer,
  playerOneColor,
  playerTwoColor,
  playerOneAnimations,
  playerTwoAnimations,
  highlightedMoves,
}: BarProps) => {
  const playerOneCheckers = [];
  for (let i = 0; i < barState[Player.One]; i++) {
    const animationForCurrentChecker = playerOneAnimations.find((animation) => animation.checkerNumber === i + 1);
    playerOneCheckers.push(
      <Checker key={i} color={playerOneColor} location={"BAR"} animation={animationForCurrentChecker} />
    );
  }

  const playerTwoCheckers = [];
  for (let i = 0; i < barState[Player.Two]; i++) {
    const animationForCurrentChecker = playerTwoAnimations.find((animation) => animation.checkerNumber === i + 1);
    playerTwoCheckers.push(
      <Checker key={i} color={playerTwoColor} location={"BAR"} animation={animationForCurrentChecker} />
    );
  }

  const isHighlighted = highlightedMoves.some((highlightedMove: ValidMove) => highlightedMove.move.from === "BAR");

  return (
    <div className="Game-board-bar" onClick={() => {clickHandler("BAR")}}>
      <div className={cx("Player-one-bar-checkers", {
        highlight: isHighlighted && currentPlayer === Player.One,
      })}>
        {playerOneCheckers}
      </div>
      <div className="Game-board-bar-spacer" />
      <div className={cx("Player-two-bar-checkers", {
        highlight: isHighlighted && currentPlayer === Player.Two,
      })}>
        {playerTwoCheckers}
      </div>
    </div>
  );
}

export default Bar;