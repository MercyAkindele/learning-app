import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import Notes from "./Notes";
import { vi } from "vitest";
// import { auth } from "../firebase/firebase";
// import { saveNotes, getNotes, editNote, deleteNote } from "../utils/api";
import { act } from "react-dom/test-utils";

// mock firebase to return a fake current user
// https://vitest.dev/api/vi.html#vi-mock
vi.mock('../firebase/firebase', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../firebase/firebase')>()
  return {
    ...mod,
    // replace some exports
    auth: {
      currentUser: {
        getIdToken: () => 'testToken123'
      }
    },
  }
})

// mock api calls to return fake data
// https://vitest.dev/api/vi.html#vi-mock
const apiMocks = vi.hoisted(() => {
  return {
    saveNotes: vi.fn(() => { return { notes_id: 123 }; }),
    getNotes: vi.fn(() => { return []; }),
  }
})

vi.mock('../utils/api', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../utils/api')>()
  return {
    ...mod,
    // replace some exports
    saveNotes: apiMocks.saveNotes,
    getNotes: apiMocks.getNotes,
  }
})

describe("Notes", () => {
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

  it("Should render on the page when called", () => {
    expect(() => {
      render(<Notes subjectIdentification={1} />);
    }).not.toThrow();
  });

  it("Should have an Add Note button", () => {
    render(<Notes subjectIdentification={1} />);
    const addButton = screen.getByRole("button", { name: /Add Note/i });
    expect(addButton).toBeVisible();
  });

  it("Should have an input field to write note ", () => {
    render(<Notes subjectIdentification={1} />);
    const notesField = screen.getByRole("textbox");
    expect(notesField).toBeVisible();
  });

  it("Should see if saveNotes function is called on submission of note.", async ()=>{
    render(<Notes subjectIdentification={1}/>)
    const noteInput = screen.getByRole("textbox")
    const submitButton = screen.getByRole("button", {name:/Add Note/i})
    await act(async () =>{
      fireEvent.change(noteInput, { target: { value: "A new note" } })
      fireEvent.click(submitButton)
  })

    await waitFor(() => expect(apiMocks.saveNotes).toHaveBeenCalled());
  })

  // it("Should add a note on the page when add button is clicked with valid input", async () => {
  //   render(<Notes subjectIdentification={1} />);
  //   const notesField = screen.getByRole("textbox");
  //   const addButton = screen.getByRole("button", { name: /Add Note/i });
  //   await userEvent.type(notesField, "Im a note");
  //   await userEvent.click(addButton);
  //   const listOfNotes = screen.queryAllByTestId("individual-notes");
  //   const specificNote = screen.getByText("Im a note");
  //   await waitFor(() => {
  //     expect(listOfNotes).toBeInTheDocument();
  //     expect(specificNote).toBeInTheDocument();
  //   });
  // });
  // it("Should render multiple notes on the page when you add multiple notes", async () => {
  //   vi.mock("../utils/api", () => ({
  //       saveNotes: vi.fn(async () => ({notes_id:1})),
  //       getNotes:vi.fn(async ()=>[])
  //     }));
  //   vi.mock('../firebase/firebase', () => ({
  //       auth: {
  //         currentUser: {
  //           uid: 'mercy',
  //           email: 'test@test.com',
  //           getIdToken: vi.fn(async ()=>"mockToken")
  //         },
  //         isLoading: false,
  //         signUp: async () => {

  //         },
  //         logIn: async () => {

  //         },
  //         logOut: async () => {},
  //       },
  //     }));
  //     render(<Notes subjectIdentification={1} />);

  //     async function addNoteAndSubmit(text:string){
  //       const notesField = screen.getByRole("textbox");
  //     const addButton = screen.getByRole("button", { name: /Add Note/i });
  //       await userEvent.type(notesField, text);
  //       await userEvent.click(addButton);
  //     }
  //     addNoteAndSubmit("hello")
  //     addNoteAndSubmit("hello, world")
  //     addNoteAndSubmit("Mercy")

  //     expect(screen.getByText("hello")).toBeInTheDocument();
  //     expect(screen.getByText("hello, world")).toBeInTheDocument();
  //     expect(screen.getByText("Mercy")).toBeInTheDocument();
  // });
});
