import Navigation from "./Navigation";
import { Alert } from "@mui/material";


const Dashboard = () => {
  const title = "Dashboard";

  return (
    <>
      <Navigation title={title} />
      <Alert severity="warning">This application is under construction!</Alert>
      <ul>
        <Alert severity="info">
          Please create a subject that you would like to study first by clicking
          the avatar icon in the top right hand corner of the screen, and by
          choosing the create subject tab. Once you create a subject, you cannot
          create a new subject with the same name.
        </Alert>

        <Alert severity="info">
          After creating a subject, then you can go to the pomodoro timer by
          clicking the clock icon next to the avatar icon.
        </Alert>

        <Alert severity="info">
          Then you should choose which subject you would like to study, the
          total amount of time you would like to study for, and the amount of
          time for each study session.
        </Alert>

        <Alert severity="info">
          Once you press start, the timer will be on, and you should study. If
          you would like to take notes for that particular subject, there is an
          area where you can take notes.
        </Alert>

        <Alert severity="info">
          Once your session has ended, or you specifically press end, then you
          will be redirected to the pomodoro timer where you can choose another
          subject and do the same things.
        </Alert>
      </ul>
    </>
  );
};

export default Dashboard;
