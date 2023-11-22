import{ createContext, useState, useEffect, useContext, ReactNode } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { User } from 'firebase/auth';

type AuthUser = {
    uid:string|null,
    email:string|null,
}
type UserContext = {
    authUser:AuthUser|null,
    isLoading:boolean,
    signUp:(email: string, password:string) => Promise<void>
    logIn: (email:string, password:string) => Promise<void>
}
const initialContext:UserContext = {
    authUser:null,
    isLoading:true,
    signUp: async (email: string, password: string) =>{},
    logIn: async (email:string, password: string) => {}
}
type AuthUserContextProviderProps = {
    children: ReactNode;
}

const AuthUserContext = createContext(initialContext);

export default function useFirebaseAuth(){
    const [authUser, setAuthUser] = useState<AuthUser|null>(null);
    const [ isLoading, setIsLoading] = useState<boolean>(true);


    const authStateChanged = async (user:User|null) =>{
        setIsLoading(true);
        if(!user){
            setAuthUser(null);
            setIsLoading(false);
            return
        }
        setAuthUser({uid:user.uid, email:user.email});
        setIsLoading(false);
    }
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, authStateChanged)
        return () => unsubscribe()
    },[])
    const signUp = async (email:string, password:string)=>{
        try{
            await createUserWithEmailAndPassword(auth, email, password)
        }catch (error){
            throw error;
        }
    }
    const logIn = async (email:string, password:string) =>{
        try{
            await signInWithEmailAndPassword(auth, email, password)
        }catch (error){
            throw error;
        }
    }
    return {authUser, isLoading, signUp, logIn }
}


export function AuthUserProvider({children}:AuthUserContextProviderProps){
    const auth = useFirebaseAuth();
    return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>;
};
export const useAuth = () => useContext(AuthUserContext)