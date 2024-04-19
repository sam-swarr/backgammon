import { GameBoardState, Player } from "./Types";

export const STARTING_BOARD_STATE: GameBoardState = {
  pointsState: [
    // 0
    {
      [Player.One]: 0,
      [Player.Two]: 2,
    },
    // 1
    {
      [Player.One]: 0,
      [Player.Two]: 0,
    },
    // 2
    {
      [Player.One]: 0,
      [Player.Two]: 0,
    },
    // 3
    {
      [Player.One]: 0,
      [Player.Two]: 0,
    },
    // 4
    {
      [Player.One]: 0,
      [Player.Two]: 0,
    },
    // 5
    {
      [Player.One]: 5,
      [Player.Two]: 0,
    },

    // 6
    {
      [Player.One]: 0,
      [Player.Two]: 0,
    },
    // 7
    {
      [Player.One]: 3,
      [Player.Two]: 0,
    },
    // 8
    {
      [Player.One]: 0,
      [Player.Two]: 0,
    },
    // 9
    {
      [Player.One]: 0,
      [Player.Two]: 0,
    },
    // 10
    {
      [Player.One]: 0,
      [Player.Two]: 0,
    },
    // 11
    {
      [Player.One]: 0,
      [Player.Two]: 5,
    },

    // 12
    {
      [Player.One]: 5,
      [Player.Two]: 0,
    },
    // 13
    {
      [Player.One]: 0,
      [Player.Two]: 0,
    },
    // 14
    {
      [Player.One]: 0,
      [Player.Two]: 0,
    },
    // 15
    {
      [Player.One]: 0,
      [Player.Two]: 0,
    },
    // 16
    {
      [Player.One]: 0,
      [Player.Two]: 3,
    },
    // 17
    {
      [Player.One]: 0,
      [Player.Two]: 0,
    },

    // 18
    {
      [Player.One]: 0,
      [Player.Two]: 5,
    },
    // 19
    {
      [Player.One]: 0,
      [Player.Two]: 0,
    },
    // 20
    {
      [Player.One]: 0,
      [Player.Two]: 0,
    },
    // 21
    {
      [Player.One]: 0,
      [Player.Two]: 0,
    },
    // 22
    {
      [Player.One]: 0,
      [Player.Two]: 0,
    },
    // 23
    {
      [Player.One]: 2,
      [Player.Two]: 0,
    },
  ],
  barState: {
    [Player.One]: 3,
    [Player.Two]: 3,
  },
  homeState: {
    [Player.One]: 2,
    [Player.Two]: 3,
  },
};

export const EMPTY_BOARD_STATE: GameBoardState = {
  pointsState: [
    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },

    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },

    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },

    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },
    { [Player.One]: 0, [Player.Two]: 0 },
  ],
  barState: { [Player.One]: 0, [Player.Two]: 0 },
  homeState: { [Player.One]: 0, [Player.Two]: 0 },
};

export const MOVE_FROM_INDICES: Array<"BAR" | number> = [
  "BAR",
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
];

export const CHECKER_ANIMATION_PULSE_TIMER_MS = 700;
