import {
  canPlayerOccupyPoint,
  getIndexAfterMoving,
  getMoveIfValid,
  getPointStateAtIndex,
  hasAllCheckersInHomeBoard,
} from '../moves';
import { EMPTY_BOARD_STATE, STARTING_BOARD_STATE } from '../../Constants'
import { Player } from '../../Types'

test('getPointStateAtIndex works', () => {
  expect(getPointStateAtIndex(
    STARTING_BOARD_STATE,
    0,
  )).toEqual({
    [Player.One]: 0,
    [Player.Two]: 2,
  });

  expect(getPointStateAtIndex(
    STARTING_BOARD_STATE,
    8,
  )).toEqual({
    [Player.One]: 0,
    [Player.Two]: 0,
  });

  expect(getPointStateAtIndex(
    STARTING_BOARD_STATE,
    12,
  )).toEqual({
    [Player.One]: 5,
    [Player.Two]: 0,
  });

  expect(getPointStateAtIndex(
    STARTING_BOARD_STATE,
    "BAR",
  )).toEqual({
    [Player.One]: 0,
    [Player.Two]: 0,
  });
});

test('getIndexAfterMoving works', () => {
  expect(getIndexAfterMoving(
    23, // fromPoint
    1, // dieValue
    Player.One, // currentPlayer
  )).toEqual(22);

  expect(getIndexAfterMoving(
    0, // fromPoint
    1, // dieValue
    Player.Two, // currentPlayer
  )).toEqual(1);

  expect(getIndexAfterMoving(
    "BAR", // fromPoint
    3, // dieValue
    Player.One, // currentPlayer
  )).toEqual(21);

  expect(getIndexAfterMoving(
    "BAR", // fromPoint
    5, // dieValue
    Player.Two, // currentPlayer
  )).toEqual(4);

  expect(getIndexAfterMoving(
    2, // fromPoint
    2, // dieValue
    Player.One, // currentPlayer
  )).toEqual(0);

  expect(getIndexAfterMoving(
    2, // fromPoint
    3, // dieValue
    Player.One, // currentPlayer
  )).toEqual("HOME");

  expect(getIndexAfterMoving(
    22, // fromPoint
    1, // dieValue
    Player.Two, // currentPlayer
  )).toEqual(23);

  expect(getIndexAfterMoving(
    23, // fromPoint
    1, // dieValue
    Player.Two, // currentPlayer
  )).toEqual("HOME");
});

test('canPlayerOccupyPoint works', () => {
  expect(canPlayerOccupyPoint(
    STARTING_BOARD_STATE, // boardState
    23, // toPoint
    Player.One, // currentPlayer
  )).toEqual(true);

  expect(canPlayerOccupyPoint(
    STARTING_BOARD_STATE, // boardState
    23, // toPoint
    Player.Two, // currentPlayer
  )).toEqual(false);

  expect(canPlayerOccupyPoint(
    STARTING_BOARD_STATE, // boardState
    22, // toPoint
    Player.One, // currentPlayer
  )).toEqual(true);

  expect(canPlayerOccupyPoint(
    STARTING_BOARD_STATE, // boardState
    22, // toPoint
    Player.Two, // currentPlayer
  )).toEqual(true);

  expect(canPlayerOccupyPoint(
    STARTING_BOARD_STATE, // boardState
    0, // toPoint
    Player.One, // currentPlayer
  )).toEqual(false);

  expect(canPlayerOccupyPoint(
    STARTING_BOARD_STATE, // boardState
    0, // toPoint
    Player.Two, // currentPlayer
  )).toEqual(true);
});

test('hasAllCheckersInHomeBoard works', () => {
  const TEST_BOARD = {
    ...EMPTY_BOARD_STATE
  };
  TEST_BOARD.pointsState[1] = {[Player.One]: 2, [Player.Two]: 0};
  TEST_BOARD.pointsState[5] = {[Player.One]: 4, [Player.Two]: 0};

  TEST_BOARD.pointsState[23] = {[Player.One]: 0, [Player.Two]: 1};
  TEST_BOARD.pointsState[22] = {[Player.One]: 0, [Player.Two]: 3};

  expect(hasAllCheckersInHomeBoard(
    TEST_BOARD, // boardState
    Player.One, // currentPlayer
  )).toEqual(true);

  expect(hasAllCheckersInHomeBoard(
    TEST_BOARD, // boardState
    Player.Two, // currentPlayer
  )).toEqual(true);

  TEST_BOARD.pointsState[20] = {[Player.One]: 1, [Player.Two]: 0};

  expect(hasAllCheckersInHomeBoard(
    TEST_BOARD, // boardState
    Player.One, // currentPlayer
  )).toEqual(false);

  expect(hasAllCheckersInHomeBoard(
    TEST_BOARD, // boardState
    Player.Two, // currentPlayer
  )).toEqual(true);

  TEST_BOARD.pointsState[3] = {[Player.One]: 0, [Player.Two]: 1};

  expect(hasAllCheckersInHomeBoard(
    TEST_BOARD, // boardState
    Player.Two, // currentPlayer
  )).toEqual(false);
});

test('getMoveIfValid returns null if currentPlayer does not occupy fromPoint', () => {
  expect(getMoveIfValid(
    STARTING_BOARD_STATE,
    0, // fromPoint
    1, // dieValue
    Player.One,
  )).toBeNull();

  expect(getMoveIfValid(
    STARTING_BOARD_STATE,
    5, // fromPoint
    1, // dieValue
    Player.Two,
  )).toBeNull();

  expect(getMoveIfValid(
    STARTING_BOARD_STATE,
    "BAR", // fromPoint
    1, // dieValue
    Player.One,
  )).toBeNull();

  expect(getMoveIfValid(
    STARTING_BOARD_STATE,
    "BAR", // fromPoint
    1, // dieValue
    Player.Two,
  )).toBeNull();
});

test('getMoveIfValid returns null if player is not moving from BAR when they have a checker there', () => {
  const BOTH_PLAYERS_ON_BAR = {
    ...STARTING_BOARD_STATE,
    barState: {
      [Player.One]: 1,
      [Player.Two]: 1,
    }
  };

  expect(getMoveIfValid(
    BOTH_PLAYERS_ON_BAR,
    5, // fromPoint
    1, // dieValue
    Player.One,
  )).toBeNull();

  expect(getMoveIfValid(
    BOTH_PLAYERS_ON_BAR,
    5, // fromPoint
    1, // dieValue
    Player.Two,
  )).toBeNull();
});
