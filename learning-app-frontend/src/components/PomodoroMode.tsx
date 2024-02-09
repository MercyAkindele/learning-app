import { Box, Container, Grid, Button, Paper, Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

type PomodoroModeProps = {
 
  timerRunning: boolean;
  setTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
  intervalId: NodeJS.Timeout | undefined;
  studyIncrements:number;
  setStudyIncrements: React.Dispatch<React.SetStateAction<number>>;
  breaks:number;
  typeOfStudy:string,
  setStart:React.Dispatch<React.SetStateAction<boolean>>,
  setTotalDuration:React.Dispatch<React.SetStateAction<number>>
 
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
  setTotalDuration

}: PomodoroModeProps) => {
  let originalStudyIncrement = studyIncrements;
  const navigate = useNavigate();
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
    setStart(false)
  
  };
  return (
    <Container maxWidth="sm">
      <Box>
        <Grid container>
          <Grid >
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
              {typeOfStudy === "study"?<Typography>{studyIncrements} minutes of study</Typography>:<Typography>{breaks} minutes of break</Typography>}
              <Button onClick={handleCountDownPause}>Pause</Button>
              <Button onClick={handleCountDown}>Resume</Button>
              <Button onClick={exitFullScreen}>End</Button>
            </Paper>
            {/* {onBreak && <Card>On break</Card>} */}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default PomodoroMode;
