import { Link } from "react-router-dom"

const Navigation = () => {
    
  return (
    <nav>
        <h1>Learning App</h1>
        <Link to={"/login"}>Log In</Link>
        <Link to="/signup">Sign Up</Link>
    </nav>
  )
}

export default Navigation