import { Box, Container, Grid, Button, Paper, Typography } from "@mui/material";
import Notes from "./Notes";
import {useState, useEffect, useRef} from "react"

type PomodoroModeProps = {
  studyIncrements: number;
  // setStudyIncrements: React.Dispatch<React.SetStateAction<number>>;
  // breaks: number;
  // setBreaks: React.Dispatch<React.SetStateAction<number>>;
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
  totalDuration:number;
  // setTotalDuration: React.Dispatch<React.SetStateAction<number>>;
  selectedSubject: string;
  subjectIdentification: number | undefined;
};

const PomodoroMode = ({
  studyIncrements,
  // setStudyIncrements,
  // breaks,
  // setBreaks,
  setStart,
  totalDuration,
  // setTotalDuration,
  selectedSubject,
  subjectIdentification,
}: PomodoroModeProps) => {
//**************************************************************************** *********************** */
type TheStudyType = "study" | "studyBreak";

const [timerRunning, setTimerRunning] = useState(true);
const [typeOfStudy, setTypeOfStudy] = useState<TheStudyType>("study");
const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>();
const [secondsIntervalId,  setSecondsIntervalId]= useState<NodeJS.Timeout|undefined>();
const [totalDur, setTotalDur] = useState(totalDuration - 1)
const [totalDurSec, setTotalDurSec] = useState(59)
const [studyInc, setStudyInc] = useState(studyIncrements - 1)
const [breaks, setBreaks] = useState(5)
const pauseTime = useRef<number|null>(null)


useEffect(() => {

    if (timerRunning) {
      const secondsInterval = setInterval(()=>{
        setTotalDurSec((current)=> current === 0 ? 59:current-1)
       },1000)

      const studyInterval = setInterval(() => {
        console.log("this is timerRunning", timerRunning)

          if (
            totalDur > 0 &&
            studyInc > 0 &&
            typeOfStudy === "study"
          ) {
            setStudyInc(
              (currentStudyIncrements) => currentStudyIncrements - 1,
            );
            setTotalDur((currentDuration) => currentDuration - 1);
          } else if (
            totalDur > 0 &&
            studyInc === 0 &&
            typeOfStudy === "study"
          ) {
            clearInterval(studyInterval);
            setTypeOfStudy("studyBreak");
          } if (totalDur === 0) {
            clearInterval(studyInterval);
            setIntervalId(undefined);
            setTimerRunning(false);
            setStart(false);
            //document.exitFullscreen();
          } else if (
            totalDur > 0 &&
            breaks > 0 &&
            typeOfStudy === "studyBreak"
          ) {
            setBreaks((currentBreakInterval) => currentBreakInterval - 1);
          } else if (totalDur < studyInc) {
            setStudyInc(totalDur);
          }
          if (totalDur > 0 && breaks === 0 && typeOfStudy === "studyBreak") {
            clearInterval(studyInterval);
            setTypeOfStudy("study");
            setBreaks(5)
            setStudyInc(studyIncrements - 1)
          }

      }, 1000*60 );
      setIntervalId(studyInterval);
      setSecondsIntervalId(secondsInterval)
      return () => {
        clearInterval(secondsInterval)
        clearInterval(studyInterval);
      };
    }
  }, [timerRunning, totalDur, typeOfStudy, studyInc, breaks, studyIncrements, setStart]);

  const handleCountDownPause = () => {
    if (timerRunning) {
      console.log("this is pauseRef time", pauseTime.current)
      console.log("this is total duration seconds", totalDurSec)
      console.log("this is total duration", totalDur)
      setTimerRunning(false);
      clearInterval(intervalId);
      clearInterval(secondsIntervalId)
      pauseTime.current = new Date().getTime()
    }
  };
  const handleCountDown = () => {
    if (!timerRunning) {
      setTimerRunning(true);
      // const timeElapsed = pauseTime.current
      // if(pauseTime.current !== null){
      //   // const remainingSeconds = Math.max(totalDurSec - Math.floor(timeElapsed / 1000), 0);
      //   // const remainingMinutes = Math.max(totalDur - Math.floor(( totalDurSec) / 60000), 0);
      //   // setTotalDur(remainingMinutes);
      // }

    }
  };
  const exitFullScreen = () => {
    //document.exitFullscreen();

    clearInterval(intervalId);
    setTimerRunning(false);
    setStudyInc(0);
    setTotalDur(0);
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
                <Typography>{studyInc} minutes of study {totalDurSec}</Typography>
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
          <Notes subjectIdentification={subjectIdentification} />
        </Grid>
      </Box>
    </Container>
  );
};

export default PomodoroMode;
