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
import { saveNotes, getNotes } from "../utils/api";

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
          let getTheNotes = await getNotes(userIdToken, subjectIdentification);
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

        let savingNotes = await saveNotes(userIdToken, {
          subjectIdentification,
          note,
        });
        setListOfNotes(previous => [...previous, {note_content:note, notes_id:savingNotes.notes_id}])
        setNote("")
        setCliked(!clicked);
        console.log(
          "this is what comes back when trying to save the notes: ",
          savingNotes
        );
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
        <List>
          {listOfNotes &&
            listOfNotes.map((item) => {
              return (
                <>
                  <ListItem key={item.notes_id}>
                    <Checkbox />
                    <Typography >
                      {item.note_content}
                    </Typography>
                    <Button>Edit</Button>
                    <Button>Delete</Button>
                  </ListItem>
                </>
              );
            })}
        </List>
      </Box>
    </Container>
  );
};

export default Notes;
