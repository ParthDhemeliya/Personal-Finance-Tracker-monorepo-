import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchBalance } from "./balanceApi";

export const fetchBalanceThunk = createAsyncThunk(
  "balance/fetchBalance",
  async (_, thunkAPI) => {
    try {
      const data = await fetchBalance();
      // Map backend fields to frontend expectations
      return {
        amount: data.balance ?? 0,
        percentChange: 0, // No percentChange in backend response
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }
      return thunkAPI.rejectWithValue("Failed to fetch balance");
    }
  },
);
