import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { Button } from "../components/ui/button";

const Header = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    console.log("Logging out user:", user); // Debugging line
    logout();
    setDropdownOpen(false); // Close dropdown on logout
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log("User in Header:", user); // Debugging line

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
      <Link to="/" className="text-xl font-bold">
        Country Explorer
      </Link>
      <div className="relative" ref={dropdownRef}>
        {user && (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            <img
              src={user.profilePicture || "/default-avatar.png"}
              alt="User Avatar"
              className="w-8 h-8 rounded-full shadow-md"
            />
            <span className="hidden sm:block">{user.name || "Profile"}</span>
          </div>
        )}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <Button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;