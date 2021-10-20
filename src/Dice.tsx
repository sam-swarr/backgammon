import cx from "classnames";
import { FunctionComponent } from "react";

import { useAppDispatch } from './store/hooks';
import { clearProvisionalMoves } from './store/provisionalMovesSlice';

import {Color} from './Types';

type DiceProps = {
  currentPlayerColor: Color,
  diceValues: number[],
  hasProvisionalMoves: boolean,
};

const Dice: FunctionComponent<DiceProps> = ({
  currentPlayerColor,
  diceValues,
  hasProvisionalMoves,
}: DiceProps) => {
  const dispatch = useAppDispatch();
  return (
      <div className={"Dice"}>
        <div className={"Undo-button-wrapper"}>
          <button
            className={"Undo-button"}
            hidden={!hasProvisionalMoves}
            onClick={() => {dispatch(clearProvisionalMoves())}}>
            Undo
          </button>
        </div>
        <div className={cx("Die", {
          "white": currentPlayerColor === Color.White,
          "black": currentPlayerColor === Color.Black,
        })}>
          {diceValues[0]}
        </div>
        <div className={cx("Die", {
          "white": currentPlayerColor === Color.White,
          "black": currentPlayerColor === Color.Black,
        })}>
          {diceValues[1]}
        </div>
        <div className={"Submit-button-wrapper"}>
          <button className={"Submit-button"}>
            Submit
          </button>
        </div>
      </div>
  );
}

export default Dice;