import { createSlice } from "@reduxjs/toolkit";
import { fetchExpenseStatsThunk } from "./expenseStatsThunk";

interface ExpenseStatsState {
  amount: number;
  percentChange: number;
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseStatsState = {
  amount: 0,
  percentChange: 0,
  loading: false,
  error: null,
};

const expenseStatsSlice = createSlice({
  name: "expenseStats",
  initialState,
  reducers: {
    resetExpenseStatsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenseStatsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseStatsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.amount = action.payload.amount;
        state.percentChange = action.payload.percentChange;
      })
      .addCase(fetchExpenseStatsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default expenseStatsSlice.reducer;
export const { resetExpenseStatsState } = expenseStatsSlice.actions;
