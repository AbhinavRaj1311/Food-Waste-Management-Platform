import React, { useState, useEffect } from "react";
import axios from "./api";
import { useNavigate, useParams } from "react-router-dom"; // For navigation and params
import AdminHeader from "./AdminHeader";

const EditUser = () => {
  const { id } = useParams(); // Get the user ID from URL params
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/${id}`); // Get user data by ID
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/users/${id}`, user); // Update user data
      alert("User updated successfully!");
      navigate("/admin-users"); // Redirect to user management page
    } catch (error) {
      console.error("Error updating user", error);
      alert("Error updating user.");
    }
  };

  return (
    <>
        <AdminHeader />

    <div className="container mt-4">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={user.name}
            onChange={handleChange}
            required
            />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={user.email}
            onChange={handleChange}
            required
            />
        </div>
        <div className="form-group">
          <label>Contact:</label>
          <input
            type="text"
            name="contact"
            className="form-control"
            value={user.contact}
            onChange={handleChange}
            required
            />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={user.password}
            onChange={handleChange}
            required
            />
        </div>
        <button type="submit" className="btn btn-primary">
          Update User
        </button>
      </form>
    </div>
            </>
  );
};

export default EditUser;
