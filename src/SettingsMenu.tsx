import cx from "classnames";
import { FunctionComponent } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Checker from './Checker';
import { Color, MovementDirection } from './Types';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setMovementDirection, setPlayerOneColor, setShowSettingsMenu } from './store/settingsSlice';

type SettingsMenuProps = {};

const SettingsMenu: FunctionComponent<SettingsMenuProps> = () => {

  const settings = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  const closeDialog = () => dispatch(setShowSettingsMenu(false));
  const togglePlayerColor = () => {
    const newColor = settings.playerOneColor === Color.Black ? Color.White : Color.Black;
    dispatch(setPlayerOneColor(newColor));
  }
  const toggleMovementDirection = () => {
    const newDirection = settings.movementDirection === MovementDirection.Clockwise ?
      MovementDirection.CounterClockwise : MovementDirection.Clockwise;
    dispatch(setMovementDirection(newDirection));
  }

  return (
    <Modal
      show={settings.showSettingsMenu}
      centered={true}
      dialogClassName={'Settings-menu'}
      keyboard={true}
      onHide={closeDialog}>
      <Modal.Header>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={"Settings-option-row"}>
          <div>
            Checker color
          </div>
          <div
            className={"Settings-menu-checker-wrapper"}
            onClick={togglePlayerColor}>
            <Checker color={settings.playerOneColor} />
          </div>
        </div>
        <div className={"Settings-option-row bottom"}>
          <div>
            Movement direction
          </div>
          <div
            className={"Settings-option-arrow-wrapper"}
            onClick={toggleMovementDirection}>
            <div className={cx("Settings-option-arrow", {
              clockwise: settings.movementDirection === MovementDirection.Clockwise,
              counterclockwise: settings.movementDirection === MovementDirection.CounterClockwise,
            })} />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={closeDialog}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SettingsMenu;
