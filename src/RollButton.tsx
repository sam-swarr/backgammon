import { FunctionComponent, useContext } from "react";
import { useAppSelector } from "./store/hooks";
import { ActionsContext } from "./ActionsContext";
import { isCurrentPlayer } from "./Utils";
import { GameState } from "./store/gameStateSlice";

type RollButtonProps = {
  onRollButtonClicked: Function;
};

const RollButton: FunctionComponent<RollButtonProps> = ({
  onRollButtonClicked,
}: RollButtonProps) => {
  const [gameState, players, currentPlayer] = useAppSelector((state) => [
    state.gameState,
    state.players,
    state.currentPlayer,
  ]);
  const actions = useContext(ActionsContext);

  if (
    gameState !== GameState.PlayerRolling ||
    !isCurrentPlayer(players, currentPlayer, actions)
  ) {
    return null;
  } else {
    return (
      <div className={"Roll-button-wrapper"}>
        <button
          className={"Roll-button"}
          onClick={async () => {
            onRollButtonClicked();
            await actions.rollButtonClicked();
          }}
        >
          Roll Dice
        </button>
      </div>
    );
  }
};

export default RollButton;
