import admin from "../config/firebase-config";
import { NextFunction, Request, Response } from "express";
import { addNote, getListOfNotes } from "./notes.service";

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
module.exports = {
  create: [getIdToken, addANote],
  list: [getIdToken, listOfNotes],
};
