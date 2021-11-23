import { createSlice } from '@reduxjs/toolkit'
import { Player } from '../Types';

export type TranslationOffset = {
  translateX: number,
  translateY: number,
};

export type Animation = {
  translation: TranslationOffset
};

export type AnimationState = {
  points: Array<Animation | null>,
  BAR: Animation | null,
  HOME: Animation | null,
};

export type Animations = {
  [Player.One]: AnimationState,
  [Player.Two]: AnimationState,
};

const initialState: Animations = {
  [Player.One]: {
    points: [
      null, null, null, null, null, null,
      null, null, null, null, null, null,
      null, null, null, null, null, null,
      null, null, null, null, null, null,
    ],
    BAR: null,
    HOME: null,
  },
  [Player.Two]: {
    points: [
      null, null, null, null, null, null,
      null, null, null, null, null, null,
      null, null, null, null, null, null,
      null, null, null, null, null, null,
    ],
    BAR: null,
    HOME: null,
  },
};

export type AddAnimationPayload = {
  player: Player,
  location: number| "HOME" | "BAR",
  animation: Animation,
};

export type ClearAnimationPayload = {
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
          state[action.payload.player][action.payload.location] = action.payload.animation;
          break;
        default:
          state[action.payload.player].points[action.payload.location] = action.payload.animation;
      }
      return state;
    },
    clearAnimation: (state, action: { type: string, payload: ClearAnimationPayload }) => {
      switch (action.payload.location) {
        case "HOME":
        case "BAR":
          state[Player.One][action.payload.location] = null;
          state[Player.Two][action.payload.location] = null;
          break;
        default:
          state[Player.One].points[action.payload.location] = null;
          state[Player.Two].points[action.payload.location] = null;
      }
      return state;
    }
  },
})

// Action creators are generated for each case reducer function
export const { addAnimation, clearAnimation } = animationsSlice.actions

export default animationsSlice.reducer