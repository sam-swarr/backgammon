import type { GameBoardState, Move, Player, PointState } from '../Types';

// export function getPointStateAtIndex(
//   pointIndex: number | "BAR",
// ): PointState {
//   if (pointIndex === "BAR") {
//     return 
//   }
// }

export function getMoveIfValid(
  gameBoardState: GameBoardState,
  fromPoint: number | "BAR",
  dieValue: number,
  currentPlayer: Player,
): Move | null {
  const fromPointState = gameBoardState.pointsState 
  if (dieValue > 0) {
    return {
      from: 1,
      to: 2,
    };
  }
  return null;
};