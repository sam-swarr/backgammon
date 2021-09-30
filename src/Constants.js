export const PLAYERS = {
  ME: 'ME',
  YOU: 'YOU',
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
  {player: PLAYERS.YOU, count: 2},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.ME, count: 5},

  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.ME, count: 3},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.YOU, count: 5},

  {player: PLAYERS.ME, count: 5},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.YOU, count: 3},
  {player: PLAYERS.EMPTY, count: 0},

  {player: PLAYERS.YOU, count: 5},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.EMPTY, count: 0},
  {player: PLAYERS.ME, count: 2},
];  