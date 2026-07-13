import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./api";
import RegUserSideNav from "./regUserSideNav.jsx";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaIdCard, FaEdit, FaCamera } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Handle sidebar toggle
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/auth/user/details");
        setUserDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user details", error);
        setError("Failed to load profile. Please try again.");
        setLoading(false);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchUserDetails();
  }, [navigate]);

  return (
    <div className="app-container">
      <div className="sidebar">
        <RegUserSideNav onToggleSidebar={handleSidebarToggle} />
      </div>
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="container-fluid py-4 px-4" style={{ background: "linear-gradient(180deg, #f8f9fa, #ffffff)" }}>
          <motion.div
            className="row justify-content-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="col-xl-8 col-lg-10">
              <motion.div
                className="card border-0 shadow-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{ borderRadius: "12px", overflow: "hidden" }}
              >
                {loading ? (
                  <div className="card-body d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
                    <div className="text-center">
                      <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <h5 className="text-muted">Loading profile...</h5>
                    </div>
                  </div>
                ) : error ? (
                  <div className="card-body d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
                    <div className="text-center text-danger">
                      <FaIdCard size={50} className="mb-3" />
                      <h5>{error}</h5>
                      <button className="btn btn-outline-primary mt-3" onClick={() => window.location.reload()}>
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="card-header bg-primary text-white py-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <h3 className="mb-0">Your Profile</h3>
                        <motion.button
                          className="btn btn-light btn-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaEdit className="me-2" /> Edit Profile
                        </motion.button>
                      </div>
                    </div>

                    {userDetails && (
                      <div className="card-body p-0">
                        <div className="row g-0">
                          <div className="col-md-4 bg-light">
                            <div className="text-center p-4">
                              <div className="position-relative d-inline-block">
                                <motion.img
                                  src={`https://ui-avatars.com/api/?name=${userDetails.name}&background=random&size=200`}
                                  alt="User Avatar"
                                  className="rounded-circle mb-3 img-fluid border shadow-sm"
                                  style={{ width: "160px", height: "160px" }}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.5 }}
                                />
                                <motion.div
                                  className="position-absolute bottom-0 end-0"
                                  whileHover={{ scale: 1.1 }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div className="bg-primary text-white rounded-circle p-2 shadow">
                                    <FaCamera size={18} />
                                  </div>
                                </motion.div>
                              </div>
                              <motion.h4
                                className="mt-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                              >
                                {userDetails.name}
                              </motion.h4>
                              <motion.div
                                className="badge bg-success px-3 py-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                              >
                                Active User
                              </motion.div>
                            </div>
                          </div>
                          
                          <div className="col-md-8">
                            <div className="p-4">
                              <h5 className="mb-4 pb-2 border-bottom">Account Details</h5>

                              <div className="mb-3">
                                <div className="d-flex">
                                  <div className="bg-light rounded-circle p-3 me-3">
                                    <FaIdCard className="text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-muted mb-1">User ID</p>
                                    <p className="fw-bold mb-0">{userDetails.id}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-3">
                                <div className="d-flex">
                                  <div className="bg-light rounded-circle p-3 me-3">
                                    <FaUser className="text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-muted mb-1">Full Name</p>
                                    <p className="fw-bold mb-0">{userDetails.name}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-3">
                                <div className="d-flex">
                                  <div className="bg-light rounded-circle p-3 me-3">
                                    <FaEnvelope className="text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-muted mb-1">Email Address</p>
                                    <p className="fw-bold mb-0">{userDetails.email}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="d-grid gap-2 mt-4">
                                <motion.button
                                  className="btn btn-primary"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  style={{ 
                                    backgroundImage: "linear-gradient(90deg, #4CAF50, #2196F3)",
                                    border: "none",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                                  }}
                                >
                                  Update Profile
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;