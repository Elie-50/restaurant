/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import AddressCard from "@/components/server/AddressCard";

// Mock Next.js Link & Image
jest.mock("next/link", () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});
jest.mock("next/image", () => {
  return (props: any) => <img {...props} alt={props.alt || "image"} />;
});

describe("AddressCard", () => {
  const mockHandleDelete = jest.fn();
  const baseProps = {
    id: "123",
    street: "Oxford",
    building: "University",
    floor: "2",
    city: "London",
    gpsLink: "http://maps.example.com",
    imageUrl: "http://example.com/image.jpg",
    handleDelete: mockHandleDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders address details", () => {
    render(<AddressCard {...baseProps} />);

    expect(screen.getByText(/Oxford, University, Apt 2/)).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
  });

  it("calls handleDelete with correct id when delete button is clicked", () => {
    render(<AddressCard {...baseProps} />);
    const deleteButton = screen.getByLabelText("Delete Address");
    fireEvent.click(deleteButton);

    expect(mockHandleDelete).toHaveBeenCalledWith("123");
  });

  it("renders GPS link when gpsLink is provided", () => {
    render(<AddressCard {...baseProps} />);
    const gpsLink = screen.getByText("View on Map");
    expect(gpsLink).toHaveAttribute("href", "http://maps.example.com");
  });

  it("renders fallback image when no imageUrl is provided", () => {
    render(<AddressCard {...baseProps} imageUrl={undefined} />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "/placeholder.png");
  });

  it("links to edit page", () => {
    render(<AddressCard {...baseProps} />);
    const editLink = screen.getByRole("link", { name: /edit/i });
    expect(editLink).toHaveAttribute(
      "href",
      "/account/addresses/123"
    );
  });
});
