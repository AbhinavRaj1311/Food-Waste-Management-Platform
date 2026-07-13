import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav style={{ backgroundColor: '#4CAF50', padding: '1em 0' }}>
      <ul style={{ listStyle: 'none', textAlign: 'center', margin: 0, padding: 0 }}>
        <li style={{ display: 'inline-block', margin: '0 15px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}>
            Home
          </Link>
        </li>
        <li style={{ display: 'inline-block', margin: '0 15px' }}>
          <Link to="/about" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}>
            About
          </Link>
        </li>
        <li style={{ display: 'inline-block', margin: '0 15px' }}>
          <Link to="/signup" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}>
            Sign Up
          </Link>
        </li>
        <li style={{ display: 'inline-block', margin: '0 15px' }}>
          <Link to="/login" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}>
            Login
          </Link>
        </li>
        
      </ul>
    </nav>
  );
};

export default Header;
