import { FunctionComponent, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { Color, Player } from "./Types";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { GameState } from "./store/gameStateSlice";
import { ActionsContext, LocalGameActions } from "./ActionsContext";
import Checker, { CheckerStatus } from "./Checker";
import { useNavigate } from "react-router-dom";
import { setWipeTransition } from "./store/wipeTransitionSlice";
import { resetLocalStore } from "./Utils";

type GameOverDialogProps = {
  playerPerspective: Player;
};

const GameOverDialog: FunctionComponent<GameOverDialogProps> = ({
  playerPerspective,
}) => {
  const [gameState, settings, currentPlayer, matchScore, readyForNextGameData] =
    useAppSelector((state) => [
      state.gameState,
      state.settings,
      state.currentPlayer,
      state.matchScore,
      state.readyForNextGame,
    ]);
  let actions = useContext(ActionsContext);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const startNextGame = () => {
    if (actions.isHostClient()) {
      actions.nextGameButtonClicked({
        ...readyForNextGameData,
        [Player.One]: true,
      });
    } else {
      actions.nextGameButtonClicked({
        ...readyForNextGameData,
        [Player.Two]: true,
      });
    }
  };

  const returnToMenu = () => {
    resetLocalStore(dispatch, true);
    dispatch(setWipeTransition(true));
    navigate("/");
  };

  const isMatchWin =
    matchScore[currentPlayer] >= matchScore.pointsRequiredToWin;

  let winnerText = "";
  if (actions instanceof LocalGameActions) {
    winnerText =
      currentPlayer === Player.One ? "Player One wins" : "Player Two wins";
  } else {
    winnerText =
      currentPlayer === playerPerspective ? "You win" : "Opponent wins";
  }

  winnerText += isMatchWin ? " the match!" : " the game!";

  let gammonText = null;
  switch (gameState) {
    case GameState.GameOverGammon:
      gammonText = (
        <div className={"Game-over-dialog-gammon-text"}>
          It's a gammon and is worth double!
        </div>
      );
      break;

    case GameState.GameOverBackgammon:
      gammonText = (
        <div className={"Game-over-dialog-gammon-text"}>
          It's a backgammon and is worth triple!
        </div>
      );
      break;

    default:
      gammonText = null;
  }

  const headerText = isMatchWin ? "Match Over" : "Game Over";
  let winnerColor = null;
  if (currentPlayer === Player.One) {
    winnerColor = settings.playerOneColor;
  } else {
    winnerColor =
      settings.playerOneColor === Color.White ? Color.Black : Color.White;
  }

  const buttonText = isMatchWin ? "Return to Menu" : "Next Game";

  return (
    <Modal
      show={settings.showGameOverDialog}
      backdrop={"static"}
      centered={true}
      dialogClassName={"Game-over-dialog"}
    >
      <Modal.Header>
        <Modal.Title>{headerText}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={"Game-over-dialog-winner-wrapper"}>
          <div className={"Game-over-dialog-winner-checker-wrapper left"}>
            <Checker
              color={winnerColor}
              checkerPulse={false}
              status={CheckerStatus.None}
              onAnimationComplete={() => {}}
              animation={null}
            />
          </div>
          <div className={"Game-over-dialog-winner-text"}>
            {winnerText}
            {gammonText}
          </div>
          <div className={"Game-over-dialog-winner-checker-wrapper"}>
            <Checker
              color={winnerColor}
              checkerPulse={false}
              status={CheckerStatus.None}
              onAnimationComplete={() => {}}
              animation={null}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={isMatchWin ? returnToMenu : startNextGame}
        >
          {buttonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GameOverDialog;
