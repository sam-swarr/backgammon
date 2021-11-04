import { FunctionComponent } from 'react';

import { useAppDispatch } from './store/hooks';
import { setShowSettingsMenu } from './store/settingsSlice';

type SettingsMenuButtonProps = {};

const SettingsMenuButton: FunctionComponent<SettingsMenuButtonProps> = () => {

  const dispatch = useAppDispatch();

  return (
    <div className={"Settings-menu-button-wrapper"}>
      <div
        className={"Settings-menu-button"}
        onClick={() => { dispatch(setShowSettingsMenu(true)); }} />
    </div>
  );
}

export default SettingsMenuButton;
