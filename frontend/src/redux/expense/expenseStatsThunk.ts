import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchExpenseStatsApi } from "./expenseStatsApi";
import getErrorMessage from "../../utils/getErrorMessage";

export const fetchExpenseStatsThunk = createAsyncThunk(
  "expenseStats/fetchExpenseStats",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchExpenseStatsApi();
      // Handle MongoDB Decimal128 format if present
      const amount = data?.current?.$numberDecimal
        ? parseFloat(data.current.$numberDecimal)
        : (data?.current ?? 0);
      const percentChange = data?.percentChange ?? 0;
      return { amount, percentChange };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
