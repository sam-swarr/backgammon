import cx from "classnames";
import { FunctionComponent } from "react";

import { Color } from "./Types";

type DieProps = {
  dieValue: number;
  dieSpent: boolean;
  color: Color;
  forceReroll: boolean;
};

const Die: FunctionComponent<DieProps> = ({
  dieValue,
  dieSpent,
  color,
  forceReroll,
}: DieProps) => {
  return (
    <div
      className={cx("Die-faces", {
        white: color === Color.White,
        black: color === Color.Black,
        reroll: forceReroll,
        one: dieValue === 1,
        two: dieValue === 2,
        three: dieValue === 3,
        four: dieValue === 4,
        five: dieValue === 5,
        six: dieValue === 6,
        spent: dieSpent,
      })}
    >
      <div className={cx("Die-face", "one")}>
        <div className={cx("Die-pip", "five")} />
      </div>
      <div className={cx("Die-face", "two")}>
        <div className={cx("Die-pip", "three")} />
        <div className={cx("Die-pip", "seven")} />
      </div>
      <div className={cx("Die-face", "three")}>
        <div className={cx("Die-pip", "three")} />
        <div className={cx("Die-pip", "five")} />
        <div className={cx("Die-pip", "seven")} />
      </div>
      <div className={cx("Die-face", "four")}>
        <div className={cx("Die-pip", "one")} />
        <div className={cx("Die-pip", "three")} />
        <div className={cx("Die-pip", "seven")} />
        <div className={cx("Die-pip", "nine")} />
      </div>
      <div className={cx("Die-face", "five")}>
        <div className={cx("Die-pip", "one")} />
        <div className={cx("Die-pip", "three")} />
        <div className={cx("Die-pip", "five")} />
        <div className={cx("Die-pip", "seven")} />
        <div className={cx("Die-pip", "nine")} />
      </div>
      <div className={cx("Die-face", "six")}>
        <div className={cx("Die-pip", "one")} />
        <div className={cx("Die-pip", "three")} />
        <div className={cx("Die-pip", "four")} />
        <div className={cx("Die-pip", "six")} />
        <div className={cx("Die-pip", "seven")} />
        <div className={cx("Die-pip", "nine")} />
      </div>
    </div>
  );
};

export default Die;
