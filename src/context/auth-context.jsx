import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../middleware/axioinstance";
import { getUserSession, removeUserSession, setUserSession } from "../middleware/auth";

// Handle the authentication response
const handleAuthResponse = (response) => {
  if (!response || !response.data) {
    console.log("Invalid response:", response);
    return null;
  }
  const { data = {} } = response.data;
  return data;
};

// Create the AuthContext
const AuthContext = createContext(undefined);

// AuthProvider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const getUser = async () => {
      try {
        const session = getUserSession();
        const { token, email } = session || {};
        if (!token) {
          console.log("No token found, redirecting to login.");
          navigate("/login");
          return;
        } else {
          console.log("Valid session found, fetching user data.");
          const response = await axiosInstance.get(
            `/users/v1/get-by-id/${email}`,
            {
              headers: {
                ...(token ? { Authorization: token } : {}),
              },
            }
          );

          const userData = handleAuthResponse(response);
          if (!userData) {
            console.log("No user data found in response");
            navigate("/login");
            return;
          }
          {
            setUser(session);
            setUserSession(session);
            navigate("/");
          }
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
        navigate("/login");
      }
    };
    getUser();
  }, []);

  // Logout function
  const logout = () => {
    setUser(null);
    removeUserSession();
    navigate("/login"); // Redirect to login after logout
  };

  // Login function
  const login = async (data) => {
    try {
      const { email, password } = data;
      const response = await axiosInstance.post("/auth/v1/login", {
        email: email,
        password: btoa(password),
      });

      const user = handleAuthResponse(response);
      if (!user?.token) {
        console.log("No token found in response:", response);
        return { success: false, error: errorMessage };
      }
      setUser(user);
      setUserSession(user);
      navigate("/"); // Redirect to home after login
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      };
    }
  };

  // Register function
  const register = async (data) => {
    try {
      const { email, name, password, profilePicture } = data;
      const response = await axiosInstance.post("/auth/v1/register", {
        email,
        password: btoa(password),
        name: name,
        profilePicture: profilePicture,
      });

      const user = handleAuthResponse(response);
      setUser(user);
      setUserSession(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: errorMessage };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
