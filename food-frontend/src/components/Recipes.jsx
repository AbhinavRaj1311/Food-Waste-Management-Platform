import React, { useEffect, useState } from "react";
import baseAxios from "./api";
import axios from 'axios';
import RegUserSideNav from "./regUserSideNav.jsx";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUtensils, FaListUl, FaCheck, FaTimesCircle } from "react-icons/fa";
import "./Recipes.css"; // Make sure to include this CSS file

const Recipes = () => {
    const [shoppingData, setShoppingData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [recipe, setRecipe] = useState("");
    const [loadingShoppingData, setLoadingShoppingData] = useState(true);
    const [errorShoppingData, setErrorShoppingData] = useState("");
    const [userId, setUserId] = useState(null);
    const [ingredientError, setIngredientError] = useState(false);
    const [recipeLoading, setRecipeLoading] = useState(false);
    const [recipeError, setRecipeError] = useState("");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const navigate = useNavigate();
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    // Fetch user details
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await baseAxios.get("/auth/user/details");
                if (response.data && response.data.id) {
                    setUserId(response.data.id);
                } else {
                    alert("Failed to fetch user ID. Please log in again.");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Failed to fetch user details", error);
                if (error.response && error.response.status === 401) {
                    alert("Session expired or invalid. Please log in again.");
                    navigate("/login");
                } else {
                    setErrorShoppingData("Failed to fetch user details. Please try refreshing or log in again.");
                }
            }
        };
        fetchUserDetails();
    }, [navigate]);

    // Fetch shopping data
    useEffect(() => {
        if (!userId) return;
        setLoadingShoppingData(true);
        baseAxios
            .get(`/shopping-data/user/${userId}`)
            .then((response) => {
                const data = Array.isArray(response.data) ? response.data : [];
                setShoppingData(data);
                setLoadingShoppingData(false);
            })
            .catch((err) => {
                console.error("Error fetching shopping details:", err);
                setErrorShoppingData("Failed to fetch shopping details.");
                setShoppingData([]);
                setLoadingShoppingData(false);
            });
    }, [userId]);

    // Handle sidebar toggle event from RegUserSideNav
    const handleSidebarToggle = (collapsed) => {
        setSidebarCollapsed(collapsed);
    };

    // FIXED: Updated handleCheckboxChange function to fix selection issues
    const handleCheckboxChange = (item, event) => {
        // If this is triggered from a checkbox click, stop propagation to prevent double-toggling
        if (event) {
            event.stopPropagation();
        }
        
        console.log("Toggling item:", item);
        
        setSelectedItems((prev) => {
            const isSelected = prev.includes(item);
            const newItems = isSelected
                ? prev.filter((i) => i !== item)
                : [...prev, item];
                
            console.log("Selected before:", isSelected, "Selected after:", !isSelected);
            return newItems;
        });
        
        setIngredientError(false);
        setRecipeError("");
    };

    const generateRecipe = async () => {
        // API Key check
        if (!GEMINI_API_KEY) {
            setRecipeError("Gemini API key is missing. Please configure VITE_GEMINI_API_KEY in your .env file.");
            setRecipe("");
            setIngredientError(false);
            return;
        }

        // Ingredient check
        if (selectedItems.length === 0) {
            setIngredientError(true);
            setRecipeError("");
            setRecipe("");
            return;
        }

        // Set loading states
        setIngredientError(false);
        setRecipeLoading(true);
        setRecipeError("");
        setRecipe("");

        // Construct prompt
        const promptText = `Create a recipe using these ingredients: ${selectedItems.join(", ")}. Provide a title for the recipe, a list of ingredients (including estimated quantities if possible based on common usage), and detailed step-by-step cooking instructions. Format the output clearly with headings for title, ingredients, and instructions. make something indian`;

        // Define API endpoint and payload
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        const payload = {
            contents: [
                {
                    parts: [
                        {
                            text: promptText,
                        },
                    ],
                },
            ],
        };

        // Make API call
        try {
            const response = await axios.post(apiUrl, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Process response
            const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (generatedText) {
                // Format recipe with HTML for better styling
                const formattedRecipe = generatedText
                    .replace(/\n\n/g, '<br/><br/>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
                    .replace(/# (.*?)$/gm, '<h3 class="recipe-title">$1</h3>') // Main title
                    .replace(/## (.*?)$/gm, '<h4 class="recipe-section">$1</h4>') // Section titles
                    .replace(/^\d+\.\s(.*?)$/gm, '<p class="recipe-step"><span class="step-number">•</span> $1</p>'); // Steps
                
                setRecipe(formattedRecipe);
            } else {
                console.error("Unexpected response structure:", response.data);
                setRecipeError("Received an unexpected or empty response from the recipe generator.");
                setRecipe("");
            }
        } catch (error) {
            console.error("Error generating recipe:", error);
            let errorMessage = "Failed to generate a recipe. Please try again.";
            if (error.response) {
                console.error("Error response data:", error.response.data);
                console.error("Error response status:", error.response.status);
                errorMessage += ` (Server Error: ${error.response.status})`;
                if (error.response.status === 400 && error.response.data?.error?.message) {
                    errorMessage = `API Error: ${error.response.data.error.message}`;
                } else if (error.response.status === 401 || error.response.status === 403) {
                    errorMessage += ". Check if your API key is correct and enabled.";
                } else if (error.response.status === 429) {
                    errorMessage += ". You may have exceeded your API quota.";
                } else if (error.response.data?.error?.message) {
                    errorMessage = `API Error (${error.response.status}): ${error.response.data.error.message}`;
                }
            } else if (error.request) {
                errorMessage = "Could not connect to the recipe generation service. Check your internet connection.";
            } else {
                errorMessage = `An error occurred: ${error.message}`;
            }
            setRecipeError(errorMessage);
            setRecipe("");
        } finally {
            setRecipeLoading(false);
        }
    };

    // Loading and error states
    if (loadingShoppingData) {
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
                            <h4>Loading ingredients...</h4>
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    // Display shopping data error
    if (errorShoppingData) {
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
                            <p>{errorShoppingData}</p>
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
                                className="d-flex align-items-center"
                                initial={{ y: -20 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <FaUtensils size={30} className="text-primary me-3" />
                                <h2 className="mb-0">Create Your Recipe</h2>
                            </motion.div>
                            <p className="text-muted mt-2">
                                Select ingredients from your inventory to generate a personalized recipe.
                            </p>
                        </div>

                        {/* Ingredients Selection Card */}
                        <div className="col-lg-6 mb-4">
                            <motion.div 
                                className="card border-0 shadow-sm"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7 }}
                                style={{ borderRadius: "12px" }}
                            >
                                <div className="card-header bg-primary text-white" style={{ borderRadius: "12px 12px 0 0" }}>
                                    <div className="d-flex align-items-center">
                                        <FaListUl className="me-2" />
                                        <h5 className="mb-0">Available Ingredients</h5>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th style={{ width: '5%' }}>Select</th>
                                                    <th>Item Name</th>
                                                    <th>Quantity</th>
                                                    <th>Calories</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* FIXED: Updated table rows implementation for better selection handling */}
                                                {(shoppingData || [])
                                                    .filter((data) => data.category === "Food")
                                                    .map((data) => (
                                                        <motion.tr 
                                                            key={data.id}
                                                            whileHover={{ backgroundColor: "#f8f9fa" }}
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleCheckboxChange(data.itemName)}
                                                        >
                                                            <td onClick={(e) => e.stopPropagation()}>
                                                                <div className="form-check d-flex justify-content-center">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={`checkbox-${data.id}`}
                                                                        checked={selectedItems.includes(data.itemName)}
                                                                        onChange={(e) => handleCheckboxChange(data.itemName, e)}
                                                                        style={{ cursor: "pointer" }}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>{data.itemName}</td>
                                                            <td>{data.itemQuantity}</td>
                                                            <td>{data.cal || 'N/A'}</td>
                                                        </motion.tr>
                                                    ))}
                                                {shoppingData.filter((data) => data.category === "Food").length === 0 && (
                                                    <tr>
                                                        <td colSpan="4" className="text-center py-4">
                                                            <p className="text-muted mb-0">No food items found in your shopping list.</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Selected Items */}
                                    <div className="mt-4">
                                        <h6 className="mb-3">
                                            <span className="badge bg-primary me-2">{selectedItems.length}</span>
                                            Selected Ingredients
                                        </h6>
                                        <div className="d-flex flex-wrap gap-2">
                                            <AnimatePresence>
                                                {/* FIXED: Updated badge implementation for more reliable selection handling */}
                                                {selectedItems.map((item, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="badge bg-light text-dark border"
                                                        style={{ 
                                                            padding: "8px 12px", 
                                                            borderRadius: "20px",
                                                            cursor: "pointer"
                                                        }}
                                                        onClick={() => handleCheckboxChange(item)}
                                                    >
                                                        {item}
                                                        <FaTimesCircle className="ms-2" size={12} />
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                            {selectedItems.length === 0 && (
                                                <p className="text-muted mb-0">No ingredients selected yet.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Error Messages */}
                                    <AnimatePresence>
                                        {ingredientError && (
                                            <motion.div
                                                className="alert alert-warning mt-3"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <FaTimesCircle className="me-2" />
                                                    Please select at least one ingredient to generate a recipe.
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Generate Button */}
                                    <div className="d-grid mt-4">
                                        <motion.button
                                            className="btn btn-primary btn-lg"
                                            onClick={generateRecipe}
                                            disabled={recipeLoading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            style={{ 
                                                backgroundImage: "linear-gradient(90deg, #4CAF50, #2196F3)",
                                                border: "none",
                                                borderRadius: "8px",
                                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" 
                                            }}
                                        >
                                            {recipeLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Generating Recipe...
                                                </>
                                            ) : (
                                                <>
                                                    <FaUtensils className="me-2" /> Generate Recipe
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Recipe Output Card */}
                        <div className="col-lg-6">
                            <motion.div 
                                className="card border-0 shadow-sm"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7 }}
                                style={{ borderRadius: "12px" }}
                            >
                                <div className="card-header bg-success text-white" style={{ borderRadius: "12px 12px 0 0" }}>
                                    <h5 className="mb-0">Your Recipe</h5>
                                </div>
                                <div className="card-body">
                                    {/* API Error */}
                                    <AnimatePresence>
                                        {recipeError && !ingredientError && (
                                            <motion.div
                                                className="alert alert-danger"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <strong>Error:</strong> {recipeError}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Loading Indicator */}
                                    <AnimatePresence>
                                        {recipeLoading && (
                                            <motion.div 
                                                className="text-center p-5"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <div className="spinner-border text-success mb-4" style={{ width: "3rem", height: "3rem" }} role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <h5>Preparing your recipe...</h5>
                                                <p className="text-muted">This may take a few moments</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Recipe Display */}
                                    <AnimatePresence>
                                        {recipe && !recipeLoading && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.5 }}
                                                className="recipe-container" 
                                                style={{ 
                                                    padding: "10px",
                                                    maxHeight: "70vh",
                                                    overflowY: "auto" 
                                                }}
                                            >
                                                <div 
                                                    dangerouslySetInnerHTML={{ __html: recipe }}
                                                    style={{
                                                        lineHeight: "1.8",
                                                        fontSize: "1.05rem",
                                                    }}
                                                    className="recipe-content"
                                                ></div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Empty State */}
                                    {!recipe && !recipeLoading && !recipeError && (
                                        <div className="text-center py-5">
                                            <FaUtensils size={50} className="text-muted mb-3" />
                                            <h5>No Recipe Generated Yet</h5>
                                            <p className="text-muted">
                                                Select ingredients from the list and click "Generate Recipe" to get started.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Recipes;