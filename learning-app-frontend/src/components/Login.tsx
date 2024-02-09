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
import {  useState } from "react";
import { useAuth} from "../firebase/auth"




const Login = () => {
  const { logIn } = useAuth();
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let emailInput = e.target.value;
    setEmailAddress(emailInput);
  
  };
 
  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) =>{
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
          
            <TextField
              error
              id="email"
              type="email"
              label="Email"
              autoComplete="email"
              required
              value={emailAddress}
              onChange ={handleEmailChange}
            />
          
          <TextField
            sx={{ marginTop: 2, marginBottom: 2 }}
            type="password"
            label="Password"
            required
            onChange={(e) => setPassword(e.target.value) }
          />
          <FormControlLabel
            control={<Checkbox value="remember" id="remember-checkbox"/>}
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
