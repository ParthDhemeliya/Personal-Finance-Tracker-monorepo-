"use client";
import React from "react";

type User = { first_name: string };
type Balance = { amount: number; percentChange: number };
type Stats = { income: number; expense: number };

interface DashboardProps {
  user: User;
  balance: Balance;
  stats: Stats;
}

export default function Dashboard({ user, balance, stats }: DashboardProps) {
  return (
    <div>
      <h1>
        {user?.first_name
          ? `Welcome back, ${user.first_name}!`
          : "Welcome back!"}
      </h1>
      <div>Total Balance: {balance.amount}</div>
      <div>Income: {stats.income}</div>
      <div>Expense: {stats.expense}</div>
      {/* Add your dashboard UI here */}
    </div>
  );
}
