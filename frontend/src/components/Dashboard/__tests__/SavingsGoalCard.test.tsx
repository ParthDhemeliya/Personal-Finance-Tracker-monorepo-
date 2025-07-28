import React from "react";
import { render, screen } from "@testing-library/react";
import SavingsGoalCard from "../SavingsGoalCard";

jest.mock("../../../hooks/useTypedDispatch", () => ({
  useAppDispatch: () => jest.fn(),
}));
jest.mock("../../../hooks/useTypedSelector", () => ({
  useAppSelector: jest.fn((cb) =>
    cb({ savingsGoal: { target: 1000, current: 200, loading: false } }),
  ),
}));
jest.mock("../../../hooks/useToast", () => () => ({
  showSuccess: jest.fn(),
  showError: jest.fn(),
}));

describe("SavingsGoalCard", () => {
  it("renders the savings goal title", () => {
    render(<SavingsGoalCard />);
    expect(screen.getByText("Savings Goal")).toBeInTheDocument();
  });
});
