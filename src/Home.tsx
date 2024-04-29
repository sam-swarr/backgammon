import { FunctionComponent } from "react";
import cx from "classnames";

import Checker, { CheckerStatus } from "./Checker";
import { Color, MovementDirection, Player, PointState } from "./Types";
import { Animation } from "./Animations";
import { useAppSelector } from "./store/hooks";
import DoublingCube from "./DoublingCube";

type HomeProps = {
  homeState: PointState;
  isHighlighted: boolean;
  clickHandler: Function;
  currentPlayer: Player;
  playerOneColor: Color;
  playerTwoColor: Color;
  currAnimations: Animation[];
  onAnimationComplete: (id: number) => void;
  checkerPulse: boolean;
  playerMovementDirection: MovementDirection;
  playerPerspective: Player;
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
  checkerPulse,
  playerMovementDirection,
  playerPerspective,
}: HomeProps) => {
  const [doublingCubeData] = useAppSelector((state) => [state.doublingCube]);

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
        checkerPulse={checkerPulse}
        status={CheckerStatus.None}
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
        checkerPulse={checkerPulse}
        status={CheckerStatus.None}
        onAnimationComplete={onAnimationComplete}
        animation={anim}
      />
    );
  }

  let doublingCube = null;
  if (doublingCubeData.owner === null) {
    doublingCube = <DoublingCube />;
  }

  return (
    <div
      className={cx("Game-board-home", {
        cw:
          (playerPerspective === Player.One &&
            playerMovementDirection === MovementDirection.Clockwise) ||
          (playerPerspective === Player.Two &&
            playerMovementDirection === MovementDirection.CounterClockwise),
      })}
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
      <div className="Game-board-home-spacer">{doublingCube}</div>
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
