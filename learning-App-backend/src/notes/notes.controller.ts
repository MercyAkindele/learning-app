import admin from "../config/firebase-config";
import { NextFunction, Request, Response } from "express";
import {
  addNote,
  getListOfNotes,
  editTheOriginalNote,
  deleteSelectedNote,
} from "./notes.service";

interface AuthenticateRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}
async function getIdToken(
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction,
) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      if (decodedToken) {
        next();
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
  const { subjectIdentification, note } = req.body.data;

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

async function editANote(req: AuthenticateRequest, res: Response) {
  const userId = req.user?.uid;
  const subjectId = Number(req.params.subjectId);
  const { note } = req.body.data as { note: string };
  const noteId = Number(req.body.data.noteId);

  if (!userId) {
    res.status(404).json({ error: "User id not found." });
    return;
  } else {
    if (note === undefined || note === null) {
      res
        .status(404)
        .json({ error: "In order to edit, you must have a new note" });
    } else if (subjectId) {
      const updatedNote = await editTheOriginalNote(
        userId,
        subjectId,
        noteId,
        note,
      );
      res.status(201).json({ data: updatedNote });
    }
  }
}

async function deleteTheNote(req: AuthenticateRequest, res: Response) {
  const userId = req.user?.uid;
  const subject_id = Number(req.params.subjectId);
  const noteId = Number(req.params.notesId);

  if (!userId) {
    res.status(404).json({ error: "User id not found" });
  } else {
    if (subject_id === undefined || subject_id === null) {
      res.status(404).json({
        error: "Subject was not found and therefore note cannot be deleted",
      });
    } else if (noteId === undefined || noteId === null) {
      res.status(404).json({ error: "Note could not be found!" });
    }
    const deletion = await deleteSelectedNote(userId, subject_id, noteId);
    res.status(200).json({ message: "Note has been deleted" });
  }
}

module.exports = {
  create: [getIdToken, addANote],
  list: [getIdToken, listOfNotes],
  edit: [getIdToken, editANote],
  remove: [getIdToken, deleteTheNote],
};
