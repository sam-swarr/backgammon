import { FunctionComponent, useContext, useState } from "react";

import { useAppDispatch, useAppSelector } from "./store/hooks";
import { clearHighlightedMoves } from "./store/highlightedMovesSlice";
import { removeLastProvisionalMove } from "./store/provisionalMovesSlice";
import { GameBoardState, HitStatus, Player } from "./Types";
import { Animation, createAnimationData } from "./Animations";
import { applyMoveToGameBoardState } from "./store/gameBoardSlice";
import { ActionsContext } from "./ActionsContext";

type UndoMoveButtonProps = {
  provisionalGameBoardState: GameBoardState;
  addAnimationsToQueueFunction: Function;
  disableUndoButton: boolean;
  setDisableUndoButton: (disable: boolean) => void;
};

const UndoMoveButton: FunctionComponent<UndoMoveButtonProps> = ({
  provisionalGameBoardState,
  addAnimationsToQueueFunction,
  disableUndoButton,
  setDisableUndoButton,
}: UndoMoveButtonProps) => {
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
          /*

          setDisableUndoButton(true);
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
            if (provisionalMoves[i].hitStatus === HitStatus.IsHit) {
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
                  // animation in the undo chain, since we're back at the original
                  // board state at this point
                  removeProvisionalMoveOnCompletion: i !== 0,
                  // after the last animation, indicate that we should reenable the
                  // undo button
                  reenableUndoButtonOnCompletion: i === 0,
                }
              )
            );
            // This is not quite accurate since we're only undoing the position of the
            // current player's checker. If the move being undone was a hit, we haven't
            // updated the board state to move the hit checker back off the bar. It doesn't
            // really matter here because these intermediate board states are only being
            // used to calculate animation offsets and aren't actually displayed. Instead we
            // currently rely on the provisional moves being popped off the stack to correctly
            // return the board to the previous states.
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
          */
        }}
      />
    </div>
  );
};

export default UndoMoveButton;
