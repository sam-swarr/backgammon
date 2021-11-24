import { createSlice } from '@reduxjs/toolkit'
import { Player } from '../Types';

export type TranslationOffset = {
  translateX: number,
  translateY: number,
};

export type Animation = {
  owner: Player,
  checkerNumber: number,
  translation: TranslationOffset
};

export type Animations = {
  points: Array<Animation[]>,
  BAR: Animation[],
  HOME: Animation[],
};

const initialState: Animations = {
  points: [
    [], [], [], [], [], [],
    [], [], [], [], [], [],
    [], [], [], [], [], [],
    [], [], [], [], [], [],
  ],
  BAR: [],
  HOME: [],
};

export type AddAnimationPayload = {
  location: number| "HOME" | "BAR",
  animation: Animation,
};

export type ClearAnimationPayload = {
  owner: Player,
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
          state[action.payload.location].push(action.payload.animation);
          break;
        default:
          state.points[action.payload.location].push(action.payload.animation);
      }
      return state;
    },
    clearAnimation: (state, action: { type: string, payload: ClearAnimationPayload }) => {
      switch (action.payload.location) {
        case "HOME":
        case "BAR":
          state[action.payload.location] = state[action.payload.location].filter(
            (animation => animation.checkerNumber !== action.payload.checkerNumber && animation.owner !== action.payload.owner)
          );
          break;
        default:
          state.points[action.payload.location] = state.points[action.payload.location].filter(
            (animation => animation.checkerNumber !== action.payload.checkerNumber && animation.owner !== action.payload.owner)
          );
      }
      return state;
    }
  },
})

// Action creators are generated for each case reducer function
export const { addAnimation, clearAnimation } = animationsSlice.actions

export default animationsSlice.reducer