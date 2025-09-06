/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import AccountRewards from "@/app/(side-bar)/account/rewards/page";
import { cookies } from "next/headers";

// Mock ErrorLine to simplify snapshot/testing
jest.mock("@/components/ErrorLine", () => ({ text }: { text: string }) => <div>{text}</div>);

// Mock Next.js cookies
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("AccountRewards", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders points correctly", async () => {
    const mockCookieStore = { get: jest.fn(() => ({ value: "abc123" })) };
    (cookies as jest.Mock).mockResolvedValue(mockCookieStore);

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ points: 50 }),
    } as any);

    const Component = await AccountRewards();
    render(<>{Component}</>);

    expect(screen.getByText("My rewards")).toBeInTheDocument();
    expect(screen.getByText("You are 150 points away from a $5 reward!")).toBeInTheDocument();
    expect(screen.getByText("You have 50 points earned.")).toBeInTheDocument();
    expect(screen.getByText("25%")).toBeInTheDocument(); // 50/200 = 25%
  });

  it("shows error if fetch fails", async () => {
    const mockCookieStore = { get: jest.fn(() => ({ value: "abc123" })) };
    (cookies as jest.Mock).mockResolvedValue(mockCookieStore);

    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    const Component = await AccountRewards();
    render(<>{Component}</>);

    expect(screen.getByText("Failed to fetch points")).toBeInTheDocument();
  });

  it("handles missing session cookie gracefully", async () => {
    const mockCookieStore = { get: jest.fn(() => undefined) };
    (cookies as jest.Mock).mockResolvedValue(mockCookieStore);

    global.fetch = jest.fn().mockRejectedValue(new Error("No session"));

    const Component = await AccountRewards();
    render(<>{Component}</>);

    expect(screen.getByText("Failed to fetch points")).toBeInTheDocument();
  });
});
