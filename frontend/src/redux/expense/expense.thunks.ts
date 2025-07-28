import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";
import getErrorMessage from "../../utils/getErrorMessage";
import type { ExpenseEntry } from "../../types/Interface";

// Get paginated expenses
export const fetchPaginatedExpenses = createAsyncThunk(
  "expenses/fetchPaginated",
  async ({ page, limit }: { page: number; limit: number }, thunkAPI) => {
    try {
      const res = await axios.get(
        `/v1/expenses/paginated?page=${page}&limit=${limit}`,
      );
      return res.data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  },
);

// Get total expenses
export const fetchTotalExpenses = createAsyncThunk(
  "expenses/fetchTotal",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/v1/expenses/total");
      const total = res.data.total;
      return typeof total === "number"
        ? total
        : total && typeof total.$numberDecimal === "string"
          ? parseFloat(total.$numberDecimal)
          : 0;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  },
);

// Add expense
export const addExpense = createAsyncThunk(
  "expenses/add",
  async (expenseData: Omit<ExpenseEntry, "_id">, thunkAPI) => {
    try {
      const res = await axios.post("/v1/expenses", expenseData);
      return res.data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  },
);

// Update expense
export const updateExpense = createAsyncThunk(
  "expenses/update",
  async (
    { id, data }: { id: string; data: Partial<ExpenseEntry> },
    thunkAPI,
  ) => {
    try {
      const res = await axios.put(`/v1/expenses/${id}`, data);
      return res.data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  },
);

// Delete expense
export const deleteExpense = createAsyncThunk(
  "expenses/delete",
  async (id: string, thunkAPI) => {
    try {
      await axios.delete(`/v1/expenses/${id}`);
      return id; // return the id to remove it from state
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  },
);
