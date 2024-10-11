import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./middleware";
import Login from "./pages/@auth/login";
import Signup from "./pages/@auth/signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />

        {/* Protect these routes */}
        {/* <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        /> */}
      </Routes>
    </Router>
  );
}

export default App;
