import { ValidMove } from "../Types";

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

export function performInitialRolls(): number[][] {
  const rolls: number[][] = [];

  let currRoll = null;
  do {
    currRoll = rollDiceImpl();
    rolls.push(currRoll);
  } while (currRoll.length === 4);

  // NOTE: The plan is to only support automatic doubling *once*
  // so we can throw out extra doubles rolls if there are more than one.
  return rolls.slice(-2);
}
