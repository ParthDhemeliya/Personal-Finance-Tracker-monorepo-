import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfilePopup from "../ProfilePopup";

describe("ProfilePopup", () => {
  it("renders user info and buttons", () => {
    const onLogout = jest.fn();
    const onClose = jest.fn();
    render(
      <ProfilePopup
        onLogout={onLogout}
        onClose={onClose}
        user={{
          name: "Test User",
          email: "test@example.com",
          profile: "profile.jpg",
        }}
      />,
    );
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Logout"));
    expect(onLogout).toHaveBeenCalled();
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });
});
