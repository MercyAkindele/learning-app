import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import Notes from "./Notes";
// import { vi } from "vitest";
// import { auth } from "../firebase/firebase";
// import { saveNotes, getNotes, editNote, deleteNote } from "../utils/api";
import { act } from "react-dom/test-utils";

describe("Notes", () => {
  // mock firebase to return a fake current user
  // https://vitest.dev/api/vi.html#vi-mock
  vi.mock("../firebase/firebase", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../firebase/firebase")>();
    return {
      ...mod,
      // replace some exports
      auth: {
        currentUser: {
          getIdToken: () => "testToken123",
        },
      },
    };
  });

  // mock api calls to return fake data
  // https://vitest.dev/api/vi.html#vi-mock
  const apiMocks = vi.hoisted(() => {
    return {
      saveNotes: vi.fn(() => {
        return { notes_id: 123 };
      }),
      getNotes: vi.fn(() => {
        return [{ note_content: "Initial note", notes_id: 456 }];
      }),
    };
  });

  vi.mock("../utils/api", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../utils/api")>();
    return {
      ...mod,
      // replace some exports
      saveNotes: apiMocks.saveNotes,
      getNotes: apiMocks.getNotes,
    };
  });

  let container: HTMLElement | null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      document.body.removeChild(container);
      container = null;
    }
  });

  it("Should render on the page when called", async () => {
    await waitFor(async () => {
      expect(() => {
        render(<Notes subjectIdentification={1} />);
      }).not.toThrow();
    });
  });

  it("Should render notes on the page", async () => {
    render(<Notes subjectIdentification={1} />);
    await waitFor(async () => {
      const note = screen.getByText(/Initial note/i);
      expect(apiMocks.getNotes).toHaveBeenCalled();
      expect(note).toBeInTheDocument();
    });
  });

  it("Should have an Add Note button", async () => {
    render(<Notes subjectIdentification={1} />);
    await waitFor(async () => {
      const addButton = screen.getByRole("button", { name: /Add Note/i });
      expect(addButton).toBeVisible();
    });
  });

  it("Should have an input field to write note ", async () => {
    render(<Notes subjectIdentification={1} />);
    await waitFor(async () => {
      const notesField = screen.getByRole("textbox");
      expect(notesField).toBeVisible();
    });
  });

  it("Should add a note on the page when add button is clicked with valid input", async () => {
    render(<Notes subjectIdentification={1} />);
    const noteInput = screen.getByRole("textbox");
    const submitButton = screen.getByRole("button", { name: /Add Note/i });
    const newText = "A new note";

    await act(async () => {
      fireEvent.change(noteInput, { target: { value: newText } });
      fireEvent.click(submitButton);
    });

    await waitFor(async () => {
      const newNote = screen.getByTestId("notes1");
      const actualNote = screen.getByTestId("note-456");
      const deleteButton = screen.getByRole("button", { name: /delete/i });
      const editButton = screen.getByRole("button", { name: /edit/i });
      expect(apiMocks.saveNotes).toHaveBeenCalled();
      expect(newNote).toContain(actualNote);
      expect(newNote).toContain(deleteButton);
      expect(newNote).toContain(editButton);
    });
  });
});
