import {
  Button,
  Card,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Paper,
  Box,
  OutlinedInput,
  Alert,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

import { useState, useEffect } from "react";

import PomodoroMode from "./PomodoroMode";
import Navigation from "./Navigation";
import { getSubjects, checkIfWeCanPomodoro } from "../utils/api";
import { auth } from "../firebase/firebase";
import { useAuth } from "../firebase/auth";


type typeAlertType =
  | "durationError"
  | "studyIncrementError"
  | "studyGreaterThanDuration"
  | "noSubject";

const PomodoroTimer = () => {
  type SubjectType = {
    subject_name: string;
    subject_id: number;
  };
  type AlertErrors = {
    message: string;
  };


  const [start, setStart] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  // measured in minutes
  const [totalDuration, setTotalDuration] = useState<number>(0);
  // measured in minutes
  const [studyIncrements, setStudyIncrements] = useState<number>(0);
  const [alertType, setAlertType] = useState<
    typeAlertType | null | string | AlertErrors
  >();
  const [subjectNames, setSubjectNames] = useState<SubjectType[] | []>([]);
  const [subjectIdentification, setSubjectIdentification] = useState<
    number | undefined
  >();
  const title = "Pomodoro";

  const { authUser } = useAuth();
  const userId = authUser?.uid;



  useEffect(() => {
    const getListOfSubjects = async () => {
      if (auth.currentUser) {
        try {
          const userIdToken = await auth.currentUser?.getIdToken();
          const subjectNamesFromDataBase = await getSubjects(userIdToken);
          setSubjectNames(subjectNamesFromDataBase);
        } catch (error) {
          console.error(error);
        }
      }
    };

    getListOfSubjects();
  }, [userId]);

  const handleCountDown = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (auth.currentUser) {
        const userIdToken = await auth.currentUser.getIdToken();
        const checks = await checkIfWeCanPomodoro(userIdToken, {
          selectedSubject,
          studyIncrements,
          totalDuration,
        });
        if(checks){
          console.log("checked out")
        }
        setAlertType(null);
        setStart(true);


      }
    } catch (error: unknown) {

      if (error instanceof Error) {
        console.error("Error instance:", error);
        setAlertType(error.message);
      } else if (isAlertError(error)) {
        setAlertType(error.message);
      } else {
        setAlertType(null);
      }
    }

    function isAlertError(obj: unknown): obj is AlertErrors {
      if (typeof obj !== "object" || obj === null) {
        return false;
      }
      const { message } = obj as AlertErrors;
      return typeof message === "string";
    }
  };

  const setSubNameAndId = (e: SelectChangeEvent<string>) => {
    setSelectedSubject(e.target.value);
    const subNameToFindId = subjectNames.find((subject) => {
      return subject.subject_name === e.target.value;
    });

    setSubjectIdentification(subNameToFindId?.subject_id);
  };

  return (
    <>
      <Navigation title={title} />
        <Alert severity="info">
          Once you press start, the timer will be on, and you should study. If
          you would like to take notes for that particular subject, there is an
          area where you can take notes.
        </Alert>
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
                  // required
                  input={<OutlinedInput label="Name" />}
                >
                  {subjectNames.map((subject: SubjectType) => (
                    <MenuItem
                      key={subject.subject_name}
                      value={subject.subject_name}
                    >
                      {subject.subject_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {alertType === "noSubject" && (
                <Alert severity="info">
                  A subject is needed to run Pomodoro Mode. —{" "}
                  <strong>
                    Please choose a subject, or create a subject in the create
                    subject page!
                  </strong>
                </Alert>
              )}

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
                Session {totalDuration} minutes
              </Typography>
              <Button type="submit" variant="contained" sx={{ margin: "2%" }}>
                start
              </Button>
            </Box>
          </Card>
        )}
      </Container>
      {start && selectedSubject !== "" && (
        <PomodoroMode

          studyIncrements={studyIncrements}
          // setStudyIncrements={setStudyIncrements}
          // breaks={breaks}
          setStart={setStart}
          // setBreaks={setBreaks}
          totalDuration = {totalDuration}
          // setTotalDuration={setTotalDuration}
          selectedSubject={selectedSubject}
          subjectIdentification={subjectIdentification}
        />
      )}
    </>
  );
};

export default PomodoroTimer;
