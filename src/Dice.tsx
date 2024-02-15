import { FunctionComponent } from "react";

import { Color, GameBoardState } from "./Types";
import Die from "./Die";
import SubmitMoveButton from "./SubmitMoveButton";
import UndoMoveButton from "./UndoButton";

type DiceProps = {
  currentPlayerColor: Color;
  diceValues: number[];
  availableDice: number[];
  canSubmit: boolean;
  provisionalGameBoardState: GameBoardState;
  submitButtonHandler: Function;
};

const Dice: FunctionComponent<DiceProps> = ({
  currentPlayerColor,
  diceValues,
  availableDice,
  canSubmit,
  provisionalGameBoardState,
  submitButtonHandler,
}: DiceProps) => {
  let dieOneSpent = false;
  let dieTwoSpent = false;

  // Doubles case
  if (diceValues.length === 4) {
    if (availableDice.length === 0) {
      dieOneSpent = true;
      dieTwoSpent = true;
    } else if (availableDice.length >= 1 && availableDice.length <= 2) {
      dieOneSpent = true;
    }
  }
  // Non-doubles case
  else {
    if (!availableDice.includes(diceValues[0])) {
      dieOneSpent = true;
    }
    if (!availableDice.includes(diceValues[1])) {
      dieTwoSpent = true;
    }
  }

  return (
    <div className={"Dice"}>
      <UndoMoveButton provisionalGameBoardState={provisionalGameBoardState} />
      <Die
        dieValue={diceValues[0]}
        dieSpent={dieOneSpent}
        color={currentPlayerColor}
        forceReroll={false}
      />
      <Die
        dieValue={diceValues[1]}
        dieSpent={dieTwoSpent}
        color={currentPlayerColor}
        forceReroll={false}
      />
      <SubmitMoveButton
        canSubmit={canSubmit}
        submitButtonHandler={submitButtonHandler}
      />
    </div>
  );
};

export default Dice;
