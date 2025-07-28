import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ExpenseEntry } from "../../types/Interface";
import {
  fetchPaginatedExpenses,
  fetchTotalExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "./expense.thunks";
import { createAction } from "@reduxjs/toolkit";

interface ExpenseState {
  data: ExpenseEntry[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  totalAmount: number;
  currentPage: number;
}

const initialState: ExpenseState = {
  data: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 1,
  totalAmount: 0,
  currentPage: 1,
};

export const hydrate = createAction<{
  data: ExpenseEntry[];
  overallTotalExpense: number;
}>("expenses/hydrate");

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    resetExpenseState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Pagination
      .addCase(fetchPaginatedExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaginatedExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPaginatedExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Total
      .addCase(fetchTotalExpenses.fulfilled, (state, action) => {
        state.totalAmount = action.payload;
      })

      // Add
      .addCase(addExpense.fulfilled, (state, action) => {
        state.data.unshift(action.payload);
        state.total += 1;
      })

      // Update
      .addCase(updateExpense.fulfilled, (state, action) => {
        const idx = state.data.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (idx !== -1) {
          state.data[idx] = action.payload;
        }
      })

      // Delete
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item._id !== action.payload);
        state.total -= 1;
      })

      .addCase(hydrate, (state, action) => {
        state.data = action.payload.data;
        state.totalAmount = action.payload.overallTotalExpense;
      });
  },
});

export const { setPage, resetExpenseState } = expenseSlice.actions;
export default expenseSlice.reducer;
