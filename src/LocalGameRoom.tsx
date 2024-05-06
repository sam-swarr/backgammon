import { FunctionComponent, useState } from "react";

import { useAppDispatch, useAppSelector } from "./store/hooks";
import { ActionsContext, LocalGameActions } from "./ActionsContext";
import GameRoom from "./GameRoom";
import { Player } from "./Types";
import SettingsMenuButton from "./SettingsMenuButton";
import {
  default as MatchSettingsMenu,
  MatchPointValue,
} from "./MatchSettingsMenu";

const LocalGameRoom: FunctionComponent = () => {
  const [settings] = useAppSelector((state) => [state.settings]);
  const dispatch = useAppDispatch();

  const [matchPointsValue, setMatchPointsValue] = useState<MatchPointValue>(5);
  const [enableDoubling, setEnableDoubling] = useState(true);

  let contents = null;
  if (settings.showMatchSetupScreen) {
    contents = (
      <MatchSettingsMenu
        matchPointsValue={matchPointsValue}
        enableDoubling={enableDoubling}
        onMatchPointsChanged={(newValue) => setMatchPointsValue(newValue)}
        onEnableDoublingChanged={(enabled) => setEnableDoubling(enabled)}
        roomCode={null}
      />
    );
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
