
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
import {saveNotes} from "../utils/api"

type NotesProps = {
    subjectId:number|null
}
const Notes = ({subjectId}:NotesProps) => {
    const {authUser} = useAuth();
  const [note, setNote] = useState("");
  const [listOfNotes, setListOfNotes] = useState([])
  const [isEdited, setIsEdited] = useState(false);
  //map through list of notes and then setListOFNotes to [...] and to the new note.
  const addNotesHandler = async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(auth.currentUser){
        try{
            const userIdToken = await auth.currentUser.getIdToken()
            let savingNotes = await saveNotes(userIdToken, {subjectId, note})
            console.log("this is what comes back when trying to save the notes: ", savingNotes)
        }catch(error){
            console.error(error)
        }
    }

  }
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
        <Button variant="contained" type="submit">{isEdited ? "Edit Note" : "Add Note"}</Button>
      </Box>

    </Container>
  );
};

export default Notes;

