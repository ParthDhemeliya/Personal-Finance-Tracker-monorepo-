import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";
import { type IncomeEntry } from "../../types/Interface";
import getErrorMessage from "../../utils/getErrorMessage";

// Fetch all incomes (non-paginated fallback)
export const fetchIncomes = createAsyncThunk(
  "income/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/v1/incomes");
      return res.data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  },
);

//  Fetch paginated incomes
export const fetchPaginatedIncomes = createAsyncThunk(
  "income/fetchPaginated",
  async ({ page, limit }: { page: number; limit: number }, thunkAPI) => {
    try {
      const res = await axios.get(
        `/v1/incomes/paginated?page=${page}&limit=${limit}`,
      );

      return res.data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  },
);

// Add income
export const addIncome = createAsyncThunk(
  "income/addIncome",
  async (incomeData: Omit<IncomeEntry, "_id">, thunkAPI) => {
    try {
      const response = await axios.post("/v1/incomes", incomeData);
      return response.data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  },
);

//  Update income
export const updateIncome = createAsyncThunk(
  "income/update",
  async (
    { id, data }: { id: string; data: Partial<IncomeEntry> },
    thunkAPI,
  ) => {
    try {
      const res = await axios.put(`/v1/incomes/${id}`, data);
      return res.data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  },
);

//  Delete income
export const deleteIncome = createAsyncThunk(
  "income/delete",
  async (id: string, thunkAPI) => {
    try {
      await axios.delete(`/v1/incomes/${id}`);
      return id;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  },
);

//total income
export const fetchTotalIncome = createAsyncThunk(
  "income/fetchTotalIncome",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/v1/incomes/total");
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
