import { createAsyncThunk } from "@reduxjs/toolkit";

import getErrorMessage from "../../utils/getErrorMessage";
import { fetchSavingsGoalApi } from "./savingsGoalApi";

export const fetchSavingsGoalThunk = createAsyncThunk(
  "savingsGoal/fetchSavingsGoal",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchSavingsGoalApi();
      // Support both { target, current } and { amount, current } for backward compatibility
      const target = data.target ?? data.amount ?? 0;
      const current = data.current ?? 0;
      return { current, target };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
