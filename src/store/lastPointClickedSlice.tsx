import { createSlice } from "@reduxjs/toolkit";

export type LastPointClicked = {
  point: number | "BAR";
};
const initialState: LastPointClicked = {
  point: -1,
};

export const lastPointClickedSlice = createSlice({
  name: "lastPointClickedState",
  initialState: initialState,
  reducers: {
    setLastPointClicked: (
      state,
      action: { type: string; payload: LastPointClicked }
    ) => {
      if (action.payload.point === state.point) {
        return initialState;
      }
      return action.payload;
    },
    clearLastPointClicked: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLastPointClicked, clearLastPointClicked } =
  lastPointClickedSlice.actions;

export default lastPointClickedSlice.reducer;
