import { FunctionComponent } from "react";

import { useAppDispatch, useAppSelector } from "./store/hooks";
import { ActionsContext, LocalGameActions } from "./ActionsContext";
import GameRoom from "./GameRoom";
import { Player } from "./Types";
import SettingsMenuButton from "./SettingsMenuButton";
import MatchSettingsMenu from "./MatchSettingsMenu";

const LocalGameRoom: FunctionComponent = () => {
  const [settings] = useAppSelector((state) => [state.settings]);
  const dispatch = useAppDispatch();

  if (settings.showMatchSetupScreen) {
    return <MatchSettingsMenu />;
  } else {
    return (
      <ActionsContext.Provider value={new LocalGameActions(dispatch)}>
        <SettingsMenuButton />
        <GameRoom playerPerspective={Player.One} />
      </ActionsContext.Provider>
    );
  }
};

export default LocalGameRoom;
