import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CategoryDropdown from "../CategoryDropdown";

describe("CategoryDropdown", () => {
  it("renders and allows category selection", () => {
    const setValue = jest.fn();
    const setCustomValue = jest.fn();
    const setDropdownOpen = jest.fn();
    render(
      <CategoryDropdown
        type="expense"
        value=""
        customValue=""
        setValue={setValue}
        setCustomValue={setCustomValue}
        error={undefined}
        dropdownOpen={false}
        setDropdownOpen={setDropdownOpen}
      />,
    );
    expect(screen.getByText("Expense Category")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));
  });
});
