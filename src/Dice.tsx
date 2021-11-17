import { FunctionComponent } from "react";

import { useAppDispatch } from './store/hooks';

import {Color} from './Types';
import Die from "./Die";
import SubmitMoveButton from "./SubmitMoveButton";
import UndoMoveButton from "./UndoButton";


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
        <UndoMoveButton hasProvisionalMoves={hasProvisionalMoves} />
        <Die dieValue={diceValues[0]} color={currentPlayerColor} />
        <Die dieValue={diceValues[1]} color={currentPlayerColor} />
        <SubmitMoveButton canSubmit={canSubmit} submitButtonHandler={submitButtonHandler} />
      </div>
  );
}

export default Dice;