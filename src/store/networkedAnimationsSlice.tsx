import { createSlice } from "@reduxjs/toolkit";
import type { AddAnimationPayload } from "./animationsSlice";
import { Player } from "../Types";

export type AddNetworkedAnimationPayload = {
  // whose client should show the animation
  animateFor: Player;
  // the animation that client should add
  animationPayload: AddAnimationPayload;
};

const initialState: AddNetworkedAnimationPayload[] = [];

export const networkedAnimationsSlice = createSlice({
  name: "networkedAnimationsState",
  initialState: initialState,
  reducers: {
    addNetworkedAnimation: (
      state,
      action: { type: string; payload: AddNetworkedAnimationPayload }
    ) => {
      state.push(action.payload);
      return state;
    },
    clearNetworkedAnimations: () => {
      return initialState;
    },
  },
});

export const { addNetworkedAnimation, clearNetworkedAnimations } =
  networkedAnimationsSlice.actions;

export default networkedAnimationsSlice.reducer;
