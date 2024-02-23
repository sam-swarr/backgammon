import { createSlice } from "@reduxjs/toolkit";
import type { AddAnimationPayload, Animation } from "./animationsSlice";

const initialState: AddAnimationPayload[] = [];

export const networkedAnimationsSlice = createSlice({
  name: "networkedAnimationsState",
  initialState: initialState,
  reducers: {
    addNetworkedAnimationPayload: (
      state,
      action: { type: string; payload: AddAnimationPayload }
    ) => {
      state.push(action.payload);
      return state;
    },
    clearNetworkedAnimationPayloads: () => {
      return initialState;
    },
  },
});

export const { addNetworkedAnimationPayload, clearNetworkedAnimationPayloads } =
  networkedAnimationsSlice.actions;

export default networkedAnimationsSlice.reducer;
