import React from "react";
import { render, screen } from "@testing-library/react";
import RecentTransactionsList from "../RecentTransactionsList";

jest.mock("../../hooks/useTypedSelector", () => ({
  useAppSelector: jest.fn(() => ({ data: [], loading: false, error: null })),
}));

describe("RecentTransactionsList", () => {
  it("renders the recent transactions title", () => {
    render(<RecentTransactionsList />);
    expect(screen.getByText("Recent Transactions")).toBeInTheDocument();
  });
});
