import admin from "../config/firebase-config"
import { NextFunction, Request, Response} from 'express';
import {addNote} from "./notes.service"

interface AuthenticateRequest extends Request{
    user?:admin.auth.DecodedIdToken;
  }
  async function getIdToken(req:AuthenticateRequest, res: Response, next:NextFunction) {

    const idToken = req.headers.authorization?.split("Bearer ")[1];

    if(idToken){

        try{
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req.user = decodedToken;
            if(decodedToken){
                next();
            }else{
                console.log("token not decoded")
            }
        }catch(error){
            console.error(error);
            res.status(500).json({error: "Internal Server Error"})
        }
    }else{
        res.status(401).json({error: "Unauthorized"})
    }
}
async function addANote(req:AuthenticateRequest, res:Response){
    console.log("this is eq.body.data", req.body.data)
    const {subjectId , note} = req.body.data

   console.log("inside the notes controller function called addANote")
   console.log("this is the subject id received: ", subjectId)
   console.log("this is the noteContent receieved: ", note)
    const user_id = req.user?.uid
    let theNote = note.trim()
    if(note.trim().length === 0){
        res.status(401).json({error:"Must create a note in order to add a note"})
    }else{
        try{
            await addNote(user_id, subjectId,note)
            res.status(201).json({data: "Successful creation of note"})
        }catch(error){
            res.status(401).json({error: "Unable to add note"})
        }
    }

}
module.exports = {
    create:[getIdToken, addANote],
}
