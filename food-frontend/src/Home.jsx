import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomePage.css"; // Custom CSS for styling
import { motion } from "framer-motion"; // Install using `npm install framer-motion`
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";

const Home = () => {
  return (
    <>
      <Header />
      <div className="homepage">
        <HeroSection />

        {/* Features Section */}
        <section id="features" className="features-section py-5">
          <div className="container text-center">
            <motion.h2
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Our Features
            </motion.h2>
            <div className="row">
              <motion.div
                className="col-md-3"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <i className="fas fa-user-shield feature-icon"></i>
                <h5>Admin</h5>
                <p>Manage platform content and user interactions effectively.</p>
              </motion.div>
              <motion.div
                className="col-md-3"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <i className="fas fa-donate feature-icon"></i>
                <h5>Food Donor</h5>
                <p>List surplus food and track your donations' impact.</p>
              </motion.div>
              <motion.div
                className="col-md-3"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <i className="fas fa-truck feature-icon"></i>
                <h5>Recipient Organization</h5>
                <p>Request food donations and manage logistics seamlessly.</p>
              </motion.div>
              <motion.div
                className="col-md-3"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <i className="fas fa-chart-line feature-icon"></i>
                <h5>Data Analyst</h5>
                <p>Analyze data to improve food waste management.</p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;