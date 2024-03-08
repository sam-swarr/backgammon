import cx from "classnames";
import React, { FunctionComponent } from "react";
import { CSSTransition } from "react-transition-group";
import { Animation, getTranslationOffsetStyleString } from "./Animations";

import { Color } from "./Types";

export enum CheckerStatus {
  Highlighted = "HIGHLIGHTED",
  Selected = "SELECTED",
  None = "NONE",
}

type CheckerProps = {
  animation: Animation | undefined | null;
  color: Color;
  status: CheckerStatus;
  onAnimationComplete: (id: number) => void;
};

const Checker: FunctionComponent<CheckerProps> = ({
  color,
  animation,
  status,
  onAnimationComplete,
}: CheckerProps) => {
  const colorClass = color === Color.White ? "white" : "black";
  const ref = React.useRef(null);

  let enteringState = { transform: "none" };
  if (animation != null) {
    enteringState = {
      transform: getTranslationOffsetStyleString(animation.translation),
    };
  }

  const transitionStyles = {
    entering: enteringState,
    entered: { transform: "none" },
    exiting: {},
    exited: {},
    unmounted: {},
  };

  return (
    <CSSTransition in={true} appear={true} nodeRef={ref} timeout={0}>
      {(state) => {
        let d = (
          <div
            className={cx("Checker", colorClass, {
              highlighted: status === CheckerStatus.Highlighted,
              selected: status === CheckerStatus.Selected,
            })}
            ref={ref}
            style={transitionStyles[state]}
            onTransitionEnd={() => {
              if (animation != null) {
                onAnimationComplete(animation.id);
              }
            }}
          />
        );
        return d;
      }}
    </CSSTransition>
  );
};

export default Checker;
