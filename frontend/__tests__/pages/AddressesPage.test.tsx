/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AddressesPage from "@/app/(side-bar)/account/addresses/page";
import { ADDRESSES_URL } from "@/lib/constants";

jest.mock("@/components/AddressCard", () => (props: any) => (
  <div data-testid="address-card">
    <span>{props.street}</span>
    <button onClick={() => props.handleDelete(props.id)}>Delete</button>
  </div>
));
jest.mock("@/components/Spinner", () => () => <div data-testid="spinner">Loading...</div>);

jest.mock("@/utils/functions", () => ({
  getCSRFToken: jest.fn(() => "test-csrf-token"),
}));

describe("AddressesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // mock confirm
    global.confirm = jest.fn(() => true);
  });

  it("shows spinner while loading", async () => {
    (global.fetch as jest.Mock) = jest.fn(() =>
      new Promise(() => {}) // never resolves
    ) as any;

    render(<AddressesPage />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders addresses after fetch", async () => {
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            count: 1,
            next: null,
            previous: null,
            results: [
              {
                id: "1",
                street: "Oxford",
                city: "London",
                building: "University",
                floor: "Ground",
                gps_link: "",
                image: "",
                created_at: "2025-08-31T19:39:44.485409+03:00",
              },
            ],
          }),
      })
    ) as any;

    render(<AddressesPage />);

    await waitFor(() =>
      expect(screen.getByText("Oxford")).toBeInTheDocument()
    );
    expect(screen.getByTestId("address-card")).toBeInTheDocument();
  });

  it("shows message when no addresses exist", async () => {
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            count: 0,
            next: null,
            previous: null,
            results: [],
          }),
      })
    ) as any;

    render(<AddressesPage />);

    await waitFor(() =>
      expect(
        screen.getByText("No addresses added yet")
      ).toBeInTheDocument()
    );
  });

  it("deletes an address when handleDelete is called", async () => {
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      if (options?.method === "DELETE") {
        return Promise.resolve({ ok: true });
      }
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            count: 1,
            next: null,
            previous: null,
            results: [
              {
                id: "1",
                street: "Oxford",
                city: "London",
                building: "University",
                floor: "Ground",
                gps_link: "",
                image: "",
                created_at: "2025-08-31T19:39:44.485409+03:00",
              },
            ],
          }),
      });
    });

    render(<AddressesPage />);

    await waitFor(() =>
      expect(screen.getByText("Oxford")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${ADDRESSES_URL}1/`,
        expect.objectContaining({
          method: "DELETE",
          credentials: "include",
          headers: { "X-CSRFToken": "test-csrf-token" },
        })
      );
    });

    // After delete, no address card should remain
    await waitFor(() =>
      expect(screen.queryByTestId("address-card")).not.toBeInTheDocument()
    );
  });
});
