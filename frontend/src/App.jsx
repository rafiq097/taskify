import { useState, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useRecoilState } from "recoil";
import { userAtom } from "./state/userAtom.js";
import HomePage from "./pages/HomePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import NavBar from "./components/NavBar.jsx";
import axios from "axios";
import Spinner from "./components/Spinner.jsx";

function App() {
  const [userData, setUserData] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get("/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data.user);
      } catch (error) {
        console.log(error.message);
        localStorage.removeItem("token");
        setUserData(null);
        navigate("/login");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    verifyToken();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={!userData ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!userData ? <SignupPage /> : <Navigate to="/" />}
            />
            <Route
              path="/dashboard"
              element={userData ? <DashboardPage /> : <Navigate to="/login" />}
            />
          </Routes>
      </div>
      <Toaster />
    </>
  );
}

export default App;
