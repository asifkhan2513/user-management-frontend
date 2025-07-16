import React, { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { toast } from "react-toastify";
import {
  HomeIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Navbar = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    toast.info("Logged out successfully");
    setMenuOpen(false);
  };

  const navLinks = user && (
    <>
      {user.role === "admin" && (
        <a
          href="/admin"
          className="hover:underline block px-4 py-2"
          onClick={() => setMenuOpen(false)}
        >
          Admin
        </a>
      )}
      {user.role === "hr" && (
        <a
          href="/hr"
          className="hover:underline block px-4 py-2"
          onClick={() => setMenuOpen(false)}
        >
          HR
        </a>
      )}
      {user.role === "employee" && (
        <a
          href="/employee"
          className="hover:underline block px-4 py-2"
          onClick={() => setMenuOpen(false)}
        >
          Employee
        </a>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-primary dark:bg-gray-800 shadow-md">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <HomeIcon className="h-6 w-6 text-primary hidden sm:inline" />
          <span className="font-bold text-lg">User Management</span>
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-4 mt-2">
            {navLinks}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && (
            <UserIcon className="h-6 w-6 text-gray-700 dark:text-gray-200 hidden md:inline" />
          )}
          {/* Desktop logout */}
          {user && (
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1 bg-red-500 text-white rounded hidden md:block flex items-center gap-1"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 inline" />
              Logout
            </button>
          )}
          {/* Hamburger icon for mobile */}
          <button
            className="md:hidden ml-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 pb-4 animate-fade-in z-50 mt-2">
          {navLinks}
          {user && (
            <button
              onClick={handleLogout}
              className="w-full mt-2 px-3 py-2 bg-red-500 text-white rounded flex items-center gap-1"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 inline" />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
