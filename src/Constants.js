export const PLAYERS = {
  ONE: 'ONE',
  TWO: 'TWO',
  EMPTY: 'EMPTY',
};

export const COLORS = {
  WHITE: 'WHITE',
  BLACK: 'BLACK',
};

export const MOVEMENT_DIRECTION = {
  CLOCKWISE: 'CLOCKWISE',
  COUNTERCLOCKWISE: 'COUNTERCLOCKWISE',
};

export const STARTING_BOARD_STATE = [
  {player: PLAYERS.TWO, count: 2},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.ONE, count: 5},

  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.ONE, count: 3},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.TWO, count: 5},

  {player: PLAYERS.ONE, count: 5},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.TWO, count: 3},
  {player: PLAYERS.EMPTY, count: 0},

  {player: PLAYERS.TWO, count: 5},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.ONE, count: 2},
];  