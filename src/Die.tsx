import cx from "classnames";
import { FunctionComponent } from "react";

import {Color} from './Types';

type DieProps = {
  dieValue: number,
  color: Color
};

const Die: FunctionComponent<DieProps> = ({
  dieValue,
  color,
}: DieProps) => {
  return (
    <div className="Die-faces" data-roll="1">
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

  // <div className={cx("Die", {
  //   "white": color === Color.White,
  //   "black": color === Color.Black,
  // })}>
  //   {dieValue}
  // </div>
}

export default Die;