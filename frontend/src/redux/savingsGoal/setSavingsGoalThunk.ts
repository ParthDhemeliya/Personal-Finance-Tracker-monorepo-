import { createAsyncThunk } from "@reduxjs/toolkit";
import { setSavingsGoalApi } from "./setSavingsGoalApi";
import getErrorMessage from "../../utils/getErrorMessage";

export const setSavingsGoalThunk = createAsyncThunk(
  "savingsGoal/setSavingsGoal",
  async (
    payload: { amount: number; targetDate: string },
    { rejectWithValue, getState },
  ) => {
    try {
      // If there is no target, treat as create (POST), else update (PUT)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const state: any = getState();
      const isCreate =
        !state.savingsGoal ||
        !state.savingsGoal.target ||
        state.savingsGoal.target <= 0;
      const data = await setSavingsGoalApi(payload, isCreate);
      return { target: data.amount ?? payload.amount };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
