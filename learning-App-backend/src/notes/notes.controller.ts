import admin from "../config/firebase-config";
import { NextFunction, Request, Response } from "express";
import { addNote, getListOfNotes, editTheOriginalNote, deleteSelectedNote } from "./notes.service";

interface AuthenticateRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}
async function getIdToken(
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      if (decodedToken) {
        next();
      } else {
        console.log("token not decoded");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}
async function addANote(req: AuthenticateRequest, res: Response) {
  console.log("this is eq.body.data", req.body.data);
  const { subjectIdentification, note } = req.body.data;

  console.log("inside the notes controller function called addANote");
  console.log("this is the subject id received: ", subjectIdentification);
  console.log("this is the noteContent receieved: ", note);
  const user_id = req.user?.uid;

  if (note.trim().length === 0) {
    res
      .status(400)
      .json({ error: "Must create a note in order to add a note" });
  } else {
    try {
      await addNote(user_id, subjectIdentification, note);
      res.status(201).json({ data: "Successful creation of note" });
    } catch (error) {
      res.status(400).json({ error: "Unable to add note" });
    }
  }
}
async function listOfNotes(req: AuthenticateRequest, res: Response) {
  const userId = req.user?.uid;
  const subjectId = Number(req.params.subjectId);

  console.log("this is the subjectId: ", subjectId);
  console.log("this is the type of subjectId: ", typeof subjectId);
  if (!userId) {
    res.status(404).json({ error: "User id not found." });
    return;
  }
  if (!subjectId) {
    res.status(404).json({ error: "Subject id not found." });
    return;
  }
  try {
    let theList = await getListOfNotes(userId, subjectId);
    res.status(201).json({ data: theList });
  } catch (error) {
    res.status(404).json({ error: "Unable to get the list of notes" });
  }
}

async function editANote(req:AuthenticateRequest, res:Response){
  const userId=req.user?.uid;
  const subjectId = Number(req.params.subjectId)
  const {note} = req.body.data as { note: string }
  const noteId= Number(req.body.data.noteId)
  console.log("this is the new note in the backend: ", note)
  console.log("this is the noteid in the backend: ", noteId)
  console.log("this is req.params from edit note backend: ", subjectId)

  if(!userId){
    res.status(404).json({ error: "User id not found." });
    return;
  } else{
    console.log("the user has been found")
    if(note === undefined || note === null){
      res.status(404).json({error: "In order to edit, you must have a new note"})
    }
    else if(subjectId){
      const updatedNote = await editTheOriginalNote(userId, subjectId, noteId, note)
      console.log("this is updtedNote: ", updatedNote)
      res.status(201).json({data: updatedNote})
    }

  }
}
async function deleteTheNote(req:AuthenticateRequest, res:Response){
  const userId = req.user?.uid
  const subject_id = Number(req.params.subjectId)
  const noteId = Number(req.params.notesId)
  console.log("this is req.params: ", req.params)
  console.log("this is the subjct id backend when trying to delete : ", subject_id)
  console.log("this is the note id backend when trying to delete : ", noteId)
  if(!userId){
    res.status(404).json({error:"User id not found"})
  }
  else{
    if(subject_id === undefined || subject_id === null){
      res.status(404).json({error: "Subject was not found and therefore note cannot be deleted"})
    }else if(noteId === undefined || noteId === null){
      res.status(404).json({error: "Note could not be found!"})
    }
    const deletion = await deleteSelectedNote(userId,subject_id, noteId)
    console.log("this is the deleted note: ", deletion)
    res.status(200).json({message: "Note has been deleted"})
  }

}
module.exports = {
  create: [getIdToken, addANote],
  list: [getIdToken, listOfNotes],
  edit:[getIdToken,editANote],
  remove:[getIdToken,deleteTheNote]
};
