import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion"; // Install using `npm install framer-motion`
import api from "./api";
import "./LoginPage.css"; // Custom CSS for styling
import Header from "./Header";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/user/login", { email, password });
      if (response.data) {
        navigate("/homepage", { state: { id: response.data.id } });
      }
    } catch (error) {
      setErrorMessage("Invalid email or password.");
    }
  };

  return (
    <>
    <Header/>
    <motion.div
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      >
      <motion.div
        className="login-card"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        >
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Please login to continue</p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <motion.input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
              whileFocus={{ scale: 1.05 }}
              />
          </div>
          <div className="form-group">
            <label>Password</label>
            <motion.input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
              whileFocus={{ scale: 1.05 }}
              />
          </div>
          {errorMessage && (
            <motion.div
            className="alert alert-danger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            >
              {errorMessage}
            </motion.div>
          )}
          <motion.button
            type="submit"
            className="btn btn-primary w-100"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            >
            Login
          </motion.button>
        </form>
        <div className="links mt-3">
          <Link to="/signup" className="link">
            User Signup
          </Link>
          <Link to="/admin-login" className="link">
            Admin Login
          </Link>
        </div>
      </motion.div>
    </motion.div>
            </>
  );
};

export default LoginPage;