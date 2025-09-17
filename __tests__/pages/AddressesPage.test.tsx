/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AddressesPage from "@/app/(side-bar)/account/addresses/page";
import api from "@/lib/axios";

jest.mock("@/components/AddressCard", () => (props: any) => (
  <div data-testid="address-card">
    <span>{props.street}</span>
    <button onClick={() => props.handleDelete(props.id)}>Delete</button>
  </div>
));
jest.mock("@/components/Spinner", () => () => <div data-testid="spinner">Loading...</div>);
jest.mock("@/lib/axios");

describe("AddressesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // mock confirm
    global.confirm = jest.fn(() => true);
  });

  it("shows spinner while loading", () => {
    (api.get as jest.Mock).mockImplementation(() => new Promise(() => {})); // never resolves
    render(<AddressesPage />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders addresses after fetch", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          _id: "1",
          street: "Oxford",
          city: "London",
          building: "University",
          floor: "Ground",
          gpsLink: "",
          image: "",
          createdAt: "2025-08-31T19:39:44.485409+03:00",
        },
      ],
    });

    render(<AddressesPage />);

    await waitFor(() => expect(screen.getByText("Oxford")).toBeInTheDocument());
    expect(screen.getByTestId("address-card")).toBeInTheDocument();
  });

  it("shows message when no addresses exist", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    render(<AddressesPage />);

    await waitFor(() =>
      expect(screen.getByText("No addresses added yet")).toBeInTheDocument()
    );
  });

  it("deletes an address when handleDelete is called", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          _id: "1",
          street: "Oxford",
          city: "London",
          building: "University",
          floor: "Ground",
          gpsLink: "",
          image: "",
          createdAt: "2025-08-31T19:39:44.485409+03:00",
        },
      ],
    });

    (api.delete as jest.Mock).mockResolvedValueOnce({});

    render(<AddressesPage />);

    await waitFor(() => expect(screen.getByText("Oxford")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith("/api/users/me/addresses/1");
    });

    await waitFor(() =>
      expect(screen.queryByTestId("address-card")).not.toBeInTheDocument()
    );
  });
});
