import type {GameBoardState} from './Types';
import {Player} from './Types';

export const STARTING_BOARD_STATE: GameBoardState = {
  pointsState:
    [
      {player: Player.Two, count: 2},
      {player: Player.Nobody, count: 0},
      {player: Player.Nobody, count: 0},
      {player: Player.Nobody, count: 0},
      {player: Player.Nobody, count: 0},
      {player: Player.One, count: 5},

      {player: Player.Nobody, count: 0},
      {player: Player.One, count: 3},
      {player: Player.Nobody, count: 0},
      {player: Player.Nobody, count: 0},
      {player: Player.Nobody, count: 0},
      {player: Player.Two, count: 5},

      {player: Player.One, count: 5},
      {player: Player.Nobody, count: 0},
      {player: Player.Nobody, count: 0},
      {player: Player.Nobody, count: 0},
      {player: Player.Two, count: 3},
      {player: Player.Nobody, count: 0},

      {player: Player.Two, count: 5},
      {player: Player.Nobody, count: 0},
      {player: Player.Nobody, count: 0},
      {player: Player.Nobody, count: 0},
      {player: Player.Nobody, count: 0},
      {player: Player.One, count: 2},
    ],
  barState: {
    [Player.One]: 0,
    [Player.Two]: 0,
  },
  homeState: {
    [Player.One]: 0,
    [Player.Two]: 0,
  },
};