import { Box, Button, Container, TextField, Alert } from '@mui/material'
import React, { useState } from 'react'
import {auth} from "../firebase/firebase"
import { sendSubjectForValidation} from '../utils/api'
import { useNavigate } from 'react-router-dom'
import Navigation from './Navigation'


const CreateSubject = () => {
    const navigate = useNavigate();
    const [subject, setSubject] = useState<string>("")
    const [alertType, setAlertType] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{
            if(subject.length === 0){
                throw new Error("A subject is needed")
            }
        }
        catch(error:unknown){
            if(error instanceof Error)
            if(error.message){
                setAlertType(error.message)
            }
        }
        setSubject("")
        if(auth.currentUser && subject.length > 0){
            try{
                const userIdToken = await auth.currentUser.getIdToken()
                await sendSubjectForValidation(userIdToken, subject)
                navigate("/pomodoro")
            }catch(error:unknown){
                if(error instanceof Error)
                // console.log("this is the error message: ", error)
                if(error.message){
                    setAlertType(error.message)
                }
                console.error(error)
                throw error;
            }
        }


    }
  return(
    <>
        <Navigation title={"Create Subject"}/>
        <Container maxWidth="sm">
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",

            }}
            data-testid="your-form"
            >

              {alertType.length > 0 && <Alert severity="error" sx={{mt:"2%"}}>
                {alertType} — <strong>Please enter a subject!</strong>
              </Alert>}

                <TextField
                    id="subject"
                    type="text"
                    label="Create a Subject"
                    value={subject}
                    onChange={(e) => {
                        setSubject(e.target.value)
                    }}
                    sx={{mt:"4%"}}
                />
                <Button type="submit" variant="contained" sx={{mt:2}} disabled={subject.trim().length === 0}> Create Subject</Button>

            </Box>
    </Container>
    </>
  )
}

export default CreateSubject