import React from "react";
import { render, screen } from "@testing-library/react";
import SidebarLinks from "../SidebarLinks";

describe("SidebarLinks", () => {
  it("renders all sidebar navigation links", () => {
    render(<SidebarLinks currentPath="/dashboard" />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Income")).toBeInTheDocument();
    expect(screen.getByText("Expense")).toBeInTheDocument();
  });
});
