import { FunctionComponent } from "react";
import { CSSTransition } from 'react-transition-group';
import { getTranslationOffsetStyleString } from "./store/animations";
import { Animation } from "./store/animationsSlice";

import {Color} from './Types';

type CheckerProps = {
  animation?: Animation,
  color: Color,
};

const Checker: FunctionComponent<CheckerProps> = ({ color, animation }: CheckerProps) => {
  const colorClass = color === Color.White ? "white" : "black";

  let styles = {};
  // if (animation != null) {
  //   // styles = {
  //   //   transform: getTranslationOffsetStyleString(animation.translation),
  //   // };

    return(
      // TODO: figure out how this works
      <CSSTransition
          in={true}
          timeout={3000}
          classNames="checker-animate">
        <div className={"Checker " + colorClass} style={styles}  />
      </CSSTransition>
    );
  // }

  // return (
  //   <div className={"Checker " + colorClass} style={styles}  />
  // );
}

export default Checker;