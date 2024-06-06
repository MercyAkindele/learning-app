import {
  TextField,
  Button,
  Checkbox,
  Typography,
  List,
  ListItem,
  Box,
  Paper,
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
    const renderListOfNotes = async () => {
      if (auth.currentUser) {
        try {
          const userIdToken = await auth.currentUser?.getIdToken();
          const getTheNotes = await getNotes(
            userIdToken,
            subjectIdentification
          );

          setListOfNotes(getTheNotes);
        } catch (error) {
          console.error(error);
        }
      }
    };
    renderListOfNotes();
  }, [clicked, authUser?.uid, subjectIdentification, isEdited]);

  const addNotesHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (auth.currentUser) {
      try {
        const userIdToken = await auth.currentUser.getIdToken();
        if (isEdited === false) {
          const savingNotes = await saveNotes(userIdToken, {
            subjectIdentification,
            note,
          });

          setListOfNotes((previous) => [
            ...previous,
            { note_content: note, notes_id: savingNotes.notes_id },
          ]);
          setNote("");
        } else if (isEdited === true) {
          await editNote(userIdToken, subjectIdentification, { note, noteId });

          setListOfNotes((previous) => [...previous]);
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
    console.log("this is note identification", noteIdentification);
    console.log("this is the selected note content", noteContent);
    setIsEdited(true);
    console.log("this is is edited", isEdited);
    setNoteId(noteIdentification);
    setNote(noteContent);
  };

  const handleDeleteNote = async (noteIdentification: number) => {
    const newList = listOfNotes.filter(
      (note) => note.notes_id !== noteIdentification
    );

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
    <Paper>
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
                <Paper>
                  <Checkbox />
                  <Typography>{item.note_content}</Typography>
                </Paper>
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
    </Paper>
  );
};

export default Notes;
