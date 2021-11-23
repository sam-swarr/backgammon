import { FunctionComponent } from "react";
import Checker from "./Checker";
import { Color, Player, PointState } from './Types';

type BarProps = {
  barState: PointState,
  clickHandler: Function,
  playerOneColor: Color,
  playerTwoColor: Color,
};

const Bar: FunctionComponent<BarProps> = ({
  barState,
  clickHandler,
  playerOneColor,
  playerTwoColor,
}: BarProps) => {
  const playerOneCheckers = [];
  for (let i = 0; i < barState[Player.One]; i++) {
    playerOneCheckers.push(
      <Checker key={i} color={playerOneColor} location={"BAR"} />
    );
  }

  const playerTwoCheckers = [];
  for (let i = 0; i < barState[Player.Two]; i++) {
    playerTwoCheckers.push(
      <Checker key={i} color={playerTwoColor} location={"BAR"} />
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