import cx from "classnames";
import { FunctionComponent, useContext } from "react";
import { ActionsContext, LocalGameActions } from "./ActionsContext";
import Checker, { CheckerStatus } from "./Checker";
import { Color, MovementDirection, Player } from "./Types";
import { useAppSelector } from "./store/hooks";
import { pipCount } from "./store/gameBoardSlice";
import DoublingCube from "./DoublingCube";
import { GameState } from "./store/gameStateSlice";

export enum PlayerCardSide {
  Top = "TOP",
  Bottom = "BOTTOM",
}

type PlayerCardProps = {
  side: PlayerCardSide;
  playerPerspective: Player;
};

const PlayerCard: FunctionComponent<PlayerCardProps> = ({
  side,
  playerPerspective,
}: PlayerCardProps) => {
  const [gameBoardState, settings, currentPlayer, doublingCubeData, gameState] =
    useAppSelector((state) => [
      state.gameBoard,
      state.settings,
      state.currentPlayer,
      state.doublingCube,
      state.gameState,
    ]);
  let actions = useContext(ActionsContext);

  let playerOneColor = settings.playerOneColor;
  let playerTwoColor =
    playerOneColor === Color.White ? Color.Black : Color.White;

  let doublingCube = null;

  let playerName = "";
  let pips = 167;
  let color = Color.Black;
  if (side === PlayerCardSide.Bottom) {
    if (actions instanceof LocalGameActions) {
      playerName = playerPerspective === Player.One ? "Player 1" : "Player 2";
    } else {
      playerName = "You";
    }
    pips = pipCount(gameBoardState, playerPerspective);
    color = playerPerspective === Player.One ? playerOneColor : playerTwoColor;
    if (doublingCubeData.owner === playerPerspective) {
      doublingCube = <DoublingCube />;
    }
  } else {
    if (actions instanceof LocalGameActions) {
      playerName = playerPerspective === Player.One ? "Player 2" : "Player 1";
    } else {
      playerName = "Opponent";
    }
    pips = pipCount(
      gameBoardState,
      playerPerspective === Player.One ? Player.Two : Player.One
    );
    color = playerPerspective === Player.Two ? playerOneColor : playerTwoColor;
    if (
      doublingCubeData.owner !== null &&
      doublingCubeData.owner !== playerPerspective
    ) {
      doublingCube = <DoublingCube />;
    }
  }

  let playerScore = 0;

  return (
    <div
      className={cx("Player-card-wrapper", {
        bottom: side === PlayerCardSide.Bottom,
        cw:
          (settings.movementDirection === MovementDirection.Clockwise &&
            playerPerspective === Player.One) ||
          (settings.movementDirection === MovementDirection.CounterClockwise &&
            playerPerspective === Player.Two),
        current:
          (gameState === GameState.PlayerMoving ||
            gameState === GameState.PlayerOfferingDouble ||
            gameState === GameState.PlayerRolling) &&
          ((side === PlayerCardSide.Bottom &&
            currentPlayer === playerPerspective) ||
            (side === PlayerCardSide.Top &&
              currentPlayer !== playerPerspective)),
      })}
    >
      <div className={"Player-card-checker-wrapper"}>
        <Checker
          color={color}
          checkerPulse={false}
          status={CheckerStatus.None}
          onAnimationComplete={() => {}}
          animation={null}
        />
      </div>
      <div className={"Player-name-and-score-wrapper"}>
        <div className={"Player-name-wrapper"}>{playerName}</div>
        <div className={"Player-score-wrapper"}>
          <div className={"Player-pip-count-wrapper"}>{"Pips: " + pips}</div>
          <div className={"Player-points-wrapper"}>
            {"Points: " + playerScore}
          </div>
        </div>
      </div>
      <div className={"Player-card-doubling-cube-wrapper"}>{doublingCube}</div>
    </div>
  );
};

export default PlayerCard;
