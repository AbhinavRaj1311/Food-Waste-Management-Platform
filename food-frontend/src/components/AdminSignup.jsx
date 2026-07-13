import React, { useState } from "react";
import axios from "./api";
import Header from "./Header";

const AdminSignupPage = () => {
  const [name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input changes
  const handleNameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Handle admin signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Send POST request to backend for admin signup
      const response = await axios.post("http://localhost:8080/admins", {
        name,
        password,
      });

      if (response.data) {
        setSuccessMessage("Admin registered successfully.");
        setTimeout(() => window.location.href = "/admin-login", 2000); // Redirect to admin login after success
      }
    } catch (error) {
      setErrorMessage(error.response ? error.response.data : "Something went wrong.");
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center">Admin Signup</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="Enter admin name"
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>


          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter admin password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>

          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
      </div>
    </>
  );
};

export default AdminSignupPage;
