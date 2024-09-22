import { useState } from "react";
import { FaUnlockAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { userAtom } from "../state/userAtom";

const LoginPage = () => {
  const [userData, setUserData] = useRecoilState(userAtom);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loginUser = async (userData) => {
    try {
      const response = await axios.post("/users/login", userData);
      const data = response.data;

      if (response.status === 200) {
        setUserData(data.user);
        console.log(userData);

        localStorage.setItem("token", data.token);
        toast.success("Login Successful...");
        return data;
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Invalid credentials");
      } else {
        toast.error("Failed to Login. Please try again");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // if (formData.password.length < 8) {
    //   setError("Password must be at least 8 characters long");
    //   return;
    // }

    try {
      console.log(formData);
      const data = await loginUser(formData);
      if (data) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Login Error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8 md:p-12 lg:p-16">
      <div className="w-full max-w-md bg-white border border-gray-300 shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Login Account</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 text-gray-800"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 text-gray-800"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-800"
          >
            Login
          </button>
        </form>

        <p className="text-gray-500 mt-4">
          By logging in, you will unlock all the features of the app.{" "}
          <FaUnlockAlt className="inline" />
        </p>

        <p className="text-gray-500 mt-2">
          Don't have an account? Create here{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
