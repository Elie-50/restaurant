// __tests__/EditProfilePage.test.tsx
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditProfilePage from "@/app/(side-bar)/account/profile/edit/page";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import axios from "axios";
import * as functions from "@/utils/functions";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/store/auth", () => ({
  useAuthStore: jest.fn(),
}));
jest.mock("axios");
jest.mock("@/utils/functions", () => ({
  getCSRFToken: jest.fn(() => "test-csrf-token"),
}));

describe("EditProfilePage", () => {
  const pushMock = jest.fn();
  const setUserMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { firstName: "Jane", lastName: "Doe", phoneNumber: "1234567890" },
      setUser: setUserMock,
    });
    jest.spyOn(functions, "getCSRFToken").mockReturnValue("test-csrf-token");
    // mock alert
    global.alert = jest.fn();
  });

  it("renders form with initial user values", () => {
    render(<EditProfilePage />);

    expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1234567890")).toBeInTheDocument();
  });

  it("updates input fields", () => {
    render(<EditProfilePage />);

    const firstNameInput = screen.getByDisplayValue("Jane");
    const lastNameInput = screen.getByDisplayValue("Doe");
    const phoneInput = screen.getByDisplayValue("1234567890");

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Smith" } });
    fireEvent.change(phoneInput, { target: { value: "0987654321" } });

    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Smith")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0987654321")).toBeInTheDocument();
  });

  it("submits form successfully", async () => {
    (axios.put as jest.Mock).mockResolvedValueOnce({
      data: { user: { firstName: "John", lastName: "Smith", phoneNumber: "0987654321" } },
    });

    render(<EditProfilePage />);

    fireEvent.change(screen.getByDisplayValue("Jane"), { target: { value: "John" } });
    fireEvent.change(screen.getByDisplayValue("Doe"), { target: { value: "Smith" } });
    fireEvent.change(screen.getByDisplayValue("1234567890"), { target: { value: "0987654321" } });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.any(String),
        {
          first_name: "John",
          last_name: "Smith",
          phone_number: "0987654321",
        },
        { headers: { "X-CSRFToken": "test-csrf-token" }, withCredentials: true }
      );
      expect(setUserMock).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Smith",
        phoneNumber: "0987654321",
      });
      expect(pushMock).toHaveBeenCalledWith("/account/profile");
    });
  });

  it("handles failed submit with alert", async () => {
    (axios.put as jest.Mock).mockRejectedValueOnce(new Error("Failed"));

    render(<EditProfilePage />);

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Failed to update profile.");
    });
  });

  it("navigates back when cancel button is pressed", () => {
    render(<EditProfilePage />);

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(pushMock).toHaveBeenCalledWith("/account/profile");
  });
});
