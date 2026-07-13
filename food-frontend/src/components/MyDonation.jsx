import React, { useEffect, useState } from "react";
import axios from "./api";
import { listUserDonations, deleteDonation } from "../services/DonationService";
import { useNavigate } from "react-router-dom";
import UserHeader from "./UserHeader";
import "./MyDonations.css"; // Custom CSS for styling and animations

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donorId, setDonorId] = useState(null); // State to hold donorId
  const [viewType, setViewType] = useState("table"); // Toggle between table and block view
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("/auth/user/details");
        if (response.data && response.data.id) {
          setDonorId(response.data.id); // Set donorId
        } else {
          alert("Failed to fetch user ID. Please log in again.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user details", error);
        navigate("/login"); // Redirect to login if session is invalid
      }
    };
    fetchUserDetails();
  }, [navigate]);

  useEffect(() => {
    if (donorId) {
      listUserDonations(donorId)
        .then((response) => {
          setDonations(response.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch your donations. Please try again later.");
          setLoading(false);
        });
    }
  }, [donorId]);

  const handleEdit = (id) => {
    navigate(`/editDonation/${id}`); // Navigate to the edit donation page
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      deleteDonation(id)
        .then(() => {
          alert("Donation deleted successfully!");
          setDonations((prevDonations) =>
            prevDonations.filter((donation) => donation.id !== id)
          );
        })
        .catch(() => {
          alert("Failed to delete donation. Please try again later.");
        });
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading your donations...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  return (
    <>
      <UserHeader />
      <div className="container mt-4">
        <h2 className="text-center">My Donations</h2>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            className="btn btn-outline-primary"
            onClick={() => setViewType(viewType === "table" ? "block" : "table")}
          >
            Switch to {viewType === "table" ? "Block View" : "Table View"}
          </button>
        </div>
        {donations.length > 0 ? (
          viewType === "table" ? (
            <table className="table table-bordered table-striped donation-table">
              <thead className="thead-dark">
                <tr>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Post Date</th>
                  <th>Receiver Id</th>
                  <th>Claim Date</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id}>
                    <td>{donation.address}</td>
                    <td>{donation.alternateContact}</td>
                    <td>{donation.postDate}</td>
                    <td>{donation.receiverId}</td>
                    <td>{donation.claimDate}</td>
                    <td>{donation.quantity}</td>
                    <td>
                      {donation.availabilityStatus ? "Available" : "Not Available"}
                    </td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm mr-2"
                        onClick={() => handleEdit(donation.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(donation.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="donation-blocks">
              {donations.map((donation) => (
                <div className="donation-card" key={donation.id}>
                  <p><strong>Address:</strong> {donation.address}</p>
                  <p><strong>Phone:</strong> {donation.alternateContact}</p>
                  <p><strong>Post Date:</strong> {donation.postDate}</p>
                  <p><strong>Receiver ID:</strong> {donation.receiverId}</p>
                  <p><strong>Claim Date:</strong> {donation.claimDate}</p>
                  <p><strong>Quantity:</strong> {donation.quantity}</p>
                  <p>
                    <strong>Status:</strong>{" "}

                    {donation.availabilityStatus ? "Available" : "Not Available"}
                  </p>
                  <div className="action-buttons">
                    <button
                      className="btn btn-warning btn-sm mr-2"
                      onClick={() => handleEdit(donation.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(donation.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center">You have not posted any donations yet.</div>
        )}
      </div>
    </>
  );
};

export default MyDonations;
