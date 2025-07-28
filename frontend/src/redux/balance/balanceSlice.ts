import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchBalanceThunk } from "./balanceThunk";

interface BalanceState {
  amount: number;
  percentChange: number;
  loading: boolean;
  error: string | null;
}

const initialState: BalanceState = {
  amount: 0,
  percentChange: 0,
  loading: false,
  error: null,
};

const balanceSlice = createSlice({
  name: "balance",
  initialState,
  reducers: {
    resetBalanceState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalanceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBalanceThunk.fulfilled,
        (
          state,
          action: PayloadAction<{ amount: number; percentChange: number }>,
        ) => {
          state.loading = false;
          state.amount = action.payload.amount;
          state.percentChange = action.payload.percentChange;
        },
      )
      .addCase(fetchBalanceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch balance";
      });
  },
});

export default balanceSlice.reducer;
export const { resetBalanceState } = balanceSlice.actions;
