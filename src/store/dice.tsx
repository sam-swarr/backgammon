import { ValidMove } from '../Types';

export function getAvailableDice(
  dice: number[],
  provisionalMoves: ValidMove[],
): number[] {
  // If we have doubles, all the dice values are the same so we can
  // just remove a die for each provisional move we have.
  if (dice.length === 4) {
    return dice.slice(provisionalMoves.length);
  }
  // Else, filter out the dice whose value has been used by a provisional move.
  return dice.filter(die => !provisionalMoves.some(move => move.dieUsed === die));
}