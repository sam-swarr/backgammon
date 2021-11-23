import { FunctionComponent } from "react";
import Checker from "./Checker";
import { Animation } from "./store/animationsSlice";
import { Color, Player, PointState } from './Types';

type BarProps = {
  barState: PointState,
  clickHandler: Function,
  playerOneColor: Color,
  playerTwoColor: Color,
  playerOneAnimations: Animation[],
  playerTwoAnimations: Animation[],
};

const Bar: FunctionComponent<BarProps> = ({
  barState,
  clickHandler,
  playerOneColor,
  playerTwoColor,
  playerOneAnimations,
  playerTwoAnimations
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

  return (
    <div className="Game-board-bar" onClick={() => {clickHandler("BAR")}}>
      <div className="Player-one-bar-checkers">
        {playerOneCheckers}
      </div>
      <div className="Game-board-bar-spacer" />
      <div className="Player-two-bar-checkers">
        {playerTwoCheckers}
      </div>
    </div>
  );
}

export default Bar;