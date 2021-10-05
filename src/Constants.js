export const PLAYERS = {
  ONE: 'ONE',
  TWO: 'TWO',
  NOBODY: 'NOBODY',
};

export const COLORS = {
  WHITE: 'WHITE',
  BLACK: 'BLACK',
};

export const MOVEMENT_DIRECTION = {
  CLOCKWISE: 'CLOCKWISE',
  COUNTERCLOCKWISE: 'COUNTERCLOCKWISE',
};

export const STARTING_BOARD_STATE = {
  pointsState:
    [
      {player: PLAYERS.TWO, count: 2},
      {player: PLAYERS.NOBODY, count: 0},
      {player: PLAYERS.NOBODY, count: 0},
      {player: PLAYERS.NOBODY, count: 0},
      {player: PLAYERS.NOBODY, count: 0},
      {player: PLAYERS.ONE, count: 5},

      {player: PLAYERS.NOBODY, count: 0},
      {player: PLAYERS.ONE, count: 3},
      {player: PLAYERS.NOBODY, count: 0},
      {player: PLAYERS.NOBODY, count: 0},
      {player: PLAYERS.NOBODY, count: 0},
      {player: PLAYERS.TWO, count: 5},

      {player: PLAYERS.ONE, count: 5},
      {player: PLAYERS.NOBODY, count: 0},
      {player: PLAYERS.NOBODY, count: 0},
      {player: PLAYERS.NOBODY, count: 0},
      {player: PLAYERS.TWO, count: 3},
      {player: PLAYERS.NOBODY, count: 0},

      {player: PLAYERS.TWO, count: 5},
      {player: PLAYERS.NOBODY, count: 0},
      {player: PLAYERS.NOBODY, count: 0},
      {player: PLAYERS.NOBODY, count: 0},
      {player: PLAYERS.NOBODY, count: 0},
      {player: PLAYERS.ONE, count: 2},
    ],
  barState: {},
  homeState: {},
};
STARTING_BOARD_STATE.barState[PLAYERS.ONE] = 0;
STARTING_BOARD_STATE.barState[PLAYERS.TWO] = 0;
STARTING_BOARD_STATE.homeState[PLAYERS.ONE] = 0;
STARTING_BOARD_STATE.homeState[PLAYERS.TWO] = 0;