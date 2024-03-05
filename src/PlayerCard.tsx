import { FunctionComponent, useContext } from "react";
import { ActionsContext, LocalGameActions } from "./ActionsContext";
import Checker from "./Checker";
import { Color, Player } from "./Types";
import { useAppSelector } from "./store/hooks";
import { pipCount } from "./store/gameBoardSlice";
import { isHostClient } from "./Utils";

export enum PlayerCardSide {
  Left = "LEFT",
  Right = "RIGHT",
}

type PlayerCardProps = {
  side: PlayerCardSide;
};

const PlayerCard: FunctionComponent<PlayerCardProps> = ({
  side,
}: PlayerCardProps) => {
  const [gameBoardState, settings, players] = useAppSelector((state) => [
    state.gameBoard,
    state.settings,
    state.players,
  ]);
  let actions = useContext(ActionsContext);

  let playerName = "";
  let pips = 167;
  let color = Color.Black;
  if (side === PlayerCardSide.Left) {
    if (actions instanceof LocalGameActions) {
      playerName = "Player 1";
    } else {
      playerName = isHostClient(players, actions) ? "You" : "Opponent";
    }
    pips = pipCount(gameBoardState, Player.One);
    color = settings.playerOneColor;
  } else {
    if (actions instanceof LocalGameActions) {
      playerName = "Player 2";
    } else {
      playerName = isHostClient(players, actions) ? "Opponent" : "You";
    }
    pips = pipCount(gameBoardState, Player.Two);
    color = settings.playerOneColor === Color.Black ? Color.White : Color.Black;
  }

  let playerScore = 0;

  return (
    <div className={"Player-card-wrapper"}>
      <div className={"Player-card-checker-wrapper"}>
        <Checker
          color={color}
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
