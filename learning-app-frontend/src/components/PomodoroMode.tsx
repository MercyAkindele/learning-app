import { Box, Container, Grid, Button, Paper, Typography } from "@mui/material";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../firebase/firebase";
// import { useAuth } from "../firebase/auth";
// import { getASubjectId } from "../utils/api";
import Notes from "./Notes";

type PomodoroModeProps = {
  timerRunning: boolean;
  setTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
  intervalId: NodeJS.Timeout | undefined;
  studyIncrements: number;
  setStudyIncrements: React.Dispatch<React.SetStateAction<number>>;
  breaks: number;
  typeOfStudy: string;
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
  setTotalDuration: React.Dispatch<React.SetStateAction<number>>;
  selectedSubject: string;
  subjectIdentification: number | undefined;
};

const PomodoroMode = ({
  timerRunning,
  setTimerRunning,
  intervalId,
  studyIncrements,
  setStudyIncrements,
  breaks,
  typeOfStudy,
  setStart,
  setTotalDuration,
  selectedSubject,
  subjectIdentification,
}: PomodoroModeProps) => {
  // const originalStudyIncrement = studyIncrements;
  // const [subjectId, setSubjectId] = useState<number | null>(null);
  // const navigate = useNavigate();
  // const { authUser } = useAuth();
  // const user = auth.currentUser;
  // const userId = authUser?.uid;
  // useEffect(()=>{
  //   const getSubjectIdByName = async ()=>{
  //       if(user){
  //         try{
  //           const userIdToken = await user?.getIdToken()
  //           let actualSubjectId = await getASubjectId(userIdToken, selectedSubject)
  //           setSubjectId(actualSubjectId)

  //         }catch(error){
  //           console.error
  //         }
  //       }
  //       console.log("there is no documented user inside of pomodoro mode")
  //     }
  //     getSubjectIdByName();
  //   }

  // ,[selectedSubject, userId])

  const handleCountDownPause = () => {
    if (timerRunning) {
      setTimerRunning(false);
      clearInterval(intervalId);
      console.log("time stopped");
    }
  };
  const handleCountDown = () => {
    if (!timerRunning) {
      setTimerRunning(true);
    }
  };
  const exitFullScreen = () => {
    document.exitFullscreen();

    clearInterval(intervalId);
    setTimerRunning(false);
    setStudyIncrements(0);
    setTotalDuration(0);
    setStart(false);
  };
  return (
    <Container maxWidth="sm">
      <Box>
        <Typography>
          {selectedSubject ? `${selectedSubject} Notes` : "Notes"}
        </Typography>
        <Grid container spacing={2} sx={{ marginTop: "4%" }}>
          <Grid sx={{ margin: "4%" }}>
            <Paper
              elevation={2}
              sx={{
                display: "flex",
                height: 160,
                lineHeight: "80px",
                justifyContent: "center",
                marginTop: "4%",
                alignItems: "center",
                marginRight: "4%",
              }}
            >
              {typeOfStudy === "study" ? (
                <Typography>{studyIncrements} minutes of study</Typography>
              ) : (
                <Typography>{breaks} minutes of break</Typography>
              )}
              <Button onClick={handleCountDownPause}>Pause</Button>
              <Button onClick={handleCountDown}>Resume</Button>
              <Button onClick={exitFullScreen}>End</Button>
            </Paper>
            {/* {onBreak && <Card>On break</Card>} */}
          </Grid>
        </Grid>
        <Grid>
          <Paper
            elevation={2}
            sx={{
              height: 160,
              lineHeight: "80px",
              marginTop: "4%",
            }}
          >
            <Notes subjectIdentification={subjectIdentification} />
          </Paper>
        </Grid>
      </Box>
    </Container>
  );
};

export default PomodoroMode;
