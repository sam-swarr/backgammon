import { createSlice } from "@reduxjs/toolkit";
import { AppliableMove, Player } from "../Types";

export type AddNetworkedAnimationPayload = {
  // whose client should show the animation
  animateFor: Player;
  // data to generate the animation that the remote client should add
  animationData: {
    location: number | "HOME" | "BAR";
    move: AppliableMove;
    checkerOwner: Player;
  };
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
