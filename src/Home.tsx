import { FunctionComponent } from "react";
import cx from "classnames";

import Checker from "./Checker";
import { Color, Player, PointState } from './Types';

type HomeProps = {
  homeState: PointState,
  isHighlighted: boolean,
  clickHandler: Function,
  currentPlayer: Player,
  playerOneColor: Color,
  playerTwoColor: Color,
};

const Home: FunctionComponent<HomeProps> = ({
  homeState,
  isHighlighted,
  clickHandler,
  currentPlayer,
  playerOneColor,
  playerTwoColor,
}: HomeProps) => {
  const playerOneCheckers = [];
  for (let i = 0; i < homeState[Player.One]; i++) {
    playerOneCheckers.push(
      <Checker key={i} color={playerOneColor} location={"HOME"} />
    );
  }

  const playerTwoCheckers = [];
  for (let i = 0; i < homeState[Player.Two]; i++) {
    playerTwoCheckers.push(
      <Checker key={i} color={playerTwoColor} location={"HOME"} />
    );
  }

  return (
    <div className="Game-board-home" onClick={() => {clickHandler("HOME")}}>
      <div className={cx("Player-two-home-checkers", {
        "highlighted": isHighlighted && currentPlayer === Player.Two,
      })}>
        {playerTwoCheckers}
      </div> 
      <div className="Game-board-home-spacer" />
      <div className={cx("Player-one-home-checkers", {
        "highlighted": isHighlighted && currentPlayer === Player.One,
      })}>
        {playerOneCheckers}
      </div>
    </div>
  );
}

export default Home;