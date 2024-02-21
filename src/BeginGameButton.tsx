import { FunctionComponent } from "react";
import { useAppSelector } from "./store/hooks";
import { GameState } from "./store/gameStateSlice";

type BeginGameButtonProps = {
  beginGameHandler: Function;
};

const BeginGameButton: FunctionComponent<BeginGameButtonProps> = ({
  beginGameHandler,
}: BeginGameButtonProps) => {
  const gameState = useAppSelector((state) => state.gameState);
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
            beginGameHandler();
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
