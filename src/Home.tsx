import { FunctionComponent } from "react";
import cx from "classnames";

import Checker from "./Checker";
import { Color, Player, PointState } from "./Types";
import { Animation } from "./Animations";

type HomeProps = {
  homeState: PointState;
  isHighlighted: boolean;
  clickHandler: Function;
  currentPlayer: Player;
  playerOneColor: Color;
  playerTwoColor: Color;
  currAnimations: Animation[];
  onAnimationComplete: (id: number) => void;
};

const Home: FunctionComponent<HomeProps> = ({
  homeState,
  isHighlighted,
  clickHandler,
  currentPlayer,
  playerOneColor,
  playerTwoColor,
  currAnimations,
  onAnimationComplete,
}: HomeProps) => {
  const playerOneCheckers = [];
  for (let i = 0; i < homeState[Player.One]; i++) {
    let anim = currAnimations.find((a) => {
      return (
        a.location === "HOME" &&
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
  for (let i = 0; i < homeState[Player.Two]; i++) {
    let anim = currAnimations.find((a) => {
      return (
        a.location === "HOME" &&
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

  return (
    <div
      className="Game-board-home"
      onClick={() => {
        clickHandler("HOME");
      }}
    >
      <div
        className={cx("Player-two-home-checkers", {
          highlighted: isHighlighted && currentPlayer === Player.Two,
        })}
      >
        {playerTwoCheckers}
      </div>
      <div className="Game-board-home-spacer" />
      <div
        className={cx("Player-one-home-checkers", {
          highlighted: isHighlighted && currentPlayer === Player.One,
        })}
      >
        {playerOneCheckers}
      </div>
    </div>
  );
};

export default Home;
