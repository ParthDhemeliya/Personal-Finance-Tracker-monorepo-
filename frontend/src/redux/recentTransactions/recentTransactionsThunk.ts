import { createAsyncThunk } from "@reduxjs/toolkit";
import getErrorMessage from "../../utils/getErrorMessage";
import type { TransactionEntry } from "../../types/Interface";
import { fetchRecentTransactionsApi } from "./recentTransactionsApi";

export const fetchRecentTransactionsThunk = createAsyncThunk<
  TransactionEntry[],
  number | undefined,
  { rejectValue: string }
>("recentTransactions/fetchRecent", async (limit = 5, thunkAPI) => {
  try {
    return await fetchRecentTransactionsApi(limit);
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});
