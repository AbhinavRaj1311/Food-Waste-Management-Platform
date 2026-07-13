import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./api"; // Use the centralized axios instance
import AdminHeader from "./AdminHeader"; // Assuming you have a header component for the admin

const AdminProfile = () => {
  const navigate = useNavigate();
  const [adminDetails, setAdminDetails] = useState(null);

  // Fetch admin details on component mount
  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get("/auth/admin/details"); // Endpoint to get admin details
        setAdminDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch admin details", error);
        navigate("/admin-login"); // Redirect to admin login if session is invalid
      }
    };

    fetchAdminDetails();
  }, [navigate]);
  const addAdmin = () => {
    navigate('/admin-signup');
  };

  return (
    <>
    <AdminHeader/>
      <div className="container mt-5">
        <h2>Welcome to your Admin Profile</h2>
        {adminDetails ? (
          <div>
            <p><strong>Username:</strong> {adminDetails.username}</p>
            <p><strong>Role:</strong> {adminDetails.role}</p>
          </div>

        ) : (
          <p>Loading admin details...</p>
        )}
         <button type="button" className="btn btn-primary" onClick={addAdmin}>
          Add New Admin
        </button>
      </div>
    </>
  );
};

export default AdminProfile;
