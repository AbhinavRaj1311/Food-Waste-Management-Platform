import React, { useState, useEffect } from "react";
import axios from "./api";
import RegUserSideNav from "./regUserSideNav.jsx";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTachometerAlt, FaChartPie, FaExclamationTriangle, FaClock, 
  FaUtensils, FaShoppingBasket, FaCalendarDay, FaCheckCircle,
  FaTimesCircle, FaArrowUp, FaArrowDown, FaLeaf, FaReceipt,
  FaPlus // Added missing FaPlus import
} from "react-icons/fa";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Rest of your code remains the same

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [userId, setUserId] = useState(null);
  const [shoppingData, setShoppingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardStats, setDashboardStats] = useState({
    totalItems: 0,
    foodItems: 0,
    medicineItems: 0,
    otherItems: 0,
    expiringItems: 0,
    expiredItems: 0,
    caloriesTotal: 0,
    wasteSaved: 0,
    moneySaved: 0
  });
  
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
    if (!userId) return;
    
    const fetchShoppingData = async () => {
      try {
        const response = await axios.get(`/shopping-data/user/${userId}`);
        const data = Array.isArray(response.data) ? response.data : [];
        setShoppingData(data);
        
        // Calculate dashboard statistics
        const stats = {
          totalItems: data.length,
          foodItems: data.filter(item => item.category === "Food").length,
          medicineItems: data.filter(item => item.category === "Medicine").length,
          otherItems: data.filter(item => item.category !== "Food" && item.category !== "Medicine").length,
          expiringItems: data.filter(item => item.daysRemaining <= 3 && item.daysRemaining >= 0).length,
          expiredItems: data.filter(item => item.daysRemaining < 0).length,
          caloriesTotal: data.reduce((total, item) => total + (Number(item.cal) || 0), 0),
          wasteSaved: Math.floor(data.filter(item => !item.status).length * 0.75), // Estimate waste saved
          moneySaved: Math.floor(data.reduce((total, item) => {
            // Rough estimate: $2-5 per food item saved
            if (item.category === "Food" && !item.status) {
              return total + (Math.random() * 3 + 2);
            }
            return total;
          }, 0))
        };
        
        setDashboardStats(stats);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching shopping details:", err);
        setError("Failed to fetch shopping details. Please try again later.");
        setLoading(false);
      }
    };

    fetchShoppingData();
  }, [userId]);

  // Calculate category distribution for pie chart
  const categoryData = {
    labels: ['Food', 'Medicine', 'Other'],
    datasets: [
      {
        data: [
          dashboardStats.foodItems,
          dashboardStats.medicineItems,
          dashboardStats.otherItems
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Calculate expiry status data for pie chart
  const expiryData = {
    labels: ['Available', 'Expiring Soon', 'Expired'],
    datasets: [
      {
        data: [
          dashboardStats.totalItems - dashboardStats.expiringItems - dashboardStats.expiredItems,
          dashboardStats.expiringItems,
          dashboardStats.expiredItems
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Generate dates for the last 7 days
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return dates;
  };

  // Example data for items added over time
  const itemsOverTimeData = {
    labels: getLast7Days(),
    datasets: [
      {
        label: 'Items Added',
        data: [4, 6, 2, 8, 5, 7, 3], // Example data - would be calculated from real data
        fill: false,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.4,
      },
      {
        label: 'Items Used/Expired',
        data: [1, 3, 2, 5, 3, 4, 2], // Example data - would be calculated from real data
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4,
      }
    ],
  };

  // Soon expiring items
  const soonExpiringItems = shoppingData
    .filter(item => item.daysRemaining >= 0 && item.daysRemaining <= 5)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 5);

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
              <h4>Loading dashboard...</h4>
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
              <h4>Error Loading Dashboard</h4>
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
                  <FaTachometerAlt size={30} className="text-primary me-3" />
                  <h2 className="mb-0">Dashboard</h2>
                </div>
                <div className="dashboard-tabs">
                  <button 
                    className={`btn ${activeTab === "overview" ? "btn-primary" : "btn-outline-primary"} me-2`}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                  </button>
                  <button 
                    className={`btn ${activeTab === "analytics" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setActiveTab("analytics")}
                  >
                    Analytics
                  </button>
                </div>
              </motion.div>
            </div>
            
            {/* Main Stats Cards */}
            <div className="col-12 mb-4">
              <div className="row g-3">
                {/* Total Items Card */}
                <div className="col-md-6 col-lg-3">
                  <motion.div 
                    className="card border-0 shadow-sm h-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    style={{ borderRadius: "12px" }}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="text-muted mb-1">Total Items</h6>
                          <h3 className="mb-0">{dashboardStats.totalItems}</h3>
                        </div>
                        <div className="stat-icon bg-primary bg-opacity-10 p-2 rounded">
                          <FaShoppingBasket size={24} className="text-primary" />
                        </div>
                      </div>
                      <div className="mt-3 pt-1 border-top">
                        <small className="text-success">
                          <FaArrowUp className="me-1" />
                          7% from last week
                        </small>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Food Items Card */}
                <div className="col-md-6 col-lg-3">
                  <motion.div 
                    className="card border-0 shadow-sm h-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    style={{ borderRadius: "12px" }}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="text-muted mb-1">Food Items</h6>
                          <h3 className="mb-0">{dashboardStats.foodItems}</h3>
                        </div>
                        <div className="stat-icon bg-success bg-opacity-10 p-2 rounded">
                          <FaUtensils size={24} className="text-success" />
                        </div>
                      </div>
                      <div className="mt-3 pt-1 border-top">
                        <small className="text-muted">
                          {Math.round((dashboardStats.foodItems / dashboardStats.totalItems) * 100) || 0}% of total items
                        </small>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Expiring Soon Card */}
                <div className="col-md-6 col-lg-3">
                  <motion.div 
                    className="card border-0 shadow-sm h-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    style={{ borderRadius: "12px" }}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="text-muted mb-1">Expiring Soon</h6>
                          <h3 className="mb-0">{dashboardStats.expiringItems}</h3>
                        </div>
                        <div className="stat-icon bg-warning bg-opacity-10 p-2 rounded">
                          <FaExclamationTriangle size={24} className="text-warning" />
                        </div>
                      </div>
                      <div className="mt-3 pt-1 border-top">
                        <small className="text-danger">
                          <FaClock className="me-1" />
                          Expiring within 3 days
                        </small>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Food Waste Saved Card */}
                <div className="col-md-6 col-lg-3">
                  <motion.div 
                    className="card border-0 shadow-sm h-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    style={{ borderRadius: "12px" }}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="text-muted mb-1">Waste Saved</h6>
                          <h3 className="mb-0">{dashboardStats.wasteSaved} kg</h3>
                        </div>
                        <div className="stat-icon bg-info bg-opacity-10 p-2 rounded">
                          <FaLeaf size={24} className="text-info" />
                        </div>
                      </div>
                      <div className="mt-3 pt-1 border-top">
                        <small className="text-success">
                          <FaArrowUp className="me-1" />
                          ${dashboardStats.moneySaved} money saved
                        </small>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
            
            {activeTab === "overview" ? (
              <>
                {/* Quick Info Row */}
                <div className="col-12 mb-4">
                  <div className="row g-3">
                    {/* Soon Expiring Items */}
                    <div className="col-md-6">
                      <motion.div 
                        className="card border-0 shadow-sm h-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{ borderRadius: "12px" }}
                      >
                        <div className="card-header bg-white py-3 border-bottom-0">
                          <div className="d-flex align-items-center">
                            <FaExclamationTriangle className="text-warning me-2" />
                            <h5 className="mb-0">Soon Expiring Items</h5>
                          </div>
                        </div>
                        <div className="card-body pt-0">
                          {soonExpiringItems.length === 0 ? (
                            <div className="text-center py-4">
                              <FaCheckCircle size={30} className="text-success mb-3" />
                              <h6>No items expiring soon!</h6>
                              <p className="text-muted">All your items are good for a while.</p>
                            </div>
                          ) : (
                            <div className="table-responsive">
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th>Item</th>
                                    <th>Expires In</th>
                                    <th>Category</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <AnimatePresence>
                                    {soonExpiringItems.map((item, index) => (
                                      <motion.tr 
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                      >
                                        <td>{item.itemName}</td>
                                        <td>
                                          <span className={
                                            item.daysRemaining === 0 ? "badge bg-danger" : 
                                            item.daysRemaining <= 2 ? "badge bg-warning text-dark" : 
                                            "badge bg-success"
                                          }>
                                            {item.daysRemaining === 0 ? "Today!" : `${item.daysRemaining} days`}
                                          </span>
                                        </td>
                                        <td>{item.category}</td>
                                      </motion.tr>
                                    ))}
                                  </AnimatePresence>
                                </tbody>
                              </table>
                            </div>
                          )}
                          <div className="text-center mt-3">
                            <button 
                              className="btn btn-sm btn-outline-primary" 
                              onClick={() => navigate('/shopping-details')}
                            >
                              View All Items
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="col-md-6">
                      <motion.div 
                        className="card border-0 shadow-sm h-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        style={{ borderRadius: "12px" }}
                      >
                        <div className="card-header bg-white py-3 border-bottom-0">
                          <div className="d-flex align-items-center">
                            <FaReceipt className="text-primary me-2" />
                            <h5 className="mb-0">Quick Actions</h5>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-6">
                              <motion.div 
                                className="action-card p-4 text-center bg-light rounded h-100"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate('/additems')}
                              >
                                <FaPlus size={24} className="text-success mb-3" />
                                <h6>Add New Item</h6>
                              </motion.div>
                            </div>
                            <div className="col-6">
                              <motion.div 
                                className="action-card p-4 text-center bg-light rounded h-100"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate('/make-recipes')}
                              >
                                <FaUtensils size={24} className="text-primary mb-3" />
                                <h6>Generate Recipe</h6>
                              </motion.div>
                            </div>
                            <div className="col-6">
                              <motion.div 
                                className="action-card p-4 text-center bg-light rounded h-100"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate('/shopping')}
                              >
                                <FaShoppingBasket size={24} className="text-info mb-3" />
                                <h6>View All Items</h6>
                              </motion.div>
                            </div>
                            <div className="col-6">
                              <motion.div 
                                className="action-card p-4 text-center bg-light rounded h-100"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate('/profile')}
                              >
                                <FaCalendarDay size={24} className="text-warning mb-3" />
                                <h6>Plan Weekly Menu</h6>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                {/* Charts Row */}
                <div className="col-12 mb-4">
                  <div className="row g-3">
                    {/* Items Distribution Chart */}
                    <div className="col-md-6">
                      <motion.div 
                        className="card border-0 shadow-sm h-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        style={{ borderRadius: "12px" }}
                      >
                        <div className="card-header bg-white py-3">
                          <div className="d-flex align-items-center">
                            <FaChartPie className="text-primary me-2" />
                            <h5 className="mb-0">Items by Category</h5>
                          </div>
                        </div>
                        <div className="card-body">
                          <div style={{ height: "260px", display: "flex", justifyContent: "center" }}>
                            <Doughnut 
                              data={categoryData} 
                              options={{ 
                                maintainAspectRatio: false,
                                plugins: {
                                  legend: {
                                    position: 'bottom',
                                    labels: {
                                      usePointStyle: true,
                                      padding: 15
                                    }
                                  }
                                }
                              }} 
                            />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Items Status Chart */}
                    <div className="col-md-6">
                      <motion.div 
                        className="card border-0 shadow-sm h-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        style={{ borderRadius: "12px" }}
                      >
                        <div className="card-header bg-white py-3">
                          <div className="d-flex align-items-center">
                            <FaChartPie className="text-primary me-2" />
                            <h5 className="mb-0">Items by Status</h5>
                          </div>
                        </div>
                        <div className="card-body">
                          <div style={{ height: "260px", display: "flex", justifyContent: "center" }}>
                            <Doughnut 
                              data={expiryData} 
                              options={{ 
                                maintainAspectRatio: false,
                                plugins: {
                                  legend: {
                                    position: 'bottom',
                                    labels: {
                                      usePointStyle: true,
                                      padding: 15
                                    }
                                  }
                                }
                              }} 
                            />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Analytics Tab */}
                <div className="col-12 mb-4">
                  <motion.div 
                    className="card border-0 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ borderRadius: "12px" }}
                  >
                    <div className="card-header bg-white py-3">
                      <div className="d-flex align-items-center">
                        <FaChartPie className="text-primary me-2" />
                        <h5 className="mb-0">Item Tracking (Last 7 Days)</h5>
                      </div>
                    </div>
                    <div className="card-body">
                      <div style={{ height: "300px" }}>
                        <Line 
                          data={itemsOverTimeData} 
                          options={{ 
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                ticks: {
                                  stepSize: 1
                                }
                              }
                            },
                            plugins: {
                              legend: {
                                position: 'top',
                              }
                            }
                          }} 
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* More Analytics Cards */}
                <div className="col-12 mb-4">
                  <div className="row g-3">
                    {/* Category Distribution */}
                    <div className="col-md-6">
                      <motion.div 
                        className="card border-0 shadow-sm h-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{ borderRadius: "12px" }}
                      >
                        <div className="card-header bg-white py-3">
                          <div className="d-flex align-items-center">
                            <FaChartPie className="text-primary me-2" />
                            <h5 className="mb-0">Calories Distribution</h5>
                          </div>
                        </div>
                        <div className="card-body">
                          <div style={{ height: "260px" }}>
                            <Bar 
                              data={{
                                labels: ['Proteins', 'Carbs', 'Vegetables', 'Fruits', 'Dairy'],
                                datasets: [
                                  {
                                    label: 'Calories (kcal)',
                                    data: [300, 450, 200, 250, 180], // Example data - would be calculated from real data
                                    backgroundColor: [
                                      'rgba(255, 99, 132, 0.7)',
                                      'rgba(54, 162, 235, 0.7)',
                                      'rgba(75, 192, 192, 0.7)',
                                      'rgba(255, 206, 86, 0.7)',
                                      'rgba(153, 102, 255, 0.7)',
                                    ],
                                  },
                                ],
                              }} 
                              options={{ 
                                maintainAspectRatio: false,
                                scales: {
                                  y: {
                                    beginAtZero: true
                                  }
                                }
                              }} 
                            />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Food Waste Statistics */}
                    <div className="col-md-6">
                      <motion.div 
                        className="card border-0 shadow-sm h-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        style={{ borderRadius: "12px" }}
                      >
                        <div className="card-header bg-white py-3">
                          <div className="d-flex align-items-center">
                            <FaLeaf className="text-success me-2" />
                            <h5 className="mb-0">Sustainability Impact</h5>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-sm-6">
                              <div className="p-3 rounded bg-light text-center h-100">
                                <h3 className="text-success">{dashboardStats.wasteSaved} kg</h3>
                                <p className="mb-0">Food waste saved</p>
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <div className="p-3 rounded bg-light text-center h-100">
                                <h3 className="text-primary">${dashboardStats.moneySaved}</h3>
                                <p className="mb-0">Money saved</p>
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <div className="p-3 rounded bg-light text-center h-100">
                                <h3 className="text-info">{Math.round(dashboardStats.wasteSaved * 2.5)} kg</h3>
                                <p className="mb-0">CO₂ emissions reduced</p>
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <div className="p-3 rounded bg-light text-center h-100">
                                <h3 className="text-warning">{Math.round(dashboardStats.wasteSaved * 1000)} L</h3>
                                <p className="mb-0">Water saved</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Tips and Recommendations */}
            <div className="col-12">
              <motion.div 
                className="card border-0 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                style={{ 
                  borderRadius: "12px", 
                  background: "linear-gradient(45deg, rgba(41,128,185,0.1), rgba(46,204,113,0.1))" 
                }}
              >
                <div className="card-body p-4">
                  <h5><FaLeaf className="text-success me-2" /> Tips to Reduce Food Waste</h5>
                  <div className="row mt-3">
                    <div className="col-md-4 mb-3 mb-md-0">
                      <div className="d-flex">
                        <div className="bg-white rounded-circle p-2 me-3" style={{ height: "40px", width: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span className="text-primary">1</span>
                        </div>
                        <div>
                          <h6 className="mb-1">Plan Your Meals</h6>
                          <p className="mb-0 small text-muted">Create weekly menus based on what you have.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3 mb-md-0">
                      <div className="d-flex">
                        <div className="bg-white rounded-circle p-2 me-3" style={{ height: "40px", width: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span className="text-primary">2</span>
                        </div>
                        <div>
                          <h6 className="mb-1">Store Properly</h6>
                          <p className="mb-0 small text-muted">Learn the best way to store each food item.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex">
                        <div className="bg-white rounded-circle p-2 me-3" style={{ height: "40px", width: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span className="text-primary">3</span>
                        </div>
                        <div>
                          <h6 className="mb-1">Use the FIFO Method</h6>
                          <p className="mb-0 small text-muted">First in, first out - use oldest items first.</p>
                        </div>
                      </div>
                    </div>
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

export default Dashboard;