import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Install using `npm install framer-motion`

const HomePage = () => {
  const navigate = useNavigate();

  const handleDonateFood = () => {
    navigate("/addDonations");
  };

  const handleReceiveFood = () => {
    navigate("/donations");
  };

  const handleRegularUser = () => {
    navigate("/profile");
  };

  return (
    <div
      className="container-fluid d-flex flex-column justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <motion.h1
        className="mb-4"
        style={{ fontSize: "3rem", fontWeight: "bold" }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to Food Rescue Hub
      </motion.h1>
      <motion.p
        className="mb-5 text-center"
        style={{ fontSize: "1.2rem", maxWidth: "600px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Join us in reducing food waste and helping those in need. Choose an
        option below to get started.
      </motion.p>
      <div className="row justify-content-center w-100">
        <motion.div
          className="col-md-3 mb-3"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            className="btn btn-primary btn-lg btn-block"
            style={{
              background: "linear-gradient(90deg, #ff758c, #ff7eb3)",
              border: "none",
              color: "white",
              padding: "15px",
              borderRadius: "10px",
              fontSize: "1.2rem",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
            onClick={handleDonateFood}
          >
            Donate Food
          </button>
        </motion.div>
        <motion.div
          className="col-md-3 mb-3"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            className="btn btn-success btn-lg btn-block"
            style={{
              background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              border: "none",
              color: "white",
              padding: "15px",
              borderRadius: "10px",
              fontSize: "1.2rem",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
            onClick={handleReceiveFood}
          >
            Receive Food
          </button>
        </motion.div>
        <motion.div
          className="col-md-3 mb-3"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            className="btn btn-warning btn-lg btn-block"
            style={{
              background: "linear-gradient(90deg, #f7971e, #ffd200)",
              border: "none",
              color: "white",
              padding: "15px",
              borderRadius: "10px",
              fontSize: "1.2rem",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
            onClick={handleRegularUser}
          >
            Regular Use
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;