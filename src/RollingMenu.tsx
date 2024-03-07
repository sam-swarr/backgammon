import { FunctionComponent, useContext } from "react";
import { useAppSelector } from "./store/hooks";
import { ActionsContext } from "./ActionsContext";
import { isCurrentPlayer } from "./Utils";

type RollingMenuProps = {
  onRollButtonClicked: Function;
};

const RollingMenu: FunctionComponent<RollingMenuProps> = ({
  onRollButtonClicked,
}: RollingMenuProps) => {
  const [players, currentPlayer] = useAppSelector((state) => [
    state.players,
    state.currentPlayer,
  ]);
  const actions = useContext(ActionsContext);

  if (!isCurrentPlayer(players, currentPlayer, actions)) {
    return null;
  } else {
    return (
      <div className={"Rolling-menu-wrapper"}>
        <div className={"Double-button-wrapper"}>
          <button
            className={"Double-button"}
            onClick={() => {
              console.log("DOUBLE");
            }}
          >
            Double x2
          </button>
        </div>
        <div className={"Roll-button-wrapper"}>
          <button
            className={"Roll-button"}
            onClick={() => {
              onRollButtonClicked();
              actions.rollButtonClicked();
            }}
          >
            Roll Dice
          </button>
        </div>
      </div>
    );
  }
};

export default RollingMenu;
