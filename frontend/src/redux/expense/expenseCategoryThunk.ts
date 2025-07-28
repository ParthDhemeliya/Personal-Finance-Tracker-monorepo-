import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchExpenseCategorySummaryApi } from "./expenseCategoryApi";
import getErrorMessage from "../../utils/getErrorMessage";

export const fetchExpenseCategorySummaryThunk = createAsyncThunk(
  "expense/fetchExpenseCategorySummary",
  async (month: string, { rejectWithValue }) => {
    try {
      const data = await fetchExpenseCategorySummaryApi(month);
      return data; // Expecting array of { category, amount }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
