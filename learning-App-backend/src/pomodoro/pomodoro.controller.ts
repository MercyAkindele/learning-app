import admin from "../config/firebase-config";
import { NextFunction, Request, Response } from "express";
import * as pomodoroService from "./pomodoro.service";
import { error } from "console";

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
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

async function isItAPomodoro(
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.uid;

  const theSubject: string = req.body.data.selectedSubject;
  const theStudyIncrements: number = req.body.data.studyIncrements;
  const theTotalDuration: number = req.body.data.totalDuration;

  if (theSubject === "") {
    res.status(400).json({ error: "noSubject" });
  } else if (theStudyIncrements < 25) {
    res.status(400).json({ error: "studyIncrementError" });
  } else if (theStudyIncrements > theTotalDuration) {
    res.status(400).json({ error: "studyGreaterThanDuration" });
  } else if (
    theSubject === "" ||
    theStudyIncrements < 25 ||
    theStudyIncrements > theTotalDuration
  ) {
    res.status(400).json({ error: "noSubject" });
  } else if (
    !(
      theSubject === "" ||
      theStudyIncrements < 25 ||
      theTotalDuration < 25 ||
      theStudyIncrements > theTotalDuration
    )
  ) {
    const userSubject = {
      subject: theSubject.trim(),
      user_id: userId,
    };
    try {
      await pomodoroService.create(userSubject);
      res.status(201).json({ message: " successful pomodoro entrance" });
    } catch (error) {
      res.json({ error });
    }
  }
}

module.exports = {
  create: [getIdToken, isItAPomodoro],
};
