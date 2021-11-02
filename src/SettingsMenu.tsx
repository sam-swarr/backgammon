import { FunctionComponent } from 'react';

import { GameState, setState } from './store/gameStateSlice';
import { useAppDispatch } from './store/hooks';

type SettingsMenuProps = {};

const SettingsMenu: FunctionComponent<SettingsMenuProps> = () => {

  const dispatch = useAppDispatch();

  return (
    <div className={"Settings-menu-wrapper"}>
      <div className={"Settings-wrapper"}>
        <div>
          Settings
        </div>
      </div>
    </div>
  );
}

export default SettingsMenu;
