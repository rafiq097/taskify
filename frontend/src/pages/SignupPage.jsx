import { useState } from "react";
import { FaUnlockAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";

const SignupPage = () => {
  const [userData, setUserData] = useRecoilState(userAtom);
  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const registerUser = async (userData) => {
    try {
      const response = await axios.post("/users/signup", userData);
      if (response.status !== 200) {
        toast.error("Failed to register user. Please try again!");
      }

      const data = response.data;
      if (response.status === 200) {
        setUserData(data.user);
        localStorage.setItem("token", data.token);
        toast.success("Registered Successful...");
        toast.success("Logging in...");
        return data;
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again");
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

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError("Invalid email address");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      const data = await registerUser(formData);
      if (data) navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8 md:p-12 lg:p-16">
      <div className="w-full max-w-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 hover:bg-gray-600/10 border border-gray-800 text-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:outline-none focus:border-blue-500 text-black"
            required
          />
          <input
            type="text"
            name="fullname"
            placeholder="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:outline-none focus:border-blue-500 text-black"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:outline-none focus:border-blue-500 text-black"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-center">
          By signing up, you will unlock all the features of the app.{" "}
          <FaUnlockAlt className="inline" />
        </p>

        <p className="text-gray-300 mt-2 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
