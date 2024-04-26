import { FunctionComponent, useContext } from "react";
import { useAppSelector } from "./store/hooks";
import { GameState } from "./store/gameStateSlice";
import { ActionsContext } from "./ActionsContext";

const BeginGameButton: FunctionComponent = () => {
  const [gameState] = useAppSelector((state) => [state.gameState]);
  const actions = useContext(ActionsContext);

  if (gameState === GameState.WaitingForPlayers) {
    return (
      <div className={"Begin-game-button-wrapper waiting-text"}>
        <div className={"Waiting-text-wrapper"}>
          Waiting for opponent to join
        </div>
        <div className={"Waiting-spinner"} />
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
        <div className={"Begin-game-button-wrapper waiting-text"}>
          <div className={"Waiting-text-wrapper"}>
            Waiting for host to begin game
          </div>
          <div className={"Waiting-spinner"} />
        </div>
      );
    }
  } else {
    return null;
  }
};

export default BeginGameButton;
