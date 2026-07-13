import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./api"; // Centralized axios instance

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.post("/auth/logout"); // API call to handle logout
        navigate("/"); // Redirect to homepage after logout
      } catch (error) {
        console.error("Logout failed", error);
        navigate("/"); // Redirect to homepage even if API call fails
      }
    };

    performLogout();
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
