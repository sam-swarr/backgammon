import {
  applyMoveToGameBoardState,
  deepCloneGameBoardState,
} from "../gameBoardSlice";
import {
  areProvisionalMovesSubmittable,
  CanOccupyResult,
  canPlayerOccupyPoint,
  getAllMoveSetsFromStartingPoint,
  getAllPossibleMoveSets,
  getAllPossibleMovesForGivenDieRoll,
  getDistanceFromHome,
  getIndexAfterMoving,
  getInverseMove,
  getMoveIfValid,
  getPointStateAtIndex,
  hasAllCheckersInHomeBoard,
  maxDieValueUsedInMoveSet,
} from "../moves";
import { EMPTY_BOARD_STATE, STARTING_BOARD_STATE } from "../../Constants";
import { HitStatus, Move, Player } from "../../Types";

test("getPointStateAtIndex works", () => {
  expect(getPointStateAtIndex(STARTING_BOARD_STATE, 0)).toEqual({
    [Player.One]: 0,
    [Player.Two]: 2,
  });

  expect(getPointStateAtIndex(STARTING_BOARD_STATE, 8)).toEqual({
    [Player.One]: 0,
    [Player.Two]: 0,
  });

  expect(getPointStateAtIndex(STARTING_BOARD_STATE, 12)).toEqual({
    [Player.One]: 5,
    [Player.Two]: 0,
  });

  expect(getPointStateAtIndex(STARTING_BOARD_STATE, "BAR")).toEqual({
    [Player.One]: 0,
    [Player.Two]: 0,
  });
});

test("getIndexAfterMoving works", () => {
  expect(
    getIndexAfterMoving(
      23, // fromPoint
      1, // dieValue
      Player.One // currentPlayer
    )
  ).toEqual(22);

  expect(
    getIndexAfterMoving(
      0, // fromPoint
      1, // dieValue
      Player.Two // currentPlayer
    )
  ).toEqual(1);

  expect(
    getIndexAfterMoving(
      "BAR", // fromPoint
      3, // dieValue
      Player.One // currentPlayer
    )
  ).toEqual(21);

  expect(
    getIndexAfterMoving(
      "BAR", // fromPoint
      5, // dieValue
      Player.Two // currentPlayer
    )
  ).toEqual(4);

  expect(
    getIndexAfterMoving(
      2, // fromPoint
      2, // dieValue
      Player.One // currentPlayer
    )
  ).toEqual(0);

  expect(
    getIndexAfterMoving(
      2, // fromPoint
      3, // dieValue
      Player.One // currentPlayer
    )
  ).toEqual("HOME");

  expect(
    getIndexAfterMoving(
      22, // fromPoint
      1, // dieValue
      Player.Two // currentPlayer
    )
  ).toEqual(23);

  expect(
    getIndexAfterMoving(
      23, // fromPoint
      1, // dieValue
      Player.Two // currentPlayer
    )
  ).toEqual("HOME");
});

test("canPlayerOccupyPoint works", () => {
  expect(
    canPlayerOccupyPoint(
      STARTING_BOARD_STATE, // boardState
      "HOME", // toPoint
      Player.One // currentPlayer
    )
  ).toEqual(CanOccupyResult.Yes);

  expect(
    canPlayerOccupyPoint(
      STARTING_BOARD_STATE, // boardState
      "HOME", // toPoint
      Player.Two // currentPlayer
    )
  ).toEqual(CanOccupyResult.Yes);

  expect(
    canPlayerOccupyPoint(
      STARTING_BOARD_STATE, // boardState
      23, // toPoint
      Player.One // currentPlayer
    )
  ).toEqual(CanOccupyResult.Yes);

  expect(
    canPlayerOccupyPoint(
      STARTING_BOARD_STATE, // boardState
      23, // toPoint
      Player.Two // currentPlayer
    )
  ).toEqual(CanOccupyResult.No);

  expect(
    canPlayerOccupyPoint(
      STARTING_BOARD_STATE, // boardState
      22, // toPoint
      Player.One // currentPlayer
    )
  ).toEqual(CanOccupyResult.Yes);

  expect(
    canPlayerOccupyPoint(
      STARTING_BOARD_STATE, // boardState
      22, // toPoint
      Player.Two // currentPlayer
    )
  ).toEqual(CanOccupyResult.Yes);

  expect(
    canPlayerOccupyPoint(
      STARTING_BOARD_STATE, // boardState
      0, // toPoint
      Player.One // currentPlayer
    )
  ).toEqual(CanOccupyResult.No);

  expect(
    canPlayerOccupyPoint(
      STARTING_BOARD_STATE, // boardState
      0, // toPoint
      Player.Two // currentPlayer
    )
  ).toEqual(CanOccupyResult.Yes);
});

test("hasAllCheckersInHomeBoard works", () => {
  const TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);

  TEST_BOARD.pointsState[1] = { [Player.One]: 2, [Player.Two]: 0 };
  TEST_BOARD.pointsState[5] = { [Player.One]: 4, [Player.Two]: 0 };

  TEST_BOARD.pointsState[23] = { [Player.One]: 0, [Player.Two]: 1 };
  TEST_BOARD.pointsState[22] = { [Player.One]: 0, [Player.Two]: 3 };

  expect(
    hasAllCheckersInHomeBoard(
      TEST_BOARD, // boardState
      Player.One // currentPlayer
    )
  ).toEqual(true);

  expect(
    hasAllCheckersInHomeBoard(
      TEST_BOARD, // boardState
      Player.Two // currentPlayer
    )
  ).toEqual(true);

  TEST_BOARD.pointsState[20] = { [Player.One]: 1, [Player.Two]: 0 };

  expect(
    hasAllCheckersInHomeBoard(
      TEST_BOARD, // boardState
      Player.One // currentPlayer
    )
  ).toEqual(false);

  expect(
    hasAllCheckersInHomeBoard(
      TEST_BOARD, // boardState
      Player.Two // currentPlayer
    )
  ).toEqual(true);

  TEST_BOARD.pointsState[3] = { [Player.One]: 0, [Player.Two]: 1 };

  expect(
    hasAllCheckersInHomeBoard(
      TEST_BOARD, // boardState
      Player.Two // currentPlayer
    )
  ).toEqual(false);

  TEST_BOARD.pointsState[20] = { [Player.One]: 0, [Player.Two]: 0 };
  TEST_BOARD.pointsState[3] = { [Player.One]: 0, [Player.Two]: 0 };

  expect(
    hasAllCheckersInHomeBoard(
      TEST_BOARD, // boardState
      Player.One // currentPlayer
    )
  ).toEqual(true);

  expect(
    hasAllCheckersInHomeBoard(
      TEST_BOARD, // boardState
      Player.Two // currentPlayer
    )
  ).toEqual(true);

  TEST_BOARD.barState = { [Player.One]: 2, [Player.Two]: 1 };

  expect(
    hasAllCheckersInHomeBoard(
      TEST_BOARD, // boardState
      Player.One // currentPlayer
    )
  ).toEqual(false);

  expect(
    hasAllCheckersInHomeBoard(
      TEST_BOARD, // boardState
      Player.Two // currentPlayer
    )
  ).toEqual(false);
});

test("getDistanceFromHome works", () => {
  expect(
    getDistanceFromHome(
      "BAR", // fromPoint
      Player.One // currentPlayer
    )
  ).toEqual(25);

  expect(
    getDistanceFromHome(
      "BAR", // fromPoint
      Player.Two // currentPlayer
    )
  ).toEqual(25);

  expect(
    getDistanceFromHome(
      11, // fromPoint
      Player.One // currentPlayer
    )
  ).toEqual(12);

  expect(
    getDistanceFromHome(
      11, // fromPoint
      Player.Two // currentPlayer
    )
  ).toEqual(13);

  expect(
    getDistanceFromHome(
      2, // fromPoint
      Player.One // currentPlayer
    )
  ).toEqual(3);

  expect(
    getDistanceFromHome(
      2, // fromPoint
      Player.Two // currentPlayer
    )
  ).toEqual(22);
});

test("getMoveIfValid returns null if currentPlayer does not occupy fromPoint", () => {
  expect(
    getMoveIfValid(
      STARTING_BOARD_STATE,
      0, // fromPoint
      1, // dieValue
      Player.One
    )
  ).toBeNull();

  expect(
    getMoveIfValid(
      STARTING_BOARD_STATE,
      5, // fromPoint
      1, // dieValue
      Player.Two
    )
  ).toBeNull();

  expect(
    getMoveIfValid(
      STARTING_BOARD_STATE,
      "BAR", // fromPoint
      1, // dieValue
      Player.One
    )
  ).toBeNull();

  expect(
    getMoveIfValid(
      STARTING_BOARD_STATE,
      "BAR", // fromPoint
      1, // dieValue
      Player.Two
    )
  ).toBeNull();
});

test("getMoveIfValid returns null if player is not moving from BAR when they have a checker there", () => {
  const BOTH_PLAYERS_ON_BAR = deepCloneGameBoardState(STARTING_BOARD_STATE);
  BOTH_PLAYERS_ON_BAR.barState = {
    [Player.One]: 1,
    [Player.Two]: 1,
  };

  expect(
    getMoveIfValid(
      BOTH_PLAYERS_ON_BAR,
      5, // fromPoint
      1, // dieValue
      Player.One
    )
  ).toBeNull();

  expect(
    getMoveIfValid(
      BOTH_PLAYERS_ON_BAR,
      5, // fromPoint
      1, // dieValue
      Player.Two
    )
  ).toBeNull();
});

test("getMoveIfValid returns null if opponent has a point on destination", () => {
  expect(
    getMoveIfValid(
      STARTING_BOARD_STATE,
      5, // fromPoint
      5, // dieValue
      Player.One
    )
  ).toBeNull();

  expect(
    getMoveIfValid(
      STARTING_BOARD_STATE,
      0, // fromPoint
      5, // dieValue
      Player.Two
    )
  ).toBeNull();

  expect(
    getMoveIfValid(
      STARTING_BOARD_STATE,
      12, // fromPoint
      1, // dieValue
      Player.One
    )
  ).toBeNull();

  expect(
    getMoveIfValid(
      STARTING_BOARD_STATE,
      11, // fromPoint
      1, // dieValue
      Player.Two
    )
  ).toBeNull();
});

test("getMoveIfValid returns null if player tries to bear off before having everything in home board", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[0] = { [Player.One]: 2, [Player.Two]: 0 };
  TEST_BOARD.pointsState[20] = { [Player.One]: 1, [Player.Two]: 0 };

  expect(
    getMoveIfValid(
      TEST_BOARD,
      0, // fromPoint
      1, // dieValue
      Player.One
    )
  ).toBeNull();

  TEST_BOARD.pointsState[20] = { [Player.One]: 0, [Player.Two]: 0 };
  TEST_BOARD.barState = { [Player.One]: 1, [Player.Two]: 0 };

  expect(
    getMoveIfValid(
      TEST_BOARD,
      0, // fromPoint
      1, // dieValue
      Player.One
    )
  ).toBeNull();

  TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[22] = { [Player.One]: 0, [Player.Two]: 1 };
  TEST_BOARD.pointsState[10] = { [Player.One]: 0, [Player.Two]: 2 };

  expect(
    getMoveIfValid(
      TEST_BOARD,
      22, // fromPoint
      2, // dieValue
      Player.Two
    )
  ).toBeNull();

  TEST_BOARD.pointsState[10] = { [Player.One]: 0, [Player.Two]: 0 };
  TEST_BOARD.barState = { [Player.One]: 0, [Player.Two]: 2 };

  expect(
    getMoveIfValid(
      TEST_BOARD,
      22, // fromPoint
      2, // dieValue
      Player.Two
    )
  ).toBeNull();
});

test("getMoveIfValid properly handles bearing off rules for Player.One", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[0] = { [Player.One]: 2, [Player.Two]: 0 };
  TEST_BOARD.pointsState[3] = { [Player.One]: 1, [Player.Two]: 0 };
  TEST_BOARD.pointsState[4] = { [Player.One]: 1, [Player.Two]: 0 };

  // This is an invalid move since there are checkers futher away that can be moved.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      0, // fromPoint
      2, // dieValue
      Player.One
    )
  ).toBeNull();
  expect(
    getMoveIfValid(
      TEST_BOARD,
      3, // fromPoint
      2, // dieValue
      Player.One
    )
  ).toEqual({
    dieUsed: 2,
    from: 3,
    to: 1,
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.One,
  });
  expect(
    getMoveIfValid(
      TEST_BOARD,
      4, // fromPoint
      2, // dieValue
      Player.One
    )
  ).toEqual({
    dieUsed: 2,
    from: 4,
    to: 2,
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.One,
  });

  // This is a valid move since die roll is exact.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      3, // fromPoint
      4, // dieValue
      Player.One
    )
  ).toEqual({
    dieUsed: 4,
    from: 3,
    to: "HOME",
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.One,
  });

  // This is an invalid move since there is a checker on the 5 point that
  // needs to be moved first.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      3, // fromPoint
      5, // dieValue
      Player.One
    )
  ).toBeNull();
  // Moving the checker on the 5 point is valid.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      4, // fromPoint
      5, // dieValue
      Player.One
    )
  ).toEqual({
    dieUsed: 5,
    from: 4,
    to: "HOME",
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.One,
  });

  // This is a valid move since die roll is exact.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      0, // fromPoint
      1, // dieValue
      Player.One
    )
  ).toEqual({
    dieUsed: 1,
    from: 0,
    to: "HOME",
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.One,
  });
  // This is also a valid move since player is not obligated to bear off.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      3, // fromPoint
      1, // dieValue
      Player.One
    )
  ).toEqual({
    dieUsed: 1,
    from: 3,
    to: 2,
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.One,
  });
  // This is also a valid move since player is not obligated to bear off.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      4, // fromPoint
      1, // dieValue
      Player.One
    )
  ).toEqual({
    dieUsed: 1,
    from: 4,
    to: 3,
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.One,
  });
});

test("getMoveIfValid properly handles bearing off rules for Player.Two", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[23] = { [Player.One]: 0, [Player.Two]: 2 };
  TEST_BOARD.pointsState[20] = { [Player.One]: 0, [Player.Two]: 1 };
  TEST_BOARD.pointsState[19] = { [Player.One]: 0, [Player.Two]: 1 };

  // This is an invalid move since there are checkers futher away that can be moved.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      23, // fromPoint
      2, // dieValue
      Player.Two
    )
  ).toBeNull();
  expect(
    getMoveIfValid(
      TEST_BOARD,
      20, // fromPoint
      2, // dieValue
      Player.Two
    )
  ).toEqual({
    dieUsed: 2,
    from: 20,
    to: 22,
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.Two,
  });
  expect(
    getMoveIfValid(
      TEST_BOARD,
      19, // fromPoint
      2, // dieValue
      Player.Two
    )
  ).toEqual({
    dieUsed: 2,
    from: 19,
    to: 21,
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.Two,
  });

  // This is a valid move since die roll is exact.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      20, // fromPoint
      4, // dieValue
      Player.Two
    )
  ).toEqual({
    dieUsed: 4,
    from: 20,
    to: "HOME",
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.Two,
  });

  // This is an invalid move since there is a checker on the 5 point that
  // needs to be moved first.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      20, // fromPoint
      5, // dieValue
      Player.Two
    )
  ).toBeNull();
  // Moving the checker on the 5 point is valid.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      19, // fromPoint
      5, // dieValue
      Player.Two
    )
  ).toEqual({
    dieUsed: 5,
    from: 19,
    to: "HOME",
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.Two,
  });

  // This is a valid move since die roll is exact.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      23, // fromPoint
      1, // dieValue
      Player.Two
    )
  ).toEqual({
    dieUsed: 1,
    from: 23,
    to: "HOME",
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.Two,
  });
  // This is also a valid move since player is not obligated to bear off.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      20, // fromPoint
      1, // dieValue
      Player.Two
    )
  ).toEqual({
    dieUsed: 1,
    from: 20,
    to: 21,
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.Two,
  });
  // This is also a valid move since player is not obligated to bear off.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      19, // fromPoint
      1, // dieValue
      Player.Two
    )
  ).toEqual({
    dieUsed: 1,
    from: 19,
    to: 20,
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.Two,
  });
});

test("getMoveIfValid returns valid Move for Player.One if destination point is occupiable", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[12] = { [Player.One]: 0, [Player.Two]: 0 };
  TEST_BOARD.pointsState[13] = { [Player.One]: 1, [Player.Two]: 0 };
  TEST_BOARD.pointsState[14] = { [Player.One]: 2, [Player.Two]: 0 };
  TEST_BOARD.pointsState[15] = { [Player.One]: 0, [Player.Two]: 1 };
  TEST_BOARD.pointsState[16] = { [Player.One]: 0, [Player.Two]: 3 };
  TEST_BOARD.pointsState[17] = { [Player.One]: 2, [Player.Two]: 0 };

  // Opponent has a point at destination.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      17, // fromPoint
      1, // dieValue
      Player.One
    )
  ).toBeNull();

  // Opponent has a blot at destination.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      17, // fromPoint
      2, // dieValue
      Player.One
    )
  ).toEqual({
    dieUsed: 2,
    from: 17,
    to: 15,
    hitStatus: HitStatus.IsHit,
    checkerOwner: Player.One,
  });

  // Player already has 2 checkers at destination.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      17, // fromPoint
      3, // dieValue
      Player.One
    )
  ).toEqual({
    dieUsed: 3,
    from: 17,
    to: 14,
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.One,
  });

  // Player already has a checker at destination.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      17, // fromPoint
      4, // dieValue
      Player.One
    )
  ).toEqual({
    dieUsed: 4,
    from: 17,
    to: 13,
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.One,
  });

  // Destination is empty.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      17, // fromPoint
      5, // dieValue
      Player.One
    )
  ).toEqual({
    dieUsed: 5,
    from: 17,
    to: 12,
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.One,
  });
});

test("getMoveIfValid returns valid Move for Player.Two if destination point is occupiable", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[12] = { [Player.One]: 0, [Player.Two]: 2 };
  TEST_BOARD.pointsState[13] = { [Player.One]: 3, [Player.Two]: 0 };
  TEST_BOARD.pointsState[14] = { [Player.One]: 1, [Player.Two]: 0 };
  TEST_BOARD.pointsState[15] = { [Player.One]: 0, [Player.Two]: 2 };
  TEST_BOARD.pointsState[16] = { [Player.One]: 0, [Player.Two]: 1 };
  TEST_BOARD.pointsState[17] = { [Player.One]: 0, [Player.Two]: 0 };

  // Opponent has a point at destination.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      12, // fromPoint
      1, // dieValue
      Player.Two
    )
  ).toBeNull();

  // Opponent has a blot at destination.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      12, // fromPoint
      2, // dieValue
      Player.Two
    )
  ).toEqual({
    dieUsed: 2,
    from: 12,
    to: 14,
    hitStatus: HitStatus.IsHit,
    checkerOwner: Player.Two,
  });

  // Player already has 2 checkers at destination.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      12, // fromPoint
      3, // dieValue
      Player.Two
    )
  ).toEqual({
    dieUsed: 3,
    from: 12,
    to: 15,
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.Two,
  });

  // Player already has a checker at destination.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      12, // fromPoint
      4, // dieValue
      Player.Two
    )
  ).toEqual({
    dieUsed: 4,
    from: 12,
    to: 16,
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.Two,
  });

  // Destination is empty.
  expect(
    getMoveIfValid(
      TEST_BOARD,
      12, // fromPoint
      5, // dieValue
      Player.Two
    )
  ).toEqual({
    dieUsed: 5,
    from: 12,
    to: 17,
    hitStatus: HitStatus.NoHit,
    checkerOwner: Player.Two,
  });
});

test("getAllPossibleMovesForGivenDieRoll works", () => {
  expect(
    getAllPossibleMovesForGivenDieRoll(EMPTY_BOARD_STATE, 1, Player.One)
  ).toEqual([]);

  expect(
    getAllPossibleMovesForGivenDieRoll(STARTING_BOARD_STATE, 1, Player.One)
  ).toEqual([
    {
      dieUsed: 1,
      from: 5,
      to: 4,
      hitStatus: HitStatus.NoHit,
      checkerOwner: Player.One,
    },
    {
      dieUsed: 1,
      from: 7,
      to: 6,
      hitStatus: HitStatus.NoHit,
      checkerOwner: Player.One,
    },
    {
      dieUsed: 1,
      from: 23,
      to: 22,
      hitStatus: HitStatus.NoHit,
      checkerOwner: Player.One,
    },
  ]);

  expect(
    getAllPossibleMovesForGivenDieRoll(STARTING_BOARD_STATE, 1, Player.Two)
  ).toEqual([
    {
      dieUsed: 1,
      from: 0,
      to: 1,
      hitStatus: HitStatus.NoHit,
      checkerOwner: Player.Two,
    },
    {
      dieUsed: 1,
      from: 16,
      to: 17,
      hitStatus: HitStatus.NoHit,
      checkerOwner: Player.Two,
    },
    {
      dieUsed: 1,
      from: 18,
      to: 19,
      hitStatus: HitStatus.NoHit,
      checkerOwner: Player.Two,
    },
  ]);

  expect(
    getAllPossibleMovesForGivenDieRoll(STARTING_BOARD_STATE, 2, Player.One)
  ).toEqual([
    {
      dieUsed: 2,
      from: 5,
      to: 3,
      hitStatus: HitStatus.NoHit,
      checkerOwner: Player.One,
    },
    {
      dieUsed: 2,
      from: 7,
      to: 5,
      hitStatus: HitStatus.NoHit,
      checkerOwner: Player.One,
    },
    {
      dieUsed: 2,
      from: 12,
      to: 10,
      hitStatus: HitStatus.NoHit,
      checkerOwner: Player.One,
    },
    {
      dieUsed: 2,
      from: 23,
      to: 21,
      hitStatus: HitStatus.NoHit,
      checkerOwner: Player.One,
    },
  ]);

  expect(
    getAllPossibleMovesForGivenDieRoll(STARTING_BOARD_STATE, 2, Player.Two)
  ).toEqual([
    {
      dieUsed: 2,
      from: 0,
      to: 2,
      hitStatus: HitStatus.NoHit,
      checkerOwner: Player.Two,
    },
    {
      dieUsed: 2,
      from: 11,
      to: 13,
      hitStatus: HitStatus.NoHit,
      checkerOwner: Player.Two,
    },
    {
      dieUsed: 2,
      from: 16,
      to: 18,
      hitStatus: HitStatus.NoHit,
      checkerOwner: Player.Two,
    },
    {
      dieUsed: 2,
      from: 18,
      to: 20,
      hitStatus: HitStatus.NoHit,
      checkerOwner: Player.Two,
    },
  ]);

  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.barState = { [Player.One]: 1, [Player.Two]: 1 };
  TEST_BOARD.pointsState[12] = { [Player.One]: 0, [Player.Two]: 2 };
  TEST_BOARD.pointsState[22] = { [Player.One]: 0, [Player.Two]: 2 };

  // Only entering from the bar is allowed.
  expect(getAllPossibleMovesForGivenDieRoll(TEST_BOARD, 2, Player.Two)).toEqual(
    [
      {
        dieUsed: 2,
        from: "BAR",
        to: 1,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ]
  );
  // No moves since Player One is blocked from entering off the bar.
  expect(getAllPossibleMovesForGivenDieRoll(TEST_BOARD, 2, Player.One)).toEqual(
    []
  );
});

test("getAllPossibleMoveSets works", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[18] = { [Player.One]: 0, [Player.Two]: 1 };
  TEST_BOARD.pointsState[19] = { [Player.One]: 0, [Player.Two]: 1 };

  expect(getAllPossibleMoveSets(TEST_BOARD, [1, 2], Player.Two)).toEqual([
    [
      {
        dieUsed: 1,
        from: 18,
        to: 19,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 2,
        from: 19,
        to: 21,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 2,
        from: 18,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 2,
        from: 20,
        to: 22,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 2,
        from: 18,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 2,
        from: 18,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 20,
        to: 21,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 2,
        from: 19,
        to: 21,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 18,
        to: 19,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 2,
        from: 19,
        to: 21,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 21,
        to: 22,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
  ]);
});

test("getAllPossibleMoveSets works when not all dice can be used", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[18] = { [Player.One]: 0, [Player.Two]: 1 };
  TEST_BOARD.pointsState[21] = { [Player.One]: 2, [Player.Two]: 0 };

  expect(getAllPossibleMoveSets(TEST_BOARD, [1, 2], Player.Two)).toEqual([
    [
      {
        dieUsed: 1,
        from: 18,
        to: 19,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 2,
        from: 18,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
  ]);
});

test("getAllPossibleMoveSets works with doubles", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[18] = { [Player.One]: 0, [Player.Two]: 1 };
  TEST_BOARD.pointsState[19] = { [Player.One]: 0, [Player.Two]: 1 };

  expect(getAllPossibleMoveSets(TEST_BOARD, [1, 1, 1, 1], Player.Two)).toEqual([
    [
      {
        dieUsed: 1,
        from: 18,
        to: 19,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 20,
        to: 21,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 1,
        from: 18,
        to: 19,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 20,
        to: 21,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 1,
        from: 18,
        to: 19,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 20,
        to: 21,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 21,
        to: 22,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 18,
        to: 19,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 20,
        to: 21,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 18,
        to: 19,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 20,
        to: 21,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 18,
        to: 19,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 20,
        to: 21,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 21,
        to: 22,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 20,
        to: 21,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 18,
        to: 19,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 20,
        to: 21,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 18,
        to: 19,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 21,
        to: 22,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 20,
        to: 21,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 21,
        to: 22,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 18,
        to: 19,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 20,
        to: 21,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 21,
        to: 22,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 22,
        to: 23,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
  ]);
});

test("maxDieValueUsedInMoveSet works", () => {
  expect(maxDieValueUsedInMoveSet([])).toEqual(0);
  expect(
    maxDieValueUsedInMoveSet([
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
      {
        dieUsed: 3,
        from: 19,
        to: 22,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
      {
        dieUsed: 2,
        from: 19,
        to: 21,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
    ])
  ).toEqual(3);
  expect(
    maxDieValueUsedInMoveSet([
      {
        dieUsed: 5,
        from: 10,
        to: 15,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
      {
        dieUsed: 5,
        from: 12,
        to: 17,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
    ])
  ).toEqual(5);
});

test("areProvisionalMovesSubmittable ensures as many dice as possible are used", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[18] = { [Player.One]: 0, [Player.Two]: 1 };
  TEST_BOARD.pointsState[19] = { [Player.One]: 0, [Player.Two]: 1 };

  expect(
    areProvisionalMovesSubmittable(TEST_BOARD, [1, 2], Player.Two, [])
  ).toEqual(false);

  expect(
    areProvisionalMovesSubmittable(TEST_BOARD, [1, 2], Player.Two, [
      {
        dieUsed: 2,
        from: 18,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
    ])
  ).toEqual(false);

  expect(
    areProvisionalMovesSubmittable(TEST_BOARD, [1, 2], Player.Two, [
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
      {
        dieUsed: 2,
        from: 18,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
    ])
  ).toEqual(true);
});

test("areProvisionalMovesSubmittable ensures as many dice as possible are used (doubles)", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[18] = { [Player.One]: 0, [Player.Two]: 1 };
  TEST_BOARD.pointsState[19] = { [Player.One]: 0, [Player.Two]: 1 };

  expect(
    areProvisionalMovesSubmittable(TEST_BOARD, [1, 1, 1, 1], Player.Two, [])
  ).toEqual(false);
  expect(
    areProvisionalMovesSubmittable(TEST_BOARD, [1, 1, 1, 1], Player.Two, [
      {
        dieUsed: 1,
        from: 22,
        to: 23,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
    ])
  ).toEqual(false);
  expect(
    areProvisionalMovesSubmittable(TEST_BOARD, [1, 1, 1, 1], Player.Two, [
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
      {
        dieUsed: 1,
        from: 22,
        to: 23,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
    ])
  ).toEqual(false);
  expect(
    areProvisionalMovesSubmittable(TEST_BOARD, [1, 1, 1, 1], Player.Two, [
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
      {
        dieUsed: 1,
        from: 21,
        to: 22,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
      {
        dieUsed: 1,
        from: 22,
        to: 23,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
    ])
  ).toEqual(false);
  expect(
    areProvisionalMovesSubmittable(TEST_BOARD, [1, 1, 1, 1], Player.Two, [
      {
        dieUsed: 1,
        from: 19,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
      {
        dieUsed: 1,
        from: 20,
        to: 21,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
      {
        dieUsed: 1,
        from: 21,
        to: 22,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
      {
        dieUsed: 1,
        from: 22,
        to: 23,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
    ])
  ).toEqual(true);
});

test("areProvisionalMovesSubmittable ensures max die value is used when not all dice can be used", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[18] = { [Player.One]: 0, [Player.Two]: 1 };
  TEST_BOARD.pointsState[21] = { [Player.One]: 2, [Player.Two]: 0 };

  expect(
    areProvisionalMovesSubmittable(TEST_BOARD, [1, 2], Player.Two, [])
  ).toEqual(false);

  expect(
    areProvisionalMovesSubmittable(TEST_BOARD, [1, 2], Player.Two, [
      {
        dieUsed: 1,
        from: 18,
        to: 19,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
    ])
  ).toEqual(false);

  expect(
    areProvisionalMovesSubmittable(TEST_BOARD, [1, 2], Player.Two, [
      {
        dieUsed: 2,
        from: 18,
        to: 20,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
    ])
  ).toEqual(true);
});

test("provisional moves are properly unwound for areProvisionalMovesSubmittable call", () => {
  let BOARD_WITH_PROVISIONAL_MOVES = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  BOARD_WITH_PROVISIONAL_MOVES.pointsState[1] = {
    [Player.One]: 2,
    [Player.Two]: 0,
  };
  BOARD_WITH_PROVISIONAL_MOVES.pointsState[2] = {
    [Player.One]: 0,
    [Player.Two]: 1,
  };
  BOARD_WITH_PROVISIONAL_MOVES.barState = { [Player.One]: 0, [Player.Two]: 1 };

  let PROVISIONAL_MOVES: Move[] = [
    {
      dieUsed: 3,
      from: "BAR",
      to: 2,
      hitStatus: HitStatus.NoHit,
      checkerOwner: Player.Two,
    },
  ];

  let BOARD_WITH_PROVISIONAL_MOVES_UNWOUND = BOARD_WITH_PROVISIONAL_MOVES;
  for (let i = PROVISIONAL_MOVES.length - 1; i >= 0; i--) {
    BOARD_WITH_PROVISIONAL_MOVES_UNWOUND = applyMoveToGameBoardState(
      BOARD_WITH_PROVISIONAL_MOVES_UNWOUND,
      getInverseMove(PROVISIONAL_MOVES[i])
    );
  }

  expect(
    areProvisionalMovesSubmittable(
      BOARD_WITH_PROVISIONAL_MOVES_UNWOUND,
      [2, 3],
      Player.Two,
      PROVISIONAL_MOVES
    )
  ).toEqual(true);
});

test("provisional moves are properly unwound for areProvisionalMovesSubmittable call 2", () => {
  let BOARD_WITH_PROVISIONAL_MOVES = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  BOARD_WITH_PROVISIONAL_MOVES.pointsState[2] = {
    [Player.One]: 0,
    [Player.Two]: 1,
  };
  BOARD_WITH_PROVISIONAL_MOVES.pointsState[3] = {
    [Player.One]: 0,
    [Player.Two]: 1,
  };
  BOARD_WITH_PROVISIONAL_MOVES.pointsState[4] = {
    [Player.One]: 2,
    [Player.Two]: 0,
  };
  BOARD_WITH_PROVISIONAL_MOVES.pointsState[5] = {
    [Player.One]: 2,
    [Player.Two]: 0,
  };

  let PROVISIONAL_MOVES: Move[] = [
    {
      dieUsed: 3,
      from: "BAR",
      to: 2,
      hitStatus: HitStatus.NoHit,
      checkerOwner: Player.Two,
    },
  ];

  let BOARD_WITH_PROVISIONAL_MOVES_UNWOUND = BOARD_WITH_PROVISIONAL_MOVES;
  for (let i = PROVISIONAL_MOVES.length - 1; i >= 0; i--) {
    BOARD_WITH_PROVISIONAL_MOVES_UNWOUND = applyMoveToGameBoardState(
      BOARD_WITH_PROVISIONAL_MOVES_UNWOUND,
      getInverseMove(PROVISIONAL_MOVES[i])
    );
  }

  // Not submittable because both dice can be used if Player.Two uses the 2 to enter from the bar
  // and then moves the checker on point 3 to point 6 using the 3.
  expect(
    areProvisionalMovesSubmittable(
      BOARD_WITH_PROVISIONAL_MOVES_UNWOUND,
      [2, 3],
      Player.Two,
      PROVISIONAL_MOVES
    )
  ).toEqual(false);
});

test("provisional moves are properly unwound for areProvisionalMovesSubmittable call 3", () => {
  let BOARD_WITH_PROVISIONAL_MOVES = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  BOARD_WITH_PROVISIONAL_MOVES.pointsState[1] = {
    [Player.One]: 0,
    [Player.Two]: 1,
  };
  BOARD_WITH_PROVISIONAL_MOVES.pointsState[4] = {
    [Player.One]: 2,
    [Player.Two]: 0,
  };
  BOARD_WITH_PROVISIONAL_MOVES.pointsState[5] = {
    [Player.One]: 2,
    [Player.Two]: 0,
  };
  BOARD_WITH_PROVISIONAL_MOVES.pointsState[6] = {
    [Player.One]: 0,
    [Player.Two]: 1,
  };

  let PROVISIONAL_MOVES: Move[] = [
    {
      dieUsed: 2,
      from: "BAR",
      to: 2,
      hitStatus: HitStatus.NoHit,
      checkerOwner: Player.Two,
    },
    {
      dieUsed: 3,
      from: 3,
      to: 6,
      hitStatus: HitStatus.NoHit,
      checkerOwner: Player.Two,
    },
  ];

  let BOARD_WITH_PROVISIONAL_MOVES_UNWOUND = BOARD_WITH_PROVISIONAL_MOVES;
  for (let i = PROVISIONAL_MOVES.length - 1; i >= 0; i--) {
    BOARD_WITH_PROVISIONAL_MOVES_UNWOUND = applyMoveToGameBoardState(
      BOARD_WITH_PROVISIONAL_MOVES_UNWOUND,
      getInverseMove(PROVISIONAL_MOVES[i])
    );
  }

  // Unlike previous test case, these are now submittable because both dice were used.
  expect(
    areProvisionalMovesSubmittable(
      BOARD_WITH_PROVISIONAL_MOVES_UNWOUND,
      [2, 3],
      Player.Two,
      PROVISIONAL_MOVES
    )
  ).toEqual(true);
});

test("areProvisionalMovesSubmittable handles situations where not all doubles can be used", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);

  TEST_BOARD.pointsState[1] = { [Player.One]: 0, [Player.Two]: 2 };
  TEST_BOARD.pointsState[7] = { [Player.One]: 2, [Player.Two]: 0 };

  TEST_BOARD.pointsState[17] = { [Player.One]: 0, [Player.Two]: 1 };
  TEST_BOARD.pointsState[18] = { [Player.One]: 0, [Player.Two]: 2 };
  TEST_BOARD.pointsState[19] = { [Player.One]: 0, [Player.Two]: 2 };
  TEST_BOARD.pointsState[20] = { [Player.One]: 0, [Player.Two]: 2 };
  TEST_BOARD.pointsState[21] = { [Player.One]: 0, [Player.Two]: 0 };
  TEST_BOARD.pointsState[22] = { [Player.One]: 0, [Player.Two]: 3 };
  TEST_BOARD.pointsState[23] = { [Player.One]: 0, [Player.Two]: 3 };

  expect(
    areProvisionalMovesSubmittable(TEST_BOARD, [6, 6, 6, 6], Player.Two, [])
  ).toEqual(false);

  expect(
    areProvisionalMovesSubmittable(TEST_BOARD, [6, 6, 6, 6], Player.Two, [
      {
        dieUsed: 6,
        from: 17,
        to: 23,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
    ])
  ).toEqual(true);
});

test("getAllMoveSetsFromStartingPoint works for non-doubles", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[0] = { [Player.One]: 0, [Player.Two]: 1 };

  expect(
    getAllMoveSetsFromStartingPoint(TEST_BOARD, [2, 4], 0, Player.Two)
  ).toEqual([
    [
      {
        dieUsed: 2,
        from: 0,
        to: 2,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 2,
        from: 0,
        to: 2,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 4,
        from: 2,
        to: 6,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 4,
        from: 0,
        to: 4,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 4,
        from: 0,
        to: 4,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 2,
        from: 4,
        to: 6,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
  ]);
});

test("getAllMoveSetsFromStartingPoint works for non-doubles with a point in the way", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[0] = { [Player.One]: 0, [Player.Two]: 1 };
  TEST_BOARD.pointsState[2] = { [Player.One]: 2, [Player.Two]: 0 };

  expect(
    getAllMoveSetsFromStartingPoint(TEST_BOARD, [2, 4], 0, Player.Two)
  ).toEqual([
    [
      {
        dieUsed: 4,
        from: 0,
        to: 4,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 4,
        from: 0,
        to: 4,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 2,
        from: 4,
        to: 6,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
  ]);
});

test("getAllMoveSetsFromStartingPoint works for doubles", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[0] = { [Player.One]: 0, [Player.Two]: 1 };

  expect(
    getAllMoveSetsFromStartingPoint(TEST_BOARD, [1, 1, 1, 1], 0, Player.Two)
  ).toEqual([
    [
      {
        dieUsed: 1,
        from: 0,
        to: 1,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 1,
        from: 0,
        to: 1,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 1,
        to: 2,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 1,
        from: 0,
        to: 1,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 1,
        to: 2,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 2,
        to: 3,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 1,
        from: 0,
        to: 1,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 1,
        to: 2,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 2,
        to: 3,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 3,
        to: 4,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
  ]);
});

test("getAllMoveSetsFromStartingPoint works for doubles with a point in the way", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[0] = { [Player.One]: 0, [Player.Two]: 1 };
  TEST_BOARD.pointsState[3] = { [Player.One]: 2, [Player.Two]: 0 };

  expect(
    getAllMoveSetsFromStartingPoint(TEST_BOARD, [1, 1, 1, 1], 0, Player.Two)
  ).toEqual([
    [
      {
        dieUsed: 1,
        from: 0,
        to: 1,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 1,
        from: 0,
        to: 1,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 1,
        from: 1,
        to: 2,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
  ]);
});

test("getAllMoveSetsFromStartingPoint works for with no dice left", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[0] = { [Player.One]: 0, [Player.Two]: 1 };

  expect(
    getAllMoveSetsFromStartingPoint(TEST_BOARD, [], 0, Player.Two)
  ).toEqual([]);
});

test("getAllMoveSetsFromStartingPoint works for with one dice left", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[3] = { [Player.One]: 0, [Player.Two]: 1 };

  expect(
    getAllMoveSetsFromStartingPoint(TEST_BOARD, [2], 3, Player.Two)
  ).toEqual([
    [
      {
        dieUsed: 2,
        from: 3,
        to: 5,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
  ]);
});

test("getAllMoveSetsFromStartingPoint works for with doubles with only 2 dice available", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[0] = { [Player.One]: 0, [Player.Two]: 1 };

  expect(
    getAllMoveSetsFromStartingPoint(TEST_BOARD, [2, 2], 0, Player.Two)
  ).toEqual([
    [
      {
        dieUsed: 2,
        from: 0,
        to: 2,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
    [
      {
        dieUsed: 2,
        from: 0,
        to: 2,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
      {
        dieUsed: 2,
        from: 2,
        to: 4,
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.Two,
      },
    ],
  ]);
});

test("getAllMoveSetsFromStartingPoint works for when both dice can be used to bear off", () => {
  let TEST_BOARD = deepCloneGameBoardState(EMPTY_BOARD_STATE);
  TEST_BOARD.pointsState[1] = { [Player.One]: 1, [Player.Two]: 0 };

  expect(
    getAllMoveSetsFromStartingPoint(TEST_BOARD, [2, 3], 1, Player.One)
  ).toEqual([
    [
      {
        dieUsed: 2,
        from: 1,
        to: "HOME",
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
    ],
    [
      {
        dieUsed: 3,
        from: 1,
        to: "HOME",
        hitStatus: HitStatus.NoHit,
        checkerOwner: Player.One,
      },
    ],
  ]);
});
