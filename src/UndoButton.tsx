import { FunctionComponent, useContext, useState } from "react";

import { useAppDispatch, useAppSelector } from "./store/hooks";
import { clearHighlightedMoves } from "./store/highlightedMovesSlice";
import { removeLastProvisionalMove } from "./store/provisionalMovesSlice";
import { GameBoardState, Player } from "./Types";
import { Animation, createAnimationData } from "./Animations";
import { applyMoveToGameBoardState } from "./store/gameBoardSlice";
import { ActionsContext } from "./ActionsContext";

type UndoMoveButtonProps = {
  provisionalGameBoardState: GameBoardState;
  addAnimationsToQueueFunction: Function;
};

const UndoMoveButton: FunctionComponent<UndoMoveButtonProps> = ({
  provisionalGameBoardState,
  addAnimationsToQueueFunction,
}: UndoMoveButtonProps) => {
  const [disableUndoButton, setDisableUndoButton] = useState(false);
  const actions = useContext(ActionsContext);

  const [provisionalMoves, currentPlayer, settings] = useAppSelector(
    (state) => [state.provisionalMoves, state.currentPlayer, state.settings]
  );
  const dispatch = useAppDispatch();

  return (
    <div className={"Undo-button-wrapper"}>
      <div
        className={"Undo-button"}
        hidden={provisionalMoves.length <= 0 || disableUndoButton}
        onClick={() => {
          // TODO: figure out disableundobutton behavior to work with new system
          // might need to add flag to animation options and last animation in
          // undo sequence sets flag that tells gameboard to re-enable button
          // setDisableUndoButton(true);
          actions.clearNetworkedAnimations();
          let boardState = provisionalGameBoardState;

          // Setup animations to show the undoing of provisional moves.
          const animationsToQueue: Animation[][] = [];
          for (let i = provisionalMoves.length - 1; i >= 0; i--) {
            let animations = [];
            const inverseMove = {
              from: provisionalMoves[i].move.to,
              to: provisionalMoves[i].move.from,
            };
            // If we're undoing a hit, also add an animation for the checker that
            // was captured.
            if (provisionalMoves[i].isHit) {
              const otherPlayer =
                currentPlayer === Player.One ? Player.Two : Player.One;
              animations.push(
                createAnimationData(
                  boardState,
                  {
                    from: "BAR",
                    to: provisionalMoves[i].move.to,
                  },
                  provisionalMoves[i].move.to,
                  otherPlayer,
                  settings.movementDirection
                )
              );
            }
            animations.push(
              createAnimationData(
                boardState,
                inverseMove,
                inverseMove.to,
                currentPlayer,
                settings.movementDirection,
                {
                  // don't need to remove any more provisional moves for the last
                  // move in the undo chain, since we're back at the original state
                  removeProvisionalMoveOnCompletion: i !== 0,
                }
              )
            );
            boardState = applyMoveToGameBoardState(
              boardState,
              inverseMove,
              currentPlayer
            );
            animationsToQueue.push(animations);
          }
          addAnimationsToQueueFunction(animationsToQueue);
          dispatch(removeLastProvisionalMove());
          dispatch(clearHighlightedMoves());
        }}
      />
    </div>
  );
};

export default UndoMoveButton;
