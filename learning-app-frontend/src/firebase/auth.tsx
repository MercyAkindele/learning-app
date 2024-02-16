import{ createContext, useState, useEffect, useContext, ReactNode } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { User } from 'firebase/auth';
import { useNavigate } from "react-router-dom";

type AuthUser = {
    uid?:string|null,
    email?:string|null,
    displayName?:string|null,
    photoUrl?:string|null,
}
type UserContext = {
    authUser:AuthUser|null,
    isLoading:boolean,
    signUp:(email: string, password:string) => Promise<void>
    logIn: (email:string, password:string) => Promise<void>
    logOut:()=>Promise<void>
}
const initialContext:UserContext = {
    authUser:null,
    isLoading:true,
    signUp: async (email: string, password: string) =>{},
    logIn: async (email:string, password: string) => {},
    logOut: async () => {},
}

type AuthUserContextProviderProps = {
    children: ReactNode;
}

const AuthUserContext = createContext(initialContext);

export default function useFirebaseAuth(){
    const [authUser, setAuthUser] = useState<AuthUser|null>(null);
    const [ isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const authStateChanged = async (user:User|null) =>{
        setIsLoading(true);
        if(!user){
            setAuthUser(null);
            setIsLoading(false);
            return
        }

        setAuthUser({uid:user.uid,email:user.email, displayName:user.displayName,photoUrl:user.photoURL});
        setIsLoading(false);
        console.log('on auth state changed');
    }

    const signUp = async (email:string, password:string)=>{
        try{
          let createdUser= await createUserWithEmailAndPassword(auth, email, password)
          await updateProfile(createdUser.user,{displayName:createdUser.user.email?.split("@")[0]})
        }catch (error){
            throw error;
        }
    }

    const logIn = async (email:string, password:string) =>{
        try{
            await signInWithEmailAndPassword(auth, email, password)
            navigate("/dashboard")

        }catch (error){
            throw error;
        }
    }

    const logOut = async ()=>{
        try{
            await signOut(auth)
            console.log("you have logged out")
            navigate("/");
        }catch (error){
            throw error
        }
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, authStateChanged)
        return () => unsubscribe()
    },[])

    return {authUser, isLoading, signUp, logIn, logOut}
}

export function AuthUserProvider({children}:AuthUserContextProviderProps){
    const auth = useFirebaseAuth();
    return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>;
};
export const useAuth = () => useContext(AuthUserContext)
