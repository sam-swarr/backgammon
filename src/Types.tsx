export enum Player {
  One = "ONE",
  Two = "TWO",
}

export enum Color {
  White = "WHITE",
  Black = "BLACK",
}

export enum MovementDirection {
  Clockwise = "CLOCKWISE",
  CounterClockwise = "COUNTERCLOCKWISE",
}

export type GameBoardState = {
  pointsState: Array<PointState>;
  barState: PointState;
  homeState: PointState;
};

export type PointState = {
  [Player.One]: number;
  [Player.Two]: number;
};

export enum HitStatus {
  // This move performed a hit.
  IsHit = "IS_HIT",
  // This move undoes a hit.
  UndoesHit = "UNDOES_HIT",
  // No checkers were hit or unhit in this move.
  NoHit = "NO_HIT",
}

export type Move = {
  from: number | "BAR" | "HOME";
  to: number | "BAR" | "HOME";
  dieUsed: number;
  hitStatus: HitStatus;
  checkerOwner: Player;
};

export enum GameResult {
  NotOver = "NOT_OVER",
  PlayerWon = "PLAYER_WON",
  PlayerWonGammon = "PLAYER_WON_GAMMON",
  PlayerWonBackgammon = "PLAYER_WON_BACKGAMMON",
}
