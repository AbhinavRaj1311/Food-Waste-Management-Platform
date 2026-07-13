import React, { useEffect, useState } from 'react';
import { listDonations } from '../services/DonationService';
import { useNavigate } from 'react-router-dom';
import axios from './api'; // Use the centralized axios instance
import UserHeader from './UserHeader';
import './ListFoodDonations.css'; // Custom CSS for animations

const ListFoodDonations = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('/auth/user/details');
        setUserDetails(response.data);
      } catch (error) {
        console.error('Failed to fetch user details', error);
        navigate('/login'); // Redirect to login if session is invalid
      }
    };
    fetchUserDetails();
  }, [navigate]);

  useEffect(() => {
    listDonations()
      .then((response) => {
        setDonations(response.data);
        setFilteredDonations(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to fetch donations. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const filtered = donations.filter(
      (donation) =>
        donation.donorId?.toString().toLowerCase().includes(query) ||
        donation.address?.toLowerCase().includes(query)
    );
    setFilteredDonations(filtered);
  };

  const claimDonation = async (donation) => {
    if (!userDetails) {
      alert('Please log in to claim a donation.');
      return;
    }
    const updatedDonation = {
      ...donation,
      receiverId: userDetails.id,
      claimDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      availabilityStatus: false, // Mark as claimed
    };
    try {
      await axios.put(`/donations/${donation.id}`, updatedDonation);
      alert('Donation claimed successfully!');
      setFilteredDonations((prev) =>
        prev.map((d) => (d.id === donation.id ? updatedDonation : d))
      );
    } catch (error) {
      console.error('Failed to claim donation', error);
      alert('Failed to claim donation. Please try again later.');
    }
  };

  const unclaimDonation = async (donation) => {
    if (!userDetails) {
      alert('Please log in to unclaim a donation.');
      return;
    }
    const updatedDonation = {
      ...donation,
      receiverId: null,
      claimDate: null,
      availabilityStatus: true, // Mark as unclaimed
    };
    try {
      await axios.put(`/donations/${donation.id}`, updatedDonation);
      alert('Donation unclaimed successfully!');
      setFilteredDonations((prev) =>
        prev.map((d) => (d.id === donation.id ? updatedDonation : d))
      );
    } catch (error) {
      console.error('Failed to unclaim donation', error);
      alert('Failed to unclaim donation. Please try again later.');
    }
  };

  const addDonations = () => {
    navigate('/addDonations');
  };

  if (loading) {
    return <div className="text-center mt-5">Loading donations...</div>;
  }
  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  return (
    <>
      <UserHeader />
      <div className="container mt-4">
        <h2 className="text-center">List of Food Donations</h2>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button type="button" className="btn btn-primary" onClick={addDonations}>
            Post Donation
          </button>
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by Donor ID or Address"
            value={search}
            onChange={handleSearch}
          />
          <button
            className="btn btn-secondary"
            onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
          >
            {viewMode === 'table' ? 'Card View' : 'Table View'}
          </button>
        </div>
        {viewMode === 'table' ? (
          <table className="table table-bordered table-striped fade-in">
            <thead className="thead-dark">
              <tr>
                <th>DONOR ID</th>
                <th>Address</th>
                <th>Phone</th>
                <th>POST DATE</th>
                <th>Receiver ID</th>
                <th>Claim Date</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.map((donation) => (
                <tr key={donation.id}>
                  <td>{donation.donorId}</td>
                  <td>{donation.address}</td>
                  <td>{donation.alternateContact}</td>
                  <td>{donation.postDate}</td>
                  <td>{donation.receiverId}</td>
                  <td>{donation.claimDate}</td>
                  <td>{donation.quantity}</td>
                  <td>{donation.availabilityStatus ? 'Available' : 'Not Available'}</td>
                  <td>
                    {donation.availabilityStatus ? (
                      <button className="btn btn-success" onClick={() => claimDonation(donation)}>
                        Claim
                      </button>
                    ) : donation.receiverId === userDetails?.id ? (
                      <button className="btn btn-warning" onClick={() => unclaimDonation(donation)}>
                        Unclaim
                      </button>
                    ) : (
                      <span className="text-muted">Claimed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="card-columns fade-in">
            {filteredDonations.map((donation) => (
              <div className="card" key={donation.id}>
                <div className="card-body">
                  <h5 className="card-title">Donor ID: {donation.donorId}</h5>
                  <p className="card-text">Address: {donation.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ListFoodDonations;
