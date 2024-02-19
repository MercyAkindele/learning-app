import {
  Button,
  Card,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  TextField,
  Paper,
  Box,
  OutlinedInput,
  Alert,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

import { useState, useEffect } from "react";
import PomodoroMode from "./PomodoroMode";
import Navigation from "./Navigation";
import { getSubjects } from "../utils/api";
import { auth } from "../firebase/firebase";
import { useAuth } from "../firebase/auth";

type typeAlertType =
  | "durationError"
  | "studyIncrementError"
  | "studyGreaterThanDuration";

const PomodoroTimer = () => {
  type InitialInterval = {
    studyInt: number;
    breakInt: number;
  };
  type SubjectType = {
    subject_name: string;
    subject_id: number;
  };

  let audio = new Audio("src/assets/music/Background music DOWNLOAD (135).wav");

  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>();
  const [start, setStart] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedMusic, setSelectedMusic] = useState<string>("");
  // measured in seconds
  const [totalDuration, setTotalDuration] = useState<number>(0);
  // measured in seconds
  const [studyIncrements, setStudyIncrements] = useState<number>(0);
  const [breaks, setBreaks] = useState<number>(5);

  const [typeOfStudy, setTypeOfStudy] = useState<TheStudyType | string>("");
  const [initialIntervals, setInitialIntervals] =
    useState<InitialInterval | null>(null);
  const [alertType, setAlertType] = useState<typeAlertType | null>();
  const [subjectNames, setSubjectNames] = useState<SubjectType[] | []>([]);
  const [subjectIdentification, setSubjectIdentification] = useState<
    number | undefined
  >();
  const title = "Pomodoro";

  let { authUser } = useAuth();
  const userId = authUser?.uid;

  type TheStudyType = "study" | "studyBreak";

  useEffect(() => {
    const getListOfSubjects = async () => {
      if (auth.currentUser) {
        try {
          let userIdToken = await auth.currentUser?.getIdToken();
          // console.log("this is the userIDtOKEN", userIdToken)
          let subjectNamesFromDataBase = await getSubjects(userIdToken);
          setSubjectNames(subjectNamesFromDataBase);
          console.log(
            "this is the subjectNames from the database",
            subjectNames
          );
        } catch (error) {
          console.error(error);
        }
      }
    };

    getListOfSubjects();
  }, [userId]);

  useEffect(() => {
    if (timerRunning) {
      const studyInterval = setInterval(() => {
        if (
          totalDuration > 0 &&
          studyIncrements > 0 &&
          typeOfStudy === "study"
        ) {
          setStudyIncrements(
            (currentStudyIncrements) => currentStudyIncrements - 1
          );
          setTotalDuration((currentDuration) => currentDuration - 1);
        } else if (
          totalDuration > 0 &&
          studyIncrements === 0 &&
          typeOfStudy === "study"
        ) {
          clearInterval(studyInterval);
          setTypeOfStudy("studyBreak");
          if (initialIntervals?.studyInt) {
            setStudyIncrements(initialIntervals.studyInt);
          }
        } else if (totalDuration === 0) {
          clearInterval(studyInterval);
          setIntervalId(undefined);
          setTimerRunning(false);
          setStart(false);
          document.exitFullscreen();
        } else if (
          totalDuration > 0 &&
          breaks > 0 &&
          typeOfStudy === "studyBreak"
        ) {
          setBreaks((currentBreakInterval) => currentBreakInterval - 1);
        } else if (totalDuration < studyIncrements) {
          setStudyIncrements(totalDuration);
        }
        if (typeOfStudy === "studyBreak") {
          console.log("study break on");
          // audio.play();
        }
        if (typeOfStudy === "study") {
          console.log("study break over");
          // audio.pause();
        } else if (
          totalDuration > 0 &&
          breaks === 0 &&
          typeOfStudy === "studyBreak"
        ) {
          clearInterval(studyInterval);
          setTypeOfStudy("study");
          if (initialIntervals?.breakInt) {
            setBreaks(initialIntervals.breakInt);
          }
        }
      }, 1000);
      setIntervalId(studyInterval);
      return () => {
        clearInterval(studyInterval);
      };
    }
  }, [timerRunning, totalDuration, typeOfStudy, studyIncrements, breaks]);

  const handleCountDown = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Math.floor(studyIncrements / 25) !== 1) {
      console.log("In the study break determination box");
      setBreaks(Math.floor(studyIncrements / 25) + 5);
    }
    const initialStudyIncrements = studyIncrements;
    const initialBreakIncrements = breaks;
    setInitialIntervals({
      studyInt: initialStudyIncrements,
      breakInt: initialBreakIncrements,
    });
    if (studyIncrements < 25) {
      setStart(false);
      setTimerRunning(false);
      setAlertType("studyIncrementError");
    }
    if (studyIncrements > totalDuration) {
      setStart(false);
      setTimerRunning(false);
      setAlertType("studyGreaterThanDuration");
    } else if (
      !(
        studyIncrements < 25 ||
        totalDuration < 25 ||
        studyIncrements > totalDuration
      )
    ) {
      setAlertType(null);
      setStart(true);
      setTypeOfStudy("study");
      const element = document.documentElement;
      element.requestFullscreen();
      if (!timerRunning) {
        setTimerRunning(true);
      }
    }
  };
  const setSubNameAndId = (e: SelectChangeEvent<string>) => {
    setSelectedSubject(e.target.value);
    let subNameToFindId = subjectNames.find((subject) => {
      return subject.subject_name === e.target.value;
    });
    console.log("this is the subject id", subNameToFindId?.subject_id);
    setSubjectIdentification(subNameToFindId?.subject_id);
  };

  return (
    <>
      <Navigation title={title} />
      <Container sx={{ display: "flex", justifyContent: "center" }}>
        {!start && (
          <Card
            sx={{
              margin: 2,
              padding: 2,
              width: "50%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box component="form" onSubmit={handleCountDown}>
              <FormControl sx={{ width: "60%", margin: "2%" }}>
                <InputLabel id="choose-a-subject">Subject</InputLabel>
                <Select
                  labelId="choose"
                  id="choose-subject"
                  value={selectedSubject}
                  onChange={setSubNameAndId}
                  input={<OutlinedInput label="Name" />}
                >
                  {subjectNames.map((subject: any) => (
                    <MenuItem
                      key={subject.subject_name}
                      value={subject.subject_name}
                    >
                      {subject.subject_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* <TextField
                id="create-new-subject"
                label="Create new study subject"
                variant="outlined"
                sx={{ width: "60%", margin: "2%" }}
              />
              <FormControl sx={{ width: "60%", margin: "2%" }}>
                <InputLabel id="choose-music">Break music</InputLabel>
                <Select
                  labelId="choose-music"
                  id="choose-the-music"
                  value={selectedMusic}
                  onChange={(e) => setSelectedMusic(e.target.value)}
                  input={<OutlinedInput label="Name" />}
                >
                  {subjectNames.map((subject) => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
              <Typography sx={{ margin: "2%" }}>Total duration</Typography>
              <Paper
                elevation={2}
                sx={{
                  width: "40%",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "2%",
                }}
              >
                {" "}
                <Button
                  onClick={() => {
                    if (totalDuration >= 0) {
                      setTotalDuration((increments) => increments + 25);
                      if (totalDuration >= 0) {
                        setAlertType(null);
                      }
                    }
                  }}
                >
                  +
                </Button>
                {totalDuration}{" "}
                <Button
                  onClick={() => {
                    if (totalDuration > 0) {
                      setTotalDuration((increments) => increments - 25);
                      if (totalDuration < 30) {
                        setAlertType("durationError");
                      }
                    } else {
                      setAlertType("durationError");
                    }
                  }}
                >
                  -
                </Button>
              </Paper>
              {alertType === "durationError" && (
                <Alert severity="info">
                  The total duration should be at least 25 minutes. —{" "}
                  <strong>
                    Please increase the total duration to 25 minutes or higher!
                  </strong>
                </Alert>
              )}

              <Typography sx={{ margin: "2%" }}>Study increments</Typography>
              <Paper
                elevation={2}
                sx={{
                  width: "40%",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "2%",
                }}
              >
                {" "}
                <Button
                  onClick={() => {
                    if (studyIncrements >= 0) {
                      setStudyIncrements((increments) => increments + 5);
                      if (studyIncrements >= 20) {
                        setAlertType(null);
                      }
                    }
                  }}
                >
                  +
                </Button>
                {studyIncrements}{" "}
                <Button
                  onClick={() => {
                    if (studyIncrements > 0) {
                      setStudyIncrements((increments) => increments - 5);
                      if (studyIncrements < 30) {
                        setAlertType("studyIncrementError");
                      }
                    } else {
                      setAlertType("studyIncrementError");
                    }
                  }}
                >
                  -
                </Button>
              </Paper>
              {alertType === "studyIncrementError" && (
                <Alert severity="info">
                  The study increment should be at least 25 minutes. —{" "}
                  <strong>
                    Please increase the study increment to at least 25 minutes!
                  </strong>
                </Alert>
              )}
              {alertType === "studyGreaterThanDuration" && (
                <Alert severity="error">
                  The study increment should be less than the total duration. —{" "}
                  <strong>
                    Please either decrease the study increment or increase the
                    duration!
                  </strong>
                </Alert>
              )}

              <Typography sx={{ margin: "2%" }}>
                Session {totalDuration} min {breaks} break
              </Typography>
              <Button type="submit" variant="contained" sx={{ margin: "2%" }}>
                start
              </Button>
            </Box>
          </Card>
        )}
      </Container>
      {start && (
        <PomodoroMode
          timerRunning={timerRunning}
          setTimerRunning={setTimerRunning}
          intervalId={intervalId}
          studyIncrements={studyIncrements}
          setStudyIncrements={setStudyIncrements}
          breaks={breaks}
          typeOfStudy={typeOfStudy}
          setStart={setStart}
          setTotalDuration={setTotalDuration}
          selectedSubject={selectedSubject}
          subjectIdentification={subjectIdentification}
        />
      )}
    </>
  );
};

export default PomodoroTimer;
