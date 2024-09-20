import { Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
