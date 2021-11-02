import { FunctionComponent } from 'react';
import cx from "classnames";

import { useAppDispatch, useAppSelector } from './store/hooks';
import { toggleSettingsMenu } from './store/settingsSlice';

type SettingsMenuButtonProps = {};

const SettingsMenuButton: FunctionComponent<SettingsMenuButtonProps> = () => {

  const settings = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  return (
    <div className={"Settings-menu-button-wrapper"}>
      <div
        className={cx("Settings-menu-button", {
          "show": settings.showSettingsMenu,
        })}
        onClick={() => { dispatch(toggleSettingsMenu()); }} />
    </div>
  );
}

export default SettingsMenuButton;
