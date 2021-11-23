import { GameBoardState, MovementDirection, Player, ValidMove } from "../Types";
import { Animation, TranslationOffset } from "./animationsSlice";

const POINT_WIDTH = 5.333;
const BAR_WIDTH = 3.2;
const CHECKER_HEIGHT = 2.667;
const BOARD_HEIGHT = 36.92;

export function calculateTranslationOffsets(
  gameBoardState: GameBoardState,
  move: ValidMove,
  currentPlayer: Player,
  playerMovementDirection: MovementDirection,
): Animation {
  const fromPoint = move.move.from;
  const toPoint = move.move.to;

  if (fromPoint === 'BAR' || toPoint === 'HOME') {
    // TODO
    return {
      translation: {
        translateX: 0,
        translateY: 0,
      },
    };
  }
  if (playerMovementDirection === MovementDirection.CounterClockwise) {
    const fromX = calculateDistanceOnXAxisCCW(fromPoint);
    const toX = calculateDistanceOnXAxisCCW(toPoint);

    const fromNumberOfCheckers = gameBoardState.pointsState[fromPoint][currentPlayer];
    const fromY = calculateDistanceOnYAxis(fromPoint, fromNumberOfCheckers);

    // Add one since the checker hasn't logically been moved yet.
    const toNumberOfCheckers = gameBoardState.pointsState[toPoint][currentPlayer] + 1;
    const toY = calculateDistanceOnYAxis(toPoint, toNumberOfCheckers);

    return {
      translation: {
        translateX: fromX - toX,
        translateY: fromY - toY,
      },
    };
  }
  // MovementDirection.Clockwise
  else {
    const fromX = calculateDistanceOnXAxisCW(fromPoint);
    const toX = calculateDistanceOnXAxisCW(toPoint);

    const fromNumberOfCheckers = gameBoardState.pointsState[fromPoint][currentPlayer];
    const fromY = calculateDistanceOnYAxis(fromPoint, fromNumberOfCheckers);

    // Add one since the checker hasn't logically been moved yet.
    const toNumberOfCheckers = gameBoardState.pointsState[toPoint][currentPlayer] + 1;
    const toY = calculateDistanceOnYAxis(toPoint, toNumberOfCheckers);

    return {
      translation: {
        translateX: fromX - toX,
        translateY: fromY - toY,
      },
    };
  }
}

function calculateDistanceOnXAxisCCW(
  point: number,
): number {
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

function calculateDistanceOnXAxisCW(
  point: number,
): number {
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

function calculateDistanceOnYAxis(
  point: number,
  numCheckers: number,
): number {
  if (point >= 12) {
    // These points are on the top of the screen. Checkers are stacked from the top edge down.
    return CHECKER_HEIGHT * (numCheckers - 1);
  } else {
    // These points are on the bottom of the screen. Checkers are stacked from the bottom edge up.
    return BOARD_HEIGHT - (CHECKER_HEIGHT * numCheckers);
  }
}

export function getTranslationOffsetStyleString(offset: TranslationOffset): string {
  return "translate(" + offset.translateX + "vw, " + offset.translateY + "vw)";
}