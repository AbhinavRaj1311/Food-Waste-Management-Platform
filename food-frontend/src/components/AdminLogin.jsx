import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import Header from "./Header";

const AdminLoginPage = () => {
  const [username, setEmail] = useState(""); // Renamed setUsername to setEmail for clarity
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/admin/login", { username, password });
      if (response.data) {
        // Pass only relevant info (username, role) to the admin dashboard
        navigate("/admin-dashboard", { state: { username: response.data.username, role: "ADMIN" } });
      }
    } catch (error) {
      setErrorMessage("Invalid admin email or password.");
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setEmail(e.target.value)} // Changed to setEmail
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminLoginPage;
