import { FunctionComponent } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { Player } from './Types';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setShowGameOverDialog } from './store/settingsSlice';
import { GameState } from "./store/gameStateSlice";

type GameOverDialogProps = {};

const GameOverDialog: FunctionComponent<GameOverDialogProps> = () => {

  const [
    gameState,
    settings,
    currentPlayer,
  ] = useAppSelector((state) => [
    state.gameState,
    state.settings,
    state.currentPlayer,
  ]);
  const dispatch = useAppDispatch();
  const closeDialog = () => dispatch(setShowGameOverDialog(false));

  const winnerText = currentPlayer === Player.One ? "Player One" : "Player Two";

  let gammonText = null;
  switch (gameState) {
    case GameState.GameOverGammon:
      gammonText = (
        <div className={"Game-over-dialog-gammon-text"}>
          It's a gammon! That's worth double!
        </div>
      );
      break;

    case GameState.GameOverBackgammon:
      gammonText = (
        <div className={"Game-over-dialog-gammon-text"}>
          It's a backgammon! That's worth triple!
        </div>
      );
      break;

    default:
      gammonText = null;
  }

  return (
    <Modal
      show={settings.showGameOverDialog}
      centered={true}
      dialogClassName={'Game-over-dialog'}
      keyboard={true}
      onHide={closeDialog}>
      <Modal.Header>
        <Modal.Title>Game Over</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={"Game-over-dialog-winner-wrapper"}>
          {winnerText + " Wins!"}
        </div>
        {gammonText}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={closeDialog}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GameOverDialog;
