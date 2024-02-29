import {
  GameBoardState,
  HitStatus,
  Move,
  MovementDirection,
  Player,
} from "./Types";
import { genAnimationID } from "./Utils";
import { getPointStateAtIndex } from "./store/moves";

const POINT_WIDTH = 5.333;
const BAR_WIDTH = 3.2;
const BAR_HALF_HEIGHT = 17.537;
const BAR_SPACER = 1.846;
const HOME_WIDTH = 4;
const CHECKER_HEIGHT = 2.667;
const BOARD_HEIGHT = 36.92;
const BOARD_HALF_WIDTH = 32;

export type TranslationOffset = {
  translateX: number;
  translateY: number;
};

export type AnimationOptions = {
  removeProvisionalMoveOnCompletion?: boolean;
  reenableUndoButtonOnCompletion?: boolean;
};

export type Animation = {
  id: number;
  location: number | "HOME" | "BAR";
  checkerOwner: Player;
  checkerNumber: number;
  translation: TranslationOffset;
};

export function createAnimationData(
  gameBoardState: GameBoardState,
  move: Move,
  playerMovementDirection: MovementDirection
): Animation[] {
  let result = [];
  result.push(
    createAnimationDatum(
      gameBoardState,
      move.from,
      move.to,
      move.checkerOwner,
      playerMovementDirection
    )
  );

  if (move.hitStatus === HitStatus.IsHit) {
    const otherPlayer =
      move.checkerOwner === Player.One ? Player.Two : Player.One;

    result.push(
      createAnimationDatum(
        gameBoardState,
        move.to,
        "BAR",
        otherPlayer,
        playerMovementDirection
      )
    );
  }

  return result;
}

function createAnimationDatum(
  gameBoardState: GameBoardState,
  fromPoint: number | "BAR" | "HOME",
  toPoint: number | "BAR" | "HOME",
  checkerOwner: Player,
  playerMovementDirection: MovementDirection
): Animation {
  if (playerMovementDirection === MovementDirection.CounterClockwise) {
    const fromX = calculateDistanceOnXAxisCCW(fromPoint);
    const toX = calculateDistanceOnXAxisCCW(toPoint);

    const fromNumberOfCheckers = getPointStateAtIndex(
      gameBoardState,
      fromPoint
    )[checkerOwner];
    const fromY = calculateDistanceOnYAxis(
      fromPoint,
      fromNumberOfCheckers,
      checkerOwner
    );

    // Add one since the checker hasn't logically been moved yet.
    const toNumberOfCheckers =
      getPointStateAtIndex(gameBoardState, toPoint)[checkerOwner] + 1;
    const toY = calculateDistanceOnYAxis(
      toPoint,
      toNumberOfCheckers,
      checkerOwner
    );

    return {
      id: genAnimationID(),
      location: toPoint,
      translation: {
        translateX: fromX - toX,
        translateY: fromY - toY,
      },
      checkerNumber: toNumberOfCheckers,
      checkerOwner,
    };
  }
  // MovementDirection.Clockwise
  else {
    const fromX = calculateDistanceOnXAxisCW(fromPoint);
    const toX = calculateDistanceOnXAxisCW(toPoint);

    const fromNumberOfCheckers = getPointStateAtIndex(
      gameBoardState,
      fromPoint
    )[checkerOwner];
    const fromY = calculateDistanceOnYAxis(
      fromPoint,
      fromNumberOfCheckers,
      checkerOwner
    );

    // Add one since the checker hasn't logically been moved yet.
    const toNumberOfCheckers =
      getPointStateAtIndex(gameBoardState, toPoint)[checkerOwner] + 1;
    const toY = calculateDistanceOnYAxis(
      toPoint,
      toNumberOfCheckers,
      checkerOwner
    );

    return {
      id: genAnimationID(),
      location: toPoint,
      translation: {
        translateX: fromX - toX,
        translateY: fromY - toY,
      },
      checkerNumber: toNumberOfCheckers,
      checkerOwner,
    };
  }
}

function calculateDistanceOnXAxisCCW(point: number | "BAR" | "HOME"): number {
  if (point === "BAR") {
    return BOARD_HALF_WIDTH + BAR_WIDTH + 1;
  } else if (point === "HOME") {
    return BOARD_HALF_WIDTH * 2 + BAR_WIDTH + HOME_WIDTH;
  } else {
    // Calculate how many points from the left edge of the board.
    let pointsFromLeft;
    if (point >= 12) {
      pointsFromLeft = point - 11;
    } else {
      pointsFromLeft = 12 - point;
    }
    // Convert to vw units, accounting for the bar if necessary.
    return pointsFromLeft * POINT_WIDTH + (pointsFromLeft > 6 ? BAR_WIDTH : 0);
  }
}

function calculateDistanceOnXAxisCW(point: number | "BAR" | "HOME"): number {
  if (point === "BAR") {
    return HOME_WIDTH + BOARD_HALF_WIDTH;
  } else if (point === "HOME") {
    return 0;
  } else {
    // Calculate how many points from the left edge of the board.
    let pointsFromLeft;
    if (point >= 12) {
      pointsFromLeft = 24 - point;
    } else {
      pointsFromLeft = point + 1;
    }
    // Convert to vw units, accounting for the bar if necessary.
    return pointsFromLeft * POINT_WIDTH + (pointsFromLeft > 6 ? BAR_WIDTH : 0);
  }
}

function calculateDistanceOnYAxis(
  point: number | "BAR" | "HOME",
  numCheckers: number,
  checkerOwner: Player
): number {
  if (point === "BAR") {
    if (checkerOwner === Player.One) {
      // Player One's bar checkers are stacked on top half of bar from middle upward.
      return BAR_HALF_HEIGHT - numCheckers * CHECKER_HEIGHT;
    } else {
      // Player Two's bar checkers are stacked on bottom half of bar from middle downward.
      return BAR_HALF_HEIGHT + BAR_SPACER + (numCheckers - 1) * CHECKER_HEIGHT;
    }
  } else if (point === "HOME") {
    if (checkerOwner === Player.One) {
      // Player One's home checkers are stacked on bottom half of home from bottom edge upward.
      return BOARD_HEIGHT - CHECKER_HEIGHT;
    } else {
      // Player Two's home checkers are stacked on top half of home from top edge downward.
      return 0;
    }
  } else {
    if (point >= 12) {
      // These points are on the top of the screen. Checkers are stacked from the top edge down.
      return CHECKER_HEIGHT * (numCheckers - 1);
    } else {
      // These points are on the bottom of the screen. Checkers are stacked from the bottom edge up.
      return BOARD_HEIGHT - CHECKER_HEIGHT * numCheckers;
    }
  }
}

export function getTranslationOffsetStyleString(
  offset: TranslationOffset
): string {
  return "translate(" + offset.translateX + "vw, " + offset.translateY + "vw)";
}
