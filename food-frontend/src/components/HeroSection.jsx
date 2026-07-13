import React from 'react';

const HeroSection = () => {
  return (
    <section
      style={{
        backgroundImage: 'url(https://thefoodbeveragenews.com/wp-content/uploads/2021/11/Food-Waste-Management-1024x683.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center',
        padding: '100px 20px',
        color: 'white',
      }}
    >
      <h1 style={{ fontSize: '48px', marginBottom: '20px', color :"red" }}>
        {/* Food Waste Management System */}
        </h1>
      <p style={{ fontSize: '24px', marginBottom: '30px', color :"red" }}>
        {/* Let's create awareness to reduce food waste and save the environment. */}
      </p>
      <div className="buttons">
        <a href="/about" className="btn" style={buttonStyle}>
          Learn More
        </a>
        <a href="/signup" className="btn" style={buttonStyle}>
          Get Involved
        </a>
      </div>
    </section>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '18px',
  color: 'white',
  backgroundColor: '#4CAF50',
  border: 'none',
  borderRadius: '5px',
  textDecoration: 'none',
  margin: '0 10px',
};

export default HeroSection;
