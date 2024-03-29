import express, { Express } from "express";
import cors from "cors";
const subjectRouter = require("./subjects/subjects.router");
const notesRouter = require("./notes/notes.router");
const pomodoroRouter = require("./pomodoro/pomodoro.router");
const app: Express = express();

app.use(cors());
app.use(express.json());
app.use("/api", subjectRouter);
app.use("/api", notesRouter);
app.use("/api", pomodoroRouter);

export default app;
