import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Install using `npm install framer-motion`
import { FaHome, FaUser, FaDonate, FaSignOutAlt } from "react-icons/fa";

const UserHeader = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <>
      {/* Navbar */}
      <motion.nav
        className="navbar"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "0.5em 1em",
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <motion.button
          onClick={toggleSidebar}
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
            padding: "0.5em",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ☰
        </motion.button>
        <motion.div
          style={{ fontSize: "20px", fontWeight: "bold" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Food Waste Management
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link
            to="/profile"
            style={{
              textDecoration: "none",
              color: "white",
              fontSize: "18px",
              padding: "0.5em 1em",
              border: "1px solid white",
              borderRadius: "5px",
            }}
          >
            Profile
          </Link>
        </motion.div>
      </motion.nav>

      {/* Sidebar */}
      <motion.div
        className="sidebar"
        initial={{ width: isSidebarOpen ? "50px" : "250px" }}
        animate={{ width: isSidebarOpen ? "250px" : "50px" }}
        transition={{ duration: 0.5 }}
        style={{
          position: "fixed",
          top: "3.5em", // Push sidebar content below the navbar
          left: 0,
          height: "calc(100vh - 3.5em)",
          backgroundColor: "#4CAF50",
          color: "white",
          overflow: "hidden",
          zIndex: 1000,
        }}
      >
        <ul style={{ listStyle: "none", padding: "1em 0", margin: 0 }}>
          <motion.li
            style={{ padding: "1em", display: "flex", alignItems: "center" }}
            whileHover={{ scale: 1.05 }}
          >
            <FaHome
              style={{
                marginRight: isSidebarOpen ? "10px" : "0",
                transition: "margin-right 0.3s ease",
              }}
            />
            {isSidebarOpen && (
              <Link
                to="/mydonations"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "18px",
                }}
              >
                My Donations
              </Link>
            )}
          </motion.li>
          {/* <motion.li
            style={{ padding: "1em", display: "flex", alignItems: "center" }}
            whileHover={{ scale: 1.05 }}
          >
            <FaUser
              style={{
                marginRight: isSidebarOpen ? "10px" : "0",
                transition: "margin-right 0.3s ease",
              }}
            />
            {isSidebarOpen && (
              <Link
                to="/profile"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "18px",
                }}
              >
                Profile
              </Link>
            )}
          </motion.li> */}
          <motion.li
            style={{ padding: "1em", display: "flex", alignItems: "center" }}
            whileHover={{ scale: 1.05 }}
          >
            <FaDonate
              style={{
                marginRight: isSidebarOpen ? "10px" : "0",
                transition: "margin-right 0.3s ease",
              }}
            />
            {isSidebarOpen && (
              <Link
                to="/donations"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "18px",
                }}
              >
                All Donation Posts
              </Link>
            )}
          </motion.li>
          <motion.li
            style={{ padding: "1em", display: "flex", alignItems: "center" }}
            whileHover={{ scale: 1.05 }}
          >
            <FaSignOutAlt
              style={{
                marginRight: isSidebarOpen ? "10px" : "0",
                transition: "margin-right 0.3s ease",
              }}
            />
            {isSidebarOpen && (
              <Link
                to="/logout"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "18px",
                }}
              >
                Logout
              </Link>
            )}
          </motion.li>
        </ul>
      </motion.div>
    </>
  );
};

export default UserHeader;