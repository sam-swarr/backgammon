import { FunctionComponent, useContext, useRef, useState } from "react";

import { Color } from "./Types";
import { useAppSelector } from "./store/hooks";
import Die from "./Die";
import { CSSTransition } from "react-transition-group";
import { ActionsContext } from "./ActionsContext";

const OpeningDiceRoll: FunctionComponent = () => {
  const actions = useContext(ActionsContext);
  const [dice, settings] = useAppSelector((state) => [
    state.dice,
    state.settings,
  ]);

  const [initialRollCounter, setInitialRollCounter] = useState(0);
  const [forceReroll, setForceReroll] = useState(false);

  let currOpeningRoll = dice.initialRolls[initialRollCounter];
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={true}
      appear={true}
      timeout={0}
      classNames={"Dice-roll"}
      onEntered={() => {
        setTimeout(() => {
          setForceReroll(true);
          setTimeout(() => {
            if (currOpeningRoll.length === 4) {
              actions.automaticDouble();
              setInitialRollCounter(initialRollCounter + 1);
              setForceReroll(false);
              if (actions.isHostClient()) {
                setTimeout(() => {
                  actions.beginFirstTurn();
                }, 1500);
              }
            } else {
              if (actions.isHostClient()) {
                actions.beginFirstTurn();
              }
            }
          }, 1500);
        }, 0);
      }}
    >
      <div className={"Dice"} ref={nodeRef}>
        <div className={"Dice-row-spacer"} />
        <Die
          dieValue={currOpeningRoll[0]}
          dieSpent={false}
          color={settings.playerOneColor}
          forceReroll={forceReroll}
        />
        <Die
          dieValue={currOpeningRoll[1]}
          dieSpent={false}
          color={
            settings.playerOneColor === Color.White ? Color.Black : Color.White
          }
          forceReroll={forceReroll}
        />
        <div className={"Dice-row-spacer"} />
      </div>
    </CSSTransition>
  );
};

export default OpeningDiceRoll;
