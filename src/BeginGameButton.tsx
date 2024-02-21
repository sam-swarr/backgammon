import { FunctionComponent, useContext } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { GameState, setState } from "./store/gameStateSlice";
import { ActionsContext } from "./ActionsContext";

const BeginGameButton: FunctionComponent = () => {
  const gameState = useAppSelector((state) => state.gameState);
  const actions = useContext(ActionsContext);

  if (gameState === GameState.WaitingForPlayers) {
    return (
      <div className={"Begin-game-button-wrapper"}>
        Waiting For Opponent To Join...
      </div>
    );
  } else if (gameState === GameState.WaitingToBegin) {
    return (
      <div className={"Begin-game-button-wrapper"}>
        <button
          className={"Begin-game-button"}
          onClick={() => {
            actions.setGameState(GameState.CoinFlip);
          }}
        >
          Begin Game
        </button>
      </div>
    );
  } else {
    return null;
  }
};

export default BeginGameButton;
