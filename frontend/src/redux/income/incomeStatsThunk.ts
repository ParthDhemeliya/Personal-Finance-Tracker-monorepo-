import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchIncomeStats } from "./incomeStatsApi";

export const fetchIncomeStatsThunk = createAsyncThunk(
  "income/fetchIncomeStats",
  async (_, thunkAPI) => {
    try {
      const data = await fetchIncomeStats();
      // Support both { amount } and { current: { $numberDecimal } }
      let amount = 0;
      if (typeof data.amount === "number") {
        amount = data.amount;
      } else if (data.current && data.current.$numberDecimal) {
        amount = Number(data.current.$numberDecimal);
      }
      return {
        amount,
        percentChange: data.percentChange ?? 0,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }
      return thunkAPI.rejectWithValue("Failed to fetch income stats");
    }
  },
);
