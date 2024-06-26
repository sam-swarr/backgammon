import {
  applyMoveToGameBoardState,
  areBoardStatesEquivalent,
  deepCloneGameBoardState,
  didPlayerWin,
  pipCount,
} from "../gameBoardSlice";
import { EMPTY_BOARD_STATE, STARTING_BOARD_STATE } from "../../Constants";
import { GameResult, HitStatus, Player } from "../../Types";

test("deepCloneGameBoardState works", () => {
  const BOARD_A = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  BOARD_A.barState[Player.One] = 1;
  BOARD_A.homeState[Player.Two] = 2;
  BOARD_A.pointsState[10][Player.One] = 1;
  BOARD_A.pointsState[11][Player.Two] = 4;

  const BOARD_B = deepCloneGameBoardState(BOARD_A);

  expect(areBoardStatesEquivalent(BOARD_A, BOARD_B)).toEqual(true);

  BOARD_B.barState[Player.One] = 2;

  expect(areBoardStatesEquivalent(BOARD_A, BOARD_B)).toEqual(false);

  BOARD_A.barState[Player.One] = 2;

  expect(areBoardStatesEquivalent(BOARD_A, BOARD_B)).toEqual(true);

  BOARD_B.homeState[Player.One] = 1;

  expect(areBoardStatesEquivalent(BOARD_A, BOARD_B)).toEqual(false);

  BOARD_A.homeState[Player.One] = 1;

  expect(areBoardStatesEquivalent(BOARD_A, BOARD_B)).toEqual(true);

  BOARD_B.pointsState[10][Player.One] = 2;

  expect(areBoardStatesEquivalent(BOARD_A, BOARD_B)).toEqual(false);

  BOARD_A.pointsState[10][Player.One] = 2;
});

test("applyMoveToGameBoardState handles entering from the bar", () => {
  const TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.barState[Player.One] = 2;

  const EXPECTED = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  EXPECTED.barState[Player.One] = 1;
  EXPECTED.pointsState[22][Player.One] = 1;

  const RESULT = applyMoveToGameBoardState(TEST_BOARD, {
    from: "BAR",
    to: 22,
    dieUsed: 2,
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.One,
  });

  expect(areBoardStatesEquivalent(RESULT, EXPECTED)).toEqual(true);
});

test("applyMoveToGameBoardState handles bearing off", () => {
  const TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[5][Player.One] = 2;

  const EXPECTED = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  EXPECTED.pointsState[5][Player.One] = 1;
  EXPECTED.homeState[Player.One] = 1;

  const RESULT = applyMoveToGameBoardState(TEST_BOARD, {
    from: 5,
    to: "HOME",
    dieUsed: 6,
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.One,
  });

  expect(areBoardStatesEquivalent(RESULT, EXPECTED)).toEqual(true);
});

test("applyMoveToGameBoardState handles moving", () => {
  const TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[5][Player.One] = 2;

  const EXPECTED = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  EXPECTED.pointsState[5][Player.One] = 1;
  EXPECTED.pointsState[4][Player.One] = 1;

  const RESULT = applyMoveToGameBoardState(TEST_BOARD, {
    from: 5,
    to: 4,
    dieUsed: 1,
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.One,
  });

  expect(areBoardStatesEquivalent(RESULT, EXPECTED)).toEqual(true);
});

test("applyMoveToGameBoardState handles hitting a blot", () => {
  const TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[22][Player.Two] = 2;
  TEST_BOARD.pointsState[23][Player.One] = 1;

  const EXPECTED = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  EXPECTED.pointsState[22][Player.Two] = 1;
  EXPECTED.pointsState[23][Player.Two] = 1;
  EXPECTED.barState[Player.One] = 1;

  const RESULT = applyMoveToGameBoardState(TEST_BOARD, {
    from: 22,
    to: 23,
    dieUsed: 1,
    hitStatus: HitStatus.IsHit,
    checkerOwner: Player.Two,
  });

  expect(areBoardStatesEquivalent(RESULT, EXPECTED)).toEqual(true);
});

test("applyMoveToGameBoardState handles hitting a blot 2", () => {
  const TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[12][Player.One] = 1;
  TEST_BOARD.pointsState[10][Player.Two] = 1;

  const EXPECTED = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  EXPECTED.pointsState[10][Player.One] = 1;
  EXPECTED.barState[Player.Two] = 1;

  const RESULT = applyMoveToGameBoardState(TEST_BOARD, {
    from: 12,
    to: 10,
    dieUsed: 2,
    hitStatus: HitStatus.IsHit,
    checkerOwner: Player.One,
  });

  expect(areBoardStatesEquivalent(RESULT, EXPECTED)).toEqual(true);
});

test("applyMoveToGameBoardState handles undoing a hit", () => {
  const TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[22][Player.Two] = 1;
  TEST_BOARD.pointsState[23][Player.Two] = 1;
  TEST_BOARD.barState[Player.One] = 1;

  const EXPECTED = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  EXPECTED.pointsState[22][Player.Two] = 2;
  EXPECTED.pointsState[23][Player.One] = 1;

  const RESULT = applyMoveToGameBoardState(TEST_BOARD, {
    from: 23,
    to: 22,
    dieUsed: 1,
    hitStatus: HitStatus.UndoesHit,
    checkerOwner: Player.Two,
  });

  expect(areBoardStatesEquivalent(RESULT, EXPECTED)).toEqual(true);
});

test("applyMoveToGameBoardState handles undoing a hit 2", () => {
  const TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[10][Player.One] = 1;
  TEST_BOARD.barState[Player.Two] = 1;

  const EXPECTED = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  EXPECTED.pointsState[12][Player.One] = 1;
  EXPECTED.pointsState[10][Player.Two] = 1;

  const RESULT = applyMoveToGameBoardState(TEST_BOARD, {
    from: 10,
    to: 12,
    dieUsed: 2,
    hitStatus: HitStatus.UndoesHit,
    checkerOwner: Player.One,
  });

  expect(areBoardStatesEquivalent(RESULT, EXPECTED)).toEqual(true);
});

test("applyMoveToGameBoardState handles undoing two hits in a row", () => {
  const TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[12][Player.One] = 1;
  TEST_BOARD.barState[Player.Two] = 2;

  const EXPECTED_ONE = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  EXPECTED_ONE.pointsState[12][Player.Two] = 1;
  EXPECTED_ONE.pointsState[10][Player.One] = 1;
  EXPECTED_ONE.barState[Player.Two] = 1;

  const RESULT = applyMoveToGameBoardState(TEST_BOARD, {
    from: 12,
    to: 10,
    dieUsed: 2,
    hitStatus: HitStatus.UndoesHit,
    checkerOwner: Player.One,
  });

  expect(areBoardStatesEquivalent(RESULT, EXPECTED_ONE)).toEqual(true);

  const EXPECTED_TWO = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  EXPECTED_TWO.pointsState[12][Player.Two] = 1;
  EXPECTED_TWO.pointsState[10][Player.Two] = 1;
  EXPECTED_TWO.pointsState[7][Player.One] = 1;

  const RESULT_2 = applyMoveToGameBoardState(EXPECTED_ONE, {
    from: 10,
    to: 7,
    dieUsed: 3,
    hitStatus: HitStatus.UndoesHit,
    checkerOwner: Player.One,
  });

  expect(areBoardStatesEquivalent(RESULT, EXPECTED_ONE)).toEqual(true);
});

test("didPlayerWin detects game is not over", () => {
  const TEST_BOARD = deepCloneGameBoardState(STARTING_BOARD_STATE);

  expect(didPlayerWin(TEST_BOARD, Player.One)).toEqual(GameResult.NotOver);

  expect(didPlayerWin(TEST_BOARD, Player.Two)).toEqual(GameResult.NotOver);
});

test("didPlayerWin detects normal win for player 1", () => {
  const TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.homeState[Player.One] = 15;
  TEST_BOARD.homeState[Player.Two] = 14;
  TEST_BOARD.pointsState[22][Player.Two] = 1;

  expect(didPlayerWin(TEST_BOARD, Player.One)).toEqual(GameResult.PlayerWon);

  expect(didPlayerWin(TEST_BOARD, Player.Two)).toEqual(GameResult.NotOver);
});

test("didPlayerWin detects normal win for player 2", () => {
  const TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.homeState[Player.One] = 14;
  TEST_BOARD.homeState[Player.Two] = 15;
  TEST_BOARD.pointsState[3][Player.One] = 1;

  expect(didPlayerWin(TEST_BOARD, Player.One)).toEqual(GameResult.NotOver);

  expect(didPlayerWin(TEST_BOARD, Player.Two)).toEqual(GameResult.PlayerWon);
});

test("didPlayerWin detects gammon win for player 1", () => {
  const TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.homeState[Player.One] = 15;
  TEST_BOARD.homeState[Player.Two] = 0;
  TEST_BOARD.pointsState[17][Player.Two] = 2;
  TEST_BOARD.pointsState[21][Player.Two] = 5;
  TEST_BOARD.pointsState[22][Player.Two] = 4;
  TEST_BOARD.pointsState[23][Player.Two] = 4;

  expect(didPlayerWin(TEST_BOARD, Player.One)).toEqual(
    GameResult.PlayerWonGammon
  );

  expect(didPlayerWin(TEST_BOARD, Player.Two)).toEqual(GameResult.NotOver);
});

test("didPlayerWin detects gammon win for player 2", () => {
  const TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.homeState[Player.One] = 0;
  TEST_BOARD.homeState[Player.Two] = 15;
  TEST_BOARD.pointsState[8][Player.One] = 2;
  TEST_BOARD.pointsState[4][Player.One] = 5;
  TEST_BOARD.pointsState[3][Player.One] = 4;
  TEST_BOARD.pointsState[1][Player.One] = 4;

  expect(didPlayerWin(TEST_BOARD, Player.One)).toEqual(GameResult.NotOver);

  expect(didPlayerWin(TEST_BOARD, Player.Two)).toEqual(
    GameResult.PlayerWonGammon
  );
});

test("didPlayerWin detects backgammon win for player 1", () => {
  // Scenario where other player has checker on the bar.
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.homeState[Player.One] = 15;
  TEST_BOARD.homeState[Player.Two] = 0;
  TEST_BOARD.barState[Player.Two] = 1;
  TEST_BOARD.pointsState[17][Player.Two] = 2;
  TEST_BOARD.pointsState[21][Player.Two] = 4;
  TEST_BOARD.pointsState[22][Player.Two] = 4;
  TEST_BOARD.pointsState[23][Player.Two] = 4;

  expect(didPlayerWin(TEST_BOARD, Player.One)).toEqual(
    GameResult.PlayerWonBackgammon
  );

  expect(didPlayerWin(TEST_BOARD, Player.Two)).toEqual(GameResult.NotOver);

  // Scenario where other player has checker in homeboard.
  TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.homeState[Player.One] = 15;
  TEST_BOARD.homeState[Player.Two] = 0;
  TEST_BOARD.pointsState[4][Player.Two] = 1;
  TEST_BOARD.pointsState[17][Player.Two] = 2;
  TEST_BOARD.pointsState[21][Player.Two] = 4;
  TEST_BOARD.pointsState[22][Player.Two] = 4;
  TEST_BOARD.pointsState[23][Player.Two] = 4;

  expect(didPlayerWin(TEST_BOARD, Player.One)).toEqual(
    GameResult.PlayerWonBackgammon
  );

  expect(didPlayerWin(TEST_BOARD, Player.Two)).toEqual(GameResult.NotOver);
});

test("didPlayerWin detects backgammon win for player 2", () => {
  // Scenario where other player has checker on the bar.
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.homeState[Player.One] = 0;
  TEST_BOARD.homeState[Player.Two] = 15;
  TEST_BOARD.barState[Player.One] = 1;
  TEST_BOARD.pointsState[9][Player.One] = 2;
  TEST_BOARD.pointsState[4][Player.One] = 4;
  TEST_BOARD.pointsState[3][Player.One] = 4;
  TEST_BOARD.pointsState[1][Player.One] = 4;

  expect(didPlayerWin(TEST_BOARD, Player.One)).toEqual(GameResult.NotOver);

  expect(didPlayerWin(TEST_BOARD, Player.Two)).toEqual(
    GameResult.PlayerWonBackgammon
  );

  // Scenario where other player has checker in homeboard.
  TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.homeState[Player.One] = 0;
  TEST_BOARD.homeState[Player.Two] = 15;
  TEST_BOARD.pointsState[19][Player.One] = 1;
  TEST_BOARD.pointsState[9][Player.One] = 2;
  TEST_BOARD.pointsState[4][Player.One] = 4;
  TEST_BOARD.pointsState[3][Player.One] = 4;
  TEST_BOARD.pointsState[1][Player.One] = 4;

  expect(didPlayerWin(TEST_BOARD, Player.One)).toEqual(GameResult.NotOver);

  expect(didPlayerWin(TEST_BOARD, Player.Two)).toEqual(
    GameResult.PlayerWonBackgammon
  );
});

test("pipCount correctly calculates total pips remaining", () => {
  // Starting totals
  let TEST_BOARD = deepCloneGameBoardState(STARTING_BOARD_STATE);
  expect(pipCount(TEST_BOARD, Player.One)).toEqual(167);
  expect(pipCount(TEST_BOARD, Player.Two)).toEqual(167);

  // Empty board
  TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  expect(pipCount(TEST_BOARD, Player.One)).toEqual(0);
  expect(pipCount(TEST_BOARD, Player.Two)).toEqual(0);

  // Checkers that are home do not count
  TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.homeState[Player.One] = 1;
  TEST_BOARD.homeState[Player.Two] = 1;
  expect(pipCount(TEST_BOARD, Player.One)).toEqual(0);
  expect(pipCount(TEST_BOARD, Player.Two)).toEqual(0);

  // Checkers that are on the bar count for 25 pips
  TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.barState[Player.One] = 1;
  TEST_BOARD.barState[Player.Two] = 1;
  expect(pipCount(TEST_BOARD, Player.One)).toEqual(25);
  expect(pipCount(TEST_BOARD, Player.Two)).toEqual(25);
});
