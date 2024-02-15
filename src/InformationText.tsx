import { FunctionComponent } from "react";
import { Player } from "./Types";
import { useAppSelector } from "./store/hooks";
import { GameState } from "./store/gameStateSlice";

const InformationText: FunctionComponent = () => {
  const [currentPlayer, gameState] = useAppSelector((state) => [
    state.currentPlayer,
    state.gameState,
  ]);

  let text = "";

  switch (gameState) {
    case GameState.GameWaitingToBegin:
      text = "Welcome to Backgammon!";
      break;
    case GameState.PlayerRolling:
    case GameState.PlayerMoving:
      text =
        currentPlayer === Player.One
          ? "Player One's Turn"
          : "Player Two's Turn";
      break;
  }

  return (
    <div className={"Information-text-wrapper"}>
      <div className={"Information-text"}>{text}</div>
    </div>
  );
};

export default InformationText;
