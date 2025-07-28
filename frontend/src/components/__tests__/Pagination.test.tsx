import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../Pagination";

describe("Pagination", () => {
  it("renders and allows page change", () => {
    const onPageChange = jest.fn();
    render(
      <Pagination
        page={1}
        totalPages={3}
        onPageChange={onPageChange}
        total={30}
        pageSize={10}
      />,
    );
    expect(screen.getByText("Showing 1-10 of 30 items")).toBeInTheDocument();
    fireEvent.click(screen.getByText("2"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
