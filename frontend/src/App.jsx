import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { useRecoilValue } from "recoil";
import { userAtom } from "./atoms/userAtom";

function App() {
  const userData = useRecoilValue(userAtom);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="max-w-5xl mt-0 text-white mx-auto p-4 sm:p-6 lg:p-8 transition-all duration-300 flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={!userData ? <LoginPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/signup"
            element={!userData ? <SignUpPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/explore"
            element={userData ? <ExplorePage /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/likes"
            element={userData ? <LikesPage /> : <Navigate to={"/login"} />}
          />
        </Routes>
        <Toaster />
      </div>
    </div>
  );
}

export default App;
