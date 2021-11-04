import { FunctionComponent } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { GameState, setState } from './store/gameStateSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setShowSettingsMenu } from './store/settingsSlice';

type SettingsMenuProps = {};

const SettingsMenu: FunctionComponent<SettingsMenuProps> = () => {

  const settings = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  const closeDialog = () => dispatch(setShowSettingsMenu(false));

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
      <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={closeDialog}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SettingsMenu;
