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

  let contents = null;
  if (settings.showMatchSetupScreen) {
    contents = <MatchSettingsMenu showUrl={false} />;
  } else {
    contents = (
      <div>
        <SettingsMenuButton />
        <GameRoom playerPerspective={Player.One} />
      </div>
    );
  }
  return (
    <ActionsContext.Provider value={new LocalGameActions(dispatch)}>
      {contents}
    </ActionsContext.Provider>
  );
};

export default LocalGameRoom;
