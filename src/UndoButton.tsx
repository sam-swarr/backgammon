import { FunctionComponent, useState } from "react";

import { useAppDispatch, useAppSelector } from "./store/hooks";
import { clearHighlightedMoves } from "./store/highlightedMovesSlice";
import { removeLastProvisionalMove } from "./store/provisionalMovesSlice";
import { addAnimation } from "./store/animationsSlice";
import { GameBoardState, Player } from "./Types";
import { calculateTranslationOffsets } from "./store/animations";
import { applyMoveToGameBoardState } from "./store/gameBoardSlice";
import { CHECKER_ANIMATION_TIME_MS } from "./Constants";

type UndoMoveButtonProps = {
  provisionalGameBoardState: GameBoardState;
};

const UndoMoveButton: FunctionComponent<UndoMoveButtonProps> = ({
  provisionalGameBoardState,
}: UndoMoveButtonProps) => {
  const [disableUndoButton, setDisableUndoButton] = useState(false);

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
          setDisableUndoButton(true);
          let boardState = provisionalGameBoardState;
          // Setup animations to show the undoing of provisional moves.
          // Each provisional move is undone one at a time, with enough
          // delay between each to let the animation play.
          for (let i = provisionalMoves.length - 1; i >= 0; i--) {
            const inverseMove = {
              from: provisionalMoves[i].move.to,
              to: provisionalMoves[i].move.from,
            };
            if (i === provisionalMoves.length - 1) {
              // If we're undoing a hit, also add an animation for the checker that
              // was captured.
              if (provisionalMoves[i].isHit) {
                const otherPlayer =
                  currentPlayer === Player.One ? Player.Two : Player.One;
                dispatch(
                  addAnimation({
                    location: provisionalMoves[i].move.to,
                    animation: calculateTranslationOffsets(
                      boardState,
                      {
                        from: "BAR",
                        to: provisionalMoves[i].move.to,
                      },
                      otherPlayer,
                      settings.movementDirection
                    ),
                  })
                );
              }
              dispatch(
                addAnimation({
                  location: inverseMove.to,
                  animation: calculateTranslationOffsets(
                    boardState,
                    inverseMove,
                    currentPlayer,
                    settings.movementDirection
                  ),
                })
              );
              dispatch(removeLastProvisionalMove());
              boardState = applyMoveToGameBoardState(
                boardState,
                inverseMove,
                currentPlayer
              );
              if (i === 0) {
                setDisableUndoButton(false);
              }
            } else {
              setTimeout(() => {
                // If we're undoing a hit, also add an animation for the checker that
                // was captured.
                if (provisionalMoves[i].isHit) {
                  const otherPlayer =
                    currentPlayer === Player.One ? Player.Two : Player.One;
                  dispatch(
                    addAnimation({
                      location: provisionalMoves[i].move.to,
                      animation: calculateTranslationOffsets(
                        boardState,
                        {
                          from: "BAR",
                          to: provisionalMoves[i].move.to,
                        },
                        otherPlayer,
                        settings.movementDirection
                      ),
                    })
                  );
                }
                dispatch(
                  addAnimation({
                    location: inverseMove.to,
                    animation: calculateTranslationOffsets(
                      boardState,
                      inverseMove,
                      currentPlayer,
                      settings.movementDirection
                    ),
                  })
                );
                dispatch(removeLastProvisionalMove());
                boardState = applyMoveToGameBoardState(
                  boardState,
                  inverseMove,
                  currentPlayer
                );
                if (i === 0) {
                  setDisableUndoButton(false);
                }
              }, (provisionalMoves.length - 1 - i) * CHECKER_ANIMATION_TIME_MS);
            }
          }
          dispatch(clearHighlightedMoves());
        }}
      />
    </div>
  );
};

export default UndoMoveButton;
