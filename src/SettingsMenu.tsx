import cx from "classnames";
import { FunctionComponent, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import Checker, { CheckerStatus } from "./Checker";
import { Color, MovementDirection, Player } from "./Types";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  setMovementDirection,
  setPlayerOneColor,
  setShowSettingsMenu,
} from "./store/settingsSlice";
import { ActionsContext, LocalGameActions } from "./ActionsContext";

type SettingsMenuProps = {
  playerPerspective: Player;
};

const SettingsMenu: FunctionComponent<SettingsMenuProps> = ({
  playerPerspective,
}) => {
  const settings = useAppSelector((state) => state.settings);
  let actions = useContext(ActionsContext);
  const dispatch = useAppDispatch();

  let playerOneColor = settings.playerOneColor;
  let playerTwoColor =
    playerOneColor === Color.White ? Color.Black : Color.White;

  const closeDialog = () => dispatch(setShowSettingsMenu(false));
  const togglePlayerColor = () => {
    const newColor =
      settings.playerOneColor === Color.Black ? Color.White : Color.Black;
    dispatch(setPlayerOneColor(newColor));
  };
  const toggleMovementDirection = () => {
    const newDirection =
      settings.movementDirection === MovementDirection.Clockwise
        ? MovementDirection.CounterClockwise
        : MovementDirection.Clockwise;
    dispatch(setMovementDirection(newDirection));
  };

  let firstPlayerLabel = "";
  let secondPlayerLabel = "";
  let firstPlayerColor =
    playerPerspective === Player.One ? playerOneColor : playerTwoColor;
  let secondPlayerColor =
    firstPlayerColor === Color.White ? Color.Black : Color.White;
  if (actions instanceof LocalGameActions) {
    firstPlayerLabel =
      playerPerspective === Player.One ? "Player 1" : "Player 2";
    secondPlayerLabel =
      playerPerspective === Player.One ? "Player 2" : "Player 1";
  } else {
    firstPlayerLabel = "You";
    secondPlayerLabel = "Opponent";
  }

  return (
    <Modal
      show={settings.showSettingsMenu}
      centered={true}
      dialogClassName={"Settings-menu"}
      keyboard={true}
      onHide={closeDialog}
    >
      <Modal.Header>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={"Settings-option-row"}>
          <div className={"Settings-checker-color-label"}>Checker color</div>
          <div
            className={"Settings-menu-player-names-and-checkers"}
            onClick={togglePlayerColor}
          >
            <div className={"Settings-menu-player-name-and-checker"}>
              <div className={"Settings-menu-player-name"}>
                {firstPlayerLabel}
              </div>
              <div className={"Settings-menu-checker-wrapper"}>
                <Checker
                  color={firstPlayerColor}
                  checkerPulse={false}
                  status={CheckerStatus.None}
                  onAnimationComplete={() => {}}
                  animation={null}
                />
              </div>
            </div>
            <div className={"Settings-menu-color-swap-arrow-wrapper"}>
              <div className={"Settings-menu-color-swap"}>SWAP</div>
              <div className={"Settings-menu-color-swap-arrow"} />
            </div>
            <div className={"Settings-menu-player-name-and-checker"}>
              <div className={"Settings-menu-player-name"}>
                {secondPlayerLabel}
              </div>
              <div className={"Settings-menu-checker-wrapper"}>
                <Checker
                  color={secondPlayerColor}
                  checkerPulse={false}
                  status={CheckerStatus.None}
                  onAnimationComplete={() => {}}
                  animation={null}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={"Settings-option-row bottom"}>
          <div className={"Settings-checker-direction-label"}>
            Movement direction
          </div>
          <div
            className={"Settings-option-movement-diagram-wrapper"}
            onClick={toggleMovementDirection}
          >
            <div
              className={cx("Settings-option-movement-diagram", {
                light: firstPlayerColor === Color.White,
                dark: firstPlayerColor === Color.Black,
                cw:
                  (playerPerspective === Player.One &&
                    settings.movementDirection ===
                      MovementDirection.Clockwise) ||
                  (playerPerspective === Player.Two &&
                    settings.movementDirection ===
                      MovementDirection.CounterClockwise),
              })}
            />
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
};

export default SettingsMenu;
