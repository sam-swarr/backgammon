import { ValidMove } from "../Types";
import { InitialDiceRolls } from "./diceSlice";

export function getAvailableDice(
  dice: number[],
  provisionalMoves: ValidMove[]
): number[] {
  // If we have doubles, all the dice values are the same so we can
  // just remove a die for each provisional move we have.
  if (dice.length === 4) {
    return dice.slice(provisionalMoves.length);
  }
  // Else, filter out the dice whose value has been used by a provisional move.
  return dice.filter(
    (die) => !provisionalMoves.some((move) => move.dieUsed === die)
  );
}

export function rollDiceImpl(): number[] {
  const dieOne = Math.floor(Math.random() * 6) + 1;
  const dieTwo = Math.floor(Math.random() * 6) + 1;

  return dieOne === dieTwo
    ? [dieOne, dieOne, dieOne, dieOne]
    : [dieOne, dieTwo];
}

export function performInitialRolls(): InitialDiceRolls {
  let rolls: number[][] = [];

  let currRoll = null;
  do {
    currRoll = rollDiceImpl();
    rolls.push(currRoll);
  } while (currRoll.length === 4);

  // NOTE: The plan is to only support automatic doubling *once*
  // so we can throw out extra doubles rolls if there are more than one.
  rolls = rolls.slice(-2);

  // Firestore cannot store directly nested arrays, so instead
  // initial rolls will be stored as object with 0-based index
  let result: InitialDiceRolls = {};
  for (let i = 0; i < rolls.length; i++) {
    result[i] = rolls[i];
  }
  return result;
}
