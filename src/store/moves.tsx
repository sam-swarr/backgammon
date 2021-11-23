import { applyMoveToGameBoardState } from './gameBoardSlice';
import { MOVE_FROM_INDICES } from '../Constants';
import { GameBoardState, Player, PointState, ValidMove } from '../Types';

export function getPointStateAtIndex(
  gameBoardState: GameBoardState,
  pointIndex: number | "BAR" | "HOME",
): PointState {
  if (pointIndex === "BAR") {
    return gameBoardState.barState;
  } else if (pointIndex === "HOME") {
    return gameBoardState.homeState;
  } else {
    return gameBoardState.pointsState[pointIndex];
  }
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

export enum CanOccupyResult {
  No = "NO",
  Yes = "YES",
  Hit = "HIT",
};

export function canPlayerOccupyPoint(
  gameBoardState: GameBoardState,
  toPoint: number | "HOME",
  currentPlayer: Player,
): CanOccupyResult {
  if (toPoint === "HOME") {
    return CanOccupyResult.Yes;
  }
  const pointState = getPointStateAtIndex(gameBoardState, toPoint);
  const otherPlayer = currentPlayer === Player.One ? Player.Two : Player.One;
  if (pointState[otherPlayer] >= 2) {
    return CanOccupyResult.No;
  } else if (pointState[otherPlayer] === 1) {
    return CanOccupyResult.Hit;
  } else {
    return CanOccupyResult.Yes;
  }
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
): ValidMove | null {
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
  if (toPointIndex === "HOME" && fromPoint !== "BAR") {
    // Move is invalid if not all checkers are in home board.
    if (!hasAllCheckersInHomeBoard(gameBoardState, currentPlayer)) {
      return null;
    }

    // If the die roll is greater than the distance to home.
    if (dieValue > getDistanceFromHome(fromPoint, currentPlayer)) {
      // The move is invalid if the player occupies any home board points that are further away.
      if (currentPlayer === Player.One) {
        for (let i = fromPoint + 1; i <= 5; i++) {
          if (getPointStateAtIndex(gameBoardState, i)[Player.One] > 0) {
            return null;
          }
        }
      } else {
        for (let i = fromPoint -1; i >= 18; i--) {
          if (getPointStateAtIndex(gameBoardState, i)[Player.Two] > 0) {
            return null;
          }
        }
      }
    }
  }

  // Otherwise, as long as destination point is not occupied by 2+ opposing checkers,
  // the move is valid.
  const canOccupy = canPlayerOccupyPoint(
    gameBoardState,
    toPointIndex,
    currentPlayer,
  )
  if (canOccupy === CanOccupyResult.Yes || canOccupy === CanOccupyResult.Hit) {
    return {
      move: {
        from: fromPoint,
        to: toPointIndex,
      },
      dieUsed: dieValue,
      isHit: canOccupy === CanOccupyResult.Hit,
    };
  }

  return null;
};

export function getAllPossibleMoveSets(
  gameBoardState: GameBoardState,
  dieRolls: number[],
  currentPlayer: Player,
): ValidMove[][] {
  let result: ValidMove[][] = [];
  result = result.concat(
    getAllPossibleMoveSetsImpl(
      gameBoardState,
      dieRolls,
      0,
      currentPlayer,
      [],
    )
  );

  // If there are exactly 2 die rolls, this means the dice
  // values are different. We should reverse the dice order
  // and calculate all move sets again.
  if (dieRolls.length === 2) {
    const reversedDieRolls = [...dieRolls].reverse();
    result = result.concat(
      getAllPossibleMoveSetsImpl(
        gameBoardState,
        reversedDieRolls,
        0,
        currentPlayer,
        [],
      )
    );
  }

  return result;
}

export function getAllPossibleMoveSetsImpl(
  gameBoardState: GameBoardState,
  dieRolls: number[],
  dieIndex: number,
  currentPlayer: Player,
  moveSet: Array<ValidMove>
): ValidMove[][] {
  const allPossibleMoves = getAllPossibleMovesForGivenDieRoll(
    gameBoardState,
    dieRolls[dieIndex],
    currentPlayer,
  );

  // Base Case: if there are no further moves, return the moveSet up to this point.
  if (allPossibleMoves.length === 0) {
    return [[...moveSet]];
  }

  // Base Case: if this was the last die to use, append each possible move from this
  // state to the moveSet so far, and return.
  if (dieIndex === dieRolls.length - 1) {
    return allPossibleMoves.map(move => [...moveSet, move]);
  }

  let result: ValidMove[][] = [];
  allPossibleMoves.forEach(move => {
    const newGameBoardState = applyMoveToGameBoardState(
      gameBoardState,
      move.move,
      currentPlayer,
    );
    result = result.concat(
      getAllPossibleMoveSetsImpl(
        newGameBoardState,
        dieRolls,
        dieIndex + 1,
        currentPlayer,
        [...moveSet, move],
      )
    );
  });

  return result;
}

export function getAllPossibleMovesForGivenDieRoll(
  gameBoardState: GameBoardState,
  dieRoll: number,
  currentPlayer: Player,
): ValidMove[] {
  const moves: ValidMove[] = [];
  MOVE_FROM_INDICES.forEach(from => {
    const possibleMove = getMoveIfValid(
      gameBoardState,
      from,
      dieRoll,
      currentPlayer,
    );
    if (possibleMove !== null) {
      moves.push(possibleMove);
    }
  });

  return moves;
}

export function areProvisionalMovesSubmittable(
  gameBoardState: GameBoardState,
  dieRolls: number[],
  currentPlayer: Player,
  provisionalMoves: ValidMove[],
): boolean {
  const allPossibleMoveSets: ValidMove[][] = getAllPossibleMoveSets(
    gameBoardState,
    dieRolls,
    currentPlayer,
  );

  const maxNumberOfMoves = allPossibleMoveSets.reduce(
    (maxNumberOfMoves, currMoveSet) => currMoveSet.length > maxNumberOfMoves ? currMoveSet.length : maxNumberOfMoves,
    0,
  );

  // The player did not use the max number of dice possible.
  if (provisionalMoves.length < maxNumberOfMoves) {
    return false;
  }

  const moveSetsWithMaxNumberOfMoves = allPossibleMoveSets.filter((moveSet) => moveSet.length === maxNumberOfMoves);

  const maxPossibleDieValueUsed = moveSetsWithMaxNumberOfMoves.reduce(
    (prevMaxDieValueUsed, currMoveSet) => {
      const currMaxDieValueUsed: number = maxDieValueUsedInMoveSet(currMoveSet);
      return currMaxDieValueUsed > prevMaxDieValueUsed ? currMaxDieValueUsed : prevMaxDieValueUsed;
    },
    0,
  );
  const maxProvisionalDieValueUsed = maxDieValueUsedInMoveSet(provisionalMoves);

  // The player must use the biggest die value possible.
  return maxProvisionalDieValueUsed === maxPossibleDieValueUsed;
}

export function maxDieValueUsedInMoveSet(
  moveSet: ValidMove[],
): number {
  return moveSet.reduce(
    (maxDieValueUsed, move) => move.dieUsed > maxDieValueUsed ? move.dieUsed : maxDieValueUsed,
    0,
  );
}