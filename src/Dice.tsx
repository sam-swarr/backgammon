import cx from "classnames";
import { FunctionComponent } from "react";

import { useAppDispatch } from './store/hooks';
import { clearHighlightedMoves } from "./store/highlightedMovesSlice";
import { clearProvisionalMoves } from './store/provisionalMovesSlice';

import {Color} from './Types';
import Die from "./Die";

type DiceProps = {
  currentPlayerColor: Color,
  diceValues: number[],
  hasProvisionalMoves: boolean,
  canSubmit: boolean,
  submitButtonHandler: Function,
};

const Dice: FunctionComponent<DiceProps> = ({
  currentPlayerColor,
  diceValues,
  hasProvisionalMoves,
  canSubmit,
  submitButtonHandler,
}: DiceProps) => {
  const dispatch = useAppDispatch();
  return (
      <div className={"Dice"}>
        <div className={"Undo-button-wrapper"}>
          <button
            className={"Undo-button"}
            hidden={!hasProvisionalMoves}
            onClick={() => {
              dispatch(clearProvisionalMoves());
              dispatch(clearHighlightedMoves());
            }}>
            Undo
          </button>
        </div>
        <Die dieValue={diceValues[0]} color={currentPlayerColor} />
        <Die dieValue={diceValues[1]} color={currentPlayerColor} />
        <div className={"Submit-button-wrapper"}>
          <button
            className={"Submit-button"}
            hidden={!canSubmit}
            onClick={() => {submitButtonHandler()}}>
            Submit
          </button>
        </div>
      </div>
  );
}

export default Dice;