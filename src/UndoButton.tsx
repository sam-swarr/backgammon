import { FunctionComponent } from "react";

import { useAppDispatch, useAppSelector } from "./store/hooks";
import { clearLastPointClicked } from "./store/lastPointClickedSlice";
import { clearProvisionalMoves } from "./store/provisionalMovesSlice";
import { Move } from "./Types";
import { enqueueAnimatableMoves } from "./store/animatableMovesSlice";
import { getInverseMove } from "./store/moves";

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
            movesToAnimate.push(getInverseMove(provisionalMoves[i]));
          }

          dispatch(enqueueAnimatableMoves(movesToAnimate));
          dispatch(clearProvisionalMoves());
          dispatch(clearLastPointClicked());
        }}
      />
    </div>
  );
};

export default UndoMoveButton;
