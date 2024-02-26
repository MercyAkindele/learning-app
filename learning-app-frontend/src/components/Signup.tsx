import { Link, useNavigate } from "react-router-dom"
import { Container, Box, Typography, TextField, Button} from "@mui/material"
import { useAuth } from "../firebase/auth"
import { FormEvent, useState } from "react";



const Signup = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")



  const handleSignUp = async (e:FormEvent<HTMLFormElement>) =>{
  e.preventDefault();
  console.log("this is the email", email)
  console.log("this is the password", password)
  console.log("this is the confirmPassword", confirmPassword)
  if(password !== confirmPassword){
    throw new Error("Passwords do not match")
    return
  }
  try{
    await signUp(email, password);
    navigate("/login")
  }catch (error){
    // throw error set error state so that I can display it in the ui
  }
}

  return (
    <Container maxWidth="sm">
      <Box sx={{marginTop:8, display:"flex", flexDirection:"column", alignItems:"center"}}>
        <Typography>Sign Up</Typography>
        <Link to="/login">Have an account already? Log In</Link>
        <Box component="form" onSubmit={handleSignUp} sx={{display:"flex", flexDirection:"column"}}>
          <TextField
            type="email"
            id="email"
            name="email"
            placeholder="Email Address *"
            required
            onChange={(e)=> setEmail(e.target.value)}
            sx={{marginTop:4}}
          />
          <TextField
            type="password"
            id="password"
            name="password"
            placeholder="Password *"
            required
            onChange={(e)=> setPassword(e.target.value)}
            sx={{marginTop:2}}
          />
          <TextField
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Confirm Password *"
            required
            onChange={(e)=> setConfirmPassword(e.target.value)}
            sx={{marginTop:2}}
          />
          <Button type="submit" variant="contained" sx={{marginTop:2}}>Sign Up</Button>
        </Box>

      </Box>
    </Container>
  );
};

export default Signup;
