
import { Routes, Route } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Navigation from "../components/Navigation";
import Dashboard from "../components/Dashboard";
import { useAuth } from "../firebase/auth";
import UserProfile from "../components/UserProfile";
// import PomodoroMode from "../components/PomodoroMode";
import PomodoroTimer from "../components/PomodoroTimer";
import CreateSubject from "../components/CreateSubject";
// import Notes from "../components/Notes";

const AppRoutes = () => {
  const {authUser} = useAuth();
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigation/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path={`/${authUser?.displayName}`} element={<UserProfile/>}/>
        <Route path="/pomodoro" element={<PomodoroTimer/>}/>
        <Route path="/createSubject" element={<CreateSubject/>}/>
        {/* <Route path="/notes" element={<Notes />}/> */}

        {/* <Route path="/signin" element={<SignIn/>}/> */}
      </Routes>
    </>
  );
};

export default AppRoutes;

