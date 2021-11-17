import { FunctionComponent } from 'react';

import { useAppDispatch } from './store/hooks';
import { clearHighlightedMoves } from "./store/highlightedMovesSlice";
import { clearProvisionalMoves } from './store/provisionalMovesSlice';

type UndoMoveButtonProps = {
  hasProvisionalMoves: boolean,
};

const UndoMoveButton: FunctionComponent<UndoMoveButtonProps> = ({
  hasProvisionalMoves
}: UndoMoveButtonProps) => {
  const dispatch = useAppDispatch();
  return (
    <div className={"Undo-button-wrapper"}>
      <div
        className={"Undo-button"}
        hidden={!hasProvisionalMoves}
        onClick={() => {
          dispatch(clearProvisionalMoves());
          dispatch(clearHighlightedMoves());
        }} />
    </div>
  );
}

export default UndoMoveButton;
