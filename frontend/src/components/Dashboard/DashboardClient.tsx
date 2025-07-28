"use client";
import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  ArrowUpIcon,
  ArrowDownIcon,
} from "lucide-react";
import SavingsGoalCard from "./SavingsGoalCard";
import SpendingPieChart from "./SpendingPieChart";
import RecentTransactionsList from "../RecentTransactionsList";
import TransactionModal from "../TransactionModal";
import { useAppDispatch } from "../../hooks/useTypedDispatch";
import { useAppSelector } from "../../hooks/useTypedSelector";
import useToast from "../../hooks/useToast";
import { fetchBalanceThunk } from "../../redux/balance/balanceThunk";
import { addExpense } from "../../redux/expense/expense.thunks";
import { fetchExpenseStatsThunk } from "../../redux/expense/expenseStatsThunk";
import { fetchIncomeStatsThunk } from "../../redux/income/incomeStatsThunk";
import { addIncome } from "../../redux/income/incomeThunk";
import { fetchRecentTransactionsThunk } from "../../redux/recentTransactions/recentTransactionsThunk";
import { fetchSavingsGoalThunk } from "../../redux/savingsGoal/savingsGoalThunk";
import type {
  ExpenseEntry,
  IncomeEntry,
  User,
  Balance,
  Stats,
} from "@/types/Interface";

export default function DashboardClient() {
  const dispatch = useAppDispatch();
  const { showError } = useToast();

  useEffect(() => {
    dispatch(fetchBalanceThunk());
    dispatch(fetchIncomeStatsThunk());
    dispatch(fetchExpenseStatsThunk());
    dispatch(fetchRecentTransactionsThunk(5));
    dispatch(fetchSavingsGoalThunk());
  }, [dispatch]);

  // Remove all local state for user, balance, stats, and loading/error related to the old fetch
  // Use only Redux state for rendering
  const reduxUser = useAppSelector((state) => state.auth.user);
  const reduxBalance = useAppSelector((state) => state.balance.amount);
  const percentChange = useAppSelector((state) => state.balance.percentChange);
  const incomeAmount = useAppSelector((state) => state.incomeStats.amount);
  const incomePercentChange = useAppSelector(
    (state) => state.incomeStats.percentChange,
  );
  const expenseAmount = useAppSelector((state) => state.expenseStats.amount);
  const expensePercentChange = useAppSelector(
    (state) => state.expenseStats.percentChange,
  );

  const balanceLoading = useAppSelector((state) => state.balance.loading);
  const balanceError = useAppSelector((state) => state.balance.error);
  const incomeStatsLoading = useAppSelector(
    (state) => state.incomeStats.loading,
  );
  const incomeStatsError = useAppSelector((state) => state.incomeStats.error);
  const expenseStatsLoading = useAppSelector(
    (state) => state.expenseStats.loading,
  );
  const expenseStatsError = useAppSelector((state) => state.expenseStats.error);

  const isLoading = balanceLoading || incomeStatsLoading || expenseStatsLoading;
  const errorMsg = balanceError || incomeStatsError || expenseStatsError;

  // Remove the loading/error UI based on Redux state
  // Restore the dashboard to always render the main content

  const handleTransactionSubmit = async (
    entry: Omit<IncomeEntry, "_id"> | Omit<ExpenseEntry, "_id">,
  ) => {
    try {
      if (transactionModalOpen === "income") {
        await dispatch(addIncome(entry as Omit<IncomeEntry, "_id">));
        dispatch(fetchIncomeStatsThunk());
        dispatch(fetchBalanceThunk());
      } else if (transactionModalOpen === "expense") {
        await dispatch(addExpense(entry as Omit<ExpenseEntry, "_id">));
        dispatch(fetchExpenseStatsThunk());
        dispatch(fetchBalanceThunk());
      }
      dispatch(fetchRecentTransactionsThunk(5));
      setTransactionModalOpen(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
      showError("Failed to add transaction. Please try again.");
    }
  };

  const [transactionModalOpen, setTransactionModalOpen] = useState<
    false | "income" | "expense"
  >(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pt-14">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {reduxUser?.first_name
                ? `Welcome back, ${reduxUser.first_name}!`
                : "Welcome back!"}
            </h1>
            <p className="text-gray-600">
              Here's your financial overview for this month.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-end">
            <button
              className="px-5 py-2 rounded-lg bg-blue-100 text-blue-800 font-semibold border border-blue-200 hover:bg-blue-200 hover:text-blue-900 transition cursor-pointer"
              onClick={() => setTransactionModalOpen("income")}
            >
              + Add Income
            </button>
            <button
              className="px-5 py-2 rounded-lg bg-red-100 text-red-800 font-semibold border border-red-200 hover:bg-red-200 hover:text-red-900 transition cursor-pointer"
              onClick={() => setTransactionModalOpen("expense")}
            >
              + Add Expense
            </button>
          </div>
        </div>
        {transactionModalOpen && (
          <TransactionModal
            onClose={() => setTransactionModalOpen(false)}
            onSubmit={handleTransactionSubmit}
            mode="add"
            type={transactionModalOpen}
          />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <SummaryCard
            title="Total Balance"
            icon={<DollarSign className="w-20 h-20" />}
            amount={reduxBalance}
            percent={percentChange}
            iconColor="blue"
          />
          <SummaryCard
            title="Monthly Income"
            icon={<TrendingUp className="w-20 h-20" />}
            amount={incomeAmount}
            percent={incomePercentChange}
            iconColor="green"
          />
          <SummaryCard
            title="Monthly Expenses"
            icon={<CreditCard className="w-20 h-20" />}
            amount={expenseAmount}
            percent={expensePercentChange}
            iconColor="red"
          />
          <SavingsGoalCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SpendingPieChart />
          <RecentTransactionsList />
        </div>
      </div>
    </div>
  );
}

type SummaryCardProps = {
  title: string;
  icon: React.ReactNode;
  amount: number | null | undefined;
  percent: number;
  iconColor: "blue" | "green" | "red";
};

function SummaryCard({
  title,
  icon,
  amount,
  percent,
  iconColor,
}: SummaryCardProps) {
  const colorMap = {
    blue: {
      bg: "from-blue-50 to-blue-100",
      border: "border-blue-200 hover:border-blue-400",
      text: "text-blue-700",
      value: "text-blue-900",
      icon: "text-blue-300",
    },
    green: {
      bg: "from-green-50 to-green-100",
      border: "border-green-200 hover:border-green-400",
      text: "text-green-700",
      value: "text-green-900",
      icon: "text-green-300",
    },
    red: {
      bg: "from-red-50 to-red-100",
      border: "border-red-200 hover:border-red-400",
      text: "text-red-700",
      value: "text-red-900",
      icon: "text-red-300",
    },
  };

  const { bg, border, text, value, icon: iconColorClass } = colorMap[iconColor];

  return (
    <div
      className={`relative bg-gradient-to-br ${bg} p-6 rounded-2xl shadow-lg border-2 ${border} transition-colors duration-200 overflow-hidden group`}
    >
      <div
        className={`absolute right-4 top-4 opacity-10 ${iconColorClass} text-7xl pointer-events-none select-none group-hover:opacity-20 transition-opacity duration-200`}
      >
        {icon}
      </div>
      <div className="flex justify-between items-center mb-3 z-10 relative">
        <h3 className={`text-base font-bold ${text} tracking-wide`}>{title}</h3>
      </div>
      <div className={`text-3xl font-extrabold ${value} mb-2 z-10 relative`}>
        ₹{Number(amount || 0).toLocaleString()}
      </div>
      <p
        className={`text-sm ${
          percent > 0
            ? "text-green-600"
            : percent < 0
              ? "text-red-600"
              : "text-gray-500"
        } flex items-center mt-1 z-10 relative`}
      >
        {percent > 0 && <ArrowUpIcon className="w-4 h-4 mr-1" />}
        {percent < 0 && <ArrowDownIcon className="w-4 h-4 mr-1" />}
        {percent === 0
          ? "No change from last period"
          : `${percent > 0 ? "+" : ""}${Math.round(percent)}% from last period`}
      </p>
    </div>
  );
}
