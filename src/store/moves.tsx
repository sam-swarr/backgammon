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
  toPoint: number,
  currentPlayer: Player,
): boolean {
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

  if (toPointIndex === "HOME") {
    // TODO
  } else {
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
  }

  return null;
};