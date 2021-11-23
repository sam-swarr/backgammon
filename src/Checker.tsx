import React, { FunctionComponent } from "react";
import { Transition } from 'react-transition-group';
import { getTranslationOffsetStyleString } from "./store/animations";
import { Animation, clearAnimation } from "./store/animationsSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";

import {Color} from './Types';

type CheckerProps = {
  animation?: Animation,
  color: Color,
  location: number | "HOME" | "BAR",
};

const Checker: FunctionComponent<CheckerProps> = ({
  color,
  animation,
  location,
}: CheckerProps) => {
  const [
    currentPlayer,
  ] = useAppSelector((state) => [
    state.currentPlayer,
  ]);
  const dispatch = useAppDispatch();
  const colorClass = color === Color.White ? "white" : "black";
  const ref = React.useRef(null);

  if (animation != null) {
    const transitionStyles = {
      entering: { transform: getTranslationOffsetStyleString(animation.translation) },
      entered: { transform: 'none' },
      exiting: {},
      exited: {},
      unmounted: {},
    };

    return(
      <Transition
          in={true}
          appear={true}
          nodeRef={ref}
          timeout={0}
          onEntered={() => {
            setTimeout(() => dispatch(clearAnimation({
              player: currentPlayer,
              checkerNumber: animation.checkerNumber,
              location,
            })), 300) }}>
        {state => (
          <div
            className={"Checker " + colorClass}
            ref={ref}
            style={transitionStyles[state]} />
        )}
      </Transition>
    );
  }

  return (
    <div className={"Checker " + colorClass} />
  );
}

export default Checker;