import { createSlice } from "@reduxjs/toolkit";
import { fetchIncomeStatsThunk } from "./incomeStatsThunk";

interface IncomeStatsState {
  amount: number;
  percentChange: number;
  loading: boolean;
  error: string | null;
}

const initialState: IncomeStatsState = {
  amount: 0,
  percentChange: 0,
  loading: false,
  error: null,
};

const incomeStatsSlice = createSlice({
  name: "incomeStats",
  initialState,
  reducers: {
    resetIncomeStatsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomeStatsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncomeStatsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.amount = action.payload.amount;
        state.percentChange = action.payload.percentChange;
      })
      .addCase(fetchIncomeStatsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch income stats";
      });
  },
});

export default incomeStatsSlice.reducer;
export const { resetIncomeStatsState } = incomeStatsSlice.actions;
