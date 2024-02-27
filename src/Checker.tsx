import React, { FunctionComponent } from "react";
import { Transition } from "react-transition-group";
import { Animation, getTranslationOffsetStyleString } from "./Animations";

import { Color } from "./Types";

type CheckerProps = {
  animation: Animation | undefined | null;
  color: Color;
  removeAnimationFunction: (id: number) => void;
};

const Checker: FunctionComponent<CheckerProps> = ({
  color,
  animation,
  removeAnimationFunction,
}: CheckerProps) => {
  const colorClass = color === Color.White ? "white" : "black";
  const ref = React.useRef(null);

  if (animation != null) {
    const transitionStyles = {
      entering: {
        transform: getTranslationOffsetStyleString(animation.translation),
      },
      entered: { transform: "none" },
      exiting: {},
      exited: {},
      unmounted: {},
    };

    return (
      <Transition in={true} appear={true} nodeRef={ref} timeout={0}>
        {(state) => {
          let d = (
            <div
              className={"Checker " + colorClass}
              ref={ref}
              style={transitionStyles[state]}
              onTransitionEnd={() => {
                removeAnimationFunction(animation.id);
              }}
            />
          );
          return d;
        }}
      </Transition>
    );
  }

  return <div className={"Checker " + colorClass} />;
};

export default Checker;
