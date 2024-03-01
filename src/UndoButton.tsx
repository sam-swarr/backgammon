import { FunctionComponent } from "react";

import { useAppDispatch, useAppSelector } from "./store/hooks";
import { clearHighlightedMoves } from "./store/highlightedMovesSlice";
import { clearProvisionalMoves } from "./store/provisionalMovesSlice";
import { HitStatus, Move } from "./Types";
import { enqueueAnimatableMoves } from "./store/animatableMovesSlice";

const UndoMoveButton: FunctionComponent = () => {
  const [provisionalMoves] = useAppSelector((state) => [
    state.provisionalMoves,
    state.currentPlayer,
    state.settings,
  ]);
  const dispatch = useAppDispatch();

  return (
    <div className={"Undo-button-wrapper"}>
      <div
        className={"Undo-button"}
        hidden={provisionalMoves.length <= 0}
        onClick={() => {
          let movesToAnimate: Move[] = [];

          for (let i = provisionalMoves.length - 1; i >= 0; i--) {
            const inverseMove: Move = {
              from: provisionalMoves[i].to,
              to: provisionalMoves[i].from,
              dieUsed: provisionalMoves[i].dieUsed,
              hitStatus:
                provisionalMoves[i].hitStatus === HitStatus.IsHit
                  ? HitStatus.UndoesHit
                  : HitStatus.NoHit,
              checkerOwner: provisionalMoves[i].checkerOwner,
            };
            movesToAnimate.push(inverseMove);
          }

          dispatch(enqueueAnimatableMoves(movesToAnimate));
          dispatch(clearProvisionalMoves());
          dispatch(clearHighlightedMoves());
        }}
      />
    </div>
  );
};

export default UndoMoveButton;
