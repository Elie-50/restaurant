/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditAddressPage from "@/app/(side-bar)/account/addresses/[id]/page";
import { useRouter } from "next/navigation";
import { ADDRESSES_URL } from "@/lib/constants";

// Mock Next.js Image (so <Image> works in Jest)
jest.mock("next/image", () => {
  return (props: any) => <img {...props} alt={props.alt || "image"} />;
});

// Mock router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock CSRF
jest.mock("@/utils/functions", () => ({
  getCSRFToken: jest.fn(() => "test-csrf-token"),
}));
jest.mock("@/components/Spinner", () => () => <div data-testid="spinner">Loading...</div>);

describe("EditAddressPage", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it("renders 'Add New Address' form when id=new", () => {
    render(<EditAddressPage params={{ id: "new" }} />);
    expect(screen.getByText("Add New Address")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add address/i })).toBeInTheDocument();
  });

  it("renders spinner while loading existing address", async () => {
    // Mock fetch for edit case
    (global.fetch as jest.Mock) = jest.fn(() =>
      new Promise(() => {}) // never resolves
    ) as any;

    render(<EditAddressPage params={{ id: "123" }} />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("loads existing address and displays values", async () => {
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            id: "123",
            street: "Oxford",
            building: "University",
            city: "London",
            floor: "2",
            gps_link: "http://maps.example.com",
            image: "http://example.com/img.jpg",
          }),
      })
    ) as any;

    render(<EditAddressPage params={{ id: "123" }} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Oxford")).toBeInTheDocument();
      expect(screen.getByDisplayValue("University")).toBeInTheDocument();
      expect(screen.getByDisplayValue("London")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2")).toBeInTheDocument();
      expect(screen.getByDisplayValue("http://maps.example.com")).toBeInTheDocument();
    });
  });

  it("submits new address with POST", async () => {
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({ ok: true });

    render(<EditAddressPage params={{ id: "new" }} />);

    fireEvent.change(screen.getByLabelText("Street"), { target: { value: "Baker" } });
    fireEvent.change(screen.getByLabelText("Building"), { target: { value: "House" } });
    fireEvent.change(screen.getByLabelText("City"), { target: { value: "London" } });

    fireEvent.click(screen.getByRole("button", { name: /add address/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${ADDRESSES_URL}`,
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: { "X-CSRFToken": "test-csrf-token" },
        })
      );
      expect(pushMock).toHaveBeenCalledWith("/account/addresses");
    });
  });

  it("submits edited address with PUT", async () => {
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      if (options?.method === "PUT") {
        return Promise.resolve({ ok: true });
      }
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            id: "123",
            street: "Oxford",
            building: "University",
            city: "London",
            floor: "",
            gps_link: "",
            image: "",
          }),
      });
    });

    render(<EditAddressPage params={{ id: "123" }} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Oxford")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Street"), { target: { value: "Changed" } });
    fireEvent.click(screen.getByRole("button", { name: /update address/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${ADDRESSES_URL}123/`,
        expect.objectContaining({
          method: "PUT",
          credentials: "include",
          headers: { "X-CSRFToken": "test-csrf-token" },
        })
      );
      expect(pushMock).toHaveBeenCalledWith("/account/addresses");
    });
  });
});
