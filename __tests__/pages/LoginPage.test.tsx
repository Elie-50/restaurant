import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/store/auth", () => ({
  useAuthStore: jest.fn(),
}));

describe("LoginPage", () => {
  const pushMock = jest.fn();
  const checkAuthMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      checkAuth: checkAuthMock,
      isAuthenticated: false,
    });
  });

  it("renders login form correctly", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("updates input fields", () => {
    render(<LoginPage />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("password123");
  });

  it("submits form and redirects on success", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({ status: 200 });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        {
          username: "testuser",
          password: "password123",
        },
        { withCredentials: true }
      );
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  it("shows error on failed login", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: "Invalid credentials" } },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "wronguser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });

  it("redirects if already authenticated", () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      checkAuth: checkAuthMock,
      isAuthenticated: true,
    });

    render(<LoginPage />);
    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
