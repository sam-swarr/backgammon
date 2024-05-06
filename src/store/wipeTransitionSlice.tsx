import { createSlice } from "@reduxjs/toolkit";

export const wipeTransitionSlice = createSlice({
  name: "wipeTransitionState",
  initialState: false,
  reducers: {
    setWipeTransition: (_, action: { type: string; payload: boolean }) => {
      return action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setWipeTransition } = wipeTransitionSlice.actions;

export default wipeTransitionSlice.reducer;
