import { deepCloneGameBoardState } from '../gameBoardSlice';
import {
  canPlayerOccupyPoint,
  getDistanceFromHome,
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
    "HOME", // toPoint
    Player.One, // currentPlayer
  )).toEqual(true);

  expect(canPlayerOccupyPoint(
    STARTING_BOARD_STATE, // boardState
    "HOME", // toPoint
    Player.Two, // currentPlayer
  )).toEqual(true);

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
  const TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);

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

  TEST_BOARD.pointsState[20] = {[Player.One]: 0, [Player.Two]: 0};
  TEST_BOARD.pointsState[3] = {[Player.One]: 0, [Player.Two]: 0};

  expect(hasAllCheckersInHomeBoard(
    TEST_BOARD, // boardState
    Player.One, // currentPlayer
  )).toEqual(true);

  expect(hasAllCheckersInHomeBoard(
    TEST_BOARD, // boardState
    Player.Two, // currentPlayer
  )).toEqual(true);

  TEST_BOARD.barState = {[Player.One]: 2, [Player.Two]: 1};

  expect(hasAllCheckersInHomeBoard(
    TEST_BOARD, // boardState
    Player.One, // currentPlayer
  )).toEqual(false);

  expect(hasAllCheckersInHomeBoard(
    TEST_BOARD, // boardState
    Player.Two, // currentPlayer
  )).toEqual(false);
});

test('getDistanceFromHome works', () => {
  expect(getDistanceFromHome(
    "BAR", // fromPoint
    Player.One, // currentPlayer
  )).toEqual(25);

  expect(getDistanceFromHome(
    "BAR", // fromPoint
    Player.Two, // currentPlayer
  )).toEqual(25);

  expect(getDistanceFromHome(
    11, // fromPoint
    Player.One, // currentPlayer
  )).toEqual(12);

  expect(getDistanceFromHome(
    11, // fromPoint
    Player.Two, // currentPlayer
  )).toEqual(13);

  expect(getDistanceFromHome(
    2, // fromPoint
    Player.One, // currentPlayer
  )).toEqual(3);

  expect(getDistanceFromHome(
    2, // fromPoint
    Player.Two, // currentPlayer
  )).toEqual(22);
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
  const BOTH_PLAYERS_ON_BAR = deepCloneGameBoardState(STARTING_BOARD_STATE);
  BOTH_PLAYERS_ON_BAR.barState = {
    [Player.One]: 1,
    [Player.Two]: 1,
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

test('getMoveIfValid returns null if opponent has a point on destination', () => {
  expect(getMoveIfValid(
    STARTING_BOARD_STATE,
    5, // fromPoint
    5, // dieValue
    Player.One,
  )).toBeNull();

  expect(getMoveIfValid(
    STARTING_BOARD_STATE,
    0, // fromPoint
    5, // dieValue
    Player.Two,
  )).toBeNull();

  expect(getMoveIfValid(
    STARTING_BOARD_STATE,
    12, // fromPoint
    1, // dieValue
    Player.One,
  )).toBeNull();

  expect(getMoveIfValid(
    STARTING_BOARD_STATE,
    11, // fromPoint
    1, // dieValue
    Player.Two,
  )).toBeNull();
});

test('getMoveIfValid returns null if player tries to bear off before having everything in home board', () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[0] = {[Player.One]: 2, [Player.Two]: 0};
  TEST_BOARD.pointsState[20] = {[Player.One]: 1, [Player.Two]: 0};

  expect(getMoveIfValid(
    TEST_BOARD,
    0, // fromPoint
    1, // dieValue
    Player.One,
  )).toBeNull();

  TEST_BOARD.pointsState[20] = {[Player.One]: 0, [Player.Two]: 0};
  TEST_BOARD.barState = {[Player.One]: 1, [Player.Two]: 0};

  expect(getMoveIfValid(
    TEST_BOARD,
    0, // fromPoint
    1, // dieValue
    Player.One,
  )).toBeNull();


  TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[22] = {[Player.One]: 0, [Player.Two]: 1};
  TEST_BOARD.pointsState[10] = {[Player.One]: 0, [Player.Two]: 2};

  expect(getMoveIfValid(
    TEST_BOARD,
    22, // fromPoint
    2, // dieValue
    Player.Two,
  )).toBeNull();

  TEST_BOARD.pointsState[10] = {[Player.One]: 0, [Player.Two]: 0};
  TEST_BOARD.barState = {[Player.One]: 0, [Player.Two]: 2};

  expect(getMoveIfValid(
    TEST_BOARD,
    22, // fromPoint
    2, // dieValue
    Player.Two,
  )).toBeNull();
});

test('getMoveIfValid properly handles bearing off rules for Player.One', () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[0] = {[Player.One]: 2, [Player.Two]: 0};
  TEST_BOARD.pointsState[3] = {[Player.One]: 1, [Player.Two]: 0};
  TEST_BOARD.pointsState[4] = {[Player.One]: 1, [Player.Two]: 0};

  // This is an invalid move since there are checkers futher away that can be moved.
  expect(getMoveIfValid(
    TEST_BOARD,
    0, // fromPoint
    2, // dieValue
    Player.One,
  )).toBeNull();
  expect(getMoveIfValid(
    TEST_BOARD,
    3, // fromPoint
    2, // dieValue
    Player.One,
  )).toEqual({
    from: 3,
    to: 1,
  });
  expect(getMoveIfValid(
    TEST_BOARD,
    4, // fromPoint
    2, // dieValue
    Player.One,
  )).toEqual({
    from: 4,
    to: 2,
  });

  // This is a valid move since die roll is exact.
  expect(getMoveIfValid(
    TEST_BOARD,
    3, // fromPoint
    4, // dieValue
    Player.One,
  )).toEqual({
    from: 3,
    to: "HOME",
  });

  // This is an invalid move since there is a checker on the 5 point that
  // needs to be moved first.
  expect(getMoveIfValid(
    TEST_BOARD,
    3, // fromPoint
    5, // dieValue
    Player.One,
  )).toBeNull();
  // Moving the checker on the 5 point is valid.
  expect(getMoveIfValid(
    TEST_BOARD,
    4, // fromPoint
    5, // dieValue
    Player.One,
  )).toEqual({
    from: 4,
    to: 'HOME',
  });

  // This is a valid move since die roll is exact.
  expect(getMoveIfValid(
    TEST_BOARD,
    0, // fromPoint
    1, // dieValue
    Player.One,
  )).toEqual({
    from: 0,
    to: "HOME",
  });
  // This is also a valid move since player is not obligated to bear off.
  expect(getMoveIfValid(
    TEST_BOARD,
    3, // fromPoint
    1, // dieValue
    Player.One,
  )).toEqual({
    from: 3,
    to: 2,
  });
  // This is also a valid move since player is not obligated to bear off.
  expect(getMoveIfValid(
    TEST_BOARD,
    4, // fromPoint
    1, // dieValue
    Player.One,
  )).toEqual({
    from: 4,
    to: 3,
  });
});

test('getMoveIfValid properly handles bearing off rules for Player.Two', () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[23] = {[Player.One]: 0, [Player.Two]: 2};
  TEST_BOARD.pointsState[20] = {[Player.One]: 0, [Player.Two]: 1};
  TEST_BOARD.pointsState[19] = {[Player.One]: 0, [Player.Two]: 1};

  // This is an invalid move since there are checkers futher away that can be moved.
  expect(getMoveIfValid(
    TEST_BOARD,
    23, // fromPoint
    2, // dieValue
    Player.Two,
  )).toBeNull();
  expect(getMoveIfValid(
    TEST_BOARD,
    20, // fromPoint
    2, // dieValue
    Player.Two,
  )).toEqual({
    from: 20,
    to: 22,
  });
  expect(getMoveIfValid(
    TEST_BOARD,
    19, // fromPoint
    2, // dieValue
    Player.Two,
  )).toEqual({
    from: 19,
    to: 21,
  });

  // This is a valid move since die roll is exact.
  expect(getMoveIfValid(
    TEST_BOARD,
    20, // fromPoint
    4, // dieValue
    Player.Two,
  )).toEqual({
    from: 20,
    to: "HOME",
  });

  // This is an invalid move since there is a checker on the 5 point that
  // needs to be moved first.
  expect(getMoveIfValid(
    TEST_BOARD,
    20, // fromPoint
    5, // dieValue
    Player.Two,
  )).toBeNull();
  // Moving the checker on the 5 point is valid.
  expect(getMoveIfValid(
    TEST_BOARD,
    19, // fromPoint
    5, // dieValue
    Player.Two,
  )).toEqual({
    from: 19,
    to: 'HOME',
  });

  // This is a valid move since die roll is exact.
  expect(getMoveIfValid(
    TEST_BOARD,
    23, // fromPoint
    1, // dieValue
    Player.Two,
  )).toEqual({
    from: 23,
    to: "HOME",
  });
  // This is also a valid move since player is not obligated to bear off.
  expect(getMoveIfValid(
    TEST_BOARD,
    20, // fromPoint
    1, // dieValue
    Player.Two,
  )).toEqual({
    from: 20,
    to: 21,
  });
  // This is also a valid move since player is not obligated to bear off.
  expect(getMoveIfValid(
    TEST_BOARD,
    19, // fromPoint
    1, // dieValue
    Player.Two,
  )).toEqual({
    from: 19,
    to: 20,
  });
});

test('getMoveIfValid returns valid Move for Player.One if destination point is occupiable', () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[12] = {[Player.One]: 0, [Player.Two]: 0};
  TEST_BOARD.pointsState[13] = {[Player.One]: 1, [Player.Two]: 0};
  TEST_BOARD.pointsState[14] = {[Player.One]: 2, [Player.Two]: 0};
  TEST_BOARD.pointsState[15] = {[Player.One]: 0, [Player.Two]: 1};
  TEST_BOARD.pointsState[16] = {[Player.One]: 0, [Player.Two]: 3};
  TEST_BOARD.pointsState[17] = {[Player.One]: 2, [Player.Two]: 0};

  // Opponent has a point at destination.
  expect(getMoveIfValid(
    TEST_BOARD,
    17, // fromPoint
    1, // dieValue
    Player.One,
  )).toBeNull();

  // Opponent has a blot at destination.
  expect(getMoveIfValid(
    TEST_BOARD,
    17, // fromPoint
    2, // dieValue
    Player.One,
  )).toEqual({
    from: 17,
    to: 15,
  });

  // Player already has 2 checkers at destination.
  expect(getMoveIfValid(
    TEST_BOARD,
    17, // fromPoint
    3, // dieValue
    Player.One,
  )).toEqual({
    from: 17,
    to: 14,
  });

  // Player already has a checker at destination.
  expect(getMoveIfValid(
    TEST_BOARD,
    17, // fromPoint
    4, // dieValue
    Player.One,
  )).toEqual({
    from: 17,
    to: 13,
  });

  // Destination is empty.
  expect(getMoveIfValid(
    TEST_BOARD,
    17, // fromPoint
    5, // dieValue
    Player.One,
  )).toEqual({
    from: 17,
    to: 12,
  });
});

test('getMoveIfValid returns valid Move for Player.Two if destination point is occupiable', () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[12] = {[Player.One]: 0, [Player.Two]: 2};
  TEST_BOARD.pointsState[13] = {[Player.One]: 3, [Player.Two]: 0};
  TEST_BOARD.pointsState[14] = {[Player.One]: 1, [Player.Two]: 0};
  TEST_BOARD.pointsState[15] = {[Player.One]: 0, [Player.Two]: 2};
  TEST_BOARD.pointsState[16] = {[Player.One]: 0, [Player.Two]: 1};
  TEST_BOARD.pointsState[17] = {[Player.One]: 0, [Player.Two]: 0};

  // Opponent has a point at destination.
  expect(getMoveIfValid(
    TEST_BOARD,
    12, // fromPoint
    1, // dieValue
    Player.Two,
  )).toBeNull();

  // Opponent has a blot at destination.
  expect(getMoveIfValid(
    TEST_BOARD,
    12, // fromPoint
    2, // dieValue
    Player.Two,
  )).toEqual({
    from: 12,
    to: 14,
  });

  // Player already has 2 checkers at destination.
  expect(getMoveIfValid(
    TEST_BOARD,
    12, // fromPoint
    3, // dieValue
    Player.Two,
  )).toEqual({
    from: 12,
    to: 15,
  });

  // Player already has a checker at destination.
  expect(getMoveIfValid(
    TEST_BOARD,
    12, // fromPoint
    4, // dieValue
    Player.Two,
  )).toEqual({
    from: 12,
    to: 16,
  });

  // Destination is empty.
  expect(getMoveIfValid(
    TEST_BOARD,
    12, // fromPoint
    5, // dieValue
    Player.Two,
  )).toEqual({
    from: 12,
    to: 17,
  });
});