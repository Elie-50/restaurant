/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditAddressPage from "@/app/(side-bar)/account/addresses/[id]/page";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

// Mock Next.js Image (so <Image> works in Jest)
jest.mock("next/image", () => (props: any) => <img {...props} alt={props.alt || "image"} />);

// Mock router
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));

// Mock axios
jest.mock("@/lib/axios");

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

  it("renders spinner while loading existing address", () => {
    (api.get as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<EditAddressPage params={{ id: "123" }} />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("loads existing address and displays values", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        _id: "123",
        street: "Oxford",
        building: "University",
        city: "London",
        floor: "2",
        gpsLink: "http://maps.example.com",
        image: "http://example.com/img.jpg",
      },
    });

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
    (api.post as jest.Mock).mockResolvedValueOnce({});

    render(<EditAddressPage params={{ id: "new" }} />);

    fireEvent.change(screen.getByLabelText("Street"), { target: { value: "Baker" } });
    fireEvent.change(screen.getByLabelText("Building"), { target: { value: "House" } });
    fireEvent.change(screen.getByLabelText("City"), { target: { value: "London" } });

    fireEvent.click(screen.getByRole("button", { name: /add address/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/users/me/addresses", expect.any(FormData));
      expect(pushMock).toHaveBeenCalledWith("/account/addresses");
    });
  });

  it("submits edited address with PUT", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        _id: "123",
        street: "Oxford",
        building: "University",
        city: "London",
        floor: "",
        gpsLink: "",
        image: "",
      },
    });

    (api.put as jest.Mock).mockResolvedValueOnce({});

    render(<EditAddressPage params={{ id: "123" }} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Oxford")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Street"), { target: { value: "Changed" } });
    fireEvent.click(screen.getByRole("button", { name: /update address/i }));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/api/users/me/addresses/123", expect.any(FormData));
      expect(pushMock).toHaveBeenCalledWith("/account/addresses");
    });
  });
});
