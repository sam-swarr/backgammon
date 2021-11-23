import { createSlice } from '@reduxjs/toolkit'
import { Player } from '../Types';

export type TranslationOffset = {
  translateX: number,
  translateY: number,
};

export type Animation = {
  checkerNumber: number,
  translation: TranslationOffset
};

export type AnimationState = {
  points: Array<Animation[]>,
  BAR: Animation[],
  HOME: Animation[],
};

export type Animations = {
  [Player.One]: AnimationState,
  [Player.Two]: AnimationState,
};

const initialState: Animations = {
  [Player.One]: {
    points: [
      [], [], [], [], [], [],
      [], [], [], [], [], [],
      [], [], [], [], [], [],
      [], [], [], [], [], [],
    ],
    BAR: [],
    HOME: [],
  },
  [Player.Two]: {
    points: [
      [], [], [], [], [], [],
      [], [], [], [], [], [],
      [], [], [], [], [], [],
      [], [], [], [], [], [],
    ],
    BAR: [],
    HOME: [],
  },
};

export type AddAnimationPayload = {
  player: Player,
  location: number| "HOME" | "BAR",
  animation: Animation,
};

export type ClearAnimationPayload = {
  player: Player,
  checkerNumber: number,
  location: number | "HOME" | "BAR",
};

export const animationsSlice = createSlice({
  name: 'animationsState',
  initialState: initialState,
  reducers: {
    addAnimation: (state, action: { type: string, payload: AddAnimationPayload }) => {
      switch (action.payload.location) {
        case "HOME":
        case "BAR":
          state[action.payload.player][action.payload.location].push(action.payload.animation);
          break;
        default:
          state[action.payload.player].points[action.payload.location].push(action.payload.animation);
      }
      return state;
    },
    clearAnimation: (state, action: { type: string, payload: ClearAnimationPayload }) => {
      switch (action.payload.location) {
        case "HOME":
        case "BAR":
          state[action.payload.player][action.payload.location] = state[action.payload.player][action.payload.location].filter(
            (animation => animation.checkerNumber !== action.payload.checkerNumber)
          );
          break;
        default:
          state[action.payload.player].points[action.payload.location] = state[action.payload.player].points[action.payload.location].filter(
            (animation => animation.checkerNumber !== action.payload.checkerNumber)
          );
      }
      return state;
    }
  },
})

// Action creators are generated for each case reducer function
export const { addAnimation, clearAnimation } = animationsSlice.actions

export default animationsSlice.reducer