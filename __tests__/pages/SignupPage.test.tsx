import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupPage from "@/app/(auth)/sign-up/page";
import axios from "axios";
import { useRouter } from "next/navigation";

jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SignupPage", () => {
  const pushMock = jest.fn();

  const getFields = () => ({
    username: screen.getByPlaceholderText("Username"),
    password: screen.getByPlaceholderText("Password"),
    confirm: screen.getByPlaceholderText("Confirm Password"),
    email: screen.getByPlaceholderText("Email"),
    firstName: screen.getByPlaceholderText("First Name"),
    lastName: screen.getByPlaceholderText("Last Name"),
    header: screen.getByTestId("header"),
    submit: screen.getByTestId("submit-button"),
  });

  const fillForm = () => {
    const { username, password, confirm, email, firstName, lastName } = getFields();

    fireEvent.change(username, { target: { value: "testuser" } });
    fireEvent.change(password, { target: { value: "password123" } });
    fireEvent.change(confirm, { target: { value: "password123" } });
    fireEvent.change(email, { target: { value: "user@example.com" } });
    fireEvent.change(firstName, { target: { value: "Test" } });
    fireEvent.change(lastName, { target: { value: "User" } });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    render(<SignupPage />);
  });

  it("renders sign up form correctly", () => {
    const { header, username, password, confirm, email, firstName, lastName, submit } = getFields();

    expect(header).toBeInTheDocument();
    expect(username).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(confirm).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();
    expect(submit).toBeInTheDocument();
  });

  it("updates input fields", () => {
    fillForm();
    const { username, password, confirm, email, firstName, lastName } = getFields();

    expect(username).toHaveValue("testuser");
    expect(password).toHaveValue("password123");
    expect(confirm).toHaveValue("password123");
    expect(email).toHaveValue("user@example.com");
    expect(firstName).toHaveValue("Test");
    expect(lastName).toHaveValue("User");
  });

  it("submits form and redirects on success", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({ status: 201 });

    fillForm();
    const { submit } = getFields();
    fireEvent.click(submit);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        {
          username: "testuser",
          email: "user@example.com",
          password: "password123",
          first_name: "Test",
          last_name: "User",
        },
        { withCredentials: true }
      );
      expect(pushMock).toHaveBeenCalledWith("/login");
    });
  });

  it("shows error on failed signup", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: "User already exists" } },
    });

    const { submit } = getFields();
    fireEvent.click(submit);

    expect(await screen.findByText("User already exists")).toBeInTheDocument();
  });
});
