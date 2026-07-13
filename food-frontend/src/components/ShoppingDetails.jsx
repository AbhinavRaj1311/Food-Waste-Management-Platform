import React, { useEffect, useState } from "react";
import axios from "./api";
import RegUserSideNav from "./regUserSideNav.jsx";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingBasket, FaPlus, FaSearch, FaSort, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

const ShoppingDetails = () => {
  const [shoppingData, setShoppingData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const navigate = useNavigate();

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("/auth/user/details");
        if (response.data && response.data.id) {
          setUserId(response.data.id);
        } else {
          setError("Failed to fetch user ID. Please log in again.");
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error) {
        console.error("Failed to fetch user details", error);
        setError("Authentication error. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
      }
    };
    fetchUserDetails();
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`/shopping-data/user/${userId}`)
        .then((response) => {
          setShoppingData(response.data || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching shopping details:", err);
          setError("Failed to fetch shopping details. Please try again later.");
          setLoading(false);
        });
    }
  }, [userId]);

  // Sort function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort data
  const getFilteredAndSortedData = () => {
    // First filter by search term
    let filteredData = shoppingData.filter(item => 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Then filter by category
    if (filterCategory !== "All") {
      filteredData = filteredData.filter(item => item.category === filterCategory);
    }
    
    // Then sort
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredData;
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };

  // Categories in the data
  const categories = ["All", ...new Set(shoppingData.map(item => item.category))];

  // Handle "Add New Item" button click
  const handleAddNewItem = () => {
    navigate("/additems");
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="sidebar">
          <RegUserSideNav onToggleSidebar={handleSidebarToggle} />
        </div>
        <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", background: "#f8f9fa" }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h4>Loading shopping items...</h4>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="sidebar">
          <RegUserSideNav onToggleSidebar={handleSidebarToggle} />
        </div>
        <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="container mt-4">
            <motion.div 
              className="alert alert-danger mt-5 p-4 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FaTimesCircle size={40} className="mb-3" />
              <h4>Error Loading Data</h4>
              <p>{error}</p>
              <button className="btn btn-outline-danger mt-2" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="sidebar">
        <RegUserSideNav onToggleSidebar={handleSidebarToggle} />
      </div>
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="container-fluid py-4 px-4" style={{ background: "linear-gradient(180deg, #f8f9fa, #ffffff)" }}>
          <motion.div 
            className="row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="col-12 mb-4">
              <motion.div
                className="d-flex flex-column flex-md-row justify-content-between align-items-center"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="d-flex align-items-center mb-3 mb-md-0">
                  <FaShoppingBasket size={30} className="text-primary me-3" />
                  <h2 className="mb-0">Shopping List</h2>
                </div>
                <motion.button
                  className="btn btn-success"
                  onClick={handleAddNewItem}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlus className="me-2" /> Add New Item
                </motion.button>
              </motion.div>
            </div>

            <div className="col-12">
              <motion.div 
                className="card border-0 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                style={{ borderRadius: "12px", overflow: "hidden" }}
              >
                <div className="card-header bg-white py-3">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                          <FaSearch className="text-muted" />
                        </span>
                        <input
                          type="text"
                          className="form-control border-0 bg-light"
                          placeholder="Search items..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <select
                        className="form-select bg-light border-0"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 text-md-end">
                      <span className="badge bg-primary p-2 me-2">
                        Total Items: {getFilteredAndSortedData().length}
                      </span>
                      <span className="badge bg-danger p-2">
                        Expiring Soon: {getFilteredAndSortedData().filter(item => item.daysRemaining <= 3 && item.daysRemaining >= 0).length}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th onClick={() => requestSort('itemName')} style={{cursor: 'pointer'}}>
                            Item Name {getSortIndicator('itemName')}
                          </th>
                          <th onClick={() => requestSort('itemQuantity')} style={{cursor: 'pointer'}}>
                            Quantity {getSortIndicator('itemQuantity')}
                          </th>
                          <th onClick={() => requestSort('purchaseDate')} style={{cursor: 'pointer'}}>
                            Purchase Date {getSortIndicator('purchaseDate')}
                          </th>
                          <th onClick={() => requestSort('expiryDate')} style={{cursor: 'pointer'}}>
                            Expiry Date {getSortIndicator('expiryDate')}
                          </th>
                          <th onClick={() => requestSort('daysRemaining')} style={{cursor: 'pointer'}}>
                            Days Remaining {getSortIndicator('daysRemaining')}
                          </th>
                          <th onClick={() => requestSort('status')} style={{cursor: 'pointer'}}>
                            Status {getSortIndicator('status')}
                          </th>
                          <th onClick={() => requestSort('category')} style={{cursor: 'pointer'}}>
                            Category {getSortIndicator('category')}
                          </th>
                          <th onClick={() => requestSort('cal')} style={{cursor: 'pointer'}}>
                            Calories {getSortIndicator('cal')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {getFilteredAndSortedData().length > 0 ? (
                            getFilteredAndSortedData().map((data) => (
                              <motion.tr
                                key={data.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ backgroundColor: "#f8f9fa" }}
                                style={{
                                  backgroundColor: data.daysRemaining <= 3 && data.daysRemaining >= 0 ? 'rgba(255,193,7,0.1)' : 
                                                 data.daysRemaining < 0 ? 'rgba(220,53,69,0.1)' : 'inherit'
                                }}
                              >
                                <td>{data.itemName}</td>
                                <td>{data.itemQuantity}</td>
                                <td>{new Date(data.purchaseDate).toLocaleDateString()}</td>
                                <td>{new Date(data.expiryDate).toLocaleDateString()}</td>
                                <td>
                                  {data.daysRemaining < 0 ? (
                                    <span className="badge bg-danger">Expired</span>
                                  ) : data.daysRemaining <= 3 ? (
                                    <span className="badge bg-warning text-dark">
                                      <FaExclamationTriangle className="me-1" /> {data.daysRemaining} days
                                    </span>
                                  ) : (
                                    <span className="badge bg-success">{data.daysRemaining} days</span>
                                  )}
                                </td>
                                <td>
                                  {data.status ? (
                                    <span className="badge bg-danger">Expired</span>
                                  ) : (
                                    <span className="badge bg-success">Available</span>
                                  )}
                                </td>
                                <td>
                                  <span className={`badge ${
                                    data.category === 'Food' ? 'bg-primary' : 
                                    data.category === 'Medicine' ? 'bg-info' : 'bg-secondary'
                                  }`}>
                                    {data.category}
                                  </span>
                                </td>
                                <td>{data.cal || 'N/A'}</td>
                              </motion.tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="text-center py-4">
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <p className="mb-2 text-muted">No items found</p>
                                  {searchTerm || filterCategory !== "All" ? (
                                    <button 
                                      className="btn btn-sm btn-outline-secondary"
                                      onClick={() => {
                                        setSearchTerm('');
                                        setFilterCategory('All');
                                      }}
                                    >
                                      Clear filters
                                    </button>
                                  ) : (
                                    <button 
                                      className="btn btn-sm btn-primary"
                                      onClick={handleAddNewItem}
                                    >
                                      <FaPlus className="me-1" /> Add your first item
                                    </button>
                                  )}
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingDetails;