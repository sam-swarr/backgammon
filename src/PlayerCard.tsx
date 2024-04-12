import cx from "classnames";
import { FunctionComponent, useContext } from "react";
import { ActionsContext, LocalGameActions } from "./ActionsContext";
import Checker, { CheckerStatus } from "./Checker";
import { Color, Player } from "./Types";
import { useAppSelector } from "./store/hooks";
import { pipCount } from "./store/gameBoardSlice";

export enum PlayerCardSide {
  Top = "TOP",
  Bottom = "BOTTOM",
}

type PlayerCardProps = {
  side: PlayerCardSide;
};

const PlayerCard: FunctionComponent<PlayerCardProps> = ({
  side,
}: PlayerCardProps) => {
  const [gameBoardState, settings] = useAppSelector((state) => [
    state.gameBoard,
    state.settings,
  ]);
  let actions = useContext(ActionsContext);

  let playerName = "";
  let pips = 167;
  let color = Color.Black;
  if (side === PlayerCardSide.Bottom) {
    if (actions instanceof LocalGameActions) {
      playerName = "Player 1";
    } else {
      playerName = actions.isHostClient() ? "You" : "Opponent";
    }
    pips = pipCount(gameBoardState, Player.One);
    color = settings.playerOneColor;
  } else {
    if (actions instanceof LocalGameActions) {
      playerName = "Player 2";
    } else {
      playerName = actions.isHostClient() ? "Opponent" : "You";
    }
    pips = pipCount(gameBoardState, Player.Two);
    color = settings.playerOneColor === Color.Black ? Color.White : Color.Black;
  }

  let playerScore = 0;

  return (
    <div
      className={cx("Player-card-wrapper", {
        bottom: side === PlayerCardSide.Bottom,
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
    </div>
  );
};

export default PlayerCard;
