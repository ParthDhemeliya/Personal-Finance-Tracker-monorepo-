import React from "react";
import { render, screen } from "@testing-library/react";
import StatCard from "../StatCard";

describe("StatCard", () => {
  it("renders with title and value", () => {
    render(
      <StatCard
        title="Test Stat"
        value={100}
        icon={<span data-testid="icon" />}
        bgGradient="bg-gradient-to-r from-blue-100 to-blue-200"
        iconBg="bg-blue-200"
      />,
    );
    expect(screen.getByText("Test Stat")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
