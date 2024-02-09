import "./App.css";
import { AuthUserProvider } from "./firebase/auth";
import AppRoutes from "./layout/AppRoutes";

function App() {
  return (
    <>
      <AuthUserProvider>
        <AppRoutes/>
      </AuthUserProvider>
    </>
  );
}

export default App;
