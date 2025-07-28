import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice";
import incomeReducer from "./income/incomeSlice";
import incomeStatsReducer from "./income/incomeStatsSlice";
import expenseReducer from "./expense/expense.slice";
import expenseStatsReducer from "./expense/expenseStatsSlice";
import expenseCategoryReducer from "./expense/expenseCategorySlice";
import balanceReducer from "./balance/balanceSlice";
import savingsGoalReducer from "./savingsGoal/savingsGoalSlice";
import recentTransactionsReducer from "./recentTransactions/recentTransactionsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    income: incomeReducer,
    incomeStats: incomeStatsReducer,
    expenses: expenseReducer,
    balance: balanceReducer,
    expenseStats: expenseStatsReducer,
    savingsGoal: savingsGoalReducer,
    recentTransactions: recentTransactionsReducer,
    expenseCategory: expenseCategoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
