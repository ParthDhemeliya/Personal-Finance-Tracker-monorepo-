"use client";

import { Provider } from "react-redux";
import store from "./store";
import { useEffect } from "react";
import { useAppSelector } from "../hooks/useTypedSelector";
import { useAppDispatch } from "../hooks/useTypedDispatch";
import { resetIncomeState } from "./income/incomeSlice";
import { resetExpenseState } from "./expense/expense.slice";
import { resetBalanceState } from "./balance/balanceSlice";
import { resetIncomeStatsState } from "./income/incomeStatsSlice";
import { resetExpenseStatsState } from "./expense/expenseStatsSlice";
import { resetSavingsGoalState } from "./savingsGoal/savingsGoalSlice";
import { resetRecentTransactionsState } from "./recentTransactions/recentTransactionsSlice";
import { resetExpenseCategoryState } from "./expense/expenseCategorySlice";
import { fetchUser } from "./auth/authThunk";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <UserBootstrap />
      <DataResetOnUserChange />
      {children}
    </Provider>
  );
}

function UserBootstrap() {
  const dispatch = useAppDispatch();
  const { user, hasFetchedUser } = useAppSelector((state) => state.auth);
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && !user && !hasFetchedUser) {
      dispatch(fetchUser());
    }
  }, [user, hasFetchedUser, dispatch]);
  return null;
}

function DataResetOnUserChange() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(resetIncomeState());
    dispatch(resetExpenseState());
    dispatch(resetBalanceState());
    dispatch(resetIncomeStatsState());
    dispatch(resetExpenseStatsState());
    dispatch(resetSavingsGoalState());
    dispatch(resetRecentTransactionsState());
    dispatch(resetExpenseCategoryState());
  }, [user?.id]);
  return null;
}
