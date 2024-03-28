import { FunctionComponent, useContext } from "react";
import { useAppSelector } from "./store/hooks";
import { ActionsContext, LocalGameActions } from "./ActionsContext";
import { getClientPlayer, isCurrentPlayer } from "./Utils";
import { GameState } from "./store/gameStateSlice";
import { Player } from "./Types";

const OfferDoubleButton: FunctionComponent = () => {
  const [gameState, players, currentPlayer, doublingCubeData] = useAppSelector(
    (state) => [
      state.gameState,
      state.players,
      state.currentPlayer,
      state.doublingCube,
    ]
  );
  const actions = useContext(ActionsContext);

  // Return early here since further logic requires `players` data
  // to be fully set, which won't occur until these states have been
  // reached.
  if (
    gameState !== GameState.PlayerRolling &&
    gameState !== GameState.PlayerOfferingDouble
  ) {
    return null;
  }

  let showOfferDoubleButton = false;
  if (actions instanceof LocalGameActions) {
    showOfferDoubleButton =
      doublingCubeData.owner === null ||
      doublingCubeData.owner === currentPlayer;
  } else {
    showOfferDoubleButton =
      isCurrentPlayer(players, currentPlayer, actions) &&
      (doublingCubeData.owner === null ||
        doublingCubeData.owner === getClientPlayer(players));
  }

  let showAcceptDoubleMenu = false;
  if (actions instanceof LocalGameActions) {
    showAcceptDoubleMenu = true;
  } else {
    showAcceptDoubleMenu = !isCurrentPlayer(players, currentPlayer, actions);
  }

  if (gameState === GameState.PlayerRolling && showOfferDoubleButton) {
    return (
      <div className={"Offer-double-button-wrapper"}>
        <button
          className={"Offer-double-button"}
          onClick={async () => {
            await actions.offerDoubleButtonClicked();
          }}
        >
          Double x2
        </button>
      </div>
    );
  } else if (
    gameState === GameState.PlayerOfferingDouble &&
    showAcceptDoubleMenu
  ) {
    return (
      <div className={"Accept-double-menu-wrapper"}>
        <button
          className={"Forfeit-game-button"}
          onClick={async () => {
            await actions.forfeitButtonClicked();
          }}
        >
          Forfeit
        </button>
        <button
          className={"Accept-double-button"}
          onClick={async () => {
            const newOwner =
              currentPlayer === Player.One ? Player.Two : Player.One;
            await actions.acceptDoubleButtonClicked(
              newOwner,
              doublingCubeData.gameStakes * 2
            );
          }}
        >
          Accept
        </button>
      </div>
    );
  } else {
    return null;
  }
};

export default OfferDoubleButton;