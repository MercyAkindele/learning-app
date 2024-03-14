import {
  TextField,
  Container,
  Button,
  Checkbox,
  Typography,
  List,
  ListItem,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useAuth } from "../firebase/auth";
import { auth } from "../firebase/firebase";
import { saveNotes, getNotes, editNote, deleteNote } from "../utils/api";

type NotesProps = {
  subjectIdentification: number | undefined;
};
type NoteContent = {
  note_content: string;
  notes_id: number;
};

const Notes = ({ subjectIdentification }: NotesProps) => {
  const { authUser } = useAuth();
  const [note, setNote] = useState("");
  const [noteId, setNoteId] = useState(0);
  const [listOfNotes, setListOfNotes] = useState<NoteContent[]>([]);
  const [isEdited, setIsEdited] = useState(false);
  const [clicked, setCliked] = useState(false);

  useEffect(() => {
    console.log("subject id in empty useEffect", subjectIdentification);
  }, []);
  //map through list of notes and then setListOFNotes to [...] and to the new note.
  //subjectId starts out as null during the first useEffect cycle because you havent chosen a subject yet

  useEffect(() => {
    const renderListOfNotes = async () => {
      console.log(
        "this is the subject ID in the renderListOfNotes function: ",
        subjectIdentification
      );

      if (auth.currentUser) {
        try {
          const userIdToken = await auth.currentUser?.getIdToken();
          const getTheNotes = await getNotes(
            userIdToken,
            subjectIdentification
          );
          console.log(
            "this is the notes retreived from the database: ",
            getTheNotes
          );
          setListOfNotes(getTheNotes);
        } catch (error) {
          console.error(error);
        }
      }
    };
    renderListOfNotes();
  }, [clicked, authUser?.uid, subjectIdentification]);

  const addNotesHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (auth.currentUser) {
      try {
        const userIdToken = await auth.currentUser.getIdToken();
        if (!isEdited) {
          const savingNotes = await saveNotes(userIdToken, {
            subjectIdentification,
            note,
          });
          console.log(
            "this is what comes back when trying to save the notes: ",
            savingNotes
          );
          setListOfNotes((previous) => [
            ...previous,
            { note_content: note, notes_id: savingNotes.notes_id },
          ]);
          setNote("");
        } else if (isEdited) {
          console.log("inside edit frontend");
          console.log("this is the note now: ", note);
          const editTheNote = await editNote(
            userIdToken,
            subjectIdentification,
            { note, noteId }
          );
          console.log(
            "this is what comes back from editTheNote frontend: ",
            editTheNote
          );
          setListOfNotes((previous) => [
            ...previous,
            { note_content: note, notes_id: noteId },
          ]);
          setNote("");
          setIsEdited(false);
        }
        setCliked(!clicked);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (noteIdentification: number, noteContent: string) => {
    setIsEdited(true);
    setNoteId(noteIdentification);
    setNote(noteContent);
  };

  const handleDeleteNote = async (noteIdentification: number) => {
    console.log(
      "this is noteidentification in the frontend: ",
      noteIdentification
    );
    const newList = listOfNotes.filter(
      (note) => note.notes_id !== noteIdentification
    );
    console.log("this is new list: ", newList);
    if (auth.currentUser) {
      try {
        const userIdToken = await auth.currentUser.getIdToken();
        await deleteNote(
          userIdToken,
          subjectIdentification,
          noteIdentification
        );
        setListOfNotes(newList);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Container>
      <Box component="form" onSubmit={addNotesHandler}>
        <TextField
          variant="outlined"
          label="Add your note"
          multiline={true}
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
          }}
        />
        <Button variant="contained" type="submit">
          {isEdited ? "Edit Note" : "Add Note"}
        </Button>
      </Box>
      <Box>
        <List data-testid="notes1">
          {listOfNotes &&
            listOfNotes.map((item) => (
              <ListItem
                key={item.notes_id}
                data-testid={`note-${item.notes_id}`}
              >
                <Checkbox />
                <Typography>{item.note_content}</Typography>
                <Button
                  onClick={() => handleEdit(item.notes_id, item.note_content)}
                >
                  Edit
                </Button>
                <Button onClick={() => handleDeleteNote(item.notes_id)}>
                  Delete
                </Button>
              </ListItem>
            ))}
        </List>
      </Box>
    </Container>
  );
};

export default Notes;
