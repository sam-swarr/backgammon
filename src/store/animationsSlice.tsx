import { createSlice } from '@reduxjs/toolkit'

import { TranslationOffset } from './animations';

type Animation = {
  point: number | "BAR" | "HOME",
  translation: TranslationOffset
};

const initialState: Animation[] = [];

export const animationsSlice = createSlice({
  name: 'animationsState',
  initialState: initialState,
  reducers: {
    appendAnimation: (state, action: { type: string, payload: Animation }) => {
      return [...state, action.payload];
    },
    clearAnimations: () => {
      return [];
    }
  },
})

// Action creators are generated for each case reducer function
export const { appendAnimation, clearAnimations } = animationsSlice.actions

export default animationsSlice.reducer