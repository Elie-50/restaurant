import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/store/auth", () => ({
  useAuthStore: jest.fn(),
}));

describe("LoginPage", () => {
  const pushMock = jest.fn();
  const checkAuthMock = jest.fn();
  const loginMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      checkAuth: checkAuthMock,
      isAuthenticated: false,
      login: loginMock,
    });
  });

  it("renders login form correctly", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("updates input fields", () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("submits form and redirects on success", async () => {
    loginMock.mockResolvedValueOnce(undefined);

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith("test@example.com", "password123");
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  it("shows error on failed login", async () => {
    loginMock.mockRejectedValueOnce({
      response: { data: { error: "Invalid credentials" } },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "wrong@example.com" },
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
      login: loginMock,
    });

    render(<LoginPage />);
    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
