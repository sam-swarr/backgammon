export enum Player {
  One = "ONE",
  Two = "TWO",
  Nobody = "NOBODY",
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
  barState: BarState,
  homeState: HomeState,
}

export type PointState = {
  player: Player,
  count: number;
}

export type BarState = {
  [Player.One]: number,
  [Player.Two]: number,
}

export type HomeState = {
  [Player.One]: number,
  [Player.Two]: number,
}

