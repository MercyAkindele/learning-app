import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { Link } from "react-router-dom";
import { FormEvent, useState } from "react";
import { useAuth} from "../firebase/auth"



const Login = () => {
  const {logIn} = useAuth();
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [emailIsValid, setEmailIsValid] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("in handle email change");
    let emailInput = e.target.value;
    setEmailAddress(emailInput);
    // console.log(
    //   "this is isValidEmail inside of the handler: ",
    //   isValidEmail(emailInput)
    // );
  };
  const isValidEmail = (anEmailAddress: string): boolean => {
    // console.log("in isValidEmail");
    const emailFormat: RegExp =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailFormat.test(anEmailAddress);
  };
  const handleBlur = () => {
    console.log("the input email: ", emailAddress)
    console.log("Email verification: ", isValidEmail(emailAddress))
    setEmailIsValid(isValidEmail(emailAddress));
  };
  const handleSubmit = async (e:FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    try{
      await logIn(emailAddress, password)
      console.log("you have signed in")
    }catch (error){
      console.error("there was a problem signing in", error)
      throw error
    }

  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ backgroundColor: "purple" }}>
          <LockIcon />
        </Avatar>
        <Typography>Log In</Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {!emailIsValid ? (
            <TextField
              error
              id="outlined-error-helper-text"
              value={emailAddress}
              helperText="Invalid email address."
              onChange ={handleEmailChange}
              onBlur ={handleBlur}
            />
          ) : (
            <TextField
              sx={{ marginTop: 2, marginBottom: 2 }}
              autoFocus
              type="email"
              value={emailAddress}
              label="Email Address"
              required
              onChange={handleEmailChange}
              onBlur={handleBlur}
            />
          )}
          
          <TextField
            sx={{ marginTop: 2, marginBottom: 2 }}
            type="password"
            label="Password"
            required
            onChange={(e) => setPassword(e.target.value) }
          />
          <FormControlLabel
            control={<Checkbox value="remember" />}
            label="Remember me"
          />
          <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
            Log In
          </Button>
          <Grid container sx={{ marginTop: 4 }}>
            <Grid item xs={6}>
              <Link to="/login">Forgot password?</Link>
            </Grid>
            <Grid item xs={6}>
              <Link to="/signup">Don't have an account? Sign Up</Link>
            </Grid>
          </Grid>
          <Typography>Copyright</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
