import React, { FunctionComponent } from "react";
import { Transition } from "react-transition-group";
import { getTranslationOffsetStyleString } from "./store/animations";
import { Animation, clearAnimation } from "./store/animationsSlice";
import { useAppDispatch } from "./store/hooks";

import { Color } from "./Types";
import { CHECKER_ANIMATION_TIME_MS } from "./Constants";

type CheckerProps = {
  animation: Animation | undefined | null;
  color: Color;
  location: number | "HOME" | "BAR";
};

const Checker: FunctionComponent<CheckerProps> = ({
  color,
  animation,
  location,
}: CheckerProps) => {
  const dispatch = useAppDispatch();
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
      <Transition
        in={true}
        appear={true}
        nodeRef={ref}
        timeout={0}
        onEntered={() => {
          setTimeout(
            () =>
              dispatch(
                clearAnimation({
                  owner: animation.owner,
                  checkerNumber: animation.checkerNumber,
                  location,
                })
              ),
            CHECKER_ANIMATION_TIME_MS
          );
        }}
      >
        {(state) => (
          <div
            className={"Checker " + colorClass}
            ref={ref}
            style={transitionStyles[state]}
          />
        )}
      </Transition>
    );
  }

  return <div className={"Checker " + colorClass} />;
};

export default Checker;
