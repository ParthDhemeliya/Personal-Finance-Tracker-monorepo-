import React from "react";
import { render, screen } from "@testing-library/react";
import NavBar from "../NavBar";

jest.mock("../../hooks/useTypedSelector", () => ({
  useAppSelector: jest.fn(() => ({
    user: { first_name: "Test", last_name: "User", email: "test@example.com" },
    hasFetchedUser: true,
    loading: false,
  })),
}));
jest.mock("../../hooks/useTypedDispatch", () => ({
  useAppDispatch: () => jest.fn(),
}));
jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("../../hooks/useToast", () => () => ({ showSuccess: jest.fn() }));

describe("NavBar", () => {
  it("renders the navigation bar with app title", () => {
    render(<NavBar />);
    expect(screen.getByText("My Budget")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
