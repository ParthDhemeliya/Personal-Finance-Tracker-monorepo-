import {
  createSlice,
  type PayloadAction,
  createAction,
} from "@reduxjs/toolkit";
import {
  fetchIncomes,
  fetchPaginatedIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
  fetchTotalIncome,
} from "./incomeThunk";
import { type IncomeEntry } from "../../types/Interface";

interface IncomeState {
  data: IncomeEntry[];
  total: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  overallTotalIncome: number;
}

const initialState: IncomeState = {
  data: [],
  total: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
  overallTotalIncome: 0,
};

export const hydrate = createAction<{
  data: IncomeEntry[];
  overallTotalIncome: number;
}>("income/hydrate");

const incomeSlice = createSlice({
  name: "income",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    resetIncomeState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      //  Paginated fetch
      .addCase(fetchPaginatedIncomes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaginatedIncomes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchPaginatedIncomes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //  Fallback: Full fetch (optional)
      .addCase(fetchIncomes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchIncomes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //  Add income (no-op: component triggers re-fetch)
      .addCase(addIncome.fulfilled, () => {
        // no-op
      })

      // Update income in-place
      .addCase(updateIncome.fulfilled, (state, action) => {
        const index = state.data.findIndex((i) => i._id === action.payload._id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })

      // Delete income (no-op: component triggers re-fetch)
      .addCase(deleteIncome.fulfilled, () => {
        // no-op
      })
      .addCase(fetchTotalIncome.fulfilled, (state, action) => {
        state.overallTotalIncome = action.payload;
      })
      .addCase(fetchTotalIncome.rejected, (_action, action) => {
        console.error("Failed to fetch total income:", action.payload);
      })
      .addCase(hydrate, (state, action) => {
        state.data = action.payload.data;
        state.overallTotalIncome = action.payload.overallTotalIncome;
      });
  },
});

export const { setPage, resetIncomeState } = incomeSlice.actions;
export default incomeSlice.reducer;
