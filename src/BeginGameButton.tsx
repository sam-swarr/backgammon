import { FunctionComponent, useContext } from "react";
import { useAppSelector } from "./store/hooks";
import { GameState } from "./store/gameStateSlice";
import { ActionsContext } from "./ActionsContext";

const BeginGameButton: FunctionComponent = () => {
  const [gameState, players] = useAppSelector((state) => [
    state.gameState,
    state.players,
  ]);
  const actions = useContext(ActionsContext);

  if (gameState === GameState.WaitingForPlayers) {
    return (
      <div className={"Begin-game-button-wrapper"}>
        Waiting For Opponent To Join...
      </div>
    );
  } else if (gameState === GameState.WaitingToBegin) {
    if (actions.isHostClient()) {
      return (
        <div className={"Begin-game-button-wrapper"}>
          <button
            className={"Begin-game-button"}
            onClick={() => {
              actions.beginCoinFlip();
            }}
          >
            Begin Game
          </button>
        </div>
      );
    } else {
      return (
        <div className={"Begin-game-button-wrapper"}>
          Waiting For Host To Begin Game...
        </div>
      );
    }
  } else {
    return null;
  }
};

export default BeginGameButton;
