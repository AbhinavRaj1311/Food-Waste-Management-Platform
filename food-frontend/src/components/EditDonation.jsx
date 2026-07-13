import React, { useState, useEffect } from "react";
import axios from "./api";
import { useNavigate, useParams } from "react-router-dom";
import UserHeader from "./UserHeader";

const EditDonation = () => {
  const [donation, setDonation] = useState({
    donorId: "",
    receiverId: null,
    postDate: new Date().toISOString().split("T")[0], // Automatically set to current date
    claimDate: null,
    availabilityStatus: true,
    quantity: "",
    alternateContact: "",
    address: "",
  });

  const navigate = useNavigate();
  const { id } = useParams(); // Extract donation ID from URL

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("/auth/user/details");
        if (response.data && response.data.id) {
          setDonation((prev) => ({ ...prev, donorId: response.data.id })); // Set donorId
        } else {
          console.error("User ID not found in response.");
          alert("Failed to fetch user ID. Please log in again.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user details", error);
        navigate("/login"); // Redirect to login if session is invalid
      }
    };

    const fetchDonationDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/donations/${id}`);
        if (response.data) {
          setDonation(response.data); // Set donation data for editing
        } else {
          alert("Donation not found.");
          navigate("/donations");
        }
      } catch (error) {
        console.error("Failed to fetch donation details", error);
        alert("Error fetching donation details.");
        navigate("/donations");
      }
    };

    fetchUserDetails();
    fetchDonationDetails();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDonation({
      ...donation,
      [name]: type === "checkbox" ? checked : value, // Correctly handle checkbox and other input types
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    donation.postDate = new Date().toISOString().split("T")[0]; // Ensure postDate is current on submission
    axios
      .put(`http://localhost:8080/donations/${id}`, donation)
      .then(() => {
        alert("Donation updated successfully!");
        navigate("/donations"); // Redirect to /donations after success
      })
      .catch((error) => {
        alert("Error updating donation!");
        console.error(error);
      });
  };

  return (
    <>
      <UserHeader />
      <div className="container mt-4">
        <h2 className="text-center">Edit Donation</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Donor ID:</label>
            <input
              type="number"
              name="donorId"
              className="form-control"
              value={donation.donorId}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Post Date:</label>
            <input
              type="date"
              name="postDate"
              className="form-control"
              value={donation.postDate}
              readOnly // Disable editing postDate as it will be updated automatically
            />
          </div>
          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              className="form-control"
              value={donation.quantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Alternate Contact:</label>
            <input
              type="text"
              name="alternateContact"
              className="form-control"
              value={donation.alternateContact}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <textarea
              name="address"
              className="form-control"
              value={donation.address}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="availabilityStatus"
                checked={donation.availabilityStatus}
                onChange={handleChange}
              />{" "}
              Available
            </label>
          </div>
          <button type="submit" className="btn btn-primary">
            Update Donation
          </button>
        </form>
      </div>
    </>
  );
};

export default EditDonation;
