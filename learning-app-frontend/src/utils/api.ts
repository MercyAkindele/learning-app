
const API_BASE_URL = import.meta.env.VITE_APP_REACT_APP_API_BASE_URL || "http://localhost:8080";
const headers = new Headers();
headers.append("Content-Type", "application/json")
let data:any;
type Options = {
    headers:Headers,
    signal?:AbortSignal|null,
    method:string,
    body?:string,
}

const fetchJson = async (url:URL, options:Options, onCancel:AbortSignal|null):Promise<any>=>{
    try{
        const response = await fetch(url, options)
        if(response.status === 204){
            return null
        }
        const payload = await response.json();
        if(payload.error){
            return Promise.reject({message:payload.error})
        }
        return payload.data
    }catch(error:any){
        if(error.name !== "AbortError"){
            console.error(error.stack)
            throw error
        }
        return Promise.resolve(onCancel)
    }
}


export async function sendSubjectForValidation(token:string, data:any){
    const url = new URL(`${API_BASE_URL}/api/subject`);
    if(token){
        headers.set("Authorization", `Bearer ${token}`)
    }
    const options:Options = {
        headers,
        method:"POST",
        body: JSON.stringify({data})
    }
    return await fetchJson(url, options, null);
}

export async function getSubjects(token:string){
    console.log("We are trying to do api call to get list of subjects")
    const url = new URL(`${API_BASE_URL}/api/subject`);
    if(token){
        headers.set("Authorization", `Bearer ${token}`)
    }
    const options:Options = {
        headers,
        method:"GET",
    }
    return await fetchJson(url, options, null);
}
export async function getASubjectId(token:string, subjectName:string){
    console.log("We are trying to do api call to get subject id")
    const url = new URL(`${API_BASE_URL}/api/subject/${subjectName}`);
    if(token){
        headers.set("Authorization", `Bearer ${token}`)
    }
    const options:Options = {
        headers,
        method:"GET",
    }
    return await fetchJson(url, options, null);
}

export async function saveNotes(token:string, data:{}){
    console.log("we are inside api function called saveNotes")
    const url = new URL(`${API_BASE_URL}/api/notes`)


    if(token){
        headers.set("Authorization", `Bearer ${token}`)
    }
    const options:Options = {
        headers,
        method:"POST",
        body:JSON.stringify({data})
    }
    return await fetchJson(url, options, null)
}
export async function getNotes(token:string, subjectId:number|undefined){
    const url = new URL(`${API_BASE_URL}/api/notes/${subjectId}`)
    if(token){
        headers.set("Authorization", `Bearer ${token}`)
    }
    const options:Options ={
        headers,
        method:"GET"
    }
    return await fetchJson(url, options, null)
}
