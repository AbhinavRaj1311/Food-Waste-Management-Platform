import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBars, FaTimes, FaHome, FaUtensils, FaShoppingBasket, FaUserAlt, FaSignOutAlt } from "react-icons/fa";
import "./regUserSideNav.css"; // Create this CSS file for additional styling

const RegUserSideNav = ({ onToggleSidebar }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const location = useLocation();

    const toggleSidebar = () => {
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState);
        
        // Notify parent component about sidebar state change
        if (onToggleSidebar) {
            onToggleSidebar(!newExpandedState);
        }
    };

    // Check window width on mount and when resized
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768 && isExpanded) {
                setIsExpanded(false);
                if (onToggleSidebar) {
                    onToggleSidebar(true);
                }
            }
        };
        
        // Set initial state based on window size
        handleResize();
        
        // Add event listener
        window.addEventListener('resize', handleResize);
        
        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, [isExpanded, onToggleSidebar]);

    const isActive = (path) => location.pathname === path;

    return (
        <motion.div
            className="sidebar-wrapper"
            animate={{ width: isExpanded ? 250 : 70 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <div className="sidebar-header">
                <motion.button 
                    onClick={toggleSidebar} 
                    className="toggle-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {isExpanded ? <FaTimes /> : <FaBars />}
                </motion.button>
                {isExpanded && (
                    <motion.h4 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-0"
                    >
                        Menu
                    </motion.h4>
                )}
            </div>
            
            <div className="sidebar-menu">
                <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
                    <div className="icon-container">
                        <FaUserAlt />
                    </div>
                    {isExpanded && (
                        <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Profile
                        </motion.span>
                    )}
                </Link>
                
                <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
                    <div className="icon-container">
                        <FaHome />
                    </div>
                    {isExpanded && (
                        <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Dashboard
                        </motion.span>
                    )}
                </Link>
                
                <Link to="/shopping-details" className={`nav-item ${isActive('/shopping-details') ? 'active' : ''}`}>
                    <div className="icon-container">
                        <FaShoppingBasket />
                    </div>
                    {isExpanded && (
                        <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Shopping List
                        </motion.span>
                    )}
                </Link>
                
                <Link to="/make-recipes" className={`nav-item ${isActive('/make-recipes') ? 'active' : ''}`}>
                    <div className="icon-container">
                        <FaUtensils />
                    </div>
                    {isExpanded && (
                        <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Recipes
                        </motion.span>
                    )}
                </Link>
                
                <Link to="/logout" className="nav-item mt-auto">
                    <div className="icon-container text-danger">
                        <FaSignOutAlt />
                    </div>
                    {isExpanded && (
                        <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-danger"
                        >
                            Logout
                        </motion.span>
                    )}
                </Link>
            </div>
        </motion.div>
    );
};

export default RegUserSideNav;