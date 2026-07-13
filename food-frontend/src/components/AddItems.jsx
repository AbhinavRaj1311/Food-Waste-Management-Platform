import React, { useEffect, useState } from "react";
import axios from "./api";
import RegUserSideNav from "./regUserSideNav.jsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPlus, FaShoppingBasket, FaCalendarAlt, FaBox, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const AddItems = () => {
    const [userId, setUserId] = useState(null);
    const [newShoppingData, setNewShoppingData] = useState({
        itemName: "",
        itemQuantity: "",
        purchaseDate: new Date().toISOString().split('T')[0], // Default to today
        expiryDate: "",
        status: false,
        category: "",
        cal: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
                    setLoading(false);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewShoppingData({ ...newShoppingData, [name]: value });
        setSuccess(false); // Clear success message when form is edited
    };

    const handlePostShoppingData = async () => {
        // Form validation
        if (!newShoppingData.itemName || !newShoppingData.itemQuantity || 
            !newShoppingData.expiryDate || !newShoppingData.category) {
            setError("Please fill in all required fields.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            // Calculate daysRemaining as the difference between expiryDate and the current date
            const expiryDate = new Date(newShoppingData.expiryDate);
            const currentDate = new Date();
            const timeDifference = expiryDate - currentDate;
            const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

            // Determine status based on days remaining
            const status = daysRemaining < 0;

            // Update the newShoppingData object with the calculated daysRemaining
            const updatedShoppingData = { 
                ...newShoppingData, 
                daysRemaining,
                status,
                userId 
            };

            await axios.post("/shopping-data", updatedShoppingData);
            
            setSuccess(true);
            setNewShoppingData({
                itemName: "",
                itemQuantity: "",
                purchaseDate: new Date().toISOString().split('T')[0], // Default to today
                expiryDate: "",
                status: false,
                category: "",
                cal: "",
            });

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(false);
            }, 3000);

        } catch (err) {
            console.error("Error posting shopping data:", err);
            setError("Failed to add item. Please try again later.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewItems = () => {
        navigate('/shopping');
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
                            <h4>Loading...</h4>
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !userId) {
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
                            <h4>Authentication Error</h4>
                            <p>{error}</p>
                            <button className="btn btn-outline-danger mt-2" onClick={() => navigate("/login")}>
                                Go to Login
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
                                    <FaPlus size={30} className="text-success me-3" />
                                    <h2 className="mb-0">Add New Item</h2>
                                </div>
                                <motion.button
                                    className="btn btn-primary"
                                    onClick={handleViewItems}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaShoppingBasket className="me-2" /> View All Items
                                </motion.button>
                            </motion.div>
                        </div>

                        <div className="col-lg-7">
                            <motion.div 
                                className="card border-0 shadow-sm"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7 }}
                                style={{ borderRadius: "12px" }}
                            >
                                <div className="card-header bg-success text-white" style={{ borderRadius: "12px 12px 0 0" }}>
                                    <h5 className="mb-0">Item Details</h5>
                                </div>
                                <div className="card-body">
                                    {error && (
                                        <motion.div 
                                            className="alert alert-danger"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="d-flex align-items-center">
                                                <FaTimesCircle className="me-2" />
                                                {error}
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {success && (
                                        <motion.div 
                                            className="alert alert-success"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="d-flex align-items-center">
                                                <FaCheckCircle className="me-2" />
                                                Item added successfully!
                                            </div>
                                        </motion.div>
                                    )}

                                    <form>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Item Name <span className="text-danger">*</span></label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <FaBox />
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="itemName"
                                                        value={newShoppingData.itemName}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter item name"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Quantity <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="itemQuantity"
                                                    value={newShoppingData.itemQuantity}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g. 2 kg, 500g, 3 pcs"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Purchase Date</label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <FaCalendarAlt />
                                                    </span>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="purchaseDate"
                                                        value={newShoppingData.purchaseDate}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Expiry Date <span className="text-danger">*</span></label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <FaCalendarAlt />
                                                    </span>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="expiryDate"
                                                        value={newShoppingData.expiryDate}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Category <span className="text-danger">*</span></label>
                                                <select
                                                    className="form-select"
                                                    name="category"
                                                    value={newShoppingData.category}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="">Select Category</option>
                                                    <option value="Food">Food</option>
                                                    <option value="Medicine">Medicine</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Calories (if applicable)</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="cal"
                                                    value={newShoppingData.cal}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter calories"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="d-grid mt-4">
                                            <motion.button
                                                type="button"
                                                className="btn btn-success btn-lg"
                                                onClick={handlePostShoppingData}
                                                disabled={submitting}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                style={{ 
                                                    backgroundImage: "linear-gradient(90deg, #28a745, #20c997)",
                                                    border: "none",
                                                    borderRadius: "8px",
                                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                                                }}
                                            >
                                                {submitting ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Adding Item...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaPlus className="me-2" /> Add Item
                                                    </>
                                                )}
                                            </motion.button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                        
                        <div className="col-lg-5">
                            <motion.div 
                                className="card border-0 shadow-sm"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                style={{ borderRadius: "12px" }}
                            >
                                <div className="card-header bg-primary text-white" style={{ borderRadius: "12px 12px 0 0" }}>
                                    <h5 className="mb-0">Tips & Information</h5>
                                </div>
                                <div className="card-body">
                                    <h6>How to Add Items:</h6>
                                    <ul className="mb-4">
                                        <li className="mb-2">Enter all required fields marked with <span className="text-danger">*</span></li>
                                        <li className="mb-2">For quantity, specify both amount and unit (e.g., "2 kg", "3 pcs")</li>
                                        <li className="mb-2">Select the appropriate category to organize your items</li>
                                        <li className="mb-2">Calories field is optional and primarily useful for food items</li>
                                    </ul>
                                    
                                    <h6>Food Storage Tips:</h6>
                                    <p className="mb-2">• Store fruits and vegetables separately</p>
                                    <p className="mb-2">• Keep dairy products in the coldest part of your refrigerator</p>
                                    <p className="mb-2">• Freeze meat that won't be used within 2 days</p>
                                    <p className="mb-2">• Store grains and pasta in airtight containers</p>
                                    
                                    <div className="alert alert-info mt-4">
                                        <small>
                                            <strong>Note:</strong> Items with less than 3 days remaining until expiration 
                                            will be highlighted in your shopping list to help you prioritize their use.
                                        </small>
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

export default AddItems;