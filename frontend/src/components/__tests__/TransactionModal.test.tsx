import React from "react";
import { render, screen } from "@testing-library/react";
import TransactionModal from "../TransactionModal";

describe("TransactionModal", () => {
  it("renders the add income title", () => {
    render(
      <TransactionModal
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        mode="add"
        type="income"
      />,
    );
    expect(screen.getByText("Add Income")).toBeInTheDocument();
  });
});
