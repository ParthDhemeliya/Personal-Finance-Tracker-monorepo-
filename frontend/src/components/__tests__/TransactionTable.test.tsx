import React from "react";
import { render, screen } from "@testing-library/react";
import TransactionTable from "../TransactionTable";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import incomeReducer from "../../redux/income/incomeSlice";
import expenseReducer from "../../redux/expense/expense.slice";

describe("TransactionTable", () => {
  it("renders with mock data", () => {
    const mockData = [
      {
        _id: "1",
        type: "income",
        amount: 1000,
        date: new Date().toISOString(),
        description: "Salary",
        incomeSource: "Job",
        customIncomeSource: undefined,
        expenseCategory: undefined,
        customExpenseCategory: undefined,
      },
    ];
    const store = configureStore({
      reducer: {
        income: incomeReducer,
        expenses: expenseReducer,
      },
      preloadedState: {
        income: {
          data: [],
          total: 0,
          currentPage: 1,
          totalPages: 1,
          loading: false,
          error: null,
          overallTotalIncome: 0,
        },
        expenses: {
          data: [],
          loading: false,
          error: null,
          total: 0,
          page: 1,
          totalPages: 1,
          totalAmount: 0,
          currentPage: 1,
        },
      },
    });
    render(
      <Provider store={store}>
        <TransactionTable data={mockData} type="income" onDelete={jest.fn()} />
      </Provider>,
    );
    expect(screen.getAllByText("Salary").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Job").length).toBeGreaterThan(0);
  });
});
