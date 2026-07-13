import React, { useEffect, useState } from "react";
import axios from "./api";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";

const AdminDonationList = () => {
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();

  // Fetch all donations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("/donations"); // Endpoint to get all donations
        setDonations(response.data); // Set donations data
      } catch (error) {
        console.error("Failed to fetch donations", error);
      }
    };

    fetchDonations();
  }, []);

  const handleEdit = (donationId) => {
    navigate(`/admin-donations/edit/${donationId}`); // Navigate to edit page
  };

  const handleDelete = async (donationId) => {
    try {
      await axios.delete(`/donations/${donationId}`);
      setDonations(donations.filter((donation) => donation.id !== donationId)); // Remove deleted donation from state
    } catch (error) {
      console.error("Error deleting donation", error);
    }
  };

  return (

    <>
    <AdminHeader/>
    <div className="container mt-4">
      <h2 className="text-center">Donation List</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Donor ID</th>
            <th>Receiver ID</th>
            <th>Claim Date</th>
            <th>Quantity</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
              <tr key={donation.id}>
              <td>{donation.id}</td>
              <td>{donation.donorId}</td>
              <td>{donation.receiverId}</td>
              <td>{donation.claimDate ? donation.claimDate : "N/A"}</td>
              <td>{donation.quantity}</td>
              <td>{donation.alternateContact}</td>
              <td>{donation.address}</td>
              <td>{donation.availabilityStatus ? "Available" : "Unavailable"}</td>
              <td>
                <button className="btn btn-warning" onClick={() => handleEdit(donation.id)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(donation.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
          </>
  );
};

export default AdminDonationList;
