import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useRecoilValue } from "recoil";
import { userAtom } from "./state/userAtom.js";
import HomePage from "./pages/HomePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import NavBar from "./components/NavBar.jsx";

function App() {
  const [userData, setUserData] = useState(false);

  return (
    <>
      <h1>True</h1>
      <div className="flex flex-col min-h-screen">
        {/* <NavBar /> */}
        <div className="max-w-5xl mt-0 text-white mx-auto p-4 sm:p-6 lg:p-8 transition-all duration-300 flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={!userData ? <LoginPage /> : <Navigate to={"/"} />}
            />
            <Route
              path="/signup"
              element={!userData ? <SignupPage /> : <Navigate to={"/"} />}
            />
            <Route
              path="/dashboard"
              element={
                userData ? <DashboardPage /> : <Navigate to={"/login"} />
              }
            />
          </Routes>
          <Toaster />
        </div>
      </div>
    </>
  );
}

export default App;
