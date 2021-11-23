import { FunctionComponent } from "react";

import {Color, GameBoardState} from './Types';
import Die from "./Die";
import SubmitMoveButton from "./SubmitMoveButton";
import UndoMoveButton from "./UndoButton";


type DiceProps = {
  currentPlayerColor: Color,
  diceValues: number[],
  canSubmit: boolean,
  provisionalGameBoardState: GameBoardState,
  submitButtonHandler: Function,
};

const Dice: FunctionComponent<DiceProps> = ({
  currentPlayerColor,
  diceValues,
  canSubmit,
  provisionalGameBoardState,
  submitButtonHandler,
}: DiceProps) => {
  return (
      <div className={"Dice"}>
        <UndoMoveButton provisionalGameBoardState={provisionalGameBoardState} />
        <Die dieValue={diceValues[0]} color={currentPlayerColor} />
        <Die dieValue={diceValues[1]} color={currentPlayerColor} />
        <SubmitMoveButton canSubmit={canSubmit} submitButtonHandler={submitButtonHandler} />
      </div>
  );
}

export default Dice;