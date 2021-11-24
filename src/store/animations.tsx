import { AppliableMove, GameBoardState, MovementDirection, Player, ValidMove } from "../Types";
import { Animation, TranslationOffset } from "./animationsSlice";
import { getPointStateAtIndex } from "./moves";

const POINT_WIDTH = 5.333;
const BAR_WIDTH = 3.2;
const BAR_HALF_HEIGHT = 17.537;
const BAR_SPACER = 1.846;
const HOME_WIDTH = 4;
const CHECKER_HEIGHT = 2.667;
const BOARD_HEIGHT = 36.92;
const BOARD_HALF_WIDTH = 32;

export function calculateTranslationOffsets(
  gameBoardState: GameBoardState,
  move: AppliableMove,
  currentPlayer: Player,
  playerMovementDirection: MovementDirection,
): Animation {
  const fromPoint = move.from;
  const toPoint = move.to;

  if (playerMovementDirection === MovementDirection.CounterClockwise) {
    const fromX = calculateDistanceOnXAxisCCW(fromPoint);
    const toX = calculateDistanceOnXAxisCCW(toPoint);

    const fromNumberOfCheckers = getPointStateAtIndex(gameBoardState, fromPoint)[currentPlayer];
    const fromY = calculateDistanceOnYAxis(fromPoint, fromNumberOfCheckers, currentPlayer);

    // Add one since the checker hasn't logically been moved yet.
    const toNumberOfCheckers = getPointStateAtIndex(gameBoardState, toPoint)[currentPlayer] + 1;
    const toY = calculateDistanceOnYAxis(toPoint, toNumberOfCheckers, currentPlayer);

    return {
      translation: {
        translateX: fromX - toX,
        translateY: fromY - toY,
      },
      checkerNumber: toNumberOfCheckers,
      owner: currentPlayer,
    };
  }
  // MovementDirection.Clockwise
  else {
    const fromX = calculateDistanceOnXAxisCW(fromPoint);
    const toX = calculateDistanceOnXAxisCW(toPoint);

    const fromNumberOfCheckers = getPointStateAtIndex(gameBoardState, fromPoint)[currentPlayer];
    const fromY = calculateDistanceOnYAxis(fromPoint, fromNumberOfCheckers, currentPlayer);

    // Add one since the checker hasn't logically been moved yet.
    const toNumberOfCheckers = getPointStateAtIndex(gameBoardState, toPoint)[currentPlayer] + 1;
    const toY = calculateDistanceOnYAxis(toPoint, toNumberOfCheckers, currentPlayer);

    return {
      translation: {
        translateX: fromX - toX,
        translateY: fromY - toY,
      },
      checkerNumber: toNumberOfCheckers,
      owner: currentPlayer,
    };
  }
}

function calculateDistanceOnXAxisCCW(
  point: number | "BAR" | "HOME",
): number {
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

function calculateDistanceOnXAxisCW(
  point: number | "BAR" | "HOME",
): number {
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
  currentPlayer: Player,
): number {
  if (point === "BAR") {
    if (currentPlayer === Player.One) {
      // Player One's bar checkers are stacked on top half of bar from middle upward.
      return BAR_HALF_HEIGHT - (numCheckers * CHECKER_HEIGHT);
    } else {
      // Player Two's bar checkers are stacked on bottom half of bar from middle downward.
      return BAR_HALF_HEIGHT + BAR_SPACER + ((numCheckers - 1) * CHECKER_HEIGHT);
    }
  } else if (point === "HOME") {
    if (currentPlayer === Player.One) {
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
      return BOARD_HEIGHT - (CHECKER_HEIGHT * numCheckers);
    }
  }
}

export function getTranslationOffsetStyleString(offset: TranslationOffset): string {
  return "translate(" + offset.translateX + "vw, " + offset.translateY + "vw)";
}