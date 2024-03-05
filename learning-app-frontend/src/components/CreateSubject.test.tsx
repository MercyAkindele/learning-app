import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter as Router } from "react-router-dom";
import CreateSubject from "./CreateSubject";
import { sendSubjectForValidation } from "../utils/api";

describe("CreateSubject", () => {
  let container: HTMLElement | null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    // vi.resetAllMocks()
  });

  afterEach(() => {
    if (container) {
      document.body.removeChild(container);
      container = null;
    }
    // vi.restoreAllMocks()
  });

  // Rendering on screen
  it("Should have Create Subject button", () => {
    render(
      <Router>
        <CreateSubject />
      </Router>
    );
    const buttonName = screen.getByRole("button", {name:/Create Subject/i});
    expect(buttonName).toBeVisible();
  });

  it("Should have the input box on the page", () => {
    render(
      <Router>
        <CreateSubject />
      </Router>
    );
    expect(screen.getByRole("textbox", {name:/Create a Subject/i})).toBeVisible();
  });

  it("Should have the form on the page", () => {
    render(
      <Router>
        <CreateSubject />
      </Router>
    );
    expect(screen.getByTestId("your-form")).toBeVisible();
  });

  it("Should not throw an error when rendering CreateSubject component", () => {
    expect(() => {
      render(
        <Router>
          <CreateSubject />
        </Router>
      );
    }).not.toThrow();
  });

  //Input and Button elements have default values
  it("Should have an empty input field at first", () => {
    render(
      <Router>
        <CreateSubject />
      </Router>
    );
    const inputField = screen.getByRole("textbox", {name:/Create a Subject/i});
    expect(inputField).toHaveValue("");
  });

  it("Should have enabled Create Subject button if there is an input", async () => {
    render(
      <Router>
        <CreateSubject />
      </Router>
    );
    const inputField = screen.getByRole("textbox", {name:/Create a Subject/i});
    await userEvent.type(inputField, "Hello");
    const buttonEl = screen.getByRole("button", {name:/Create Subject/i});
    expect(buttonEl).toBeEnabled();
  });

  it("Should have disabled Create Subject button if there is no input", () => {
    render(
      <Router>
        <CreateSubject />
      </Router>
    );
    const buttonEl = screen.getByRole("button", {name:/Create Subject/i});
    expect(buttonEl).toBeDisabled();
  });

  it("Should have disabled Create Subject Button if the input is just empty spaces", async () => {
    render(
      <Router>
        <CreateSubject />
      </Router>
    );
    const inputField = screen.getByRole("textbox", {name:/Create a Subject/i});
    await userEvent.type(inputField, "    ");
    const buttonEl = screen.getByRole("button", {name:/Create Subject/i});
    expect(buttonEl).toBeDisabled();
  });

  // Check to see if input element work when typing
  it("Should update the text in the input field when typing", async () => {
    render(
      <Router>
        <CreateSubject />
      </Router>
    );
    const inputField = screen.getByRole("textbox", {name:/Create a Subject/i});
    await userEvent.type(inputField, "Hello");
    expect(inputField).toHaveValue("Hello");
  });

  //Check to see if submission works for valid input
  it("Should submit when Create Subject Button is clicked with valid input ", async () => {

    vi.mock('../utils/api', () => ({
      sendSubjectForValidation: vi.fn(),
    }));
    vi.mock('../firebase/firebase', () => ({
      auth: {
        currentUser: {
          uid: 'mercy',
          email: 'test@test.com',
          getIdToken: vi.fn(async ()=>"mockToken")
        },
        isLoading: false,
        signUp: async () => {

        },
        logIn: async () => {

        },
        logOut: async () => {},
      },
    }));


    render(
      <Router>
        <CreateSubject />
      </Router>
    );

    const inputField = screen.getByRole("textbox", {name:/Create a Subject/i});
    await userEvent.type(inputField, '  Hello   ');
    const buttonEl = screen.getByRole("button", {name:/Create Subject/i});
    await userEvent.click(buttonEl);

    await waitFor(() => {
      expect(sendSubjectForValidation).toHaveBeenCalledWith('mockToken', '  Hello   ');
    });
  });
});

