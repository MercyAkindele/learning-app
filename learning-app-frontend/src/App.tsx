import './App.css'
import Navigation from './components/Navigation'
import Login from './components/Login'
import { Routes, Route } from 'react-router-dom'
import Signup from './components/Signup'
import { AuthUserProvider } from './firebase/auth'

function App() {

  return (
    <AuthUserProvider>
    <>
    <Navigation/>
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      {/* <Route path="/signin" element={<SignIn/>}/> */}
    </Routes>
    
    </>
    </AuthUserProvider>
  )
}

export default App
