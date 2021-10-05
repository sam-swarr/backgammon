import { getIndexAfterMoving, getMoveIfValid, getPointStateAtIndex } from '../moves'; 
import { STARTING_BOARD_STATE } from '../../Constants'
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
