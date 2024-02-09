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
import { useState, useEffect } from "react";
import PomodoroMode from "./PomodoroMode";
import Navigation from "./Navigation";
import { getSubjects } from "../utils/api";
import {auth} from "../firebase/firebase"

type typeAlertType = "durationError" | "studyIncrementError"|"studyGreaterThanDuration";

// async function getTheSubjects(){
//   if(auth.currentUser){
//     try{
//       const userIdToken = await auth.currentUser.getIdToken()
//       let whatWeGet = await getSubjects(userIdToken)
//       console.log("this is what we get back from getSubjects, ",whatWeGet )
//   }catch(error:any){
//       console.log("this is the error message: ", error)
//       if(error.message){
//           setAlertType(error.message)
//       }
//       console.error(error)
//       throw error;
//   }
//   }
// }
// getTheSubjects

const PomodoroTimer = () => {
  type InitialInterval = {
    studyInt: number;
    breakInt: number;
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
  // const [onBreak, setOnBreak] = useState<boolean | undefined>(false);
  const [typeOfStudy, setTypeOfStudy] = useState<TheStudyType|string>("");
  const [initialIntervals, setInitialIntervals] = useState<InitialInterval | null>(null);
  const [alertType, setAlertType] = useState<typeAlertType|null>()
  const [subjectNames, setSubjectNames] = useState<string[]|[]>([])
  const title = "Pomodoro";

  type TheStudyType = "study"|"studyBreak"

  useEffect(()=>{
    console.log("inside an empty useEffwect")
    const user = auth.currentUser;
    const getListOfSubjects = async ()=>{
      if(user){
        try{
          let userIdToken = await user?.getIdToken();
          console.log("this is the userIDtOKEN", userIdToken)
          let subjectNamesFromDataBase = await getSubjects(userIdToken)
          setSubjectNames(subjectNamesFromDataBase)
        }catch(error){
          console.error(error)
        }
      }
    }
    getListOfSubjects();
  },[])

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
        }else if(totalDuration < studyIncrements){
          setStudyIncrements(totalDuration)
        }if(typeOfStudy === "studyBreak"){
          console.log("study break on")
          // audio.play();
        }if(typeOfStudy === "study"){
          console.log("study break over")
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

  const handleCountDown = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Math.floor(studyIncrements / 25) !== 1) {
      console.log("In the study break determination box")
      setBreaks(Math.floor(studyIncrements / 25) + 5);
    }
    const initialStudyIncrements = studyIncrements;
    const initialBreakIncrements = breaks;
    setInitialIntervals({
      studyInt: initialStudyIncrements,
      breakInt: initialBreakIncrements,
    });
    if(studyIncrements < 25){
      setStart(false)
      setTimerRunning(false)
      setAlertType("studyIncrementError")
    }if(studyIncrements > totalDuration){
      setStart(false)
      setTimerRunning(false)
      setAlertType("studyGreaterThanDuration")
    }else if(!(studyIncrements < 25 || totalDuration < 25 || studyIncrements > totalDuration)){
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
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  input={<OutlinedInput label="Name" />}
                >
                  {subjectNames.map((subject:any) => (
                    <MenuItem key={subject.subject_name} value={subject.subject_name}>
                      {subject.subject_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
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
              </FormControl>
              <Typography sx={{margin:"2%"}}>Total duration</Typography>
              <Paper
                elevation={2}
                sx={{
                  width: "40%",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin:"2%"
                }}
              >
                {" "}
                <Button
                  onClick={() => {
                    if(totalDuration >= 0){
                      setTotalDuration(increments=>increments + 25)
                      if(totalDuration >= 0){
                        setAlertType(null)
                      }
                    }
                  }}
                >
                  +
                </Button>
                {totalDuration}{" "}
                <Button
                  onClick={() =>{
                    if(totalDuration > 0){
                      setTotalDuration(increments => increments - 25)
                      if(totalDuration < 30){
                        setAlertType("durationError")
                      }
                    }else{
                      setAlertType("durationError")
                    }
                  }
                  }
                >
                  -
                </Button>
              </Paper>
              {alertType === "durationError" && <Alert severity="info">
                The total duration should be at least 25 minutes. — <strong>Please increase the total duration to 25 minutes or higher!</strong>
              </Alert>}

              <Typography sx={{margin:"2%"}}>Study increments</Typography>
              <Paper
                elevation={2}
                sx={{
                  width: "40%",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin:"2%",
                }}
              >
                {" "}
                <Button
                  onClick={() => {
                    if(studyIncrements >= 0){
                      setStudyIncrements(increments=>increments + 5)
                      if(studyIncrements >= 20){
                        setAlertType(null)
                      }
                    }
                  }}
                >
                  +
                </Button>
                {studyIncrements}{" "}
                <Button
                  onClick={() =>{
                    if(studyIncrements > 0){
                      setStudyIncrements(increments => increments - 5)
                      if(studyIncrements < 30){
                        setAlertType("studyIncrementError")
                      }
                    }else{
                      setAlertType("studyIncrementError")
                    }
                  }
                  }
                >
                  -
                </Button>
              </Paper>
              {alertType === "studyIncrementError" && <Alert severity="info">
                The study increment should be at least 25 minutes. — <strong>Please increase the study increment to at least 25 minutes!</strong>
              </Alert>}
              {alertType ==="studyGreaterThanDuration" && <Alert severity="error">
                The study increment should be less than the total duration. — <strong>Please either decrease the study increment or increase the duration!</strong>
              </Alert>}

              <Typography sx={{margin:"2%"}}>
                Session {totalDuration} min {breaks} break
              </Typography>
              <Button type="submit" variant="contained" sx={{margin:"2%"}}>start</Button>
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
        />
      )}
    </>
  );
};

export default PomodoroTimer;
