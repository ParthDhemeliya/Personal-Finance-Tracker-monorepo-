import { createSlice } from "@reduxjs/toolkit";
import { fetchSavingsGoalThunk } from "./savingsGoalThunk";
import { setSavingsGoalThunk } from "./setSavingsGoalThunk";

interface SavingsGoalState {
  current: number;
  target: number;
  loading: boolean;
  error: string | null;
}

const initialState: SavingsGoalState = {
  current: 0,
  target: 0,
  loading: false,
  error: null,
};

const savingsGoalSlice = createSlice({
  name: "savingsGoal",
  initialState,
  reducers: {
    resetSavingsGoalState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavingsGoalThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavingsGoalThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.current;
        state.target = action.payload.target;
      })
      .addCase(fetchSavingsGoalThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle setSavingsGoalThunk
      .addCase(setSavingsGoalThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setSavingsGoalThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.target = action.payload.target;
      })
      .addCase(setSavingsGoalThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default savingsGoalSlice.reducer;
export const { resetSavingsGoalState } = savingsGoalSlice.actions;
