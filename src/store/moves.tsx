import { GameBoardState, Move, Player, PointState } from '../Types';

export function getPointStateAtIndex(
  gameBoardState: GameBoardState,
  pointIndex: number | "BAR",
): PointState {
  if (pointIndex === "BAR") {
    return gameBoardState.barState;
  }
  return gameBoardState.pointsState[pointIndex];
}

export function doesPlayerOccupyBar(
  gameBoardState: GameBoardState,
  player: Player,
): boolean {
  const barState = getPointStateAtIndex(gameBoardState, "BAR");
  return barState[player] > 0;
}

export function getIndexAfterMoving(
  fromPoint: number | "BAR",
  dieValue: number,
  currentPlayer: Player,
): number | "HOME" {
  const direction = currentPlayer === Player.One ? -1 : 1;

  const origin = fromPoint === "BAR" ? (currentPlayer === Player.One ? 24 : -1) : fromPoint;
  const destination = origin + (dieValue * direction);

  if (currentPlayer === Player.One) {
    return destination < 0 ? "HOME" : destination;
  } else {
    return destination > 23 ? "HOME" : destination;
  }
}

export function canPlayerOccupyPoint(
  gameBoardState: GameBoardState,
  toPoint: number | "HOME",
  currentPlayer: Player,
): boolean {
  if (toPoint === "HOME") {
    return true;
  }
  const pointState = getPointStateAtIndex(gameBoardState, toPoint);
  return currentPlayer === Player.One ? (pointState[Player.Two] < 2) : (pointState[Player.One] < 2);
}

export function hasAllCheckersInHomeBoard(
  gameBoardState: GameBoardState,
  currentPlayer: Player,
): boolean {
  if (getPointStateAtIndex(gameBoardState, "BAR")[currentPlayer] > 0) {
    return false;
  }
  if (currentPlayer === Player.One) {
    for (let i = 6; i <= 23; i++) {
      if (getPointStateAtIndex(gameBoardState, i)[currentPlayer] > 0) {
        return false;
      }
    }
  } else {
    for (let i = 0; i <= 17; i++) {
      if (getPointStateAtIndex(gameBoardState, i)[currentPlayer] > 0) {
        return false;
      }
    }
  }
  return true;
}

export function getDistanceFromHome(
  fromPoint: number | "BAR",
  currentPlayer: Player,
): number {
  if (fromPoint === "BAR") {
    return 25;
  }
  return currentPlayer === Player.One ?
    fromPoint + 1 :
    24 - fromPoint;
}

export function getMoveIfValid(
  gameBoardState: GameBoardState,
  fromPoint: number | "BAR",
  dieValue: number,
  currentPlayer: Player,
): Move | null {
  const fromPointState = getPointStateAtIndex(
    gameBoardState,
    fromPoint,
  );

  // Move is invalid if player does not actually occupy the fromPoint.
  if (fromPointState[currentPlayer] === 0) {
    return null;
  }

  // Move is invalid if player occupies the BAR and does not enter.
  if (doesPlayerOccupyBar(gameBoardState, currentPlayer) && fromPoint !== "BAR") {
    return null;
  }

  const toPointIndex = getIndexAfterMoving(
    fromPoint,
    dieValue,
    currentPlayer,
  );

  // If the move would bear the checker off the board.
  if (toPointIndex === "HOME") {
    // Move is invalid if not all checkers are in home board.
    if (!hasAllCheckersInHomeBoard(gameBoardState, currentPlayer)) {
      return null;
    }

    // If the die roll is greater than the distance to home.
    if (dieValue > getDistanceFromHome(fromPoint, currentPlayer)) {
      // The move is invalid if the player occupies any home board points that are further away.
      if (currentPlayer === Player.One) {
        for (let i = dieValue - 1; i <= 5; i++) {
          if (getPointStateAtIndex(gameBoardState, i)[Player.One] > 0) {
            return null;
          }
        }
      } else {
        for (let i = 24 - dieValue; i >= 18; i--) {
          if (getPointStateAtIndex(gameBoardState, i)[Player.Two] > 0) {
            return null;
          }
        }
      }
    }
  }

  // Otherwise, as long as destination point is not occupied by 2+ opposing checkers,
  // the move is valid.
  if (canPlayerOccupyPoint(
    gameBoardState,
    toPointIndex,
    currentPlayer,
  )) {
    return {
      from: fromPoint,
      to: toPointIndex,
    };
  }

  return null;
};

// export function getAllPossibleMoveSets(
//   gameBoardState: GameBoardState,
//   dieRolls: number[],
//   currentPlayer,
// ): Array<Array<Move>> {
//   const moveSets = [];

//   // const dieRollsReversed = dieRolls.reverse();

//   for (let i = 0; )



//   for (let i = 0; i =< 23; i++) {
//     const move = getMoveIfValid(
//       gameBoardState,
//       i,

//     )
//   }

//   // if dieRolls.length === 2
//   // reverse dice and call again
// }

// function _getPossibleMoveSet(
//   gameBoardState: GameBoardState,
//   dieRolls: number[],
//   currentPlayer: Player,
//   moveSet: Array<Move>,
// ): Array<Array<Move>> {



//   const barMove = getMoveIfValid(
//     gameBoardState,
//     "BAR",
//     dieRolls[0],
//     currentPlayer,
//   );
//   if (barMove !== null) {
//     moveSet.push(barMove);
//     _getPossibleMoveSet(

//     )
//   }

//   return [];
// }