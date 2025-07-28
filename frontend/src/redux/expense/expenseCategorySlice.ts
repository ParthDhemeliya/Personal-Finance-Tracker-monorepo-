import { createSlice } from "@reduxjs/toolkit";
import { fetchExpenseCategorySummaryThunk } from "./expenseCategoryThunk";

interface CategorySummary {
  category: string;
  amount: number;
}

interface ExpenseCategoryState {
  data: CategorySummary[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseCategoryState = {
  data: [],
  loading: false,
  error: null,
};

const expenseCategorySlice = createSlice({
  name: "expenseCategory",
  initialState,
  reducers: {
    resetExpenseCategoryState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenseCategorySummaryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseCategorySummaryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchExpenseCategorySummaryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default expenseCategorySlice.reducer;

export const { resetExpenseCategoryState } = expenseCategorySlice.actions;
