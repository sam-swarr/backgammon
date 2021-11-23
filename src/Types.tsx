export enum Player {
  One = "ONE",
  Two = "TWO",
};

export enum Color {
  White = "WHITE",
  Black = "BLACK",
};

export enum MovementDirection {
  Clockwise = "CLOCKWISE",
  CounterClockwise = "COUNTERCLOCKWISE",
};

export type GameBoardState = {
  pointsState: Array<PointState>,
  barState: PointState,
  homeState: PointState,
};

export type PointState = {
  [Player.One]: number,
  [Player.Two]: number,
};

export type ValidMove = {
  move: {
    from: number | "BAR",
    to: number | "HOME",
  },
  dieUsed: number,
  isHit: boolean,
};

export type AppliableMove = {
  from: number | "BAR" | "HOME",
  to: number | "BAR" | "HOME",
}

export enum GameResult {
  NotOver = "NOT_OVER",
  PlayerWon = "PLAYER_WON",
  PlayerWonGammon = "PLAYER_WON_GAMMON",
  PlayerWonBackgammon = "PLAYER_WON_BACKGAMMON",
};