// __tests__/ProfilePage.test.tsx
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfilePage from "@/app/(side-bar)/account/profile/page";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/store/auth", () => ({
  useAuthStore: jest.fn(),
}));
// eslint-disable-next-line react/display-name
jest.mock("@/components/Spinner", () => () => <div data-testid="spinner">Loading...</div>);

describe("ProfilePage", () => {
  const pushMock = jest.fn();
  const checkAuthMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it("renders spinner while loading", () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
      checkAuth: checkAuthMock,
      isAuthenticated: false,
      loading: true,
    });

    render(<ProfilePage />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders message if not authenticated", () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
      checkAuth: checkAuthMock,
      isAuthenticated: false,
      loading: false,
    });

    render(<ProfilePage />);
    expect(screen.getByText("Please log in to view your profile.")).toBeInTheDocument();
  });

  it("renders user profile when authenticated", () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: {
        firstName: "Jane",
        lastName: "Doe",
        username: "janedoe",
        email: "jane@example.com",
        phoneNumber: "1234567890",
        role: "admin",
        isVerified: true,
      },
      checkAuth: checkAuthMock,
      isAuthenticated: true,
      loading: false,
    });

    render(<ProfilePage />);

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("janedoe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();

    // Button should navigate
    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));
    expect(pushMock).toHaveBeenCalledWith("/account/profile/edit");
  });

  it("renders fallback value when field is missing", () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: {
        firstName: "Test",
        lastName: "User",
        username: null,
        email: null,
        phoneNumber: null,
        role: "Customer",
        isVerified: false,
      },
      checkAuth: checkAuthMock,
      isAuthenticated: true,
      loading: false,
    });

    render(<ProfilePage />);

    expect(screen.getAllByText("—")).toHaveLength(3); // username, email, phoneNumber
    expect(screen.getByText("No")).toBeInTheDocument();
  });
});
