import { GameBoardState, MovementDirection, Player, ValidMove } from "../Types";

export type TranslationOffset = {
  translateX: number,
  translateY: number,
};

export function calculateTranslationOffsets(
  gameBoardState: GameBoardState,
  move: ValidMove,
  currentPlayer: Player,
  playerMovementDirection: MovementDirection,
): TranslationOffset {
  const POINT_WIDTH = 5.333;
  const BAR_WIDTH = 3.2;
  const CHECKER_HEIGHT = 2.667;
  const BOARD_HEIGHT = 36.92;

  const fromPoint = move.move.from;
  const toPoint = move.move.to;

  if (fromPoint === 'BAR' || toPoint === 'HOME') {
    // TODO
    return {translateX: 0, translateY: 0};
  }
  if (playerMovementDirection === MovementDirection.CounterClockwise) {
    let pointsFromLeftBefore;
    if (fromPoint >= 12) {
      pointsFromLeftBefore = fromPoint - 11;
    } else {
      pointsFromLeftBefore = 12 - fromPoint;
    }
    const fromX = pointsFromLeftBefore * POINT_WIDTH + (pointsFromLeftBefore > 6 ? BAR_WIDTH : 0);

    let pointsFromLeftAfter;
    if (toPoint >= 12) {
      pointsFromLeftAfter = toPoint - 11;
    } else {
      pointsFromLeftAfter = 12 - toPoint;
    }
    const toX = pointsFromLeftAfter * POINT_WIDTH + (pointsFromLeftAfter > 6 ? BAR_WIDTH : 0);
  
    console.log("translate X: ", toX - fromX);


    const fromNumberOfCheckers = gameBoardState.pointsState[fromPoint][currentPlayer];
    const toNumberOfCheckers = gameBoardState.pointsState[toPoint][currentPlayer] + 1;

    let fromY;
    if (fromPoint >= 12) {
      fromY = CHECKER_HEIGHT * (fromNumberOfCheckers - 1);
    } else {
      fromY = BOARD_HEIGHT - (CHECKER_HEIGHT * fromNumberOfCheckers);
    }

    let toY;
    if (toPoint >= 12) {
      toY = CHECKER_HEIGHT * (toNumberOfCheckers - 1);
    } else {
      toY = BOARD_HEIGHT - (CHECKER_HEIGHT * toNumberOfCheckers);
    }

    return {
      translateX: fromX - toX,
      translateY: fromY - toY,
    };
  } else {
    return {translateX: 0, translateY: 0};
  }
}