import React, { useEffect, useState } from "react";
import axios from "./api";
import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from "./AdminHeader";

const EditDonation = () => {
  const [donation, setDonation] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const response = await axios.get(`/donations/${id}`);
        setDonation(response.data);
      } catch (error) {
        console.error("Failed to fetch donation details", error);
        alert("Error fetching donation details.");
        navigate("/admin-donations"); // Redirect to donations list if error occurs
      }
    };

    fetchDonation();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDonation({
      ...donation,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`/donations/${id}`, donation) // PUT request to update donation
      .then(() => {
        alert("Donation updated successfully!");
        navigate("/admin-donations"); // Redirect back to donation list
      })
      .catch((error) => {
        alert("Error updating donation!");
        console.error(error);
      });
  };

  if (!donation) {
    return <p>Loading...</p>;
  }

  return (
    <>
    <AdminHeader/>

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
            readOnly
            />
        </div>
        <div className="form-group">
          <label>Receiver ID:</label>
          <input
            type="number"
            name="receiverId"
            className="form-control"
            value={donation.receiverId || ""}
            onChange={handleChange}
            />
        </div>
        <div className="form-group">
          <label>Claim Date:</label>
          <input
            type="date"
            name="claimDate"
            className="form-control"
            value={donation.claimDate || ""}
            onChange={handleChange}
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
