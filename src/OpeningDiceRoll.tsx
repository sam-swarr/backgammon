import { FunctionComponent, useRef, useState } from "react";

import { Color, Player } from "./Types";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import Die from "./Die";
import { GameState, setState } from "./store/gameStateSlice";
import { performInitialRolls } from "./store/dice";
import { setDice } from "./store/diceSlice";
import { CSSTransition } from "react-transition-group";
import { setCurrentPlayer } from "./store/currentPlayerSlice";

const OpeningDiceRoll: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const [settings] = useAppSelector((state) => [state.settings]);

  const [initialRolls] = useState(performInitialRolls());
  const [initialRollCounter, setInitialRollCounter] = useState(0);
  const [forceReroll, setForceReroll] = useState(false);

  let currOpeningRoll = initialRolls[initialRollCounter];
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
              // TODO: send automatic double dispatch
              setInitialRollCounter(initialRollCounter + 1);
              setForceReroll(false);
              setTimeout(() => {
                dispatchStartGameActions(
                  initialRolls[initialRolls.length - 1],
                  settings.playerOneColor,
                  dispatch
                );
              }, 1500);
            } else {
              dispatchStartGameActions(
                initialRolls[initialRolls.length - 1],
                settings.playerOneColor,
                dispatch
              );
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
          color={Color.White}
          forceReroll={forceReroll}
        />
        <Die
          dieValue={currOpeningRoll[1]}
          dieSpent={false}
          color={Color.Black}
          forceReroll={forceReroll}
        />
        <div className={"Dice-row-spacer"} />
      </div>
    </CSSTransition>
  );
};

function dispatchStartGameActions(
  openingRoll: number[],
  playerOneColor: Color,
  dispatch: Function
) {
  let startingPlayer: Player =
    openingRoll[0] > openingRoll[1]
      ? playerOneColor === Color.White
        ? Player.One
        : Player.Two
      : playerOneColor === Color.White
      ? Player.Two
      : Player.One;
  dispatch(setCurrentPlayer(startingPlayer));
  dispatch(setDice(openingRoll));
  dispatch(setState({ newState: GameState.PlayerMoving }));
}

export default OpeningDiceRoll;
