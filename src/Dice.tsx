import cx from "classnames";
import { FunctionComponent } from "react";

import {Color} from './Types';

type DiceProps = {
  currentPlayerColor: Color,
  diceValues: number[],
};

const Dice: FunctionComponent<DiceProps> = ({ currentPlayerColor, diceValues }: DiceProps) => {
  return (
      <div className={"Dice"}>
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
      </div>
  );
}

export default Dice;