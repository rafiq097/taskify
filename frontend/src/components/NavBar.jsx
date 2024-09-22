import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { useRecoilValue } from "recoil";
import { userAtom } from "../state/userAtom";
import { FaBars, FaTimes } from "react-icons/fa";

const NavBar = () => {
  const userData = useRecoilValue(userAtom);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full bg-gradient-to-r from-green-600 to-teal-600 border-b shadow-md sticky top-0 z-50 backdrop-blur-md">
      <nav className="container mx-auto flex items-center justify-between py-2 px-4">
        <div className="flex items-center">
          <h1 className="text-lg font-bold text-white">Taskify</h1>
        </div>
        <div className="hidden md:flex gap-4 items-center">
          {userData && (
            <>
              <Link
                to="/"
                className="px-3 py-2 text-white hover:bg-teal-700 rounded-lg transition duration-200 h-10 flex items-center"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="px-3 py-2 text-white hover:bg-teal-700 rounded-lg transition duration-200 h-10 flex items-center"
              >
                Dashboard
              </Link>
            </>
          )}
          {!userData && (
            <>
              <Link
                to="/login"
                className="px-3 py-2 text-white hover:bg-teal-700 rounded-lg transition duration-200 h-10 flex items-center"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3 py-2 text-white hover:bg-teal-700 rounded-lg transition duration-200 h-10 flex items-center"
              >
                Signup
              </Link>
            </>
          )}
          {userData && <Logout />}
        </div>
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-green-500 to-teal-600 border-t w-screen shadow-md">
          <nav className="flex flex-col items-center py-2">
            {userData && (
              <>
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left px-3 py-3 text-white hover:bg-teal-700 transition duration-200"
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left px-3 py-3 text-white hover:bg-teal-700 transition duration-200"
                >
                  Dashboard
                </Link>
              </>
            )}
            {!userData && (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left px-3 py-3 text-white hover:bg-teal-700 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left px-3 py-3 text-white hover:bg-teal-700 transition duration-200"
                >
                  Signup
                </Link>
              </>
            )}
            {userData && (
              <div className="w-full text-left px-3 py-3 text-white hover:bg-teal-700 transition duration-200">
                <Logout />
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
