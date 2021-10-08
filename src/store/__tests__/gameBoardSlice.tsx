import {
  applyMoveToGameBoardState,
  deepCloneGameBoardState,
} from '../gameBoardSlice';
import { EMPTY_BOARD_STATE, STARTING_BOARD_STATE } from '../../Constants'
import { GameBoardState, Player } from '../../Types'

const areBoardStatesEquivalent = function(
  boardA: GameBoardState,
  boardB: GameBoardState,
): boolean {
  if (
    boardA.barState[Player.One] !== boardB.barState[Player.One] ||
    boardA.barState[Player.Two] !== boardB.barState[Player.Two]
  ) {
    return false;
  }

  if (
    boardA.homeState[Player.One] !== boardB.homeState[Player.One] ||
    boardA.homeState[Player.Two] !== boardB.homeState[Player.Two]
  ) {
    return false;
  }

  for (let i = 0; i <= 23; i++) {
    if (
      boardA.pointsState[i][Player.One] !== boardB.pointsState[i][Player.One] ||
      boardA.pointsState[i][Player.Two] !== boardB.pointsState[i][Player.Two]
    ) {
      return false;
    }
  }

  return true;
}

test('deepCloneGameBoardState works', () => {
  const BOARD_A = {
    ...EMPTY_BOARD_STATE
  };
  BOARD_A.barState[Player.One] = 1;
  BOARD_A.homeState[Player.Two] = 2;
  BOARD_A.pointsState[10][Player.One] = 1;
  BOARD_A.pointsState[11][Player.Two] = 4;

  const BOARD_B = deepCloneGameBoardState(BOARD_A);

  expect(areBoardStatesEquivalent(
    BOARD_A,
    BOARD_B,
  )).toEqual(true);

  BOARD_B.barState[Player.One] = 2;

  expect(areBoardStatesEquivalent(
    BOARD_A,
    BOARD_B,
  )).toEqual(false);

  BOARD_A.barState[Player.One] = 2;

  expect(areBoardStatesEquivalent(
    BOARD_A,
    BOARD_B,
  )).toEqual(true);

  BOARD_B.homeState[Player.One] = 1;

  expect(areBoardStatesEquivalent(
    BOARD_A,
    BOARD_B,
  )).toEqual(false);

  BOARD_A.homeState[Player.One] = 1;

  expect(areBoardStatesEquivalent(
    BOARD_A,
    BOARD_B,
  )).toEqual(true);

  BOARD_B.pointsState[10][Player.One] = 2;

  expect(areBoardStatesEquivalent(
    BOARD_A,
    BOARD_B,
  )).toEqual(false);

  BOARD_A.pointsState[10][Player.One] = 2;
});

test('applyMoveToGameBoardState handles entering from the bar', () => {
  const TEST_BOARD = {
    ...EMPTY_BOARD_STATE
  };
  TEST_BOARD.barState[Player.One] = 2;

  const EXPECTED = {
    ...EMPTY_BOARD_STATE
  };
  // EXPECTED.barState[Player.One] = 1;
  EXPECTED.pointsState[22][Player.One] = 1;

  const RESULT = applyMoveToGameBoardState(
    TEST_BOARD,
    {from: "BAR", to: 22},
    Player.One,
  );

  expect(areBoardStatesEquivalent(
    RESULT,
    EXPECTED,
  )).toEqual(true);
});