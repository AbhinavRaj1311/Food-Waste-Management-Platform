import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "./Header";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input changes
  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleContactChange = (e) => setContact(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/auth/user/register", {
        name,
        email,
        contact,
        password,
      });

      if (response.data) {
        setSuccessMessage("User registered successfully.");
        setTimeout(() => (window.location.href = "/login"), 2000); // Redirect to login after success
      }
    } catch (error) {
      setErrorMessage(error.response ? error.response.data : "Something went wrong.");
    }
  };

  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "2.5rem",
            borderRadius: "15px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
            width: "100%",
            maxWidth: "450px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "2.2rem", fontWeight: "bold", color: "#333", marginBottom: "1rem" }}>
            Create Account
          </h2>
          <p style={{ fontSize: "1rem", color: "#666", marginBottom: "2rem" }}>
            Join us to manage food donations effectively.
          </p>
          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="name" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                Name
              </label>
              <input
                type="text"
                id="name"
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
                placeholder="Enter your name"
                value={name}
                onChange={handleNameChange}
                required
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="contact" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                Contact
              </label>
              <input
                type="text"
                id="contact"
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
                placeholder="Enter your contact number"
                value={contact}
                onChange={handleContactChange}
                required
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>

            {errorMessage && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.8rem",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  background: "#f8d7da",
                  color: "#721c24",
                }}
              >
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.8rem",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  background: "#d4edda",
                  color: "#155724",
                }}
              >
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              style={{
                background: "linear-gradient(90deg, #ff758c, #ff7eb3)",
                color: "white",
                border: "none",
                padding: "0.8rem",
                fontSize: "1.1rem",
                borderRadius: "8px",
                cursor: "pointer",
                width: "100%",
                marginTop: "1.5rem",
                transition: "background 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.background = "linear-gradient(90deg, #ff7eb3, #ff758c)")}
              onMouseOut={(e) => (e.target.style.background = "linear-gradient(90deg, #ff758c, #ff7eb3)")}
            >
              Sign Up
            </button>
          </form>
          <div style={{ marginTop: "2rem" }}>
            <Link to="/login" style={{ color: "#ff758c", textDecoration: "none", fontWeight: "bold" }}>
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;