import admin from "../config/firebase-config"
import { NextFunction, Request, Response} from 'express';
import * as subjectsService from "./subjects.service"



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
    async function addSubject(req:AuthenticateRequest, res:Response){
        const userId = req.user?.uid
        if(!userId){
            res.status(401).json({error:"Unathorized user"})
            return;
        }
        const theSubject:string = req.body.data
        console.log("this is the subject that we are logging", theSubject)
        const userSubject = {
            sub: theSubject.trim(),
            user_id: userId
        }
       if(theSubject.length > 0 && userId){
        try{
            let theSubjectExists = await subjectsService.check(userId, userSubject)
            //subject was not found for user
            if(theSubjectExists.length === 0){
                await subjectsService.create(userSubject)
                res.status(201).json({data: "Successful creation of subject"})
            }else{
                res.status(409).json({error: "The subject already exists"})
            }

        }catch(error){
            console.error(error)
        }
       }else if(theSubject.length === 0 && userId){
        res.status(400).json({error: "A subject is needed"})
       }
    }
    // async function aSubjectHasBeenChosen(req:AuthenticateRequest, res:Response, next:NextFunction){
    //     const userId = req.user?.uid
    //     const {data} = req.body
    //     if(userId){
    //         if(data === undefined || data === null){
    //             res.status(400).json({error:"Must have a subject to proceed"})
    //         }else{
    //             next();
    //         }
    //     }
    // }
    async function getSub(req:AuthenticateRequest, res:Response){
        console.log("we are inside of the getSub function backend")
        const userId = req.user?.uid
        if(!userId){
            res.status(401).json({error:"Unathorized user"})
            return;
        }
        else{
            try{
                console.log("we are inside the getSub try block in the backend")
                let subjects = await subjectsService.getTheSubjects(userId)
                console.log("this is what is given back when requesting for subjects in the backend", subjects)
                res.json({ data: await subjects});
            }catch(error){
                console.error(error)
            }
        }
    }
    async function getSubjectId(req:AuthenticateRequest, res:Response){
        const userId = req.user?.uid
        const theSubjectName = req.params.subject_name

        if(!userId){
            res.status(401).json({error:"Unathorized user"})
            return
        }
        else{
            try{
                console.log("in the try section of getSubjectID")
                console.log("this is the subject name from the backend", theSubjectName)
                const subjectId = await subjectsService.retrieveSubId(userId, theSubjectName)
                console.log("this is the subjectId that we get from DATABASE", subjectId)
                console.log("*************************",subjectId.subject_id)
                res.json({data: await subjectId.subject_id})
            }catch(error){
                console.error(error)
                res.status(404).json({error:"Unable to get subject id"})
            }
        }
    }

    module.exports = {
        created:[getIdToken, addSubject],
        list:[getIdToken, getSub],
        getId:[getIdToken, getSubjectId],
        // checkSub:[getIdToken, aSubjectHasBeenChosen ]
    };

