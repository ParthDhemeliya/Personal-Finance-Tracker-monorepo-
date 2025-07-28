import { createSlice } from "@reduxjs/toolkit";
import { fetchRecentTransactionsThunk } from "./recentTransactionsThunk";
import type { TransactionEntry } from "../../types/Interface";

interface RecentTransactionsState {
  data: TransactionEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: RecentTransactionsState = {
  data: [],
  loading: false,
  error: null,
};

const recentTransactionsSlice = createSlice({
  name: "recentTransactions",
  initialState,
  reducers: {
    resetRecentTransactionsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentTransactionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentTransactionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRecentTransactionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch recent transactions";
      });
  },
});

export const { resetRecentTransactionsState } = recentTransactionsSlice.actions;

export default recentTransactionsSlice.reducer;
