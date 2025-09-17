/* eslint-disable react/display-name */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AccountRewards from "@/app/(side-bar)/account/rewards/page";
import { useAuthStore } from "@/store/auth";
import api from "@/lib/axios";

// Mock ErrorLine to simplify testing
jest.mock("@/components/ErrorLine", () => ({ text }: { text: string }) => <div>{text}</div>);

// Mock auth store
jest.mock("@/store/auth", () => ({
  useAuthStore: jest.fn(),
}));

// Mock axios default export correctly
jest.mock("@/lib/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("AccountRewards (client)", () => {
  const useAuthMock = useAuthStore as unknown as jest.Mock;
  const apiGetMock = api.get as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    useAuthMock.mockReturnValue({ accessToken: "token123" });
    apiGetMock.mockReturnValue(new Promise(() => {})); // never resolves

    render(<AccountRewards />);
    expect(screen.getByText("Loading points...")).toBeInTheDocument();
  });

  it("renders points correctly after fetch", async () => {
    useAuthMock.mockReturnValue({ accessToken: "token123" });
    apiGetMock.mockResolvedValue({ data: { points: 50 } });

    render(<AccountRewards />);

    await waitFor(() => {
      expect(screen.getByText("You are 150 points away from a $5 reward!")).toBeInTheDocument();
      expect(screen.getByText("You have 50 points earned.")).toBeInTheDocument();
      expect(screen.getByText("25%")).toBeInTheDocument();
    });
  });

  it("renders error if fetch fails", async () => {
    useAuthMock.mockReturnValue({ accessToken: "token123" });
    apiGetMock.mockRejectedValue(new Error("Network error"));

    render(<AccountRewards />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch points")).toBeInTheDocument();
    });
  });

  it("does not fetch points if accessToken is missing", () => {
    useAuthMock.mockReturnValue({ accessToken: null });

    render(<AccountRewards />);

    expect(apiGetMock).not.toHaveBeenCalled();
  });
});
